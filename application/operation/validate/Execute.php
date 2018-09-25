<?php
/**
 * Created by PhpStorm.
 * User: lcp
 * Date: 2018/8/8
 * Time: 15:54
 */

namespace app\operation\validate;

use think\Validate;

class Execute extends Validate
{
    protected $rule = [
        'content_name' => 'max:20',
    ];
    protected $message = [
        'content_name.max' => '执行内容名称不能超过20个字符',
    ];
    protected $scene = [
        'get_list' => ['content_name'],
    ];
}