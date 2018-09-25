<?php
/**
 * 操作记录
 * @author: dzt
 * @create: 2018/8/7
 */

namespace app\common\model;

use think\Db;

class ProductContentPrice extends Base
{
    // 直接使用配置参数名
    protected $table = 'oms_product_content_price';
    protected $pk = 'product_content_price_id';
    
    public function content()
    {
        return $this->hasOne('content', 'content_id')->bind('content_name')->setEagerlyType(0);
    }

    /**
     * 批量更新产品内容关系表数据
     * @param   array   data    要更新的数据
     */
    public function batchUpdateProductContentPrice($data)
    {
        return $this->saveAll($data);
    }
    
    /**
     * 获取产品下内容列表
     * @param  int  $pid  产品id
     */
    public function getProductContentList($pid)
    {
        return $this->alias('a')->where(['a.product_id'=>$pid])->field('a.*,b.content_name,b.content_status,b.content_category_id')
            ->join('oms_content b','a.content_id=b.content_id')
            ->select()->toArray();
    }
}