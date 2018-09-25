// 客户订单服务
app.registerService('CustomerOrderService', function () {
    // 校验支付信息
    this.checkBill = function (data) {
        if (!data.order_received_price) {
            return '请输入支付金额';
        } else if (!data.received_pay_name && data.received_pay_way != 3) {
            return '请输入付款人';
        } else if (!data.received_trade_no && data.received_pay_way == 3) {
            return '请输入交易号';
        } else if (!data.received_pay_date) {
            return '请选择到账日期';
        }
    };
});