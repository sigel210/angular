var app = angular
    .module('myApp', [
        'ui.router',
        'ngCookies',
        'ngSanitize',
        'ui.select',
        'jQueryScrollbar',
        'ngAnimate',
        'ngClipboard'
    ])
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        '$compileProvider',
        '$controllerProvider',
        'ngClipProvider',
        '$provide',
        '$filterProvider',
        '$httpProvider',
        function (
            $stateProvider,
            $urlRouterProvider,
            $compileProvider,
            $controllerProvider,
            ngClipProvider,
            $provide,
            $filterProvider,
            $httpProvider
        ) {
            $httpProvider.defaults.headers.common = {
                HTTP_X_REQUESTED_WITH: 'xmlhttprequest',
                // 'Token': JSON.parse(unescape(document.cookie).match(/user=(.+)?;/)[1]).token
                Token: sessionStorage.getItem('token')
            };

            app.registerCtrl = $controllerProvider.register;
            app.registerService = $provide.service;
            app.registerDirective = $compileProvider.directive;
            app.registerFilter = $filterProvider.register;
            app.registerFactory = $provide.factory;
            //加版本号为清除js的缓存,版本号格式必须为"-"分隔
            var v = '1-0-0-1';
            sessionStorage.setItem('version', v);
            app.resolveScriptDeps = function (dependencies) {
                return function ($q, $rootScope) {
                    var deferred = $q.defer();
                    var dependencies2 = dependencies;
                    if (Array.isArray(dependencies2)) {
                        for (var i = 0; i < dependencies2.length; i++) {
                            if (dependencies2[i].indexOf('?v=') == -1) {
                                dependencies2[i] += '?v=' + v;
                            }
                        }
                    } else {
                        if (dependencies2.indexOf('?v=') == -1) {
                            dependencies2 += '?v=' + v; //v是版本号
                        }
                    }
                    $script(dependencies2, function () {
                        // all dependencies have now been loaded by $script.js so resolve the promise
                        $rootScope.$apply(function () {
                            deferred.resolve();
                        });
                    });

                    return deferred.promise;
                };
            };
            //ngClip粘贴板
            ngClipProvider.setPath(
                window.location.href.split('/admin/')[0] + '/admin/js/lib/zeroclipboard/ZeroClipboard.swf'
            );
            $stateProvider
                // 财务中心
                .state('moneyManage', {
                    url: '/moneyManage',
                    templateUrl: 'views/moneyManage/moneyManage.html',
                    controller: 'moneyManage',
                    resolve: {
                        deps: app.resolveScriptDeps([
                            'js/controller/moneyManage/moneyManageNet.js',
                            'js/controller/moneyManage/moneyManage.js'
                        ])
                    }
                })
                //财务中心-交易流水列表
                .state('transactionLog', {
                    url: '/transactionLog',
                    templateUrl: 'views/moneyManage/transactions/main.html',
                    controller: 'transactionLog',
                    resolve: {
                        deps: app.resolveScriptDeps([
                            'js/components/page/directive2.js',
                            'js/components/editModal/directive.js',
                            'js/components/detailModal/directive.js',
                            'js/controller/moneyManage/moneyManageNet.js',
                            'js/controller/moneyManage/transactions/controller.js'
                        ])
                    }
                })
                //财务中心-对账上传
                .state('uploadBill', {
                    url: '/uploadBill',
                    templateUrl: 'views/moneyManage/uploadBill/uploadBill.html',
                    controller: 'uploadBill',
                    resolve: {
                        deps: app.resolveScriptDeps([
                            'js/controller/moneyManage/uploadBill/uploadBill.js',
                            'js/controller/moneyManage/uploadBill/net.js'
                        ])
                    }
                })
                // 销售中心
                .state('saleManage', {
                    url: '/saleManage',
                    templateUrl: 'views/saleManage/saleManage.html',
                    controller: 'saleManage',
                    resolve: {
                        deps: app.resolveScriptDeps([
                            'js/controller/saleManage/net.js',
                            'js/controller/saleManage/saleManage.js'
                        ])
                    }
                })
                // 销售中心-到账信息-新增
                .state('billForm', {
                    url:
                        '/billForm/:customer_id/:order_id',
                    templateUrl: 'views/saleManage/billForm.html',
                    controller: 'billForm',
                    resolve: {
                        deps: app.resolveScriptDeps([
                            'js/controller/saleManage/billForm.js'
                        ])
                    }
                })
                // 新建黑曼订单
                .state('hmAdd', {
                    url: '/hmAdd',
                    templateUrl: 'views/saleManage/orderHeiman.html',
                    controller: 'HmAddController',
                    resolve: {
                        deps: app.resolveScriptDeps([
                            'js/controller/saleManage/hm/service.js',
                            'js/controller/saleManage/hm/net.js',
                            'js/controller/saleManage/hm/add/controller.js'
                        ])
                    }
                })
                // 销售中心-到单信息-列表
                .state('orderInformation', {
                    url: '/orderInformation/:operate_pid',
                    templateUrl: 'views/saleManage/orderInformation.html',
                    controller: 'orderInformation',
                    resolve: {
                        deps: app.resolveScriptDeps([
                            'js/components/page/directive2.js',
                            'js/controller/saleManage/net.js',
                            'js/controller/saleManage/orderInformation.js'
                        ])
                    }
                })
                // 运营中心
                .state('operativeManage', {
                    url: '/operativeManage',
                    templateUrl: 'views/operativeManage/operativeManage.html',
                    controller: 'operativeManage',
                    resolve: {
                        deps: app.resolveScriptDeps([
                            'js/controller/operativeManage/operativeManage.js',
                            './js/components/beancurCube/directive.js',
                        ])
                    }
                })
                //运营汇总--执行管理
                .state('executionManage', {
                    url: '/executionManage',
                    templateUrl: 'views/operativeManage/executionManage/main.html',
                    controller: 'executionManage',
                    resolve: {
                        deps: app.resolveScriptDeps([
                            'js/controller/operativeManage/executionManage/controller.js',
                            'js/controller/operativeManage/executionManage/net.js',
                            'js/controller/operativeManage/executionManage/service.js',
                            'js/components/page/directive2.js',
                        ])
                    }
                })
                // 我的客户详情通用页 backup
                // .state('customer', {
                //     url:
                //         '/customer/:customer_id/:operate_pid/:menu_index/:rmenu_index/:resource/:survey_id',
                //     templateUrl: 'views/customer/main.html',
                //     controller: 'customerController',
                //     resolve: {
                //         deps: app.resolveScriptDeps([
                //             'js/components/page/directive.js',
                //             'js/components/allot/directive.js',
                //             'js/components/editModal/directive.js',
                //             'js/controller/customer/services/common.js',
                //             'js/controller/customer/services/customernet.js',
                //             'js/controller/customer/customer.js'
                //         ])
                //     }
                // })
                .state('customer', {
                    url: '/customer/:customer_id/:menu_index',
                    templateUrl: 'views/customer/main.html',
                    controller: 'customerController',
                    resolve: {
                        deps: app.resolveScriptDeps([
                            'js/controller/customer/net.js',
                            'js/controller/customer/main.js'
                        ])
                    }
                })
                .state('customer.order', {
                    url: '/:order_id/:tab_index',
                    templateUrl: 'views/customer/order/main.html',
                    controller: 'CustomerOrderController',
                    resolve: {
                        deps: app.resolveScriptDeps([
                            'js/controller/customer/order/service.js',
                            'js/controller/customer/order/net.js',
                            'js/controller/customer/order/controller.js'
                        ])
                    }
                })

                //产品中心
                .state('productCenter', {
                    url: '/productCenter',
                    templateUrl: 'views/productCenter/productCenter.html',
                    controller: 'productCenter',
                    resolve: {
                        deps: app.resolveScriptDeps([
                            'js/controller/productCenter/productCenter.js',
                            './js/components/beancurCube/directive.js',
                        ])
                    }
                })
                //产品中心-产品管理
                .state('productManagements', {
                    url: '/productManagements',
                    templateUrl: 'views/productCenter/productManagements/productManagements.html',
                    controller: 'productManagements',
                    resolve: {
                        deps: app.resolveScriptDeps([
                            'js/controller/productCenter/productManagements/productManagements.js',
                            'js/components/page/directive2.js',
                            'js/controller/productCenter/productManagements/net.js',
                            'js/controller/productCenter/productManagements/service.js',
                        ])
                    }
                })
                //产品中心-产品管理-新增
                .state('productManagementsAdd', {
                    url: '/productManagementsAdd',
                    templateUrl: 'views/productCenter/productManagements/add/add.html',
                    controller: 'productsAdd',
                    resolve: {
                        deps: app.resolveScriptDeps([
                            'js/controller/productCenter/productManagements/add/add.js',
                            'js/controller/productCenter/productManagements/net.js',
                            'js/controller/productCenter/productManagements/service.js',
                            'js/components/page/directive2.js',
                        ])
                    }
                })
                //产品中心-内容管理
                .state('contentManagements', {
                    url: '/contentManagements',
                    templateUrl: 'views/productCenter/contentManagements/contentManagements.html',
                    controller: 'contentManagements',
                    resolve: {
                        deps: app.resolveScriptDeps([
                            'js/controller/productCenter/contentManagements/contentManagements.js',
                            'js/controller/productCenter/contentManagements/net.js',
                            'js/components/page/directive2.js',
                            'js/components/editModal/directive.js',
                            'js/components/detailModal/directive.js',
                        ])
                    }
                })
                //产品中心-内容新建
                .state('contentAdd', {
                    url: '/contentAdd',
                    templateUrl: 'views/productCenter/contentManagements/add/add.html',
                    controller: 'contentAdd',
                    resolve: {
                        deps: app.resolveScriptDeps([
                            'js/controller/productCenter/contentManagements/add/add.js',
                            'js/controller/productCenter/contentManagements/net.js',
                        ])
                    }
                })
                .state('err', {
                    url: '/error',
                    templateUrl: 'views/noPermission.html'
                });
        }
    ]);

