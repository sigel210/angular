app.registerCtrl('contentAdd', ['$scope', '$prompt', 'contentManagementsNet', '$state', 'UserService', function ($scope, $prompt, contentManagementsNet, $state, UserService) {
	//权限控制
	// $scope.permission = {
	// 	down:UserService.hasPermission(1479),
	// };
	$scope.getTypeList = function () {
		contentManagementsNet.getTypeList().then(function (res) {
			if (res.data.code == 1) {
				$scope.typeList = res.data.data;
			} else {
				$prompt.timeout($scope, res);
			}
		});
	};
	$scope.getTypeList();
	$scope.firstSelect = function (firstContent) { //选中一级显示二级下拉
		$scope.secondContentList = firstContent.junior_category;
	};
	$scope.secondSelect = function (secondContent) { //选中二级显示三级下拉
		$scope.thirdContentList = secondContent.junior_category;
	};
	$scope.clearList = function () {//一级清空，清空二级三级下拉
		$scope.firstContent = '';
		$scope.secondContentList = [];
		$scope.clearList_second();
	};
	$scope.clearList_second = function () {//二级清空，清空三级下拉
		$scope.secondContent = '';
		$scope.thirdContent = '';
		$scope.thirdContentList = [];
	};
	$scope.save = function () {
		if (!$scope.firstContent) {
			$prompt.timeout($scope, {
				code: 500,
				msg: '请选择一级内容类型'
			});
			return;
		} else if (!$scope.secondContent) {
			$prompt.timeout($scope, {
				code: 500,
				msg: '请选择二级内容类型'
			});
			return;
		} else if ($scope.firstContent.content_category_id != 47 && !$scope.thirdContent) {
			$prompt.timeout($scope, {
				code: 500,
				msg: '请选择三级内容类型'
			});
			return;
		} else if (!$scope.content_name) {
			$prompt.timeout($scope, {
				code: 500,
				msg: '请输入内容名称'
			});
			return;
		} else {
			var data;
			if ($scope.firstContent.content_category_id != 47) {
				data = {
					content_category_id: $scope.thirdContent.content_category_id,
					content_name: $scope.content_name,
					content_desc: $scope.content_desc || '',
				};
			} else {
				data = {
					content_category_id: $scope.secondContent.content_category_id,
					content_name: $scope.content_name,
					content_desc: $scope.content_desc || '',
				};
			}
			contentManagementsNet.addContent(data).then(function (res) {
				if (res.data.code == 1) {
					$prompt.timeout($scope, {
						code: 1,
						msg: '新建成功'
					}, function () {
						window.history.back();
					});
				} else {
					$prompt.timeout($scope, res);
					return;
				}
			});
		}
	};
}]);