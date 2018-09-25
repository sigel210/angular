app.registerCtrl('contentManagements', ['$scope', 'contentManagementsNet', '$prompt', 'CommonService', '$confirm_cancel', 'UserService', '$state', function ($scope, contentManagementsNet, $prompt, CommonService, $confirm_cancel, UserService, $state) {
    //权限控制
    $scope.permission = {
        detail: UserService.hasPermission(1478),
        list: UserService.hasPermission(1477),
        delete: UserService.hasPermission(1476),
        edit: UserService.hasPermission(1475),
        creat: UserService.hasPermission(1474)
    };
    $scope.uiModel = {
        filters: {
            content_name: '',
            start_time: '',
            end_time: '',
            content_status: '',
        },
        content_status_list: [
            { content_status: 1, content_status_name: '未打单' },
            { content_status: 2, content_status_name: '打单中' },
            { content_status: 3, content_status_name: '打单关闭' },
        ],
        page: { //主列表页页码配置
            page_no: '',
            pageSize: 10,
            total: 0,
            pageCount: 0,
        },
    };
    //保存原始参数
    $scope.orginUimodel = angular.copy($scope.uiModel);//用于 不点击搜索，直接点击分页，不保存搜索项
    // $scope.orginPage = angular.copy($scope.uiModel.page);
    $scope.getList = function (pageIndex) {
        contentManagementsNet.getList(pageIndex, $scope.orginUimodel.filters, $scope, { page_size: $scope.orginUimodel.page.page_size }).then(function (res) {
            if (res.data.code) {
                $scope.uiModel.page.page_no = res.data.page_info.page_no;
                $scope.uiModel.page.total = res.data.page_info.total;
                $scope.uiModel.page.pageCount = res.data.page_info.page_count;

                $scope.orginUimodel.page.page_no = res.data.page_info.page_no;
                $scope.orginUimodel.page.total = res.data.page_info.total;
                $scope.orginUimodel.page.pageCount = res.data.page_info.page_count;
                $scope.list = res.data.data;
                $scope.list.forEach(function(item){
                    if(item.content_categorys.length < 3){
                        item.content_categorys.length = 3;
                    }
                });
            } else {
                $prompt.timeout($scope, res);
            }
        });
    };

    //搜索
    $scope.search = function () {
        $scope.orginUimodel = angular.copy($scope.uiModel);
        $scope.uiModel.page.page_no = 1;
        $scope.getList($scope.uiModel.page.page_no);
    };
    //新建
    $scope.creatContent = function () {
        sessionStorage.setItem('uiModel', JSON.stringify($scope.orginUimodel));
        $state.go('contentAdd');
    };
    //清空
    // $scope.reset = function () {
    // 	$scope.uiModel.filters = angular.copy($scope.orginFilters);
    // 	$scope.uiModel.filtes.content_status = $scope.tabIndex;
    // 	$scope.page = angular.copy($scope.orginPage);
    // 	$scope.getList();
    // };
    $scope.temp = 'noclass';//列表行选中样式
    $scope.showDetail = function (id, index) {
        $scope.detailsWrap.hide();
        $scope.temp = index;
        var data = { content_id: id };
        contentManagementsNet.getDetail(data).then(function (res) {
            if (res.data.code) {
                $scope.detailsWrap.data = res.data.data;
                //按钮状态
                if ($scope.detailsWrap.data.botton.delete[0]) {
                    $scope.detailsWrap.buttons[0].class = 'btn-new-blue';
                } else {
                    $scope.detailsWrap.buttons[0].class = '';
                }
                if ($scope.detailsWrap.data.botton.edit[0]) {
                    $scope.detailsWrap.buttons[1].class = 'btn-new-blue';
                } else {
                    $scope.detailsWrap.buttons[1].class = '';
                }
                $scope.detailsWrap.show();
            } else {
                $prompt.timeout($scope, res);
            }
        });
    };
    $scope.detailsWrap = {
        data: {},
        isShow: false,
        show: function () {
            this.isShow = true;
        },
        hide: function () {
            this.isShow = false;
        },
        buttons: [
            {
                text: '删除',
                func: function () {
                    if (!$scope.detailsWrap.data.botton.delete[0]) {
                        $prompt.timeout($scope, {
                            code: 0,
                            msg: $scope.detailsWrap.data.botton.delete[1]
                        });
                        return;
                    }
                    $scope.delete();
                },
                disabled: false,
                class: '',
                hide: !$scope.permission.delete,
            },
            {
                text: '内容编辑',
                func: function () {
                    if (!$scope.detailsWrap.data.botton.edit[0]) {
                        $prompt.timeout($scope, {
                            code: 0,
                            msg: $scope.detailsWrap.data.botton.edit[1]
                        });
                        return;
                    }
                    $scope.editModal.data = angular.copy($scope.detailsWrap.data); //编辑保存 内容基本信息
                    $scope.editModal.show();
                },
                disabled: false,
                class: '',
                hide: !$scope.permission.edit,
            }
        ]
    };

    $scope.delete = function () {//删除对应内容
        $confirm_cancel.show({
            id: 'uiViews',
            title: '删除确认',
            text: '确定删除内容吗？',
            buttons: [{
                text: '确定',
                ontap: function () {
                    $confirm_cancel.hide().then(function () {
                        var id = { content_id: $scope.detailsWrap.data.content_info.content_id };
                        contentManagementsNet.delete(id).then(function (res) {
                            if (res.data.code) {
                                $prompt.timeout($scope, {
                                    code: 1,
                                    msg: '删除成功',
                                });
                                $scope.detailsWrap.hide();
                                $scope.search();
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
    $scope.save = function () {//确认校验
        if (!$scope.editModal.data.content_info.content_name) {
            $prompt.timeout($scope, {
                code: 500,
                msg: '请输入内容名称'
            });
        } else {
            debugger
            var params = {
                content_id: $scope.editModal.data.content_info.content_id,
                content_name: $scope.editModal.data.content_info.content_name,
                content_desc: $scope.editModal.data.content_info.content_desc
            };
            contentManagementsNet.editContent(params).then(function (res) {
                if (res.data.code) {
                    $prompt.timeout($scope, {
                        code: 1,
                        msg: '编辑成功'
                    });
                    $scope.editModal.hide();
                    $scope.getList($scope.uiModel.page.page_no);
                    $scope.showDetail($scope.editModal.data.content_info.content_id, $scope.temp);
                } else {
                    $prompt.timeout($scope, res);
                }
            });
        }
    };
    $scope.editModal = {
        data: {},
        flag: false,
        title: '编辑',
        show: function () {
            this.flag = true;
        },
        hide: function () {
            this.flag = false;
        },
        confirm: function () {
            $scope.save();
        }
    };
    $scope.init = function () {
        // 如果存在sessionstorage，取sessionstorage的uiModel
        if (sessionStorage.getItem('uiModel')) { //刷新页面
            $scope.uiModel = JSON.parse(sessionStorage.getItem('uiModel'));
            $scope.orginUimodel = angular.copy($scope.uiModel);//用于 不点击搜索，直接点击分页，不保存搜索项
            $scope.getList($scope.uiModel.page.page_no);
        } else {
            $scope.orginUimodel = angular.copy($scope.uiModel);//用于 不点击搜索，直接点击分页，不保存搜索项
            $scope.getList();
        }
        // 绑定uiModel刷新事件
        window.onbeforeunload = function () { //本页面加载前;
            sessionStorage.setItem('uiModel', JSON.stringify($scope.orginUimodel));
        };
        // 完成后清除uiModel
        sessionStorage.removeItem('uiModel');
    };

    $scope.init();

}]);