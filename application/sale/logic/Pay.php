<?php
/**
 * Created by PhpStorm.
 * User: lcp
 * Date: 2018/8/6
 * Time: 11:49
 */

namespace app\sale\logic;

use app\common\logic\Base;
use app\common\model\Order;
use app\common\model\OrderReceived;
use app\finance\model\PayLog;
use app\sale\validate\OrderReceived as OrderReceivedValidate;
use think\Db;

class Pay extends Base
{
    /**
     * 获取支付列表
     * @param $data
     * @return mixed
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function getPayList($data)
    {
        //获取产品信息
        $orderModel = new OrderReceived();
        $dataList = $orderModel->getPayLists($data);
        //新建支付按钮亮暗
        list($arrButton['insert']) = $this->_checkBeforeInsert($data);

        $result['list'] = $dataList;
        $result['button'] = $arrButton;
        return $result;
    }

    /**
     * 检测是否可以新建支付
     * @param $data
     * @return array|null|\PDOStatement|string|\think\Model
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function checkPayBeforeInsert($data)
    {
        //获取支付信息
        return $this->_checkBeforeInsert($data);
    }

    /**
     * 支付信息是否可以新建
     * @param $data
     * @return array
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    private function _checkBeforeInsert($data)
    {
        //获取订单信息
        $orderModel = new OrderReceived();
        $dataList = $orderModel->getOrder($data);
        if (!$dataList) {
            return [FALSE, '订单不存在'];
        }

        if ($data['status_wait'] != $dataList['order_status']) {
            return [FALSE, '订单状态不为待执行'];
        }
        return [TRUE, ''];
    }

    /**
     * 获取支付详情
     * @param $data
     * @return \app\common\model\Model|array|null|\PDOStatement|string
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function getPayDetail($data)
    {
        //获取产品信息
        $orderModel = new OrderReceived();
        $dataList = $orderModel->getPayDetail($data);

        list($arrButton['received_update']) = $this->_checkBeforeUpdate($data);
        list($arrButton['received_delete']) = $this->_checkBeforeDelete($data);
        list($arrButton['received_verify']) = $this->_checkBeforeVerify($data);
        $dataList['button'] = $arrButton;
        return $dataList;
    }

    /**
     * 获取产品信息列表
     * @param $data
     * @return mixed
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function getProductInfoList($data)
    {
        //获取产品信息
        $orderModel = new OrderReceived();
        $dataList = $orderModel->getProductInfoLists($data);
        $result['total_price'] = !empty($dataList) ? array_sum(array_unique(array_column($dataList, 'total_price'))) : '';
        $result['product_name'] = !empty($dataList) ? array_unique(array_column($dataList, 'product_name')) : [];
        return $result;
    }

    /**
     * 新建支付
     * @param $data
     * @return string
     */
    public function insertPay($data)
    {
        //添加
        $orderReceived = new OrderReceived();
        $orderReceived->insertPay($data);
        return $orderReceived->order_received_id;
    }

