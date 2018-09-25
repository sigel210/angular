<?php
/**
 * Created by PhpStorm.
 * User: lcp
 * Date: 2018/8/7
 * Time: 20:19
 */

namespace app\finance\validate;

use think\Validate;

class PayLog extends Validate
{
    protected $rule = [
        'type' => 'require|in:1,2,3,4',
    ];
    protected $message = [
        'type.require' => '模版类型不能为空',
        'type.in' => '模版类型错误',
    ];
    protected $scene = [
        'type' => ['type'],
    ];
}