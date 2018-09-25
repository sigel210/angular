<?php
/**
 * 操作记录
 * @author: dzt
 * @create: 2018/8/7
 */

namespace app\common\model;
use app\common\model\Base;
// use think\Db;

class ContentPrice extends Base
{
    // 直接使用配置参数名
    protected $table = 'oms_content_price';
    protected $pk = 'content_price_id';
    
    
}