<?php
/**
 * Created by PhpStorm.
 * User: lcp
 * Date: 2018/8/6
 * Time: 9:23
 */

namespace app\commonality\model;

use think\Model;

class Pub extends Model
{
    protected $table = 'crm_adm_user';

    /**
     * 更新用户登录信息
     * @param $data
     * @return bool
     */
    public function updateUser($data)
    {
        if ($this->allowField(true)->where('id', $data['id'])->inc('login_count')->update() === false) {
            return false;
        }
    }
}