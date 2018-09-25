app.registerCtrl('customerController', ['$q', '$timeout', '$scope', '$state', '$Modal', '$Ajax', '$rootScope', '$slider', '$prompt', '$setTime', '$confirm', '$http', '$confirm_cancel', '$confirm_delete', '$loading', '$stateParams', 'CommonService', 'UserService', '$cookies', 'CustomerService', 'CustomerNetService', 'CommonNetService', 'dataFilter', function ($q, $timeout, $scope, $state, $Modal, $Ajax, $rootScope, $slider, $prompt, $setTime, $confirm, $http, $confirm_cancel, $confirm_delete, $loading, $stateParams, CommonService, UserService, $cookies, CustomerService, CustomerNetService, CommonNetService, dataFilter) {
app.registerCtrl('customerController', ['$q', '$timeout', '$scope', '$state', '$Modal', '$Ajax', '$rootScope', '$slider', '$prompt', '$setTime', '$confirm', '$http', '$confirm_cancel', '$confirm_delete', '$loading', '$stateParams', 'CommonService', 'UserService', '$cookies', 'CustomerService', 'CustomerNetService', 'CommonNetService', 'dataFilter', function ($q, $timeout, $scope, $state, $Modal, $Ajax, $rootScope, $slider, $prompt, $setTime, $confirm, $http, $confirm_cancel, $confirm_delete, $loading, $stateParams, CommonService, UserService, $cookies, CustomerService, CustomerNetService, CommonNetService, dataFilter) {
    $scope.pageName = 'customer';
    $scope.isAjaxError = false;
    $scope.userId = JSON.parse($cookies.user).id;
    $scope.$emit('id', 'customer');

    // 权限控制
    $scope.authPermission = {
    };
    // 后端请求flag
    $scope.https = {
        orderlist: true,
        orderdetail: true,
        billlist: true,
        billdetail: true,
        studentlist: true,
        studentdetail: true,
        incomelist: true,
        surveylist: true,
        surveydetail: true,
        followlist: true,
        // v3.0.0
        productlist: true,
        productdetail: true,
        productchange: true,
        productpresent: true,
        contractlist: true,
        contractdetail: true,
        taxlist: true,
        taxdetail: true,
        changePresentlist: true,
        changePresentdetail: true
    };
    // 用于重置后端请求flag
    $scope.originHTTPS = angular.copy($scope.https);

    // 视图模型
    $scope.uiModel = {
        business: [],
        menus: ['订单信息'],
        choosen: { menuIndex: 0, tabIndex: 0, childTabIndex: 0 },
        selectList: {
            invoiceUse: [{ id: '1', name: '正常开票' }, { id: '2', name: '退款开票' }],
            invoiceType: [{ id: '1', name: '专票', }, { id: '2', name: '普票' }]

        },

    };

    // 客户ID
    $scope.customer = '';
    // 后端请求基本模型
    $scope.httpConfig = {
        customer_id: 1,
        operate_pid: 1,
    };
    // Tab切换
    $scope.changeTab = function (type) {

        if ($scope.uiModel.choosen.tabIndex !== type) {
            // 切换tab，控制全局按钮隐藏
            if (type != $stateParams.operate_pid) {
                if ($scope.isOrigin) {
                    $scope.isOrigin = false;
                    // 保留跟进信息
                    $scope.uiModel.static.followInfo = $scope.followModel.editModel.info;
                }

            } else {
                $scope.isOrigin = true;
            }
            $scope.uiModel.choosen.tabIndex = type;
            // 修改业务线
            $scope.httpConfig.operate_pid = type;
            // 重置订单信息
            $scope.orderModel.second_product_id = 0;
            $scope.orderModel.third_product_id = 0;

            //重新加载基本信息
            $scope.switchLoad($scope.uiModel.choosen.menuIndex);

        }
    };
    // 左菜单切换
    $scope.changeMenu = function (type) {
        if ($scope.uiModel.choosen.menuIndex !== type) {
            $scope.uiModel.choosen.menuIndex = type;
            $scope.switchLoad(type, true);
            $scope.https = angular.copy($scope.originHTTPS);
        }
    };
    // 子菜单切换
    $scope.changeChildTab = function (type) {
        $scope.uiModel.choosen.childTabIndex = type;
        switch (type) {
            case 0:
                $scope.billModel.methods.getList();
                break;
            case 1:
                $scope.studentModel.methods.getList();
                break;
            case 2:
                $scope.orderIncomeModel.methods.getList();
                break;
            case 3:
                $scope.surveyModel.methods.getList();
                break;
            case 4:
                $scope.productModel.methods.getProductList();
                break;
            case 5:
                $scope.changePresentModel.methods.getList();
                break;
            case 6:
                $scope.contractModel.getList();
                break;
            case 7:
                $scope.taxInfoModel.getList();
                break;
        }
    };
    // 选择加载
    $scope.switchLoad = function (type, noloadBase) {
        type = parseInt(type);
        // v2.0.0 无论如何加载都必须加载基本信息，优化参数 noloadBase，减少冗余请求
        if (!noloadBase) {
            $scope.baseModel.methods.getDetail();
        }
        switch (type) {
            // 加载数据
            case 0:
                $scope.followModel.methods.list();
                $scope.followModel.methods.initEditModel();
                break;
            case 1:
                $scope.contactModel.methods.getDetail();
                $scope.followModel.methods.list();
                $scope.followModel.methods.initEditModel();
                break;
            case 2:
                $scope.taxModel.changeShowType();
                break;
            case 3:
                $scope.orderModel.methods.getList();
                break;
        }

    };
    // 获取业务线分布
    $scope.getProductLevels = function () {
        CustomerNetService.getProductLevels($scope.httpConfig).success(
            function (response) {
                if (response.success) {
                    $scope.uiModel.business = response.data;
                }
            }
        );
    };

    // 基本信息模块 complete
    $scope.baseModel = {
        detail: {},
        editModel: {
            flag: false,
            title: '客户编辑',
            data: {},
            hide: function () {
                this.flag = false;
            },
            show: function () {
                this.data = angular.copy($scope.baseModel.detail);
                // 增加判断减少请求数
                if ($scope.baseModel.selectList.provinceList.length == 0) {
                    CommonNetService.getProvinceList().then(function (res) {
                        if (res.data.code) {
                            $scope.baseModel.selectList.provinceList = res.data.data;
                            $scope.baseModel.editModel.flag = true;
                        } else {
                            $prompt.timeout($scope, res);
                        }
                    });
                } else {
                    $scope.baseModel.editModel.flag = true;
                }
                // 获取分类
                if ($scope.baseModel.selectList.categories.length == 0) {
                    CommonNetService.getCategories().then(function (res) {
                        if (res.data.code) {
                            $scope.baseModel.selectList.categories = res.data.data;
                        }
                    });
                }
                // 获取市区列表
                $scope.baseModel.methods.refreashCityList($scope.baseModel.editModel.data.province);
            },
            confirm: function () {
                if ($scope.isAjaxing) {
                    return;
                }
                if ($scope.baseModel.editModel.data.shop_phone && ($scope.baseModel.editModel.data.shop_phone.length > 15 || $scope.baseModel.editModel.data.shop_phone.length < 11)) {
                    $scope.prompt('请输入正确的店铺电话', 500);
                    return;
                }
                $scope.isAjaxing = true;
                // 补充模型
                $scope.baseModel.editModel.data.customer_id = $scope.httpConfig.customer_id;
                $scope.baseModel.editModel.data.operate_pid = $scope.httpConfig.operate_pid;
                CustomerNetService.base.update($scope.baseModel.editModel.data).then(
                    function (res) {
                        $scope.isAjaxing = false;
                        if (res.data.code) {
                            $scope.baseModel.editModel.hide();
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
            }
        },
        selectList: {
            provinceList: [],
            cityList: [],
            categories: [],
            customerTypeList: CommonService.getCustomerType()
        },
        sourceEdit: {
            flag: false,
            title: '信息编辑',
            data: {},
            hide: function () {
                this.flag = false;
            },
            show: function () {
                this.data = {
                    customer_id: $scope.baseModel.detail.customer_id,
                    customer: $scope.baseModel.detail.customer,
                    typeid: $scope.baseModel.detail.typeid
                };
                this.flag = true;
            },
            confirm: function () {
                if ($scope.isAjaxing) {
                    return;
                }
                $scope.isAjaxing = true;
                CustomerNetService.base.sourceInfoEdit(this.data).then(
                    function (res) {
                        $scope.isAjaxing = false;
                        if (res.data.code) {
                            $scope.baseModel.sourceEdit.hide();
                            $prompt.timeout($scope, {
                                data: {
                                    code: 1,
                                    message: res.data.msg
                                }
                            });
                            if ($stateParams.operate_pid != res.data.data.pool_id) {
                                $state.go('customer', { customer_id: $scope.baseModel.detail.customer_id, operate_pid: res.data.data.pool_id });
                            } else {
                                $scope.baseModel.methods.getDetail();
                            }
                        } else {
                            $prompt.timeout($scope, res);
                        }
                    }
                );
            }
        },
        methods: {
            getDetail: function () {
                CustomerNetService.base.getDetail($scope.httpConfig).then(
                    function (res) {
                        if (res.data.code && res.data.data) {
                            // $scope.baseModel.editModel = res.data.data;
                            $scope.baseModel.detail = angular.copy(res.data.data);
                            // 客户ID
                            $scope.customer = res.data.data.customer;
                            // 修改标题
                            document.title = '客户|' + $scope.customer;
                            // 是否是自有客户
                            $scope.mainFlag = res.data.data.user_id != $scope.userId;

                            // 归属判断
                            if (res.data.data.user_id == 0) {
                                $scope.levelShow = true;
                                if (res.data.data.is_protect == '1') {
                                    $scope.baseModel.detail.belong = '资源管理部';
                                } else {
                                    $scope.baseModel.detail.belong = '公海';
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
            },
            //删除客户
            deleteCustomer: function (customer) {
                $confirm_cancel.show({
                    id: 'uiViews',
                    title: '删除',
                    text: '确定将客户【' + customer + '】删除吗？',
                    buttons: [{
                        text: '确定',
                        ontap: function () {
                            $confirm_cancel.hide().then(function () {
                                $scope.baseModel.methods.deleteCustomer_id(customer);
                            });
                        }
                    }],
                    scope: $scope
                });
            },
            deleteCustomer_id: function (customer) {
                if ($scope.isAjaxing) {
                    return;
                }
                $scope.isAjaxing = true;
                CustomerNetService.base.deleteCustomer_id({ customer_id: $scope.httpConfig.customer_id }).then(
                    function (res) {
                        $scope.isAjaxing = false;
                        if (res.data.code) {
                            $confirm_delete.show({
                                id: 'uiViews',
                                title: '删除成功',
                                text: '已成功将客户【' + customer + '】删除',
                                buttons: [{
                                    text: '确定',
                                    ontap: function () {
                                        window.close();
                                    }
                                }],
                                scope: $scope
                            });
                        } else {
                            $prompt.timeout($scope, res);
                        }
                    }
                );
            },
            //获取市区列表
            refreashCityList: function (id) {
                CommonNetService.getCityList(id).then(function (res) {
                    if (res.data.code) {
                        $scope.baseModel.selectList.cityList = res.data.data;
                    } else
                        $prompt.timeout($scope, res);
                });
            },
            // 踢入公海
            goPublic: function (data) {
                CustomerNetService.base.goPublic({ customer_id_list: data, operate_pid: $scope.httpConfig.operate_pid }).then(
                    function (res) {
                        if (res.data.code) {
                            $prompt.timeout($scope, {
                                data: {
                                    code: 1,
                                    message: res.data.msg
                                }
                            });
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
                        } else {
                            $prompt.timeout($scope, res);
                        }
                    }
                );
            },
            showGoPublic: function () {
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
                                    customer_id: $scope.httpConfig.customer_id,
                                    user_id: $scope.baseModel.detail.user_id
                                }];
                                $scope.baseModel.methods.goPublic(data);
                            });
                        }
                    }],
                    scope: $scope
                });
            },
            // 入私海
            goPrivate: function (customer) {
                var data = {
                    operate_pid: $scope.httpConfig.operate_pid,
                    customer_id_list: customer
                };
                CustomerNetService.base.goPrivate(data).then(function (res) {
                    if (res.data.code) {
                        res.data.code = 1;
                        $scope.baseModel.methods.getDetail();
                    }
                    $prompt.timeout($scope, res, $scope.getProductLevels());
                });
            },
            showGoPrivate: function () {
                $confirm_cancel.show({
                    id: 'uiViews',
                    title: '入我的库',
                    text: '确认将【' + ($scope.baseModel.detail.customer || '测试') + '】入我的库吗？',
                    remarks: '确定后，1位客户将入我的库',
                    buttons: [{
                        text: '确定',
                        ontap: function () {
                            $confirm_cancel.hide().then(function () {
                                $scope.baseModel.methods.goPrivate([{ customer_id: $scope.httpConfig.customer_id, user_id: 0 }]);
                            });
                        }
                    }],
                    scope: $scope
                });
            }
        }
    };
    // 联系信息模块 complete
    $scope.contactModel = {
        detail: {},
        editModel: {
            flag: false,
            title: '信息编辑',
            data: {},
            hide: function () {
                this.flag = false;
            },
            show: function () {
                this.data = angular.copy($scope.contactModel.detail);
                this.flag = true;
            },
            confirm: function () {
                if ($scope.isAjaxing) {
                    return;
                }
                if (this.data.contact_phone && (this.data.contact_phone.length > 15 || this.data.contact_phone.length < 11)) {
                    $scope.prompt('请输入正确的联系手机号', 500);
                    return;
                }
                $scope.isAjaxing = true;
                // 补充模型
                this.data.customer_id = $scope.httpConfig.customer_id;
                this.data.operate_pid = $scope.httpConfig.operate_pid;
                CustomerNetService.contact.update(this.data).then(
                    function (res) {
                        $scope.isAjaxing = false;
                        if (res.data.code) {
                            $scope.contactModel.editModel.hide();
                            $scope.contactModel.detail = angular.copy($scope.contactModel.editModel.data);
                            res.data.code = 1;
                            // 更新跟进模块添加模版
                            $scope.followModel.methods.initEditModel();

                        }
                        $prompt.timeout($scope, res);
                    }
                );
            }

        },
        methods: {
            getDetail: function () {
                CustomerNetService.contact.getDetail($scope.httpConfig).success(
                    function (response) {
                        $scope.contactModel.detail = response.data;
                    }
                );
            }
        }
    };
    // 支付模块
    $scope.billModel = {
        received_id: 0,
        list: [],
        detail: {},
        edit: {},
        selectList: {
            payType: [{ id: '4', name: '押金' }, { id: '3', name: '尾款' }, { id: '5', name: '预付款' }, { id: '6', name: '预付款+押金' }]
        },
        special: {},
        editModal: {
            data: {},
            flag: false,
            title: '编辑支付信息',
            show: function () {
                CustomerNetService.bill.checkBeforeUpdate({
                    received_id: $scope.billModel.received_id,
                    second_product_id: $scope.orderModel.second_product_id
                }).then(function (res) {
                    if (res.data.code) {
                        $scope.billModel.editModal.data = angular.copy($scope.billModel.detail);
                        $scope.billModel.editModal.flag = true;
                    } else {
                        $prompt.timeout($scope, res);
                    }
                });
            },
            hide: function () {
                this.flag = false;
            },
            confirm: function () {
                if ($scope.isAjaxing) {
                    return;
                }
                var error = CustomerService.checkBillUpdate($scope.billModel.editModal.data, $scope.orderModel.second_product_id);
                if (error != '') {
                    $prompt.timeout($scope, {
                        data: {
                            code: 500,
                            message: error
                        }
                    });
                    return;
                }
                $scope.isAjaxing = true;
                $scope.billModel.editModal.data.second_product_id = $scope.orderModel.second_product_id;
                CustomerNetService.bill.update($scope.billModel.editModal.data).then(function (res) {
                    $scope.isAjaxing = false;
                    if (res.data.code) {
                        res.data.code = 1;
                        $scope.billModel.methods.getList();
                        $scope.billModel.editModal.hide();
                    }
                    $prompt.timeout($scope, res);

                });
            }
        },
        loadModal: {
            flag: false,
            checkBill: function () {
                CustomerNetService.bill.checkBeforeVerify({
                    received_id: $scope.billModel.received_id,
                    second_product_id: $scope.orderModel.second_product_id
                }).then(function (res) {
                    if (res.data.code) {
                        $scope.billModel.loadModal.flag = true;
                        $loading.show();
                        CustomerNetService.bill.checkBill({ received_id: $scope.billModel.detail.received_id }).then(function (res) {
                            $scope.billModel.loadModal.flag = false;
                            $loading.hide();
                            if (res.data.code) {
                                if (res.data.code == 1) {
                                    $scope.orderModel.methods.getDetail();
                                    $prompt.timeout($scope, res);
                                } else {
                                    $scope.billModel.errorBill.show(res.data.data);
                                }
                            } else {
                                $prompt.timeout($scope, res);
                            }
                        });
                    } else {
                        $prompt.timeout($scope, res);
                    }
                });
            }
        },
        // 对账出错弹窗
        errorBill: {
            flag: false,
            data: {},
            title: '对账失败',
            hide: function () {
                this.flag = false;
            },
            show: function (obj) {
                this.data = obj;
                this.flag = true;
            }
        },
        methods: {
            reset: function () {
                $scope.billModel.received_id = 0;
                $scope.billModel.detail = {};
                $scope.billModel.edit = {};
                $scope.billModel.list = [];
                $scope.billModel.checkBillRes = null;
            },
            changeBill: function (id) {
                $scope.billModel.received_id = id;
                $scope.billModel.methods.getDetail(id);
            },
            delete: function (id) {
                if ($scope.isAjaxing) {
                    return;
                }
                $scope.isAjaxing = true;
                CustomerNetService.bill.delete(id).then(function (res) {
                    $scope.isAjaxing = false;
                    if (res.data.code) {
                        res.data.code = 1;
                        $scope.billModel.methods.getList();
                    }
                    $prompt.timeout($scope, res);
                });
            },
            getList: function () {
                if ($scope.orderModel.order_id != 0) {
                    $scope.https.billlist = true;
                    CustomerNetService.bill.getList($scope.orderModel.order_id).then(function (res) {
                        $scope.https.billlist = false;
                        if (res.data.code) {
                            if (res.data.data.list.length > 0) {
                                $scope.billModel.list = res.data.data.list;
                                $scope.billModel.button = res.data.data.button;
                                $scope.billModel.received_id = $scope.billModel.list[0].received_id;
                                $scope.billModel.methods.getDetail($scope.billModel.received_id);
                            } else {
                                $scope.billModel.list = [];
                                $scope.billModel.received_id = 0;
                                $scope.billModel.button = res.data.data.button;
                                $scope.billModel.detail = {};
                                $scope.https.billdetail = false;
                            }
                        }
                    });
                } else {
                    $scope.https.billlist = false;
                    $scope.https.billdetail = false;
                }
            },
            getDetail: function (id) {
                $scope.https.billdetail = true;
                CustomerNetService.bill.getDetail(id).then(function (res) {
                    $scope.https.billdetail = false;
                    if (res.data.code) {
                        if (res.data.data) {
                            // 淘大
                            if ($scope.orderModel.second_product_id == 10008) {
                                $scope.billModel.special = {
                                    isTD: true,
                                    tradeName: '订单号'
                                };
                            } else {
                                $scope.billModel.special = {
                                    isTD: false,
                                    tradeName: '交易号'
                                };
                            }
                            $scope.billModel.detail = res.data.data;
                            $scope.billModel.edit = angular.copy($scope.billModel.detail);
                        }
                    }
                });
            },
            createBill: function () {
                if ($stateParams.customer_id && $stateParams.operate_pid && $scope.orderModel.order_id && !$scope.rflag && $scope.isOrigin) {
                    CustomerNetService.button.checkBeforeInsertBill($scope.orderModel.order_id).then(function (res) {
                        if (res.data.code) {
                            $state.go('billForm', { customer_id: $stateParams.customer_id, operate_pid: $stateParams.operate_pid, product_id: $scope.orderModel.third_product_id, order_id: $scope.orderModel.order_id, second_product_id: $scope.orderModel.second_product_id });
                        }
                        else {
                            $prompt.timeout($scope, res);
                        }
                    });
                }
            },
            showDeletePay: function () {
                CustomerNetService.bill.checkBeforeDelete({
                    received_id: $scope.billModel.detail.received_id,
                    second_product_id: $scope.orderModel.second_product_id
                }).then(function (res) {
                    if (res.data.code) {
                        $confirm_cancel.show({
                            id: 'uiViews',
                            title: '删除',
                            text: '确认将此支付信息删除吗？',
                            remarks: '确定后，该支付信息将删除',
                            buttons: [{
                                text: '确定',
                                ontap: function () {
                                    $confirm_cancel.hide().then(function () {
                                        $scope.billModel.methods.delete($scope.billModel.received_id);
                                    });
                                }
                            }],
                            scope: $scope
                        });
                    }
                    else {
                        $prompt.timeout($scope, res);
                    }
                });
            }
        }
    };
    // 跟进模块
    $scope.tempLevelList = CommonService.getLevels();
    $scope.tempLevelList.pop();
    $scope.followModel = {
        status: [{ id: '2', name: '已关店' }, { id: '1', name: '正常运营' }],
        effect: [{ id: '0', name: '无效' }, { id: '1', name: '有效' }],
        contactTypes: [{ id: '1', name: '电话' }, { id: '2', name: '微信' }, { id: '3', name: '旺旺' }, { id: '4', name: '钉钉' }, { id: '5', name: 'QQ' }, { id: '6', name: '短信' }],
        levels: $scope.tempLevelList,
        tempInsertModel: {
        },
        tempMessage: '',
        editModel: {
            customer_id: 1,
            operate_pid: 1,
            shop_status: '1',
            info: '',
            contact_name: '',
            contact_phone: '',
            contact_time: '',
            next_time: '',
            level_id: '1',
            is_effect: '1',
            contact_way: '',
            pics: []
        },
        list: [],
        canChange: true,
        tempFile: null,
        fileList: [],
        fileNames: [],
        tempfileNames: [],
        bigImage: {
            flag: false,
            data: '',
            hide: function () {
                this.flag = false;
            },
            show: function (path) {
                var index = path.lastIndexOf('.');
                var ext = path.substring(index, path.length);
                var pre = path.substring(0, index - 2);
                this.data = pre + ext;
                this.flag = true;
            }
        },
        methods: {
            canChangeTime: function () {
                $scope.followModel.canChange = true;
                if ($scope.followModel.editModel.level_id == 6 || $scope.followModel.editModel.level_id == 7) {
                    $scope.followModel.editModel.next_time = '';
                } else {
                    $scope.followModel.editModel.next_time = dataFilter.timeFormat(CommonService.addDay(new Date($scope.followModel.editModel.contact_time), 3), 'yyyy-MM-dd hh:mm');
                }
            },
            insert: function () {
                if ($scope.isAjaxing)
                    return;
                $scope.followModel.editModel.customer_id = $scope.httpConfig.customer_id;
                $scope.followModel.editModel.operate_pid = $scope.httpConfig.operate_pid;
                $scope.followModel.editModel.pics = $scope.followModel.fileList;
                var error = CustomerService.checkFollow($scope.followModel.editModel);
                if (error != '') {
                    $prompt.timeout($scope, {
                        data: {
                            code: 500,
                            message: error
                        }
                    });
                    return;
                }
                $scope.isAjaxing = true;
                CustomerNetService.follow.insert($scope.followModel.editModel).then(function (res) {
                    $scope.isAjaxing = false;
                    if (res.data.code) {
                        $prompt.timeout($scope, {
                            data: {
                                code: 1,
                                message: res.data.msg
                            }
                        });
                        $scope.followModel.methods.initEditModel();
                        $scope.followModel.methods.list();
                        // 更新左侧信息
                        if ($scope.uiModel.choosen.menuIndex == 0) {
                            $scope.baseModel.methods.getDetail();
                        } else if ($scope.uiModel.choosen.menuIndex == 1) {
                            $scope.contactModel.methods.getDetail();
                        }
                        // 更新tab
                        $scope.getProductLevels();

                    } else {
                        $prompt.timeout($scope, res);
                    }
                });
            },
            list: function () {
                $scope.https.followlist = true;
                CustomerNetService.follow.getList($scope.httpConfig).then(function (res) {
                    $scope.https.followlist = false;
                    if (res.data.code) {
                        $scope.followModel.list = res.data.data;
                    }
                });
            },
            initEditModel: function () {
                $scope.followModel.fileNames = [];
                $scope.followModel.tempfileNames = [];
                $scope.followModel.fileList = [];
                CustomerNetService.follow.getLastComment($scope.httpConfig).then(function (res) {
                    if (res.data.code) {
                        // 重置跟进信息时，保留跟进内容
                        if ($scope.isOrigin) {
                            $scope.followModel.editModel = res.data.data;
                            $scope.followModel.editModel.info = $scope.uiModel.static.followInfo;
                        } else {
                            $scope.followModel.editModel = res.data.data;
                        }
                        if (res.data.data.level_id == '6' || res.data.data.level_id == '7') {
                            $scope.followModel.canChange = true;
                            $scope.followModel.editModel.next_time = '';
                        }
                        if ($scope.followModel.tempMessage != '') {
                            $scope.followModel.editModel.info = $scope.followModel.tempMessage;
                        }
                    } else {
                        $prompt.timeout($scope, res);
                    }
                });
            },
            fileClick: function () {
                document.getElementById('payload').click();
            },
            fileAdd: function () {
                if ($scope.isAjaxing) {
                    return;
                }
                var files = document.getElementById('payload').files;

                if (($scope.followModel.fileList.length + files.length) > 4) {
                    $scope.prompt('上传图片不得多于4张', 500);
                    return;
                }
                var data = {};
                var index = 0;
                for (var i = $scope.followModel.fileList.length, l = $scope.followModel.fileList.length + files.length; i < l; i++) {
                    if (files[index].size > 5242880) {
                        $prompt.timeout($scope, {
                            data: {
                                code: 500,
                                message: '图片不得大于5M'
                            }
                        });
                        return;
                    } else {
                        data['img' + i] = files[index];
                        $scope.followModel.tempfileNames.push(files[index].name);
                    }
                    index++;
                }
                $scope.isAjaxing = true;
                CustomerNetService.follow.uploadImg(data, $scope).then(function (res) {
                    $scope.isAjaxing = false;
                    if (res.data.code) {
                        $scope.followModel.fileList = $scope.followModel.fileList.concat(res.data.data);
                        $scope.followModel.fileNames = angular.copy($scope.followModel.tempfileNames);
                    } else {
                        $prompt.timeout($scope, res);
                    }
                });

            },
            fileDelete: function (index) {
                $scope.followModel.tempfileNames.splice(index, 1);
                $scope.followModel.fileNames.splice(index, 1);
                $scope.followModel.fileList.splice(index, 1);
            }
        }
    };
    // 调研模块
    $scope.surveyModel = {
        detail: {},
        list: [],
        tempSurveyId: '',
        urlModal: {
            title: '调研表链接',
            flag: false,
            list: [],
            product_id: '',
            url: '',
            hide: function () {
                this.flag = false;
            },
            show: function () {
                if ($scope.orderModel.order_id && $scope.httpConfig.customer_id && $scope.customer && !$scope.rflag && $scope.isOrigin) {

                    var data = {
                        order_id: $scope.orderModel.order_id,
                        customer_id: $scope.httpConfig.customer_id,
                        customer: $scope.customer,
                        second_product_id: $scope.orderModel.second_product_id
                    };
                    // 2.2.5改进，所有查看调研表需先check
                    CustomerNetService.button.checkBeforeCreateUrl($scope.orderModel.order_id, $scope.orderModel.second_product_id).then(function (res) {
                        if (res.data.code) {
                            CustomerNetService.survey.createURL(data).then(function (res) {
                                if (res.data.code) {
                                    $scope.surveyModel.urlModal.product_id = '';
                                    $scope.surveyModel.urlModal.url = '';
                                    $scope.surveyModel.urlModal.list = res.data.data;
                                    $scope.surveyModel.urlModal.flag = true;
                                }
                            });
                        }
                        else {
                            $prompt.timeout($scope, res);
                        }
                    });

                }
            },
            productChange: function (obj) {
                $scope.surveyModel.urlModal.product_id = obj.product_id;
                this.url = obj.survey_url;
            },
            showMessage: function () {
                $prompt.timeout($scope, {
                    data: {
                        code: 1,
                        message: '操作成功'
                    }
                });
                this.flag = false;
            }
        },
        methods: {
            reset: function () {
                $scope.surveyModel.detail = {};
                $scope.surveyModel.list = [];
                $scope.surveyModel.tempSurveyId = '';
            },
            changeSurvey: function (id) {
                $scope.surveyModel.tempSurveyId = id;
                $scope.surveyModel.methods.getDetail(id);
            },
            delete: function () {
                if ($scope.isAjaxing) {
                    return;
                }
                $scope.isAjaxing = true;
                if ($scope.surveyModel.tempSurveyId) {
                    CustomerNetService.survey.delete($scope.surveyModel.tempSurveyId).then(function (res) {
                        $scope.isAjaxing = false;
                        if (res.data.code) {
                            res.data.code = 1;
                            $scope.surveyModel.methods.getList();
                        }
                        $prompt.timeout($scope, res);


                    });
                }
            },
            showDeleteResearch: function () {
                if ($scope.orderModel.second_product_id == 10007) {
                    CustomerNetService.button.checkBeforeDeleteSurvey($scope.orderModel.order_id).then(function (res) {
                        if (res.data.code) {
                            $confirm_cancel.show({
                                id: 'uiViews',
                                title: '删除',
                                text: '确认将该调研信息删除吗？',
                                remarks: '确定后，1份调研信息将删除',
                                buttons: [{
                                    text: '确定',
                                    ontap: function () {
                                        $confirm_cancel.hide().then(function () {
                                            $scope.surveyModel.methods.delete();
                                        });
                                    }
                                }],
                                scope: $scope
                            });
                        }
                        else {
                            $prompt.timeout($scope, res);
                        }
                    });
                } else {
                    $confirm_cancel.show({
                        id: 'uiViews',
                        title: '删除',
                        text: '确认将该调研信息删除吗？',
                        remarks: '确定后，1份调研信息将删除',
                        buttons: [{
                            text: '确定',
                            ontap: function () {
                                $confirm_cancel.hide().then(function () {
                                    $scope.surveyModel.methods.delete();
                                });
                            }
                        }],
                        scope: $scope
                    });
                }
            },
            getList: function () {
                if ($scope.orderModel.order_id != 0) {
                    $scope.https.surveylist = true;

                    CustomerNetService.survey.getList($scope.orderModel.order_id).then(function (res) {
                        $scope.https.surveylist = false;
                        if (res.data.code) {
                            if (res.data.data && res.data.data.length > 0) {
                                $scope.surveyModel.list = res.data.data;
                                if (!$stateParams.survey_id) {
                                    $scope.surveyModel.tempSurveyId = res.data.data[0].survey_id;
                                    $scope.surveyModel.methods.getDetail($scope.surveyModel.tempSurveyId);
                                } else {
                                    $scope.surveyModel.tempSurveyId = $stateParams.survey_id;
                                    $scope.surveyModel.methods.getDetail($stateParams.survey_id);
                                    $stateParams.survey_id = '';
                                }
                            } else {
                                $scope.surveyModel.list = [];
                                $scope.surveyModel.tempSurveyId = 0;
                                $scope.surveyModel.detail = {};
                                $scope.https.surveydetail = false;
                            }
                        } else {
                            $prompt.timeout($scope, res);
                        }
                    });
                } else {
                    $scope.https.surveylist = false;
                    $scope.https.surveydetail = false;
                }
            },
            getDetail: function (id) {
                if ($scope.isAjaxing) {
                    return;
                }
                $scope.isAjaxing = true;
                $scope.https.surveydetail = true;
                CustomerNetService.survey.getDetail(id, $scope.orderModel.order_id).then(function (res) {
                    $scope.https.surveydetail = false;
                    $scope.isAjaxing = false;
                    if (res.data.code) {
                        $scope.surveyModel.detail = res.data.data;
                        $scope.surveyModel.detail.showType = CommonService.replaceTeXunProductId(res.data.data.third_product_id);
                    } else {
                        $prompt.timeout($scope, res);
                    }
                });
            }
        }
    };
    // 开票管理模块
    $scope.taxModel = {
        ayChoose: 1, // 1 pay,2 mail
        payList: [],
        mailList: [],
        changeShowType: function (type) {
            if (type) {
                $scope.taxModel.ayChoose = type;
            }
            if ($scope.taxModel.ayChoose == 1) {
                CustomerNetService.tax.getList($scope.httpConfig).then(function (res) {
                    if (res.data.code) {
                        $scope.taxModel.payList = res.data.data;
                    } else {
                        $prompt.timeout($scope, res);
                    }
                });
            } else {
                // 加载邮寄信息
                CustomerNetService.address.getList($scope.httpConfig).then(function (res) {
                    if (res.data.code) {
                        $scope.taxModel.mailList = res.data.data;
                    } else {
                        $prompt.timeout($scope, res);
                    }
                });
            }
        },
        pay: {
            data: {
                tax_title: '',
                tax_no: '',
                tax_address: '',
                tax_phone: '',
                tax_account: '',
                tax_bank: ''
            },
            flag: false,
            title: '新建付款信息',
            show: function (obj) {
                if (obj) {
                    this.title = '编辑付款信息';
                    $scope.taxModel.pay.data = obj;
                } else {
                    this.title = '新建付款信息';
                    $scope.taxModel.pay.data = {};
                }
                this.flag = true;
            },
            hide: function () {
                this.flag = false;
            },
            confirm: function () {
                if ($scope.isAjaxing) {
                    return;
                }
                var error = CustomerService.checkTax($scope.taxModel.pay.data);
                if (error) {
                    $scope.prompt(error, 500);
                    return;
                }
                $scope.isAjaxing = true;
                var obj = $scope.taxModel.pay.data;
                if (obj.tax_id) {
                    obj.operate_pid = $scope.httpConfig.operate_pid;
                    CustomerNetService.tax.update(obj).then(function (res) {
                        $scope.isAjaxing = false;
                        $scope.taxModel.pay.flag = false;
                        $prompt.timeout($scope, res);
                        $scope.taxModel.changeShowType();
                    });
                } else {
                    obj.customer_id = $scope.httpConfig.customer_id;
                    obj.operate_pid = $scope.httpConfig.operate_pid;
                    CustomerNetService.tax.insert(obj).then(function (res) {
                        $scope.isAjaxing = false;
                        $scope.taxModel.pay.flag = false;
                        $prompt.timeout($scope, res);
                        $scope.taxModel.changeShowType();
                    });
                }
            },
            delete: function (obj) {
                $confirm_cancel.show({
                    id: 'uiViews',
                    title: '删除付款信息',
                    text: '确认将该付款信息删除吗？',
                    remarks: '确定后，该付款信息将被删除',
                    buttons: [{
                        text: '确定',
                        ontap: function () {
                            $confirm_cancel.hide().then(function () {
                                // delete
                                CustomerNetService.tax.delete({ tax_id: obj.tax_id, customer_id: obj.customer_id, operate_pid: $scope.httpConfig.operate_pid }).then(function (res) {
                                    $scope.taxModel.changeShowType();
                                    $prompt.timeout($scope, res);
                                });
                            });
                        }
                    }],
                    scope: $scope
                });
            }
        },
        mail: {
            data: {
                mail_address: '',
                receiver: '',
                receiver_phone: ''
            },
            flag: false,
            title: '新建编辑信息',
            show: function (obj) {
                if (obj) {
                    this.title = '编辑邮寄信息';

                    $scope.taxModel.mail.data = obj;
                } else {
                    this.title = '新建邮寄信息';
                    $scope.taxModel.mail.data = {};
                }
                this.flag = true;
            },
            hide: function () {
                this.flag = false;
            },
            confirm: function () {
                if ($scope.isAjaxing) {
                    return;
                }
                var error = CustomerService.checkAddress($scope.taxModel.mail.data);
                if (error) {
                    $scope.prompt(error, 500);
                    return;
                }
                $scope.isAjaxing = true;
                var obj = $scope.taxModel.mail.data;
                if (obj.address_id) {

                    obj.operate_pid = $scope.httpConfig.operate_pid;
                    CustomerNetService.address.update(obj).then(function (res) {
                        $scope.isAjaxing = false;
                        $scope.taxModel.mail.flag = false;
                        $prompt.timeout($scope, res);
                        $scope.taxModel.changeShowType();
                    });
                } else {
                    obj.customer_id = $scope.httpConfig.customer_id;
                    obj.operate_pid = $scope.httpConfig.operate_pid;
                    CustomerNetService.address.insert(obj).then(function (res) {
                        $scope.isAjaxing = false;
                        $scope.taxModel.mail.flag = false;
                        $prompt.timeout($scope, res);
                        $scope.taxModel.changeShowType();
                    });
                }
            },
            delete: function (obj) {
                $confirm_cancel.show({
                    id: 'uiViews',
                    title: '删除邮寄信息',
                    text: '确认将该邮寄信息删除吗？',
                    remarks: '确定后，该邮寄信息将被删除',
                    buttons: [{
                        text: '确定',
                        ontap: function () {
                            $confirm_cancel.hide().then(function () {
                                // delete
                                CustomerNetService.address.delete({ address_id: obj.address_id, customer_id: obj.customer_id, operate_pid: $scope.httpConfig.operate_pid }).then(function (res) {
                                    $scope.taxModel.changeShowType();
                                    $prompt.timeout($scope, res);
                                });
                            });
                        }
                    }],
                    scope: $scope
                });
            }
        }
    };
    // 营收模块 
    $scope.orderIncomeModel = {
        model: {
            income: [],
            refund: []
        },
        // 用于执行班次修改
        classRank: '',
        methods: {
            getList: function () {
                if ($scope.orderModel.order_id != 0) {
                    $scope.https.incomelist = true;
                    CustomerNetService.orderIncome.getList($scope.orderModel.order_id, $scope.orderModel.second_product_id).then(function (res) {
                        $scope.https.incomelist = false;
                        if (res.data.code) {
                            $scope.orderIncomeModel.model = res.data.data;
                        }
                    });
                } else {
                    $scope.https.incomelist = false;
                }
            },
            changeClassRank: function () {
                if ($scope.isAjaxing) {
                    return;
                }

                if ($scope.orderIncomeModel.classRank) {
                    $scope.isAjaxing = true;
                    CustomerNetService.orderIncome.changeClass({ order_id: $scope.orderModel.order_id, class_id: $scope.orderIncomeModel.classRank }).then(
                        function (res) {
                            $scope.isAjaxing = false;
                            if (res.data.code) {
                                res.data.code = 1;
                                $scope.modalList.classEdit = false;
                            }
                            $prompt.timeout($scope, res);
                            $scope.orderIncomeModel.getList();
                        }
                    );
                } else {
                    $prompt.timeout($scope, {
                        data: {
                            code: 500,
                            message: '请选择合同班次'
                        }
                    });
                }
            },
            reset: function () {
                $scope.orderIncomeModel.model = {
                    income: [],
                    refund: []
                };
            }
        }

    };
    // 学员模块
    $scope.studentModel = {
        list: [],
        detail: {},
        tempStuId: 0,
        selectList: {
            sex: [{ id: '1', name: '男' }, { id: '2', name: '女' }],
            education: [{ id: '0', name: '无' }, { id: '1', name: '小学' }, { id: '2', name: '初中' }, { id: '3', name: '高中' }, { id: '4', name: '中专' }, { id: '5', name: '大专' }, { id: '6', name: '本科及以上' }],
            classList: []
        },
        changeClassId: '',
        editModal: {
            flag: false,
            title: '学员编辑',
            data: {},
            hide: function () {
                this.flag = false;
            },
            show: function () {
                if ($scope.orderModel.second_product_id == 10007 || $scope.orderModel.second_product_id == 10008) {
                    CustomerNetService.button.checkBeforeUpdateStu({ order_id: $scope.orderModel.order_id, student_id: $scope.studentModel.tempStuId, second_product_id: $scope.orderModel.second_product_id }).then(function (res) {
                        if (res.data.code) {
                            $scope.studentModel.editModal.data = angular.copy($scope.studentModel.detail);
                            $scope.studentModel.editModal.flag = true;
                        }
                        else {
                            $prompt.timeout($scope, res);
                        }
                    });
                } else {
                    $scope.studentModel.editModal.data = angular.copy($scope.studentModel.detail);
                    $scope.studentModel.editModal.flag = true;
                }
            },
            confirm: function () {
                if ($scope.isAjaxing) {
                    return;
                }
                // 校验
                var error = '';
                if (this.data.name == '') {
                    error = '请输入姓名';
                }
                if (error != '') {
                    $scope.prompt(error, 500);
                    return;
                }
                $scope.isAjaxing = true;
                CustomerNetService.student.update(this.data, $scope.orderModel.second_product_id).then(function (res) {
                    $scope.isAjaxing = false;
                    if (res.data.code) {
                        res.data.code = 1;
                        $scope.studentModel.editModal.flag = false;
                        $scope.studentModel.methods.getList($scope.studentModel.editModal.data.student_id);
                    }
                    $prompt.timeout($scope, res);
                });
            }
        },
        changeClass: {
            flag: false,
            title: '变更执行班次',
            data: {},
            hide: function () {
                this.flag = false;
            },
            show: function () {
                CustomerNetService.button.checkBeforeUpdateClass({ order_id: $scope.orderModel.order_id, student_id: $scope.studentModel.tempStuId, second_product_id: $scope.orderModel.second_product_id }).then(function (res) {
                    if (res.data.code) {
                        CustomerNetService.student.getClassList($scope.studentModel.detail.third_product_id, $scope.orderModel.second_product_id).then(function (res) {
                            if (res.data.code) {
                                $scope.studentModel.selectList.classList = res.data.data;
                                $scope.studentModel.changeClassId = $scope.studentModel.detail.class_id;
                                $scope.studentModel.changeClass.flag = true;
                            } else {
                                $prompt.timeout($scope, res);
                            }
                        });
                    }
                    else {
                        $prompt.timeout($scope, res);
                    }
                });
            },
            confirm: function () {
                if ($scope.isAjaxing) {
                    return;
                }
                // 校验
                var data = {
                    student_id: $scope.studentModel.detail.student_id,
                    class_id: $scope.studentModel.changeClassId,
                    second_product_id: $scope.orderModel.second_product_id
                };
                $scope.isAjaxing = true;
                CustomerNetService.student.updateClass(data).then(function (res) {
                    $scope.isAjaxing = false;
                    if (res.data.code) {
                        res.data.code = 1;
                        $scope.studentModel.changeClass.flag = false;
                        $scope.orderModel.methods.getDetail();
                    }
                    $prompt.timeout($scope, res);
                });
            }
        },
        methods: {
            changeStu: function (id) {
                $scope.studentModel.tempStuId = id;
                $scope.studentModel.methods.getDetail(id);
            },
            initInsertModel: function () {
                if ($scope.orderModel.order_id == 0 || $scope.rflag || !$scope.isOrigin) {
                    return;
                }

                if ($scope.orderModel.second_product_id == 10007 || $scope.orderModel.second_product_id == 10000) {
                    CustomerNetService.button.checkBeforeInsertStu({ order_id: $scope.orderModel.order_id, second_product_id: $scope.orderModel.second_product_id }).then(function (res) {
                        if (res.data.code) {
                            $state.go('studentAdd', { order_id: $scope.orderModel.order_id, customer_id: $scope.httpConfig.customer_id, operate_pid: $scope.httpConfig.operate_pid, second_product_id: $scope.orderModel.second_product_id });
                            return;
                        }
                        else {
                            $prompt.timeout($scope, res);
                        }
                    });

                }
                // 2.2.5新建学员通用
                else {
                    $state.go('studentAdd', { order_id: $scope.orderModel.order_id, customer_id: $scope.httpConfig.customer_id, operate_pid: $scope.httpConfig.operate_pid, second_product_id: $scope.orderModel.second_product_id });
                    return;
                }
            },
            showDeleteStudent: function () {
                if ($scope.orderModel.second_product_id == 10007) {
                    CustomerNetService.button.checkBeforeDeleteStu({ student_id: $scope.studentModel.detail.student_id, order_id: $scope.orderModel.order_id }).then(function (res) {
                        if (res.data.code) {
                            var studentName = $scope.studentModel.detail.name || 'error';
                            $confirm_cancel.show({
                                id: 'uiViews',
                                title: '删除',
                                text: '确认将学员【' + studentName + '】删除吗？',
                                remarks: '确定后，1位学员将删除',
                                buttons: [{
                                    text: '确定',
                                    ontap: function () {
                                        $confirm_cancel.hide().then(function () {
                                            $scope.studentModel.methods.delete();
                                        });
                                    }
                                }],
                                scope: $scope
                            });
                        }
                        else {
                            $prompt.timeout($scope, res);
                        }
                    });
                }
                else if ($scope.orderModel.second_product_id == 10008) {
                    CustomerNetService.common.checkBeforeDeleteStu({ student_id: $scope.studentModel.detail.student_id, order_id: $scope.orderModel.order_id, second_product_id: $scope.orderModel.second_product_id }).then(function (res) {
                        if (res.data.code) {
                            var studentName = $scope.studentModel.detail.name || 'error';
                            $confirm_cancel.show({
                                id: 'uiViews',
                                title: '删除',
                                text: '确认将学员【' + studentName + '】删除吗？',
                                remarks: '确定后，1位学员将删除',
                                buttons: [{
                                    text: '确定',
                                    ontap: function () {
                                        $confirm_cancel.hide().then(function () {
                                            $scope.studentModel.methods.delete();
                                        });
                                    }
                                }],
                                scope: $scope
                            });
                        }
                        else {
                            $prompt.timeout($scope, res);
                        }
                    });
                }
                else {
                    var studentName = $scope.studentModel.detail.name || 'error';
                    $confirm_cancel.show({
                        id: 'uiViews',
                        title: '删除',
                        text: '确认将学员【' + studentName + '】删除吗？',
                        remarks: '确定后，1位学员将删除',
                        buttons: [{
                            text: '确定',
                            ontap: function () {
                                $confirm_cancel.hide().then(function () {
                                    $scope.studentModel.methods.delete();
                                });
                            }
                        }],
                        scope: $scope
                    });
                }
            },
            delete: function () {
                if ($scope.isAjaxing) {
                    return;
                }
                if ($scope.studentModel.tempStuId) {
                    $scope.isAjaxing = true;

                    CustomerNetService.student.delete($scope.studentModel.tempStuId, $scope.orderModel.second_product_id).then(function (res) {
                        $scope.isAjaxing = false;
                        if (res.data.code) {
                            res.data.code = 1;
                        }
                        $prompt.timeout($scope, res);
                        $scope.studentModel.methods.getList();
                    });
                } else {
                    $scope.prompt('请选择学员', 500);
                }
            },
            getList: function (studentId) {
                if ($scope.orderModel.order_id != 0) {
                    $scope.https.studentlist = true;
                    CustomerNetService.student.getList($scope.orderModel.order_id, $scope.orderModel.second_product_id).then(function (res) {
                        $scope.https.studentlist = false;
                        if (res.data.code) {
                            if (res.data.data && res.data.data.length > 0) {
                                $scope.studentModel.list = res.data.data;
                                if (studentId) {
                                    $scope.studentModel.tempStuId = studentId;
                                    $scope.studentModel.methods.getDetail($scope.studentModel.tempStuId);
                                } else {
                                    $scope.studentModel.tempStuId = res.data.data[0].student_id;
                                    $scope.studentModel.methods.getDetail($scope.studentModel.tempStuId);
                                }
                            } else {
                                $scope.studentModel.list = [];
                                $scope.studentModel.tempStuId = 0;
                                $scope.studentModel.detail = {};
                                $scope.https.studentdetail = false;
                            }

                        }
                    });
                } else {
                    $scope.https.studentlist = false;
                    $scope.https.studentdetail = false;
                }
            },
            getDetail: function (id) {
                if ($scope.isAjaxing || id == 0) {
                    return;
                }
                $scope.isAjaxing = true;
                $scope.https.studentdetail = true;

                CustomerNetService.student.getDetail(id, $scope.orderModel.second_product_id).then(function (res) {
                    $scope.isAjaxing = false;
                    $scope.https.studentdetail = false;
                    if (res.data.code) {
                        if (res.data.data) {
                            $scope.studentModel.detail = res.data.data;
                        }
                    }
                });
            },
            reset: function () {
                $scope.studentModel.list = [];
                $scope.studentModel.detail = {};
                $scope.studentModel.tempStuId = 0;
            }
        }
    };
    // 订单模块
    $scope.orderModel = {
        detail: {},
        list: [],
        editModel: {},
        order_id: 0,
        product_tag: '',
        first_product_id: '',
        second_product_id: '',
        third_product_id: 0,
        limitTax: new Date().getDate() < 25,
        refundTypes: [{ id: 3, name: '违约退款' }, { id: 4, name: '暂存款退款' }, { id: 10, name: '押金退款' }],
        refundChannels: [{ id: 1, name: '支付宝' }, { id: 2, name: '银行' }, { id: 3, name: '其他' }],
        applyTax: {
            type: '',
            purpose: '',
            price: ''
        },
        tempfileNames: [],
        fileNames: [],
        refundInfo: {},
        showMore: false,
        refundModal: {
            flag: false,
            data: {},
            req: {},
            title: '退款申请',
            hide: function () {
                this.flag = false;
            },
            show: function () {
                if ($scope.isAjaxing) {
                    return;
                }
                $scope.orderModel.refundModal.req.price = '';
                $scope.orderModel.refundModal.req.approval_type = '';
                $scope.orderModel.refundModal.req.reason = '';
                $scope.orderModel.refundModal.req.received_id = '';
                $scope.orderModel.refundModal.req.channel = '';
                $scope.orderModel.refundModal.req.imgs = [];
                $scope.orderModel.tempfileNames = [];
                $scope.orderModel.fileNames = [];
                $scope.isAjaxing = true;
                CustomerNetService.button.checkBeforeRefund({ order_id: $scope.orderModel.order_id, second_product_id: $scope.orderModel.second_product_id }).then(function (res) {
                    $scope.isAjaxing = false;
                    if (res.data.code) {
                        CustomerNetService.order.getRefundInfo($scope.orderModel.order_id).then(function (res) {
                            if (res.data.code) {
                                $scope.orderModel.refundModal.data.refund_amount_spare = res.data.data.refund_amount_spare;
                                $scope.orderModel.refundModal.data.refund_amount_weiyue = res.data.data.refund_amount_weiyue;
                                $scope.orderModel.refundModal.data.received_list = res.data.data.received_list;
                                $scope.orderModel.refundModal.data.refund_type_arr = res.data.data.refund_type_arr;
                                $scope.orderModel.refundModal.flag = true;
                                if ($scope.orderModel.second_product_id == 10008) {

                                    // 淘大退款渠道一律为其他
                                    $scope.orderModel.refundModal.req.channel = 3;
                                }
                            }
                        });
                    } else {
                        $prompt.timeout($scope, res);
                    }
                });
            },
            confirm: function () {
                if ($scope.isAjaxing) {
                    return;
                }
                var error = CustomerService.checkApprovalStatus($scope.orderModel.detail.approval_status, $scope.orderModel.detail.approval_type);
                if (error) {
                    $scope.prompt('当前订单正在进行' + error, 500);
                    return;
                }
                // 必填项校验
                var require = '';
                if (this.req.approval_type === '') {
                    require = '请选择退款类型';
                } else if ($scope.orderModel.second_product_id != '10008' && this.req.channel == '') {
                    require = '请选择退款渠道';
                } else if (this.req.price === '') {
                    require = '请输入退款金额';
                } else if (this.req.channel != 3 && this.req.received_id == '') {
                    require = '请选择退款信息';
                } else if (this.req.reason == '') {
                    require = '请输入退款理由';
                }
                if (require !== '') {
                    $scope.prompt(require);
                    return;
                }
                $scope.isAjaxing = true;
                var data = {
                    order_id: $scope.orderModel.order_id,
                    refund_amount: this.req.price,
                    approval_type: this.req.approval_type,
                    received_id: this.req.received_id,
                    refund_reason: this.req.reason,
                    refund_channel: this.req.channel,
                    pics: this.req.imgs,
                    second_product_id: $scope.orderModel.second_product_id
                };
                CustomerNetService.order.applyRefund(data).then(function (res) {
                    $scope.isAjaxing = false;

                    if (res.data.code) {
                        res.data.code = 1;
                        // this.req.price = '';
                        $scope.orderModel.methods.getDetail();
                        $scope.orderModel.refundModal.hide();
                    }
                    $prompt.timeout($scope, res);
                });
            },
            changeChannel: function (channel) {
                this.req.channel = channel;
            }
        },
        methods: {
            edit: function () {
                if ($scope.isAjaxing) {
                    return;
                }
                $scope.isAjaxing = true;
                CustomerNetService.order.checkBeforeUpdate({ order_id: $scope.orderModel.order_id, second_product_id: $scope.orderModel.second_product_id }).then(function (res) {
                    $scope.isAjaxing = false;
                    if (res.data.code) {
                        if ($scope.orderModel.second_product_id == '10007') {
                            $state.go('orderOfflineEdit', { order_id: $scope.orderModel.order_id, customer_id: $scope.httpConfig.customer_id, second_product_id: $scope.orderModel.second_product_id, operate_pid: $scope.httpConfig.operate_pid, customer: $scope.customer });
                        }
                        else if ($scope.orderModel.second_product_id == '10008' && $scope.orderModel.product_tag != '1') {
                            $state.go('orderOfflineEdit', { order_id: $scope.orderModel.order_id, customer_id: $scope.httpConfig.customer_id, second_product_id: $scope.orderModel.second_product_id, operate_pid: $scope.httpConfig.operate_pid, customer: $scope.customer });
                        }
                        else if ($scope.orderModel.second_product_id == '10008' && $scope.orderModel.product_tag == '1') {
                            $state.go('orderOnlineEdit', { order_id: $scope.orderModel.order_id, customer_id: $scope.httpConfig.customer_id, second_product_id: $scope.orderModel.second_product_id, operate_pid: $scope.httpConfig.operate_pid, customer: $scope.customer });
                        }
                        else if ($scope.orderModel.second_product_id == '10000' || $scope.orderModel.second_product_id == '10006') {
                            $state.go('orderOnlineEdit', { order_id: $scope.orderModel.order_id, customer_id: $scope.httpConfig.customer_id, second_product_id: $scope.orderModel.second_product_id, operate_pid: $scope.httpConfig.operate_pid, customer: $scope.customer });
                        } else if ($scope.orderModel.second_product_id == '10217') {
                            $scope.aiyouEdit.show();
                        }
                    } else {
                        $prompt.timeout($scope, res);
                    }
                });
            },
            changeOrder: function (id, second, product_id, product_tag) {
                $scope.orderModel.order_id = id;
                $scope.orderModel.second_product_id = second;
                $scope.orderModel.third_product_id = product_id;
                $scope.orderModel.product_tag = product_tag;
                $scope.orderModel.methods.getDetail();
                // 切换订单编辑页面模版
                // 如果是爱柚定制，则置灰编辑订单按钮
                if ((!$scope.orderModel.third_product_id || $scope.orderModel.third_product_id == '10026' || $scope.orderModel.third_product_id == '10043' || $scope.orderModel.third_product_id == '10017') && $scope.orderModel.second_product_id != '10007') {
                    $scope.canEditOrder = false;
                } else {
                    $scope.canEditOrder = true;
                }
                //$scope.orderEditModel.methods.switchEditType($scope.orderModel.third_product_id);
                // 暂存发布信息
                if ($scope.followModel.editModel.info != '') {
                    $scope.followModel.tempMessage = $scope.followModel.editModel.info;
                }
            },
            // 重置详情列表
            reloadDetail: function () {
                $scope.orderModel.methods.getDetail();
            },
            getList: function (orderId) {
                if ($scope.isAjaxing) {
                    return;
                }
                $scope.isAjaxing = true;
                $scope.https.orderlist = true;
                CustomerNetService.order.getList($scope.httpConfig).then(function (res) {
                    $scope.isAjaxing = false;
                    $scope.https.orderlist = false;
                    if (res.data.code) {
                        if (res.data.data && res.data.data.length > 0) {
                            $scope.orderModel.list = res.data.data;
                            // 初始化加载 order_id,product_id
                            if (!orderId) {
                                $scope.orderModel.order_id = res.data.data[0].order_id;

                                $scope.orderModel.second_product_id = res.data.data[0].second_product_id;
                                $scope.orderModel.third_product_id = res.data.data[0].third_product_id;
                                $scope.orderModel.product_tag = res.data.data[0].product_tag;
                            }
                            $scope.orderModel.methods.getDetail();
                            // 切换订单编辑页面模版
                            // 如果是爱柚定制，则置灰编辑订单按钮
                            if ((!$scope.orderModel.third_product_id || $scope.orderModel.third_product_id == '10026' || $scope.orderModel.third_product_id == '10043' || $scope.orderModel.third_product_id == '10017') && $scope.orderModel.second_product_id != '10007') {
                                $scope.canEditOrder = false;
                            } else {
                                $scope.canEditOrder = true;
                            }
                        } else {
                            $scope.orderModel.methods.reset();
                            $scope.https.orderdetail = false;
                            $scope.changeChildTab($scope.uiModel.choosen.childTabIndex);
                        }
                    }
                });
            },
            reset: function () {
                $scope.orderModel.list = [];
                $scope.orderModel.detail = {};
                $scope.orderModel.order_id = 0;
                $scope.billModel.methods.reset();
                $scope.studentModel.methods.reset();
                $scope.orderIncomeModel.methods.reset();
                $scope.surveyModel.methods.reset();

            },
            getDetail: function () {
                if ($scope.isAjaxing) {
                    return;
                }
                $scope.https.orderdetail = true;
                $scope.isAjaxing = true;
                CustomerNetService.order.getDetail($scope.orderModel.order_id, $scope.orderModel.second_product_id).then(function (res) {
                    $scope.isAjaxing = false;
                    $scope.https.orderdetail = false;
                    if (res.data.code) {
                        $scope.orderModel.first_product_id = res.data.data.first_product_id;
                        if ($scope.orderModel.first_product_id == 4 && ($scope.uiModel.choosen.childTabIndex == 0 || $scope.uiModel.choosen.childTabIndex == 4)) {
                            $scope.uiModel.choosen.childTabIndex = $stateParams.rmenu_index ? parseInt($stateParams.rmenu_index) : 4;
                        }
                        $scope.orderModel.detail = res.data.data;
                        $scope.orderModel.editModel = angular.copy(res.data.data);
                        $scope.buttons = CustomerService.buttonController(res.data.data, $scope.orderModel.second_product_id);
                        $scope.changeChildTab($scope.uiModel.choosen.childTabIndex);
                    }
                });
            },
            // 申请开票
            applyTax: function () {
                if ($scope.isAjaxing) {
                    return;
                }
                var error = CustomerService.checkApprovalStatus($scope.orderModel.detail.approval_status, $scope.orderModel.detail.approval_type);
                if (error) {
                    $scope.prompt('当前订单正在进行' + error, 500);
                    return;
                }
                var data = angular.copy($scope.orderModel.applyTax);
                data.order_id = $scope.orderModel.order_id;
                data.second_product_id = $scope.orderModel.second_product_id;
                var msg = CustomerService.checkApplyTax(data);
                if (msg != '') {
                    $scope.prompt(msg, 500);
                    return;
                }
                $scope.isAjaxing = true;
                CustomerNetService.order.applyTax(data).then(function (res) {
                    $scope.isAjaxing = false;
                    if (res.data.code) {
                        $scope.modalList.createInvoice = false;
                        res.data.code = 1;
                        $scope.orderModel.methods.getDetail();
                    }
                    // 重置applyTax 模型
                    $scope.orderModel.applyTax = {
                        order_id: $scope.orderModel.order_id,
                        type: '',
                        purpose: '',
                        price: ''
                    };
                    $prompt.timeout($scope, res);
                });
            },
            // 提交审核
            showReview: function () {
                if ($scope.isAjaxing) {
                    return;
                }
                $scope.isAjaxing = true;
                CustomerNetService.button.checkBeforeExecute({ order_id: $scope.orderModel.order_id, second_product_id: $scope.orderModel.second_product_id }).then(function (res) {
                    $scope.isAjaxing = false;
                    if (res.data.code) {
                        $confirm_cancel.show({
                            id: 'uiViews',
                            title: '提交审核资格',
                            text: '确认将【' + ($scope.customer || '测试') + '】提交审核资格',
                            remarks: '确定后，1位客户将提交审核资格',
                            buttons: [{
                                text: '确定',
                                ontap: function () {
                                    $confirm_cancel.hide().then(function () {
                                        $scope.orderModel.methods.applyExecute($scope.orderModel.order_id);
                                    });
                                }
                            }],
                            scope: $scope
                        });
                    } else {
                        $prompt.timeout($scope, res);
                    }
                });
            },
            applyExecute: function () {
                if ($scope.isAjaxing) {
                    return;
                }
                $scope.isAjaxing = true;
                CustomerNetService.order.applyExecute({ order_id: $scope.orderModel.order_id, second_product_id: $scope.orderModel.second_product_id }).then(function (res) {
                    $scope.isAjaxing = false;
                    if (res.data.code) {
                        res.data.code = 1;
                        $scope.orderModel.methods.getDetail();
                    }
                    $prompt.timeout($scope, res);
                });
            },
            // 电子合同
            contract: function () {
                var url = $state.href('constract', { order_id: $scope.orderModel.order_id, sign_id: $scope.orderModel.detail.sign_id, customer: $scope.customer, product_id: $scope.orderModel.third_product_id, second_product_id: $scope.orderModel.second_product_id });
                window.open(url, '_blank');
            },
            // 删除订单
            deleteOrderConfirm: function () {
                if ($scope.isAjaxing) {
                    return;
                }
                $scope.isAjaxing = true;
                CustomerNetService.button.checkBeforeDelete({ order_id: $scope.orderModel.order_id, second_product_id: $scope.orderModel.second_product_id }).then(function (res) {
                    $scope.isAjaxing = false;
                    if (res.data.code) {

                        $confirm_cancel.show({
                            id: 'uiViews',
                            title: '删除订单',
                            text: '确认将该订单删除吗？',
                            remarks: '确定后，该订单将被删除',
                            buttons: [{
                                text: '确定',
                                ontap: function () {
                                    $confirm_cancel.hide().then(function () {
                                        $scope.orderModel.methods.deleteOrder($scope.orderModel.order_id);
                                    });
                                }
                            }],
                            scope: $scope
                        });
                    } else {
                        $scope.prompt(res.data.msg, 500);
                    }
                });

            },
            deleteOrder: function (orderId) {
                if ($scope.isAjaxing) {
                    return;
                }
                $scope.isAjaxing = true;
                CustomerNetService.order.delete(orderId).then(function (res) {
                    $scope.isAjaxing = false;
                    if (res.data.code) {
                        res.data.code = 1;
                        $scope.orderModel.methods.getList();
                    }
                    $prompt.timeout($scope, res);
                });
            },
            uploadImg: function () {
                document.querySelector('#refund-img').click();
            },
            fileAdd: function () {
                if ($scope.isAjaxing) {
                    return;
                }
                var files = document.getElementById('refund-img').files;

                if (($scope.orderModel.refundModal.req.imgs.length + files.length) > 10) {
                    $scope.prompt('上传图片不得多于10张', 500);
                    return;
                }
                var data = {};
                var index = 0;
                for (var i = $scope.orderModel.refundModal.req.imgs.length, l = $scope.orderModel.refundModal.req.imgs.length + files.length; i < l; i++) {
                    if (files[index].size > 5242880) {
                        $prompt.timeout($scope, {
                            data: {
                                code: 500,
                                message: '图片不得大于5M'
                            }
                        });
                        return;
                    } else {
                        data['img' + i] = files[index];
                        $scope.orderModel.tempfileNames.push(files[index].name);
                    }
                    index++;
                }
                $scope.isAjaxing = true;
                CustomerNetService.order.uploadImg(data, $scope).then(function (res) {
                    $scope.isAjaxing = false;
                    if (res.data.code) {
                        $scope.orderModel.refundModal.req.imgs = $scope.orderModel.refundModal.req.imgs.concat(res.data.data);
                        $scope.orderModel.fileNames = angular.copy($scope.orderModel.tempfileNames);
                    } else {
                        $prompt.timeout($scope, res);
                    }
                });
            },
            deleteimg: function (index) {
                $scope.orderModel.tempfileNames.splice(index, 1);
                $scope.orderModel.fileNames.splice(index, 1);
                $scope.orderModel.refundModal.req.imgs.splice(index, 1);
            },
            // 重置退款金额
            resetPrice: function (approvalType) {
                if ($scope.orderModel.first_product_id != 4) {
                    if (approvalType) {
                        if (approvalType == 3) {
                            $scope.orderModel.refundModal.req.price = $scope.orderModel.refundModal.data.refund_amount_weiyue;
                        } else {
                            $scope.orderModel.refundModal.req.price = $scope.orderModel.refundModal.data.refund_amount_spare;
                        }
                    } else {
                        $scope.orderModel.refundModal.req.price = '';
                    }
                } else {
                    $scope.orderModel.refundModal.req.price = '';
                }
            },
            // 更多按钮
            toggleMore: function (e) {
                if (e) {
                    e.stopPropagation();
                }
                $scope.orderModel.showMore = !$scope.orderModel.showMore;
            },
            createOrder: function () {
                if (!$scope.mainFlag && $stateParams.customer_id && $stateParams.operate_pid && !$scope.rflag && $scope.isOrigin) {
                    $state.go('orderManage', { customer_id: $stateParams.customer_id, operate_pid: $scope.httpConfig.operate_pid, customer: $scope.customer, product_tag: $scope.orderModel.product_tag });
                }
            }
        }
    };

    // v3.0.0
    // 产品模块
    $scope.productModel = {
        tab: 0,
        productList: [],
        detail: {},
        changeList: [],
        presentList: [],
        changeDetail: {},
        presentDetail: {},
        pageForChange: {
            url: '/Crm/Product/getChangeList',
            page: { page_no: 1, page_size: 2 },
            filters: { contract_id: '' },
            ajaxing: false
        },
        pageForPresent: {
            url: '/Crm/Product/getGiftList',
            page: { page_no: 1, page_size: 2 },
            filters: { contract_id: '' },
            ajaxing: false
        },
        chooseChange: {},
        chooseItem: {},
        choosePresent: {},
        methods: {
            changeTab: function (index) {
                if ($scope.productModel.tab != index) {
                    $scope.productModel.tab = index;
                    $scope.productModel.methods.init(index);
                }
            },
            choosePresent: function (obj) {
                $scope.productModel.choosePresent = obj;
            },
            chooseChange: function (obj) {
                $scope.productModel.chooseChange = obj;
                $scope.productModel.methods.getChangeDetail([], true);
            },
            choose: function (obj) {
                $scope.productModel.chooseItem = obj;
                $scope.productModel.methods.init($scope.productModel.tab);
            },
            // 获取产品列表
            getProductList: function () {
                $scope.https.productlist = true;
                CustomerNetService.product.getList($scope.orderModel.order_id).then(function (res) {
                    $scope.https.productlist = false;
                    if (res.data.code) {
                        $scope.productModel.productList = res.data.data;
                        if ($scope.productModel.productList.length > 0) {
                            $scope.productModel.chooseItem = $scope.productModel.productList[0];
                            $scope.productModel.methods.init(0);
                        } else {
                            $scope.https.productdetail = false;
                        }
                    } else {
                        $prompt.timeout($scope, res);
                    }
                });
            },
            // 获取产品详情
            getProductDetail: function () {
                $scope.https.productdetail = true;
                CustomerNetService.product.getDetail({
                    third_product_id: $scope.productModel.chooseItem.third_product_id,
                    contract_id: $scope.productModel.chooseItem.contract_id
                }).then(function (res) {
                    $scope.https.productdetail = false;
                    if (res.data.code) {
                        $scope.productModel.detail = res.data.data;
                    } else {
                        $prompt.timeout($scope, res);
                    }
                });
            },
            // 获取变更内容详情
            getChangeDetail: function (list, no_list) {

                if (list && list.length > 0) {
                    $scope.productModel.chooseChange = list[0];
                    $scope.https.productchange = true;
                    CustomerNetService.product.getChangeDetail($scope.productModel.chooseChange.contract_change_id).then(function (res) {
                        $scope.https.productchange = false;
                        if (res.data.code) {
                            $scope.productModel.changeDetail = res.data.data;

                        } else {
                            $prompt.timeout($scope, res);
                        }
                    });
                } else if (no_list) {
                    $scope.productModel.chooseChange = $scope.productModel.changeList[0];
                    $scope.https.productchange = true;
                    CustomerNetService.product.getChangeDetail($scope.productModel.chooseChange.contract_change_id).then(function (res) {
                        $scope.https.productchange = false;
                        if (res.data.code) {
                            $scope.productModel.changeDetail = res.data.data;

                        } else {
                            $prompt.timeout($scope, res);
                        }
                    });
                }
                else {
                    $scope.https.productchange = false;
                }

            },
            // 获取赠送详情
            getPresentDetail: function (list) {
                if (list && list.length > 0) {
                    $scope.productModel.choosePresent = $scope.productModel.changeList[0];
                    $scope.https.productpresent = true;
                    CustomerNetService.product.getGiftDetail($scope.productModel.choosePresent.contract_change_id).then(function (res) {
                        $scope.https.productpresent = false;
                        if (res.data.code) {
                            $scope.productModel.presentDetail = res.data.data;

                        } else {
                            $prompt.timeout($scope, res);
                        }
                    });
                }

            },
            // 加载
            init: function (type) {
                switch (type) {
                    case 0: $scope.productModel.methods.getProductDetail(); break;
                    case 1: $scope.productModel.pageForChange.filters.contract_id = $scope.productModel.chooseItem.contract_id;
                        $timeout(function () {
                            $scope.$broadcast('pageSearch1');
                        }, 0);
                        break;
                    case 2: $scope.productModel.pageForPresent.filters.contract_id = $scope.productModel.chooseItem.contract_id;
                        $timeout(function () {
                            $scope.$broadcast('pageSearch2');
                        }, 0);
                        break;
                    default: return;
                }
            }
        }
    };
    // 变更与赠送模块
    $scope.changePresentModel = {
        list: [],
        detail: {},
        changeBill: {},
        chooseItem: {},
        button: {},
        tempChangeNo: '',
        methods: {
            getList: function () {
                $scope.https.changePresentlist = true;
                CustomerNetService.change.getList($scope.orderModel.order_id).then(function (res) {
                    $scope.https.changePresentlist = false;
                    if (res.data.code) {
                        $scope.changePresentModel.list = res.data.data.list;
                        $scope.changePresentModel.button = res.data.data.button;
                        if ($scope.changePresentModel.list.length > 0) {
                            // 区分变更详情和赠送详情
                            // 如果存在tempChangeNo,选中指定变更详情
                            if ($scope.changePresentModel.tempChangeNo) {
                                for (var i = 0, l = $scope.changePresentModel.list.length; i < l; i++) {
                                    if ($scope.changePresentModel.list[i].change_no == $scope.changePresentModel.tempChangeNo) {
                                        $scope.changePresentModel.chooseItem = $scope.changePresentModel.list[i];
                                        $scope.changePresentModel.tempChangeNo = '';
                                        break;
                                    }
                                }
                            } else {
                                $scope.changePresentModel.chooseItem = $scope.changePresentModel.list[0];
                            }

                            $scope.changePresentModel.methods.init();
                        } else {
                            $scope.https.changePresentdetail = false;
                        }
                    } else {

                        $prompt.timeout($scope, res);
                    }
                });
            },
            // 服务变更 start
            getDetail: function () {
                $scope.https.changePresentdetail = true;
                CustomerNetService.change.getDetail({
                    change_no: $scope.changePresentModel.chooseItem.change_no,
                    order_id: $scope.orderModel.order_id
                }).then(function (res) {
                    $scope.https.changePresentdetail = false;
                    if (res.data.code) {
                        $scope.changePresentModel.detail = res.data.data;
                    } else {
                        $prompt.timeout($scope, res);
                    }
                });
            },
            // 删除服务
            deleteChange: function () {
                CustomerNetService.change.checkBeforeDelete({
                    change_no: $scope.changePresentModel.chooseItem.change_no,
                    order_id: $scope.orderModel.order_id
                }).then(function (res) {
                    if (res.data.code) {
                        $confirm_cancel.show({
                            id: 'uiViews',
                            title: '删除',
                            text: '确认将此变更内容删除吗？',
                            remarks: '确定后，该变更内容将删除',
                            buttons: [{
                                text: '确定',
                                ontap: function () {
                                    $confirm_cancel.hide().then(function () {
                                        // 删除
                                        CustomerNetService.change.changeDelete($scope.changePresentModel.detail.change_no, $scope.orderModel.order_id).then(function (res) {
                                            $scope.changePresentModel.methods.getList();
                                            $prompt.timeout($scope, res);
                                        });
                                    });
                                }
                            }],
                            scope: $scope
                        });
                    } else {
                        $prompt.timeout($scope, res);
                    }
                });
            },
            // 申请纸质协议
            applyProtocolPaper: function () {
                CustomerNetService.change.checkBeforePaper({
                    change_no: $scope.changePresentModel.chooseItem.change_no,
                    order_id: $scope.orderModel.order_id,
                    agreement_type: 2,
                    approval_id: 0,
                    second_product_id: $scope.orderModel.second_product_id
                }).then(function (res) {
                    if (res.data.code) {
                        $confirm_cancel.show({
                            id: 'uiViews',
                            title: '申请纸质协议',
                            text: '确定向法务申请纸质变更协议吗？',
                            remarks: '',
                            buttons: [{
                                text: '确定',
                                ontap: function () {
                                    $confirm_cancel.hide().then(function () {

                                        CustomerNetService.contract.createApprovalWithPaper({
                                            order_id: $scope.orderModel.order_id,
                                            agreement_id: 0,
                                            agreement_type: 2,
                                            second_product_id: $scope.orderModel.second_product_id,
                                            change_no: $scope.changePresentModel.chooseItem.change_no
                                        }).then(function (res) {
                                            if (res.data.code) {
                                                $scope.changePresentModel.tempChangeNo = $scope.changePresentModel.chooseItem.change_no;
                                                $scope.orderModel.methods.getDetail();
                                            }
                                            $prompt.timeout($scope, res);
                                        });
                                    });
                                }
                            }],
                            scope: $scope
                        });
                    } else {
                        $prompt.timeout($scope, res);
                    }
                });
            },
            // 申请执行确认
            applyExcute: function () {
                CustomerNetService.change.checkBeforeServiceChangeExec({
                    order_id: $scope.orderModel.order_id,
                    change_no: $scope.changePresentModel.chooseItem.change_no
                }).then(function (res) {
                    if (res.data.code) {
                        $confirm_cancel.show({
                            id: 'uiViews',
                            title: '申请执行',
                            text: '确认向执行团队申请执行吗？',
                            remarks: '',
                            buttons: [{
                                text: '确定',
                                ontap: function () {
                                    $confirm_cancel.hide().then(function () {
                                        CustomerNetService.change.applyServiceChangeExec({
                                            change_no: $scope.changePresentModel.chooseItem.change_no,
                                            order_id: $scope.orderModel.order_id,
                                            second_product_id: $scope.orderModel.second_product_id
                                        }).then(function (res) {
                                            if (res.data.code) {
                                                $scope.changePresentModel.methods.getList();
                                            }
                                            $prompt.timeout($scope, res);
                                        });
                                    });
                                }
                            }],
                            scope: $scope
                        });
                    } else {
                        $prompt.timeout($scope, res);
                    }
                });
            },
            // 新增服务变更
            createServiceChange: function () {
                CustomerNetService.change.checkBeforeInsert({
                    order_id: $scope.orderModel.order_id,
                    second_product_id: $scope.orderModel.second_product_id
                }).then(function (res) {
                    if (res.data.code) {
                        $state.go('createServiceChange', {
                            order_id: $scope.orderModel.order_id,
                            customer_id: $scope.httpConfig.customer_id,
                            change_no: $scope.changePresentModel.chooseItem.change_no,
                            pool_id: $scope.httpConfig.operate_pid
                        });
                    } else {
                        $prompt.timeout($scope, res);
                    }
                });

            },
            // 编辑服务变更
            updateServiceChange: function () {
                CustomerNetService.change.checkBeforeUpdate({
                    change_no: $scope.changePresentModel.chooseItem.change_no,
                    order_id: $scope.orderModel.order_id
                }).then(function (res) {
                    if (res.data.code) {
                        $state.go('editServiceChange', {
                            order_id: $scope.orderModel.order_id,
                            change_no: $scope.changePresentModel.detail.change_no,
                            customer_id: $scope.httpConfig.customer_id,
                            pool_id: $scope.httpConfig.operate_pid
                        });
                    } else {
                        $prompt.timeout($scope, res);
                    }
                });
            },
            // 服务变更 end
            // 赠送
            getPresentDetail: function () {
                $scope.https.changePresentdetail = true;
                CustomerNetService.change.getGiftDetail({
                    change_no: $scope.changePresentModel.chooseItem.change_no,
                    order_id: $scope.orderModel.order_id
                }).then(function (res) {
                    $scope.https.changePresentdetail = false;
                    if (res.data.code) {
                        $scope.changePresentModel.detail = res.data.data;
                    } else {
                        $prompt.timeout($scope, res);
                    }
                });
            },
            // 新增赠送服务
            createPresent: function () {
                CustomerNetService.change.checkBeforeInsertGift({
                    order_id: $scope.orderModel.order_id,
                    second_product_id: $scope.orderModel.second_product_id
                }).then(function (res) {
                    if (res.data.code) {
                        $state.go('presentadd', {
                            order_id: $scope.orderModel.order_id,
                            customer_id: $scope.httpConfig.customer_id,
                            pool_id: $scope.httpConfig.operate_pid
                        });
                    } else {
                        $prompt.timeout($scope, res);
                    }
                });
            },
            // 编辑赠送服务
            updatePresent: function () {
                CustomerNetService.change.checkBeforeUpdateGift({
                    order_id: $scope.orderModel.order_id,
                    second_product_id: $scope.orderModel.second_product_id,
                    change_no: $scope.changePresentModel.chooseItem.change_no
                }).then(function (res) {
                    if (res.data.code) {
                        $state.go('presentedit', {
                            order_id: $scope.orderModel.order_id,
                            change_no: $scope.changePresentModel.detail.change_no,
                            customer_id: $scope.httpConfig.customer_id,
                            pool_id: $scope.httpConfig.operate_pid
                        });
                    } else {
                        $prompt.timeout($scope, res);
                    }
                });
            },
            // 删除赠送
            deletePresent: function () {
                CustomerNetService.change.checkBeforeDeleteGift({
                    order_id: $scope.orderModel.order_id,
                    second_product_id: $scope.orderModel.second_product_id,
                    change_no: $scope.changePresentModel.chooseItem.change_no
                }).then(function (res) {
                    if (res.data.code) {
                        $confirm_cancel.show({
                            id: 'uiViews',
                            title: '删除',
                            text: '确认将此赠送服务删除吗？',
                            remarks: '确定后，该赠送服务将删除',
                            buttons: [{
                                text: '确定',
                                ontap: function () {
                                    $confirm_cancel.hide().then(function () {
                                        // 删除
                                        CustomerNetService.change.giftDelete($scope.changePresentModel.detail.change_no, $scope.changePresentModel.detail.order_id).then(function (res) {
                                            $scope.changePresentModel.methods.getList();
                                            $prompt.timeout($scope, res);
                                        });
                                    });
                                }
                            }],
                            scope: $scope
                        });
                    } else {
                        $prompt.timeout($scope, res);
                    }
                });
            },
            // 申请执行赠送服务
            applyPresentExcute: function () {
                CustomerNetService.change.checkBeforeGift(
                    {
                        order_id: $scope.orderModel.order_id,
                        change_no: $scope.changePresentModel.chooseItem.change_no
                    }
                ).then(function (res) {
                    if (res.data.code) {
                        $confirm_cancel.show({
                            id: 'uiViews',
                            title: '申请执行',
                            text: '确认将此赠送服务申请执行吗？',
                            remarks: '',
                            buttons: [{
                                text: '确定',
                                ontap: function () {
                                    $confirm_cancel.hide().then(function () {
                                        CustomerNetService.change.applyGift({
                                            order_id: $scope.orderModel.order_id,
                                            aiyo_is_cost: $scope.changePresentModel.detail.gift_cost,
                                            second_product_id: $scope.orderModel.second_product_id,
                                            change_no: $scope.changePresentModel.chooseItem.change_no
                                        }).then(function (res) {
                                            if (res.data.code) {
                                                $scope.changePresentModel.tempChangeNo = $scope.changePresentModel.chooseItem.change_no;
                                                $scope.orderModel.methods.getDetail();
                                            }
                                            $prompt.timeout($scope, res);
                                        });
                                    });
                                }
                            }],
                            scope: $scope
                        });
                    } else {
                        $prompt.timeout($scope, res);
                    }
                });

            },
            // 渲染
            init: function () {
                switch ($scope.changePresentModel.chooseItem.change_type) {
                    case '1':
                        $scope.changePresentModel.methods.getDetail();
                        break;
                    case '2': $scope.changePresentModel.methods.getPresentDetail();
                        break;
                }
            },
            choose: function (item) {
                $scope.changePresentModel.chooseItem = item;
                $scope.changePresentModel.methods.init();
            }
        }
    };
    // 合同协议模块
    $scope.contractModel = {
        list: [],
        chooseItem: {},
        detail: {},
        path: '',
        button: {},
        tempAgreementId: '',
        showMore: {
            flag: false,
            toggleMore: function (e) {
                if (e) {
                    e.stopPropagation();
                }
                this.flag = !this.flag;
            }
        },
        downLoad: function (url) {
            this.path = url;
            $timeout(function () {
                document.querySelector('#download').click();
            }, 0);
        },
        // 合同base
        getList: function () {
            $scope.https.contractlist = true;
            CustomerNetService.contract.getList($scope.orderModel.order_id).then(function (res) {
                $scope.https.contractlist = false;
                if (res.data.code) {
                    $scope.contractModel.list = res.data.data.list;
                    $scope.contractModel.button = res.data.data.button;
                    if ($scope.contractModel.list.length > 0) {
                        if ($scope.contractModel.tempAgreementId) {
                            for (var i = 0, l = $scope.contractModel.list.length; i < l; i++) {
                                if ($scope.contractModel.list[i].agreement_id == $scope.contractModel.tempAgreementId) {
                                    $scope.contractModel.chooseItem = $scope.contractModel.list[i];
                                    $scope.contractModel.initDetail();
                                    $scope.contractModel.tempAgreementId = '';
                                    break;
                                }
                            }
                        } else {
                            $scope.contractModel.chooseItem = $scope.contractModel.list[0];
                            $scope.contractModel.initDetail();
                        }
                    } else {
                        $scope.https.contractdetail = false;
                    }
                } else {
                    $prompt.timeout($scope, res);
                }
            });
        },
        choose: function (obj) {
            this.chooseItem = obj;
            this.initDetail();
        },
        // 加载详情
        initDetail: function () {
            $scope.https.contractdetail = true;
            if (this.chooseItem.agreement_type == 2) {
                // 补充协议
                CustomerNetService.contract.getAdditionalAgreementDetail({
                    order_id: $scope.orderModel.order_id,
                    agreement_id: $scope.contractModel.chooseItem.agreement_id
                }).then(function (res) {
                    $scope.https.contractdetail = false;
                    if (res.data.code) {
                        $scope.contractModel.detail = res.data.data;
                    } else {
                        $prompt.timeout($scope, res);
                    }
                });
            }
            else if (this.chooseItem.agreement_type == 3) {
                // 解除协议
                CustomerNetService.contract.getEndAgreementDetail({
                    order_id: $scope.orderModel.order_id,
                    agreement_id: $scope.contractModel.chooseItem.agreement_id
                }).then(function (res) {
                    $scope.https.contractdetail = false;
                    if (res.data.code) {
                        $scope.contractModel.detail = res.data.data;
                    } else {
                        $prompt.timeout($scope, res);
                    }
                });
            }
            else if (this.chooseItem.agreement_type == 1) {
                // 订单合同
                CustomerNetService.contract.getDetail({
                    order_id: $scope.orderModel.order_id,
                    agreement_id: $scope.contractModel.chooseItem.agreement_id
                }).then(function (res) {
                    $scope.https.contractdetail = false;
                    if (res.data.code) {
                        $scope.contractModel.detail = res.data.data;
                    } else {
                        $prompt.timeout($scope, res);
                    }
                });
            }
        },
        // 合同操作 start
        // 签约信息编辑
        signEdit: {
            data: {},
            flag: false,
            title: '编辑签约信息',
            show: function () {
                CustomerNetService.contract.checkBeforeUpdateContract({ order_id: $scope.orderModel.order_id }).then(function (res) {
                    if (res.data.code) {
                        $scope.contractModel.signEdit.data = {
                            sign_type: $scope.contractModel.detail.sign_type,
                            sign_name: $scope.contractModel.detail.sign_name,
                            sign_authorize: $scope.contractModel.detail.sign_authorize,
                            sign_company: $scope.contractModel.detail.sign_company,
                            sign_address: $scope.contractModel.detail.sign_address,
                            sign_card_id: $scope.contractModel.detail.sign_card_id,
                            sign_phone: $scope.contractModel.detail.sign_phone,
                            sign_id: $scope.contractModel.detail.sign_id
                        };
                        $scope.contractModel.signEdit.flag = true;
                    } else {
                        $prompt.timeout($scope, res);
                    }
                });

            },
            hide: function () {
                this.flag = false;
            },
            confirm: function () {
                if ($scope.isAjaxing) {
                    return;
                }
                // check
                var error = CustomerService.checkSign(this.data);
                if (error) {
                    $scope.prompt(error, 500);
                    return;
                }
                $scope.isAjaxing = true;
                this.data.order_id = $scope.orderModel.order_id;
                // 执行签约信息编辑
                CustomerNetService.contract.updateContract(this.data).then(
                    function (res) {
                        $scope.isAjaxing = false;
                        if (res.data.code) {
                            $scope.contractModel.signEdit.hide();
                            $scope.contractModel.tempAgreementId = $scope.contractModel.chooseItem.agreement_id;
                            $scope.orderModel.methods.getDetail();
                        }
                        $prompt.timeout($scope, res);
                    }
                );
            }
        },
        // 上传合同照片
        upload: {
            fileNames: [],
            tempfileNames: [],
            files: [],
            pics: [],
            flag: false,
            title: '上传合同照片',
            show: function () {
                CustomerNetService.contract.checkBeforeUploadContractPicture($scope.orderModel.order_id).then(
                    function (res) {
                        if (res.data.code) {
                            // 加载原有合同照片
                            CustomerNetService.contract.getOriginPics($scope.orderModel.order_id).then(function (res) {
                                if (res.data.code) {
                                    $scope.contractModel.upload.pics = res.data.data;
                                    $scope.contractModel.upload.tempfileNames = [];
                                    $scope.contractModel.upload.fileNames = [];
                                    for (var i = 0; i < $scope.contractModel.upload.pics.length; i++) {
                                        $scope.contractModel.upload.tempfileNames.push($scope.contractModel.upload.pics[i].origin_name);
                                        $scope.contractModel.upload.fileNames.push($scope.contractModel.upload.pics[i].origin_name);
                                    }
                                    $scope.contractModel.upload.flag = true;
                                }
                            });
                        } else {
                            $prompt.timeout($scope, res);
                        }
                    }
                );

            },
            hide: function () {
                this.flag = false;
            },
            deleteImg: function (index) {
                $scope.contractModel.upload.tempfileNames.splice(index, 1);
                $scope.contractModel.upload.fileNames.splice(index, 1);
                $scope.contractModel.upload.pics.splice(index, 1);
            },
            uploadClick: function () {
                document.querySelector('#contract-img').click();
            },
            uploadImg: function () {
                if ($scope.isAjaxing) {
                    return;
                }
                // get files
                var files = document.querySelector('#contract-img').files;
                // check
                if ((this.pics.length + files.length) > 5) {
                    $scope.prompt('上传图片不得多于5张', 500);
                    return;
                }
                var data = {};
                var index = 0;
                for (var i = this.pics.length, l = this.pics.length + files.length; i < l; i++) {
                    if (files[index].size > 5242880) {
                        $prompt.timeout($scope, {
                            data: {
                                code: 500,
                                message: '图片不得大于5M'
                            }
                        });
                        return;
                    } else {
                        data['img' + i] = files[index];
                        $scope.contractModel.upload.tempfileNames.push(files[index].name);
                    }
                    index++;
                }
                // upload
                $scope.isAjaxing = true;
                CustomerNetService.contract.uploadContractPicture(data, $scope).then(function (res) {
                    $scope.isAjaxing = false;
                    if (res.data.code) {
                        $scope.contractModel.upload.pics = $scope.contractModel.upload.pics.concat(res.data.data);
                        $scope.contractModel.upload.fileNames = angular.copy($scope.contractModel.upload.tempfileNames);
                    } else {
                        $prompt.timeout($scope, res);
                    }
                });
            },
            confirm: function () {
                if ($scope.isAjaxing) {
                    return;
                }
                if (this.pics.length == 0) {
                    $prompt.timeout($scope, {
                        code: 500,
                        message: '请选择上传文件'
                    });
                    return;
                }
                $scope.isAjaxing = true;
                var data = {
                    order_id: $scope.orderModel.order_id,
                    pics: this.pics,
                    agreement_id: $scope.contractModel.chooseItem.agreement_id
                };
                CustomerNetService.contract.saveContractPic(data).then(function (res) {
                    $scope.isAjaxing = false;
                    if (res.data.code) {
                        $scope.contractModel.upload.hide();
                        $scope.contractModel.tempAgreementId = $scope.contractModel.chooseItem.agreement_id;
                        $scope.orderModel.methods.getDetail();
                    }
                    $prompt.timeout($scope, res);
                });
            }
        },
        // 像法务申请纸质合同执行
        createApprovalWithPaper: function () {
            CustomerNetService.contract.createApprovalWithPaper({
                order_id: $scope.orderModel.order_id,
                agreement_id: $scope.contractModel.chooseItem.agreement_id,
                agreement_type: $scope.contractModel.chooseItem.agreement_type,
                second_product_id: $scope.orderModel.second_product_id
            }).then(function (res) {
                $scope.contractModel.tempAgreementId = $scope.contractModel.chooseItem.agreement_id;
                $scope.orderModel.methods.getDetail();
                $prompt.timeout($scope, res);
            });
        },
        // 申请纸质合同
        applyPaperContract: function () {
            CustomerNetService.contract.checkBeforeApplyPaperContract({
                order_id: $scope.orderModel.order_id
            }).then(function (res) {
                if (res.data.code) {
                    $confirm_cancel.show({
                        id: 'uiViews',
                        title: '申请纸质协议',
                        text: '确定向法务申请此纸质协议吗？',
                        remarks: '',
                        buttons: [{
                            text: '确定',
                            ontap: function () {
                                $confirm_cancel.hide().then(function () {
                                    $scope.contractModel.createApprovalWithPaper();
                                });
                            }
                        }],
                        scope: $scope
                    });
                } else {
                    $prompt.timeout($scope, res);
                }
            });
        },
        // 申请合同审核
        applyContractCheck: function () {
            CustomerNetService.contract.checkBeforeApplyContract({
                order_id: $scope.orderModel.order_id,
                agreement_id: $scope.contractModel.chooseItem.agreement_id
            }).then(function (res) {
                if (res.data.code) {
                    $confirm_cancel.show({
                        id: 'uiViews',
                        title: '申请合同审核',
                        text: '确定申请发起该合同审批吗？',
                        remarks: '',
                        buttons: [{
                            text: '确定',
                            ontap: function () {
                                $confirm_cancel.hide().then(function () {
                                    CustomerNetService.contract.applyAgreement({
                                        agreement_id: $scope.contractModel.chooseItem.agreement_id,
                                        order_id: $scope.orderModel.order_id,
                                        second_product_id: $scope.orderModel.second_product_id,
                                    }).then(function (res) {
                                        $scope.contractModel.tempAgreementId = $scope.contractModel.chooseItem.agreement_id;
                                        $scope.orderModel.methods.getDetail();
                                        $prompt.timeout($scope, res);
                                    });
                                });
                            }
                        }],
                        scope: $scope
                    });
                } else {
                    $prompt.timeout($scope, res);
                }
            });
        },
        // 下载纸质合同
        downPaperContract: function () {

            if ($scope.isAjaxing) {
                return;
            }
            $scope.isAjaxing = true;
            CustomerNetService.contract.checkBeforeDownPaperContract({
                order_id: $scope.orderModel.order_id
            }).then(
                function (res) {
                    if (res.data.code) {
                        CustomerNetService.contract.downPaperContract({ order_id: $scope.orderModel.order_id }).then(function (res) {
                            $scope.isAjaxing = false;
                            if (res.data.code) {
                                $scope.contractModel.downLoad(res.data.data);
                            } else {
                                $prompt.timeout($scope, res);
                            }
                        });
                    } else {
                        $scope.isAjaxing = false;
                        $prompt.timeout($scope, res);
                    }
                }
            );

        },
        standardContract: {
            data: {},
            path: '',
            flag: false,
            title: '下载标准合同',
            show: function () {
                CustomerNetService.contract.checkBeforeDownStandardContract().then(function (res) {
                    if (res.data.code) {
                        CustomerNetService.contract.getStandardContractTemplateList({
                            order_id: $scope.orderModel.order_id
                        }).then(function (res) {
                            if (res.data.code) {
                                $scope.contractModel.standardContract.data = res.data.data;
                                $scope.contractModel.standardContract.flag = true;
                            } else {
                                $prompt.timeout($scope, res);
                            }
                        });
                    } else {
                        $prompt.timeout($scope, res);
                    }
                });
            },
            hide: function () {
                this.flag = false;
            },
            confirm: function () {
                if ($scope.isAjaxing) {
                    return;
                }
                $scope.isAjaxing = true;
                CustomerNetService.contract.downStandardContractConfirm($scope.orderModel.order_id).then(function (res) {
                    $scope.isAjaxing = false;
                    if (res.data.code) {
                        $scope.contractModel.downLoad($scope.contractModel.standardContract.path);
                        $scope.orderModel.methods.getDetail();
                    } else {
                        $prompt.timeout($scope, res);
                    }
                });
            }
        },
        // 合同操作 end
        // 补充协议 start
        // 下载补充协议
        downAdditionalAgreement: function () {
            if ($scope.isAjaxing) {
                return;
            }
            $scope.isAjaxing = true;
            CustomerNetService.contract.checkBeforeDownAddnAgt({
                agreement_id: $scope.contractModel.chooseItem.agreement_id
            }).then(function (res) {
                if (res.data.code) {
                    CustomerNetService.contract.downAdditionalAgreement({ agreement_id: $scope.contractModel.chooseItem.agreement_id }).then(function (res) {
                        $scope.isAjaxing = false;
                        if (res.data.code) {
                            $scope.contractModel.downLoad(res.data.data);
                        } else {
                            $prompt.timeout($scope, res);
                        }
                    });
                } else {
                    $scope.isAjaxing = false;
                    $prompt.timeout($scope, res);
                }
            });

        },
        // 申请协议审核
        applyContractCheck1: function () {
            CustomerNetService.contract.checkBeforeApplyAddnAgreement({
                order_id: $scope.orderModel.order_id,
                agreement_id: $scope.contractModel.chooseItem.agreement_id
            }).then(function (res) {
                if (res.data.code) {
                    $confirm_cancel.show({
                        id: 'uiViews',
                        title: '申请协议审核',
                        text: '确定向法务申请协议审批吗？',
                        remarks: '',
                        buttons: [{
                            text: '确定',
                            ontap: function () {
                                $confirm_cancel.hide().then(function () {
                                    CustomerNetService.contract.applyAgreement({
                                        agreement_id: $scope.contractModel.chooseItem.agreement_id,
                                        order_id: $scope.orderModel.order_id,
                                        second_product_id: $scope.orderModel.second_product_id,
                                    }).then(function (res) {
                                        $scope.contractModel.tempAgreementId = $scope.contractModel.chooseItem.agreement_id;
                                        $scope.orderModel.methods.getDetail();
                                        $prompt.timeout($scope, res);
                                    });
                                });
                            }
                        }],
                        scope: $scope
                    });
                } else {
                    $prompt.timeout($scope, res);
                }
            });
        },
        // 上传补充协议
        upload1: {
            fileNames: [],
            tempfileNames: [],
            files: [],
            pics: [],
            flag: false,
            title: '上传协议附件',
            show: function () {
                CustomerNetService.contract.checkBeforeUploadAddnAgreementAttachment({
                    agreement_id: $scope.contractModel.chooseItem.agreement_id
                }).then(function (res) {
                    if (res.data.code) {
                        // 获得协议原来的附件
                        CustomerNetService.contract.getOriginAttach($scope.contractModel.chooseItem.agreement_id).then(function (res) {
                            if (res.data.code) {
                                $scope.contractModel.upload1.pics = res.data.data;
                                $scope.contractModel.upload1.tempfileNames = [];
                                $scope.contractModel.upload1.fileNames = [];
                                for (var i = 0; i < $scope.contractModel.upload1.pics.length; i++) {
                                    $scope.contractModel.upload1.tempfileNames.push($scope.contractModel.upload1.pics[i].origin_name);
                                    $scope.contractModel.upload1.fileNames.push($scope.contractModel.upload1.pics[i].origin_name);
                                }
                                $scope.contractModel.upload1.flag = true;
                            }
                        });
                    } else {
                        $prompt.timeout($scope, res);
                    }
                });
            },
            hide: function () {
                this.flag = false;
            },
            deleteImg: function (index) {
                $scope.contractModel.upload1.fileNames.splice(index, 1);
                $scope.contractModel.upload1.tempfileNames.splice(index, 1);
                $scope.contractModel.upload1.pics.splice(index, 1);
            },
            uploadClick: function () {
                document.querySelector('#contract-img1').click();
            },
            uploadImg: function () {
                if ($scope.isAjaxing) {
                    return;
                }
                // get files
                var files = document.querySelector('#contract-img1').files;
                // check
                if ((this.pics.length + files.length) > 5) {
                    $scope.prompt('上传图片不得多于5张', 500);
                    return;
                }
                var data = {};
                var index = 0;
                for (var i = this.pics.length, l = this.pics.length + files.length; i < l; i++) {
                    if (files[index].size > 5242880) {
                        $prompt.timeout($scope, {
                            data: {
                                code: 500,
                                message: '图片不得大于5M'
                            }
                        });
                        return;
                    } else {
                        data['img' + i] = files[index];
                        $scope.contractModel.upload1.tempfileNames.push(files[index].name);
                    }
                    index++;
                }
                // upload
                $scope.isAjaxing = true;
                CustomerNetService.contract.uploadContractPicture(data, $scope).then(function (res) {
                    $scope.isAjaxing = false;
                    if (res.data.code) {
                        $scope.contractModel.upload1.pics = $scope.contractModel.upload1.pics.concat(res.data.data);
                        $scope.contractModel.upload1.fileNames = angular.copy($scope.contractModel.upload1.tempfileNames);
                    } else {
                        $prompt.timeout($scope, res);
                    }
                });
            },
            confirm: function () {
                if ($scope.isAjaxing) {
                    return;
                }
                if (this.pics.length == 0) {
                    $prompt.timeout($scope, {
                        code: 500,
                        message: '请选择上传文件'
                    });
                    return;
                }
                $scope.isAjaxing = true;
                var data = {
                    agreement_id: $scope.contractModel.chooseItem.agreement_id,
                    attachs: this.pics
                };
                CustomerNetService.contract.saveAgtAttachs(data).then(function (res) {
                    $scope.isAjaxing = false;
                    if (res.data.code) {
                        $scope.contractModel.upload1.hide();
                        $scope.contractModel.tempAgreementId = $scope.contractModel.chooseItem.agreement_id;
                        $scope.orderModel.methods.getDetail();
                    }
                    $prompt.timeout($scope, res);
                });
            }
        },
        // 补充协议 end
        // 解除协议 start
        // 下载解除协议
        downEndAgreement: function () {
            if ($scope.isAjaxing) {
                return;
            }
            $scope.isAjaxing = true;
            CustomerNetService.contract.checkBeforeDownEndAgt({ agreement_id: $scope.contractModel.chooseItem.agreement_id }).then(function (res) {
                if (res.data.code) {
                    CustomerNetService.contract.downEndAgreement({ agreement_id: $scope.contractModel.chooseItem.agreement_id }).then(function (res) {
                        $scope.isAjaxing = false;
                        if (res.data.code) {
                            $scope.contractModel.downLoad(res.data.data);
                        } else {
                            $prompt.timeout($scope, res);
                        }
                    });
                } else {
                    $scope.isAjaxing = false;
                    $prompt.timeout($scope, res);
                }
            });

        },
        upload2: {
            fileNames: [],
            tempfileNames: [],
            files: [],
            pics: [],
            flag: false,
            title: '上传协议附件',
            show: function () {
                CustomerNetService.contract.checkBeforeUploadEndAgreementAttachment({ agreement_id: $scope.contractModel.chooseItem.agreement_id }).then(function (res) {
                    if (res.data.code) {
                        // 获得协议原来的附件
                        CustomerNetService.contract.getOriginAttach($scope.contractModel.chooseItem.agreement_id).then(function (res) {
                            if (res.data.code) {
                                $scope.contractModel.upload2.pics = res.data.data;
                                $scope.contractModel.upload2.tempfileNames = [];
                                $scope.contractModel.upload2.fileNames = [];
                                for (var i = 0; i < $scope.contractModel.upload2.pics.length; i++) {
                                    $scope.contractModel.upload2.tempfileNames.push($scope.contractModel.upload2.pics[i].origin_name);
                                    $scope.contractModel.upload2.fileNames.push($scope.contractModel.upload2.pics[i].origin_name);
                                }
                                $scope.contractModel.upload2.flag = true;
                            }
                        });
                    } else {
                        $prompt.timeout($scope, res);
                    }
                });
            },
            deleteImg: function (index) {
                $scope.contractModel.upload2.fileNames.splice(index, 1);
                $scope.contractModel.upload2.tempfileNames.splice(index, 1);
                $scope.contractModel.upload2.pics.splice(index, 1);
            },
            uploadClick: function () {
                document.querySelector('#contract-img2').click();
            },
            uploadImg: function () {
                if ($scope.isAjaxing) {
                    return;
                }
                // get files
                var files = document.querySelector('#contract-img2').files;
                // check
                if ((this.pics.length + files.length) > 5) {
                    $scope.prompt('上传图片不得多于5张', 500);
                    return;
                }
                var data = {};
                var index = 0;
                for (var i = this.pics.length, l = this.pics.length + files.length; i < l; i++) {
                    if (files[index].size > 5242880) {
                        $prompt.timeout($scope, {
                            data: {
                                code: 500,
                                message: '图片不得大于5M'
                            }
                        });
                        return;
                    } else {
                        data['img' + i] = files[index];
                        $scope.contractModel.upload2.tempfileNames.push(files[index].name);
                    }
                    index++;
                }
                // upload
                $scope.isAjaxing = true;
                CustomerNetService.contract.uploadContractPicture(data, $scope).then(function (res) {
                    $scope.isAjaxing = false;
                    if (res.data.code) {
                        $scope.contractModel.upload2.pics = $scope.contractModel.upload2.pics.concat(res.data.data);
                        $scope.contractModel.upload2.fileNames = angular.copy($scope.contractModel.upload2.tempfileNames);
                    } else {
                        $prompt.timeout($scope, res);
                    }
                });
            },
            confirm: function () {
                if ($scope.isAjaxing) {
                    return;
                }
                if (this.pics.length == 0) {
                    $prompt.timeout($scope, {
                        code: 500,
                        message: '请选择上传文件'
                    });
                    return;
                }
                $scope.isAjaxing = true;
                var data = {
                    agreement_id: $scope.contractModel.chooseItem.agreement_id,
                    attachs: this.pics
                };
                CustomerNetService.contract.saveAgtAttachs(data).then(function (res) {
                    $scope.isAjaxing = false;
                    if (res.data.code) {
                        $scope.contractModel.upload2.flag = false;
                        $scope.contractModel.tempAgreementId = $scope.contractModel.chooseItem.agreement_id;
                        $scope.orderModel.methods.getDetail();
                    }
                    $prompt.timeout($scope, res);
                });
            }
        },
        // 新建解除协议
        addEnd: {
            flag: false,
            data: {},
            title: '新建解除协议',
            show: function () {
                CustomerNetService.contract.checkBeforeAddEndAgt($scope.orderModel.order_id).then(function (res) {
                    if (res.data.code) {
                        // 签约只用于展示。直接取了detail的数据
                        $scope.contractModel.addEnd.flag = true;
                    } else {
                        $prompt.timeout($scope, res);
                    }
                });
            },
            hide: function () {
                this.flag = false;
            },
            confirm: function () {
                CustomerNetService.contract.addEndAgt({
                    order_id: $scope.orderModel.order_id,
                    agreement_type: 3
                }).then(
                    function (res) {
                        if (res.data.code) {
                            $scope.contractModel.getList();
                            $scope.contractModel.addEnd.hide();
                        }
                        $prompt.timeout($scope, res);
                    }
                );
            }
        },
        // 申请纸质合同
        applyPaperContract2: function () {
            CustomerNetService.contract.checkBeforeApplyEndPaperContract({
                agreement_id: $scope.contractModel.chooseItem.agreement_id
            }).then(function (res) {
                if (res.data.code) {
                    $confirm_cancel.show({
                        id: 'uiViews',
                        title: '申请纸质合同',
                        text: '确定向法务申请此纸质协议吗？',
                        remarks: '',
                        buttons: [{
                            text: '确定',
                            ontap: function () {
                                $confirm_cancel.hide().then(function () {
                                    $scope.contractModel.createApprovalWithPaper();
                                });
                            }
                        }],
                        scope: $scope
                    });
                } else {
                    $prompt.timeout($scope, res);
                }
            });
        },
        // 申请解除协议审核
        applyContractCheck2: function () {
            CustomerNetService.contract.checkBeforeApplyEndAgreement({
                agreement_id: $scope.contractModel.chooseItem.agreement_id
            }).then(function (res) {
                if (res.data.code) {
                    $confirm_cancel.show({
                        id: 'uiViews',
                        title: '申请解除协议',
                        text: '确定申请此协议审批吗？',
                        remarks: '',
                        buttons: [{
                            text: '确定',
                            ontap: function () {
                                $confirm_cancel.hide().then(function () {
                                    CustomerNetService.contract.applyAgreement({
                                        agreement_id: $scope.contractModel.chooseItem.agreement_id,
                                        order_id: $scope.orderModel.order_id,
                                        second_product_id: $scope.orderModel.second_product_id,
                                    }).then(function (res) {
                                        $scope.contractModel.tempAgreementId = $scope.contractModel.chooseItem.agreement_id;
                                        $scope.orderModel.methods.getDetail();
                                        $prompt.timeout($scope, res);
                                    });
                                });
                            }
                        }],
                        scope: $scope
                    });
                } else {
                    $prompt.timeout($scope, res);
                }
            });
        },
        // 删除解除协议
        deleteContract2: function () {
            CustomerNetService.contract.checkBeforeDeleteEndAgt({ agreement_id: $scope.contractModel.chooseItem.agreement_id }).then(function (res) {
                if (res.data.code) {
                    $confirm_cancel.show({
                        id: 'uiViews',
                        title: '删除',
                        text: '确定删除此解除协议吗？',
                        remarks: '',
                        buttons: [{
                            text: '确定',
                            ontap: function () {
                                $confirm_cancel.hide().then(function () {
                                    CustomerNetService.contract.deleteEndAgt({ agreement_id: $scope.contractModel.chooseItem.agreement_id }).then(function (res) {
                                        if (res.data.code) {
                                            $scope.contractModel.getList();
                                        }
                                        $prompt.timeout($scope, res);
                                    });
                                });
                            }
                        }],
                        scope: $scope
                    });
                } else {
                    $prompt.timeout($scope, res);
                }
            });

        },
        // 解除协议 end
        // 查看附件信息
        goResource: function () {
            window.open($state.href('resource', { type: $scope.contractModel.chooseItem.agreement_type, agreement_id: $scope.contractModel.chooseItem.agreement_id }));
        },
        // 跳转到变更与赠送显示详情
        gotoChangePresent: function (change_no) {
            $scope.changePresentModel.tempChangeNo = change_no;
            $scope.changeChildTab(5);
        }
    };
    // 票据信息模块
    $scope.taxInfoModel = {
        list: [],
        chooseItem: {},
        detail: [],
        button: {},
        choose: function (obj) {
            this.chooseItem = obj;
            this.getDetail();
        },
        getList: function () {
            $scope.https.taxlist = true;
            CustomerNetService.ayTax.getList($scope.orderModel.order_id).then(function (res) {
                $scope.https.taxlist = false;
                if (res.data.code) {
                    $scope.taxInfoModel.list = res.data.data.list;
                    $scope.taxInfoModel.button = res.data.data.button;
                    if ($scope.taxInfoModel.list.length > 0) {
                        $scope.taxInfoModel.chooseItem = $scope.taxInfoModel.list[0];
                        // 加载detail
                        $scope.taxInfoModel.getDetail();
                    } else {
                        $scope.https.taxdetail = false;
                    }
                } else {
                    $scope.https.taxdetail = false;
                    $prompt.timeout($scope, res);
                }
            });
        },
        getDetail: function () {
            $scope.https.taxdetail = true;
            CustomerNetService.ayTax.getDetail({
                approval_id: $scope.taxInfoModel.chooseItem.approval_id,
                approval_tax_id: $scope.taxInfoModel.chooseItem.approval_tax_id
            }).then(function (res) {
                $scope.https.taxdetail = false;
                if (res.data.code) {
                    $scope.taxInfoModel.detail = res.data.data;
                } else {
                    $prompt.timeout($scope, res);
                }
            });
        },
        applyTax: {
            tab: 0,
            data: {},
            req: {},
            flag: false,
            title: '申请开票',
            tabs: ['开票信息', '付款信息', '邮寄信息'],
            selectList: {
                invoiceType: [{ id: '1', name: '专票', }, { id: '2', name: '普票' }]
            },
            show: function () {
                CustomerNetService.button.checkBeforeTax({ order_id: $scope.orderModel.order_id, second_product_id: $scope.orderModel.second_product_id }).then(function (res) {
                    if (res.data.code) {
                        CustomerNetService.tax.getDetailForApply($scope.orderModel.order_id).then(function (res) {
                            if (res.data.code) {
                                $scope.taxInfoModel.applyTax.req = {};
                                $scope.taxInfoModel.applyTax.data = res.data.data;
                                $scope.taxInfoModel.applyTax.tab = 0;
                                $scope.taxInfoModel.applyTax.flag = true;
                            } else {
                                $prompt.timeout($scope, res);
                            }
                        });
                    } else {
                        $prompt.timeout($scope, res);
                    }
                });
            },
            hide: function () {
                this.flag = false;
            },
            confirm: function () {
                if ($scope.isAjaxing) {
                    return;
                }
                // check
                var error = CustomerService.checkTaxInfo(this.req);
                if (error) {
                    $scope.prompt(error, 500);
                    return;
                }
                $scope.isAjaxing = true;
                // 后端check，并执行

                // 补充参数
                this.req.order_id = $scope.orderModel.order_id;
                this.req.second_product_id = $scope.orderModel.second_product_id;
                CustomerNetService.tax.checkBeforeDelayedPayment({
                    order_id: $scope.orderModel.order_id,
                    price: this.req.price,
                    second_product_id: this.req.second_product_id
                }).then(function (res) {
                    if (!res.data.code) {
                        if (res.data.code == -105) {
                            $confirm_cancel.show({
                                id: 'uiViews',
                                title: '警告',
                                text: res.data.msg,
                                remarks: '',
                                buttons: [{
                                    text: '确定',
                                    ontap: function () {
                                        $confirm_cancel.hide().then(function () {
                                            CustomerNetService.order.applyTax($scope.taxInfoModel.applyTax.req).then(
                                                function (res) {
                                                    $scope.isAjaxing = false;
                                                    if (res.data.code) {
                                                        $scope.taxInfoModel.applyTax.hide();
                                                        $scope.orderModel.methods.getDetail();
                                                    }
                                                    $prompt.timeout($scope, res);
                                                }
                                            );
                                        });
                                    }
                                }],
                                scope: $scope
                            });
                        } else {
                            $scope.isAjaxing = false;
                            $prompt.timeout($scope, res);
                        }
                    } else {
                        CustomerNetService.order.applyTax($scope.taxInfoModel.applyTax.req).then(
                            function (res) {
                                $scope.isAjaxing = false;
                                if (res.data.code) {
                                    $scope.taxInfoModel.applyTax.hide();
                                    $scope.orderModel.methods.getDetail();
                                }
                                $prompt.timeout($scope, res);
                            }
                        );
                    }

                });
            }


        }
    };
    // 爱柚订单编辑
    $scope.aiyouEdit = {
        data: {},
        flag: false,
        title: '编辑签约信息',
        show: function () {
            CustomerNetService.getAiyouDetail($scope.orderModel.order_id).then(function (res) {
                if (res.data.code) {
                    $scope.aiyouEdit.data = res.data.data;
                    if ($scope.aiyouEdit.data.product_list.length > 1) {
                        $scope.delstatus = true;
                    }
                } else {
                    $prompt.timeout($scope, res);
                }
            });
            CustomerNetService.getProductList().then(function (res) {
                $scope.aiyouEdit.selectList.productList = res.data.data;
            });
            this.flag = true;
        },
        hide: function () {
            this.flag = false;
        },
        confirm: function () {
        },
        selectList: {
            typeList: [{ id: '0', status: '新签' }, { id: '1', status: '续签' }],
            orderList: [{ id: '1', status: '现销' }, { id: '2', status: '赊销' }],
            incomeList: [{ id: '1', status: '服务类' }, { id: '2', status: '广告类' }, { id: '4', status: '杂志类' }]
        },
        //删除产品
        deleteProduct: function (i) {
            $scope.aiyouEdit.data.product_list.splice(i, 1);
            if ($scope.aiyouEdit.data.product_list.length == 1) {
                $scope.delstatus = false;
            }
        },
        createProduct: function () {
            if ($scope.aiyouEdit.data.product_list.length < 5) {
                $scope.aiyouEdit.data.product_list.push({
                    third_product_id: '',
                    contract_remark: '',
                    product_num: '',
                    discount_price: ''
                });
                $scope.delstatus = true;
            } else {
                $prompt.timeout($scope, {
                    data: {
                        code: 500,
                        message: '最多只能新建五个产品！'
                    }
                });
                return;
            }
        },
        editAiYou: function () {
            if (CustomerService.requiredCheck($scope.aiyouEdit.data, $scope.aiyouEdit.data.product_list) != true) {
                $prompt.timeout($scope, {
                    data: {
                        code: 500,
                        message: CustomerService.requiredCheck($scope.aiyouEdit.data, $scope.aiyouEdit.data.product_list)
                    }
                });
                return;
            }
            CustomerNetService.editAiYou($scope.aiyouEdit.data).then(function (res) {
                if (res.data.code) {
                    $scope.aiyouEdit.hide();
                    $prompt.timeout($scope, {
                        data: {
                            code: 1,
                            message: '编辑成功'
                        }
                    });
                    $scope.orderModel.methods.getList($scope.orderModel.order_id);
                } else {
                    $prompt.timeout($scope, res);
                }
            });
        },
        counterPrice: function () {
            $scope.aiyouEdit.data.total_price = 0;
            for (var i = 0; i < $scope.aiyouEdit.data.product_list.length; i++) {
                $scope.aiyouEdit.data.total_price += parseInt($scope.aiyouEdit.data.product_list[i].product_num) * parseInt($scope.aiyouEdit.data.product_list[i].discount_price);
                if (!$scope.aiyouEdit.data.total_price) {
                    $scope.aiyouEdit.data.total_price = 0;
                }
            }
        }
    };


    // 模块初始化
    $scope.init = function () {
        // 检测是否存在模块跳转
        if ($stateParams) {
            $scope.uiModel.choosen.tabIndex = $stateParams.operate_pid || 0;
            $scope.uiModel.choosen.menuIndex = $stateParams.menu_index || 0;
            $scope.uiModel.choosen.childTabIndex = $stateParams.rmenu_index ? parseInt($stateParams.rmenu_index) : 0;
        }
        // 爱柚默认选中产品信息
        // if ($stateParams.operate_pid == 4) {
        //     $scope.uiModel.choosen.childTabIndex = $stateParams.rmenu_index ? parseInt($stateParams.rmenu_index) : 4;
        // }
        // 赋值url参数
        $scope.httpConfig.customer_id = $stateParams.customer_id;
        $scope.httpConfig.operate_pid = $stateParams.operate_pid;
        // 加载成熟度下拉
        $scope.getProductLevels();
        $scope.switchLoad($scope.uiModel.choosen.menuIndex);

    };

    // 分配
    if ($scope.comeType == 1) {
        // 资源管理
        $scope.mTransferModal = {
            isShow: false,
            title: '分配',
            data: {},
            hide: function () {
                $scope.mTransferModal.isShow = false;
            },
            show: function () {
                var data = {
                    customer_id: $scope.httpConfig.customer_id,
                    source: 1
                };
                CustomerNetService.base.getAdmUser(data).then(function (res) {
                    if (res.data.code) {
                        $scope.mTransferModal.data = res.data.data;
                        $scope.mTransferModal.isShow = true;
                    } else {
                        $prompt.timeout($scope, res);
                    }
                });
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
                var temp = {};
                for (var item in obj) {
                    temp[item] = obj[item].id;
                }
                var data = {
                    customer_id: $scope.httpConfig.customer_id,
                    user: JSON.stringify(temp),
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
                        $scope.getProductLevels();
                    } else {
                        $prompt.timeout($scope, res);
                    }
                });
            }
        };
    } else {
        //分配客户 销售
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
                    customer_id_list: [{ customer_id: $scope.httpConfig.customer_id, user_id: $scope.baseModel.detail.user_id }],
                    // 字段对应不一定
                    seller_uid: obj.id,
                    operate_pid: $scope.httpConfig.operate_pid
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
                CustomerNetService.base.getMoveSeller($scope.httpConfig).then(function (res) {
                    if (res.data.code) {
                        $scope.mTransferModal.data = res.data.data;
                        $scope.mTransferModal.isShow = true;
                    } else {
                        $prompt.timeout($scope, res);
                    }
                });

            }
        };
    }
    //  分配结束

    // prompt封装，type 决定code
    $scope.prompt = function (message, code) {
        $prompt.timeout($scope, {
            data: {
                code: code,
                message: message
            }
        });
    };

    //图片上传（弹窗）
    $scope.fileUp_M = {
        isShow: false,
        fileShow: false,
        title: '图片上传',
        data: [
            {
                path: ''
            },
            {
                path: ''
            },
            {
                path: ''
            },
            {
                path: ''
            },
            {
                path: ''
            }
        ],
        files: [],
        onchange: function () {
            var obj = document.getElementById('file');
            var flag = false;//是否不可提交
            //file缓存赋值
            if (obj.files) {
                angular.forEach(obj.files, function (fileItem, index, array) {
                    if (!flag) {
                        if (fileItem.size > 5242880) {
                            $prompt.timeout($scope, {
                                data: {
                                    code: 500,
                                    message: '图片不得大于5M'
                                }
                            });
                            flag = true;
                        }
                    }
                });
                if (!flag) {
                    if ($scope.isAjaxing)
                        return;
                    $scope.isAjaxing = true;
                    //传输图片
                    if ($scope.fileUp_M.data[4].path && $scope.fileUp_M.data[3].path && $scope.fileUp_M.data[2].path && $scope.fileUp_M.data[1].path && $scope.fileUp_M.data[0].path) {
                        $prompt.timeout($scope, {
                            data: {
                                code: 500,
                                message: '图片不得多余五张'
                            }
                        });
                        $scope.isAjaxing = false;
                    } else {
                        var data = {};
                        angular.forEach(obj.files, function (fileItem, index, array) {
                            data['img' + index] = fileItem;
                        });
                        data.order_id = $scope.orderModel.order_id;
                        var url = http + '/Crm/Order/uploadImg';
                        $Ajax.fileUpload(url, data, $scope).then(function (res) {
                            if (res.data.code) {
                                /*$prompt.timeout($scope, {
                                 data: {
                                 code: 1,
                                 message: res.data.msg
                                 }
                                 });*/
                                var insert_flag = false;
                                //插入图片路径
                                angular.forEach(res.data.data, function (resItem, resIndex, resArray) {
                                    angular.forEach($scope.fileUp_M.data, function (item, index, array) {
                                        if (insert_flag == false) {
                                            if (!$scope.fileUp_M.data[index].path) {
                                                $scope.fileUp_M.data[index].path = resItem.path;
                                                $scope.fileUp_M.data[index].origin_name = resItem.origin_name;
                                                insert_flag = true;
                                            }
                                        }
                                    });
                                });
                                $scope.isAjaxing = false;
                            } else {
                                $prompt.timeout($scope, res);
                                $scope.isAjaxing = false;
                            }
                        });
                    }
                }
            }
            $scope.fileUp_M.fileShow = false;
            $scope.$apply();

        },
        reset: function (index) {
            $scope.fileUp_M.data[index].origin_name = '';
            $scope.fileUp_M.data[index].path = '';
        },
        cancel: function () {
            this.hide();
        },
        hide: function () {
            this.isShow = false;
        },
        show: function () {
            CustomerNetService.button.checkBeforeUploadImg({ order_id: $scope.orderModel.order_id, second_product_id: $scope.orderModel.second_product_id }).then(function (res) {
                if (res.data.code) {
                    CustomerNetService.order.getOrderImg($scope.orderModel.order_id).then(function (res) {
                        if (res.data.code) {
                            /*$prompt.timeout($scope, {
                             data: {
                             code: 1,
                             message: res.data.msg
                             }
                             });*/
                            $scope.fileUp_M.data = [
                                {
                                    path: ''
                                },
                                {
                                    path: ''
                                },
                                {
                                    path: ''
                                },
                                {
                                    path: ''
                                },
                                {
                                    path: ''
                                }
                            ];
                            //插入图片路径
                            angular.forEach(res.data.data, function (resItem, resIndex, resArray) {
                                $scope.fileUp_M.data[resIndex].path = resItem.path;
                                $scope.fileUp_M.data[resIndex].origin_name = resItem.origin_name;
                            });
                            $scope.fileUp_M.isShow = true;
                            $scope.isAjaxing = false;
                        } else {
                            $prompt.timeout($scope, res);
                            $scope.isAjaxing = false;
                        }
                    });
                }
                else {
                    $prompt.timeout($scope, res);
                }
            });
        },
        selectImg: function () {
            $scope.fileUp_M.fileShow = true;
            $timeout(function () {
                var obj = document.getElementById('file');
                obj.click();
            }, 100);
        },
        confirm: function () {
            if ($scope.isAjaxing)
                return;
            $scope.isAjaxing = true;
            if (!$scope.fileUp_M.data[4].path && !$scope.fileUp_M.data[3].path && !$scope.fileUp_M.data[2].path && !$scope.fileUp_M.data[1].path && !$scope.fileUp_M.data[0].path) {
                $prompt.timeout($scope, {
                    data: {
                        code: 500,
                        message: '图片必填'
                    }
                });
                $scope.isAjaxing = false;
            } else {
                var data = { data: [] };
                angular.forEach($scope.fileUp_M.data, function (item, index, array) {
                    if ($scope.fileUp_M.data[index].path) {
                        data.data.push({
                            path: $scope.fileUp_M.data[index].path,
                            origin_name: $scope.fileUp_M.data[index].origin_name,
                        });
                    }
                });
                data.order_id = $scope.orderModel.order_id;
                var url = http + '/Crm/Order/uploadImgPath';
                $Ajax.postData(url, data, $scope).then(function (res) {
                    if (res.data.code) {
                        $prompt.timeout($scope, {
                            data: {
                                code: 1,
                                message: res.data.msg
                            }
                        });
                        $scope.fileUp_M.hide();
                        $scope.isAjaxing = false;
                    } else {
                        $prompt.timeout($scope, res);
                        $scope.isAjaxing = false;
                    }
                });
            }
        }
    };
    // 调研表获取值
    $scope.checkedTest = function (arrays, id, type) {

        if (!arrays) {
            return false;
        }
        if (type) {
            if (arrays.id.indexOf(id) != -1) {
                return true;
            } else {
                return false;
            }
        } else {
            for (var i = 0; i < arrays.length; i++) {
                if (arrays[i].id == id) {
                    return true;
                }
            }
        }
        return false;
    };
    $scope.checkedText = function (arrays, id) {
        if (!arrays) {
            return '';
        }
        for (var i = 0; i < arrays.length; i++) {
            if (arrays[i].id == id) {
                return arrays[i].other;
            }
        }
    };

    $scope.init();

    // 隐藏更多按钮
    document.onclick = function () {
        if ($scope.orderModel.showMore || $scope.contractModel.showMore.flag) {
            $timeout(function () {
                $scope.orderModel.showMore = false;
                $scope.contractModel.showMore.flag = false;
            }, 0);
        }
    };
}]);
