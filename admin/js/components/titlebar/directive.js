/*
    author:cwj
    created：2017年8月18日 16:22:13
    本指令用于生成页面title模块，只处理tab内置操作，如果需要对外交互，可配置回调函数。
    默认current会选中第一个。
    仅适用于子模块注入。
 */
app.registerDirective('titleBar', function () {
    return {
        restrict: 'A',
        templateUrl: './js/components/titlebar/template.html',
        scope: {
            tabList: '=',
            tabKey: '@',  // 用于显示用的key
            tabValue: '@', // 显示用属性
            myTitle: '@',  // 标题名
            currentIndex: '=',  // 默认选中index
            currentValue: '=', // 默认选中值，优先级大于 index
            callback: '&', // tab切换时的回调函数
            active: '@', // boolean 配置是否可点击，默认tab不可切换
            special: '@', // boolean 返回是否指定特殊url路径
            goback: '&', // 返回回调执行函数
        },
        replace: true,
        link: function (scope, element) {
            scope.changeTab = function (obj, index) {
                scope.currentIndex = index;
                scope.tempKey = obj[scope.tabKey];
                scope.callback(obj);
            };
            scope.tempKey = '';
            scope.init = function () {
                if (scope.currentValue) {
                    scope.tempKey = scope.currentValue;
                } else {
                    // 默认取第一个
                    if (!scope.currentIndex) {
                        scope.currentIndex = 0;
                        scope.tempKey = scope.tabList[0][scope.tabKey];
                    }
                }
                if (!scope.special) {
                    scope.goback = function () {
                        window.history.back();
                    };
                }
            };
            scope.init();
        }
    };
});