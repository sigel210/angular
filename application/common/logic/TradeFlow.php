<?php
namespace app\common\logic;

use app\common\logic\Base as BaseLogic;
use app\common\model\OrderContent;
use app\common\model\OrderReceived;
use app\finance\model\PayLog as PayLogModel;
use think\Db;

/**
 * Description of TradeFlow
 *
 * @author genghui
 */
class TradeFlow extends BaseLogic {
    
    /**
     * 财务中心-交易流水对账列表                             
     * @param array $arrWhere 查询条件
     * @return array
     */
    public function queryList($arrWhere = []) {
        $pay_log_model = new PayLogModel;
        $arrResult = $pay_log_model->alias('pl')
                    ->field(['pay_log_id, pl.order_received_id, pay_amount, pl.trade_no,pay_name, income_time, received_check_time, pl.order_received_id as received_status_id'])
                    ->leftJoin(['oms_order_received' => 'or'], 'pl.order_received_id=or.order_received_id')
                    ->where($arrWhere)
                    ->order('income_time DESC')
                    ->paginate()
                    ->toArray();

        $arrResult['data'] = $this->_processData($arrResult['data']);
        return parent::afterQuery($arrResult); 
    }
    
    /**
     * 处理交易流水对账数据
     * @param array $arrData
     * @return array
     */
    protected function _processData($arrData = []) {
        if (!empty($arrData)) {
            foreach ($arrData as &$item) {
                $item['pay_amount'] = sprintf_price($item['pay_amount']);
                $item['received_check_time'] = $item['received_check_time'] ? date('Y-m-d H:i:s', strtotime($item['received_check_time'])) : '-';
                $item['income_time'] = date('Y-m-d H:i:s', strtotime($item['income_time']));
                $verified_status = $this->_getReceivedStatus($item['received_status_id']);
                $item['received_status_id'] = $verified_status[1];
                $item['pay_received_status'] = $verified_status[0];
            }
        }
        return $arrData;
    }
    
    /**
     * 对账状态转换
     * @param int $iStatus 对账ID
     * @return array
     */
    protected function _getReceivedStatus($iStatus = 0) {
        $result = [];
        if ($iStatus > 0) {
            $result[] = '对账成功';
            $result[] = 2;
        } elseif ($iStatus == 0) {
            $result[] = '待对账';
            $result[] = 1;
        } else {
            $result[] = '对账失败';
            $result[] = 3;
        }
        return $result;
    }
    
    /**
     * 获得详情
     * @param int $iPayLogId 财务上传交易流水ID
     */
    public function getDetail($iPayLogId = 0) {
        $sub_query_user = Db::table('titan.titan_user')
            ->field(['user_id,nickname'])
            ->buildSql();
        $pay_log_model = new PayLogModel;
        $arrResult = $pay_log_model->alias('pl')
                ->field(['pay_log_id, order_received_no, pay_way as pay_way_id, pay_amount, pay_name, trade_no, income_time, received_remark, pay_account,customer_account, pl.order_received_id, '
                    . 'o.order_id, order_remarks, order_no, o.order_received_status as order_received_status_id, order_status as order_status_id, order_received_date, is_new, order_price, '
                    . 'total_received, u.nickname as sign_user, uu.nickname as belong_user, customer'])
                ->leftJoin(['oms_order_received' => 'or'], 'pl.order_received_id=or.order_received_id')
                ->leftJoin(['oms_order' => 'o'], 'or.order_id=o.order_id')
                ->leftJoin(['oms_customer' => 'c'], 'o.customer_id=c.customer_id')
                ->leftJoin([$sub_query_user => 'u'], 'o.order_sign_user_id=u.user_id')
                ->leftJoin([$sub_query_user => 'uu'], 'o.user_id=uu.user_id')
                ->where('pay_log_id', $iPayLogId)
                ->find()
                ->toArray();

        if (!empty($arrResult)) {
            $arrResult = $this->_afterQuery($arrResult);
        }
        return $arrResult;
    }
    
