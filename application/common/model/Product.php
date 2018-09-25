<?php
/**
 * 内容处理模型
 * @create  2018-08-03
 * @author  dzt
 */
namespace app\common\model;
use app\common\model\Base;

class Product extends Base
{
    
    private static $instance = null;
    
    protected $pk = 'product_id';
    
    protected $field = true;

    public static function getInstance()
    {
        if(!self::$instance instanceof self){
            self::$instance=new self();
        }
        return self::$instance;
    }
    
    //关联内容
    public function content()
    {
        return $this->hasOne('Content');
    }

    //关联产品内容价格
    public function productContentPrice()
    {
        return $this->hasMany('ProductContentPrice', 'product_id');
    }
    
    /**
     * 获取内容类型
     */
    public function getProductCategory($range=null)
    {
        $where = $range=='all' ? [] : ['is_forbit'=>0];
        return $this->table('oms_product_category')->where($where)->order('product_category_level desc')->select()->toArray();
    }
    
    /**
     * 获取内容类型树
     * @param int $tid      树节点
     */
    public function getCategoryTree($tid = null)
    {
        $data = $this->getproductCategory();
        $result = $list = [];
        foreach ($data as $val) {
            $arr = [
                'product_category_id'   =>  $val['product_category_id'],
                'product_category_name' =>  $val['product_category_name'],
                'junior_category'       =>  isset($list[$val['product_category_id']]) ? $list[$val['product_category_id']] : []
            ];
            $list[$val['parent_id']][] = $arr;
            if ($val['product_category_level'] == 1) {
                $arr['junior_category'] = $list[$val['product_category_id']];
                $result[] = $arr;
            }
        }
        return $result;
    }
    
    /**
     * 获取产品具体信息
     * @param   cid   内容id
     */
    public function getProductDetail($pid)
    {
        return $this->table('oms_product')->where('product_id=' . $pid)->find()->toArray();
    }
    
    /**
     * 获取级联关系
     * @param array $category   产品类型列表
     * @param int $cid  最底层类型id
     */
    public function getCascadeCategory($category, $pid)
    {
        $result = [];
        $list = array_column($category, null, 'product_category_id');
        while ($pid != 0) {
            $cur = $list[$pid];
            array_unshift($result, $cur);
            $pid = $cur['parent_id'];
        }
        return $result;
    }
    
    /**
     * 查询产品列表
     * @param array $where
     */
    public function getProductList($where)
    {
        return $this->where($where)->field('product_id,product_name,product_category_id,product_price,product_status,product_remarks,create_time')->order('create_time desc')->paginate()->toArray();
    }
    
    public function updateProductStatus($pid, $status)
    {
        return $this->where('product_id='.$pid)->update(['product_status'=>$status]);
    }
}