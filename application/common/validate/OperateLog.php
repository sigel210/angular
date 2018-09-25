<?php
/**
 * Created by PhpStorm.
 * User: lcp
 * Date: 2018/8/3
 * Time: 15:11
 */

namespace app\common\validate;


use think\Validate;

class OperateLog extends Validate
{
    protected $rule = [
        'operate_uid' => 'require',
        'operate_type' => 'require',
        'type' => 'require|integer',
        'primary_value' => 'require',
        //'data' => 'require',
        'create_time' => 'require',
    ];
    protected $message = [
        'operate_uid.require' => '操作人不能为空',
        'operate_type.require' => '操作类型不能为空',
        'type.require' => '日志类型不能为空',
        'primary_value.require' => '相关ID不能为空',
        //'data.require' => '操作内容不能为空',
    ];
    protected $scene = [
        'add_log' => ['operate_uid', 'operate_type', 'type', 'primary_value', 'data'],
        'get_log' => ['primary_value'],
    ];
}