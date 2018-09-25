app.registerService('CustomerNetService', ['$Ajax', '$rootScope', function ($Ajax, $rootScope) {
    var http = $rootScope.http;
    this.getCustomerInfo = function (req) {
        return $Ajax.post(http + '/sale/Order/getCustomerName', req);
    };
}]);