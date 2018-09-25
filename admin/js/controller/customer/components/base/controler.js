app.registerDirective('CustomerBase'['CustomerNetService', '$prompt', '$confirm_cancel', '$confirm_delete', 'UserService', function (CustomerNetService, $prompt, $confirm_cancel, $confirm_delete, UserService) {
    return {
        restrict: 'A',
        templateUrl: './js/controller/customer/components/base/template.html',
        scope: {
            // 按钮控制
            isOrigin: '=',
            comeType: '=',
            config: '=',
        },
        replace: true,
        link: function ($scope) {
            // 权限控制
            $scope.authPermission = {
                baseEdit: UserService.hasPermission('184'),
                inPublic: UserService.hasPermission('186'),
                distribution: UserService.hasPermission('194') || UserService.hasPermission('523'),
                transfer: UserService.hasPermission('140'),
                deleteOrder: UserService.hasPermission('704')
            };
            $scope.modalList = {
                editShow: false,
                edit1Show: false,
            };
            $scope.init = function () {
                CustomerNetService.CustomerNetService.base.getDetail($scope.config).then(
                    function (res) {
                        if (res.data.code && res.data.data) {
                            $scope.baseModel.editModel = res.data.data;
                            $scope.sourceEdit.customer_id = res.data.data.customer_id;
                            $scope.sourceEdit.customer = res.data.data.customer;
                            $scope.customer_id = res.data.data.customer_id;
                            $scope.sourceEdit.typeid = res.data.data.typeid;
                            $scope.baseModel.detail = angular.copy(res.data.data);
                            $scope.customer = res.data.data.customer;
                            document.title = '客户|' + $scope.customer;
                            // 是否是自有客户
                            $scope.mainFlag = res.data.data.user_id != $scope.userId;

                            // 归属判断
                            if (res.data.data.user_id == 0) {
                                $scope.levelShow = true;
                                if (res.data.data.is_protect == '1') {
                                    $scope.baseModel.detail.belong = '资源管理部';
                                } else {
                                    if ($scope.uiModel.choosen.tabIndex == '1') {
                                        if (res.data.data.is_old == 1) {
                                            $scope.baseModel.detail.belong = '续签团队公海';
                                        } else {
                                            $scope.baseModel.detail.belong = '非续签团队公海';
                                        }
                                    } else {
                                        $scope.baseModel.detail.belong = '公海';
                                    }
                                }
                            } else {
                                $scope.levelShow = false;
                                $scope.baseModel.detail.belong = $scope.baseModel.detail.account + '/' + $scope.baseModel.detail.department_name;
                            }

                        } else {
                            $prompt.timeout($scope, res);
                        }
                    }
                );
            };
            //删除客户
            $scope.deleteCustomer = function (ID) {
                $confirm_cancel.show({
                    id: 'uiViews',
                    title: '删除',
                    text: '确定将客户【' + ID + '】删除吗？',
                    buttons: [{
                        text: '确定',
                        ontap: function () {
                            $confirm_cancel.hide().then(function () {
                                $scope.baseModel.methods.deleteCustomer_id().then(function () {
                                    if ($scope.deletesStatus) {
                                        $confirm_delete.show({
                                            id: 'uiViews',
                                            title: '删除成功',
                                            text: '已成功将客户【' + ID + '】删除',
                                            buttons: [{
                                                text: '确定',
                                                ontap: function () {
                                                    window.close();
                                                }
                                            }],
                                            scope: $scope
                                        });
                                    }
                                });
                            });
                        }
                    }],
                    scope: $scope
                });
            };
            // 分配
            //分配客户
            if ($scope.comeType == 1) {
                $scope.mTransferModal = {
                    isShow: false,
                    title: '分配',
                    data: {},
                    hide: function () {
                        $scope.mTransferConfirm.isShow = false;
                    },
                    show: function () {
                        var data = {
                            customer_id: $scope.config.customer_id,
                            source: 1
                        };
                        CustomerNetService.base.getAdmUser(data).then(function (res) {
                            if (res.data.code) {
                                this.data = res.data.data;
                            } else {
                                $prompt.timeout($scope, res);
                            }
                        });
                        this.isShow = true;
                    },
                    confirm: function (obj) {
                        if ($scope.isAjaxing) {
                            return;
                        }
                        if (JSON.stringify(obj) == '{}') {
                            $scope.mTransferModal.hide();
                            $prompt.timeout($scope, {
                                data: {
                                    code: 1,
                                    message: '操作成功'
                                }
                            });
                            return;
                        }
                        var data = {
                            customer_id: $scope.config.customer_id,
                            user: JSON.stringify(obj),
                            source: 1
                        };
                        $scope.isAjaxing = true;
                        CustomerNetService.base.allot(data).then(function (res) {
                            $scope.isAjaxing = false;
                            if (res.data.code) {
                                $scope.init();
                                $prompt.timeout($scope, {
                                    data: {
                                        code: 1,
                                        message: res.data.msg
                                    }
                                });
                                $scope.mTransferModal.hide();
                                // 重新刷新业务线信息,发送客户分配事件
                                $scope.$broadcast('customerAllot');
                                // $scope.getProductLevels();
                            } else {
                                $prompt.timeout($scope, res);
                            }
                        });
                    }
                };
            } else {
                //分配客户
                $scope.mTransferModal = {
                    isShow: false,
                    title: '分配',
                    data: {},
                    confirm: function (obj) {
                        if ($scope.isAjaxing) {
                            return;
                        }
                        if (JSON.stringify(obj) == '{}') {
                            $prompt.timeout($scope, {
                                data: {
                                    code: 500,
                                    message: '请勾选对象'
                                }
                            });
                            return;
                        }
                        var data = {
                            customer_id_list: [{ customer_id: $scope.config.customer_id, user_id: $scope.baseModel.detail.user_id }],
                            // 字段对应不一定
                            seller_uid: obj.id,
                            operate_pid: $scope.config.operate_pid
                        };
                        $scope.isAjaxing = true;
                        if ($scope.comeType == 3) {
                            CustomerNetService.base.allotPublic(data).then(function (res) {
                                $scope.isAjaxing = false;
                                if (res.data.code) {
                                    $scope.baseModel.methods.getDetail();
                                    $prompt.timeout($scope, {
                                        data: {
                                            code: 1,
                                            message: res.data.msg
                                        }
                                    });
                                    $scope.mTransferModal.hide();
                                    $scope.getProductLevels();
                                } else {
                                    $prompt.timeout($scope, res);
                                }
                            });
                        } else {
                            CustomerNetService.base.transfer(data).then(function (res) {
                                $scope.isAjaxing = false;
                                if (res.data.code) {
                                    $scope.baseModel.methods.getDetail();
                                    $prompt.timeout($scope, {
                                        data: {
                                            code: 1,
                                            message: res.data.msg
                                        }
                                    });
                                    $scope.mTransferModal.hide();
                                    $scope.getProductLevels();
                                } else {
                                    $prompt.timeout($scope, res);
                                }
                            });
                        }

                    },

                    hide: function () {
                        this.isShow = false;
                    },
                    show: function () {
                        CustomerNetService.base.getMoveSeller($scope.config).then(function (res) {
                            if (res.data.code) {
                                this.data = res.data.data;
                            } else {
                                $prompt.timeout($scope, res);
                            }
                        });
                        this.isShow = true;
                    }
                };
            }
            $scope.edit = function () {
                if ($scope.isAjaxing) {
                    return;
                }
                if ($scope.baseModel.editModel.shop_phone && ($scope.baseModel.editModel.shop_phone.length > 15 || $scope.baseModel.editModel.shop_phone.length < 11)) {
                    $scope.prompt('请输入正确的店铺电话', 500);
                    return;
                }
                $scope.isAjaxing = true;
                $scope.baseModel.editModel.customer_id = $scope.config.customer_id;
                $scope.baseModel.editModel.operate_pid = $scope.config.operate_pid;
                CustomerNetService.base.update($scope.baseModel.editModel).then(
                    function (res) {
                        $scope.isAjaxing = false;
                        if (res.data.code) {
                            $scope.modalList.baseEdit = false;
                            $prompt.timeout($scope, {
                                data: {
                                    code: 1,
                                    message: res.data.msg
                                }
                            });
                            $scope.getProductLevels();
                            $scope.baseModel.methods.getDetail();
                        } else {
                            $prompt.timeout($scope, res);
                        }
                    }
                );
            };
            $scope.sourceEdit = function () {
                if ($scope.isAjaxing) {
                    return;
                }
                $scope.isAjaxing = true;
                CustomerNetService.base.sourceInfoEdit($scope.sourceEdit).then(
                    function (res) {
                        $scope.isAjaxing = false;
                        if (res.data.code) {
                            $scope.modalList.baseEdit1 = false;
                            $prompt.timeout($scope, {
                                data: {
                                    code: 1,
                                    message: res.data.msg
                                }
                            });
                            if ($stateParams.operate_pid != $scope.sourceEdit.typeid) {
                                $state.go('customer', { customer_id: $scope.baseModel.editModel.customer_id, operate_pid: $scope.sourceEdit.typeid == 2 ? 2 : 1, resource: 1 });
                            } else {
                                $scope.getProductLevels();
                                $scope.baseModel.methods.getDetail();
                            }
                        } else {
                            $prompt.timeout($scope, res);
                        }
                    }
                );
            };
            // 踢入公海
            $scope.goPublic = function (data) {
                CustomerNetService.base.goPublic({ customer_id_list: data, operate_pid: $scope.config.operate_pid }).then(
                    function (res) {
                        if (res.data.code) {
                            $prompt.timeout($scope, {
                                data: {
                                    code: 1,
                                    message: res.data.msg
                                }
                            });
                            $scope.showClose();
                        } else {
                            $prompt.timeout($scope, res);
                        }
                    }
                );
            };
            $scope.showGoPublic = function () {
                $confirm_cancel.show({
                    id: 'uiViews',
                    title: '踢入公海',
                    text: '确认将【' + ($scope.baseModel.detail.customer || '测试') + '】踢入公海吗？',
                    remarks: '确定后，1位客户将调入公海',
                    buttons: [{
                        text: '确定',
                        ontap: function () {
                            $confirm_cancel.hide().then(function () {
                                var data = [{
                                    customer_id: $scope.config.customer_id,
                                    user_id: $scope.baseModel.detail.user_id
                                }];
                                $scope.goPublic(data);
                            });
                        }
                    }],
                    scope: $scope
                });
            };
            $scope.showClose = function () {
                $confirm_cancel.show({
                    id: 'uiViews',
                    title: '关闭页面',
                    text: '踢入公海成功，关闭页面吗？',
                    remarks: '确定后，页面将关闭',
                    buttons: [{
                        text: '确定',
                        ontap: function () {
                            $confirm_cancel.hide().then(function () {
                                window.close();
                            });
                        }
                    }],
                    scope: $scope
                });
            };
            //入库
            $scope.goPrivate = function (customer) {
                var data = {
                    operate_pid: $scope.config.operate_pid,
                    customer_id_list: customer
                };
                CustomerNetService.base.goPrivate(data).then(function (res) {
                    if (res.data.code) {
                        res.data.code = 1;
                        $scope.init();
                    }

                    $prompt.timeout($scope, res,
                        $scope.$broadcast('customerAllot'));
                });
            };
            $scope.showGoPrivate = function () {
                $confirm_cancel.show({
                    id: 'uiViews',
                    title: '入我的库',
                    text: '确认将【' + ($scope.baseModel.detail.customer || '测试') + '】入我的库吗？',
                    remarks: '确定后，1位客户将入我的库',
                    buttons: [{
                        text: '确定',
                        ontap: function () {
                            $confirm_cancel.hide().then(function () {
                                $scope.goPrivate([{ customer_id: $scope.config.customer_id, user_id: 0 }]);
                            });
                        }
                    }],
                    scope: $scope
                });
            };
            //删除客户
            $scope.deleteCustomer = function (ID) {
                $confirm_cancel.show({
                    id: 'uiViews',
                    title: '删除',
                    text: '确定将客户【' + ID + '】删除吗？',
                    buttons: [{
                        text: '确定',
                        ontap: function () {
                            $confirm_cancel.hide().then(function () {
                                $scope.deleteCustomer_id().then(function () {
                                    if ($scope.deletesStatus) {
                                        $confirm_delete.show({
                                            id: 'uiViews',
                                            title: '删除成功',
                                            text: '已成功将客户【' + ID + '】删除',
                                            buttons: [{
                                                text: '确定',
                                                ontap: function () {
                                                    window.close();
                                                }
                                            }],
                                            scope: $scope
                                        });
                                    }
                                });
                            });
                        }
                    }],
                    scope: $scope
                });
            };
            $scope.deleteCustomer_id = function () {
                var deferred = $q.defer();
                if ($scope.isAjaxing) {
                    return;
                }
                $scope.isAjaxing = true;
                CustomerNetService.base.deleteCustomer_id({ id: $scope.customer_id }).then(
                    function (res) {
                        $scope.isAjaxing = false;
                        if (res.data.code) {
                            $scope.deletesStatus = true;
                            deferred.resolve();
                        } else {
                            $prompt.timeout($scope, res);
                        }
                    }
                );
                return deferred.promise;
            };
        }
    };
}]);