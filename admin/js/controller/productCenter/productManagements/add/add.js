app.registerCtrl('productsAdd', ['$scope', '$prompt', 'productManagementsNet', 'ContentCheckedService', '$confirm_cancel', '$state', 'UserService', function ($scope, $prompt, productManagementsNet, ContentCheckedService, $confirm_cancel, $state, UserService) {
	$scope.isAjaxing = false;//防止重复点击
	$scope.init = function () {
		$scope.productList = function () {
			productManagementsNet.selectList().then(function (res) {
				$scope.productList = res.data.data;//一级下拉
			});
		};
		$scope.productList();
		$scope.secondProductList = [];//二级下拉
		$scope.sallingList = [
			{ product_switch: 2, product_switch_name: '开' },
			{ product_switch: 1, product_switch_name: '关' },
		];
		$scope.contentList = [];// 存储添加的内容
	};
	$scope.firstSelect = function () { // 一级产品类型选择触发 联动二级产品类型
		$scope.second_product = '';
		$scope.secondProductList = $scope.first_product.junior_category; //选中一级，获取二级列表
	};
	$scope.secondSelect = function () { //二级产品类型选中，联动三级产品类型
		$scope.third_product = '';
		$scope.thirdProductList = $scope.second_product.junior_category; //选中二级，获取三级列表
	};
	$scope.clear = function () {
		$scope.second_product = '';
		$scope.third_product = '';
		$scope.thirdProductList = [];
	}
	$scope.clearList = function (type) { //点击一级产品清空按钮与二级产品类型联动
		if (type == 1) {//点击一级产品类型清空 
			$scope.first_product = '';
			$scope.secondProductList = [];//新增三级产品类型
			$scope.clear();
		} else if (type == 2) {//
			$scope.clear();
		}
	};
	// 内容添加弹窗列表
	$scope.uiModel = {//获取内容添加 列表页 参数配置
		filters: {
			content_name: '',
		}
	};
	$scope.page = {// 页码配置
		page_no: '',
		pageSize: 10,
		total: 0,
		pageCount: 0,
	};
	$scope.orginPages = angular.copy($scope.page); //保存原始页码配置
	$scope.orginFilters = angular.copy($scope.uiModel.fitlers); //保存原始参数配置
	$scope.getContentList = function (pageIndex) { // 获取内容添加列表
		$scope.checkedModel.checkedNum = 0;
		productManagementsNet.getContentAddList(pageIndex, $scope.orginFilters, $scope, { page_size: $scope.page.page_size }).then(function (res) {
			if (res.data.code) {
				$scope.page.page_no = res.data.page_info.page_no;
				$scope.page.total = res.data.page_info.total;
				$scope.page.pageCount = res.data.page_info.page_count;
				$scope.list = res.data.data;
			}
			$scope.contentList.forEach(function (item) {
				$scope.list.forEach(function (item0) {
					if (item0.content_id == item.content_id) {//每次翻页确定是否该内容已被选中，若是，则在checkedList添加
						var index = $scope.checkedModel.checkedList.map(item1 => item1.content_id).indexOf(item.content_id);
						if (index == -1) {
							$scope.checkedModel.checkedList.push(item0);
						}
					}
				});
			});
			$scope.checkedModel.checkedListNow = ContentCheckedService.checked.defaultChecked($scope.checkedModel.checkedList, $scope.list);//配置默认勾选项
			$scope.checkedModel.checkedListNow.forEach(function (item) {
				if (item.checked) {
					$scope.checkedModel.checkedNum++;
				}
			})
		});

	};
	$scope.search = function () {
		$scope.orginFilters = angular.copy($scope.uiModel.filters);
		$scope.page.page_no = 1;
		$scope.getContentList();
	};
	$scope.reset = function () {
		$scope.uiModel.filters = angular.copy($scope.orginPages);
		$scope.page = angular.copy($scope.orginPages);
		$scope.getContentList();
	};
	$scope.list = [];
	$scope.editModal = {//内容添加弹窗配置
		title: '内容添加',
		isShow: false,
		show: function () {
			$scope.getContentList();
			this.isShow = true;
		},
		hide: function () {
			this.isShow = false;
		},
		confirm: function () {
			if ($scope.checkedModel.checkedList.length > 10) {
				$prompt.timeout($scope, {
					code: 500,
					msg: '最多可添加10条内容',
				});
				return;
			}
			// $scope.contentList = [];//每次点击确定成功的话需要清空重新构建
			$scope.checkedModel.checkedList.forEach(function (item) {
				var index = $scope.contentList.map(item0 => item0.content_id).indexOf(item.content_id);
				if (index == -1) {
					$scope.contentList.push(
						{
							content_id: item.content_id,//记录id用于删除
							content_category: item.content_category,
							content_name: item.content_name,
							content_price: item.content_price || 0.00,
							content_num: item.content_num || 1,
						}
					);
				}
			});
			for (var i = $scope.contentList.length - 1; i >= 0; i--) {//点击取消勾选 默认从contentList中删除
				var index = $scope.checkedModel.checkedList.map(item0 => item0.content_id).indexOf($scope.contentList[i].content_id);
				if (index == -1) {
					$scope.contentList.splice(i, 1);
				}
			}
			$scope.editModal.hide();
			$scope.addPrice($scope.contentList);
		},
	};
	$scope.checkedModel = {
		checkedList: [],//保存全部勾选
		checkedListNow: [],//保存当前列表页状态，用于默认勾选
		checkedNum: 0,
		checkedAll: function (event) {
			$scope.checkedModel.checkedList = ContentCheckedService.checked.checkedAll(event, $scope.list, $scope.checkedModel.checkedList);
			if (event.target.checked) {
				$scope.checkedModel.checkedListNow.forEach(function (item) {
					item.checked = true;
				});
				$scope.checkedModel.checkedNum = $scope.list.length;
			} else {
				$scope.checkedModel.checkedListNow.forEach(function (item) {
					item.checked = false;
				});
				$scope.checkedModel.checkedNum = 0;
			}
		},
		checked: function (event, item, index) {
			$scope.checkedModel.checkedList = ContentCheckedService.checked.checked(event, item, $scope.checkedModel.checkedList);
			if (event.target.checked) {
				$scope.checkedModel.checkedListNow[index].checked = true;
				$scope.checkedModel.checkedNum++;
			} else {
				$scope.checkedModel.checkedListNow[index].checked = false;
				$scope.checkedModel.checkedNum--;
			}
		}
	};
	//数量 输入框输入限制
	$scope.replaceNum = function (num, index) {
		$scope.contentList[index].content_num = ContentCheckedService.replaceNum(num);
	}
	//价格 输入限制
	$scope.replacePrice = function (price, index) {
		$scope.contentList[index].content_price = ContentCheckedService.replacePrice(price);
	}
	$scope.numAdd = function (content_num, index) {//点击增加按钮
		if (content_num >= 100) {
			$prompt.timeout($scope, {
				code: 500,
				msg: '最大数量为100，无法再增加'
			});
		} else {
			content_num++;
			$scope.contentList[index].content_num = content_num;
			$scope.addPrice($scope.contentList);
		}
	};
	$scope.numDiscount = function (content_num, index) {//点击减少按钮
		if (content_num == 1) {
			$prompt.timeout($scope, {
				code: 500,
				msg: '最小数量为1，无法再减少'
			});
		} else {
			content_num--;
			$scope.contentList[index].content_num = content_num;
			$scope.addPrice($scope.contentList);
		}
	};
	$scope.addPrice = function (contentList) {
		$scope.all_price = 0;
		contentList.forEach(function (item) {
			if (item.content_price) {
				$scope.all_price += parseFloat(item.content_price) * parseFloat(item.content_num);
			}
		});
	};
	$scope.delete = function (item, index) {//删除
		var indexCopy = index;
		$confirm_cancel.show({
			id: 'uiViews',
			title: '删除确认',
			text: '确定删除' + item.content_name + '此项内容吗？',
			buttons: [{
				text: '确定',
				ontap: function () {
					$confirm_cancel.hide().then(function () {
						$scope.contentList.splice(indexCopy, 1);
						$scope.checkedModel.checkedList.splice(indexCopy, 1);
						$scope.addPrice($scope.contentList);
					});
				}
			}],
			scope: $scope
		});
	};
	$scope.save = function () {// 点击保存校验 
		if ($scope.isAjaxing) return;
		if (!$scope.first_product) {
			$prompt.timeout($scope, {
				code: 500,
				msg: '请选择一级产品类型'
			});
			return;
		} else if (!$scope.second_product) {
			$prompt.timeout($scope, {
				code: 500,
				msg: '请选择二级产品类型'
			});
			return;
		} else if (!$scope.product_name) {
			$prompt.timeout($scope, {
				code: 500,
				msg: '请输入产品名称'
			});
			return;
		} else if (!$scope.product_switch) {
			$prompt.timeout($scope, {
				code: 500,
				msg: '请选择打单开关'
			});
			return;
		} else if (!$scope.contentList.length) {
			$prompt.timeout($scope, {
				code: 500,
				msg: '请添加内容'
			});
			return;
		} else {
			$scope.flag = true;
			for (var i = 0; i < $scope.contentList.length; i++) {
				if ($scope.contentList[i].content_price!=0 && !$scope.contentList[i].content_price) {
					$prompt.timeout($scope, {
						code: 500,
						msg: $scope.contentList[i].content_name + '价格不可为空'
					});
					$scope.flag = false;
					break;
				}
			}
			if($scope.all_price <= 0){
				$prompt.timeout($scope,{
					code:500,
					msg:'产品价格不可为0'
				})
				$scope.flag = false;
			}
			if ($scope.flag) {
				var data = {
					product_name: $scope.product_name,
					product_switch: $scope.product_switch,
					product_price: $scope.all_price,
					product_status: $scope.product_switch,
					contents: $scope.contentList,
					product_remarks: $scope.product_remarks || '',
				};
				if($scope.first_product.product_category_id == 4){
					data.product_category_id = $scope.third_product.product_category_id;
				}else{
					data.product_category_id = $scope.second_product.product_category_id;
				}
				productManagementsNet.productAdd(data).then(function (res) {
					if (res.data.code) {
						$scope.isAjaxing = true; //防止重复点击
						$prompt.timeout($scope, {
							code: 1,
							msg: '添加成功'
						}, function () {
							window.history.back();
						});
					} else
						$prompt.timeout($scope, res);
				});
			}
		}
	};
	$scope.confirm = function () { //新建完成
		$scope.save();
	};
	$scope.init();
}]);