var app = angular.module("myApp");
app.registerDirective('beancurCube', ['$state', function ($state) {
    return {
        restrict: 'A',
        templateUrl: './js/components/beancurCube/template.html',
        scope: {
            menuList: '=',
            menuTitle: '@?',
            count: '=?'
        },
        replace: true,
        link: function (scope) {
            console.log(scope.menuTitle)
            scope.secondMenuShow = function (secondList) {
                var flag = false;
                secondList.forEach(function (item) {
                    if (item.is_show) {
                        flag = true;
                    }
                });
                return flag;
            };
            //随机豆腐块
            scope.colorArr = [{ 'color': 'color1' }, { 'color': 'color2' }, { 'color': 'color3' }, { 'color': 'color4' }, { 'color': 'color5' }, { 'color': 'color6' }, { 'color': 'color7' }, { 'color': 'color1' }, { 'color': 'color2' }, { 'color': 'color3' }, { 'color': 'color4' }, { 'color': 'color5' }, { 'color': 'color6' }, { 'color': 'color7' }];
            //页面跳转
            scope.statego = function (page, payload) {
                $state.go(page, payload);
            };
        }
    };
}]);