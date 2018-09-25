<?php
/**
 * 产品中心-内容管理业务
 * @create  2018-08-03
 * @author  dzt
 * @version 
 */
namespace app\product\model;

use app\common\model\Base;
use app\common\model\Product as ProductCommon;

class Product extends Base
{
    protected $pk = 'product_id';
    
    //关联内容
    public function content()
    {
        return $this->hasOne('Content');
    }
    
    public function productContentPrice()
    {
        return $this->hasMany('product_content_price');
    }
    
    public function getCategory() {
        return ProductCommon::getInstance()->getCategoryTree();
    }
    
}
