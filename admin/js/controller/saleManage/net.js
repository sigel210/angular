app.registerService('SaleNetService', ['$Ajax', '$rootScope', function ($Ajax, $rootScope) {
    var http = $rootScope.http;
    this.getOrderList =  function(pageIndex,filters,scope,pageConfig) {
        var url = http + '/sale/Order/index';
        return $Ajax.getList2(url,pageIndex,filters,scope,pageConfig);
    };
}]);