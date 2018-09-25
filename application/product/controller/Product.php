<?php
/**
 * 产品管理控制器
 * @create  2018-08-03
 * @author  dzt
 */

namespace app\product\controller;
use app\common\controller\Base;
use app\product\logic\Product as ProductLogic;
use app\product\logic\Content as ContentLogic;
use app\product\model\Product as ProductModel;
use app\product\validate\Product as VProduct;

class Product extends Base
{
    private $model = null;
    
    private $_operate = null;
    
    private $validate = null;
    
    public function initialize()
    {
        parent::initialize();
        $this->model = new ProductModel();
        $this->validate = new VProduct();
    }
    
    /**
     * 产品类型
     */
    public function category()
    {
        $this->rtnList($this->model->getCategory());
    }
    
    /**
     * 新增
     */
    public function insert()
    {
        if (!$this->validate->scene('insert')->check(input('post.'))) {
            $this->rtnError($this->validate->getError());
        }
        $ProductLogic = new \app\common\logic\Product();
        $rs = $ProductLogic->insert($this->userId, input());
        if ($rs !== TRUE) {
            $this->rtnError($rs);
        }
        $this->rtnSuccess();
    }
    
    /**
     * 新增-内容列表
     */
    public function contentList()
    {
        $this->_beforeValidate($this->validate, 'contentList');
        $handle = new ContentLogic();
        $this->rtnList($handle->getList());
    }
    
    public function edit()
    {
        $this->_beforeValidate($this->validate, 'edit');
        $rs = (new ProductLogic())->editProduct(input());
        if ($rs !== TRUE) {
            $this->rtnError($rs);
        }
        $this->addLog($this->userId, 2, 2, input('product_id'));
        $this->rtnSuccess('产品编辑成功');
    }
    
    public function delete()
    {
        $this->_beforeValidate($this->validate, 'delete');
        $rs = (new ProductLogic())->deleteProduct(input('product_id'));
        if ($rs !== TRUE) {
            $this->rtnError($rs);
        }
        $this->addLog($this->userId, 3, 2, input('product_id'));
        $this->rtnSuccess('产品删除成功');
    }
    
    /**
     * 打单开关
     */
    public function optStatus()
    {
        $this->_beforeValidate($this->validate, 'optStatus');
        $rs = (new \app\common\logic\Product())->optStatus(input('product_id'), input('product_status'));
        if ($rs !== TRUE) {
            $this->rtnError($rs);
        }
        $this->rtnSuccess($this->_operate . '成功');
    }
    
    public function index()
    {
        $this->_beforeValidate($this->validate, 'index');
        $handle = new ProductLogic();
        $this->rtnList($handle->getList());
    }
    
    public function detail()
    {
        $this->_beforeValidate($this->validate, 'detail');
        $data = (new ProductLogic())->getDetail(input('product_id'));
        $data['botton']['edit'] = $this->checkBeforeEdit(TRUE);
        $data['botton']['delete'] = $this->checkBeforeDelete(TRUE);
        $this->rtnList($data);
    }

    public function checkBeforeEdit($iRtnFlag = FALSE)
    {
        $this->_operate = '编辑';
        list($iRst, $strMsg) = $this->_checkBeforeProductStatus();
        if ($iRtnFlag) {
            return [$iRst, $strMsg];
        } else {
            if ($iRst) {
                $this->rtnSuccess('操作成功');
            } else {
                $this->rtnError($strMsg);
            }
        }
    }
    
    public function checkBeforeDelete($iRtnFlag = FALSE)
    {
        $this->_operate = '删除';
        list($iRst, $strMsg) = $this->_checkBeforeProductStatus();
        if ($iRtnFlag) {
            return [$iRst, $strMsg];
        } else {
            if ($iRst) {
                $this->rtnSuccess('操作成功');
            } else {
                $this->rtnError($strMsg);
            }
        }
    }

    private function _checkBeforeProductStatus()
    {
        $product = ProductModel::get(input('product_id'));
        if ($product->product_status != 1) {
            return [FALSE, '当前产品状态下，无法'.$this->_operate.'产品'];
        }
        return [TRUE, ''];
    }

}