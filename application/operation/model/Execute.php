<?php
/**
 * Created by PhpStorm.
 * User: lcp
 * Date: 2018/8/8
 * Time: 15:35
 */

namespace app\operation\model;

use app\common\model\Base;

class Execute extends Base
{
    protected $table = 'oms_order_content';
    protected $pk = 'order_content_id';

    /**
     * 执行列表信息
     * @param array $where
     * @return array
     * @throws \think\exception\DbException
     */
    public function executeList($where = [])
    {
        /*
         * todo 黑曼有三级内容类型,淘大没有三级内容类型
         * $this->alias('c')
            ->field(['order_content_no, content_name, oc.content_category_id, cc1.content_category_name as first_content_name,
            cc2.content_category_name as second_content_name, cc3.content_category_name as third_content_name, content_price'])
            ->join(['oms_content_price' => 'p'], 'c.execute_content_price_id=p.content_price_id')
            ->join(['oms_content' => 'oc'], 'p.content_id=oc.content_id')
            ->join(['oms_content_category' => 'cc3'], 'oc.content_category_id=cc3.content_category_id')
            ->join(['oms_content_category' => 'cc2'], 'cc3.parent_id=cc2.content_category_id')
            ->join(['oms_content_category' => 'cc1'], 'cc2.parent_id=cc1.content_category_id')
            ->where($where)
            ->order('order_content_id DESC')
            ->paginate()
            ->toArray()
         */
        //todo 只查询淘大数据
        $where[] = ['oc.content_category_id', 'in', [47, 48, 49]];
        return $this->alias('c')
            ->field(['order_content_no, content_name, oc.content_category_id, cc1.content_category_name as first_content_name, 
            cc2.content_category_name as second_content_name, content_price'])
            ->join(['oms_content_price' => 'p'], 'c.execute_content_price_id=p.content_price_id')
            ->join(['oms_content' => 'oc'], 'p.content_id=oc.content_id')
            //->join(['oms_content_category' => 'cc3'], 'oc.content_category_id=cc3.content_category_id')
            ->join(['oms_content_category' => 'cc2'], 'oc.content_category_id=cc2.content_category_id')
            ->join(['oms_content_category' => 'cc1'], 'cc2.parent_id=cc1.content_category_id')
            ->where($where)
            ->order('order_content_id DESC')
            ->paginate()
            ->toArray();
    }
}