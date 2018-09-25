# 弹窗组件使用方法
本组建构造用意为规范弹窗样式，保持弹窗内部样式可以自定义，减少冗余代码。提升迭代效率
## 配置项

| 参数名 |  参数类型 | 是否必选/默认值 | 描述 |
|----------|------------------------------------------|-------------|---------|
|  confirm   |  function  | 必选/  | 确认按钮回调 |
|  config |  object    | 可选/ []    | 用于配置弹窗页数据   |
|  size |  string | 可选/'sm' |  用于控制弹窗大小  | 
- config 用于配置弹窗页数据，参考使用方法第三步，config模型配置举例
- confirm 确认按钮回调，牢记执行后手动讲config.flag 置为 false
- size 用于控制弹窗大小，[sm '标准弹窗',lg '大弹窗']

## config 详解 
| 参数名 |  参数类型 | 是否必选/默认值 | 描述 |
|----------|------------------------------------------|-------------|---------|
|  flag   |  object  | 必选/  | 弹窗显示 |
|  title |  array    | 可选/ []    | 弹窗标题   |
|  data |  object | 可选 |  弹窗内容数据绑定  | 
| btnName | string | 可选/'确认' |  弹窗按钮名  | 
## 使用方法  
1. route 依赖加载
```js
.state('customer', {
        url: '/customer/:customer_id/:operate_pid/:menu_index/:rmenu_index/:resource/:survey_id',
        templateUrl: 'views/customer/main.html',
        controller: 'customerController',
        resolve: {
          deps: app.resolveScriptDeps([
            'js/components/editModal/directive.js',
          ])
        }
      })
```
2. html 的构建方式
```html
<div edit-modal size="lg" config="config" confirm="config.confirm(data)">
    <div class="form-wrap add-edit-form form-wrap-w-sm">
        <p ng-bind="config.data.a"></p>
        <input type="text" ng-model="config.data.a" />
    </div>
</div>
```
3. config 模型配置
```js
// config 举例
{
    flag:false,
    title: '编辑'
    data:{},
    confirm: function(data){
            // do something
    },
    btnName: '按钮名字自定义，默认为“确认”' 
}
```