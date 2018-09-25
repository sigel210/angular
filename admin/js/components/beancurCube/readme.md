# 豆腐块组件说明

## 注意：
使用前在roiute中注入模板js，否则会因为懒加载出现加载不出的问题
```js
.state('teamCenter', {
    url: '/teamCenter',
    templateUrl: 'views/teamCenter/main.html',
    controller: 'TeamCenter',
    resolve: {
        deps: app.resolveScriptDeps(['./js/components/beancurCube/directive.js'])
    }
})
```

## 配置项

| 参数名 |  参数类型 | 是否必选/默认值 | 描述 |
|----------|------------------------------------------|-------------|---------|
|  menuList   |  array  | 必选  | 豆腐块相关数据 |
|  title |  string    | 可选   | 头部标题   |
|  count |  object | 可选/{js_page:xxx} |  小圆点配置 | 

## 参数示例：
豆腐块数据：
```js
$scope.menuList = [
            {
                title: '全局类',//二级标题
                secondMenuList: [//数据配置
                    {
                        id: 741,//节点id
                        title: '客户分布情况',//豆腐块名称
                        page: 'customerDistribution',//自定义，js页面路由
                        icon: 'icon-khfbqk',// 豆腐块图标
                        is_show: UserService.hasPermission(741),//权限控制
                        is_new:true,//显示为新建模块【可选】
                        payload:{content_type:1}//路由跳转时需要传递的参数【可选】
                    },
                    {
                        id: 742,
                        title: '流失统计',
                        page: 'leaveStatistics',
                        icon: 'icon-lstj',
                        is_show: UserService.hasPermission(742),
                    },
                ]
            },
            {
                title: '日志类',
                secondMenuList: [
                    {
                        id: 730,
                        title: '轨迹日志',
                        page: 'trackLog',
                        icon: 'icon-gjrz',
                        is_show: UserService.hasPermission(730),
                    },
                ]
            },
        ];
```
小圆点：通过接口调取
```js
var url = http + '/Statistic/Common/index&department_id=';
$Ajax.get(url).then(function(res){
    $scope.count = {
        approval: res.data.data.seller[2].approval_count,
        approvalJlManager: res.data.data.seller[2].approval_count,
        approvalZjManager: res.data.data.seller[2].approval_count,
        needReconciliationRate:res.data.data.seller[0].account,
        needAuditOrderRate: res.data.data.seller[1].qualification,
    };
});
```
```html



