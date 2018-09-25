<?php

namespace app\sale\logic;

use app\sale\model\ProductContentPrice as ProductContentPriceModel;
use app\common\logic\Base as BaseLogic;

class ProductContentPrice extends BaseLogic {
    
    public function getContentList($product_id=0) {
        return ProductContentPriceModel::whereProductId('=', $product_id)
                            ->alias('pcp')
                            ->field(['pcp.content_id, content_num, content_name, pcp.content_price_id, cp.content_price'])
                            ->join(['oms_content as c'], 'c.content_id=pcp.content_id')
                            ->join(['oms_content_price as cp'], 'cp.content_price_id=pcp.content_price_id')
                            ->select()
                            ->toArray();
    }
    
    
}