    /**
     * 查询之后的处理
     * @param array $arrData 查询列表
     * @return array
     */
    protected function _afterQuery(&$arrData = []) {
        $arrData['pay_received_status'] = $arrData['order_received_id'] > 0 ? '对账成功' : ($arrData['order_received_id'] == 0 ? '待对账' : '对账失败');
        $arrData['received_status_id'] = $arrData['order_received_id'] > 0 ? 2 : ($arrData['order_received_id'] == 0 ? 1 : 3);
        $arrData['pay_way'] = $arrData['pay_way_id'] == 1 ? '天网支付宝' : ($arrData['pay_way_id'] == 2 ? '天网银行卡' : ($arrData['pay_way_id'] == 3 ? '淘大培训支付宝' : '淘大培训银行卡'));
        $arrData['is_new'] = $arrData['is_new'] == 0 ? '新签' : '续签';
        $arrData['order_received_status'] = $arrData['order_received_status_id'] == 1 ? '对账成功' : '未对账';
        switch ($arrData['order_status_id']) {
            case 100:
                $arrData['order_status'] = '待执行';
                break;
            case 200:
                $arrData['order_status'] = '执行中';
                break;
            case 400:
                $arrData['order_status'] = '已完结';
                break;
            default:
                $arrData['order_status'] = '';
                break;
        }
        return $arrData;
    }
    
    /**
     * 删除交易流水记录
     * @param int $iPayLogId 交易流水ID
     * @return boolean
     */
    public function delete($iPayLogId = 0) {
        $result = PayLogModel::destroy($iPayLogId);
        return $result; 
    }

