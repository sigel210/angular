// 精简分页组件 2
// author  cwj 
app.registerDirective('pages2', function () {
    return {
        restrict: 'A',
        templateUrl: './js/components/page/template2.html',
        scope: {
            pageIndex: '=',
            pageSize: '=',
            total: '=',
            pageCount: '=',
            pageChange: '&',
            // 可配置项
            pageMaxNo: '=',
            size: '@',
            hideTotal: '@',
            hideQuickPass: '@',
            showSinglePage: '@'
        },
        replace: true,
        link: function (scope, element) {
            scope.quickNo = '';
            // 按钮点击
            scope.changePage = function (index) {
                scope.pageChange({ pageIndex: index });
            };
            // 处理分页
            scope.solvePage = function () {
                
                var i;
                if (scope.pageCount === 0) {

                    scope.hasNextPage = false;
                    scope.pageNumberList = [];
                    // 总页数小于等于最大显示页数时
                } else if (scope.pageCount <= scope.pageNumberListLength) {
                    
                    scope.hasLastPage = false;
                    scope.hasNextPage = false;
                    scope.pageNumberList = [];
                    for (i = 0; i < scope.pageCount; i++) {
                        scope.pageNumberList.push(i + 1);
                    }
                    // 是否还有上一页
                    if (scope.pageIndex > 1) {
                        scope.hasLastPage = true;
                    } else {
                        scope.hasLastPage = false;
                    }
                    // 是否还有下一页
                    if (scope.pageIndex < scope.pageCount) {
                        scope.hasNextPage = true;
                    } else {
                        scope.hasNextPage = false;
                    }
                    // 总页数大于最大显示页数时
                } else if (scope.pageCount > scope.pageNumberListLength) {
                    
                    // 页数小于
                    var pageNumberListLengthHalf = Math.ceil(scope.pageNumberListLength / 2);
                    scope.pageNumberList = [];
                    if (scope.pageIndex <= pageNumberListLengthHalf) {
                        for (i = 0; i < scope.pageNumberListLength; i++) {
                            scope.pageNumberList.push(i + 1);
                        }
                    } else if (scope.pageIndex > scope.pageCount - pageNumberListLengthHalf) {
                        for (i = scope.pageCount - scope.pageNumberListLength; i < scope.pageCount; i++) {
                            scope.pageNumberList.push(i + 1);
                        }
                    } else {
                        for (i = scope.pageIndex - pageNumberListLengthHalf; i < scope.pageIndex + pageNumberListLengthHalf - 1; i++) {
                            scope.pageNumberList.push(i + 1);
                        }
                    }
                    // 是否还有上一页
                    if (scope.pageIndex > 1) {
                        scope.hasLastPage = true;
                    } else {
                        scope.hasLastPage = false;
                    }
                    // 是否还有下一页
                    if (scope.pageIndex < scope.pageCount) {
                        scope.hasNextPage = true;
                    } else {
                        scope.hasNextPage = false;
                    }
                }
            };
            scope.init = function () {
                scope.pageNumberListLength = scope.pageMaxNo ? parseInt(scope.pageMaxNo) : 5;
                scope.hasLastPage = false;
                scope.hasNextPage = false;
                scope.total = 0;
                scope.pageNumberList = [];
            };
            scope.init();
            // 监听分页变化
            scope.$watch('pageIndex', function (n) {
                if (n) {
                    scope.solvePage();
                }
            });
            scope.$watch('pageCount',function(n){
                if(n){
                    scope.solvePage();
                }
            })
        }
    };
});