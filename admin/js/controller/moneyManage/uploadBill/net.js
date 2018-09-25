app.registerService('uploadBillNetService',['$Ajax','$rootScope',function($Ajax,$rootScope){
    var http = $rootScope.http;
    this.import = function(req){
        var url = http + '/finance/PayLog/import';
        return $Ajax.fileUpload(url,req);
    };
    this.saveReport = function(){
        var url = http + '/finance/PayLog/getTemp';
        return $Ajax.get(url);
    };
}]);