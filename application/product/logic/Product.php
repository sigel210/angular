<?php

/**
 * 产品逻辑层
 * 
 * @author  dzt
 * @create  2018-08-08 
 */
namespace app\product\logic;

use app\common\logic\Base;
use app\product\model\Product as ProductModel;
use app\common\model\Product as ProductCommonModel;
use app\common\model\OperateLog;
use app\common\model\ProductContentPrice;
use think\Db;


class Product extends Base
{
	/**
	 * 列表
	 */
    public function getList()
    {
        $productLogic = new \app\common\logic\Product();
        $result = $productLogic->getProductList();
    	return $result;
    }
    
    public function getDetail($pid)
    {
        $handle = ProductCommonModel::getInstance();
        $category = $handle->getProductCategory('all');
        $productId = $pid;
        $product_info = $handle->getProductDetail($productId);
        $cascade = $handle->getCascadeCategory($category, $product_info['product_category_id']);
        $product_info['product_categorys'] = array_column($cascade, 'product_category_name');
//         list($product_info['first_product_category'], $product_info['second_product_category']) = array_column($cascade, 'product_category_name');
        $contentInfo = $this->getProductContent($productId);
        $mOperateLog = new OperateLog();
        $operateLog = $mOperateLog->getLog($productId, 2);
        return ['product_info'=>$product_info, 'content_info'=>$contentInfo, 'operate_log'=>$operateLog];
    }
    
    /**
     * 获取产品内容
     * @param unknown $pid
     */
    public function getProductContent($pid)
    {
        $cate = [];
        $mContentCommon = \app\common\model\Content::getInstance();
        $category = $mContentCommon->getContentCategory('all');
        $handle = new ProductContentPrice();
        $contentInfo = $handle->getProductContentList($pid);
        foreach ($contentInfo as &$val) {
            if (!isset($cate[$val['content_category_id']])) {
                $cate[$val['content_category_id']] = array_column(
                    $mContentCommon->getCascadeCategory($category, $val['content_category_id']), 'content_category_name'
                );
            }
            $val['content_categorys'] = $cate[$val['content_category_id']];
//             list($val['first_content_category'], $val['second_content_category'], $val['third_content_category']) = $cate[$val['content_category_id']];
            $val['content_category'] = implode('-', $cate[$val['content_category_id']]);
        }
        return $contentInfo;
    }
    
    public function editProduct($params)
    {
        return (new \app\common\logic\Product())->editProduct($params);
    }
    
    public function deleteProduct($pid)
    {
        return (new \app\common\logic\Product())->deleteProduct($pid);
    }
}