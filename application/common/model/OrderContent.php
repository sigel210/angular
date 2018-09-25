<?php

namespace app\common\model;

use app\common\model\Base;

class OrderContent extends Base {
    protected $table = 'oms_order_content';
    protected $pk    = 'order_content_id';
    protected $autoWriteTimestamp = 'datetime';
    protected $updateTime = false;
    protected $insert = ['order_content_no'];
    
    
    public function setOrderContentNoAttr() {
        return 'DDNR' . date('YmdHis') . generate_code();
    }
    
    /**
     * 关联到订单
     */
    public function relationToOrder() {
        return $this->belongsTo('Order', 'order_id');
    }
    
    /**
     * 关联到订单产品
     */
    public function relationToOrderProduct() {
        return $this->belongsTo('OrderProduct', 'order_product_id');
    }
    
    /**
     * 定义订单内容状态获取器
     * @param int $value
     * @return string
     */
    public function getOrderContentStatusAttr($value) {
        $status_text = [0 => '待审核', 100 => '待执行', 200 => '执行中', 400 => '已完结'];
        return $status_text[$value];
    }

    /**
     * 定义订单内容退款状态获取器
     * @param int $value
     * @return string
     */
    public function getOrderContentRefundStatusAttr($value) {
        $status_text = [0 => '-', 1 => '退款中', 2 => '已退款', 3 => '已拒绝'];
        return $status_text[$value];
    }
    
}
