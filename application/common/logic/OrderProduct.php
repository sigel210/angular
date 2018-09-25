<?php

namespace app\common\logic;

use app\common\logic\Base as BaseLogic;
use app\common\model\OrderProduct as OrderProductModel;
use app\common\model\OrderContent as OrderContentModel;

class OrderProduct extends BaseLogic {
    
    public function getProductContentList($iOrderId = 0) {
        $order_product_model = new OrderProductModel;
        $order_content_model = new OrderContentModel;
        
        //订单产品列表
        $arrResult = $order_product_model
            ->alias('op')
            ->field(['op.order_id, op.order_product_id, p.product_name, op.order_product_status, op.order_product_price, p.product_category_id, p.product_remarks'])
            ->leftJoin (['oms_product' => 'p'], 'p.product_id=op.product_id')
            ->where('op.order_id',$iOrderId)
            ->order('order_product_id ASC')
            ->select()
            ->toArray();
        
        //格式化产品类型
        $this->_disposeProductArray($arrResult);
        foreach ($arrResult as $value) {
            $arrProductId[] = $value['order_product_id'];
        }
        
        //订单内容列表
        $arrContentResult = $order_content_model
            ->alias('oc')
            ->field(['oc.order_product_id, oc.order_content_no, oc.order_content_status, oc.order_content_refund_status, c.content_name, c.content_category_id, cp.content_price'])
            ->leftJoin (['oms_content_price' => 'cp'], 'oc.content_price_id = cp.content_price_id ')
            ->leftJoin (['oms_content' => 'c'], 'c.content_id=cp.content_id')
            ->where('oc.order_product_id','in',$arrProductId)
            ->order('oc.order_content_id ASC')
            ->select()
            ->toArray();
        
        //格式化内容类型
        $this->_disposeContentArray($arrContentResult);
        foreach ($arrContentResult as $key=>$value) {
            $arrContentList[$value['order_product_id']][] = $value;
        }
        
        foreach ($arrResult as &$value) {
            $value['order_content_list'] = $arrContentList[$value['order_product_id']];
        }

        return $arrResult;
    }
    
    private function _disposeProductArray(&$products) {
        $handle = \app\common\model\Product::getInstance();
        $category = $handle->getProductCategory();
        foreach ($products as &$val) {
            $return = $handle->getCascadeCategory($category, $val['product_category_id']);
            $columns = array_column($return, 'product_category_name');
            $val['product_category_name'] = implode('-', $columns);
        }
    }
    
    private function _disposeContentArray(&$contents) {
        $handle = \app\common\model\Content::getInstance();
        $category = $handle->getContentCategory();
        foreach ($contents as &$val) {
            $return = $handle->getCascadeCategory($category, $val['content_category_id']);
            $columns = array_column($return, 'content_category_name');
            $val['content_category_name'] = implode('-', $columns);
        }
    }
}