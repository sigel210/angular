<?php

/**
 * 内容逻辑层
 * 
 * @author  dzt
 * @create  2018-08-08 
 */
namespace app\common\logic;

use app\common\logic\Base;
use app\common\model\Content as ContentModel;
use app\common\model\ContentPrice;
use think\Db;

class Content extends Base
{
    protected $_contentStatus = [
        1 => '未打单', 2 => '打单中', 3 => '打单关闭', 4 => '执行中', 5 => '已完结'
    ];

    /**
     * 删除内容
     */
    public function deleteContent($contentId)
    {
        Db::startTrans();
        try {
            ContentPrice::where('content_id', '=', $contentId)->delete();
            ContentModel::destroy($contentId);
            Db::commit();
            return TRUE;
        } catch (\Exception $e) {
            Db::rollback();
            return $e->getMessage();
        }
    }
}