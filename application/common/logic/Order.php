<?php

namespace app\common\logic;

use app\common\logic\Base as BaseLogic;
use app\common\model\Order as OrderModel;
use app\sale\model\Customer as CustomerModel;
use app\common\model\OrderProduct;
use app\common\model\OrderContent;
use app\common\model\OrderReceived;
use app\common\model\OperateLog;
use app\common\model\Approval as ApprovalModel;
use app\common\model\ApprovalRefund as ApprovalRefundModel;
use app\common\model\ApprovalContent as ApprovalContentModel;
use think\Db;
use app\common\model\Product as ProductModel;
use app\sale\logic\ProductContentPrice;
use app\sale\logic\ProductCategory as ProductCategoryLogic;
use app\sale\model\ProductCategory;
use app\sale\model\Product;


/**
 * 订单Logic
 * @author genghui
 */
class Order extends BaseLogic {
    
    /**
     * 业务中心订单列表                              
     * @param array $arrWhere 查询条件
     * @return array
     */
    public function queryList($arrWhere = []) {
        $order_model = OrderModel::getInstance();
        $sub_query_user = Db::table('titan.titan_user')
            ->field(['user_id,nickname'])
            ->buildSql();
        
        $arrResult = $order_model
                        ->alias('o')
                        ->field(['order_id, o.customer_id, order_no,total_price,order_price, order_received_date, pool_id, service_start_time, service_end_time, c.customer, order_sign_user_id, nickname as order_creater'])
                        ->join(['oms_customer' => 'c'], 'o.customer_id=c.customer_id')
                        ->join([$sub_query_user => 'u'], 'u.user_id=o.order_sign_user_id')
                        ->where($arrWhere)
                        ->order('order_id DESC')
                        ->paginate()
                        ->toArray();
        $arrResult['data'] = $this->_getProductName($arrResult['data']);
        
        return parent::afterQuery($arrResult);
    }
    
    /**
     * 客户页订单列表                              
     * @param array $arrWhere 查询条件
     * @return array
     */
    public function getOrderList($arrWhere = []) {
        $order_model = OrderModel::getInstance();
        $arrResult = $order_model
                    ->alias('o')
                    ->field(['order_id, order_received_date, customer_id '])
                    ->where($arrWhere)
                    ->order('order_id DESC')
                    ->select()
                    ->toArray();
        $return_result = $this->_getProductName($arrResult);
        
        return $return_result;
    }
    
    /**
     * 获得订单的产品名、产品类型
     * @param array $arrResult 订单列表
     * @return array
     */
    protected function _getProductName($arrResult = []) {
        $order_id_arr = array_column($arrResult, 'order_id');
        $order_product_list = OrderProduct::whereIn('order_id', $order_id_arr)
                ->alias('op')
                ->field(['order_id, op.product_id, p.product_name, p.product_category_id, concat_ws("-", pppc.product_category_name, ppc.product_category_name) as product_category_name'])
                ->join(['oms_product' => 'p'], 'op.product_id=p.product_id')
                ->join(['oms_product_category' => 'pc'], 'p.product_category_id=pc.product_category_id')
                ->join(['oms_product_category' => 'ppc'], 'pc.parent_id=ppc.product_category_id')
                ->join(['oms_product_category' => 'pppc'], 'ppc.parent_id=pppc.product_category_id')
                ->select()
                ->toArray();
        foreach ($arrResult as &$order_item) {
            $order_item['product_name'] = '';
            $order_item['product_category_name'] = '';
            $tmp = [];     //用于判断产品类型名称是否重复
            $tmp_product = [];   //用于判断产品名称是否重复
            foreach ($order_product_list as $order_product_item) {
                if ($order_item['order_id'] == $order_product_item['order_id']) {
                    //组合产品名称
                    if (!in_array($order_product_item['product_id'], $tmp_product)) {
                        array_push($tmp_product, $order_product_item['product_id']);
                        $order_item['product_name'] .=  $order_product_item['product_name'] . ',';
                    }
                    if (!in_array($order_product_item['product_category_id'], $tmp)) {
                        array_push($tmp, $order_product_item['product_category_id']);
                        $order_item['product_category_name'] .= $order_product_item['product_category_name'] . ',';
                    }
                }
            }
            
            // 去掉最后一个","
            $order_item['product_name'] = substr($order_item['product_name'], 0 , strlen($order_item['product_name']) - 1);
            $order_item['product_category_name'] = substr($order_item['product_category_name'], 0 , strlen($order_item['product_category_name']) - 1);
            if (empty($order_item['product_name'])) {
                $order_item['product_name'] = '';
            }
            if (empty($order_item['product_category_name'])) {
                $order_item['product_category_name'] = '';
            }
        }
        
        return $arrResult;
    }

