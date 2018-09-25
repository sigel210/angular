/**
 * Created by admin on 2017/6/5.
 */
app.registerCtrl('transactionLog', ['$scope', '$state', '$Modal', '$Ajax', '$rootScope', '$slider', '$prompt', '$confirm_cancel', 'UserService', 'FinanceNetService', function ($scope, $state, $Modal, $Ajax, $rootScope, $slider, $prompt, $confirm_cancel, UserService, FinanceNetService) {
    var http = $rootScope.http;
    $scope.$emit('id', 'moneyManage');
    $scope.pageName = 'transactionLog';
    $scope.btnDisabled = {
        delete: false,
        edit: false
    };
    //权限控制
    $scope.authPermission = {
        download: UserService.hasPermission(1499), // 下载报表
        update: UserService.hasPermission(1498),// 编辑
        delete: UserService.hasPermission(1497)// 删除
    };
    // tab数据设置
    $scope.tabList = [
        // {
        //     title: '天下网商支付宝',
        //     value: 1
        // },
        // {
        //     title: '天下网商银行卡',
        //     value: 2
        // },
        {
            title: '淘大培训支付宝',
            value: 3
        },
        {
            title: '淘大培训银行卡',
            value: 4
        }
    ];

    $scope.uiModel = {
        status: {
            received_status: $scope.tabList[0].value
        },
        filters: {
            received_status: '',
            pay_name: '',
            trade_no: '',
            received_income_start: '',
            received_income_end: '',
            received_verify_start: '',
            received_verify_end: ''
        },
        page: {
            page_no: '',
            page_size: 20,
            total: 0,
            page_count: 0
        },
        selectList: {

        }
    };
    $scope.originFilter = angular.copy($scope.uiModel.filters);
    // tab默认选中
    $scope.tabIndex = $scope.tabList[0].value;
    // tab选中改变
    $scope.changeTab = function (index) {
        $rootScope.temp = 'noclass';
        $scope.tabIndex = index;
        $scope.tabChangeList();
    };
    // tab切换修改列表
    $scope.tabChangeList = function () {
        //$scope.search();
        $scope.reset();
        // $scope.setRootScope();
        // $scope.dateCount(1);
    };

    // 查询
    $scope.search = function () {
        $scope.orginUimodel = angular.copy($scope.uiModel);
        $scope.uiModel.page.pageIndex = 1;
        $scope.getList();
    };
    //重置
    $scope.reset = function () {
        // 重置
        $scope.uiModel.filters = angular.copy($scope.originFilter);
        $scope.orginUimodel.filters = angular.copy($scope.originFilter);
        $scope.getList();
    };

    $scope.getList = function (pageIndex) {
        $scope.orginUimodel.filters.pay_way = $scope.tabIndex;
        FinanceNetService.getTransactionList(pageIndex, $scope.orginUimodel.filters, $scope, { page_size: $scope.orginUimodel.page.page_size }).then(function (res) {
            if (res.data.code) {
                $scope.uiModel.page.page_no = res.data.page_info.page_no;
                $scope.uiModel.page.total = res.data.page_info.total;
                $scope.uiModel.page.page_count = res.data.page_info.page_count;
                $scope.list = res.data.data;
            }
        });
    };

    // 详情模版组件
    $scope.detailModalConfig = {
        flag: false,
        data: {},
        title: '',
        buttons: [
            {
                text: '编辑',
                func: function () {
                    if (!$scope.detailModalConfig.data.button.update) {
                        $prompt.timeout($scope, {
                            data: {
                                code: 500,
                                msg: '对账成功的支付信息无法编辑'
                            }
                        });
                    } else {
                        $scope.editModal.show();
                    }
                },
                disabled: $scope.btnDisabled.edit
                // hide: true,
            },
            {
                text: '删除',
                func: function () {
                    if (!$scope.detailModalConfig.data.button.delete) {
                        $prompt.timeout($scope, {
                            data: {
                                code: 500,
                                msg: '对账成功的支付信息无法删除'
                            }
                        });

                    } else {
                        $confirm_cancel.show({
                            id: 'uiViews',
                            title: '删除',
                            text: '确定将此支付信息删除吗？',
                            buttons: [{
                                text: '确定',
                                ontap: function () {
                                    $confirm_cancel.hide().then(function () {
                                        $scope.delectAccounting($scope.detailModalConfig.data.pay_log_id);
                                    });
                                }
                            }],
                            scope: $scope
                        });
                    }
                },
                disabled: $scope.btnDisabled.delete,
            }
        ],
        show: function (obj) {
            $scope.item_news = obj;
            FinanceNetService.getTransactionDetail(obj.pay_log_id).then(function (res) {
                if (res.data.code) {
                    if ($scope.tabIndex == 3) {
                        $scope.detailModalConfig.title = res.data.data.trade_no;
                    } else {
                        $scope.detailModalConfig.title = res.data.data.pay_name;
                    }
                    $scope.detailModalConfig.data = res.data.data;
                    $scope.detailModalConfig.flag = true;
                    if (res.data.data.received_status_id == 2) {
                        $scope.detailModalConfig.buttons[0].disabled = true;
                        $scope.detailModalConfig.buttons[1].disabled = true;
                        $scope.btnDisabled = {
                            delete: true,
                            edit: true,
                        };
                    } else {
                        $scope.detailModalConfig.buttons[0].disabled = false;
                        $scope.detailModalConfig.buttons[1].disabled = false;
                        $scope.btnDisabled = {
                            delete: false,
                            edit: false,
                        };
                    }
                } else {
                    $prompt.timeout($scope, res);
                }
            });
        },
        cancel: function () {
            this.show = false;
        }
    };

    $scope.delectAccounting = function (id) {
        $Ajax.post(http + '/Finance/TradeFlow/delete', { pay_log_id: id }).then(function (res) {
            if (res.data.code) {
                $prompt.timeout($scope, {
                    data: {
                        code: 1,
                        msg: res.data.msg
                    }
                });
                $scope.reset();
                $scope.detailModalConfig.hide();
            } else {
                $prompt.timeout($scope, res);
            }
        });
    };

    $scope.editModal = {
        flag: false,
        title: '编辑',
        data: {},
        hide: function () {
            this.flag = false;
        },
        show: function () {
            $scope.editModal.data = angular.copy($scope.detailModalConfig.data);
            this.flag = true;
        },
        confirm: function () {
            if (!$scope.editModal.data.trade_no) {
                $prompt.timeout($scope, {
                    data: {
                        code: 500,
                        msg: '请输入交易号'
                    }
                });
                return false;
            }
            // if ((!$scope.editModal.data.trade_no) && ($scope.tabIndex == 3)) {
            //     $prompt.timeout($scope, {
            //         data: {
            //             code: 500,
            //             msg: '请输入订单号'
            //         }
            //     });
            //     return false;
            // }
            if ((!$scope.editModal.data.pay_name) && ($scope.tabIndex == 1 || $scope.tabIndex == 2 || $scope.tabIndex == 4)) {
                $prompt.timeout($scope, {
                    data: {
                        code: 500,
                        msg: '请输入付款人'
                    }
                });
                return false;
            }
            // var rule = {
            //     pay_amount: {
            //         required: '请输入支付金额！',
            //         pattern: '请输入正确的支付金额'
            //     },
            //     income_time: {
            //         required: '请输入支付时间！'
            //     }
            // };
            // if (!form.$valid) {
            //     validate(rule, form);
            //     return false;
            // }
            var data = {
                'pay_log_id': $scope.editModal.data.pay_log_id,
                'pay_amount': $scope.editModal.data.pay_amount,
                'income_time': $scope.editModal.data.income_time,
                'pay_name': $scope.editModal.data.pay_name,
                'trade_no': $scope.editModal.data.trade_no,
            };
            var url = http + '/Finance/TradeFlow/update';
            $Ajax.post(url, data).then(function (res) {
                if (res.data.code) {
                    $prompt.timeout($scope, {
                        data: {
                            code: 1,
                            msg: res.data.msg
                        }
                    });
                    $scope.editModal.hide();
                    $scope.reset();
                    $scope.detailModalConfig.show($scope.item_news);
                } else {
                    $prompt.timeout($scope, res);
                }
            });
        }
    };

    // 获取详情
    $scope.showDetail = function (item, index, pay_id) {
        $scope.item_news = item;
        $rootScope.temp = index;
        $scope.pay_id = pay_id;
        var url = http + '/Finance/TransactionLog/detail&pay_id=' + $scope.pay_id;
        $Ajax.get(url).then(function (res) {
            if (res.data.code) {
                $scope.detailsWrap.data = res.data.data;
                $scope.detailsWrap.show();
                if (item.status == 2) {
                    $scope.btnDisabled = {
                        delete: true,
                        edit: true
                    };
                } else {
                    $scope.btnDisabled = {
                        delete: false,
                        edit: false,
                    };
                }
            } else
                $prompt.timeout($scope, res);
        });
    };

    //下载列表
    $scope.saveReport = function () {
        var data = angular.extend({}, $scope.uiModel.filters, { 'pay_way': $scope.tabIndex });
        var url = http + '/Finance/TradeFlow/download&' + $.param(data);
        $Ajax.get(url).then(function (res) {
            if (res.data.code == 0) {
                $prompt.timeout($scope, res);
            } else
                window.location.href = encodeURI(url);
        });
    };
    //绑定搜索
    document.onkeydown = function (e) {
        var ev = document.all ? window.event : e;
        if (ev.keyCode == 13) {
            $scope.search();
        }
    };
    //移除焦点
    $scope.blur = function (target) {
        $(target).blur();
    };
    function validate(rule, _form) {
        var status = true;
        angular.forEach(rule, function (item, i) {
            if (status) {
                for (var t in item) {
                    if (_form[i].$error[t]) {
                        status = false;
                        $prompt.timeout($scope, { code: '', msg: item[t] });
                        break;
                    }
                }
            }
        });
        return false;
    }
    $scope.init = function () {
        $scope.orginUimodel = angular.copy($scope.uiModel);
        $scope.getList(1);
    };
    $scope.init();
}]);