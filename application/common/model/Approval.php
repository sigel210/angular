<?php
/**
 * Created by PhpStorm.
 * User: lcp
 * Date: 2018/8/7
 * Time: 15:52
 */

namespace app\common\model;

use app\common\model\Base;

class Approval extends Base
{
    const APPROVAL_TYPE_QUALIFICATION = 1;    // 资格审批
    const APPROVAL_TYPE_BREAK         = 3;    // 违约退款
    const APPROVAL_TYPE_DEPOSIT       = 4;    // 暂存款退款
    const APPROVAL_STATUS_AGREE       = 200;  // 审批完成(同意)
    const APPROVAL_STATUS_WAIT        = 100;  // 待审批
    const APPROVAL_STATUS_REFUSE      = 300;  // 审批完成(拒绝)
    
    
    protected $table = 'oms_approval';
    protected $pk = 'approval_id';
    protected $autoWriteTimestamp = 'datetime';
    protected $createTime = 'approval_apply_time';
    protected $updateTime = false;

    /**
     * 获取暂存款已退款的金额
     * @param $orderId
     * @return float
     */
    public function getRefundAmount($orderId)
    {
        //todo
        // 计算已退暂存款金额  4：暂存款退款   200-审批完成(已退款)
        return $this->alias('a')
            ->join('oms_approval_refund', 'a.approval_id=oms_approval_refund.approval_id')
            ->where(['a.order_id' => $orderId, 'approval_type' => self::APPROVAL_TYPE_DEPOSIT, 'approval_status' => self::APPROVAL_STATUS_AGREE])
            ->sum('oms_approval_refund.refund_amount');
    }
    
    /**
     * 获取违约退款已退款的总金额
     * @param int $iOrderId 订单ID
     * @return float
     */
    public function getBreakRefundAmount($iOrderId) {
        //todo
        // 计算已退暂存款金额  3：违约退款   200-审批完成(已退款)
        return $this->alias('a')
            ->join(['oms_approval_refund' => 'ar'], 'a.approval_id=ar.approval_id')
            ->where(['a.order_id' => $iOrderId, 'a.approval_type' => self::APPROVAL_TYPE_BREAK, 'a.approval_status' => self::APPROVAL_STATUS_AGREE])
            ->sum('ar.refund_amount');
//            ->select();
    }
    
    protected function getApprovalTypeAttr($value) {
        $status_text = [1 => '执行资格', 3 => '违约退款', 4 => '暂存款退款'];
        return $status_text[$value];
    }

}