    /**
     * 新建订单
     * @param array $arrData 新建订单写入表的数据
     * @param int $iUserId 用户ID
     * @return int
     */
    public function insertOrder($arrData = [], $iUserId = 0) {
        $order_content_model = new OrderContent;
        $customer_object = CustomerModel::where('customer', $arrData['customer'])->find();
        if (empty($customer_object)) {
            //新增一个黑曼客户
            $customer_object = CustomerModel::create(['customer' => $arrData['customer']]);
        }
        
        $product_list = [];
        $content_list = [];
        $arrData['order_price'] = 0.00;
        foreach ($arrData['buy_product_list'] as &$product) {
            $product['order_product_price'] = sprintf_price($product['product_price']);                     // 产品单价
            $arrData['order_price'] += sprintf_price($product['product_num'] * $product['product_price']);  //计算订单价格
            $product_list[] = $product;  
        }
        $arrData['total_price'] = $arrData['order_price'];
        $arrData['customer_id'] = $customer_object['customer_id'];
        $arrData['user_id'] = $arrData['order_sign_user_id'] = $iUserId;

        //写入order表
        $new_order_object = OrderModel::create($arrData, true);
        
        //写入order_product表
        foreach ($product_list as &$v) {
            // 若产品购买数量为10，就写入10条订单产品记录
            for ($j = 0; $j < intval($v['product_num']); $j++) {
                $v['order_id'] = intval($new_order_object['order_id']);
                $new_order_product_object = OrderProduct::create($v, true);
                
                if (!empty($v['content_list'])) {
                    foreach ($v['content_list'] as &$con) {
                        // 执行内容价格ID，初始时和内容价格ID相同
                        $con['execute_content_price_id'] = $con['content_price_id'];
                        $con['order_id'] = intval($new_order_object['order_id']);
                        $con['order_product_id'] = intval($new_order_product_object['order_product_id']);
                        // 对于一个内容，若数量($con['content_num'])为10，就要插入10条订单内容记录
                        for ($i = 0; $i < intval($con['content_num']); $i++) {
                            $content_list[] = $con;
                        }
                    }
                }   
            }
        }
         
        //写入order_content表
        if (!empty($content_list)) {
            $order_content_model->saveAll($content_list);
        }
        
        // 写入oms_order_content_execute表(第一期不加)
        //TODO

        return intval($new_order_object['order_id']);
    }
    
