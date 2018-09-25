## 搜索自定义组件说明
#####设计目的： 
用于统一搜索栏结构，并且减少用于搭建搜索栏容器代码，规范搜索栏结构和实现方式。
## 配置项

| 参数名 |  参数类型 | 是否必选/默认值 | 描述 |
|----------|-------------|-------------|---------|
|  buttons|  array    | 可选/ []    | 搜索、清空按钮组   |
## buttons（array） 按钮组
| 参数名 |  参数类型 | 是否必选/默认值 | 描述 |
|----------|------------------------------------------|-------------|---------|
|  hide   |  boolean  | 可选/false  | 按钮是否显示 |
|  text|  array    | 必选/ []    | 按钮文案   |
|  func |  Function | 必选/ | 按钮方法 | 
| class| expression | 可选/     |   按钮样式控制| 
> 注意： class 的参数类型是 expression，值可以是字符串，对象，或一个数组。如果是字符串，多个类名使用空格分隔。如果是对象，需要使用 key-value 对，key 为你想要添加的类名，value 是一个布尔值。只有在 value 为 true 时类才会被添加。如果是数组，可以由字符串或对象组合组成，数组的元素可以是字符串或对象。
### buttons 按钮举例
```js
  var buttons = [
      {
          text:'搜索',
          func: function() {
              console.log('按钮1函数执行');
          },
          class: 'btn-search',
          hide: true,
      },
      {
          text:'清空',
          func: function() {
              console.log('按钮2函数执行');
          }，
          class: 'btn-reset'
      }
  ]
  ```
  ## 使用方法
1. route.js 模块引入加载
    ```js
    deps: app.resolveScriptDeps([
        +    'js/components/seachModal/directive.js',
        ])
    ```
2. js配置(demo)
    ```js
    $scope.seachModalConfig = {
        buttons:[]
    }
    ```
3. html配置（demo）
    ```html
    <div seach-modal buttons="uiModel.buttons">
        <!-- Content内容支持自定义 -->
        <div>这是一个自定义区块。很棒吧！</div>
    </div>
    ```