/*
    author: cwj
    created: 2018年5月10日 16:07:38
    version: 1.0
    description: 详情侧边栏弹窗
    注意，如果按钮方法需要绑定参数，则不可使用buttons传参。
 */

var app = angular.module("myApp");
app.registerDirective('detailModal', function () {
    return {
        restrict: 'A',
        templateUrl: './js/components/detailModal/template.html',
        transclude: true,
        replace: true,
        scope: {
            show: '=',
            buttons: '=?',
            cancel: '&?',
            detailTitle: '='
        },
        link: function (scope) {
            scope.hide = function () {
                scope.show = false;
                scope.cancel || scope.cancel();
            };
            // 高度计算
            scope.contHeight = function () {
                var page_h = $('body').height();
                var page_w = $('body').width();
                var head_h = $('.header').height();
                var cont_w = page_w - 150;
                $('.js-contheight').css({ 'width': page_w });
                $('.footer-bar').css('width', cont_w);
                //右侧滑动弹窗的内容高度
                var slide_cont_h = page_h - 53 - head_h;
                var detail_info_con2 = page_h - 93;
                var detail_info_con = page_h - 126;
                var detail_info_con3 = page_h - 140;
                $('.slide-cont').css({ 'height': slide_cont_h, 'overflow': 'auto' });
                $('.info-con').css({ 'height': detail_info_con, 'overflow': 'auto' });
                $('.info-con2').css({ 'height': detail_info_con2, 'overflow': 'auto' });
                $('.info-con3').css({ 'height': detail_info_con3, 'overflow': 'auto' });
            };
            scope.showDetail = function () {
                // 展示
                if (!scope.buttons) {
                    scope.buttons = [];
                }
                scope.contHeight();
                $('.slide-cont').scrollTop(0);
            };
            scope.$watch('show', function (n) {
                if (n) {
                    scope.showDetail();
                }
            });
            scope.stopProgration = function (event) {
                event.stopPropagation();
            };
            document.body.onclick = function () {
                if (scope.show) {
                    scope.$apply(function () {
                        scope.hide();
                    });
                }
            };
        }
    };
});