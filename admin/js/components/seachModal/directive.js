var app = angular.module("myApp");
app.registerDirective('seachModal', function () {
    return {
        restrict: 'EA',
        templateUrl: './js/components/seachModal/template.html',
        transclude: true,
        replace: true,
        scope: {
            buttons: '='
        }
    };
});