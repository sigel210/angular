app.registerCtrl("productCenter",["$scope","$rootScope", "$prompt", "UserService", function ($scope, $rootScope, $prompt, UserService) {
	var http = $rootScope.http;
	$scope.$emit("id", "productCenter");
	$scope.menuList = [{
		secondMenuList: [//数据配置
			{
				id: 741,//节点id
				title: "产品管理",//豆腐块名称
				page: "productManagements",//自定义，js页面路由
				icon: "icon-productManagement",// 豆腐块图标
				is_show: true,//权限控制
				is_new:true,//显示为新建模块【可选】
				// payload:{content_type:1}//路由跳转时需要传递的参数【可选】
			},
			{
				id: 742,
				title: "内容管理",
				page: "contentManagements",
				icon: "icon-paperMake",
				is_show:true,
			},
		]
	}];
}]);