    /**
     * 获得订单详情
     * @param int $iOrderId 订单ID
     * @return array
     */
    public function getDetail($iOrderId = 0) {
        $order_content_arr = [];
        $sub_query_user = Db::table('titan.titan_user')
            ->field(['user_id,nickname'])
            ->buildSql();
        
        $order_object = OrderModel::where('order_id', '=', $iOrderId)
                        ->alias('o')
                        ->field(['o.order_sign_type as sign_type,o.*,u.nickname as sign_user, uu.nickname as belong_user'])
                        ->join([$sub_query_user => 'u'], 'o.order_sign_user_id=u.user_id')
                        ->join([$sub_query_user => 'uu'], 'o.user_id=uu.user_id')
                        ->find()
                        ->toArray();
        
        // 订单产品需要聚合展示
        $order_product_list = OrderProduct::where('order_id', $iOrderId)
                ->field(['order_id, product_id, order_product_price as product_price, COUNT(`product_id`) as order_product_num'])
                ->group('product_id')
                ->select()
                ->toArray();
        $order_object['product'] = $order_product_list;
        $operate_log_model = new OperateLog;
        $order_object['log'] = $operate_log_model->getLog($iOrderId, [3]);
        
        $product_id_arr = array_column($order_object['product'], 'product_id');
        $product_info = ProductModel::whereIn('product_id', $product_id_arr)
                ->alias("p")
                ->field(['product_id, product_name, concat_ws("-", ppc.product_category_name, pc.product_category_name) as product_category_name'])
                ->join(['oms_product_category' => 'pc'], 'p.product_category_id=pc.product_category_id')
                ->join(['oms_product_category' => 'ppc'], 'pc.parent_id=ppc.product_category_id')
                ->select();
        
        $product_content_price = new ProductContentPrice;
        //产品名、产品单价
        foreach ($order_object['product'] as &$product_item) {
            foreach ($product_info as $v) {
                if ($product_item['product_id'] == $v['product_id']) {
                    $product_item['product_name']  = $v['product_name'];
                    $product_item['product_category_name'] = $v['product_category_name'];
                }
            }
            // 产品内容列表，聚合展示
            $product_item['order_content_list'] = $product_content_price->getContentList(intval($product_item['product_id']));
        }

        $order_object['service_start_time'] = '-';
        $order_object['service_end_time']   = '-';
        $order_object['income_type']   = '-';
        return $order_object;
    }
    
    /**
     * 获得订单状态
     * @param int $iOrderId 订单ID
     * @return int
     */
    public function getOrderStatus($iOrderId = 0) {
        return OrderModel::where('order_id', $iOrderId)->value('order_status');
    }
    
    /**
     * 获得支付列表
     * @param int $iOrderId 订单ID
     */
    public function getOrderReceivedList($iOrderId = 0) {
        $order_received_model = new OrderReceived;
        
        return $order_received_model->getPayLists(['order_id' => $iOrderId]);
    }
    
    /**
     * 删除订单
     * @param int $iOrderId 订单ID
     */
    public function deleteOrder($iOrderId = 0) {
        $order_object = OrderModel::get($iOrderId, 'relationToOrderReceived');
        
        return $order_object->together('relationToOrderReceived')->delete();
    }
    
    /**
     * 检查订单对账状态
     * @param int $iOrderId 订单ID
     * @return boolean
     */
    public function checkOrderReceivedStatus($iOrderId = 0) {
        // 订单总金额(订单产品价格总和)
        $total_price = OrderModel::where('order_id', $iOrderId)->value('total_price');
        //支付对账成功的金额总和
        $received_success_price = OrderReceived::where('order_id', $iOrderId)
                    ->where('order_received_status', 2)
                    ->sum('order_received_price');
        if ($received_success_price < $total_price) {
            return false;
        }
        
        return true;
    }
    
