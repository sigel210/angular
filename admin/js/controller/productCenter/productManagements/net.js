app.registerService('productManagementsNet', ['$Ajax', '$rootScope', '$prompt', function ($Ajax, $rootScope) {
	var http = $rootScope.http;
	//产品类型下拉
	this.selectList = function () {
		var url = http + '/product/Product/category';
		return $Ajax.get(url);
	};
	this.productAdd = function (req) { // 产品添加
		var url = http + '/product/Product/insert';
		return $Ajax.post(url, req);
	};
	this.productEdit = function (req) { // 产品编辑
		var url = http + '/product/Product/edit';
		return $Ajax.post(url, req);
	};
	this.getList = function (page, filters, scope) {//产品列表
		var url = http + '/product/Product/index';
		return $Ajax.getList2(url, page, filters, scope);
	};
	this.getContentAddList = function (page, filters, scope) {//获取内容添加列表
		var url = http + '/product/Product/contentList';
		return $Ajax.getList2(url, page, filters, scope);
	};
	this.getDetail = function (id) {//产品详情
		var url = http + '/product/Product/detail&' + $.param(id);
		return $Ajax.get(url);
	};
	this.delete = function (id) {//删除产品
		var url = http + '/product/Product/delete';
		return $Ajax.post(url, id);
	};
	this.printOrder = function (data) {
		var url = http + '/product/Product/optStatus';
		return $Ajax.post(url, data);
	};
}]);