<?php
/**
 * Created by PhpStorm.
 * User: lcp
 * Date: 2018/8/6
 * Time: 10:06
 */

namespace app\common\model;

use think\Db;

class OrderReceived extends Base
{
    // 直接使用配置参数名
    protected $table = 'oms_order_received';
    protected $pk = 'order_received_id';

    /**
     * 获取支付列表信息
     * @param $data
     * @return array|\PDOStatement|string|\think\Collection
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function getPayLists($data)
    {
        $where['order_id'] = $data['order_id'];
        return $this->where($where)->field('order_received_id, order_received_price,date(received_pay_date) as received_pay_date,
        order_received_status, order_received_status as received_status')
            ->order('order_received_id DESC')
            ->select()
            ->toArray();
    }

    /**
     * 获取支付详情信息
     * @param $data
     * @return array|null|\PDOStatement|string|Model
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function getPayDetail($data)
    {
        $where['order_received_id'] = $data['order_received_id'];
        $payData = $this->where($where)->find();
        $financeData = Db::table('oms_pay_log')->field('date(income_time) as received_pay_dates')->where($where)->find();
        if (!$financeData) {
            $financeData['received_pay_dates'] = '-';
        }

        if (!$payData) {
            return '';
        }
        $payData = $payData->toArray();
        $results = array_merge($payData, $financeData);
        return $results;
    }

    /**
     * 订单支付到账对账状态
     * @param $value
     * @return mixed
     */
    public function getOrderReceivedStatusAttr($value)
    {
        $order_received_status = [1 => '待对账', 2 => '对账成功', 3 => '对账失败'];
        return $order_received_status[$value];
    }

    /**
     * 获取产品信息
     * @param $data
     * @return array|\PDOStatement|string|\think\Collection
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function getProductInfoLists($data)
    {
        $where['oms_order.order_id'] = $data['order_id'];
        return Db::table('oms_order')->field('ROUND(oms_order.order_price, 2) AS total_price,oms_product.product_name')
            ->leftJoin('oms_order_product', 'oms_order.order_id=oms_order_product.order_id')
            ->leftJoin('oms_product', 'oms_product.product_id=oms_order_product.product_id')
            ->where($where)
            ->select();
    }

    /**
     * 获取订单信息
     * @param $data
     * @return array|null|\PDOStatement|string|Model
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function getOrder($data)
    {
        $where['order_id'] = $data['order_id'];
        $where['user_id'] = $data['user_id'];
        return Db::table('oms_order')->where($where)->find();
    }

    /**
     * 新建支付信息
     * @param $data
     * @return $this|bool
     */
    public function insertPay($data)
    {
        $data['create_time'] = format_time();
        $data['order_received_no'] = $this->_setPayNo();
        if ($this->allowField(true)->save($data) === false) {
            return false;
        }
        return true;
    }

    /**
     * 设置支付编号
     * @return string
     */
    protected function _setPayNo()
    {
        return 'ZF' . date('YmdHis') . generate_code();
    }

    /**
     * 获取支付信息
     * @param $data
     * @return array|null|\PDOStatement|string|Model
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function getOrderReceived($data)
    {
        $where['order_received_id'] = $data['order_received_id'];
        $where['user_id'] = $data['user_id'];
        $result = $this->field('oms_order_received.*,order_received_status as received_status')->where($where)->find();
        if (!$result) {
            return '';
        }
        return $result->toArray();
    }

    /**
     * 编辑支付信息
     * @param $data
     * @return $this|bool
     */
    public function updatePay($data)
    {
        if ($this->allowField(['order_received_price', 'received_pay_name', 'received_pay_date', 'received_remark', 'received_trade_no'])
                ->save($data, $data['order_received_id']) === false) {
            return false;
        }
        return true;
    }

    /**
     * 删除支付信息
     * @param $data
     * @return $this|bool
     */
    public function deletePay($data)
    {
        if ($this->allowField(true)->destroy($data['order_received_id']) === false) {
            return false;
        }
        return true;
    }

    /**
     * 获取支付信息和订单信息
     * @param $data
     * @return array|null|\PDOStatement|string|Model
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function getPayReceived($data)
    {
        $where['order_received_id'] = $data['order_received_id'];
        $result = $this->field('oms_order_received.*,oms_order.*,oms_order_received.order_received_status as received_status')
            ->join('oms_order', 'oms_order_received.order_id=oms_order.order_id')->where($where)->find();
        if (!$result) {
            return '';
        }
        return $result->toArray();
    }

    /**
     * 获取未对账/对账失败的支付信息
     * @param $data
     * @return array|string
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function verifyPay($data)
    {
        $where['order_received_id'] = $data['order_received_id'];
        $where['oms_order_received.user_id'] = $data['user_id'];
        $where['oms_order_received.order_received_status'] = [1, 3];

        $result = $this->field('oms_order.order_id,oms_order_received.*, DATE_FORMAT(oms_order_received.received_pay_date,"%Y-%m-%d") as pay_date')
            ->join('oms_order', 'oms_order_received.order_id=oms_order.order_id')
            ->where($where)
            ->find();
        if (!$result) {
            return '';
        }
        return $result->toArray();
    }

    /**
     * 对账后的操作 修改对账状态和时间
     * @param $orderReceivedStatus
     * @return bool
     */
    public function verifyUpdate($orderReceivedStatus)
    {
        if ($this->allowField(true)->save($orderReceivedStatus, $orderReceivedStatus['order_received_id']) === false) {
            return false;
        }
        return true;
    }

