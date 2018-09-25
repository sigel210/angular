// 黑曼net服务
app.registerService('OrderHeimanNetService', ['$Ajax', '$rootScope', function ($Ajax, $rootScope) {
    var http = $rootScope.http;
    // 校验名称
    this.checkName = function (req) {
        var url = http + '/sale/Order/checkCustomer';
        return $Ajax.post(url, req);
    };
    // 新建用三级联动结构
    this.getProductCategoryList = function () {
        var url = http + '/sale/Order/getProductCategoryList';
        return $Ajax.get(url);
    };
    // 新建订单
    this.insert = function (req) {
        var url = http + '/sale/Order/insert';
        return $Ajax.post(url, req);
    };
}]);