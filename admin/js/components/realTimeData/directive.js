app.directive('realTimeData', ['$Ajax', '$cookies', function ($Ajax, $cookies) {
        return {
            restrict: 'A',
            templateUrl: './js/components/realTimeData/template.html',
            scope: true,
            replace: true,
            link: function (scope, element) {
                scope.realTimeDate = {
                    totalOrder: 0,
                    totalnum: 0
                }
                scope.$on('orderSum', function (event, msg) {
                    if (msg) {
                        scope.realTimeDate = {
                            totalOrder: msg.total_num,
                            totalnum: msg.total_amount
                        }
                    }
                })
               
            }
        }
    }]);