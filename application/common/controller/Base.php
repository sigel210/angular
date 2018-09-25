<?php

namespace app\common\controller;

use think\Response;
use think\Controller;
use app\common\model\OperateLog;
use think\exception\HttpResponseException;
use think\facade\Cache;

class Base extends Controller {
    //订单状态：0-待审核，100-待执行，200-执行中，400-已完结
    const ORDER_STATUS_APPROVAL_WAIT = 0;
    const ORDER_STATUS_EXECUTE_WAIT  = 100;
    const ORDER_STATUS_EXECUTE_ING   = 200;
    const ORDER_STATUS_FINISHED      = 400;
    
    //支付对账状态
    const ORDER_RECEIVED_STATUS_WAIT    = 1;
    const ORDER_RECEIVED_STATUS_SUCCESS = 2;
    const ORDER_RECEIVED_STATUS_FAILED  = 3;
    
    protected $userId     = 0;    //用户ID
    protected $deptId     = 0;    //部门ID
    protected $roleCode   = [];   //权限节点
    protected $arrRoleIds = [];   //当前用户拥有角色ID数组
    protected $arrWhere   = [];   //查询条件

    /**
     * 初始化
     */
    public function initialize() {
        parent::initialize();
        $this->_checkLogin();
        $strToken = $this->request->server('HTTP_TOKEN', '');
        $arrCacheData   = Cache::get($strToken);
        $this->userId   = $arrCacheData['user_id'];
        $this->deptId   = $arrCacheData['department_id'];
        $this->roleCode = $arrCacheData['role_code'];
    }

    /**
     * 操作成功时的跳转方法
     * @param string $strMsg 成功提示信息
     * @param int $iCode 状态码
     * @param array $arrData 要返回的数据
     * @return void
     */
    public function rtnSuccess($strMsg = '操作成功', $iCode = 1, $arrData = [], $type = 'json') {
        parent::result($arrData, $iCode, $strMsg, $type);
    }

    /**
     * 操作失败时的跳转方法
     * @param string $strMsg 失败提示信息
     * @param int $iCode 状态码
     * @param array $arrData 要返回的数据
     * @return void
     */
    public function rtnError($strMsg = '操作失败', $iCode = 0, $arrData = [], $type = 'json') {
        parent::result($arrData, $iCode, $strMsg, $type);
    }

    /**
     * 返回列表
     * @param array $arrData 返回数据
     * @param string $type 返回数据类型
     * @return void
     */
    public function rtnList($arrData = [], $type = 'json') {
        $arrReturn = ['code' => 1, 'msg' => ''];
        if (array_key_exists('data', $arrData)) {
            $ret = array_merge($arrReturn, $arrData);
        } else {
            $ret = $arrReturn;
            $ret['data'] = $arrData;
        }

        $this->_result($ret, 1, '操作成功', $type);
    }

    private function _result($data, $code = 0, $msg = '', $type = '', array $header = []) {
        $result = $data;
        $result['msg']  = $msg;
        $result['code'] = $code;
        
        $type = $type ?: parent::getResponseType();
        $response = Response::create($result, $type)->header($header);
        throw new HttpResponseException($response);
    }

    /**
     * 查询的必要前置操作
     */
    protected function _beforeCondition()
    {
        if (method_exists($this, '_where')) {
            $this->_where($this->arrWhere);
        }
    }
    
    /**
     * 数据传入验证
     * @param Validate $validate    验证器
     * @param unknown $scene        验证场景
     * @param unknown $data         验证数据
     */
    protected function _beforeValidate(\think\Validate $validate, $scene, $data=null)
    {
        if (empty($data)) {
            $data = input();
        }
        if (!$validate->scene($scene)->check($data)) {
            $this->rtnError($validate->getError());
        }
    }

    /**
     * 添加操作记录
     * @param int $operateUid 操作人
     * @param int $operateType 操作类型
     * @param int $type 日志类型
     * @param int $primaryValue 相关ID
     * @return mixed
     */
    public function addLog($operateUid, $operateType, $type, $primaryValue)
    {
        $data = ['operate_uid' => $operateUid, 'operate_type' => $operateType, 'type' => $type, 'primary_value' => $primaryValue];
        //验证数据
        $operateLog = new \app\common\validate\OperateLog();
        if (!$operateLog->scene('add_log')->check($data)) {
            $this->rtnError($operateLog->getError());
        }

        if ($type && $operateType) {
            list($ret, $Info) = $this->_checkLogType($type, $operateType);
            if ($ret === FALSE) {
                return $Info;
            }
        }

        $operateLogModel = new OperateLog();
        $operateLogModel->addLog($operateUid, $operateType, $type, $primaryValue, $Info);
    }

    /**
     * 检测操作内容是否存在
     * @param int $type 日志类型
     * @param int $OperateType 操作类型
     * @return array
     */
    protected function _checkLogType($type, $OperateType)
    {

        $arrType = config('app.set_log_type');

        if (!empty($arrType[$type])) {
            return !empty($arrType[$type][$OperateType]) ? [TRUE, $arrType[$type][$OperateType]] : [FALSE, '没有相关操作记录,请联系相关技术人员!!!'];
        } else {
            return [FALSE, '没有相关日志操作,请联系相关技术人员!!!'];
        }

    }

    /**
     * 获取操作记录
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function getLogList($primaryValue, $type = [])
    {
        $operateLog = new \app\common\validate\OperateLog();
        if (!$operateLog->scene('get_log')->check(['primary_value' => $primaryValue])) {
            return $operateLog->getError();
        }
        $operateLogModel = new OperateLog();
        return $operateLogModel->getLog($primaryValue, $type);
    }
    
    /**
     * 列表查询接口
     * 做where条件的调用
     */
    public function index() {
        $this->_beforeCondition();
    }
    
    /**
     * 检查是否登录
     * @return type
     */
    protected function _checkLogin() {
        $strToken = $this->request->server('HTTP_TOKEN', '');
        $arrCacheData = Cache::get($strToken);
        if (empty($arrCacheData)) {
            return json()->code(401);
        }
    }

}
