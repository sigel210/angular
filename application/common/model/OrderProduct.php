<?php

namespace app\common\model;

use app\common\model\Base;

class OrderProduct extends Base {
    protected $table = 'oms_order_product';
    protected $pk    = 'order_product_id';
    protected $autoWriteTimestamp = 'datetime';
    protected $updateTime = false;
    protected $auto = [];
    
    /**
     * 关联到订单
     */
    public function relationToOrder() {
        return $this->belongsTo('Order', 'order_id');
    }
    
    /**
     * 关联到订单内容
     */
    public function orderContentList() {
        return $this->hasMany('OrderContent', 'order_product_id');
    }
    
    /**
     * 定义订单内容状态获取器
     * @param int $value
     * @return string
     */
    public function getOrderProductStatusAttr($value) {
        $status_text = [0 => '待审核', 100 => '待执行', 200 => '执行中', 400 => '已完结'];
        return $status_text[$value];
    }

}
