<?php
/**
 * 操作记录
 * User: lcp
 * Date: 2018/8/3
 * Time: 15:11
 */

namespace app\common\model;

use think\Db;

class OperateLog extends Base
{
    // 直接使用配置参数名
    protected $table = 'oms_operate_log';
    protected $pk = 'operate_id';

    /**
     * 添加操作记录
     * @param int $operateUid 操作人
     * @param int $operateType 操作类型
     * @param int $type 日志类型
     * @param int $primaryValue 相关ID
     * @param string $msg 提示信息
     * @return array|bool
     */
    public function addLog($operateUid, $operateType, $type, $primaryValue, $msg = '')
    {
        $data['operate_uid'] = $operateUid;     //操作人
        $data['primary_value'] = $primaryValue;   //相关ID
        $data['operate_type'] = $operateType;    //操作类型
        $data['type'] = $type;           //日志类型
        $data['data'] = $msg;            //信息
        $data['create_time'] = date('Y-m-d H:i:s', time());
        $OperateLog = new \app\common\validate\OperateLog();
        if (!$OperateLog->scene('add_log')->check($data)) {
            return $OperateLog->getError();
        }
        if ($this->allowField(true)->save($data) === false) {
            return false;
        }
        return true;
    }

    /**
     * 获取操作记录
     * @param int $primaryValue 相关ID
     * @param array $type 日志类型
     * @return array|\PDOStatement|string|\think\Collection
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function getLog($primaryValue, $type = [])
    {
        $where[] = ['primary_value', '=', $primaryValue];
        if (!empty($type)) {
            $where[] = ['type', 'in', $type];
        }
        return Db::table('titan.titan_user')->field('titan_user.nickname as account,
        oms_operate_log.data as operate_description, oms_operate_log.create_time')
            ->join('oms_operate_log', 'titan_user.user_id=oms_operate_log.operate_uid')
            ->where($where)
            ->order('oms_operate_log.create_time DESC')
            ->select();
    }
}