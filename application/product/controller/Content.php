<?php
/**
 * 内容管理控制器
 * @create  2018-08-03
 * @author  dzt
 */

namespace app\product\controller;
use app\common\controller\Base;
use app\product\logic\Content as ContentLogic;
use app\product\model\Content as ContentModel;
use app\product\validate\Content as VContent;

class Content extends Base
{
    private $model = null;
    
    private $_operate = null;//操作名称
    
    private $validate = null;
    
    public function initialize()
    {
        parent::initialize();
        $this->model = new ContentModel();
        $this->validate = new VContent();
    }
    
    /**
     * 
     */
    public function category()
    {
        $this->rtnList($this->model->getCategory());
    }
    
    
    public function insert()
    {
        $this->_beforeValidate($this->validate, 'insert');
        if (!$rs = $this->model->insertContent(input())) {
            $this->rtnError();
        }
        $this->addLog($this->userId, 1, 1, $rs);
        $this->rtnSuccess();
    }
    
    public function edit()
    {
        $this->_beforeValidate($this->validate, 'edit');
        $this->checkBeforeEdit();
        if ($this->model->editContent(input()) === FALSE) {
            $this->rtnError();
        }
        $this->addLog($this->userId, 2, 1, input('content_id'));
        $this->rtnSuccess();
    }
    
    public function delete()
    {
        $this->_beforeValidate($this->validate, 'delete');
        $this->checkBeforeDelete();
        $rs = (new \app\common\logic\Content())->deleteContent(input('content_id'));
        if ($rs!==TRUE) {
            $this->rtnError($rs);
        }
        $this->addLog($this->userId, 3, 1, input('content_id'));
        $this->rtnSuccess();
    }
    
    public function index()
    {
        $this->_beforeValidate($this->validate, 'index');
        $contentLogic = new ContentLogic();
        $this->rtnList($contentLogic->getList());
    }
    
    public function detail()
    {
        $this->_beforeValidate($this->validate, 'detail');
        $data = (new ContentLogic())->getDetail(input('content_id'));
        $data['botton']['edit'] = $this->checkBeforeEdit(TRUE);
        $data['botton']['delete'] = $this->checkBeforeDelete(TRUE);
        $this->rtnList($data);
    }
    
    public function checkBeforeEdit($iRtnFlag = FALSE)
    {
        $this->_operate = '编辑';
        list($iRst, $strMsg) = $this->_checkContentStatus();
        if (!$iRst) {//错误立即返回
            if ($iRtnFlag) {
                return [$iRst, $strMsg];
            } else {
                $this->rtnError($strMsg);
            }
        }
        list($iRst, $strMsg) = $this->_checkContentRelation();
        if (!$iRst) {//错误立即返回
            if ($iRtnFlag) {
                return [$iRst, $strMsg];
            } else {
                $this->rtnError($strMsg);
            }
        }
        return [$iRst, $strMsg];
    }
    
    /**
     * 删除操作前置判断
     */
    public function checkBeforeDelete($iRtnFlag = FALSE)
    {
        $this->_operate = '删除';
        list($iRst, $strMsg) = $this->_checkContentStatus();
        if (!$iRst) {//错误立即返回
            if ($iRtnFlag) {
                return [$iRst, $strMsg];
            } else {
                $this->rtnError($strMsg);
            }
        }
        list($iRst, $strMsg) = $this->_checkContentRelation();
        if (!$iRst) {//错误立即返回
            if ($iRtnFlag) {
                return [$iRst, $strMsg];
            } else {
                $this->rtnError($strMsg);
            }
        }
        return [$iRst, $strMsg];
    }
    
    /**
     * 查询内容状态
     */
    private function _checkContentStatus()
    {
        $info = (new \app\common\model\Content())->getContentStatus(input('content_id'));
        if (empty($info) || !isset($info['content_status'])) {
            return [FALSE, '内容id有误'];
        }
        if ($info['content_status'] != '未打单') {
            return [FALSE, "当前内容状态下，无法{$this->_operate}内容"];
        }
        return [TRUE, ''];
    }
    
    /**
     * 内容关联查询
     */
    private function _checkContentRelation()
    {
        $info = ContentModel::table('oms_product_content_price')->where('content_id='.input('content_id'))->count();
        if ($info) {
            return [FALSE, "已有产品关联当前内容，无法{$this->_operate}内容"];
        }
        return [TRUE, ''];
    }
}