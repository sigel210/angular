<?php

namespace app\sale\controller;

use app\common\controller\Base;
use think\facade\Request;
use app\common\logic\Order as OrderLogic;
use app\common\model\Order as OrderModel;
use think\Db;
use think\Request as BaseRequest;

/**
 * 订单
 * @author genghui
 */
class Order extends Base {
    protected $orderLogic = NULL;

    public function initialize() {
        parent::initialize();
        $this->orderLogic = new OrderLogic;
    }
    
    protected function _where(&$arrWhere) {
        // 获取请求对象：直接实例化think\Request类、助手函数(request()、app('request'))、容器(Container::get('request'))、Facade调用、依赖注入
        $customer_id   = Request::param('customer_id', 0, 'intval');                             //客户ID
        $validate_data['customer1'] = $customer = Request::param('customer');                    //客户名称
        $pool_id       = Request::param('pool_id');                                              //客户池子ID
        $validate_data['order_creater'] = $order_creater = Request::param('order_creater');      //订单创建者
        $validate_data['order_no'] = $order_no = Request::param('order_no');                     //订单编号
        $received_date_start = Request::param('received_date_start');                            //到单起始日期
        $received_date_end   = Request::param('received_date_end');                              //到单结束日期
        
        if ($customer_id) {
            $arrWhere[] = ['o.customer_id', '=', $customer_id];
        } else {
            //校验搜索参数
            $validate_ret = $this->validate($validate_data, 'app\sale\validate\Order.search_order');
            //验证数据
            if ($validate_ret !== true) {
                $this->rtnError($validate_ret);
            }
            
            $arrWhere[] = ['oms_order.user_id', '=', $this->userId];
            if ($customer) {
                $arrWhere[] = ['c.customer', 'like', "%{$customer}%"];
            }
            if ($order_creater) {
                $arrWhere[] = ['u.nickname', 'like', "%{$order_creater}%"];
            }
            if ($order_no) {
                $arrWhere[] = ['order_no', 'like', "%{$order_no}%"];
            }
            if ($received_date_start) {
                $arrWhere[][] = ['order_received_date', '>=', $received_date_start];
            }
            if ($received_date_end) {
                $arrWhere[][] = ['order_received_date', '<=', $received_date_end];
            }
        }
    }

    /**
     * 业务中心订单列表
     */
    public function index() {
        parent::index();
        $arrOrderList = $this->orderLogic->queryList($this->arrWhere);
        
        $this->rtnList($arrOrderList);
    }
    
    /**
     * 客户详情页订单列表
     */
    public function getOrderList() {
        parent::index();
        $arrOrderList = $this->orderLogic->getOrderList($this->arrWhere);
        
        $this->rtnList($arrOrderList);
    }
    
    /**
     * 获得客户名字
     * @param BaseRequest $request 请求实例对象
     * @return array
     */
    public function getCustomerName(BaseRequest $request) {
        $customer_id = $request->param('customer_id');
        $customer_info = $this->orderLogic->getCustomerInfo($customer_id);
        
        $this->rtnList($customer_info);
    }
    
    /**
     * 新建订单时，校验客户名称
     */
    public function checkCustomer() {
        $customer = $this->request->param('customer', '', 'trim');
        $validate_ret = $this->validate(['customer' => $customer], 'app\sale\validate\Order.check_customer');
        if ($validate_ret !== true) {
            $this->rtnError($validate_ret, 0);
        } 
        
        $this->rtnSuccess('操作成功', 200);
    }
    
    /**
     * 获得产品类型-产品-内容联动列表(新建订单)
     */
    public function getProductCategoryList() {
        $second_level_product_category_list = $this->orderLogic->getProductCategoryList();
        $this->rtnList(array_values($second_level_product_category_list));
    }
    
    /**
     * 新增订单
     */
    public function insert() {
        $post_data = $this->request->post(); 
        if (intval($post_data['order_sign_type']) == 1) {
            // 个人签约
            $validate_ret = $this->validate($post_data, 'app\sale\validate\Order.insert_individual');
        } elseif(intval($post_data['order_sign_type']) == 2) {
            // 企业签约
            $validate_ret = $this->validate($post_data, 'app\sale\validate\Order.insert_company');
        }
            
        //验证数据
        if ($validate_ret !== true) {
            $this->rtnError($validate_ret, 0);
        }
       
        Db::startTrans();
        try {
            //放到logic层
            $order_id = $this->orderLogic->insertOrder($post_data, $this->userId);
            //写入日志
            $this->addLog($this->userId, 1, 3, $order_id);
            Db::commit();
        } catch (\Exception $e) {
            Db::rollback();
            $this->rtnError($e->getMessage());
        }
        
        $this->rtnSuccess('新建订单成功');
    }
    
