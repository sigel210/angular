/**
/**
 * Created by yhg97p on 2016/9/11.
 * 登录
 */

var signinModule = angular.module('signinModule', ['ngCookies', 'ngAnimate']);

signinModule.controller('loginCtrl', ['$scope', '$http', '$cookies', '$rootScope', '$timeout', '$cookieStore', function ($scope, $http, $cookies, $rootScope, $timeout, $cookieStore) {
    /*数据模型 start*/
    //加载图片
    // $scope.theme ='duanwu';
    $scope.login_title = $scope.theme ? './images/login/login-title-' + $scope.theme + '.png' : './images/login/login-title.png';
    // $scope.input_shadow=$scope.theme ? './images/login/input-shadow-'+$scope.theme+'.png' : './images/login/input-shadow.png';


    var https = window.location.href.split('/admin');
    $rootScope.http = https[0] + '/public/index.php?s=';
    $scope.tips_advice = '建议使用谷歌浏览器或火狐浏览器';
    $scope.linkbox = {
        show_Llink: false,
        show_Vlink: false,
        show_Vbtn: false,
        toggle: function (e) {
            this.show_Vlink = !this.show_Vlink;
            e.stopPropagation();
        }
    };
    $scope.pageshow = true;
    /*数据模型 edn*/
    /*初始加载 start*/

    /*初始加载 edn*/

    /*函数 start*/
    $scope.myBrowser = function () {
        $scope.aShow = true;
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        var isOpera = userAgent.indexOf('Opera') > -1;
        // if (isOpera) {
        //     return $scope.login_M.advice.show_advice();
        // } //判断是否Opera浏览器
        // if (userAgent.indexOf('Firefox') > -1) {
        //     return 'FF';
        // } //判断是否Firefox浏览器
        // if (userAgent.indexOf('Chrome') > -1) {
        //     return 'Chrome';
        // }
        // if (userAgent.indexOf('Safari') > -1) {
        //     return $scope.login_M.advice.show_advice();
        // } //判断是否Safari浏览器
        // if (userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera) {
        //     return $scope.login_M.advice.show_advice();
        // } //判断是否IE浏览器
        return $scope.login_M.advice.show_advice();
    };
    $scope.forgetPassword = function () {
        $scope.tips_text = '重置密码，请联系资源管理部可可';
        $scope.login_M.tips.show_tips();
    };
    $scope.login_M = {
        if_tips: false,
        if_advice: false,
        login: function () {
            $scope.aShow = true;
            var account = $.trim($scope.userName),
                password = $.trim($scope.password);
            if (!account || !password) {
                $scope.tips_text = '用户名和密码不能为空';
                $scope.login_M.tips.show_tips();
                return false;
            }
            $http({
                url: $rootScope.http + '/commonality/Pub/login',
                method: 'POST',
                data: 'account=' + account + '&password=' + password,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function (res, header, config, status) {
                if (res.code) {
                    var user = {
                        name: res.data.nickname,
                        id: res.data.user_id,
                        org: {
                            id: res.data.department_id
                        },
                        role: {
                            id: res.data.position_id
                        },
                        position_id: res.data.position_id,
                        product_id: res.data.product_id,
                        company_id: res.data.company_id,
                        token: res.data.token
                    };
                    $cookies.user = JSON.stringify(user);
                    sessionStorage.setItem('token', user.token);

                    $scope.goFirstPage();
                } else {
                    $scope.tips_text = res.msg;
                    $scope.login_M.tips.show_tips();
                }
            }).error(function (res, header, config, status) {
                $scope.tips_text = res.msg;
                $scope.login_M.tips.show_tips();
                return false;
            });
        },
        tips: {
            show_tips: function () {
                $scope.login_M.if_tips = true;
                $timeout(function () {
                    $scope.login_M.if_tips = false;
                }, 10000);
            },
            stop_tips: function () {
                $scope.login_M.if_tips = false;
            }
        },
        advice: {
            show_advice: function () {
                $scope.login_M.if_advice = true;
                $timeout(function () {
                    $scope.login_M.if_advice = false;
                }, 10000);
            },
            stop_advice: function () {
                $scope.login_M.if_advice = false;
            }
        }
    };
    var input = document.getElementById('account'),
        oldValue = '';

    input.addEventListener('keydown', function (e) {
        var code = e.keyCode;
        if (code == 13 && $scope.userName && $scope.password) {
            $scope.login_M.login();
        }

    }, false);
    $scope.keyupLogin = function (e) { //发生后于原生js的事件
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && $scope.userName && $scope.password) {
            $scope.login_M.login();
        }
    };
    // 跳转第一页面
    $scope.goFirstPage = function () {
        // var url = window.location.href;
        // window.location.href = url.substring(0, url.lastIndexOf('/')) + '/#/' + 'saleManage';
        // document.title = '赫拉|业务中心';
        // return;
        var url = $rootScope.http + '/commonality/Pub/myNode';
        $http.get(url, {
            headers: { 'Token': sessionStorage.getItem('token') }
        }).then(function (res) {
            if (res.data.data) {
                var url = window.location.href;
                var indexUrl = url.substring(0, url.lastIndexOf('/')) + '/#/';
                if (res.data.data.indexOf(1464) > -1) {
                    window.location.href = indexUrl + 'saleManage';
                    document.title = '赫拉|业务中心';
                    return;
                } else if (res.data.data.indexOf(1457) > -1) {
                    window.location.href = indexUrl + 'operativeManage';
                    document.title = '赫拉|运营中心';
                    return;
                } else if (res.data.data.indexOf(1453) > -1) {
                    window.location.href = indexUrl + 'moneyManage';
                    document.title = '赫拉|财务中心';
                    return;
                } else if (res.data.data.indexOf(1471) > -1) {
                    window.location.href = indexUrl + 'productCenter';
                    document.title = '赫拉|产品中心';
                    return;
                } 

                else {
                    window.location.href = indexUrl + 'error';
                    // location.reload();
                }
            }
        });
    };

    $scope.bg_height = function () {
        $('.login-bg').height($(window).height());
        if ($(window).height() < 672) {
            $scope.linkbox.show_Vbtn = true;
            $scope.linkbox.show_Llink = false;
            $scope.linkbox.show_Vlink = false;
        } else {
            $scope.linkbox.show_Vbtn = false;
            $scope.linkbox.show_Llink = true;
            $scope.linkbox.show_Vlink = false;
        }
    };
    /*函数 edn*/

    /*启动 start*/
    $scope.bg_height();
    $scope.myBrowser();

    $(window).resize(function () {
        $scope.bg_height();
        $scope.$apply();
    });

    /*启动 edn*/
}]);