    /**
     * 下载报表
     * @param array $data
     * @throws \PhpOffice\PhpSpreadsheet\Exception
     * @throws \PhpOffice\PhpSpreadsheet\Writer\Exception
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function download($pay_way, $data = [])
    {
        $received_id_array = $_data = [];
        $pay_log_model = new PayLogModel;
        $result = $pay_log_model->alias('pl')
            ->field(['pay_log_id, pay_way, pl.order_received_id, pay_amount, pl.trade_no, income_time, pay_name, withdraw_time,
            received_check_time, customer_account, order_received_status as received_status'])
            ->leftJoin(['oms_order_received' => 'or'], 'pl.order_received_id=or.order_received_id')
            ->where($data)
            ->order('income_time DESC')
            ->select()
            ->toArray();
        if (in_array($pay_way['pay_way'], [1, 3])) {
            $_header = ['支付对账状态', '付款方式', '支付宝账号', '交易号', '进账日期', '付款名', '客户名称', '产品名称', '内容名称',
                '订单金额', '支付金额', '服务费', '广告费', '销售', '团队', '提现时间', '备注', '签约类型'];
            $fileName = '交易流水对账_淘大培训支付宝';
        } elseif (in_array($pay_way['pay_way'], [2, 4])) {
            $_header = ['支付对账状态', '付款方式', '银行卡号', '进账日期', '付款名', '客户名称', '产品名称', '内容名称',
                '订单金额', '支付金额', '服务费', '广告费', '销售', '团队', '提现时间', '备注', '签约类型'];
            $fileName = '交易流水对账_淘大培训银行卡';
        }

        if (!$result) {
            phpSpread_export_excel($fileName, $_header, [0 => ['received_status' => '']]);
        }

        foreach ($result as $v) {
            if ($v['order_received_id'] != 0) {
                $received_id_array[] = $v['order_received_id'];
            }
        }

        if ($received_id_array) {
            //支付信息
            $order_received_model = new OrderReceived();
            $received_res = $order_received_model->where('order_received_id', 'IN', $received_id_array)
                ->column('order_received_id, order_id, received_remark');

            $order_id_array = array_unique(array_column($received_res, 'order_id'));
            $order_model = new \app\common\model\Order();
            //订单/用户/部门信息
            $order_res = $order_model->alias('a')
                ->join('titan.titan_user', 'titan_user.user_id=a.user_id')
                ->join('titan.titan_department', 'titan_user.dept_id=titan_department.dept_id')
                ->join('oms_customer', 'oms_customer.customer_id=a.customer_id')
                ->where('order_id', 'IN', $order_id_array)
                ->column('a.order_id, a.customer_id, a.total_price, a.total_received, a.income_type, a.income_rate, 
                oms_customer.customer, titan_user.nickname, titan_department.dept_name, a.is_new');

            //内容/产品信息
            $content_model = new OrderContent();
            $content_product_res = $content_model->alias('c')
                ->join(['oms_content_price' => 'p'], 'c.execute_content_price_id=p.content_price_id')
                ->join(['oms_content' => 'oc'], 'p.content_id=oc.content_id')
                ->join(['oms_order_product' => 'op'], 'op.order_product_id=c.order_product_id')
                ->join(['oms_product' => 'pro'], 'pro.product_id=op.product_id')
                ->where('c.order_id', 'IN', $order_id_array)
                ->column('c.order_id, oc.content_name, pro.product_name');
        }

        foreach ($result as $k => $v) {
            $order_id = !empty($received_res[$v['order_received_id']]) ? $received_res[$v['order_received_id']]['order_id'] : 0;
            $_data[$k]['status'] = $v['order_received_id'] == 0 ? '待对账' : $v['order_received_id'] == '-1' ? '对账失败' : '对账成功'; //支付对账状态
            $_data[$k]['pay_way'] = str_replace(['1', '2', '3', '4'], ['天下网商支付宝', '天下网商银行卡', '淘大培训支付宝', '淘大培训银行卡'], $v['pay_way']); //付款方式
            $_data[$k]['pay_account'] = !empty($v['pay_account']) ? $v['pay_account'] : $v['customer_account']; //支付宝对应账号/银行卡号
            if (in_array($v['pay_way'], [1, 3])) {
                $_data[$k]['trade_no'] = $v['trade_no']; //支付宝交易号
            }
            $_data[$k]['income_time'] = $v['income_time']; //进账日期（财务支付日期）
            $_data[$k]['pay_name'] = $v['pay_name']; //付款名/支付人名称
            $_data[$k]['customer'] = !empty($order_res[$order_id]) ? $order_res[$order_id]['customer'] : ''; //客户名称
            $_data[$k]['product_name'] = !empty($content_product_res[$order_id]) ? $content_product_res[$order_id]['product_name'] : ''; //产品名称
            $_data[$k]['content_name'] = !empty($content_product_res[$order_id]) ? $content_product_res[$order_id]['content_name'] : ''; //内容名称
            $_data[$k]['total_price'] = !empty($order_res[$order_id]) ? sprintf_price($order_res[$order_id]['total_price']) : ''; //订单金额
            $_data[$k]['pay_amount'] = sprintf_price($v['pay_amount']); //支付金额
            $proportion = !empty($order_res[$order_id]['income_rate']) ? $order_res[$order_id]['income_rate'] : '';//比例
            if (!$proportion) {
                $_data[$k]['service_charge'] = ''; //服务费
                $_data[$k]['ad_rate'] = ''; //广告费
            }

            if (!empty($order_res[$order_id])) {
                if (in_array($order_res[$order_id]['income_type'], [5])) {
                    $proportion_number = explode(':', $proportion);
                    $service_charge = $_data[$k]['pay_amount'] * ($proportion_number[0] / 10);
                    $_data[$k]['service_charge'] = sprintf_price($service_charge); //服务费
                    $_data[$k]['ad_rate'] = sprintf_price($_data[$k]['pay_amount'] - $service_charge); //广告费
                } elseif (in_array($order_res[$order_id]['income_type'], [1, 4])) {
                    $service_charge = $_data[$k]['pay_amount'] * 1;
                    $_data[$k]['service_charge'] = sprintf_price($service_charge); //服务费
                    $_data[$k]['ad_rate'] = sprintf_price($_data[$k]['pay_amount'] - $service_charge); //广告费
                }
            } else {
                $_data[$k]['service_charge'] = ''; //服务费
                $_data[$k]['ad_rate'] = ''; //广告费
            }

            $_data[$k]['seller'] = !empty($order_res[$order_id]) ? $order_res[$order_id]['nickname'] : ''; //销售
            $_data[$k]['dept_name'] = !empty($order_res[$order_id]) ? $order_res[$order_id]['dept_name'] : ''; //团队
            $_data[$k]['withdraw_time'] = $v['withdraw_time']; //提现时间
            $_data[$k]['remarks'] = !empty($received_res[$v['order_received_id']]) ? $received_res[$v['order_received_id']]['received_remark'] : ''; //备注
            $_data[$k]['is_new'] = !empty($order_res[$order_id]) ? ($v['order_received_id'] != 0 ? ($order_res[$order_id]['is_new'] == 0 ? '新签' : '续签') : '') : '';
        }
        if (empty($_data)) {
            phpSpread_export_excel($fileName, $_header, [0 => ['received_status' => '']]);
        }
        phpSpread_export_excel($fileName, $_header, $_data);
    }
    
    /**
     * 更新交易流水信息
     * @param array $arrData
     * @return boolean
     */
    public function updateFlow(&$arrData = []) {
        $arrData['trade_no'] = $arrData['trade_no_1'];
        
        $pay_log_model = new PayLogModel;
        $result = $pay_log_model->allowField(true)->save($arrData, ['pay_log_id' => $arrData['pay_log_id']]);
        return $result; 
    }
}
