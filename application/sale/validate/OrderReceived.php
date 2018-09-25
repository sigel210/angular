<?php
/**
 * Created by PhpStorm.
 * User: lcp
 * Date: 2018/8/6
 * Time: 9:57
 */

namespace app\sale\validate;

use think\Validate;

class OrderReceived extends Validate
{
    protected $rule = [
        'order_id' => 'require|integer',
        'received_pay_way' => 'require|in:1,2,3,4',
        'order_received_price' => 'require|float|between:0.01,100000000.00',
        'received_trade_no' => 'require|alphaNum|max:50|unique:order_received',
        'received_pay_name' => 'require|max:100',
        'received_pay_date' => 'require|date',
        'order_received_id' => 'require|integer',
    ];
    protected $message = [
        'order_id.require' => '订单ID不能为空',
        'received_pay_way.require' => '支付类型不能为空',
        'received_pay_way.in' => '支付类型错误',
        'order_received_price.require' => '支付金额不能为空',
        'order_received_price.float' => '支付金额格式错误',
        'order_received_price.between' => '支付金额必须在0.01:100000000.00之间',
        'received_trade_no.require' => '交易号不能为空',
        'received_trade_no.alphaNum' => '交易号必须1-50位数字或字母',
        'received_trade_no.max' => '交易号不能超过50个字符',
        'received_trade_no.unique' => '交易号重复',
        'received_pay_name.require' => '付款人不能为空',
        'received_pay_name.max' => '付款人不能超过100个字符',
        'received_pay_date.require' => '到账日期不能为空',
    ];
    protected $scene = [
        'add_pay' => ['received_pay_way', 'order_received_price', 'received_pay_name', 'received_pay_date'],
        'edit_pay' => ['order_received_id', 'received_pay_way', 'order_received_price', 'received_pay_name', 'received_pay_date'],
        'order_id' => ['order_id'],
        'order_received_id' => ['order_received_id'],
        'received_trade_no' => ['received_trade_no'],
        'taoda_add_alipay' => ['received_pay_way', 'order_received_price', 'received_trade_no', 'received_pay_date'],
        'taoda_edit_alipay' => ['order_received_id', 'received_pay_way', 'order_received_price', 'received_trade_no', 'received_pay_date'],
    ];
}