    /**
     * 退款-获得订单内容列表
     * @param type $iOrderId 订单ID
     * @return array
     */
    public function getOrderContentList($iOrderId = 0) {
        $ret = [];
        $all_order_content_list = OrderContent::where('order_id', $iOrderId)
                ->alias('oc')
                ->field(['oc.order_content_refund_status as order_content_refund_status_1, oc.*, cp.content_price, c.content_name'])
                ->join(['oms_content_price' => 'cp'], 'oc.execute_content_price_id=cp.content_price_id')
                ->join(['oms_content' => 'c'], 'cp.content_id=c.content_id')
                ->select();
        foreach ($all_order_content_list as $item) {
            $ret[$item['order_content_id']] = $item;
        }
        $result = OrderProduct::where('order_id', $iOrderId)
                ->alias('op')
                ->field(['p.product_name, op.product_id, op.order_id, op.order_product_id, op.order_product_status as is_end'])
                ->with(['orderContentList' => function($query){
                    $query->withField('order_content_id,order_content_no');
                }])
                ->join(['oms_product' => 'p'], 'p.product_id=op.product_id')
                ->select();
        foreach ($result as $order_product) {
            foreach ($order_product['order_content_list'] as &$order_content) {
                $order_content['order_content_price'] = $ret[$order_content['order_content_id']]['content_price'];
                $order_content['order_content_name']  = $ret[$order_content['order_content_id']]['content_name'];
                $order_content['order_content_refund_status_1']  = $ret[$order_content['order_content_id']]['order_content_refund_status_1'];  // 订单内容退款状态，int，order_content_refund_status字段已转换为文本显示了
            }
        }
        
        return $result;
    }
    
    /**
     * 获得退款渠道列表、账户列表
     * @param int $iOrderId 订单ID
     * @return array
     */
    public function getRefundWayList($iOrderId = 0) {
        $ret = ['ali' => [], 'bank' => []];
        $received_pay_log_list =  OrderReceived::where('order_id', $iOrderId)
                ->alias('or')
                ->field(['or.order_received_id, pay_way,pay_account, customer_account, customer_bank'])
                ->where('order_received_status', 2)
                ->join(['oms_pay_log' => 'pl'], 'or.order_received_id=pl.order_received_id')
                ->group('customer_account,pay_way')
                ->select()
                ->toArray();
        
        foreach ($received_pay_log_list as $value) {
            // 账户列表需要去重
            $tmp['order_received_id'] = $value['order_received_id'];
            $tmp['customer_account']  = $value['customer_account'];
            $tmp['customer_bank']     = $value['customer_bank'];
            
            switch ($value['pay_way']) {
                case 3:
                    $ret['ali'][] = $tmp;
                    break;
                case 4:
                    $ret['bank'][] = $tmp;
                    break;
            }
        }
        
        return $ret;
    }
    
