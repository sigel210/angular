<?php
/**
 * Created by PhpStorm.
 * User: lcp
 * Date: 2018/8/8
 * Time: 15:31
 */

namespace app\operation\logic;

use app\common\logic\Base;

class Execute extends Base
{
    /**
     * 获取执行列表
     * @param $data
     * @return array
     * @throws \think\exception\DbException
     */
    public function getExecuteList($data)
    {
        $where = [];
        if (isset($data['content_name']) && !empty($data['content_name'])) {
            $where[] = ['oc.content_name', 'LIKE', "%{$data['content_name']}%"];
        }

        if (isset($data['first_content_id']) && !empty($data['first_content_id'])) {
            $where[] = ['cc1.content_category_id', '=', $data['first_content_id']];
        }

        if (isset($data['second_content_id']) && !empty($data['second_content_id'])) {
            $where[] = ['cc2.content_category_id', '=', $data['second_content_id']];
        }

        if (isset($data['third_content_id']) && !empty($data['third_content_id'])) {
            $where[] = ['cc3.content_category_id', '=', $data['third_content_id']];
        }
        $executeModel = new \app\operation\model\Execute();
        $result = $this->afterQuery($executeModel->executeList($where));
        return $result;
    }
}