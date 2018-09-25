# 精简分页组件优化版

# 必选配置项

| 参数名     | 参数类型 | 默认值 | 描述             |
| ---------- | -------- | ------ | ---------------- |
| pageIndex  | Int      | 1      | 当前分页值       |
| pageSize   | Int      | 10     | 每页展示条数     |
| total      | Int      | 0      | 总数据数         |
| pageCount  | Int      | 0      | 分页总数         |
| pageChange | Function | -      | 分页按钮点击操作 |

# 可选拓展配置项
| 参数名         | 参数类型 | 可选范围            | 描述                                |
| -------------- | -------- | ------------------- | ----------------------------------- |
| size           | String   | ['standard','mini'] | 控制分页显示尺寸                    |
| hideTotal      | Boolean  | -                   | 是否隐藏总数显示,默认值为'false'    |
| hideQuickPass  | Boolean  | -                   | 是否隐藏快速跳转,默认值为'false'    |
| showSinglePage | Boolean  | -                   | 只有一页时是否显示。默认值为'false' |
| pageMaxNo      | Int      | -                   | 分页按钮最多显示数量，默认值为 '5'  |

# 使用方法
## 路由指令加载
```js
    .state('comunicationPlan', {
        url: '/comunicationPlan',
            templateUrl: 'views/comunicationPlan/comunicationPlan.html',
                controller: 'comunicationPlan',
                resolve: {
                    deps: app.resolveScriptDeps([
+                        'js/components/page/directive2.js',
                        'js/controller/comunicationPlan/comunicationPlan.js'
                    ])
                }
            })
```
## js配置
```js
// net.js pageConfig 选填
this.getOrderList =  function(pageIndex,filters,scope,pageConfig) {
        var url = http + '/sale/Order/index';
        return $Ajax.getList2(url,pageIndex,filters,scope,pageConfig);
    };
// controller.js
$scope.getList = function(pageIndex)) {
       SaleNetService.getOrderList(pageIndex, $scope.uiModel.filters, $scope,{page_size: $scope.page.page_size}).then(function (res) {
            if (res.data.code) {
                $scope.uiModel.page.page_no = res.data.page_info.page_no;
                $scope.uiModel.page.total = res.data.page_info.total;
                $scope.uiModel.page.page_count = res.data.page_info.page_count;
                $scope.list = res.data.data;
            }
        });
}
// 注意。默认page_no 不要填
$scope.page = {
        page_no: '', 
        page_size: 20,
        total: 0,
        page_count: 0
    };

```
## html配置
```html
<div pages2 class="page-right" page-index="page.page_no" page-size="page.page_size" total="page.total" page-count="page.page_count" page-change="getList(pageIndex)"></div>
```

# 补充说明
1. service.js 中，在$Ajax服务中新增了一种获取列表的方法getList2，为了更快捷的构建列表请求。
2. 组件在分页只有一页的时候默认不显示
3. 组件除了控制分页信息，不控制其他任何数据

## $Ajax.getList2 方法介绍
本方法用于传递用于取列表的接口快捷构建，最后返回一个promise。
本方法做了时间限制，如果超过30秒，error。
本方法自动处理了loading信息。并自动处理**isAjaxError**，**pageListLoading** 2个$scope参数。后续对于两个参数和DOM的封装会考虑重新构建一个新的组件

### 传递参数，按顺序
1. url
2. page 当前分页
3. filter 过滤参数
4. scope 作用域
5. pageConfig  分页设置。默认（{page_size: 10}）


# 更新计划

1. 后续可能添加对于pageSize变化的回调函数配置