// 新详情页面，采用二级路由
app.registerCtrl('customerController', ['$scope', '$state', 'CustomerNetService', '$stateParams', function ($scope, $state, CustomerNetService, $stateParams) {
    $scope.$emit('id', 'customer');
    $scope.customer_id = $stateParams.customer_id;
    $scope.uiModel = {
        menus: ['订单信息'],
        menuIndex: $stateParams.menu_index,
        // tabs: []
    };
    // 跳转三级路由
    $scope.goContent = function (menuIndex) {
        switch (menuIndex) {
            case '0':
                // 订单信息
                $scope.stategoParam('customer.order', { order_id: $stateParams.order_id, tab_index: 1 });
                break;
            default:
                $scope.stategoParam('customer.order', { order_id: $stateParams.order_id, tab_index: 0 });
        }
    };
    $scope.init = function () {
        // 获取客户信息
        CustomerNetService.getCustomerInfo({ customer_id: $stateParams.customer_id }).then(function (res) {
            $scope.customer = res.data.data.customer;
        });
    };
    $scope.init();
}]);
