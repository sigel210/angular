/*
    author:cwj
    created：2017年8月18日 16:22:13
    本指令搜索框复选弹窗1.0
    不支持分组和筛选。
 */
app.registerDirective('multipleSelect', function () {
    return {
        restrict: 'A',
        templateUrl: './js/components/selectMutiple/template.html',
        scope: {
            list: '=', // options数组
            choosen: '=', // 选中参数
            key: '@', // 选中的属性，默认为id
            value: '@', // 用于显示的属性，默认为name
            // isShow: '=',  // 控制弹窗显示
            choose2show: '='
        },
        replace: true,
        link: function (scope) {
            scope.str = [];
            scope.isShow = false;
            scope.init = function () {
                // 初始项配置
                scope.key = scope.key || 'id';
                scope.value = scope.value || 'name';
            };
            scope.choose = function (item, index, e) {
                e.stopPropagation();
                if (scope.choosen.length == 0) {
                    scope.str = [];
                }
                var flag = false;
                for (var i = 0; i < scope.choosen.length; i++) {
                    if (scope.choosen[i] == item[scope.key]) {
                        scope.choosen.splice(i, 1);
                        scope.str.splice(i, 1);
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    scope.choosen.push(item[scope.key]);
                    scope.str.push(item[scope.value]);
                }
                scope.callBack();
            };
            scope.callBack = function () {
                scope.choose2show = scope.str.join(',');
            };
            scope.toggle = function (e) {
                e.stopPropagation();
                scope.isShow = !scope.isShow;
            };
            scope.leave = function () {
                scope.isShow = false;
            };
            scope.init();
        }
    };
});