app.registerCtrl("contentManagements",["$scope","contentManagementsNet","$prompt","CommonService",function($scope,contentManagementsNet,$prompt,CommonService){
	$scope.uiModel = {
		filters:{
			content_name:"",
			start_time:"",
			end_time:"",
			content_status:"",
		},
		content_status_list : [
			{content_status:1,title:"未打单"},
			{content_status:2,title:"打单中"},
			{content_status:3,title:"打单关闭"},
			{content_status:4,title:"执行中"},
			{content_status:5,title:"已完结"},
		],
	};
	$scope.page = { //主列表页页码配置
		pageIndex: 1,
		pageSize: 10,
		total: 0,
		pageCount: 0,
	};
	//保存原始参数
	$scope.orginFilters = angular.copy($scope.uiModel.filters);
	$scope.orginPage = angular.copy($scope.page);
	$scope.getList = function(){
		contentManagementsNet.getList($scope.page,$scope.uiModel.filters,$scope).then(function(res){
			if(res.data.code){
				$scope.page.pageIndex = res.data.index;
				$scope.page.total = res.data.page.total;
				$scope.page.pageCount = res.data.page.page_total;
				$scope.list = res.data.wzlist;
			}
		});
	};
	$scope.getList();
	//搜索
	$scope.search = function(){
		$scope.getList();
	};
	//清空
	$scope.reset = function(){
		$scope.uiModel.filters = angular.copy($scope.orginFilters);
		$scope.uiModel.filtes.wzstatus = $scope.tabIndex;
		$scope.page = angular.copy($scope.orginPage);
		$scope.getList();
	};
	$scope.detailsWrap = {
		data:{},
		hide: function () {
			$(".js-slide-right-wrap").animate({ "right": -700 }, 500);
			$scope.temp = "noclass";
		},
		show: function () {
			$(".js-slide-right-wrap").stop().css("right", -700);
			$(".js-slide-right-wrap").show().animate({ "right": 0 }, 500);
			$scope.contHeight();
			$(".slide-cont").scrollTop(0);
		}
	};
	$scope.temp = "noclass";//列表行选中样式
	$scope.showDetail = function(id, index){
		$scope.temp = index;
		contentManagementsNet.getDetail(id).then(function(res){
			if(res.data.code){
				$scope.detailsWrap.data = res.data.data;
			}else{
				$prompt.timeout($scope,res);
			}
		});
	};
}]);