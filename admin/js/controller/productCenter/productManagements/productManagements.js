app.registerCtrl('productManagements', ['$scope', 'productManagementsNet', '$prompt', '$confirm_cancel', 'ContentCheckedService', 'UserService', '$state', function ($scope, productManagementsNet, $prompt, $confirm_cancel, ContentCheckedService, UserService, $state) {
	//权限控制
	$scope.permission = {
		create: UserService.hasPermission(1480),
		edit: UserService.hasPermission(1481),
		delete: UserService.hasPermission(1482),
		list: UserService.hasPermission(1483),
		detail: UserService.hasPermission(1484),
		down: UserService.hasPermission(1485),
		contentList: UserService.hasPermission(1486),
		product_switch: UserService.hasPermission(1487),
	};
	$scope.uiModel = { //主列表页参数
		filters: {
			product_name: '',
			start_time: '',
			end_time: '',
			product_status: '',
		},
		product_status_list: [
			{ title: '未打单', product_status: 1 },
			{ title: '打单中', product_status: 2 },
			{ title: '打单关闭', product_status: 3 },
		],
		page: { //主列表页页码配置
			page_no: '',
			pageSize: 10,
			total: 0,
			pageCount: 0,
		},
	};

	//保存主列表页原始数据 

	$scope.getList = function (pageIndex) {
		productManagementsNet.getList(pageIndex, $scope.orginUimodel.filters, $scope, { page_size: $scope.orginUimodel.page.page_size }).then(function (res) {
			if (res.data.code) {
				$scope.uiModel.page.page_no = res.data.page_info.page_no;
				$scope.uiModel.page.total = res.data.page_info.total;
				$scope.uiModel.page.pageCount = res.data.page_info.page_count;

				$scope.orginUimodel.page.page_no = res.data.page_info.page_no;
				$scope.orginUimodel.page.total = res.data.page_info.total;
				$scope.orginUimodel.page.pageCount = res.data.page_info.page_count;
				$scope.list = res.data.data;
				$scope.list.forEach(function(item){
                    if(item.product_categorys.length < 3){
                        item.product_categorys.length = 3;
                    }
                });

			}
		});
	};
	$scope.search = function () {//主列表页搜索
		$scope.orginUimodel = angular.copy($scope.uiModel);
		$scope.uiModel.page.page_no = 1;
		$scope.getList();
	};
	//清空
	// $scope.reset = function () {//主列表页清空
	// 	$scope.uiModel.filters = angular.copy($scope.orginFilters);
	// 	$scope.uiModel.page = angular.copy($scope.orginPages);
	// 	$scope.getList();
	// };
	$scope.uiModel0 = { //内容添加列表页参数
		filters: {
			content_name: '',
		}
	};
	$scope.page0 = { //内容添加列表页页码配置
		page_no: '',
		pageSize: 10,
		total: 0,
		pageCount: 0,
	};
	$scope.orginFilters0 = angular.copy($scope.uiModel0.filters);
	$scope.orginPages0 = angular.copy($scope.page0);
	$scope.getContentList = function (pageIndex) { // 获取内容添加列表
		$scope.checkedModel.checkedNum = 0;
		productManagementsNet.getContentAddList(pageIndex, $scope.orginFilters0, $scope, { page_size: $scope.page0.page_size }).then(function (res) {
			if (res.data.code) {
				$scope.page0.page_no = res.data.page_info.page_no;
				$scope.page0.total = res.data.page_info.total;
				$scope.page0.pageCount = res.data.page_info.page_count;
				$scope.list0 = res.data.data;
			}
			$scope.contentList.forEach(function (item) {
				$scope.list0.forEach(function (item0) {
					if (item0.content_id == item.content_id) {//每次翻页确定是否该内容已被选中，若是，则在checkedList添加
						var index = $scope.checkedModel.checkedList.map(item1 => item1.content_id).indexOf(item.content_id);;//点击全选，如果checkedList没有存储，则添加
						if (index == -1) {
							$scope.checkedModel.checkedList.push(item0);
						}
					}
				});
			});
			$scope.checkedModel.checkedListNow = ContentCheckedService.checked.defaultChecked($scope.checkedModel.checkedList, $scope.list0);//配置默认勾选项
			$scope.checkedModel.checkedListNow.forEach(function (item) {
				if (item.checked) {
					$scope.checkedModel.checkedNum++;
				}
			})
		});
	};
	//搜索
	$scope.search0 = function () {//内容添加列表页搜索
		$scope.orginFilters0 = angular.copy($scope.uiModel0.filters);
		$scope.page0.page_no = 1;
		$scope.getContentList();
	};
	// //清空
	// $scope.reset0 = function () {//内容添加列表页清空
	// 	$scope.uiModel0.filters = angular.copy($scope.orginFilters0);
	// 	$scope.page0 = angular.copy($scope.orginPages0);
	// 	$scope.getContentList();
	// };
	//新建
	$scope.create = function () {
		sessionStorage.setItem('uiModel', JSON.stringify($scope.orginUimodel));
		$state.go('productManagementsAdd');
	}
	$scope.temp = 'nocalss';
	$scope.detailsWrap = {
		data: {},
		title: '',
		hide: function () {
			$('.js-slide-right-wrap').animate({ 'right': -700 }, 500);
			$scope.temp = 'noclass';
		},
		show: function () {
			$('.js-slide-right-wrap').stop().css('right', -700);
			$('.js-slide-right-wrap').show().animate({ 'right': 0 }, 500);
			$scope.contHeight();
			$('.slide-cont').scrollTop(0);
		}
	};
	$scope.showDetail = function (id, index) {//获取产品详情
		$scope.temp = index;
		var data = {
			product_id: id
		};
		productManagementsNet.getDetail(data).then(function (res) {
			if (res.data.code) {
				$scope.detailsWrap.data = res.data.data;
				$scope.detailsWrap.data.product_info.product_categorys.length = 3;
				$scope.detailsWrap.show();
			} else {
				$prompt.timeout($scope, res);
			}
		});
	};
	$scope.save = function () {// 点击编辑保存校验 
		if ($scope.isAjaxing) return;//防止重复点击
		if (!$scope.editModal.data.product_info.product_name) {
			$prompt.timeout($scope, {
				code: 500,
				msg: '请输入产品名称'
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
					product_id: $scope.editModal.data.product_info.product_id,//产品id
					product_price: $scope.all_price,//产品价格
					product_name: $scope.editModal.data.product_info.product_name,//产品名称
					contents: $scope.contentList,//产品关联的内容
					product_remarks: $scope.editModal.data.product_info.product_remarks || '',//产品说明
				};
				productManagementsNet.productEdit(data).then(function (res) {
					if (res.data.code) {
						$prompt.timeout($scope, {
							code: 1,
							msg: '编辑成功'
						});
						$scope.isAjaxing = true;
						$scope.editModal.hide();
						$scope.getList($scope.uiModel.page.page_no);
						$scope.showDetail($scope.editModal.data.product_info.product_id, $scope.temp);
					} else {
						$prompt.timeout($scope, res);
						$scope.isAjaxing = false;
					}
				});
			}

		}
	};
	$scope.editModal = {//一级弹窗配置
		data: {},
		isShow: false,
		title: '产品编辑',
		show: function (edit) {
			if (!edit[0]) {
				$prompt.timeout($scope, {
					code: 0,
					msg: edit[1]
				})
				return;
			}
			$scope.checkedModel.checkedList = []; //若不置空,在其他产品详情编辑时，$scope.checkedModel.checkedList原本有值会出错
			$scope.contentList = [];//编辑内容添加
			$scope.editModal.data = angular.copy($scope.detailsWrap.data);
			$scope.editModal.data.content_info.forEach(function (item) {//获取初始内容列表
				$scope.contentList.push({
					product_content_price_id: item.product_content_price_id,
					content_price_id: item.content_price_id,
					content_id: item.content_id,//记录id用于删除
					content_category: item.content_category,
					content_name: item.content_name,
					content_price: item.content_price || 1,
					content_num: item.content_num || 1,
				});
			});
			$scope.addPrice($scope.contentList);
			this.isShow = true;
			$scope.isAjaxing = false;//使弹窗可以点击确定按钮；
		},
		hide: function () {
			this.isShow = false;
		},
		confirm: function () {
			$scope.save();
		}
	};
	$scope.editModal0 = {//二级弹窗配置[内容添加弹窗]
		title: '内容添加',
		isShow: false,
		show: function () {
			// $scope.checkedModel.checkedList = [];
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
			// $scope.contentList = [];不允许清空，就建立循环判断 contentList中是否存在 此id值，若没有，则添加
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
			for (var i = $scope.contentList.length - 1; i >= 0; i--) { //点击取消勾选 默认从contentList中删除
				var index = $scope.checkedModel.checkedList.map(item0 => item0.content_id).indexOf($scope.contentList[i].content_id);
				if (index == -1) {
					$scope.contentList.splice(i, 1);
				}
			}
			$scope.editModal0.hide();
			$scope.addPrice($scope.contentList);
		},
	};
	$scope.checkedModel = {
		checkedList: [],//保存全部勾选
		checkedListNow: [],//保存当前列表页状态，用于默认勾选
		checkedNum: 0,// 用于判断该页是否全部勾选
		checkedAll: function (event) {
			$scope.checkedModel.checkedList = ContentCheckedService.checked.checkedAll(event, $scope.list0, $scope.checkedModel.checkedList);
			if (event.target.checked) {
				$scope.checkedModel.checkedListNow.forEach(function (item) {
					item.checked = true;
				});
				$scope.checkedModel.checkedNum = $scope.list0.length;
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
		if (content_num == 10) {
			$prompt.timeout($scope, {
				code: 500,
				msg: '最大数量为10，无法再增加'
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
			$scope.all_price += parseFloat(item.content_price) * parseFloat(item.content_num);
		});
	};
	$scope.deleteContent = function (item, index) {//删除对应内容项
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
	$scope.delete = function (status) {//删除对应产品
		if (!status[0]) {
			$prompt.timeout($scope, {
				code: 0,
				msg: status[1],
			})
			return;
		}
		$confirm_cancel.show({
			id: 'uiViews',
			title: '删除确认',
			text: '确定删除产品吗？',
			buttons: [{
				text: '确定',
				ontap: function () {
					$confirm_cancel.hide().then(function () {
						var id = { product_id: $scope.detailsWrap.data.product_info.product_id };
						productManagementsNet.delete(id).then(function (res) {
							if (res.data.code) {
								$prompt.timeout($scope, {
									code: 1,
									msg: '删除成功',
								});
								$scope.detailsWrap.hide();
								$scope.getList($scope.uiModel.page.page_no);
							} else {
								$prompt.timeout($scope, res);
							}
						});
					});
				}
			}],
			scope: $scope
		});
	};
	$scope.printOrder = function (product_id, product_status) {//关闭或开启打单
		$confirm_cancel.show({
			id: 'uiViews',
			title: '删除确认',
			text: product_status == 2 ? '确定关闭打单吗？' : '确定开启打单吗？',
			buttons: [{
				text: '确定',
				ontap: function () {
					$confirm_cancel.hide().then(function () {
						var data = {
							product_id: product_id,
							product_status: product_status == 2 ? 3 : 2,
						}
						productManagementsNet.printOrder(data).then(function (res) {
							if (res.data.code) {
								$prompt.timeout($scope, {
									code: 1,
									msg: product_status == 2 ? '打单关闭成功' : '打单开启成功'
								});
								$scope.showDetail($scope.detailsWrap.data.product_info.product_id, $scope.temp);
								$scope.getList($scope.uiModel.page.page_no);
							} else {
								$prompt.timeout($scope, res);
							}
						});
					});
				}
			}],
			scope: $scope
		});
	};
	$scope.init = function () {
		if (sessionStorage.getItem('uiModel')) { //刷新页面
			$scope.uiModel = JSON.parse(sessionStorage.getItem('uiModel'));
			$scope.orginUimodel = angular.copy($scope.uiModel);
			$scope.getList($scope.uiModel.page.page_no);
		} else {
			$scope.orginUimodel = angular.copy($scope.uiModel);
			$scope.getList();
		}
		window.onbeforeunload = function () { //本页面加载前;
			sessionStorage.setItem('uiModel', JSON.stringify($scope.orginUimodel));
		};
		sessionStorage.removeItem('uiModel');
	}
	$scope.init();
}]);