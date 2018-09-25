app.registerCtrl('operativeManage', ['$scope', '$state', '$Modal', '$Ajax', '$rootScope', '$slider', 'UserService', '$prompt', function ($scope, $state, $Modal, $Ajax, $rootScope, $slider, UserService, $prompt) {
    /*数据模型 start*/
    var http = $rootScope.http;
    $scope.isAjaxError = false;
    var isAjaxing = false;
    $scope.operativeList = [
        {
            secondMenuList: [
                {
                    id: 741,//节点id
                    title: '执行管理',//豆腐块名称
                    page: 'executionManage',//自定义，js页面路由
                    icon: 'icon-khfbqk',// 豆腐块图标
                    is_show:true,//权限控制
                    is_new: true,//显示为新建模块【可选】
                },
            ]
        }
    ];

    /*数据模型 end*/

    /*初始化加载 start*/


    /*初始化加载 end*/

    /*函数 start*/

    /*函数 end*/

    /*启动 start*/
    $scope.$emit('id', 'operativeManage');
    /*启动 end*/


}]);