    /**
     * 验证退款金额，不能大于最大退款金额
     * 
     * @param array $arrData  退款数据
     * @return boolean
     */
    public function checkRefundAmount($arrData = []) {
        $order_content_id_tmp = [];

        if (intval($arrData['refund_type']) == ApprovalModel::APPROVAL_TYPE_BREAK) {//违约退款
            $func = function($order_content_id) {
                return intval($order_content_id);
            };
            $func_1 = function($price) {
                return sprintf_price($price);
            };
            $order_content_id_tmp = array_map($func, $arrData['order_content_id_arr']);
            $order_content_list_info = OrderContent::whereIn('order_content_id', $order_content_id_tmp)
                    ->alias('oc')
                    ->field(['oc.*, cp.content_price'])
                    ->leftJoin('oms_content_price cp', 'oc.execute_content_price_id=cp.content_price_id')
                    ->select()
                    ->toArray();
            
            $refund_amount_max = array_sum(array_map($func_1, array_column($order_content_list_info, 'content_price')));
            if (sprintf_price($arrData['refund_amount']) > $refund_amount_max) {
                return false;
            }
        } elseif (intval($arrData['refund_type']) == ApprovalModel::APPROVAL_TYPE_DEPOSIT) {//暂存款退款
            $temp_deposit_price = OrderModel::where('order_id', intval($arrData['order_id']))->value('temp_deposit_price');
            if (sprintf_price($arrData['refund_amount']) > sprintf_price($temp_deposit_price)) {
                return false;
            }
        }
        return true;
    }
    
    
    /**
     * 发起退款
     * @param array $arrData
     * @param int $iUserId
     */
    public function applyRefund($arrData = [], $iUserId=0) {
        //写入approval表
        $approval_data['approval_type']   = intval($arrData['refund_type']);
        $approval_data['order_id']        = intval($arrData['order_id']);
        $approval_data['user_id']         = $iUserId;
        $approval_data['approval_status'] = 200;  //审批完成(已退款)
        $approval_object = ApprovalModel::create($approval_data, ['approval_type', 'order_id', 'user_id', 'approval_status']);
        
        //写入approval_refund表
        $approval_refund_data['approval_id']       = $approval_object['approval_id'];
        $approval_refund_data['refund_amount']     = floatval($arrData['refund_amount']);
        $approval_refund_data['refund_channel']    = intval($arrData['refund_channel']);
        $approval_refund_data['order_received_id'] = intval($arrData['order_received_id']);
        $approval_refund_data['refund_reason']     = $arrData['refund_reason'];
        if (!empty($arrData['refund_file'])) {
            $approval_refund_data['refund_file'] = json_encode($arrData['refund_file']);
        }
        $approval_refund_object = ApprovalRefundModel::create($approval_refund_data);

        if (intval($arrData['refund_type']) == ApprovalModel::APPROVAL_TYPE_BREAK) {//违约退款
            // 写入approval_order_content表
            foreach ($arrData['order_content_id_arr'] as $order_content_item) {
                $tmp['approval_id'] = $approval_object['approval_id'];
                $tmp['order_content_id'] = $order_content_item;
                $tmp['approval_status']  = 200;
                $tmp['finish_time']      = format_time();
                $approval_content_data[] = $tmp;
            }
            $approval_content_model = new ApprovalContentModel;
            $approval_content_model->saveAll($approval_content_data);
            
            //更新order_content表 order_content_refund_status字段为已退款状态
            OrderContent::whereIn('order_content_id', $arrData['order_content_id_arr'])
                    ->update(['order_content_refund_status' => 2]);
            
            // 更新订单金额：order_price = 原订单金额 - 违约已退款内容金额总和
            $approval_model = new ApprovalModel;
            $break_refund_sum = $approval_model->getBreakRefundAmount(intval($arrData['order_id']));  // 计算违约已退款内容金额总和    
            $order_info = OrderModel::get(intval($arrData['order_id']));
            
            OrderModel::where('order_id', intval($arrData['order_id']))->update(['order_price' => floatval($order_info['total_price']) - $break_refund_sum]);
        } elseif (intval($arrData['refund_type']) == ApprovalModel::APPROVAL_TYPE_DEPOSIT) {//暂存款退款
            // 重新计算暂存款退款金额
            $temp_deposit_amount = $this->_calculateTempDepositRefundAmount(intval($arrData['order_id']));
            OrderModel::where('order_id', intval($arrData['order_id']))
                    ->update(['temp_deposit_price' => $temp_deposit_amount]);
        }
        
        return $approval_refund_object['approval_refund_id'];
    }
    
    /**
     * 计算暂存款退款金额
     * @param int $iOrderId 订单ID
     * @return float
     */
    protected function _calculateTempDepositRefundAmount($iOrderId = 0) {
        // 暂存款 = 支付对账金额 - 原订单金额 - 已退款暂存款总和
        $order_ordel = OrderModel::getInstance();
        return $order_ordel->calculateTempRefund($iOrderId, 0.0);
    }
    