    /**
     * 检测是否可以编辑支付
     * @param $data
     * @return array|null|\PDOStatement|string|\think\Model
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function checkPayBeforeUpdate($data)
    {
        //获取支付信息
        return $this->_checkBeforeUpdate($data);
    }

    /**
     * 编辑支付
     * @param $data
     * @return $this|bool|mixed
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function updatePay($data)
    {
        list($rst, $msg) = $this->_checkBeforeUpdate($data);
        if (!$rst) {
            return $msg;
        }

        //编辑
        $orderReceived = new OrderReceived();
        return $orderReceived->updatePay($data);
    }

    /**
     * 支付信息是否可以编辑
     * @param $data
     * @return array
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    private function _checkBeforeUpdate($data)
    {
        $orderModel = new OrderReceived();
        $dataList = $orderModel->getOrderReceived($data);
        if (empty($dataList)) {
            return [FALSE, '非法支付信息'];
        } elseif ($data['status_success'] == $dataList['received_status']) {
            return [FALSE, '支付对账成功，不可编辑'];
        }
        return [TRUE, ''];
    }

    /**
     * 检测是否可以删除支付
     * @param $data
     * @return array|null|\PDOStatement|string|\think\Model
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function checkPayBeforeDelete($data)
    {
        //获取支付信息
        return $this->_checkBeforeDelete($data);
    }

    /**
     * 删除支付
     * @param $data
     * @return mixed
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function deletePay($data)
    {
        list($rst, $msg) = $this->_checkBeforeDelete($data);
        if (!$rst) {
            return $msg;
        }
        //删除
        $orderReceived = new OrderReceived();
        return $orderReceived->deletePay($data);
    }

    /**
     * 支付信息是否可以删除
     * @param $data
     * @return array
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    private function _checkBeforeDelete($data)
    {
        $orderModel = new OrderReceived();
        $dataList = $orderModel->getOrderReceived($data);
        if (empty($dataList)) {
            return [FALSE, '非法支付信息'];
        } elseif ($data['status_success'] == $dataList['received_status']) {
            return [FALSE, '支付对账成功，不可删除'];
        }
        return [TRUE, ''];
    }

    /**
     * 检测是否可以对账
     * @param $data
     * @return array
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function checkPayBeforeVerify($data)
    {
        //获取支付信息
        return $this->_checkBeforeVerify($data);
    }

    /**
     * 对账
     * @param $data
     * @return mixed
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function verifyPay($data)
    {
        list($rst, $msg) = $this->_checkBeforeVerify($data);
        if (!$rst) {
            return $msg;
        }

//        Db::startTrans();
        $arrMsg = $checkError = [];
        //对账
        $orderReceived = new OrderReceived();
        $received = $orderReceived->verifyPay($data);
        $payLog = new PayLog();
        //1-天下网商支付宝  3-淘大培训支付宝  2-天下网商银行卡  4-淘大培训银行卡
        if ($received && (intval($received['received_pay_way']) == 1 || (intval($received['received_pay_way']) == 3))) {
            $payInfo = $payLog->aliPayList($received);
            if (!$payInfo) {
                $arrMsg['received_trade_no'] = FALSE;
            } else {
                //付款金额
                if ($payInfo['pay_amount'] != ($received['order_received_price'])) {
                    $arrMsg['order_received_price'] = FALSE;
                }

                //交易号
                if ($payInfo['trade_no'] != $received['received_trade_no']) {
                    $arrMsg['received_trade_no'] = FALSE;
                }

                //天下网商支付宝需要验证付款人
                if (intval($received['received_pay_way']) == 1) {
                    //付款人
                    if ($payInfo['pay_name'] != $received['received_pay_name']) {
                        $arrMsg['received_pay_name'] = FALSE;
                    }
                }
            }
        } elseif ($received && (intval($received['received_pay_way']) == 2 || (intval($received['received_pay_way']) == 4))) {
            $payInfo = $payLog->bank($received);
            //数据不存在,验证付款人和金额
            if (!$payInfo) {
                $dat['received_pay_way'] = $received['received_pay_way'];
                $dat['received_pay_name'] = $received['received_pay_name'];
                $payName = $payLog->bank($dat);
                if (!$payName) {
                    $arrMsg['received_pay_name'] = FALSE;
                }
            }
            //上面验证没有错误,在验证支付时间
            if (empty($arrMsg)) {
                $dat['received_pay_way'] = $received['received_pay_way'];
                $dat['received_pay_name'] = $received['received_pay_name'];
                $verifyDate = $payLog->bank($dat);
                //到账日期:pay_date 与 支付日期：income_time 年月日对不上，则审批不成功，只要有一个对上，就是审批成功
                if ($verifyDate) {
                    if ($verifyDate['pay_amount'] != $received['order_received_price']) {
                        $arrMsg['order_received_price'] = FALSE;
                    } elseif ($received['received_pay_date'] != $verifyDate['income_time']) {
                        $arrMsg['received_pay_date'] = FALSE;
                    }
                } else {
                    $arrMsg['received_pay_date'] = FALSE;
                }
            }
        } else {
            return [FALSE, '操作失败'];
        }
        //更新pay_log和order_received的信息
        if (empty($arrMsg)) {
            // 对账成功
            $payLog->verifySuccess($received['order_received_id'], $payInfo['pay_log_id']);
            $orderReceivedStatus['order_received_id'] = $received['order_received_id'];
            $orderReceivedStatus['order_received_status'] = $data['status_success'];
            $orderReceivedStatus['received_check_time'] = format_time();
            $orderReceived->verifyUpdate($orderReceivedStatus);
        } else {

            if (!isset($payInfo['pay_log_id'])) {
                //没有在财务那里对账上传
            } else {
                // 对账失败
                $payLog->verifySuccess(-1, $payInfo['pay_log_id']);   // 对账失败时，将order_received_id字段更新为-1
            }

            $checkError[$received['order_received_id']] = $arrMsg;
            $orderReceivedStatus['order_received_id'] = $received['order_received_id'];
            $orderReceivedStatus['order_received_status'] = $data['status_failed'];
            $orderReceivedStatus['received_check_time'] = format_time();
            $orderReceived->verifyUpdate($orderReceivedStatus);
        }
        //同步信息到订单表
        $this->_syncOrder($received, $received);
//        Db::commit();
        return $this->_results($received, $checkError);
    }

    /**
     * 支付信息是否可以对账
     * @param $data
     * @return array
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    private function _checkBeforeVerify($data)
    {
        $orderModel = new OrderReceived();
        $dataList = $orderModel->getPayReceived($data);
        if (empty($dataList)) {
            return [FALSE, '非法支付信息'];
        } elseif ($data['status_success'] == $dataList['received_status']) {
            return [FALSE, '已对账成功，无需重复对账'];
        } /*elseif($dataList['total_price'] == '0.00') {
            return [FALSE, '订单金额错误'];
        }*/
        return [TRUE, ''];
    }

    /**
     * 同步信息到订单表
     * 最新到账金额、到账时间、对账状态
     * @param $orderId
     * @param $receivedId
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    protected function _syncOrder($orderId, $receivedId)
    {
        $orderReceived = new OrderReceived();
        $order = $orderReceived->getOrder($orderId);
        $ret = $orderReceived->syncOrderInfo($order, $receivedId);
        $data['order_id'] = $orderId['order_id'];
        $data['total_received'] = !empty($ret['total_received']) ? $ret['total_received'] : 0.00;
        $data['temp_deposit_price'] = !empty($ret['temp_deposit_price']) ? $ret['temp_deposit_price'] : 0.00;
        $data['order_received_status'] = !empty($ret['received_status']) ? $ret['received_status'] : 2;
        /*$data['down_payment_status'] = !empty($ret['down_payment_status']) ? $ret['down_payment_status'] : 0;
        $data['deposit_price_status'] = !empty($ret['deposit_price_status']) ? $ret['deposit_price_status'] : 0;*/
        $data['last_income_time'] = !empty($ret['last_income_time']) ? $ret['last_income_time'] : '0000-00-00 00:00:00';
        $orderModel = new Order();
        $orderModel->updateOrder($data);
    }

    /**
     * 返回最后的对账信息
     * @param $data
     * @param array $checkError
     * @return array
     */
    protected function _results($data, $checkError = [])
    {
        $rst = [];
        //如果为赊销-押金支付，对账失败时，弹框中展示的金额应为deposit_price
        /*if (intval($data['received_pay_type']) == 4) {
            $data['price'] = $data['deposit_price'];
        }*/

        foreach ($data as $k => $v) {
            $rst[$k]['value'] = $v;
            $rst[$k]['result'] = isset($checkError[$data['order_received_id']][$k]) ? $checkError[$data['order_received_id']][$k] : true;
        }
        return [$rst, $checkError];
    }

    /**
     * 数据校验
     * @param $scenes
     * @param $data
     * @return array
     */
    private function _checkScene($scenes, $data)
    {
        //验证数据
        $orderPayValidate = new OrderReceivedValidate();
        if (!$orderPayValidate->scene($scenes)->check($data)) {
            return $orderPayValidate->getError();
        }
    }
}