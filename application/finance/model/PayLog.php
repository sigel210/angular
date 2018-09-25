<?php
/**
 * Created by PhpStorm.
 * User: lcp
 * Date: 2018/8/7
 * Time: 10:43
 */

namespace app\finance\model;

use app\common\model\Base;

class PayLog extends Base
{
    // 直接使用配置参数名
    protected $table = 'oms_pay_log';
    protected $pk = 'pay_log_id';

    /**
     * 数据是否已存在
     * @param $data
     * @return array|string
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function checkExist($data)
    {
        $where[] = ['md5_key', 'in', $data];
        return $this->field('md5_key')->where($where)->select()->toArray();
    }

    /**
     * 批量添加excel表格数据
     * @param $data
     * @return bool
     * @throws \Exception
     */
    public function addData($data)
    {
        if ($this->allowField(true)->saveAll($data) === false) {
            return false;
        }
        return true;
    }

    /**
     * 支付方式 支付宝
     * @param $data
     * @return array|string
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function aliPayList($data)
    {
        $where['pay_way'] = $data['received_pay_way'];
        $where['trade_no'] = $data['received_trade_no'];
        $where['order_received_id'] = [-1, 0];
        $result = $this->where($where)->order('pay_log_id DESC')->find();
        if (!$result) {
            return '';
        }
        return $result->toArray();
    }

    /**
     * 支付方式 银行卡
     * @param $data
     * @return array|string
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function bank($data)
    {
        $where['pay_way'] = $data['received_pay_way'];
        $where['pay_name'] = $data['received_pay_name'];
        if (isset($data['order_received_price'])) {
            $where['pay_amount'] = $data['order_received_price'];
        }
        $where['order_received_id'] = [-1, 0];
        $result = $this->where($where)->order('pay_log_id DESC')->find();
        if (!$result) {
            return '';
        }
        return $result->toArray();
    }

    /**
     * 对账成功,写入支付ID
     * @param $orderReceivedId
     * @param $payLogIid
     * @return bool
     */
    public function verifySuccess($orderReceivedId, $payLogIid)
    {
        if ($this->allowField(['order_received_id'])->save(['order_received_id' => $orderReceivedId], ['pay_log_id' => $payLogIid]) === false) {
            return false;
        }
        return true;
    }

}