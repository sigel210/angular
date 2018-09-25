app.registerService('executionNetService', ['$Ajax', '$rootScope', function ($Ajax, $rootScope) {
  var http = $rootScope.http;
  this.getList = function (page, filters, scope) {//获取列表
    var url = http + '/operation/ExecuteList/index';
    return $Ajax.getList2(url, page, filters, scope);
  };
  this.getTypeList = function(){
		var url = http + '/product/Content/category';
		return $Ajax.get(url);
	};
}]);