    /**
     * 对账成功时同步订单信息
     * @param array $arrOrder
     * @param $iReceivedId
     * @return array
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function syncOrderInfo($arrOrder = [], $iReceivedId)
    {
        $result = [];
        $orderModel = new Order();
        //当前支付信息
        $current_received_info = $this->field('order_received_price')
            ->where(['order_received_id' => intval($iReceivedId['order_received_id']), 'order_received_status' => 2])->find();//deposit_price

        if (intval($arrOrder['sale_type']) == 1) {
            $arrReceivedInfo = $this->field('SUM(order_received_price) as total_received,MAX(received_pay_date) as last_income_time')
                ->join('oms_pay_log', 'oms_pay_log.order_received_id=oms_order_received.order_received_id')
                ->where(['order_id' => intval($arrOrder['order_id']), 'order_received_status' => 2])->find();

            $result['last_income_time'] = $arrReceivedInfo['last_income_time'];
            //支付金额应支付一笔同步一笔
            $result['total_received'] = $arrReceivedInfo['total_received'];

            // 判断订单对账状态
            if (floatval($arrReceivedInfo['total_received']) >= floatval($arrOrder['total_price'])) {
                $result['received_status'] = 1;
                // 订单对账成功 修改暂存款退款字段
                $result['temp_deposit_price'] = $orderModel->calculateTempRefund(intval($arrOrder['order_id']), floatval($current_received_info['order_received_price']));
            }
        }
        /*elseif(intval($arrOrder['sale_type']) == 2) {
            //支付总额不包含押金
            $total_received_2          = 0.00;
            //尾款 计入支付总额
            $retainage_sum_amount_info = $this->field("SUM(price) as total_received,MAX(income_time) as last_income_time")->join('crm_pay_log USING (received_id)')->where(['order_id' => intval($arrOrder['order_id']),'status' => 2,'pay_type' => 3])->find();
            if(!empty($retainage_sum_amount_info['total_received'])) {
                $total_received_2 += $retainage_sum_amount_info['total_received'];
            }

            //预付款 + 押金
            $pre_pay_deposit_info = $this->field("SUM(price) as total_received_1,SUM(deposit_price) as total_deposit_received_1,MAX(income_time) as last_income_time")->join('crm_pay_log USING (received_id)')->where(['order_id' => intval($arrOrder['order_id']),'status' => 2,'pay_type' => 6])->find();

            //预付款总额
            $pre_pay_sum_amount_info = $this->field("SUM(price) as total_received,MAX(income_time) as last_income_time")->join('crm_pay_log USING (received_id)')->where(['order_id' => intval($arrOrder['order_id']),'status' => 2,'pay_type' => 5])->find();

            //押金总额
            $deposit_sum_amount_info = $this->field("SUM(deposit_price) as total_deposit_received,MAX(income_time) as last_income_time")->join('crm_pay_log USING (received_id)')->where(['order_id' => intval($arrOrder['order_id']),'status' => 2,'pay_type' => 4])->find();

            //判断预付款对账状态
            $total_received_2 += ($pre_pay_sum_amount_info['total_received'] + $pre_pay_deposit_info['total_received_1']);
            if(($pre_pay_sum_amount_info['total_received'] + $pre_pay_deposit_info['total_received_1']) >= $arrOrder['down_payment']) {
                $result['down_payment_status'] = 1;

                // 对账成功 修改暂存款退款字段
                $result['temp_deposit_price'] = $objOrder->calculateTempRefund(intval($arrOrder['order_id']), $current_received_info['price']);
            }
            //判断押金对账状态
            if(($deposit_sum_amount_info['total_deposit_received'] + $pre_pay_deposit_info['total_deposit_received_1']) >= $arrOrder['deposit_price']) {
                $result['deposit_price_status'] = 1;

                // 对账成功 修改暂存款退款字段
                $result['temp_deposit_price'] = $objOrder->calculateTempRefund(intval($arrOrder['order_id']), $current_received_info['price']);
            }

            // 最后付款时间
            $last_income_time_arr = [$pre_pay_deposit_info['last_income_time'],$pre_pay_sum_amount_info['last_income_time'],$deposit_sum_amount_info['last_income_time'],$retainage_sum_amount_info['last_income_time']];
            usort($last_income_time_arr,[__CLASS__,"cmpPayLastIncomeTime"]);

            $result['last_income_time'] = $last_income_time_arr[0];
            $result['total_received']   = $total_received_2;
        }*/
        return $result;
    }

    /**
     * 定义到订单的关联
     */
    public function relationToOrder()
    {
        return $this->belongsTo('Order');
    }
}