app.config([
    '$httpProvider',
    function ($httpProvider) {
        //去除html缓存
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }

        // 禁用 IE AJAX 请求缓存
        $httpProvider.defaults.headers.get['If-Modified-Since'] =
            'Mon, 26 Jul 1997 05:00:00 GMT';
        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';

        $httpProvider.defaults.headers.put['Content-Type'] =
            'application/x-www-form-urlencoded';
        $httpProvider.defaults.headers.post['Content-Type'] =
            'application/x-www-form-urlencoded';

        // Override $http service's default transformRequest
        $httpProvider.defaults.transformRequest = [
            function (data) {
                /**
                 * The workhorse; converts an object to x-www-form-urlencoded serialization.
                 * @param {Object} obj
                 * @return {String}
                 */
                var param = function (obj) {
                    var query = '';
                    var name, value, fullSubName, subName, subValue, innerObj, i;

                    for (name in obj) {
                        value = obj[name];

                        if (value instanceof Array) {
                            for (i = 0; i < value.length; ++i) {
                                subValue = value[i];
                                fullSubName = name + '[' + i + ']';
                                innerObj = {};
                                innerObj[fullSubName] = subValue;
                                query += param(innerObj) + '&';
                            }
                        } else if (value instanceof Object) {
                            for (subName in value) {
                                subValue = value[subName];
                                fullSubName = name + '[' + subName + ']';
                                innerObj = {};
                                innerObj[fullSubName] = subValue;
                                query += param(innerObj) + '&';
                            }
                        } else if (value !== undefined && value !== null) {
                            query +=
                                encodeURIComponent(name) +
                                '=' +
                                encodeURIComponent(value) +
                                '&';
                        }
                    }

                    return query.length ? query.substr(0, query.length - 1) : query;
                };

                return angular.isObject(data) && String(data) !== '[object File]'
                    ? param(data)
                    : data;
            }
        ];
    }
]);
app.directive('timeModule', function () {
    return {
        restrict: 'A',
        scope: {
            data_value: '=timeValue'
        },
        link: function (scope, element, attr) {
            element.bind('click', function () {
                if (attr.isShowClear == 'false') {
                    attr.isShowClear = false;
                } else if (attr.isShowClear == 'true') {
                    attr.isShowClear = true;
                }
                if (attr.isShowToday == 'false') {
                    attr.isShowToday = false;
                } else if (attr.isShowToday == 'true') {
                    attr.isShowToday = true;
                }
                var _config = {
                    elem: attr.id,
                    fmt: attr.format != undefined && attr.format != '' ? attr.format : 'yyyy-MM-dd HH:mm:ss',
                    max: attr.hasOwnProperty('maxDate') ? attr.maxDate : '',
                    min: attr.hasOwnProperty('minDate') ? attr.minDate : '',
                    isShowClear: attr.hasOwnProperty('isShowClear') ? attr.isShowClear : true,
                    isShowToday: attr.hasOwnProperty('isShowToday') ? attr.isShowToday : true
                };
                //插件配置
                window.WdatePicker({
                    el: _config.elem,
                    skin: 'twoer',
                    dateFmt: _config.fmt,
                    minDate: _config.min,
                    maxDate: _config.max,
                    enableKeyboard: false,
                    enableInputMask: false,
                    isShowClear: _config.isShowClear,
                    isShowToday: _config.isShowToday,
                    onpicking: function () {
                        scope.$apply(function () {
                            scope.data_value = element.val();
                        });
                    },
                    onpicked: function () {
                        scope.$apply(function () {
                            scope.data_value = element.val();
                            element.blur();
                        });
                    },
                    onclearing: function () {
                        scope.$apply(function () {
                            scope.data_value = element.val();

                        });
                    },
                    oncleared: function () {
                        scope.$apply(function () {
                            scope.data_value = element.val();
                            element.blur();
                        });

                    }
                });
            });

            // element.bind('keyup',function(){
            //     scope.$apply(function () {
            //         scope.data_value = element.val();
            //         //绑定搜索
            //         document.onkeydown = function (e) {
            //             var ev = document.all ? window.event : e;
            //             if (ev.keyCode == 13) {
            //                 element.blur();
            //             }
            //         };
            //     })
            // });
            // element.bind('focus',function(){
            //     scope.$apply(function () {
            //         scope.data_value = element.val();
            //     })
            // })

        }
    };
});
angular.element(document).ready(function () {
    var url =
        window.location.href.split('/admin')[0] +
        '/public/index.php?s=' +
        '/commonality/Pub/myNode';
    $.ajax({
        url: url,
        headers: { Token: sessionStorage.getItem('token') },
        type: 'GET',
        dataType: 'json',
        success: function (res) {
            var app = angular.module('myApp');
            app.run([
                'UserService',
                function (UserService) {
                    UserService.setUserInfo(res.data);
                }
            ]);
            angular.bootstrap(document, ['myApp']);
        },
        error: function (res) {
            console.log(res);
            window.location.href = 'login.html';
        }
    });
});
