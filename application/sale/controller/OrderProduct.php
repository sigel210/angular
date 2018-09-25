<?php

namespace app\sale\controller;

use app\common\controller\Base;
use think\facade\Request;
use app\common\logic\OrderProduct as OrderProductLogic;
use app\sale\logic\ProductCategory as ProductCategoryLogic;
use app\sale\model\ProductCategory;
use app\sale\model\Product;
use app\sale\logic\ProductContentPrice;
use think\Db;


class OrderProduct extends Base {
    
    public function initialize() {
        $this->OrderProductLogic = new OrderProductLogic;
        parent::initialize();
    }
    
    /**
     * 订单产品列表
     */
    public function orderProductList() {
        
        $order_id  = Request::param('order_id', 0, 'intval');
        $arrorderProductList = $this->OrderProductLogic->getProductContentList($order_id);
        return $this->rtnList($arrorderProductList);
    }
    
}