    /**
     * 删除订单前置检查
     * @param int $iOrderId 订单ID
     */
    protected function _checkBeforeDelete() {
        $order_id = $this->request->param('order_id');
        
        // 订单状态为待执行 且 没有支付对账成功的记录，可删除,其他不可删除
        $order_status = $this->orderLogic->getOrderStatus($order_id);
        $order_received_list = $this->orderLogic->getOrderReceivedList($order_id);
        if ($order_status != self::ORDER_STATUS_EXECUTE_WAIT) {
            return [FALSE, '当前订单状态不可删除订单'];
        }
        
        foreach ($order_received_list as $order_receive_item) {
            if ($order_receive_item['received_status'] == 2) {
                return [FALSE, '已成功进行支付对账，无法删除订单'];
            }
            continue;
        }
        
        return [TRUE, ''];
    }
    
    /**
     * 删除订单前置检查
     * @param boolean $iRtnFlag 是否返回信息
     * @return mixed
     */
    public function checkBeforeDelete($iRtnFlag = FALSE) {
        list($iRst, $strMsg) = $this->_checkBeforeDelete();
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
    
    /**
     * 删除订单
     */
    public function delete() {
        $order_id = $this->request->param('order_id');
        list($iRst, $strMsg) = $this->_checkBeforeDelete();
        if (!$iRst) {
            $this->rtnError($strMsg);
        }
        
        Db::startTrans();
        try{
            $ret = $this->orderLogic->deleteOrder($order_id);
            //写入日志
            $this->addLog($this->userId, 3, 3, $order_id);
            Db::commit();
        } catch (\Exception $e) {
            Db::rollback();
            $this->rtnError($e->getMessage());
        }
        
        $this->rtnSuccess('订单删除成功');
    }
    
    /**
     * 订单详情
     */
    public function detail() {
        $order_id = $this->request->param('order_id');
        
        $order_detail_info = $this->orderLogic->getDetail($order_id);
        list($button['delete']) = $this->checkBeforeDelete(TRUE);
        $order_detail_info['button'] = $button;
        
        $this->rtnList($order_detail_info);
    }
    
    /**
     * 检查订单对账状态
     * @param int $iOrderId 订单ID
     * @return void
     */
    protected function _checkOrderReceivedStatus($iOrderId = 0) {
        $ret = $this->orderLogic->checkOrderReceivedStatus($iOrderId);
        
        return $ret;
    }

    protected function _checkBeforeApplyRefund() {
        $order_id = $this->request->param('order_id', 0, 'intval');
        
        // 订单状态为待执行，且订单对账状态为：对账成功,按钮显示亮。否则，按钮置灰。
        $order_status = (new \app\common\model\Order)->getOrderStatus($order_id);
        if ($order_status != self::ORDER_STATUS_EXECUTE_WAIT) {
            if ($order_status == self::ORDER_STATUS_FINISHED) {
                return [FALSE, '订单已完结，无法发起退款'];
            }
            return [FALSE, '当前订单状态无法发起退款'];
        }
        $order_received_status = $this->_checkOrderReceivedStatus($order_id);
        if (!$order_received_status) {
            return [FALSE, '订单还没有对账成功，无法发起退款'];
        }
        
        return [TRUE, ''];
    }

    /**
     * 退款前置判断
     */
    public function checkBeforeRefund($iRtnFlag = FALSE) {
        list($iRst, $strMsg) = $this->_checkBeforeApplyRefund();
        
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
    
    /**
     * 发起退款所需信息
     * @param type $param
     */
    public function getRefundInfo() {  
        $result = [];
        $order_id = $this->request->param('order_id', 0, 'intval');
        //退款类型
        $temp_deposit_price = OrderModel::where('order_id', $order_id)->value('temp_deposit_price');   // 退款金额上限计算(仅暂存款退款取该字段)
        if ($temp_deposit_price == 0.00) {
            $refund_type_arr = [['refund_type_id' => 3, 'refund_type_name' => '违约退款']];
        } else {
            $refund_type_arr = [['refund_type_id' => 3, 'refund_type_name' => '违约退款'], ['refund_type_id' => 4, 'refund_type_name' => '暂存款退款']];
        }
        
        // 退款内容列表
        $order_content_list = $this->orderLogic->getOrderContentList($order_id);
        // 退款渠道列表、退款账户列表
        $refund_way_list = $this->orderLogic->getRefundWayList($order_id);
        
        $result['refund_type']        = $refund_type_arr;
        $result['order_product_list'] = $order_content_list;
        $result['refund_way_list']    = $refund_way_list;
        $result['refund_amount_max']  = sprintf_price($temp_deposit_price);
                
        $this->rtnList($result);
    }

    /**
     * 退款上传图片
     * 附件上传,最多10张，非必填,jpg/jpeg/png格式，每张不超过10MB
     */
    public function uploadRefundPic() {
        $pic_path_list = [];
        
        // 多图上传
        $files = $this->request->file('img');  // name属性为数组img[]
        if (!$files) {
            $this->rtnError("请选择上传附件");
        }
        
        foreach ($files as $key => $file) {
            // 图片大小限制为10M
            $info = $file->validate(['size' => 10485760, 'ext' => 'jpg,png,jpeg'])->move( '../upload/refund/');
            if ($info) {
                $file_path = $info->getSaveName();
                $pic_path_list[] = 'upload/refund/' . $file_path;
            } else {
                $this->rtnError($file->getError());
            }
        }
        
        $this->rtnList($pic_path_list);
    }
    
    /**
     * 通过PHP原生方法上传退款图片(暂时不用)
     */
    public function uploadRefundPicByOriginalMethod() {
        $pic_path_list = []; 
        $files = $_FILES['img'];
        
        $to_path = "../upload/refund";
        $type_list = ["image/pjpeg", "image/jpeg", "image/png"];   //定义允许的上传文件类型 
        
        for($i = 0; $i < count($files['name']); $i++){
            // 判断文件是否上传错误 
            if($files['error'][$i] > 0){ 
                switch($files['error'][$i]){ 
                    case 1: 
                        $err_info = "上传的文件超过了 php.ini 中 upload_max_filesize 选项限制的值"; 
                        break; 
                    case 2: 
                        $err_info = "上传文件的大小超过了 HTML 表单中 MAX_FILE_SIZE 选项指定的值"; 
                        break; 
                    case 3: 
                        $err_info = "文件只有部分被上传"; 
                        break; 
                    case 4: 
                        $err_info = "没有文件被上传"; 
                        break; 
                    case 6: 
                        $err_info = "找不到临时文件夹"; 
                        break; 
                    case 7: 
                        $err_info = "文件写入失败"; 
                        break; 
                    default: 
                        $err_info = "未知的上传错误"; 
                        break; 
                } 
                $this->rtnError($err_info); 
            } 

            // 判断文件上传的类型是否合法 
            if(!in_array($files['type'][$i], $type_list)){ 
                $this->rtnError('上传文件类型不合法'); 
            } 

            // 上传文件的大小过滤 
            if($files['size'][$i] >  10485760){ 
                $this->rtnError('上传文件大小不合法');
            } 

            // 上传文件名处理 
            $exten_name = pathinfo($files['name'][$i], PATHINFO_EXTENSION); 
            do{ 
                // 生成文件名，为了增加唯一性，后面跟一个随机数
                // TODO:按日期生成的目录可能需要创建
                $main_name = date('Ymd') . DIRECTORY_SEPARATOR . md5(microtime(true)) . mt_rand(100, 999);         
                $new_name = $main_name . '.' . $exten_name; 
            }while(file_exists($to_path . '/' . $new_name)); 

            // 判断是否是上传的文件，并执行上传 
            if(is_uploaded_file($files['tmp_name'][$i])){ 
                if(move_uploaded_file($files['tmp_name'][$i], $to_path . '/' . $new_name)){
                    $pic_path_list[] = substr($to_path, 3) . '/' . $new_name;
                } else { 
                    $this->rtnError('图片上传失败');
                } 
            } else { 
                $this->rtnError('请上传正常的图片');
            } 
        } 
        
        $this->rtnList($pic_path_list);
    }
    
    /**
     * 发起退款
     */
    public function applyRefund() {
        $post_data = $this->request->post();
        
        $this->_checkBeforeApplyRefund(intval($post_data['order_id']));
        if (empty($post_data['refund_type'])) {
            $this->rtnError('退款类型不能为空');
        }
        if (intval($post_data['refund_type']) == 3) {
            if (count($post_data['order_content_id_arr']) == 0) {
                $this->rtnError('请选择退款内容');
            }
        }

        $validate_ret = $this->validate($post_data, 'app\sale\validate\Order.refund');
        if ($validate_ret !== true) {
            $this->rtnError($validate_ret, 0);
        }
        // 验证退款金额不能大于最大退款金额
        $refund_amount_ret = $this->orderLogic->checkRefundAmount($post_data);
        if (!$refund_amount_ret) {
            $this->rtnError("退款金额超过退款金额上限，请重新填写");
        }
        
        Db::startTrans();
        try{
            $this->orderLogic->applyRefund($post_data, $this->userId);
            Db::commit();
        } catch (\Exception $e) {
            Db::rollback();
            $this->rtnError($e->getMessage());
        }
        
        $this->rtnSuccess('申请退款成功');
    }
    
    /**
     * 退款列表
     * @param type $param
     */
    public function getRefundList() {
        $order_id = $this->request->param('order_id', 0, 'intval'); 
        
        $refund_list = $this->orderLogic->getRefundListByOrderId($order_id);
        list($button['apply_refund']) = $this->checkBeforeRefund(TRUE);
        $result['list'] = $refund_list;
        $result['button'] = $button;
        
        $this->rtnList($result);
    }
    
    /**
     * 获得产品类型-产品-内容联动列表(编辑订单)
     */
    public function getEditOrderInfo() {
        
    }
    
    public function checkBeforeUpdate() {
        
    }
    
    /**
     * 订单编辑
     */
    public function update() {
        
    }
    
    
}
