# 详情弹窗组件说明
设计目的： 用于统一侧边栏按钮显示容器，并且减少用于侧边栏展示控制代码，规范侧边栏结构和实现方式。
## 配置项

| 参数名 |  参数类型 | 是否必选/默认值 | 描述 |
|----------|------------------------------------------|-------------|---------|
|  show   |  boolean  | 必选/false  | 控制侧边栏显示 |
|  buttons|  array    | 可选/ []    | 侧边栏按钮组   |
|  cancel |  Function | 可选/点击X回调函数 |  取消回调 | 
| detailTitle |  string |  必选 | 侧边栏标题 |

## buttons（array） 按钮组
| 参数名 |  参数类型 | 是否必选/默认值 | 描述 |
|----------|------------------------------------------|-------------|---------|
|  hide   |  boolean  | 可选/false  | 按钮是否显示 |
|  text|  array    | 必选/ []    | 按钮文案   |
|  func |  Function | 必选/ | 按钮方法 | 
| disabled| boolean | 可选/false | 按钮可否点击 |
| class| expression | 可选/     |   按钮样式控制| 
 
 > 注意： class 的参数类型是 expression，值可以是字符串，对象，或一个数组。如果是字符串，多个类名使用空格分隔。如果是对象，需要使用 key-value 对，key 为你想要添加的类名，value 是一个布尔值。只有在 value 为 true 时类才会被添加。如果是数组，可以由字符串或对象组合组成，数组的元素可以是字符串或对象。  
 > 需要disabled样式的话请传递key:value对象模式如下字符串 '{'disabled':item.disabled}

### buttons 按钮举例
```js
  var buttons = [
      {
          text:'按钮名1',
          func: function() {
              console.log('按钮1函数执行');
          },
          disabled: false,
          class: 'expression',
          hide: true,
      },
      {
          text:'按钮名2',
          func: function() {
              console.log('按钮2函数执行');
          },
          disabled: true,
      }
  ]
```

## 使用方法
1. route.js 模块引入加载
    ```js
    deps: app.resolveScriptDeps([
        +    'js/components/detailModal/directive.js',
        ])
    ```
2. js配置(demo)
    ```js
    $scope.detailModalConfig = {
        show: false,
        buttons:[],
        cancel: function() {
            console.log("弹窗被关闭啦！");
        }
    }
    ```
3. html配置（demo）
    ```html
    <div detail-modal show="uiModel.show" buttons="uiModel.buttons">
        <!-- Content内容支持自定义 -->
        <div>这是一个自定义区块。很棒吧！</div>
    </div>
    ```

## 补充说明
1. 为了浏览器兼容性，该组件仅支持以属性方式(A)引用

## 拓展计划
1. 支持多模版容器样式，配置项 **theme**