    /**
     * 获得退款列表
     * @param int $iOrderId 订单ID
     * @return array
     */
    public function getRefundListByOrderId($iOrderId = 0) {
        $ret = $tmp = $content_id_tmp = [];
        
        $result = ApprovalModel::where('a.order_id', $iOrderId)
                ->alias('a')
                ->field(['a.approval_type, a.approval_type as refund_type,a.order_id,a.approval_apply_time,a.approval_status,ar.*,c.content_name, cp.content_id'])
                ->join(['oms_approval_refund' => 'ar'], 'a.approval_id=ar.approval_id')
                ->leftJoin(['oms_approval_content' => 'ac'], 'a.approval_id=ac.approval_id')
                ->leftJoin(['oms_order_content' => 'oc'], 'ac.order_content_id=oc.order_content_id')  
                ->leftJoin(['oms_content_price' => 'cp'], 'oc.execute_content_price_id=cp.content_price_id')
                ->leftJoin(['oms_content' => 'c'], 'cp.content_id=c.content_id')
                ->order('a.approval_id', 'DESC')
                ->select();

        foreach ($result as &$refund_item) {
            if (!in_array($refund_item['approval_id'], $tmp)) {
                array_push($tmp, $refund_item['approval_id']);
                $content_id_tmp[$refund_item['approval_id']] = [];
                
                $ret[$refund_item['approval_id']]['approval_type']       = $refund_item['approval_type'];          // 退款类型
                $ret[$refund_item['approval_id']]['approval_id']         = $refund_item['approval_id'];
                $ret[$refund_item['approval_id']]['approval_apply_time'] = $refund_item['approval_apply_time'];    // 申请时间
                $ret[$refund_item['approval_id']]['refund_amount']       = $refund_item['refund_amount'];
                // 违约退款，概要不能重复，重复的只显示一次
                if (!in_array($refund_item['content_id'], $content_id_tmp[$refund_item['approval_id']])) {
                    array_push($content_id_tmp[$refund_item['approval_id']], $refund_item['content_id']);
                    $ret[$refund_item['approval_id']]['summary']         = $refund_item['content_name'] ?: '-';   //概要,暂存款退款显示'-'
                }
                
                //退款状态
                switch ($refund_item['approval_status']) {
                    case 100:
                        $ret[$refund_item['approval_id']]['refund_status'] = '退款中';
                        break;
                    case 200:
                        $ret[$refund_item['approval_id']]['refund_status'] = '已退款';
                        break;
                    case 300:
                        $ret[$refund_item['approval_id']]['refund_status'] = '已拒绝';
                        break;
                }
            } else {
                // 违约退款，概要不能重复，重复的只显示一次
                if (!in_array($refund_item['content_id'], $content_id_tmp[$refund_item['approval_id']])) {
                    array_push($content_id_tmp[$refund_item['approval_id']], $refund_item['content_id']);
                    $ret[$refund_item['approval_id']]['summary'] .= ',' . ($refund_item['content_name'] ?: '');
                }
            }
        }

        return array_values($ret);
    }
    
    /**
     * 获得客户信息
     * @param int $iCustomerId 客户ID
     * @return array
     */
    public function getCustomerInfo($iCustomerId = 0) {
        $result = CustomerModel::get($iCustomerId);
        
        return $result;
    }
    
    /**
     * 获得产品类型-产品-内容列表
     * 淘大培训，产品类型是三级
     */
    public function getProductCategoryList() {
        $product_category_logic = new ProductCategoryLogic;
        $first_level_product_category_name = ProductCategory::where('product_category_id', 4)->value('product_category_name');  // 淘大培训的product_category_id为4
   
        $second_level_product_category_list = $product_category_logic->getSecondProductCategoryList();
        foreach ($second_level_product_category_list as $key => &$item) {
            $item['product_category_name'] = $first_level_product_category_name . '-' . $item['product_category_name'];
            // 获得产品列表
            $product_model = new Product;
            $product_content_price_logic = new ProductContentPrice;
            
            // 二级类型下所有三级子类型的产品列表
            $pd_list = $product_model->getProductList(intval($item['product_category_id']));
            //如果此类型下没有打单中的产品, 则该类型不显示
            if (empty($pd_list)) {
                unset($second_level_product_category_list[$key]);
                continue;
            }
            
            // 获得产品的内容列表
            foreach ($pd_list as &$product_item) {
                // TODO:下个版本优化
                $product_item['content_list'] = $product_content_price_logic->getContentList(intval($product_item['product_id']));
            }
            $item['product_list'] = $pd_list;
        }

        return $second_level_product_category_list;
    }
 
}
