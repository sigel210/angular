// 此js暂时用不着。用于多种类型新建订单
app.registerCtrl('orderManage', ['$scope', '$stateParams', '$state','CommonNetService', function ($scope, $stateParams, $state,CommonNetService) {
    $scope.$emit('id', 'saleManage');
    $scope.pageName = 'orderManage';
    $scope.customer_id = $stateParams.customer_id ? $stateParams.customer_id : '';
    $scope.operate_pid = $stateParams.operate_pid ? $stateParams.operate_pid : '';
    $scope.customer = $stateParams.customer ? $stateParams.customer : '';
    $scope.isAjaxError = false;
    $scope.goControler = '';

    //业务线控制
    $scope.controlArr = [];
    $scope.insertOperateLine = function () {
        CommonNetService.insertOperateLine($scope.operate_pid).then(function (res) {
            $scope.goControler = res.data.data;
            if($scope.goControler&&$scope.goControler.length!=0){
                $scope.tabIndex = $scope.goControler[0].product_id
            }
            if ($scope.tabIndex == '2') {
                $scope.tabList = [
                    { status: 'orderManage.orderOnline', tab_id: 1, tab_name: '线上培训' },
                    { status: 'orderManage.orderOffline', tab_id: 2, tab_name: '线下培训' },
                    { status: 'orderManage.orderAiYou', tab_id: 4, tab_name: '爱柚营销' },
                    // { status: 'orderManage.orderHM', tab_id: 8, tab_name: '黑曼营销' }
                ];
                $state.go('orderManage.orderOffline',{first_product_id: $scope.tabIndex});
            } else {
                $scope.tabList = [
                    { status: 'orderManage.orderOnline', tab_id: 1, tab_name: '线上培训' },
                    { status: 'orderManage.orderOffline', tab_id: 2, tab_name: '线下培训' },
                    { status: 'orderManage.orderAiYou', tab_id: 4, tab_name: '爱柚营销' },
                    // { status: 'orderManage.orderHM', tab_id: 8, tab_name: '黑曼营销' }
                ];
                angular.forEach($scope.tabList, function (item) {
                    if (item.tab_id == $scope.tabIndex) {
                        $state.go(item.status,{operate_pid: $scope.operate_pid,first_product_id: $scope.tabIndex});
                    }
                });
            }
            for(var i = 0;i<$scope.goControler.length;i++){
                if($scope.goControler[i].product_id=='1'){
                    $scope.controlArr[0] =  $scope.goControler[i].product_id;
                }else if($scope.goControler[i].product_id=='2'){
                    $scope.controlArr[1] =  $scope.goControler[i].product_id;
                }else if($scope.goControler[i].product_id=='4'){
                    $scope.controlArr[2] =  $scope.goControler[i].product_id;
                }else{
                    $scope.controlArr[3] =  $scope.goControler[i].product_id;
                }
            }
        });
    };
    $scope.insertOperateLine();

    // 特训营特殊处理
    $scope.returnback = function () {
        $state.go('customer', { customer_id: $scope.customer_id, operate_pid: $scope.operate_pid, menu_index: '3' });
    };
    // tab选中改变
    $scope.changeTab = function (index,page) {
                $scope.tabIndex = index;
                $scope.tabChangeList(page);
    };
    // tab切换修改列表
    $scope.tabChangeList = function (page) {
        $state.go(page,{operate_pid: $scope.operate_pid,first_product_id: $scope.tabIndex});
    };
}]);
