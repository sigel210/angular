<?php
/**
 * Created by PhpStorm.
 * User: lcp
 * Date: 2018/8/6
 * Time: 8:56
 */

namespace app\commonality\validate;

use think\Validate;

class Pub extends Validate
{
    protected $rule    = [
        'account' => 'require|max:10',
        'password'  => 'require|max:20',
    ];
    protected $message = [
        'account.require' => '用户名和密码不能为空',
        'account.max'     => '名称最多不能超过10个字符',
        'account.eq'      => '帐号或密码错误',
        'password.require'  => '用户名和密码不能为空',
        'password.max'      => '密码最多不能超过20个字符',
        'password.eq'       => '帐号或密码错误!',
    ];
    protected $scene   = [
        'login' => ['account', 'password'],
    ];
}