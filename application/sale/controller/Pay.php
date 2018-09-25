<?php
/**
 * 订单支付.
 * User: lcp
 * Date: 2018/8/6
 * Time: 9:58
 */

namespace app\sale\controller;

use app\common\controller\Base;
use app\sale\validate\OrderReceived as OrderReceivedValidate;

class Pay extends Base
{
    /**
     * 支付列表
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function index()
    {
        $post = input('post.');
        $post['user_id'] = $this->userId;
        $post['status_wait'] = self::ORDER_STATUS_EXECUTE_WAIT;

        //数据验证
        $this->_checkScene('order_id', $post);

        $payLogic = new \app\sale\logic\Pay();
        $result = $payLogic->getPayList($post);
        $this->rtnList($result);

    }

    /**
     * 支付详情
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function detail()
    {
        $post = input('post.');
        $post['user_id'] = $this->userId;
        $post['status_success'] = self::ORDER_RECEIVED_STATUS_SUCCESS;
        //数据验证
        $this->_checkScene('order_received_id', $post);

        $payLogic = new \app\sale\logic\Pay();
        $result = $payLogic->getPayDetail($post);
        $result['log'] = $this->getLogList($post['order_received_id'], [4, 5]);
        $this->rtnList($result);
    }

    /**
     * 产品信息
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function getProductInfo()
    {
        $post = input('post.');

        //数据验证
        $this->_checkScene('order_id', $post);

        $payLogic = new \app\sale\logic\Pay();
        $result = $payLogic->getProductInfoList($post);
        $this->rtnList($result);
    }

    /**
     * 验证是否能新建支付
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function checkBeforeInsert()
    {
        $post = input('post.');
        $post['user_id'] = $this->userId;
        $post['status_wait'] = self::ORDER_STATUS_EXECUTE_WAIT;

        //数据验证
        $this->_checkScene('order_id', $post);

        $payLogic = new \app\sale\logic\Pay();
        $result = $payLogic->checkPayBeforeInsert($post);
        if ($result[0] == false) {
            $this->rtnError($result[1]);
        }
        $this->rtnSuccess();
    }

    /**
     * 新建支付
     */
    public function insert()
    {
        $post = input('post.');
        $post['user_id'] = $this->userId;
        //数据验证
        if (in_array($post['received_pay_way'], [1, 2, 4])) {
            $this->_checkScene('add_pay', $post);
            if (1 == $post['received_pay_way']) {
                $this->_checkScene('received_trade_no', $post);
            } elseif (2 == $post['received_pay_way'] || 4 == $post['received_pay_way']) {
                if (isset($post['received_trade_no'])) {
                    unset($post['received_trade_no']);
                }
            }
        } elseif (3 == $post['received_pay_way']) {
            $this->_checkScene('taoda_add_alipay', $post);
            if (isset($post['received_pay_name'])) {
                unset($post['received_pay_name']);
            }
        }
        $payLogic = new \app\sale\logic\Pay();
        $result = $payLogic->insertPay($post);
        //操作日志
        $this->addLog($post['user_id'], 1, 4, $result);
        $this->rtnSuccess('新建支付成功');

    }

    /**
     * 验证是否能编辑支付
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function checkBeforeUpdate()
    {
        $post = input('post.');
        $post['user_id'] = $this->userId;
        $post['status_success'] = self::ORDER_RECEIVED_STATUS_SUCCESS;

        //数据验证
        $this->_checkScene('order_received_id', $post);

        $payLogic = new \app\sale\logic\Pay();
        $result = $payLogic->checkPayBeforeUpdate($post);
        if ($result[0] == false) {
            $this->rtnError($result[1]);
        }
        $this->rtnSuccess();
    }

    /**
     * 编辑支付
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function update()
    {
        $post = input('post.');
        $post['user_id'] = $this->userId;
        $post['status_success'] = self::ORDER_RECEIVED_STATUS_SUCCESS;

        //数据验证
        if (in_array($post['received_pay_way'], [1, 2, 4])) {
            $this->_checkScene('edit_pay', $post);
            if (1 == $post['received_pay_way']) {
                $this->_checkScene('received_trade_no', $post);
            } elseif (2 == $post['received_pay_way'] || 4 == $post['received_pay_way']) {
                if (isset($post['received_trade_no'])) {
                    unset($post['received_trade_no']);
                }
            }
        } elseif (3 == $post['received_pay_way']) {
            $this->_checkScene('taoda_edit_alipay', $post);
            if (isset($post['received_pay_name'])) {
                unset($post['received_pay_name']);
            }
        }

        $payLogic = new \app\sale\logic\Pay();
        $payLogic->updatePay($post);

        //操作日志
        $this->addLog($post['user_id'], 2, 4, $post['order_received_id']);
        $this->rtnSuccess();
    }

    /**
     * 验证是否能删除支付
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function checkBeforeDelete()
    {
        $post = input('post.');
        $post['user_id'] = $this->userId;
        $post['status_success'] = self::ORDER_RECEIVED_STATUS_SUCCESS;

        //数据验证
        $this->_checkScene('order_received_id', $post);

        $payLogic = new \app\sale\logic\Pay();
        $result = $payLogic->checkPayBeforeDelete($post);
        if ($result[0] == false) {
            $this->rtnError($result[1]);
        }
        $this->rtnSuccess();
    }

    /**
     * 删除支付
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function delete()
    {
        $post = input('post.');
        $post['user_id'] = $this->userId;
        $post['status_success'] = self::ORDER_RECEIVED_STATUS_SUCCESS;
        //数据验证
        $this->_checkScene('order_received_id', $post);

        $payLogic = new \app\sale\logic\Pay();
        $payLogic->deletePay($post);

        //操作日志
        $this->addLog($post['user_id'], 3, 4, $post['order_received_id']);
        $this->rtnSuccess('支付删除成功');
    }

    /**
     * 验证是否能对账
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function checkBeforeVerify()
    {
        $post = input('post.');
        $post['status_success'] = self::ORDER_RECEIVED_STATUS_SUCCESS;
        //数据验证
        $this->_checkScene('order_received_id', $post);

        $payLogic = new \app\sale\logic\Pay();
        $result = $payLogic->checkPayBeforeVerify($post);
        if ($result[0] == false) {
            $this->rtnError($result[1]);
        }
        $this->rtnSuccess();
    }

    /**
     * 支付对账
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function verify()
    {
        $post = input('post.');
        $post['user_id'] = $this->userId;
        $post['status_success'] = self::ORDER_RECEIVED_STATUS_SUCCESS;
        $post['status_failed'] = self::ORDER_RECEIVED_STATUS_FAILED;
        //数据验证
        $this->_checkScene('order_received_id', $post);

        $payLogic = new \app\sale\logic\Pay();
        list($result, $msg) = $payLogic->verifyPay($post);
        if (!empty($msg)) {
            //操作日志
            $this->addLog($post['user_id'], 2, 5, $post['order_received_id']);
            $this->rtnError('对账失败', 0, $result);
        }
        //操作日志
        $this->addLog($post['user_id'], 1, 5, $post['order_received_id']);
        $this->rtnSuccess('对账成功');
    }

    /**
     * 数据校验
     * @param $scenes
     * @param $data
     */
    private function _checkScene($scenes, $data)
    {
        //验证数据
        $orderPayValidate = new OrderReceivedValidate();
        if (!$orderPayValidate->scene($scenes)->check($data)) {
            $this->rtnError($orderPayValidate->getError());
        }
    }
}