<?php
namespace app\finance\validate;

use think\Validate;

class TradeFlow extends Validate {
    protected $rule = [
        'trade_no'  => 'max:50',
        'pay_log_id' => 'require',
        'pay_way' => 'require|in:1,2,3,4',
        'trade_no_1' => 'require|max:35',
        'pay_amount' => 'require|between:0.01,100000000.00',
        'income_time' => 'require',
        'pay_name' => 'require'
    ];
    
    protected $message = [
        'trade_no.max' => '交易号最多输入50个字符',
        'pay_log_id.require' => '参数错误',
        'pay_way.require' => '支付类型不能为空',
        'pay_way.in' => '支付类型错误',
        'pay_name.require'   => '请填写付款人',
        'pay_amount.require'  => '请填写支付金额',
        'pay_amount.between'  => '支付金额范围错误',
        'income_time.require' => '请填写支付时间',
        'trade_no_1.require'  => '请填写交易号',
        'trade_no_1.max'      => '交易号最多输入35个字符',
    ];
    
    protected $scene = [
        'search' => ['trade_no'],
        'delete' => ['pay_log_id'],
        'pay_way' => ['pay_way'],
        'update_taoda_alipay' => ['pay_log_id', 'pay_amount', 'income_time', 'trade_no_1'],
        'update_taoda_bank'   => ['pay_log_id', 'pay_name', 'pay_amount', 'income_time'],
    ];

}
