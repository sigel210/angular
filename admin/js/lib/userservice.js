app.service('UserService', ['$Ajax', '$q', function ($Ajax, $q) {
    var _this = this;
    this.userInfo = {
        userId: 0,
        funcs: [],
        productFunction: [],
    };

    // 检测是否包含该权限
    // 如果flag设置为true，则如果没有该权限则跳到登录页，用于防止用户模块页随便填写导致的权限越界
    this.hasPermission = function (functionId, flag) {
        if (this.userInfo.funcs && this.userInfo.funcs.length > 0) {
            var has = this.userInfo.funcs.indexOf(functionId);
            if (has === -1) {
                if (flag) {
                    window.location.href = 'login.html';
                } else {
                    return false;
                }
            } else {
                return true;
            }
        }
    };
    this.isNewMoulde = function (version) {
        var v = '';
        v = parseInt(sessionStorage.getItem('version').split('-').join(''));
        if (v > version) {
            return false;
        } else {
            return true;
        }
    };

    this.setUserId = function (id) {
        _this.userInfo.userId = id;
    };
    this.getUserId = function () {
        return _this.userInfo.userId;
    };
    // 设置用户信息（权限）
    this.setUserInfo = function (data) {
        _this.userInfo.funcs = data;
    };
    this.initFunction = function () {
        var defer = $q.defer();
        var url = window.location.href.split('/admin')[0] + '/index.php?s=' + 'Pub/Index/myNode';
        $Ajax.get(url).then(
            function (res) {
                if (res.data.code) {
                    defer.resolve(res.data.data);
                } else {
                    window.location.href = 'login.html';
                }
            });
        return defer.promise;
    };
    // 获取用户信息（权限）
    this.getUserInfo = function () {
        var url = window.location.href.split('/admin')[0] + '/index.php?s=' + 'Pub/Index/myNode';
        $Ajax.get(url).then(
            function (res) {
                if (res.data.code) {
                    _this.userInfo.funcs = res.data.data;
                } else {
                    window.location.href = 'login.html';
                }
            }
        );
    };
    this.getAllNode = function () {
        var url = window.location.href.split('/admin')[0] + 'Pub/Index/allNode';
        $Ajax.get(url).then(
            function (res) {
                if (res.data.code) {
                    //_this.userInfo.funcs = res.data.data;
                } else {
                    window.location.href = 'login.html';
                }
            }
        );
    };
    // 返回用户权限信息
    this.getUserFuncs = function () {
        return this.userInfo.funcs;
    };

    // 存储用户可执行业务线
    this.setProductFuncs = function (data) {
        this.userInfo.productFunction = data;
    };
    // 获取用户可执行业务线
    this.getProductFuncs = function () {
        return this.userInfo.productFunction;
    };
}]);