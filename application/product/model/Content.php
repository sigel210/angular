<?php
/**
 * 产品中心-内容管理业务
 * @create  2018-08-03
 * @author  dzt
 * @version 
 */
namespace app\product\model;

use app\common\model\Base;
use app\common\model\Content as ContentCommon;

class Content extends Base
{
    protected $pk = 'content_id';
    
    public function contentPrice()
    {
        return $this->hasOne('ContentPrice', 'content_price_id')->bind('content_price');
    }
    
    public function getContentStatusAttr($value)
    {
        $status = [
            1 => '未打单', 2 => '打单中', 3 => '打单关闭', 4 => '执行中', 5 => '已完结'
        ];
        return $status[$value];
    }
    
    public function getCategory() {
        return ContentCommon::getInstance()->getCategoryTree();
    }
    
    public function insertContent($data)
    {
        $this->allowField(['content_name', 'content_category_id', 'content_desc'])->save($data);
        return $this->content_id;//返回主键值
    }
    
    public function editContent($data)
    {
        return $this->where('content_id='.$data['content_id'])->update($data);
    }
    
    public function deleteContent()
    {
        return $this->where('content_id='.input('post.content_id'))->delete();
    }
    
    public function getListContent($where)
    {
        return $this->where($where)->field('content_id,content_category_id,content_name,content_status,guidelines_address,create_time')->order('create_time desc')->paginate()->toArray();
    }
}
