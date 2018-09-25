/*
 Message net服务
 author:
 create: 2017-9-11 14:26:23
 */
app.registerService('FinanceNetService', ['$Ajax', 'UserService', '$rootScope', function ($Ajax, UserService, $rootScope) {
    var http = $rootScope.http;
    // eg
    this.financeTotal = function () {
        var url = http + '/Finance/Statistics/financeTotality';
        return $Ajax.get(url);
    };

    // 退款管理--同意/拒绝
    this.refundAuditSuccess = function (data) {
        var url = http + '/Finance/Refund/approval_pending&' + $.param(data);
        return $Ajax.get(url);
    };

    // 交易流水对账
    this.getTransactionList = function (pageIndex, filters, scope, pageConfig) {
        var url = http + '/Finance/TradeFlow/index';
        return $Ajax.getList2(url, pageIndex, filters, scope, pageConfig);
    };

    this.getTransactionDetail = function (req) {
        return $Ajax.get(http + '/finance/TradeFlow/detail&pay_log_id=' + req);
    };

}]);