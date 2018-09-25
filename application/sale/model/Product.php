<?php

namespace app\sale\model;

use app\common\model\Base;
use app\sale\model\ProductCategory as ProductCategoryModel;

class Product extends Base {
    
    protected $table = 'oms_product';
    protected $pk = 'product_id';
    
    /**
     * 获得产品列表
     * @param int $product_category_id 二级产品类型ID
     * @return array
     */
    public function getProductList($product_category_id) {
        // 获得该二级产品类型下，所有三级子类型的产品列表
        $third_product_category_list = ProductCategoryModel::where('parent_id', $product_category_id)
                ->where('is_forbit', 0)
                ->field(['product_category_id'])
                ->order('product_category_id DESC')
                ->select()
                ->toArray();
        if (empty($third_product_category_list)) {
            return [];
        }
        $third_product_category_id_list = array_column($third_product_category_list, 'product_category_id');
        // 打单中的产品
        return $this->whereProductStatus('=', 2)
                    ->field(['product_id, product_name, product_category_id, product_remarks, product_price'])
                    ->whereIn('product_category_id', $third_product_category_id_list)
                    ->order('product_id DESC')
                    ->select()
                    ->toArray();
    }
    
}
