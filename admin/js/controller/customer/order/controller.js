app.registerCtrl('CustomerOrderController', ['$scope', '$state', 'CustomerOrderNetService', '$stateParams', '$prompt', '$confirm_cancel', '$loading', 'CustomerOrderService', 'UserService', function ($scope, $state, CustomerOrderNetService, $stateParams, $prompt, $confirm_cancel, $loading, CustomerOrderService, UserService) {
    // 鉴权
    $scope.authPermission = {
        deleteOrder: UserService.hasPermission(1467),
        insertPay: UserService.hasPermission(1491),
        deleteBill: UserService.hasPermission(1494),
        editBill: UserService.hasPermission(1493),
        checkBill: UserService.hasPermission(1495),
        refund: UserService.hasPermission(1469)
    };
    $scope.orderModel = {
        order_id: 1,
        order_product_id: '',
        detail: {},
        list: [],
        showType: 1, // 1 订单详情tab 2 产品内容tab 
        refundTypes: [{ id: 3, name: '违约退款' }, { id: 4, name: '暂存款退款' }, { id: 10, name: '押金退款' }],
        refundChannels: [
            // { id: 3, name: '其他' }
        ],
        applyTax: {
            type: '',
            purpose: '',
            price: ''
        },
        tabIndex: $stateParams.tab_index || '0',
        currentContent: {},
        currentProduct: {},
        product: [], // 产品与内容
        // 退款
        tempfileNames: [],
        fileNames: [],
        refundList: [],
        // 订单列表
        getList: function () {
            $scope.https.orderlist = true;
            CustomerOrderNetService.getList($stateParams.customer_id).then(function (res) {
                $scope.https.orderlist = false;
                $scope.orderModel.list = res.data.data;
                // 存在订单就选中第一个订单
                if ($scope.orderModel.list.length > 0) {
                    // 如果有指定订单，则选中指定订单
                    if ($stateParams.order_id) {
                        $scope.orderModel.order_id = $stateParams.order_id;
                        var temp = $scope.orderModel.list.find(function (item) {
                            return item.order_id == $stateParams.order_id;
                        });
                        $scope.orderModel.order_product_id = temp.order_product_id;
                    } else {
                        $scope.orderModel.order_id = $scope.orderModel.list[0].order_id;
                        $scope.orderModel.order_product_id = $scope.orderModel.list[0].order_product_id;
                    }
                    $scope.getOrderProduct();
                    $scope.changeTab();
                } else {
                    // 清楚右边选中信息
                    $scope.orderModel.showType = undefined;
                }
            });
        },
        // 删除订单
        deleteOrderConfirm: function () {
            if ($scope.isAjaxing) {
                return;
            }
            $scope.isAjaxing = true;
            CustomerOrderNetService.checkBeforeDelete({ order_id: $scope.orderModel.order_id }).then(function (res) {
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
                                    $scope.orderModel.deleteOrder($scope.orderModel.order_id);
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
        deleteOrder: function (orderId) {
            if ($scope.isAjaxing) {
                return;
            }
            $scope.isAjaxing = true;
            CustomerOrderNetService.delete({ order_id: orderId }).then(function (res) {
                $scope.isAjaxing = false;
                if (res.data.code) {
                    $state.go('orderInformation');
                }
                $prompt.timeout($scope, res);
            });
        },
        changeOrder: function (id, second, product_id, product_tag) {
            $scope.orderModel.order_id = id;
            $scope.orderModel.second_product_id = second;
            $scope.orderModel.third_product_id = product_id;
            $scope.orderModel.product_tag = product_tag;
            $scope.orderModel.showType = 1;
            $scope.orderModel.currentProduct = {};
            $scope.orderModel.currentContent = {};
            $scope.orderModel.getOrderDetail();
            $scope.getOrderProduct();
            // 加载右边信息
            $scope.changeTab();
        },
        getOrderDetail: function () {
            $scope.https.orderdetail = true;
            CustomerOrderNetService.getDetail($scope.orderModel.order_id).then(function (res) {
                $scope.https.orderdetail = false;
                $scope.orderModel.detail = res.data.data;
            });
        },
        // 退款模型
        refundModal: {
            flag: false,
            data: {},
            req: {},
            title: '退款申请',
            maxPrice: 0,
            hide: function () {
                this.flag = false;
            },
            show: function () {
                if ($scope.isAjaxing) {
                    return;
                }
                $scope.orderModel.refundChannels = [];
                $scope.orderModel.refundModal.req.refund_amount = '';
                $scope.orderModel.refundModal.req.approval_type = 3;
                $scope.orderModel.refundModal.req.reason = '';
                $scope.orderModel.refundModal.req.order_received_id = '';
                $scope.orderModel.refundModal.req.refund_channel = '';
                $scope.orderModel.refundModal.req.imgs = [];
                $scope.orderModel.refundModal.req.order_content_id_arr = [];
                $scope.orderModel.tempfileNames = [];
                $scope.orderModel.fileNames = [];
                this.maxPrice = 0;
                $scope.isAjaxing = true;
                CustomerOrderNetService.order.checkBeforeRefund({ order_id: $scope.orderModel.order_id }).then(function (res) {
                    $scope.isAjaxing = false;
                    if (res.data.code) {
                        CustomerOrderNetService.order.getRefundInfo({ order_id: $scope.orderModel.order_id }).then(function (res) {
                            if (res.data.code) {
                                $scope.orderModel.refundModal.data.refund_type = res.data.data.refund_type;
                                $scope.orderModel.refundModal.data.order_product_list = res.data.data.order_product_list;
                                $scope.orderModel.refundModal.data.refund_way_list = res.data.data.refund_way_list;
                                $scope.orderModel.refundModal.refund_amount_max = res.data.data.refund_amount_max;
                                $scope.orderModel.refundModal.flag = true;
                                $scope.orderModel.refundModal.resetRefund();
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
                // 必填项校验
                var require = '';
                if (this.req.approval_type === '') {
                    require = '请选择退款类型';
                } else if (this.req.approval_type == 3 && this.req.order_content_id_arr.length == 0) {
                    require = '请选择退款内容';
                } else if (this.req.channel == '') {
                    require = '请选择退款渠道';
                } else if (this.req.refund_amount === '') {
                    require = '请输入退款金额';
                } else if (this.req.refund_amount && Number.parseFloat(this.req.refund_amount) > Number.parseFloat(this.maxPrice)) {
                    require = '退款金额不得大于退款上限金额';
                } else if (this.req.order_received_id == '') {
                    require = '请选择退款信息';
                } else if (this.req.reason == '') {
                    require = '请输入退款理由';
                }
                if (require !== '') {
                    $prompt.timeout($scope, {
                        code: 500,
                        msg: require
                    });
                    return;
                }
                $scope.isAjaxing = true;
                var data = {
                    order_id: $scope.orderModel.order_id,
                    order_content_id_arr: this.req.order_content_id_arr,
                    refund_amount: this.req.refund_amount,
                    refund_type: this.req.approval_type,
                    order_received_id: this.req.order_received_id,
                    refund_reason: this.req.reason,
                    refund_channel: this.req.refund_channel,
                    refund_file: this.req.imgs,
                    // second_product_id: $scope.orderModel.second_product_id
                };
                CustomerOrderNetService.order.applyRefund(data).then(function (res) {
                    $scope.isAjaxing = false;

                    if (res.data.code) {
                        $scope.orderModel.getOrderDetail();
                        $scope.getOrderProduct();
                        $scope.orderModel.getRefundList();
                        $scope.orderModel.refundModal.hide();
                    }
                    $prompt.timeout($scope, res);
                });
            },
            changeApprovalType: function (type) {
                if (type == 4) {
                    $scope.orderModel.refundModal.maxPrice = $scope.orderModel.refundModal.refund_amount_max;
                    $scope.orderModel.refundModal.req.order_content_id_arr = [];
                    $scope.orderModel.refundModal.data.order_product_list.forEach(function (item) {
                        item.order_content_list.forEach(function (obj) {
                            obj.checked = false;
                        });
                    });
                } else {
                    $scope.orderModel.refundModal.maxPrice = 0;
                    $scope.orderModel.refundModal.resetRefund();
                }
            },
            // 重置退款渠道和退款账户
            resetRefund: function () {
                // 默认选中第一个账户
                $scope.orderModel.refundChannels = [];
                if ($scope.orderModel.refundModal.data.refund_way_list.bank.length > 0) {
                    $scope.orderModel.refundChannels.push({ id: 2, name: '银行' });
                    $scope.orderModel.refundModal.req.refund_channel = 2;
                    $scope.orderModel.refundModal.req.order_received_id = $scope.orderModel.refundModal.data.refund_way_list.bank[0].order_received_id;
                }
                if ($scope.orderModel.refundModal.data.refund_way_list.ali.length > 0) {
                    $scope.orderModel.refundChannels.push({ id: 1, name: '支付宝' });
                    $scope.orderModel.refundModal.req.refund_channel = 1;
                    $scope.orderModel.refundModal.req.order_received_id = $scope.orderModel.refundModal.data.refund_way_list.ali[0].order_received_id;
                }
            },
            // 切换退款渠道时重置退款账户
            resetAccount: function (type) {
                if (type == 1) {
                    $scope.orderModel.refundModal.req.order_received_id = $scope.orderModel.refundModal.data.refund_way_list.ali[0].order_received_id;
                } else if (type == 2) {
                    $scope.orderModel.refundModal.req.order_received_id = $scope.orderModel.refundModal.data.refund_way_list.bank[0].order_received_id;
                } else {
                    $scope.orderModel.refundModal.req.order_received_id = '';
                }
            },
            contentClick: function (isChecked, price, id) {
                var index = $scope.orderModel.refundModal.req.order_content_id_arr.indexOf(id);
                if (isChecked) {
                    $scope.orderModel.refundModal.maxPrice -= Number.parseFloat(price);
                    $scope.orderModal.refundModal.req.order_content_id_arr.splice(index, 1);
                } else {
                    $scope.orderModel.refundModal.maxPrice += Number.parseFloat(price);
                    $scope.orderModel.refundModal.req.order_content_id_arr.push(id);
                }
            },
            // 附件操作
            uploadImg: function () {
                document.querySelector('#refund-img').click();
            },
            fileAdd: function () {
                if ($scope.isAjaxing) {
                    return;
                }
                var files = document.getElementById('refund-img').files;

                if (($scope.orderModel.refundModal.req.imgs.length + files.length) > 10) {
                    $prompt.timeout($scope, {
                        data: {
                            code: 0,
                            msg: '上传图片不得多于10张'
                        }
                    });
                    return;
                }
                var data = {};
                var index = 0;
                for (var i = 0, l = files.length; i < l; i++) {
                    if (files[index].size > 10485760) {
                        $prompt.timeout($scope, {
                            data: {
                                code: 500,
                                msg: '图片不得大于10M'
                            }
                        });
                        // 恢复上传前的名字数组
                        $scope.orderModel.tempfileNames = angular.copy($scope.orderModel.fileNames);
                        return;
                    } else {
                        data['img[' + i + ']'] = files[index];
                        $scope.orderModel.tempfileNames.push(files[index].name);
                    }
                    index++;
                }
                $scope.isAjaxing = true;
                CustomerOrderNetService.order.uploadImg(data, $scope).then(function (res) {
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
        },
        getRefundList: function () {
            CustomerOrderNetService.order.getRefundList({ order_id: $scope.orderModel.order_id }).then(function (res) {
                if (res.data.code) {
                    $scope.orderModel.refundList = res.data.data;
                }
            });
        }
    };
    $scope.https = {
        orderlist: false,
        orderdetail: false,
        product: false,
        paylist: false,
        paydetail: false,
    };
    //  切换tab
    $scope.changeTab = function (index) {
        if (index !== undefined) {
            $scope.orderModel.tabIndex = index;
        }
        switch ($scope.orderModel.tabIndex) {
            case '0': $scope.orderModel.getOrderDetail(); break;
            case '1': $scope.billModel.methods.getList(); break;
            case '2': $scope.orderModel.getRefundList(); break;
        }
    };



    // 产品与内容详情
    $scope.getOrderProduct = function () {
        $scope.https.product = true;
        CustomerOrderNetService.getOrderProduct({
            order_id: $scope.orderModel.order_id
        }).then(function (res) {
            if (res.data.code) {
                $scope.https.product = false;
                $scope.orderModel.product = res.data.data;
            }
        });
    };

    // 内容控制
    $scope.handleProductClick = function (obj) {
        obj.showContent = !obj.showContent;
        $scope.orderModel.currentProduct = obj;
        $scope.orderModel.showType = 2;
        $scope.orderModel.currentContent = {};
    };
    $scope.handleContentClick = function (obj, item) {
        $scope.orderModel.currentContent = obj;
        $scope.orderModel.showType = 3;
        $scope.orderModel.currentProduct = item;
    };

    // 支付模块
    $scope.billModel = {
        order_received_id: 0,
        list: [],
        detail: {},
        edit: {},
        selectList: {
            payType: [{ id: '4', name: '押金' }, { id: '3', name: '尾款' }, { id: '5', name: '预付款' }, { id: '6', name: '预付款+押金' }]
        },
        editModal: {
            data: {},
            flag: false,
            title: '编辑支付信息',
            show: function () {
                CustomerOrderNetService.bill.checkBeforeUpdate({
                    order_received_id: $scope.billModel.order_received_id,
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
                var error = CustomerOrderService.checkBill($scope.billModel.editModal.data);
                if (error) {
                    $prompt.timeout($scope, {
                        data: {
                            code: 500,
                            msg: error
                        }
                    });
                    return;
                }
                $scope.isAjaxing = true;
                CustomerOrderNetService.bill.update($scope.billModel.editModal.data).then(function (res) {
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
                CustomerOrderNetService.bill.checkBeforeVerify({
                    order_received_id: $scope.billModel.order_received_id,
                }).then(function (res) {
                    if (res.data.code) {
                        $scope.billModel.loadModal.flag = true;
                        $loading.show();
                        CustomerOrderNetService.bill.verify({ order_received_id: $scope.billModel.detail.order_received_id }).then(function (res) {
                            $scope.billModel.loadModal.flag = false;
                            $loading.hide();
                            if (res.data.code) {
                                $prompt.timeout($scope, res);
                            } else {
                                $scope.billModel.errorBill.show(res.data.data);
                            }
                            $scope.orderModel.getList();
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
            // 重置支付信息，订单更新时候调用
            reset: function () {
                $scope.billModel.order_received_id = 0;
                $scope.billModel.detail = {};
                $scope.billModel.edit = {};
                $scope.billModel.list = [];
                $scope.billModel.checkBillRes = null;
            },
            // 切换支付信息
            changeBill: function (id) {
                $scope.billModel.order_received_id = id;
                $scope.billModel.methods.getDetail(id);
            },
            // 删除支付前确认
            showDeletePay: function () {
                CustomerOrderNetService.bill.checkBeforeDelete({
                    order_received_id: $scope.billModel.detail.order_received_id
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
                                        $scope.billModel.methods.delete($scope.billModel.order_received_id);
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
            },
            // 删除支付信息
            delete: function (id) {
                if ($scope.isAjaxing) {
                    return;
                }
                $scope.isAjaxing = true;
                CustomerOrderNetService.bill.delete({ order_received_id: id }).then(function (res) {
                    $scope.isAjaxing = false;
                    if (res.data.code) {
                        $scope.billModel.methods.getList();
                    }
                    $prompt.timeout($scope, res);
                });
            },
            getList: function () {
                if ($scope.orderModel.order_id != 0) {
                    $scope.https.billlist = true;
                    CustomerOrderNetService.bill.getList({ order_id: $scope.orderModel.order_id }).then(function (res) {
                        $scope.https.billlist = false;
                        if (res.data.code) {
                            if (res.data.data.list.length > 0) {
                                $scope.billModel.list = res.data.data.list;
                                $scope.billModel.button = res.data.data.button;
                                $scope.billModel.order_received_id = $scope.billModel.list[0].order_received_id;
                                $scope.billModel.methods.getDetail($scope.billModel.order_received_id);
                            } else {
                                $scope.billModel.list = [];
                                $scope.billModel.order_received_id = 0;
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
                CustomerOrderNetService.bill.getDetail({ order_received_id: id }).then(function (res) {
                    $scope.https.billdetail = false;
                    if (res.data.code) {
                        if (res.data.data) {
                            $scope.billModel.detail = res.data.data;
                            $scope.billModel.edit = angular.copy($scope.billModel.detail);
                        }
                    }
                });
            },
            // 新建支付
            createBill: function () {
                if ($stateParams.customer_id && $scope.orderModel.order_id) {
                    CustomerOrderNetService.bill.checkBeforeInsert({ order_id: $scope.orderModel.order_id }).then(function (res) {
                        if (res.data.code) {
                            $state.go('billForm', { customer_id: $stateParams.customer_id, order_id: $scope.orderModel.order_id });
                        }
                        else {
                            $prompt.timeout($scope, res);
                        }
                    });
                }
            },
        }
    };
    $scope.init = function () {
        $scope.orderModel.getList();
    };
    $scope.init();
}]);
