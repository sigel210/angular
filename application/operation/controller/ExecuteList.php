<?php
/**
 * 运营中心-执行列表
 * User: lcp
 * Date: 2018/8/3
 * Time: 18:47
 */

namespace app\operation\controller;

use app\common\controller\Base;
use app\operation\logic\Execute;

class ExecuteList extends Base
{
    /**
     * 执行列表
     * @throws \think\exception\DbException
     */
    public function index(){
        $data = input('get.');
        //验证数据
        $executeValidate = new \app\operation\validate\Execute();
        if (!$executeValidate->scene('get_list')->check($data)) {
            $this->rtnError($executeValidate->getError());
        }

        $execute = new Execute();
        $result = $execute->getExecuteList($data);
        $this->rtnList($result);
    }
}