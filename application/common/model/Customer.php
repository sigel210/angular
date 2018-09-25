<?php

namespace app\common\model;

use app\common\model\Base;

class Customer extends Base {
    protected $table = 'oms_customer';
    protected $pk    = 'customer_id';
    
    public function relationToOrder() {
        return $this->hasMany('Order', 'customer_id');
    }
    
}
