// 新建支付
app.registerCtrl('billForm', [
    '$scope',
    '$state',
    '$Ajax',
    '$rootScope',
    '$prompt',
    '$http',
    '$stateParams',
    function ($scope, $state, $Ajax, $rootScope, $prompt, $http, $stateParams) {
        var http = $rootScope.http;
        $scope.$emit('id', 'saleManage');
        $scope.isAjaxError = false;
        var isAjaxing = false;
        // 淘大支付宝没有付款人。
        //表单数字等格式直接限制方法
        $scope.formitem = {
            received_pay_way: '',
            order_received_price: '',
            received_pay_name: '',
            received_pay_type: '',
            received_trade_no: '',
            order_no: '',
            received_pay_date: '',
            received_remark: ''
        };
        $scope.order_id = $stateParams.order_id || '';
        $scope.orderInfo = {};
        $scope.uiModel = {
            selectList: {
                // 支付类型
                payType: [
                    { id: '5', name: '预付款' },
                    { id: '4', name: '押金' },
                    { id: '6', name: '预付款+押金' },
                    { id: '3', name: '尾款' }
                ]
            },
            step: 1,
        };
        $scope.tabList = [
            { id: '3', name: '淘大培训支付宝' },
            { id: '4', name: '淘大培训银行卡' }
        ];

        // 黑曼
        $scope.tabIndex = '3';
        $scope.formitem.received_pay_way = '3';
        $scope.templateIndex = 4;

        // tab选中改变
        $scope.changeTab = function (index) {
            if ($scope.tabIndex != index) {
                $rootScope.temp = 'noclass';
                $scope.tabIndex = index;
                $scope.formitem.received_pay_way = index;
                $scope.received_trade_no = '';
            }
        };

        // 取消
        $scope.cancel = function () {
            $scope.stategoParam('customer.order', {
                customer_id: $stateParams.customer_id,
                menu_index: 0,
                order_id: $stateParams.order_id,
                tab_index: 1
            });
        };

        $scope.getHeimanOrderInfo = function (order_id) {
            var url = http + '/sale/Pay/getProductInfo';
            $Ajax.post(url, { order_id: order_id }).then(function (res) {
                if (res.data.code) {
                    $scope.orderInfo = res.data.data;
                } else {
                    $prompt.timeout($scope, res);
                }
            });
        };

        $scope.confirm = function () {
            if (isAjaxing) return;
            var error = '';
            if ($scope.formitem.order_received_price == '') {
                error = '请输入支付金额';
            } else if ($scope.formitem.received_pay_name == '' && $scope.tabIndex != 3) {
                error = '请输入付款人';
            } else if (
                $scope.formitem.received_trade_no == '' &&
                $scope.tabIndex == 3
            ) {
                error = '请输入交易号';
            }
            else if ($scope.formitem.received_pay_date == '') {
                error = '请输入到账日期';
            }
            if (error != '') {
                $prompt.timeout($scope, {
                    data: {
                        code: 500,
                        msg: error
                    }
                });
                return;
            }
            var url;
            url = http + '/sale/Pay/insert';
            $scope.formitem.order_id = $scope.order_id;
            isAjaxing = true;
            $Ajax.post(url, $scope.formitem).then(function (res) {
                isAjaxing = false;
                if (res.data.code) {
                    res.data.code = 1;
                }
                $prompt.timeout($scope, res);
                if (res.data.code) {
                    $state.go('customer.order', {
                        menu_index: 0,
                        order_id: $stateParams.order_id,
                        customer_id: $stateParams.customer_id,
                        tab_index: 1
                    });
                }
            });
        };

        $scope.init = function () {
            $scope.getHeimanOrderInfo($scope.order_id);
        };
        $scope.init();
    }
]);
