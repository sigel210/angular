<?php

namespace app\sale\validate;

use think\Validate;

class Order extends Validate {
    protected $rule = [
        'customer'  => 'require|max:20',
        'customer1' => 'max:20',
        'order_received_date' => 'require',
        'order_sign_type' => 'require',
        'order_sign_name' => 'max:20',
        'order_sign_card_id' => 'max:18',
        'order_sign_phone' => 'require|max:15',
        'is_new' => 'require',
        'order_remarks'      => 'max:200',
        'order_sign_authorize' => 'max:20',
        'order_sign_company' => 'max:20',
        'order_sign_address' => 'max:50',
        'buy_product_list'   => 'require',
        'order_id' => 'require',
        'refund_channel' => 'require',
        'refund_amount'  => 'require',
        'refund_amount' => 'gt:0',
        'order_received_id' => 'require', 
        'refund_reason'     => 'require|max:200',
        'order_creater'     => 'max:10',
        'order_no'          => 'max:25',
    ];
    
    protected $message = [
        'customer.require'            => '客户名称不能为空',
        'customer.max'                => '客户名称最多输入20个字符',
        'customer1.max'               => '客户名称最多输入20个字符',
        'order_received_date.require' => '到单日期不能为空',
        'order_sign_type.require'     => '签约方式不能为空',
        'order_sign_name.max'         => '签约人字段最长20字符',
        'order_sign_card_id.max'      => '身份证号码字段最长18字符',
        'order_sign_phone.require'    => '联系人字段不能为空',
        'order_sign_phone.max'        => '联系人字段最长15个字符',
        'is_new.require'              => '签约类型不能为空',
        'order_remarks.max'           => '订单说明最长200个字符',
        'order_sign_authorize.max'    => '签约授权人最长20个字符',
        'order_sign_company.max'      => '公司名称最长20个字符',
        'order_sign_address.max'      => '办公地址最长50个字符',
        'buy_product_list.require'    => '购买的产品列表不能为空',
        'order_id.require'            => '订单ID不能为空',
        'refund_channel.require'      => '退款渠道必须选择',
        'refund_amount.require'       => '请填写退款金额',
        'refund_amount.gt'            => '退款必须大于0',
        'order_received_id.require'   => '退款账户必须选择',
        'refund_reason.require'       => '请填写退款理由',
        'refund_reason.max'           => '退款理由最大长度200字符',
        'order_creater'               => '订单创建人字段最长输入10个字符',
        'order_no'                    => '订单编号字段最长输入25个字符',
    ];
    
    protected $scene = [
        'check_customer' => ['customer'],
        // 公司签约
        'insert_company' => [
            'customer', 'order_received_date','order_sign_phone', 'is_new', 'order_sign_type', 'order_remarks',
            'order_sign_authorize', 'order_sign_company', 'order_sign_address', 'buy_product_list'
        ],
        // 个人签约
        'insert_individual' => [
            'customer', 'order_received_date', 'order_sign_name', 'order_sign_card_id', 'order_sign_phone', 'order_sign_type',
            'buy_product_list', 'order_remarks', 'order_sign_phone', 'is_new',
        ],
        'refund' => ['order_id', 'refund_type', 'refund_channel', 'refund_amount', 'order_received_id', 'refund_reason'],
        'search_order' => ['customer1', 'order_creater', 'order_no'],
    ];
    

    
    
}
