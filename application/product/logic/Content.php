<?php

/**
 * 内容逻辑层
 * 
 * @author  dzt
 * @create  2018-08-08 
 */
namespace app\product\logic;

use app\common\logic\Base;
use app\product\model\Content as ContentModel;
use app\common\model\Content as ContentCommon;
use app\common\model\OperateLog;
use think\Db;


class Content extends Base
{
    protected $_contentStatus = [
        1 => '未打单', 2 => '打单中', 3 => '打单关闭', 4 => '执行中', 5 => '已完结'
    ];
    
	/**
	 * 列表
	 */
    public function getList()
    {
        $where = [];
        $contentName = input('content_name');
        $startTime = input('start_time');
        $endtTime = input('end_time');
        $contentStatus = input('content_status');
        if (!empty($contentName)) {
            $contentName = str_replace('%', '\\%', $contentName);
            $where[] = ['content_name', 'like', "%$contentName%"];
        }
        if (!empty($startTime)) {
            $where[] = ['create_time', '>=', $startTime];
        }
        if (!empty($endtTime)) {
            $where[] = ['create_time', '<=', $endtTime];
        }
        if (!empty($contentStatus)) {
            $where[] = ['content_status', '=', $contentStatus];
        }
        $model = new ContentModel();
        $result = $this->afterQuery($model->getListContent($where));
        $this->_disposeContentArray($result['data']);
    	return $result;
    }
    
    public function getDetail($cid)
    {
        $handle = ContentCommon::getInstance();
        $category = $handle->getContentCategory('all');
        $contentInfo = $handle->getContentDetail($cid);
        $cascade = $handle->getCascadeCategory($category, $contentInfo['content_category_id']);
        $contentInfo['content_categorys'] = array_column($cascade, 'content_category_name');
//         list($contentInfo['first_content_category'], $contentInfo['second_content_category'], $contentInfo['third_content_category']) = array_column($cascade, 'content_category_name');
        $mOperateLog = new OperateLog();
        $operateLog = $mOperateLog->getLog($cid, 1);
        return ['content_info'=>$contentInfo, 'operate_log'=>$operateLog];
    }

    /**
     * 删除内容
     */
    public function deleteContent($contentId)
    {
        $content = ContentCommon::get($contentId, 'contentPrice');
        return $content->together('contentPrice')->where('content_id='.$contentId)->fetchSql(true)->delete();
    }
    /**
     * 处理内容列表数组
     */
    private function _disposeContentArray(&$contents)
    {
        $handle = \app\common\model\Content::getInstance();
        $category = $handle->getContentCategory('all');
        foreach ($contents as &$val) {
            $return = $handle->getCascadeCategory($category, $val['content_category_id']);
            $columns = array_column($return, 'content_category_name');
            $val['content_categorys'] = $columns;
//             list($val['first_content_category'], $val['second_content_category'], $val['third_content_category']) = $columns;
            $val['content_category'] = implode('-', $columns);
        }
    }
    
}