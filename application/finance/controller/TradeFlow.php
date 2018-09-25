<?php
namespace app\finance\controller;

use app\common\controller\Base;
use think\facade\Request;
use app\common\logic\TradeFlow as TradeFlowLogic;
use app\finance\model\PayLog;

/**
 * 交易流水对账管理
 *
 * @author genghui
 */
class TradeFlow extends Base {
    protected $tradeFlowLogic = NULL;

    public function initialize() {
        parent::initialize();
        $this->tradeFlowLogic = new TradeFlowLogic;
    }
    
    protected function _where(&$arrWhere) {
        $pay_way = Request::param('pay_way', -1, 'intval');                                                        //支付方式
        $validate_data['received_status'] = $received_status = Request::param('received_status', 0, 'intval');     //支付对账状态
        $validate_data['trade_no'] = $trade_no = Request::param('trade_no');                                       //交易号
        $validate_data['pay_name'] = $pay_name = Request::param('pay_name');                                       //付款人，银行卡有该字段
        $received_income_start = Request::param('received_income_start');                                          //支付起始日期
        $received_income_end   = Request::param('received_income_end');                                            //支付结束日期
        $received_verify_start = Request::param('received_verify_start');                                          //对账起始日期
        $received_verify_end   = Request::param('received_verify_end');                                            //对账结束日期
        

        //校验搜索参数
        $validate_ret = $this->validate($validate_data, 'app\finance\validate\TradeFlow.search');
        //验证数据
        if ($validate_ret !== true) {
            $this->rtnError($validate_ret);
        }
        
        if ($pay_way > 0) {
            $arrWhere[] = ['pl.pay_way', '=', $pay_way];
        }
        if ($trade_no) {
            $arrWhere[] = ['pl.trade_no', 'like', "%{$trade_no}%"];
        }
        if ($pay_name) {
            $arrWhere[] = ['pl.pay_name', 'like', "%{$pay_name}%"];
        }
        if ($received_status == 1) { //待对账
            $arrWhere[] = ['pl.order_received_id', '=', 0];
        } elseif ($received_status == 2) { // 对账成功
            $arrWhere[] = ['pl.order_received_id', '>', 0];
        } elseif($received_status == 3) { // 对账失败
            $arrWhere[] = ['pl.order_received_id', '=', -1];
        }
        
        if ($received_income_start) {
            $arrWhere[][] = ['pl.income_time', '>=', $received_income_start];
        }
        if ($received_income_end) {
            $arrWhere[][] = ['pl.income_time', '<=', $received_income_end];
        }
        
        if ($received_verify_start) {
            $arrWhere[][] = ['or.received_check_time', '>=', $received_verify_start];
        }
        if ($received_verify_end) {
            $arrWhere[][] = ['or.received_check_time', '<=', $received_verify_end];
        }

    }

    /**
     * 业务中心订单列表
     */
    public function index() {
        parent::index();
        $arrTradeFlowList = $this->tradeFlowLogic->queryList($this->arrWhere);

        $this->rtnList($arrTradeFlowList);
    }
    
    /**
     * 详情
     */
    public function detail() {
        $pay_log_id = $this->request->param('pay_log_id');
        
        $flow_info = $this->tradeFlowLogic->getDetail($pay_log_id);
        list($button['delete']) = $this->checkBeforeDelete(TRUE);
        list($button['update']) = $this->checkBeforeUpdate(TRUE);
        $flow_info['button'] = $button;
        
        $this->rtnList($flow_info);
    }

    public function checkBeforeUpdate($iRtnFlag = FALSE) {
        list($iRst, $strMsg) = $this->_checkBeforeDelete();
        if ($iRtnFlag) {
            return [$iRst, $strMsg];
        } else {
            if ($iRst) {
                $this->rtnSuccess('操作成功');
            } else {
                $this->rtnError($strMsg);
            }
        }
    }
    
    /**
     * 编辑
     */
    public function update() {
        $data['pay_log_id'] = $pay_log_id = $this->request->param('pay_log_id', 0, 'intval');
        $data['pay_amount'] = $pay_amount = $this->request->param('pay_amount');
        $data['trade_no_1'] = $trade_no = $this->request->param('trade_no');
        $data['income_time'] = $income_time = $this->request->param('income_time');
        $data['pay_name'] = $pay_name = $this->request->param('pay_name');
        
        // 前置检查
        list($iRst, $strMsg) = $this->_checkBeforeDelete();
        if (!$iRst) {
            $this->rtnError($strMsg);
        }
        
        //验证数据
        $pay_way_id = PayLog::where('pay_log_id', $pay_log_id)->value('pay_way');
        if ($pay_way_id == 3) { // 淘大支付宝
            $validate_ret = $this->validate($data, 'app\finance\validate\TradeFlow.update_taoda_alipay');
        } elseif ($pay_way_id == 4) { // 淘大银行卡
            $validate_ret = $this->validate($data, 'app\finance\validate\TradeFlow.update_taoda_bank');
        } else {
            $this->rtnError('参数错误');
        }
        if ($validate_ret !== true) {
            $this->rtnError($validate_ret);
        }
        
        $update_ret = $this->tradeFlowLogic->updateFlow($data);
        if (!$update_ret) {
            $this->rtnError('编辑失败');
        }
        $this->rtnSuccess('编辑成功');
    }
    
    /**
     * 删除订单前置检查
     * @param boolean $iRtnFlag 是否返回信息
     * @return mixed
     */
    public function checkBeforeDelete($iRtnFlag = FALSE) {
        list($iRst, $strMsg) = $this->_checkBeforeDelete();
        if ($iRtnFlag) {
            return [$iRst, $strMsg];
        } else {
            if ($iRst) {
                $this->rtnSuccess('操作成功');
            } else {
                $this->rtnError($strMsg);
            }
        }
    }
    
    protected function _checkBeforeDelete() {
        $pay_log_id = $this->request->param('pay_log_id');
        
        // 已完成对账的交易流水记录不能删除、编辑
        $received_id = PayLog::where('pay_log_id', $pay_log_id)->value('order_received_id');
        if ($received_id > 0) {
            return [FALSE, '该支付已完成对账'];
        }
        
        return [TRUE, ''];
    }
    
    /**
     * 删除
     */
    public function delete() {
        $validate_data['pay_log_id'] = $pay_log_id = $this->request->param('pay_log_id', 0, 'intval');
        
        // 验证参数
        $validate_ret = $this->validate($validate_data, 'app\finance\validate\TradeFlow.delete');
        if ($validate_ret !== true) {
            $this->rtnError($validate_ret);
        }
        
        // 前置检查
        list($iRst, $strMsg) = $this->_checkBeforeDelete();
        if (!$iRst) {
            $this->rtnError($strMsg);
        }
        
        \think\Db::startTrans();
        try {
            $ret = $this->tradeFlowLogic->delete($pay_log_id);
            \think\Db::commit();
        } catch (Exception $e) {
            \think\Db::rollback();
            $this->rtnError($e->getMessage());
        }

        $this->rtnSuccess('删除成功');
    }


    /**
     * 下载报表
     */
    public function download()
    {
        $pay_way = input('');
        //验证数据
        $tradeFlowValidate = new \app\finance\validate\TradeFlow();
        if (!$tradeFlowValidate->scene('pay_way')->check($pay_way)) {
            $this->rtnError($tradeFlowValidate->getError());
        }
        parent::index();
        $result = $this->tradeFlowLogic->download($pay_way, $this->arrWhere);
        $this->rtnList($result);
    }
    
}
