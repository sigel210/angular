app.registerCtrl('saleManage', ['$scope', '$rootScope', 'UserService', function ($scope, $rootScope, UserService) {
    var http = $rootScope.http;
    $scope.$emit('id', 'saleManage');
    $scope.isAjaxError = false;
    $scope.permission = {
        orderInformation: UserService.hasPermission(1461)
    };
    $scope.functionArray = [];
    //获取对应可操作业务线
    // if (!$rootScope.opProductList) {
    //     $rootScope.opProductList = [];
    // }
    // $scope.getOpProductList = function () {
    //     var url = http + '/Crm/index/myDb';
    //     $Ajax.get(url).then(function (res) {
    //         if (res.data.success) {
    //             if (res.data.data && res.data.data.length > 0) {
    //                 $rootScope.opProductList = res.data.data;
    //                 UserService.setProductFuncs(res.data.data);
    //             } else {
    //                 $rootScope.opProductList = [{ product_id: '', name: '' }];
    //             }
    //         } else {
    //             $prompt.timeout($scope, res);
    //         }
    //     });
    // };

    // if (!$rootScope.opProductList.length > 0) {
    //     $scope.getOpProductList();
    // }
    $scope.init = function () {
        if ($scope.permission.orderInformation) {
            $scope.functionArray.push({ name: '订单管理', js_page: 'orderInformation', js_icon: 'icon-ddgl' });
        }
    };
    // 默认操作业务线。
    $rootScope.opProductList = [{ product_id: '', name: '' }];

    $scope.init();
}]);