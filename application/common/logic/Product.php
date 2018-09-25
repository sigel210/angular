<?php
/**
 * 操作记录
 * @author: dzt
 * @create: 2018/8/7
 */

namespace app\common\logic;

use app\common\logic\Base as BaseLogic;
use app\common\model\Product as ProductModel;
use app\common\model\Content;
use app\common\model\ContentPrice;
use app\common\model\ProductContentPrice;
use think\Db;

class Product extends BaseLogic
{
    const PRODUCT_STATUS_NEVER = 1;
    const PRODUCT_STATUS_OPEN  = 2;
    const PRODUCT_STATUS_CLOSE = 3;
    
    private $_productStatus = [
        self::PRODUCT_STATUS_NEVER    =>  '未打单',
        self::PRODUCT_STATUS_OPEN     =>  '打单中',
        self::PRODUCT_STATUS_CLOSE    =>  '打单关闭'
    ];
    
    /**
     * 新增产品
     */
    public function insert($userId, $params)
    {
        Db::startTrans();
        try {
            $product = ProductModel::create($params);
            foreach ($params['contents'] as &$val) {
                if (!isset($val['content_price_id'])) {
                    //无内容价格则进行新增
                    $contentPrice = ContentPrice::create($val);
                    $val['content_price_id'] = $contentPrice->content_price_id;
                    $val['product_id'] = $product->product_id;
                }
            }
            //循环新增产品内容价格数据
            (new ProductContentPrice)->allowField(true)->saveAll($params['contents']);
            (new \app\common\controller\Base())->addLog($userId, 1, 2, $product->product_id);
            //打单状态流转
            $this->singleStatusCirculate($product->product_id, $params['product_status']);
            Db::commit();
            return TRUE;
        } catch (\Exception $e) {
            Db::rollback();
            return $e->getMessage();
        }
    }
    
    /**
     * 编辑产品信息
     */
    public function editProduct($params)
    {
        Db::startTrans();
        try {
            //1.产品表更新
            ProductModel::update($params);
            //2.内容价格表更新判断
            $callback = function(&$val, $key, $pid) {
                $val['product_id'] = $pid;
            };
            $mProductContentPrice = new  ProductContentPrice();
            $cons = $mProductContentPrice->where(['product_id'=>$params['product_id']])->column('product_content_price_id');//print_r($rs);print_r($rs1);die;
            array_walk($params['contents'], $callback, $params['product_id']);
            $new = $old = [];//新/老数据--根据product_content_price_id字段判断
            foreach ($params['contents'] as $value) {
                if (!array_key_exists('product_content_price_id', $value)) {
                    $new[] = $value;
                    continue;
                }
                $old[] = $value;
            }
            $new = (new ContentPrice())->saveAll($new)->toArray();//content_price表新增
    
            //3.产品内容价格表更新
            $mProductContentPrice->batchUpdateProductContentPrice(array_merge($old, $new));//新老数据更新
            
            //删除多余关系数据
            $diff = array_values(array_diff($cons, array_column($old, 'product_content_price_id')));
            if (count($diff)) {
                $mProductContentPrice->destroy($diff);
            }
            Db::commit();
            return TRUE;
        } catch (\Exception $e) {
            Db::rollback();
            return $e->getMessage();
        }
    }
    
    /**
     * 删除产品
     * @return boolean
     */
    public function deleteProduct($pid)
    {
        Db::startTrans();
        try {
            $product = ProductModel::get($pid, 'productContentPrice');
            $product->together('productContentPrice')->delete();
            Db::commit();
            return TRUE;
        } catch (\Exception $e) {
            Db::rollback();
            return $e->getMessage();
        }
    }
    
    public function getProductList()
    {
        $where = [];
        $productName = input('product_name');
        $startTime = input('start_time');
        $endtTime = input('end_time');
        $productStatus = input('product_status');
        if (!empty($productName)) {
            $productName = str_replace('%', '\\%', $productName);
            $where[] = ['product_name', 'like', "%$productName%"];
        }
        if (!empty($startTime)) {
            $where[] = ['create_time', '>=', $startTime];
        }
        if (!empty($endtTime)) {
            $where[] = ['create_time', '<=', $endtTime];
        }
        if (!empty($productStatus)) {
            $where[] = ['product_status', '=', $productStatus];
        }
        $model = new ProductModel();
        $result = $this->afterQuery($model->getProductList($where));
        $this->_disposeProductArray($result['data']);
        return $result;
    }
    
    public function optStatus($pid, $pStatus)
    {
        Db::startTrans();
        try {
            $mProduct = new ProductModel();
            //更新产品状态
            $mProduct->updateProductStatus($pid, $pStatus);
            $this->singleStatusCirculate($pid, $pStatus);
            //检测更新内容状态
            Db::commit();
            return TRUE;
        } catch (\Exception $e) {
            Db::rollback();
            return $e->getMessage();
        }
    }
    
    /**
     * 根据产品状态执行具体操作
     */
    protected function singleStatusCirculate($pid, $pStatus)
    {
        switch ($pStatus) {
            case self::PRODUCT_STATUS_OPEN:
                $this->openContentStatus($pid);
                break;
            case self::PRODUCT_STATUS_CLOSE:
                $this->closeContentStatus($pid);
                break;
        }
    }
    
    public function openContentStatus($pid)
    {
        $conList = ProductContentPrice::where(['product_id'=>$pid])->column('content_id');
        Content::where(['content_id' => $conList])->update(['content_status'=>self::PRODUCT_STATUS_OPEN]);//内容状态更新
    }
    
    public function closeContentStatus($pid)
    {
        //该产品下所有的内容
        $conList = ProductContentPrice::where(['product_id'=>$pid])->column('content_id');
        //↑内容中存在关联产品有打单中的内容
        $casList = Db::table('oms_product_content_price a')->where([
            ['b.product_status', 'eq', self::PRODUCT_STATUS_OPEN], 
            ['a.content_id', 'in', $conList], 
            ['a.product_id', 'in', function($query) use ($conList){
                $query->table('oms_product_content_price')->where('content_id', 'in', $conList)->field('product_id');
            }]
        ])->join('oms_product b', 'a.product_id=b.product_id')->column('distinct(a.content_id)');
        $diff = array_diff($conList, $casList);
        if (count($diff)) {
            Content::where(['content_id' => $diff])->update(['content_status'=>self::PRODUCT_STATUS_CLOSE]);//内容状态更新
        }
    }

    /**
     * 处理产品列表数组
     */
    private function _disposeProductArray(&$products)
    {
        $handle = \app\common\model\Product::getInstance();
        $category = $handle->getProductCategory('all');
        foreach ($products as &$val) {
            $return = $handle->getCascadeCategory($category, $val['product_category_id']);
            $val['product_categorys'] = array_column($return, 'product_category_name');
//             list($val['first_product_category'], $val['second_product_category']) = array_column($return, 'product_category_name');
        }
    }
}