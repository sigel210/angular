/**
 * Created by admin on 2017/7/10.
 */
app.registerCtrl('moneyManage', ['UserService', '$scope', function (UserService, $scope) {
    /*数据模型 start*/

    $scope.isAjaxError = false;

    $scope.operativeList =
        {
            checkSecondMenuList: [
                {
                    id: 308,
                    title: '对账上传',
                    js_page: 'uploadBill',
                    js_icon: 'icon-duizhangguanli',
                    is_show: UserService.hasPermission(308) || true
                },
                // ,
                // {
                //     id: 673,
                //     title: '订单对账管理',
                //     js_page: 'contractTemplate',
                //     js_icon: 'icon-contractTemplate',
                //     is_show: UserService.hasPermission(673)
                // },
                {
                    id: 674,
                    title: '交易流水对账管理',
                    js_page: 'transactionLog',
                    js_icon: 'icon-transactionLog',
                    is_show: UserService.hasPermission(1496)
                },
                // {
                //     id: 1102,
                //     title: '开票审批',
                //     js_page: 'invoice',
                //     js_icon: 'icon-invoice',
                //     is_show: UserService.hasPermission(1102)
                // },
                // {
                //     id: 675,
                //     title: '开票管理',
                //     js_page: 'billManage',
                //     js_icon: 'icon-billManage',
                //     is_show: UserService.hasPermission(675),
                //     isNew: UserService.isNewMoulde(300),
                // },
                // {
                //     id: 919,
                //     title: '赠送服务审批',
                //     js_page: 'giveService',
                //     js_icon: 'icon-giveService',
                //     is_show: UserService.hasPermission(919),
                //     isNew: UserService.isNewMoulde(300),
                // },
                // {
                //     id: 309,
                //     title: '退款管理',
                //     js_page: 'refund',
                //     js_icon: 'icon-refund',
                //     is_show: UserService.hasPermission(309)
                // },
                // {
                //     id: 920,
                //     title: '机构成本结算',
                //     js_page: 'costSettlement',
                //     js_icon: 'icon-cost',
                //     is_show: UserService.hasPermission(920),
                //     isNew: UserService.isNewMoulde(300),
                // },
                // {
                //     id: 921,
                //     title: '有墨写手结算',
                //     js_page: 'writerSettlement',
                //     js_icon: 'icon-writer',
                //     is_show: UserService.hasPermission(921),
                //     isNew: UserService.isNewMoulde(300),
                // }
            ]
        };
    $scope.count = {};
    /*数据模型 end*/

    /*函数 start*/
    // $scope.getRedPoint = function () {
    //     FinanceNetService.financeTotal().then(function (res) {
    //         if (res.data.code) {
    //             $scope.count = {
    //                 giveService: res.data.data.gives,
    //                 refund: res.data.data.refund,
    //                 invoice: res.data.data.tax,
    //                 billManage: res.data.data.mange
    //             };
    //         } else {
    //             $prompt.timeout($scope, res);
    //         }
    //     });
    // };
    // $scope.init = function () {
    //     $scope.getRedPoint();
    // };
    /*函数 end*/

    /*启动 start*/
    $scope.$emit('id', 'moneyManage');
    $scope.init();
    /*启动 end*/


}]);

