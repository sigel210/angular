<?php

namespace app\sale\logic;

use app\common\logic\Base as BaseLogic;
use app\sale\model\ProductCategory as ProductCategoryModel;

class ProductCategory extends BaseLogic {
    /**
     * 获得二级产品类型列表
     * @return array
     */
    public function getSecondProductCategoryList() {
        $result =  ProductCategoryModel::where('product_category_level', 2)
                ->where('is_forbit', '=', 0)
                ->field(['product_category_id, product_category_name'])
                ->order('product_category_id DESC')
                ->select()
                ->toArray();
        return $result;
    }
    
    /**
     * 获得三级产品类型列表
     * @param type $iSecondProductCategoryId 二级产品类型ID
     * @return array
     */
    public function getThirdProductCategoryList($iSecondProductCategoryId = 0) {
        return ProductCategoryModel::where('product_category_level', 3)
                ->where('parent_id', '=', $iSecondProductCategoryId)
                ->where('is_forbit', '=', 0)
                ->field(['product_category_id, product_category_name'])
                ->order('product_category_id DESC')
                ->select()
                ->toArray();
    }
    
    
}
