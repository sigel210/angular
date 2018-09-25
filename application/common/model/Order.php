<?php

namespace app\common\model;

use app\common\model\Base;

class Order extends Base {
    protected static $instance = NULL;
    protected $table    = 'oms_order';
    protected $pk       = 'order_id';
    protected $autoWriteTimestamp = 'datetime';
    protected $insert = ['order_no'];

    public static function getInstance() {
        if (is_null(static::$instance)) {
            static::$instance = new static;
        }
        return static::$instance;
    }
    
    /**
     * 关联到黑曼客户
     * @return type
     */
    public function relationToCustomer() {
        return $this->belongsTo('Customer', 'customer_id')->bind('customer');
    }
    
    /**
     * 关联到支付
     * @return type
     */
    public function relationToOrderReceived() {
        return $this->hasMany('OrderReceived');
    }
    
    /**
     * 关联到订单产品
     */
    public function product() {
        return $this->hasMany('OrderProduct', 'order_id');
    }

    /**
     * 支付对账 更新订单信息
     * @param $data
     * @return bool
     */
    public function updateOrder($data)
    {
        if ($this->allowField(true)->save($data, $data['order_id']) === false) {
            return false;
        }
        return true;
    }

    /**
     * 计算暂存款退款
     * @param int $order_id 订单ID
     * @param float $order_received 对账成功后的支付金额
     * @return float 暂存款退款
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function calculateTempRefund($order_id = 0, $order_received = 0.0)
    {
        if (empty($order_id)) {
            return false;
        }

        // 暂存款退款 = 支付总额 -  原订单金额 - 已退暂存款总额
        // 订单金额 = 原订单金额 - 违约已退款内容金额总和
        // 支付总额 = 支付金额 * N(不包括押金)
        // 每次对账成功时计算，若小于0，则置为0
        $order_info = $this->field('total_received, total_price')->where(['order_id' => $order_id])->find();

        // 计算已退暂存款金额
        $approvalModel = new Approval();
        $temp_refund_price = $approvalModel->getRefundAmount($order_id);

        if (empty($temp_refund_price)) {
            $temp_refund_price = 0.00;
        }
        return $this->_calcTempRefund($order_info['total_received'], $order_received, $order_info['total_price'], $temp_refund_price);
    }

    /**
     * 计算暂存款
     * @param float $totalReceived 支付金额
     * @param float $orderReceived 对账成功后的支付金额
     * @param float $totalPrice 订单金额
     * @param float $tempRefundPrice 已退暂存款金额
     * @return float
     */
    protected function _calcTempRefund($totalReceived, $orderReceived, $totalPrice, $tempRefundPrice)
    {
        $ret = $totalReceived + $orderReceived - $totalPrice - $tempRefundPrice;
        if ($ret < 0.000) {
            $ret = 0.000;
        }
        return round($ret, 2);
    }
    
    public function setOrderNoAttr() {
        return 'DD' . date('YmdHis') . generate_code();
    }
    
    /**
     * 获得订单状态
     * @param int $iOrder 订单ID
     */
    public function getOrderStatus($iOrder=0) {
        return $this->where('order_id', $iOrder)->value('order_status');
    }
    
    public function getOrderReceivedStatusAttr($value) {
        $status_text = [1 => '对账成功', 2 => '未对账'];
        return $status_text[$value];
    }
    
    public function getOrderStatusAttr($value) {
        $status_text = [100 => '待执行', 200 => '执行中', 400 => '已完结'];
        return $status_text[$value];
    }
    
    public function getIncomeTypeAttr($value) {
        $status_text     = [1 => '服务类', 2 => '杂志类', 4 => '广告类'];
        $income_type_arr = split_num_to_pow($value);
        $result          = [];
        foreach ($income_type_arr as $v) {
            $result[] = $status_text[$v];
        }
        return implode('+', $result);
    }
    
    public function getOrderSignTypeAttr($value) {
        $status_text = [1 => '个人签约', 2 => '企业签约'];
        return $status_text[$value];
    }
    
}
