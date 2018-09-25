// 订单管理
app.registerCtrl('orderInformation', ['$scope', '$state', '$rootScope', '$prompt', '$stateParams', 'SaleNetService', 'UserService', function ($scope, $state, $rootScope, $prompt, $stateParams, SaleNetService, UserService) {
    $scope.$emit('id', 'saleManage');
    $scope.pageName = 'orderInformation';
    $scope.isAjaxError = false;
    $rootScope.operate_pid = $stateParams.operate_pid;
    $scope.permission = {
        orderAdd: UserService.hasPermission(1470)
    };
    // 筛选项
    $scope.uiModel = {
        filters: {
            customer: '',
            order_creater: '',
            order_no: '',
            received_date_start: '',
            received_date_end: ''
        },
        page: {
            page_no: '',
            page_size: 20,
            total: 0,
            page_count: 0
        }
    };
    $scope.originalFilters = angular.copy($scope.uiModel.filters);

    // 查询
    $scope.search = function () {
        $scope.orginUimodel = angular.copy($scope.uiModel);
        $scope.uiModel.page.pageIndex = 1;
        $scope.getList();
    };

    $scope.getList = function (pageIndex) {
        SaleNetService.getOrderList(pageIndex, $scope.orginUimodel.filters, $scope, { page_size: $scope.orginUimodel.page.page_size }).then(function (res) {
            if (res.data.code) {
                $scope.uiModel.page.page_no = res.data.page_info.page_no;
                $scope.uiModel.page.total = res.data.page_info.total;
                $scope.uiModel.page.page_count = res.data.page_info.page_count;
                $scope.list = res.data.data;
            }
        });
    };

    //绑定搜索
    document.onkeydown = function (e) {
        var ev = document.all ? window.event : e;
        if (ev.keyCode == 13) {
            $scope.search();
        }
    };

    $scope.reset = function () {
        // 重置
        $scope.uiModel.filters = angular.copy($scope.originalFilters);
        $scope.getList();
    };

    // 跳转到我的客户详情
    $scope.goDetail = function (obj) {
        var url = $state.href('customer.order', { customer_id: obj.customer_id, menu_index: 0, order_id: obj.order_id });
        window.open(url, '_blank');
    };

    // 新建订单
    $scope.orderAdd = function () {
        $scope.orginUimodel = angular.copy($scope.uiModel);
        sessionStorage.setItem('uiModel', JSON.stringify($scope.orginUimodel));
        $state.go('hmAdd');
    };
    // 初始化
    $scope.init = function () {
        // 跳转
        // 如果存在sessionstorage，取sessionstorage的uiModel
        if (sessionStorage.getItem('uiModel')) { //刷新页面
            $scope.uiModel = JSON.parse(sessionStorage.getItem('uiModel'));
            $scope.orginUimodel = angular.copy($scope.uiModel);//用于 不点击搜索，直接点击分页，不保存搜索项
            $scope.getList($scope.uiModel.page.page_no);
        } else {
            $scope.orginUimodel = angular.copy($scope.uiModel);//用于 不点击搜索，直接点击分页，不保存搜索项
            $scope.getList();
        }
        // // 绑定uiModel刷新事件
        window.onbeforeunload = function () { //本页面加载前;
            sessionStorage.setItem('uiModel', JSON.stringify($scope.orginUimodel));
        };
        // 完成后清除uiModel
        sessionStorage.removeItem('uiModel');
    };
    $scope.init();
}]);
