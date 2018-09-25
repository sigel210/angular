// 精简分页组件
app.registerDirective('pages', ['$Ajax', '$prompt', '$loading', '$timeout', function ($Ajax, $prompt, $loading, $timeout) {
    return {
        restrict: 'A',
        templateUrl: './js/components/page/template.html',
        scope: {
            pageid:'=?',//page组件编号
            list: '=', // 用于列表数据渲染
            url: '@',  // 请求路径
            filter: '=?', // 筛选项
            page: '=',  // 分页配置 {page_no:1,page_size:10}
            isFirstLoad: '=?',
            // 下面2项不推荐使用。用于控制列表渲染loading。
            ajaxing: '=?', // 传入 pageListLoading
            error: '=?', // 传入 isAjaxError
            callback: '&',  // 回调方法，用于列表后加载
            pageMaxNo: '@', // 用于显示页面按钮数量
            size:'@?',
        },
        replace: true,
        link: function (scope, element) {
            scope.pageid = scope.pageid || '';
            scope.isFirstLoad = scope.isFirstLoad || false;
            scope.pageInputNo = '';
            scope.load = function () {
                scope.ajaxing = true;
                $loading.show();
                $Ajax.getlist(window.location.href.split('/admin')[0] + '/index.php?s=' + scope.url + '&' + (scope.filter ? $.param(scope.filter) + '&' : '') + $.param(scope.page), scope).then(function (res) {
                    $loading.hide();
                    scope.ajaxing = false;
                    scope.error = false;
                    if (res.data.code) {

                        scope.list = res.data.data;
                        if(res.data.allot_amount||res.data.allot_amount==0){
                            if(scope.list){
                                scope.list.allot_amount = res.data.allot_amount;
                            }else{
                                scope.list = [];
                                scope.list.allot_amount = res.data.allot_amount;
                            }
                        }
                        if (res.data.page) {
                            scope.dataCount = parseInt(res.data.page.total);
                            scope.dataPageCount = parseInt(res.data.page.page_total);
                            scope.dataPageNo = parseInt(res.data.page.page_current);
                            //scope.page.page_no = parseInt(res.data.page.page_current);
                        }
                        scope.solvePage();

                        // 执行回调
                        scope.callback({ list: scope.list });

                    } else {
                        $prompt.timeout(scope, res);
                    }
                }, function (res) {
                    scope.error = true;
                });
            };
            scope.changePage = function (index) {
                scope.page.page_no = index;
                scope.load();
            };
            scope.solvePage = function () {
                var i;
                if (scope.dataPageCount === 0) {

                    scope.hasNextPage = false;
                    scope.pageNumberList = [];
                    // 总页数小于等于最大显示页数时
                } else if (scope.dataPageCount <= scope.pageNumberListLength) {
                    scope.hasLastPage = false;
                    scope.hasNextPage = false;
                    scope.pageNumberList = [];
                    for (i = 0; i < scope.dataPageCount; i++) {
                        scope.pageNumberList.push(i + 1);
                    }
                    // 是否还有上一页
                    if (scope.dataPageNo > 1) {
                        scope.hasLastPage = true;
                    } else {
                        scope.hasLastPage = false;
                    }
                    // 是否还有下一页
                    if (scope.dataPageNo < scope.dataPageCount) {
                        scope.hasNextPage = true;
                    } else {
                        scope.hasNextPage = false;
                    }
                    // 总页数大于最大显示页数时
                } else if (scope.dataPageCount > scope.pageNumberListLength) {
                    // 页数小于
                    var pageNumberListLengthHalf = Math.ceil(scope.pageNumberListLength / 2);
                    scope.pageNumberList = [];
                    if (scope.dataPageNo <= pageNumberListLengthHalf) {
                        for (i = 0; i < scope.pageNumberListLength; i++) {
                            scope.pageNumberList.push(i + 1);
                        }
                    } else if (scope.dataPageNo > scope.dataPageCount - pageNumberListLengthHalf) {
                        for (i = scope.dataPageCount - scope.pageNumberListLength; i < scope.dataPageCount; i++) {
                            scope.pageNumberList.push(i + 1);
                        }
                    } else {
                        for (i = scope.dataPageNo - pageNumberListLengthHalf; i < scope.dataPageNo + pageNumberListLengthHalf - 1; i++) {
                            scope.pageNumberList.push(i + 1);
                        }
                    }
                    // 是否还有上一页
                    if (scope.dataPageNo > 1) {
                        scope.hasLastPage = true;
                    } else {
                        scope.hasLastPage = false;
                    }
                    // 是否还有下一页
                    if (scope.dataPageNo < scope.dataPageCount) {
                        scope.hasNextPage = true;
                    } else {
                        scope.hasNextPage = false;
                    }
                }
            };
            scope.init = function () {
                // 兼容如果没配置page信息的情况
                if (!scope.page) {
                    scope.page = {
                        page_no: 1,
                        page_size: 10
                    };
                }
                scope.pageNumberListLength = scope.pageMaxNo ? parseInt(scope.pageMaxNo) : 5;
                scope.hasLastPage = false;
                scope.hasNextPage = false;
                scope.dataCount = 0;
                scope.pageNumberList = [];
                if (scope.isFirstLoad) {
                    scope.load();
                }
            };
            scope.init();
            scope.$on('pageSearch'+scope.pageid, function () {
                scope.load();
            });
        }
    };
}]);