app.registerService('contentManagementsNet', ['$Ajax', '$rootScope', function ($Ajax, $rootScope) {
	var http = $rootScope.http;
	this.getList = function (pageIndex, filters, scope, pageConfig) {
		var url = http + '/product/Content/index';
		return $Ajax.getList2(url, pageIndex, filters, scope, pageConfig);
	};
	this.getDetail = function (req) {//详情
		var url = http + '/product/Content/detail';
		return $Ajax.post(url, req);
	};
	this.addContent = function (req) {//新增
		var url = http + '/product/Content/insert';
		return $Ajax.post(url, req);
	};
	this.editContent = function (req) {//编辑
		var url = http + '/product/Content/edit';
		return $Ajax.post(url, req);
	};
	this.delete = function (req) {//删除
		var url = http + '/product/Content/delete';
		return $Ajax.post(url, req);
	};
	this.getTypeList = function () {
		var url = http + '/product/Content/category';
		return $Ajax.get(url);
	};
}]);