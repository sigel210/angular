/*
    author: cwj
    created:2017年8月18日 16:24:04
    基于websocket实现消息推送，监听外围messageCount事件触发该组件内消息推送操作
 */
app.directive('myMessage', ['$Ajax', '$interval', '$timeout', function ($Ajax, $interval, $timeout) {
    return {
        restrict: 'A',
        templateUrl: './js/components/message/template.html',
        scope: true,
        link: function (scope, element) {

            scope.$on('messageCount', function (event, msg) {
                if (msg) {
                    scope.array.push(msg);
                }
                if (!a) {
                    scope.initTimer();
                }
            });
            scope.origin = true;
            scope.mainFlag = false;
            scope.tempMSG = '';
            scope.message = '';
            scope.array = [];
            var a = null;
            scope.initTimer = function () {
                a = $interval(function () {
                    scope.flag = false;
                    scope.show();
                }, 5000);
            };
            scope.flag = false;
            scope.show = function () {
                if (scope.origin) {
                    $interval.cancel(a);
                    a = null;
                    scope.mainFlag = false;
                    scope.origin = false;
                } else {
                    if (scope.mainFlag) {
                        if (scope.array.length > 1) {
                            scope.array.shift();
                        }
                        if (scope.array.length == 1) {
                            $interval.cancel(a);
                            a = null;
                            scope.mainFlag = false;
                        }
                    }
                }
                scope.mainFlag = true;
                $timeout(function () {
                    scope.message = scope.array[0];
                    scope.flag = true;
                }, 1000);
            };
            // scope.initTimer();
        }
    };
}]);