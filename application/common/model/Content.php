<?php
/**
 * 内容处理模型
 * @create  2018-08-03
 * @author  dzt
 */
namespace app\common\model;
use app\common\model\Base;

class Content extends Base{
    
    private static $instance = null;

    protected $table = 'oms_content';
    
    protected $pk = 'content_id';
    
    //克隆方法私有化
    private function __clone()
    {
        
    }

    public function getContentStatusAttr($value)
    {
        $status = [
            1 => '未打单', 2 => '打单中', 3 => '打单关闭', 4 => '执行中', 5 => '已完结'
        ];
        return $status[$value];
    }
    
    public static function getInstance()
    {
        if(!self::$instance instanceof self){
            self::$instance=new self();
        }
        return self::$instance;
    }

    public function contentPrice()
    {
        return $this->hasOne('ContentPrice', 'content_price_id');
    }
    
    /**
     * 获取内容类型
     */
    public function getContentCategory($range = null)
    {
        $where = $range=='all' ? [] : ['is_forbit'=>0];
        return $this->table('oms_content_category')->where($where)->order('content_category_level desc')->select()->toArray();
    }
    
    /**
     * 获取内容类型树
     * @param int $tid      树节点
     */
    public function getCategoryTree($tid = null)
    {
        $data = $this->getContentCategory();
        $result = $list = [];
        foreach ($data as $val) {
            $arr = [
                'content_category_id'   =>  $val['content_category_id'],
                'content_category_name' =>  $val['content_category_name'],
                'junior_category'       =>  isset($list[$val['content_category_id']]) ? $list[$val['content_category_id']] : []
            ];
            $list[$val['parent_id']][] = $arr;
            if ($val['content_category_level'] == 1) {
                $arr['junior_category'] = $list[$val['content_category_id']];
                $result[] = $arr;
            }
        }
        return $result;
    }
    
    /**
     * 获取内容具体信息
     * @param   cid   内容id
     */
    public function getContentDetail($cid)
    {
        return $this->alias('a')->field('a.*,b.content_price')->where('a.content_id=' . $cid)
            ->leftJoin('oms_content_price b', 'a.content_id=b.content_id')->find()->toArray();
    }
    
    /**
     * 获取级联关系
     * @param array $category   内容类型列表
     * @param int $cid  最底层类型id
     */
    public function getCascadeCategory($category, $cid)
    {
        $result = [];
        $list = array_column($category, null, 'content_category_id');
        while ($cid != 0) {
            $cur = $list[$cid];
            array_unshift($result, $cur);
            $cid = $cur['parent_id'];
        }
        return $result;
    }
    
    /**
     * 检查内容是否被关联
     * @param int $contentId
     */
    public function checkContentRelation($contentId)
    {
        return $this->table('oms_product_content_price')->where('content_id='.$contentId)->count();
    }
    
    /**
     * 获取内容状态
     * @param unknown $contentId
     */
    public function getContentStatus($contentId)
    {
        return $this->field('content_status')->find($contentId)->toArray();
    }
}