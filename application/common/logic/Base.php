<?php

namespace app\common\logic;

use think\Model;

class Base extends Model {
    /**
     * 查询后的分页处理
     * @param array $arrData 列表
     * @return array
     */
    public function afterQuery($arrData) {
        $arrPage['total']      = $arrData['total'];
        $arrPage['page_size']  = $arrData['per_page'];
        $arrPage['page_no']    = intval($arrData['current_page']);
        $arrPage['page_count'] = $arrData['last_page'];
        
        return ['page_info' => $arrPage, 'data' => $arrData['data']];
    }


}
