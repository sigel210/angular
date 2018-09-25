//factory fo ajax
app.factory('$Ajax', function ($http, $loading, $prompt) {
    return {
        post: function (url, data) { //method：post

            var promise = $http({
                method: 'post',
                url: url,
                // headers: {
                //   'Content-Type': 'application/x-www-form-urlencoded'
                // },
                withCredentials: true,
                data: data,
            });
            return promise;
        },
        postData: function (url, data, $scope) { //method：post

            var promise = $http({
                method: 'post',
                url: url,
                withCredentials: true,
                timeout: 300000,
                data: data
            })
                .success(function (response, status, headers, config) {

                })
                .error(function (response, status, headers, config) {
                    $prompt.timeout($scope, {
                        data: {
                            code: 404,
                            msg: '网络异常，请稍后再试'
                        }
                    });
                });
            return promise;
        },
        postJson: function (url, data, $scope) { //method：post

            var promise = $http({
                method: 'post',
                url: url,
                withCredentials: true,
                timeout: 300000,
                data: data,
                headers: { 'Content-Type': 'application/json;charset=UTF-8' }
            })
                .success(function (response, status, headers, config) {

                })
                .error(function (response, status, headers, config) {
                    $prompt.timeout($scope, {
                        data: {
                            code: 404,
                            msg: '网络异常，请稍后再试'
                        }
                    });
                });
            return promise;
        },
        get: function (url) { //method：get

            var promise = $http({
                method: 'GET',
                url: url,
                withCredentials: true,
                params: {
                    times: new Date().getTime()
                }
            });
            return promise;
        },
        getlist: function (url, $scope) { //method：get

            var promise = $http({
                url: url,

                withCredentials: true,
                timeout: 300000,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                params: {
                    times: new Date().getTime()
                }
            })
                .success(function (response, status, headers, config) {
                    $loading.hide();
                    $scope.isAjaxError = false;
                    $scope.pageListLoading = false;
                })
                .error(function (response, status, headers, config) {
                    $scope.list = null;
                    $loading.hide();
                    $scope.isAjaxError = true;
                    $scope.pageListLoading = false;
                    $prompt.timeout($scope, {
                        data: {
                            code: 404,
                            msg: '网络异常，请稍后再试'
                        }
                    });
                });
            return promise;
        },
        getList2: function (url, page, filter, $scope, pageConfig) { //method：get
            if (!pageConfig) {
                pageConfig = {
                    page_size: 10
                };
            }
            pageConfig.page_no = page || 1;
            var target = url + '&' + (pageConfig ? $.param(pageConfig) + '&' : '') + (filter ? $.param(filter) : '');
            var promise = $http({
                url: target,

                withCredentials: true,
                timeout: 300000,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                params: {
                    times: new Date().getTime()
                }
            })
                .success(function (response, status, headers, config) {
                    $loading.hide();
                    $scope.isAjaxError = false;
                    $scope.pageListLoading = false;
                })
                .error(function (response, status, headers, config) {
                    $scope.list = null;
                    $loading.hide();
                    $scope.isAjaxError = true;
                    $scope.pageListLoading = false;
                    $prompt.timeout($scope, {
                        data: {
                            code: 404,
                            msg: '网络异常，请稍后再试'
                        }
                    });
                });
            return promise;
        },
        putData: function (url, data, $scope) { //put
            var promise = $http({
                method: 'PUT',
                url: url,
                timeout: 300000,
                data: data
            })
                .success(function (response, status, headers, config) {

                })
                .error(function (response, status, headers, config) {
                    $prompt.timeout($scope, {
                        data: {
                            code: 404,
                            msg: '网络异常，请稍后再试'
                        }
                    });
                });
            return promise;
        },
        fileUpload: function (url, data, $scope) {
            var promise = $http({
                method: 'POST',
                url: url,
                timeout: 300000,
                data: data,
                headers: {
                    'Content-Type': undefined
                },
                transformRequest: function (data) {
                    var formData = new FormData();
                    for (a in data) {
                        formData.append(a, data[a])
                    }
                    return formData;
                }
            })
                .success(function (response, status, headers, config) {

                })
                .error(function (response, status, headers, config) {
                    $prompt.timeout($scope, {
                        data: {
                            code: 404,
                            msg: '网络异常，请稍后再试'
                        }
                    });
                });
            return promise;
        },
        put: function (url, data) { //put
            var promise = $http({
                method: 'PUT',
                url: url,
                data: data
            });
            return promise;
        },
        delete: function (url) { //delete
            var promise = $http({
                method: 'DELETE',
                url: url
            });
            return promise;
        }
    };
});


//factory fo setTime
app.factory('$setTime', function ($http) {
    return {
        set: function () {
            var date = new Date();
            date = new Date(date.getTime() - 24 * 60 * 60 * 1000)
            var month = (date.getMonth() + 1);
            month = month > 9 ? month : '0' + month;
            var day = date.getDate();
            day = day > 9 ? day : '0' + day;
            var year = date.getFullYear();

            var date2 = new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000);
            var year2 = date2.getFullYear();
            var month2 = (date2.getMonth() + 1);
            month2 = month2 > 9 ? month2 : '0' + month2;
            var day2 = date2.getDate();
            day2 = day2 > 9 ? day2 : '0' + day2;

            var endTime = year + '-' + month + '-' + day;
            var startTime = year2 + '-' + month2 + '-' + day2;

            return {
                startTime: startTime,
                endTime: endTime
            }
        },
        setCurrent: function () {
            var date = new Date();
            var month = (date.getMonth() + 1);
            month = month > 9 ? month : '0' + month;
            var day = date.getDate();
            day = day > 9 ? day : '0' + day;
            var year = date.getFullYear();

            var date2 = new Date(date.getTime() - 1 * 24 * 60 * 60 * 1000);
            var year2 = date2.getFullYear();
            var month2 = (date2.getMonth() + 1);
            month2 = month2 > 9 ? month2 : '0' + month2;
            var day2 = date2.getDate();
            day2 = day2 > 9 ? day2 : '0' + day2;

            var endTime = year + '-' + month + '-' + day;
            var startTime = year2 + '-' + month2 + '-' + day2;

            return {
                startTime: startTime,
                endTime: endTime
            }
        },
        setMonth: function () {
            var date = new Date();
            var month = (date.getMonth() + 1);
            month = month > 9 ? month : '0' + month;
            var day = date.getDate();
            day = day > 9 ? day : '0' + day;
            var year = date.getFullYear();

            var endTime = year + '-' + month + '-' + day;
            var startTime = year + '-' + (date.getMonth() ? (date.getMonth() < 10 ? ('0' + date.getMonth()) : date.getMonth()) : 12) + '-' + day;

            return {
                startTime: startTime,
                endTime: endTime
            }
        },
        getNow: function () {
            var objDate = new Date(); //实例一个时间对象；
            var YYYY = objDate.getFullYear();   //获取系统的年；
            var MM = objDate.getMonth() + 1;   //获取系统月份，由于月份是从0开始计算，所以要加1
            var DD = objDate.getDate(); // 获取系统日，
            var hh = objDate.getHours(); //获取系统时，
            var mm = objDate.getMinutes(); //分
            var ss = objDate.getSeconds(); //秒

            MM = MM >= 10 ? MM : '0' + MM;
            DD = DD >= 10 ? DD : '0' + DD;
            hh = hh >= 10 ? hh : '0' + hh;
            mm = mm >= 10 ? mm : '0' + mm;
            ss = ss >= 10 ? ss : '0' + ss;

            return YYYY + '-' + MM + '-' + DD + ' ' + hh + ':' + mm + ':' + ss;
        }
    };
});


//factory fo Modal
app.factory('$Modal', function ($compile, $rootScope, $q) {
    return {
        create: function (obj) { //创建弹窗
            this.pop = document.getElementById(obj.id);
            var len = obj.buttons.length,
                second = false,
                string = '',
                title = obj.title || '',
                text = obj.text || '';

            if (len == 2)
                string = '<button id="buttons2">' + obj.buttons[1].text + '</button>';
            var innerhtml = '<div id="poperDrap"><div class="poper-drap"></div>' +
                '<div class = "pop-div" id="popDiv">' +
                '<div class="pop-header">' + title + '</div>' +
                '<div class="pop-content">' + text + '</div>' +
                '<div class="pop-button">' +
                '<button id="buttons1">' + obj.buttons[0].text + '</button>' +
                string +
                '</div>' +
                '</div></div>';

            this.innerhtml = $compile(innerhtml)(obj.scope);
            angular.element(this.pop).append(this.innerhtml)

            var that = this;
            setTimeout(function () { //事件监听 兼容IE8
                var button1 = document.getElementById('buttons1')
                if (button1.addEventListener)
                    button1.addEventListener('click', obj.buttons[0].ontap);
                else
                    button1.attachEvent('onclick', obj.buttons[0].ontap);

                if (len == 2) {
                    var button2 = document.getElementById('buttons2');
                    if (button2.addEventListener) {
                        if (obj.buttons[1].ontap)
                            button2.addEventListener('click', obj.buttons[1].ontap);
                        else
                            button2.addEventListener('click', function () {
                                that.hide();
                            });
                    } else {
                        if (obj.buttons[1].ontap)
                            button2.attachEvent('onclick', obj.buttons[1].ontap);
                        else
                            button2.attachEvent('onclick', function () {
                                that.hide();
                            });
                    }
                }
            });
        },
        show: function (obj) { //显示弹窗
            if (this.popDiv) {
                this.popDiv = null;
                this.remove();
                this.pop = null;
                this.innerhtml = null;
            }
            this.create(obj);
            this.popDiv = angular.element(document.getElementById('popDiv'));
            this.popDiv.addClass('animation-pop');
        },
        hide: function () { //隐藏弹窗
            var deferred = $q.defer();
            this.popDiv.removeClass('animation-pop');
            this.popDiv.addClass('animation-popout');

            var _this = this;
            setTimeout(function () {
                _this.popDiv = null;
                _this.remove();
                _this.pop = null;
                _this.innerhtml = null;
                deferred.resolve('11');
            }, 500);

            return deferred.promise;
        },
        remove: function () { //移除弹窗
            try {
                this.pop.removeChild(document.getElementById('poperDrap'));
            } catch (e) {

            }
        },
        timeout: function ($scope, res) { //事件弹窗
            var that = this;
            if (res.data.code == 500) {
                this.show({
                    id: 'uiViews',
                    title: '异常',
                    text: res.data.msg,
                    buttons: [{
                        text: '确定',
                        ontap: function () {
                            that.hide();
                        }
                    }],
                    scope: $scope
                });
            } else if (res.data.code == 603) {
                this.show({
                    id: 'uiViews',
                    title: '提示',
                    text: res.data.msg,
                    buttons: [{
                        text: '确定',
                        ontap: function () {
                            window.location = 'login.html';
                        }
                    }],
                    scope: $scope
                });
            } else
                this.show({
                    id: 'uiViews',
                    title: '提示',
                    text: res.data.msg,
                    buttons: [{
                        text: '确定',
                        ontap: function () {
                            that.hide();
                        }
                    }],
                    scope: $scope
                });
        },
        warning: function ($scope, title, message) {
            var that = this;
            this.show({
                id: 'uiViews',
                title: title,
                text: message,
                buttons: [{
                    text: '确定',
                    ontap: function () {
                        that.hide();
                    }
                }],
                scope: $scope
            });
        }
    }
});

//
app.factory('$treeBtnList', function ($compile, $rootScope, $q) {
    return {
        create: function (obj, type) {

        }
    };
});

//factory fo prompt
app.factory('$slider', function ($compile, $rootScope, $q) {
    return {
        create: function (obj, type) { //创建弹窗
            this.pop = document.getElementById(obj.id);

            this.bg = document.getElementById("slider-pop-bg");

            this.bg && this.bg.remove();

            var key = obj.key || null;
            var innerhtml = '<div id="slider-pop-bg" style="overflow: auto;position: fixed;width: 100%;height: 100%;top: 0;right: 0;z-index:79;"></div>';
            if (type == 1)
                innerhtml = '<div class="slider-pop" id="slidePop">' +
                    '<header style="width:100%;height:40px;background: #f1f1f1;text-align: center"><span>批量选择</span>(<span ng-bind="selectLength?selectLength:0"></span>)<img id="btnClose" ng-click="clearList()" src="images/btn_close.png" /></header>' +
                    '<div style="height: 100%;overflow: auto;"><ul style="margin-top: 10px;margin-bottom: 110px;"><li style="margin-right:20px; margin-left:20px;" ng-repeat="item in ' + key + ' "><span ng-bind="item.shopName"></span><span style="float:right" ng-bind="item.amount"></span></li></ul></div>' +
                    '<footer style="position:absolute;bottom:0;padding:0 10px;width:100%;height:44px;background: #f1f1f1;line-height:44px;">累计提现金额￥<span style="color:#fa7778" ng-bind="selectAccount"></span>' +
                    '<button class="btn red btn-foot" ng-class="{grey:!isOpenedApply}" ng-click="sqPopver()" ng-disabled="!isOpenedApply" style="background: #6c7ba6;font-size: 12px;">打款申请</button></footer>' +
                    '</div>';
            else if (type == 3) {
                innerhtml += '<div class="slider-pop" id="slidePop">' +
                    '<header style="width:100%;height:40px;background: #f1f1f1;text-align: center"><span>详细信息</span><img id="btnClose" src="images/btn_close.png" /></header>' +
                    '<div style="height: 100%;overflow: auto;"><ul id="uls" style="margin-bottom: 90px;"><li style="border:0" ng-repeat="item in ' + key + '"><span style="position: absolute;width: 20%;text-align: right;color: #868686;" ng-bind="item.key"></span><span style="width: 80%;text-align: left;position: relative;left: 20%;color: #666666;word-wrap: break-word;padding-right:20px;" ng-bind="item.val"></span></li></ul><div>' +
                    '<footer style="text-align: right;position:absolute;bottom:0;padding:0 10px;width:100%;height:44px;background: #f3f3f3;line-height:44px;border-top:1px solid #d5d5d5;">' +
                    '<button ng-if="withdrawState==6" class="btn btn-foot" ng-click="haltProcess(true)" style="background: #f7f8fa;font-size: 13px;color:#333333;border:1px solid #ccc;padding: 6px 26px;">等待交至银行</button>' +
                    '<button ng-if="withdrawState==1" class="btn btn-foot" ng-click="haltProcess(false)" style="background: #f7f8fa;font-size: 13px;color:#333333;border:1px solid #ccc;padding: 6px 26px;">暂不处理</button>' +
                    '<button class="btn btn-foot" ng-click="showRemarksModal()" style="background: #f7f8fa;font-size: 13px;color:#333333;border:1px solid #ccc;padding: 6px 26px;margin-left: 15px;">编辑</button>' +
                    '</footer>' +
                    '</div>';
            } else if (type == 4) {
                innerhtml += '<div class="slider-pop" id="slidePop">' +
                    '<header style="width:100%;height:40px;background: #f1f1f1;text-align: center"><span>详细信息</span><img id="btnClose" src="images/btn_close.png" /></header>' +
                    '<div style="height: 100%;overflow: auto;"><ul id="uls" style="margin-bottom:' + (parseInt(obj.scope.detailFooter.height) + 40) + 'px;"><li style="border:0;{{item.style}}" ng-repeat="item in ' + key + '" ><hr style="margin:0;padding:0;" ng-if="item.splitLine == true" /><span ng-if="item.show != false" style="position: absolute;width: 20%;text-align: right;color: #868686;" ng-bind="item.key"></span><span style="width: 80%;text-align: left;position: relative;left: 20%;color: #666666;word-wrap: break-word;" ng-if="item.show != false" ng-bind="item.val {{item.dict}}"></span><span style="color:#4492E0;" ng-bind="item.other"></span></li>' +
                    '<li style="padding: 8px;margin: 0;border-radius: 0;border: 0;border-top: 1px solid #cdcdcd;" ng-if="followList.length != 0" >跟进</li>' +
                    '<li style="padding: 0;margin: 0;border-radius: 0;border: 0;border-top: 1px solid #cdcdcd;" ng-repeat="item in followList">' +
                    '<div><span ng-bind="item.createTime | timeFormat:\'yyyy-MM-dd hh:mm:ss\'"></span><span ng-bind="item.username"></span><span style="float:right;"><a style="margin-left: 10px;cursor: pointer;" ng-click="showFollowModal(\'edit\',$index)">编辑</a><a ng-click="deleteFollow($index)" style="margin-left: 10px;cursor: pointer;">删除</a></span></div>' +
                    '<div style="padding: 0 8px" ng-bind="item.content"></div>' +
                    '<div style="padding: 8px"><div style="display: inline-block;width: 100px;height: 100px;" ng-repeat="itemImg in item.pictures">' +
                    '<a href="{{itemImg}}" class="lightbox" rel="record_{{item.recordId}}" ><img ng-src="{{itemImg}}" alt="" style="width: 100%;height: 100%;" /></a>' +
                    '</div></div>' +
                    '</li></ul><div>' +
                    '<footer ng-if="' + obj.scope.detailFooter.show + '" class="detailFooter" >' + obj.scope.detailFooter.content + '</footer>' +
                    '</div>';
            } else if (type == 6) {
                innerhtml += '<div class="slider-pop" id="slidePop">' +
                    '<header style="width:100%;height:40px;background: #f1f1f1;text-align: center"><span>详细信息</span><img id="btnClose" src="images/btn_close.png" /></header>' +
                    '<div style="height: 100%;overflow: auto;"><ul id="uls" style="margin-bottom:' + (parseInt(obj.scope.detailFooter.height) + 40) + 'px;"><li style="border:0;{{item.style}}" ng-repeat="item in ' + key + '" ><hr style="margin:0;padding:0;" ng-if="item.splitLine == true" /><span ng-if="item.show != false" style="position: absolute;width: 20%;text-align: right;color: #868686;" ng-bind="item.key"></span><span style="width: 80%;text-align: left;position: relative;left: 20%;color: #666666;word-wrap: break-word;" ng-if="item.show != false" ng-bind="item.val {{item.dict}}"></span><span style="color:#4492E0;" ng-bind="item.other"></span></li>' +
                    '<ul class="col-sm-12 " style="padding-bottom:100px;">' +
                    '<li class="jurisdiction-li clearfix" ng-repeat="item in functionList">' +
                    '<span class="col-sm-6 text-left" ng-bind="item.name"></span>' +
                    '<span class="col-sm-6 text-right color-gray" ><vg ng-if="item.query">查看</vg><vg ng-if="item.query && item.oper">、</vg><vg ng-if="item.oper">操作</vg><vg ng-if="item.manager && item.oper">、</vg><vg ng-if="item.manager">管理</vg>' +
                    '</li>' +
                    '</ul>' +
                    '</ul><div>' +
                    '<footer ng-if="' + obj.scope.detailFooter.show + '" class="detailFooter" >' + obj.scope.detailFooter.content + '</footer>' +
                    '</div>';
            } else if (type == 5) {
                innerhtml += '<div class="slider-pop" id="slidePop">' +
                    '<header style="width:100%;height:40px;background: #f1f1f1;text-align: center"><span>详细信息</span><img id="btnClose" src="images/btn_close.png" /></header>' +
                    '<div style="height: 100%;overflow: auto;"><ul id="uls" style="margin-bottom: 140px;"><li style="border:0" ng-repeat="item in ' + key + '"><span style="position: absolute;width: 20%;text-align: right;color: #868686;" ng-bind="item.key"></span><span style="width: 80%;text-align: left;position: relative;left: 20%;color: #666666;word-wrap: break-word;" ng-bind="item.val"></span></li></ul><div>' +
                    '</div>';
            } else if (type == 7) {
                innerhtml = '<div class="slider-pop" id="slidePop">' +
                    '<header style="width:100%;height:40px;background: #f1f1f1;text-align: center"><span>批量选择</span>(<span ng-bind="selectLength?selectLength:0"></span>)<img id="btnClose" ng-click="clearList()" src="images/btn_close.png" /></header>' +
                    '<div style="height: 100%;overflow: auto;"><ul style="margin-top: 10px;margin-bottom: 110px;"><li style="width: 46%;margin: 5px 2%;display: inline-block;" ng-repeat="item in ' + key + ' "><span ng-bind="item.name"></span></li></ul></div>' +
                    '<footer style="position:absolute;bottom:0;padding:0 10px;width:100%;height:44px;background: #f1f1f1;line-height:44px;">' +
                    '<button class="btn red btn-foot"  ng-click="delAccounts()" style="background: #6c7ba6;font-size: 12px;">删除</button></footer>' +
                    '</div>';
            } else if (type == 8) {
                innerhtml += '<div class="slider-pop" id="slidePop">' +
                    '<header style="width:100%;height:40px;background: #f1f1f1;text-align: center"><span>详细资料</span><img id="btnClose" src="images/btn_close.png" /></header>' +
                    '<div style="height: 100%;overflow: auto;">' +
                    '<ul id="uls" style="margin-bottom:' + (parseInt(obj.scope.detailFooter.height) + 40) + 'px;">' +
                    '<div ng-repeat="obj in ' + key + '">' +
                    '<div class="li-header" style="margin-top: 10px;height: 20px;padding: 0 8px;line-height: 20px;"><span style="width: 4px;height: 100%;background-color: #d5d5d5;display: block;float: left;margin-left: 5px;margin-right: 10px;"></span>{{obj.key}}</div>' +
                    '<li style="border:0;" ng-repeat="item in obj.children"  >' +
                    '<div ng-if="obj.type==1">' +
                    '<hr style="margin:0;padding:0;" ng-if="item.splitLine == true" />' +
                    '<span ng-if="item.show != false" style="position: absolute;width: 20%;text-align: right;color: #868686;" ng-bind="item.key"></span>' +
                    '<span style="width: 80%;text-align: left;position: relative;left: 20%;color: #666666;word-wrap: break-word;" ng-if="item.show != false" ng-bind="item.val {{item.dict}}"></span>' +
                    '<span style="color:#4492E0;" ng-bind="item.other"></span>' +
                    '</div>' +
                    '<div style="border: 1px dashed #999999;background-color: #f2f2f2;margin: 5px 20px;border-radius: 3px;padding: 0 5px;"  ng-if="obj.type==2" >' +
                    '<div style="height: 24px;line-height: 24px;">' +
                    '<span style="float:left;padding: 0 3px;" ng-bind="item.operator"></span>' +
                    '<span style="float:right;padding: 0 3px;" ng-bind="item.operaterTime"></span>' +
                    '</div>' +
                    '<div style="height: 24px;line-height: 24px;">' +
                    '<span style="float:left;padding:  0 3px;" ng-bind="item.type | recordType"></span>' +
                    '<span ng-if="item.type==2" style="float:right;padding: 0 3px;" >以下／日</span>' +
                    '<span style="float:right;padding:  0 3px;" ng-bind="item.newData"></span>' +
                    '<span style="float:right;padding:  0 3px;" >新</span>' +
                    '</div>' +
                    '<div style="height: 24px;line-height: 24px;">' +
                    '<span style="float:left;" ></span>' +
                    '<span ng-if="item.type==2" style="float:right;padding: 0 3px;" >以下／日</span>' +
                    '<span style="float:right;padding: 0 3px;" ng-bind="item.oldData"></span>' +
                    '<span style="float:right;padding: 0 3px;" >旧</span>' +
                    '</div>' +
                    '</div>' +
                    '</li>' +
                    '</div>' +
                    '</ul>' +
                    '<div>' +
                    '<footer ng-if="' + obj.scope.detailFooter.show + '" class="detailFooter" >' + obj.scope.detailFooter.content + '</footer>' +
                    '</div>';
            } else {
                innerhtml += '<div class="slider-pop" id="slidePop">' +
                    '<header style="width:100%;height:40px;background: #f1f1f1;text-align: center"><span>详细信息</span><img id="btnClose" src="images/btn_close.png" /></header>' +
                    '<div style="height: 100%;overflow: auto;"><ul id="uls" style="margin-bottom: 120px;"><li style="border:0" ng-repeat="item in ' + key + '"><span style="position: absolute;width: 20%;text-align: right;color: #868686;" ng-bind="item.key"></span><span style="width: 80%;text-align: left;position: relative;left: 20%;color: #666666;word-wrap: break-word;" ng-bind="item.val"></span></li></ul><div>' +
                    '</div>';
            }

            this.innerhtml = $compile(innerhtml)(obj.scope);
            angular.element(this.pop).append(this.innerhtml);


            var that = this;
            document.getElementById('btnClose').addEventListener('click', function () {
                try {
                    document.getElementById('slider-pop-bg') && document.getElementById('slider-pop-bg').remove();
                    that.hide();
                } catch (e) {
                }

            });
            if (document.getElementById('slider-pop-bg')) {
                document.getElementById('slider-pop-bg').addEventListener('click', function () {
                    try {
                        document.getElementById('slider-pop-bg').remove();
                        that.hideReal();
                    } catch (e) {
                    }
                    ;
                });
            }
        },
        showUnReal: function (obj) {
            if (this.popDiv)
                this.clear();

            this.pop = document.getElementById(obj.id);
            var key = obj.key || null;
            var index = obj.scope.list.indexOf(obj.key);

            if (key.verifyMsg)
                var bloo = true;
            else
                var bloo = false;

            var timeasp = new Date().getTime();

            var hasBuss = key.businesslicenseImage ? true : false,
                width = hasBuss ? 884 : 676;

            var idNumber = key.IDNo ? (key.IDNo.substring(0, 6) + "&nbsp;" + key.IDNo.substring(6, 14) + "&nbsp;" + key.IDNo.substring(14, 18)) : "";

            var innerhtml = '<div id="slider-pop-bg" style="background-color:#000000;opacity:0.5;position: fixed;width: 100%;height: 100%;top: 0;right: 0;z-index:79;"></div>';
            innerhtml += '<div class="slider-pop" id="slidePop" style="width:1020px;">' +
                '<div style="position:relative;min-height: 550px;height: 100%;">' +
                '<header style="width:100%;height:40px;background: #f1f1f1;text-align: center;">' +
                '<span class="tab-span" ng-class="{true:\'active\',false:\' \'}[autType==1]" ng-if="' + (key.IDVerifyState == 0) + '">身份照</span>' +
                '<span class="tab-span" ng-class="{true:\'active\',false:\' \'}[autType==2]" ng-if="' + (key.shopImageVerifyState == 0) + '">店铺照</span>' +
                '<span class="tab-span" ng-class="{true:\'active\',false:\' \'}[autType==3]" ng-if="' + (key.licenseVerifyState == 0) + '">营业执照</span>' +
                '<img id="btnClose" ng-click="clearErrors()" src="images/btn_close.png" />' +
                '</header>' +
                '<div style="width:100%;height:100%;overflow-y: auto;">' +
                '<div style="width: 720px;height: 100%;float:left;padding:20px;margin-bottom: 80px;">' +
                '<div style="height: 420px;background-color: #000;border: 1px solid #cdcdcd;text-align: center;"><img id="selecedImg" width="100%" height="100%" rotate="0" ng-src="{{imgSrc}}" /></div>' +
                '<div style="color: #666666;text-align:right;">' +
                '<i class="view-alloc-iconfont" style="font-size:20px;cursor: pointer;" ng-click="imgRotate(-90)">&#xe605;</i>' +
                '<i class="view-alloc-iconfont" style="font-size:20px;cursor: pointer;margin-left:10px;" ng-click="imgRotate(90)">&#xe604;</i>' +
                '<i class="view-alloc-iconfont" style="font-size:20px;cursor: pointer;margin-left:10px;" ng-click="enlargeImage()">&#xe60d;</i>' +
                '<i class="view-alloc-iconfont" style="font-size:20px;cursor: pointer;margin-left:10px;" ng-click="openImage()">原图</i>' +
                '</div>' +
                '<div style="padding:10px;font-size:16px;color: #666666;">' +
                '<div ng-if=imageSelected=="frontalImage"><span class="col-sm-5" style="text-align: right;">真实姓名</span><span class="col-sm-7">' + key.idName + '</span></div>' +
                '<div ng-if=imageSelected=="frontalImage"><span class="col-sm-5" style="text-align: right;">身份证号</span><span class="col-sm-7">' + idNumber + '</span></div>' +
                '<div ng-if=imageSelected=="businesslicenseImage"><span class="col-sm-5" style="text-align: right;">公司名称</span><span class="col-sm-7">' + key.licenseName + '</span></div>' +
                '<div ng-if=imageSelected=="businesslicenseImage"><span class="col-sm-5" style="text-align: right;">工商注册号</span><span class="col-sm-7">' + key.licenseId + '</span></div>' +
                '<div ng-if=imageSelected=="signImage"><span class="col-sm-5" style="text-align: right;">店铺名称</span><span class="col-sm-7">' + key.shopName + '</span></div>' +
                '<div ng-if=imageSelected=="numberImage"><span class="col-sm-5" style="text-align: right;">店铺地址</span><span class="col-sm-7">' + key.address + '</span></div>' +
                '</div>' +
                '</div>' +
                '<ul style="width: 280px;min-height: 100%;margin-bottom: 80px;padding-top:12px;border-left: 1px solid #cdcdcd;overflow:hidden;" id="uls">' +
                '<li ng-show="autType==1" style="border:0;height: 165px;width: 220px;text-align:center;cursor: pointer;" class="imagebox frontalImage"><img width="100%" height="80%" src="' + key.frontalImage + '?' + timeasp + '" ng-click=changeImgAndMsg("' + key.frontalImage + '?' + timeasp + '",\'frontalImage\') /><span>身份证正面</span></li>' +
                '<li ng-show="autType==1" style="border:0;height: 165px;width: 220px;text-align:center;cursor: pointer;" class="imagebox backImage"><img width="100%" height="80%" src="' + key.backImage + '?' + timeasp + '" ng-click=changeImgAndMsg("' + key.backImage + '?' + timeasp + '",\'backImage\') /><span>身份证反面</span></li>' +
                '<li ng-show="autType==1" style="border:0;height: 165px;width: 220px;text-align:center;cursor: pointer;" class="imagebox handHoldingImage"><img width="100%" height="80%" src="' + key.handHoldingImage + '?' + timeasp + '" ng-click=changeImgAndMsg("' + key.handHoldingImage + '?' + timeasp + '",\'handHoldingImage\') /><span>手持身份证</span></li>' +
                '<li ng-show="autType==2" style="border:0;height: 165px;width: 220px;text-align:center;cursor: pointer;" class="imagebox signImage"><img width="100%" height="80%" src="' + key.signImage + '?' + timeasp + '" ng-click=changeImgAndMsg("' + key.signImage + '?' + timeasp + '",\'signImage\') /><span>门店招牌</span></li>' +
                '<li ng-show="autType==2" style="border:0;height: 165px;width: 220px;text-align:center;cursor: pointer;" class="imagebox numberImage"><img width="100%" height="80%" src="' + key.numberImage + '?' + timeasp + '" ng-click=changeImgAndMsg("' + key.numberImage + '?' + timeasp + '",\'numberImage\') /><span>店铺地址</span></li>' +
                '<li ng-show="autType==2" style="border:0;height: 165px;width: 220px;text-align:center;cursor: pointer;" class="imagebox indoorImage"><img width="100%" height="80%" src="' + key.indoorImage + '?' + timeasp + '" ng-click=changeImgAndMsg("' + key.indoorImage + '?' + timeasp + '",\'indoorImage\') /><span>店铺内景</span></li>' +
                '<li ng-show="autType==3" ng-if=' + hasBuss + ' style="border:0;height: 165px;width: 220px;text-align:center;cursor: pointer;"><img width="100%" height="80%" src="' + key.businesslicenseImage + '?' + timeasp + '" ng-click=changeImgAndMsg("' + key.businesslicenseImage + '?' + timeasp + '",\'businesslicenseImage\') /><span>工商营业执照</span></li>' +
                '</ul>' +
                '</div>' +
                '<footer  ng-if="state!=1" class="footer-img" style="position:absolute;bottom:0;width:100%;height: 40px;border-top: 1px solid #cdcdcd;background: #f1f1f1">' +
                '<span ng-show="state == 4" style="margin-left:15px;color: #666666;line-height: 40px;">操作人:</span>' +
                '<span ng-show="state == 4" style="color: #666666;line-height: 40px;">' + key.verifyUserName + '</span>' +
                '<span ng-show="state == 4" style="margin-left:38px;color: #666666;line-height: 40px;">' + key.verifyTime + '</span>' +
                '<button ng-show="state == 0 && autType==autTypes[0]" class="btn" ng-click=authPause()>暂不处理</button>' +
                '<button class="btn" ng-click=failAcess()>未通过</button>' +
                '<button class="btn tg" ng-click=nextStep(true)>通过</button>' +
                '</footer>' +
                '</div>' +
                '</div>';

            this.innerhtml = $compile(innerhtml)(obj.scope);
            angular.element(this.pop).append(this.innerhtml);


            var that = this;
            document.getElementById('btnClose').addEventListener('click', function () {
                try {
                    document.getElementById('slider-pop-bg') && document.getElementById('slider-pop-bg').remove();
                    that.hideReal();
                } catch (e) {
                }
                ;
            });

            if (document.getElementById('slider-pop-bg')) {
                document.getElementById('slider-pop-bg').addEventListener('click', function () {
                    try {
                        document.getElementById('slider-pop-bg').remove();
                        that.hideReal();
                    } catch (e) {
                    }
                    ;
                });
            }

            this.popDiv = angular.element(document.getElementById('slidePop'));
            this.popDiv.addClass('active');
        },
        showReal: function (obj) {

            if (this.popDiv)
                this.clear();

            this.pop = document.getElementById(obj.id);
            var key = obj.key || null;
            var index = obj.scope.list.indexOf(obj.key);

            if (key.verifyMsg)
                var bloo = true;
            else
                var bloo = false;

            var timeasp = new Date().getTime();

            var hasBuss = key.businesslicenseImage ? true : false,
                width = hasBuss ? 884 : 676;
            var innerhtml = '<div id="slider-pop-bg" style="background-color:#000000;opacity:0.5;position: fixed;width: 100%;height: 100%;top: 0;right: 0;z-index:79;"></div>';
            innerhtml += '<div class="slider-pop" id="slidePop" style="width:1020px;overflow-y: scroll"><div style="position:relative;min-height: 800px;height: 100%;">' +
                '<header style="width:100%;height:40px;background: #f1f1f1;text-align: center"><span>详细信息</span><img id="btnClose" ng-click="clearErrors()" src="images/btn_close.png" /></header>' +
                '<div style="width:100%;height:calc(100% - 40px);">' +
                '<div style="width: 698px;height: 100%;float:left;padding:20px;border-right: 1px solid #cdcdcd;">' +
                '<div style="height: 500px;border: 1px solid #cdcdcd;background-color: #000;text-align: center;"><img rotate="0" id="selecedImg" width="100%" height="100%" ng-src="{{imgSrc}}" /></div>' +
                '<div style="color: #666666;text-align:right;">' +
                '<i class="view-alloc-iconfont" style="font-size:20px;cursor: pointer;" ng-click="imgRotate(-90)">&#xe605;</i>' +
                '<i class="view-alloc-iconfont" style="font-size:20px;cursor: pointer;margin-left:10px;" ng-click="imgRotate(90)">&#xe604;</i>' +
                '<i class="view-alloc-iconfont" style="font-size:20px;cursor: pointer;margin-left:10px;" ng-click="enlargeImage()">&#xe60d;</i>' +
                '<i class="view-alloc-iconfont" style="font-size:20px;cursor: pointer;margin-left:10px;" ng-click="openImage()">原图</i>' +
                '</div>' +
                '<div style="padding: 20px 0;overflow-x: scroll;">' +
                '<ul class="img-ul" style="width:auto;display: inline-flex;">' +
                '<li ng-if=' + (key.frontalImage ? true : false) + '><div style="height:100px;text-align:center;"><img style="border: 1px solid #cdcdcd;" width="100%" height="100%" src="' + key.frontalImage + '?' + timeasp + '" ng-click=changeImg("' + key.frontalImage + '?' + timeasp + '") /><span>身份证正面</span></div></li>' +
                '<li ng-if=' + (key.backImage ? true : false) + '><div style="height:100px;text-align:center;"><img width="100%" height="100%" src="' + key.backImage + '?' + timeasp + '" ng-click=changeImg("' + key.backImage + '?' + timeasp + '") /><span>身份证反面</span></div></li>' +
                '<li ng-if=' + (key.handHoldingImage ? true : false) + '><div style="height:100px;text-align:center;"><img width="100%" height="100%" src="' + key.handHoldingImage + '?' + timeasp + '" ng-click=changeImg("' + key.handHoldingImage + '?' + timeasp + '") /><span>手持身份证</span></div></li>' +
                '<li ng-if=' + (key.signImage ? true : false) + '><div style="height:100px;text-align:center;"><img width="100%" height="100%" src="' + key.signImage + '?' + timeasp + '" ng-click=changeImg("' + key.signImage + '?' + timeasp + '") /><span>门店招牌</span></div></li>' +
                '<li ng-if=' + (key.numberImage ? true : false) + '><div style="height:100px;text-align:center;"><img width="100%" height="100%" src="' + key.numberImage + '?' + timeasp + '" ng-click=changeImg("' + key.numberImage + '?' + timeasp + '") /><span>店铺地址</span></div></li>' +
                '<li ng-if=' + (key.indoorImage ? true : false) + '><div style="height:100px;text-align:center;"><img width="100%" height="100%" src="' + key.indoorImage + '?' + timeasp + '" ng-click=changeImg("' + key.indoorImage + '?' + timeasp + '") /><span>店铺内景</span></div></li>' +
                '<li ng-if=' + (key.shopAddress ? true : false) + '><div style="height:100px;text-align:center;"><img width="100%" height="100%" src="' + key.shopAddress + '?' + timeasp + '" ng-click=changeImg("' + key.shopAddress + '?' + timeasp + '") /><span>店铺地址</span></div></li>' +
                '<li  ng-if=' + hasBuss + ' style="margin-right:0"><div style="height:100px;text-align:center;"><img width="100%" height="100%" src="' + key.businesslicenseImage + '?' + timeasp + '" ng-click=changeImg("' + key.businesslicenseImage + '?' + timeasp + '") /><span>营业执照</span></div></li>' +
                '</ul></div>' +
                '</div>' +
                '<ul style="width: 304px;height: 100%;float: right;" id="uls">' +
                '<div class="" style="border-bottom: 1px solid #d5d5d5;">' +
                '<div class="li-header" style="margin-top: 10px;height: 20px;width: 30%;text-align: right;padding: 0 8px;"><span style="width: 4px;height: 100%;background-color: #d5d5d5;display: block;float: left;margin-left: 15px;"></span>审核信息</div>' +
                '<li style="border:0"><span class="list-name w30 font-bold">审核结果</span><span ' + key.authStatus + ' class="list-value w70 ' + (key.authStatus == 1 ? "" : "font-bold") + '">' + (key.authStatus == 1 ? "审核通过" : "审核未通过") + '</span></li>' +
                '<li style="border:0" ng-if="' + (typeof (key.IDVerifyState) !== "undefined") + '" ><span class="list-name w30 font-bold">身份证</span><span class="list-value w70 ' + (key.IDVerifyState == 1 ? "" : "font-bold") + '">' + (key.IDVerifyState == 1 ? "审核通过" : "审核未通过") + '</span></li>' +
                '<li style="border:0" ng-if="' + (typeof (key.shopImageVerifyState) !== "undefined") + '"><span class="list-name w30 font-bold">店铺照</span><span class="list-value w70 ' + (key.shopImageVerifyState == 1 ? "" : "font-bold") + '">' + (key.shopImageVerifyState == 1 ? "审核通过" : "审核未通过") + '</span></li>' +
                '<li style="border:0" ng-if="' + (typeof (key.licenseVerifyState) !== "undefined") + '"><span class="list-name w30 font-bold">营业执照</span><span class="list-value w70 ' + (key.licenseVerifyState == 1 ? "" : "font-bold") + '">' + (key.licenseVerifyState == 1 ? "审核通过" : "审核未通过") + '</span></li>' +
                '<li style="border:0"><span class="list-name w30">审核时间</span><span class="list-value w70">' + (key.verifyTime || "") + '</span></li>' +
                '<li style="border:0"><span class="list-name w30">审核人员</span><span class="list-value w70">' + (key.verifyUserName || "") + '</span></li>' +
                '</div>' +
                '<div style="border-bottom: 1px solid #d5d5d5;">' +
                '<div class="li-header" style="margin-top: 10px;height: 20px;width: 30%;text-align: right;padding: 0 8px;"><span style="width: 4px;height: 100%;background-color: #d5d5d5;display: block;float: left;margin-left: 15px;"></span>店铺信息</div>' +
                '<li style="border:0"><span class="list-name w30">店铺名称</span><span class="list-value w70">' + (key.shopName || "") + '</span></li>' +
                '<li style="border:0"><span class="list-name w30">营业执照</span><span class="list-value w70">' + (key.licenseId || "") + '</span></li>' +
                '<li style="border:0"><span class="list-name w30">所属城市</span><span class="list-value w70">' + (key.cityName || "") + '</span></li>' +
                '<li style="border:0"><span class="list-name w30">店铺地址</span><span class="list-value w70">' + (key.address || "") + '</span></li>' +
                '</div>' +
                '<div style="border-bottom: 1px solid #d5d5d5;">' +
                '<div class="li-header" style="margin-top: 10px;height: 20px;width: 30%;text-align: right;padding: 0 8px;"><span style="width: 4px;height: 100%;background-color: #d5d5d5;display: block;float: left;margin-left: 15px;"></span>店长信息</div>' +
                '<li style="border:0"><span class="list-name w30">店主名字</span><span class="list-value w70">' + (key.shopKepper || "") + '</span></li>' +
                '<li style="border:0"><span class="list-name w30">身份证号</span><span class="list-value w70">' + (key.IDNo || "") + '</span></li>' +
                '<li style="border:0"><span class="list-name w30">店长电话</span><span class="list-value w70">' + (key.phone || "") + '</span></li>' +
                '</div>' +
                '<div style="border-bottom: 1px solid #d5d5d5;">' +
                '<div class="li-header" style="margin-top: 10px;height: 20px;width: 30%;text-align: right;padding: 0 8px;"><span style="width: 4px;height: 100%;background-color: #d5d5d5;display: block;float: left;margin-left: 15px;"></span>其它信息</div>' +
                '<li style="border:0"><span class="list-name w30">提审时间</span><span class="list-value w70">' + (key.arraignTime || "") + '</span></li>' +
                '</div>' +
                '</ul>' +
                '</div>' +
                '<footer  ng-if="state==0" class="footer-img" style="position:absolute;bottom:0;width:100%;height: 40px;border-top: 1px solid #cdcdcd;background: #f1f1f1">' +
                '<button class="btn" ng-click=nextStep(false)>未通过</button><button class="btn tg" ng-click=nextStep(true)>通过</button></footer></div></div>';

            this.innerhtml = $compile(innerhtml)(obj.scope);
            angular.element(this.pop).append(this.innerhtml);


            var that = this;
            document.getElementById('btnClose').addEventListener('click', function () {
                try {
                    document.getElementById('slider-pop-bg') && document.getElementById('slider-pop-bg').remove();
                    that.hideReal();
                } catch (e) {
                }
                ;
            });

            if (document.getElementById('slider-pop-bg')) {
                document.getElementById('slider-pop-bg').addEventListener('click', function () {
                    try {
                        document.getElementById('slider-pop-bg').remove();
                        that.hideReal();
                    } catch (e) {
                    }
                    ;
                });
            }

            this.popDiv = angular.element(document.getElementById('slidePop'));
            this.popDiv.addClass('active');
        },
        showTransaction: function (obj, type, data) {
            if (this.popDiv) {
                this.clear();
            }
            this.create(obj, type);
            this.popDiv = angular.element(document.getElementById('slidePop'));
            var bankState_ch = "";
            switch (data.withdrawState) {
                case 1:
                    bankState_ch = '等待交至银行';
                    break;
                case 2:
                    bankState_ch = '银行处理中';
                    break;
                case 3:
                    bankState_ch = '银行已到账';
                    break;
                case 4:
                    bankState_ch = '银行处理失败';
                    break;
                case 5:
                    bankState_ch = '银行处理中';
                    break;
                case 6:
                    bankState_ch = '暂不处理';
                    break;
                case 99:
                    bankState_ch = '后台已拦截';
                    break;
            }
            var transaction = '<div class="list-box"><div style="height:17px"><span style="float: left;width: 42%;text-align: right;">提现状态</span><span style="float: left;width: 54%;text-align: left;margin-left:4%;">' + bankState_ch + '</span></div><ul>';

            if (data.applyTime)
                transaction += '<li class="list-li" ><span style="float: left;width: 42%;text-align: right;padding: 0;">商户申请提款</span><span style="padding:0;float: left;width: 54%;text-align: left;margin-left:4%;">' + data.applyTime + '</span></li>';
            if (data.submitToBankTime)
                transaction += '<li class="list-li" ><span style="float: left;width: 42%;text-align: right;padding: 0;">财务提交银行</span><span style="padding:0;float: left;width: 54%;text-align: left;margin-left:4%;">' + data.submitToBankTime + '</span></li>';
            if (data.completeTime)
                transaction += '<li class="list-li" ><span style="float: left;width: 42%;text-align: right;padding: 0;">银行处理完毕</span><span style="padding:0;float: left;width: 54%;text-align: left;margin-left:4%;">' + data.completeTime + '</span></li>';


            transaction += '</ul></div>';
            $('#slidePop').append(transaction);
            this.addclass();
        },
        addclass: function () {
            this.popDiv.addClass('active');
        },
        removeclass: function () {
            this.popDiv.removeClass('active');
            this.popDiv.addClass('figerout');
        },
        show: function (obj, type) { //显示弹窗
            if (this.popDiv) {
                this.clear();
            }
            this.create(obj, type);
            this.popDiv = angular.element(document.getElementById('slidePop'));
            this.addclass();
        },
        hide: function () { //隐藏弹窗
            var deferred = $q.defer();
            try {
                this.removeclass();
                var _this = this;
                setTimeout(function () {
                    _this.clear();
                    deferred.resolve('11');
                }, 500);
            } catch (e) {
            }

            return deferred.promise;
        },
        hideReal: function () {
            var deferred = $q.defer();
            try {
                document.getElementById('slider-pop-bg') && document.getElementById('slider-pop-bg').remove();
                this.popDiv.removeClass('active');
                this.popDiv.addClass('figerout2');
                var _this = this;
                setTimeout(function () {
                    _this.clear();
                    deferred.resolve('11');
                }, 500);
            } catch (e) {
            }

            return deferred.promise;
        },
        remove: function () { //移除弹窗
            try {
                this.pop.removeChild(document.getElementById('slidePop'));
            } catch (e) {
            }
        },
        clear: function () {
            this.popDiv = null;
            this.remove();
            this.pop = null;
            this.innerhtml = null;
        }
    }
});

//factory fo prompt
app.factory('$prompt', function ($compile, $rootScope, $q) {
    return {
        create: function (obj) { //创建弹窗
            this.pop = document.getElementById(obj.id);
            var string = '',
                icon = obj.icon || 'icon-error',
                text = obj.text || '',
                backg = obj.backg || '';

            // var innerhtml = '<div class="prompt-pop ' + backg + '" id="poperDrap"><img width="12px" height="12px" src=' + src + ' /><span>' + text + '</span></div>';

            var innerhtml = '<div class="operation-tips-wrap" id="poperDrap"> ' +
                '<div class="operation-tips ' + backg + '">' +
                '<span>' +
                '<i class="' + icon + '"></i>' + text +
                '</span>' +
                '</div>' +
                '</div>';
            this.innerhtml = $compile(innerhtml)(obj.scope);
            angular.element(this.pop).append(this.innerhtml)

        },
        show: function (obj, moretime) { //显示弹窗
            if (this.popDiv) {
                this.remove();
                this.popDiv = null;
                this.pop = null;
                this.innerhtml = null;
                clearTimeout(this.time);
                this.callback = null;
            }
            this.callback = obj.callback;
            this.create(obj);
            this.popDiv = angular.element(document.getElementById('poperDrap'));
            this.popDiv.addClass('current');

            var that = this;
            if (moretime) {
                this.time = setTimeout(function () {
                    that.hide();
                }, moretime);
            } else {
                this.time = setTimeout(function () {
                    that.hide();
                }, 1000);
            }
        },
        hide: function () { //隐藏弹窗
            var deferred = $q.defer();

            if (this.popDiv) {
                this.popDiv.removeClass('current');
                this.popDiv.addClass('figerout');
                var _this = this;
                setTimeout(function () {
                    _this.remove();
                    _this.popDiv = null;
                    _this.pop = null;
                    _this.innerhtml = null;
                    _this.callback && (_this.callback)();
                    _this.callback = null;
                    deferred.resolve('11');
                }, 500);

                return deferred.promise;
            }

        },
        remove: function () { //移除弹窗
            try {
                this.pop.removeChild(document.getElementById('poperDrap'));
            } catch (e) {

            }
        },
        timeout: function ($scope, res, callback, moretime) { //事件弹窗
            var that = this;
            var d = res;
            if (!d.data) {
                res.data = d;
            }
            if (res.data.code == 1) {
                if (moretime) {
                    this.show({
                        id: 'containers',
                        text: res.data.msg,
                        icon: 'icon-success',
                        // src: 'images/icon-success.png',
                        backg: 'success',
                        callback: callback || null,
                        scope: $scope
                    }, moretime);
                } else {
                    this.show({
                        id: 'containers',
                        text: res.data.msg,
                        icon: 'icon-success',
                        // src: 'images/icon-success.png',
                        backg: 'success',
                        callback: callback || null,
                        scope: $scope
                    });
                }
            } else if (res.data.code == '-103') {
                window.location.href = 'login.html';
            } else {
                if (moretime) {
                    this.show({
                        id: 'containers',
                        text: res.data.msg,
                        icon: 'icon-error',
                        // src: 'images/punish_failed.png',
                        backg: 'tips-orange',
                        callback: callback || null,
                        scope: $scope
                    }, moretime);
                } else {
                    this.show({
                        id: 'containers',
                        text: res.data.msg,
                        icon: 'icon-error',
                        // src: 'images/punish_failed.png',
                        backg: 'tips-orange',
                        callback: callback || null,
                        scope: $scope
                    }, 1000);
                }
            }
        }
    }
});

//confirm
app.factory('$confirm', function ($compile, $rootScope, $q) {
    return {
        create: function (obj) { //创建弹窗
            this.pop = document.getElementById(obj.id);
            var len = obj.buttons.length,
                second = false,
                string = '',
                title = obj.title || '',
                text = obj.text || '';
            remarks = obj.remarks || '';

            // var innerhtml = '<div class="bomb-box" id="bombConfirm">' +
            //     '<div class="bomb-bg"></div>' +
            //     '<div class="bomb-content">' +
            //     '<div class="bomb-box-header">' +
            //     '<span>' + title + '</span>' +
            //     '<img style="cursor: pointer;" id="bombCloseBtn" class="bomb-close" src="images/btn_close.png" >' +
            //     '</div>' +
            //     '<div class="bomb-box-content clearfix">' +
            //     '<div style="width: 15%;float: left;height: 120px;line-height: 120px;">' +
            //     '<i  style="background-image: url(\'images/prompt_tip_icon.png\');background-size: 100% 100%;width: 30px;height: 34px;display: inline-block;vertical-align: -16px;"></i>' +
            //     '</div>' +
            //     '<div style="width: 79%;float: left;height: 120px;text-align: left;padding: 25px 0;">' +
            //     '<div style="height: 40px;line-height: 20px;font-size: 18px;">' + text + '</div>' +
            //     '<div style="color: #666666;">' + remarks + '</div>' +
            //     '</div>' +
            //     '</div>' +
            //     '<div class="bomb-box-footer">' +
            //     '<button class="btn mian-btn" id="confirmButtons1" >' + obj.buttons[0].text + '</button>' +
            //     '<button class="btn" id="confirmButtons2" style="margin-left: 15px;" >' + obj.buttons[1].text + '</button>' +
            //     '</div>';


            //       var innerhtml = '<div style="display: block;" id="bombConfirm" class="modal fade in" tabindex="-1" role="dialog" aria-labelledby="bombConfirmLabel" aria-hidden="false">' +
            //         '<div class="modal-backdrop fade in"></div>' +
            //         '<div class="modal-dialog modal-sm" style="margin-top: -230px;">' +
            //         '<div class="modal-content">' +
            //         '<div class="modal-header">' +
            //         '<div class="btn-close" data-dismiss="modal"><i class="icon-close" id="bombCloseBtn"></i></div>' +
            //         '<h4 class="modal-title" >' + title + '</h4>' +
            //         '</div>' +
            //         '<div class="modal-body text-center">' +
            //         '<div class="confirm-icon-box">' +
            //         '<i  class="confirm-icon"></i>' +
            //         '</div>' +
            //         '<div class="confirm-text-box">' +
            //         '<div class="confirm-text">' + text + '</div>' +
            //         '<div style="color: #666666;">' + remarks + '</div>' +
            //         '</div>' +
            //         '</div>' +
            //         '<div class="modal-footer">' +
            //         '<button type="button" class="btn btn-blue" id="confirmButtons1">' + obj.buttons[0].text + '</button>' +
            //         '<button type="button" class="btn btn-gray" data-dismiss="modal" id="confirmButtons2">' + obj.buttons[1].text + '</button>' +
            //         '</div>' +
            //         '</div>' +
            //         '</div>' +
            //         '</div>';


            var innerhtml = '<div style="display: block;" id="bombConfirm" class="modal fade in" tabindex="-1" role="dialog" aria-labelledby="bombConfirmLabel" aria-hidden="false">' +
                '<div class="modal-backdrop fade in"></div>' +
                '<div class="modal-dialog modal-sm" style="margin-top: -230px;">' +
                '<div class="modal-content">' +
                '<div class="modal-header">' +
                '<div class="btn-close" data-dismiss="modal"><i class="icon-close" id="bombCloseBtn"></i></div>' +
                '<h4 class="modal-title" >' + title + '</h4>' +
                '</div>' +
                '<div class="modal-body text-center">' +
                '<div class="confirm-cont" >' +
                '<div class="confirm-text">' +
                '<p>' + text + '</p>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="modal-footer full-btn-box">' +
                '<button type="button" class="btn btn-blue full-btn"  id="confirmButtons1">' + obj.buttons[0].text + '</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';



            // var innerhtml = '<div class="modal fade in" tabindex="-1" id="bombConfirm" role="dialog" aria-labelledby="bombConfirmLabel" aria-hidden="false" style="display: block;">' + 
            //                 '  <div class="modal-backdrop fade in"></div>' + 
            //                 '  <div class="modal-dialog modal-sm" style="margin-top: -230px;">'
            //                 '    <div class="modal-content">' + 
            //                 '      <div class="modal-header">' + 
            //                 '        <div class="btn-close" data-dismiss="modal"><i class="icon-close"></i></div>' +
            //                 '        <h4 class="modal-title" id="bombConfirmLabel">添加讲师</h4>' +
            //                 '      </div>' +
            //                 '      <div class="modal-body">' + 
            //                 '        <div class="form-wrap add-training-form">' + 
            //                 '123' +
            //                 '        </div>' +
            //                 '      </div>' +
            //                 '      <div class="modal-footer">' +
            //                 '        <button type="button" class="btn btn-blue">确 定</button> ' + 
            //                 '        <button type="button" class="btn btn-gray" data-dismiss="modal">取 消</button>' +
            //                 '      </div>' +
            //                 '    <div>' +
            //                 '  <div>' +
            //                 '  <div>';

            this.innerhtml = $compile(innerhtml)(obj.scope);
            angular.element(this.pop).append(this.innerhtml)

            var that = this;
            setTimeout(function () { //事件监听 兼容IE8
                var button1 = document.getElementById('confirmButtons1')
                if (button1.addEventListener)
                    button1.addEventListener('click', obj.buttons[0].ontap);
                else
                    button1.attachEvent('onclick', obj.buttons[0].ontap);

                var closeButton = document.getElementById('bombCloseBtn')
                if (button1.addEventListener)
                    closeButton.addEventListener('click', function () {
                        that.hide();
                    });
                else
                    closeButton.attachEvent('onclick', function () {
                        that.hide();
                    });

                if (len == 2) {
                    var button2 = document.getElementById('confirmButtons2');
                    if (button2.addEventListener) {
                        if (obj.buttons[1].ontap)
                            button2.addEventListener('click', obj.buttons[1].ontap);
                        else
                            button2.addEventListener('click', function () {
                                that.hide();
                            });
                    } else {
                        if (obj.buttons[1].ontap)
                            button2.attachEvent('onclick', obj.buttons[1].ontap);
                        else
                            button2.attachEvent('onclick', function () {
                                that.hide();
                            });
                    }
                }
            });
        },
        show: function (obj) { //显示弹窗
            if (this.popDiv) {
                this.popDiv = null;
                this.remove();
                this.pop = null;
                this.innerhtml = null;
            }
            this.create(obj);
            this.bombConfirm = angular.element(document.getElementById('bombConfirm'));
            this.popDiv = angular.element(document.getElementById('popDiv'));
            this.popDiv.addClass('animation-pop');
        },
        hide: function () { //隐藏弹窗
            this.bombConfirm.remove();
            var deferred = $q.defer();
            this.popDiv.removeClass('animation-pop');
            this.popDiv.addClass('animation-popout');

            var _this = this;
            setTimeout(function () {
                _this.popDiv = null;
                _this.remove();
                _this.pop = null;
                _this.innerhtml = null;
                deferred.resolve('11');
            }, 500);

            return deferred.promise;
        },
        remove: function () { //移除弹窗
            try {
                this.pop.removeChild(document.getElementById('poperDrap'));
            } catch (e) {

            }
        },
        timeout: function ($scope, res) { //事件弹窗
            var that = this;
            if (res.data.code == 500) {
                this.show({
                    id: 'uiViews',
                    title: '异常',
                    text: res.data.msg,
                    buttons: [{
                        text: '确定',
                        ontap: function () {
                            that.hide();
                        }
                    }],
                    scope: $scope
                });
            } else if (res.data.code == 603) {
                this.show({
                    id: 'uiViews',
                    title: '提示',
                    text: res.data.msg,
                    buttons: [{
                        text: '确定',
                        ontap: function () {
                            window.location = 'login.html';
                        }
                    }],
                    scope: $scope
                });
            } else
                this.show({
                    id: 'uiViews',
                    title: '提示',
                    text: res.data.msg,
                    buttons: [{
                        text: '确定',
                        ontap: function () {
                            that.hide();
                        }
                    }],
                    scope: $scope
                });
        },
        warning: function ($scope, title, message) {
            var that = this;
            this.show({
                id: 'uiViews',
                title: title,
                text: message,
                buttons: [{
                    text: '确定',
                    ontap: function () {
                        that.hide();
                    }
                }],
                scope: $scope
            });
        }
    }
});
//canceal--confirm
app.factory('$confirm_cancel', function ($compile, $rootScope, $q) {
    return {
        create: function (obj) { //创建弹窗
            this.pop = document.getElementById(obj.id);
            var len = obj.buttons.length,
                second = false,
                string = '',
                title = obj.title || '',
                text = obj.text || '';
            remarks = obj.remarks || '';

            if (len == 2) {
                string = '<button type="button" class="btn btn-blue" id="confirmButtons1">' + obj.buttons[0].text + '</button>' + '<button type="button" class="btn btn-cancel" data-dismiss="modal" id="confirmButtons2">' + obj.buttons[1].text + '</button>';
            }
            else {
                string = '<button type="button" class="btn btn-blue full-btn"  id="confirmButtons1">' + obj.buttons[0].text + '</button>';
            }
            var innerhtml = '<div style="display: block;" id="bombConfirm" class="modal fade in" tabindex="-1" role="dialog" aria-labelledby="bombConfirmLabel" aria-hidden="false">' +
                '<div class="modal-backdrop fade in"></div>' +
                '<div class="modal-dialog modal-sm modal-confirm" style="margin-top: -230px;">' +
                '<div class="modal-content">' +
                '<div class="modal-header">' +
                '<div class="btn-close" data-dismiss="modal"><i class="icon-close" id="bombCloseBtn"></i></div>' +
                '<h4 class="modal-title" >' + title + '</h4>' +
                '</div>' +
                '<div class="modal-body text-center">' +
                '<div class="status-icon-box"><img class="status-icon" src="./images/attention-icon.png" alt="alert" /></div>' +
                '<div class="status-text">' + text + '</div>' +
                '</div>' +
                '<div class="modal-footer full-btn-box">' +
                string +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';

            this.innerhtml = $compile(innerhtml)(obj.scope);
            angular.element(this.pop).append(this.innerhtml);

            var that = this;
            setTimeout(function () { //事件监听 兼容IE8
                var button1 = document.getElementById('confirmButtons1')
                if (button1.addEventListener)
                    button1.addEventListener('click', obj.buttons[0].ontap);
                else
                    button1.attachEvent('onclick', obj.buttons[0].ontap);

                var closeButton = document.getElementById('bombCloseBtn')
                if (button1.addEventListener)
                    closeButton.addEventListener('click', function () {
                        that.hide();
                    });
                else
                    closeButton.attachEvent('onclick', function () {
                        that.hide();
                    });

                if (len == 2) {
                    var button2 = document.getElementById('confirmButtons2');
                    if (button2.addEventListener) {
                        if (obj.buttons[1].ontap)
                            button2.addEventListener('click', obj.buttons[1].ontap);
                        else
                            button2.addEventListener('click', function () {
                                that.hide();
                            });
                    } else {
                        if (obj.buttons[1].ontap)
                            button2.attachEvent('onclick', obj.buttons[1].ontap);
                        else
                            button2.attachEvent('onclick', function () {
                                that.hide();
                            });
                    }
                }
            });
        },
        show: function (obj) { //显示弹窗
            if (this.popDiv) {
                this.popDiv = null;
                this.remove();
                this.pop = null;
                this.innerhtml = null;
            }
            this.create(obj);
            this.bombConfirm = angular.element(document.getElementById('bombConfirm'));
            this.popDiv = angular.element(document.getElementById('popDiv'));
            this.popDiv.addClass('animation-pop');
        },
        hide: function () { //隐藏弹窗
            this.bombConfirm.remove();
            var deferred = $q.defer();
            this.popDiv.removeClass('animation-pop');
            this.popDiv.addClass('animation-popout');

            var _this = this;
            setTimeout(function () {
                _this.popDiv = null;
                _this.remove();
                _this.pop = null;
                _this.innerhtml = null;
                deferred.resolve('11');
            }, 500);

            return deferred.promise;
        },
        remove: function () { //移除弹窗
            try {
                this.pop.removeChild(document.getElementById('poperDrap'));
            } catch (e) {

            }
        },
        timeout: function ($scope, res) { //事件弹窗
            var that = this;
            if (res.data.code == 500) {
                this.show({
                    id: 'uiViews',
                    title: '异常',
                    text: res.data.msg,
                    buttons: [{
                        text: '确定',
                        ontap: function () {
                            that.hide();
                        }
                    }],
                    scope: $scope
                });
            } else if (res.data.code == 603) {
                this.show({
                    id: 'uiViews',
                    title: '提示',
                    text: res.data.msg,
                    buttons: [{
                        text: '确定',
                        ontap: function () {
                            window.location = 'login.html';
                        }
                    }],
                    scope: $scope
                });
            } else
                this.show({
                    id: 'uiViews',
                    title: '提示',
                    text: res.data.msg,
                    buttons: [{
                        text: '确定',
                        ontap: function () {
                            that.hide();
                        }
                    }],
                    scope: $scope
                });
        },
        warning: function ($scope, title, message) {
            var that = this;
            this.show({
                id: 'uiViews',
                title: title,
                text: message,
                buttons: [{
                    text: '确定',
                    ontap: function () {
                        that.hide();
                    }
                }],
                scope: $scope
            });
        }
    }
});

//delete--confirm
app.factory('$confirm_delete', function ($compile, $rootScope, $q) {
    return {
        create: function (obj) { //创建弹窗
            this.pop = document.getElementById(obj.id);
            var len = obj.buttons.length,
                second = false,
                string = '',
                title = obj.title || '',
                text = obj.text || '';
            remarks = obj.remarks || '';

            if (len == 2)
                string = '<button id="buttons2">' + obj.buttons[1].text + '</button>';
            var innerhtml = '<div style="display: block;background-color: rgba(204, 204, 204, 1);" id="Confirm_delete" class="modal fade in" tabindex="-1" role="dialog" aria-labelledby="bombConfirmLabel" aria-hidden="false">' +
                '<div class="modal-backdrop fade in"></div>' +
                '<div class="modal-dialog modal-sm modal-confirm" style="margin-top: -230px;">' +
                '<div class="modal-content">' +
                '<div class="modal-header">' +
                '<div class="btn-close" data-dismiss="modal"><i class="icon-close" id="bombCloseBtn"></i></div>' +
                '<h4 class="modal-title" >' + title + '</h4>' +
                '</div>' +
                '<div class="modal-body text-center">' +
                '<div class="status-icon-box"><img class="status-icon" src="./images/attention-icon.png" alt="alert" /></div>' +
                '<div class="status-text">' + text + '</div>' +
                '</div>' +
                '<div class="modal-footer full-btn-box">' +
                '<button type="button" class="btn btn-blue full-btn"  id="confirmButtons1">' + obj.buttons[0].text + '</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';

            this.innerhtml = $compile(innerhtml)(obj.scope);
            angular.element(this.pop).append(this.innerhtml)

            var that = this;
            setTimeout(function () { //事件监听 兼容IE8
                var button1 = document.getElementById('confirmButtons1')
                if (button1.addEventListener)
                    button1.addEventListener('click', obj.buttons[0].ontap);
                else
                    button1.attachEvent('onclick', obj.buttons[0].ontap);

                var closeButton = document.getElementById('bombCloseBtn')
                if (button1.addEventListener)
                    closeButton.addEventListener('click', function () {
                        window.close()
                    });
                else
                    closeButton.attachEvent('onclick', function () {
                        window.close()
                    });
            });
        },
        show: function (obj) { //显示弹窗
            if (this.popDiv) {
                this.popDiv = null;
                this.remove();
                this.pop = null;
                this.innerhtml = null;
            }
            this.create(obj);
            this.bombConfirm = angular.element(document.getElementById('bombConfirm'));
            this.popDiv = angular.element(document.getElementById('popDiv'));
            this.popDiv.addClass('animation-pop');
        },
        hide: function () { //隐藏弹窗
            this.bombConfirm.remove();
            var deferred = $q.defer();
            this.popDiv.removeClass('animation-pop');
            this.popDiv.addClass('animation-popout');

            var _this = this;
            setTimeout(function () {
                _this.popDiv = null;
                _this.remove();
                _this.pop = null;
                _this.innerhtml = null;
                deferred.resolve('11');
            }, 500);

            return deferred.promise;
        },
        remove: function () { //移除弹窗
            try {
                this.pop.removeChild(document.getElementById('poperDrap'));
            } catch (e) {

            }
        },
        timeout: function ($scope, res) { //事件弹窗
            var that = this;
            if (res.data.code == 500) {
                this.show({
                    id: 'uiViews',
                    title: '异常',
                    text: res.data.msg,
                    buttons: [{
                        text: '确定',
                        ontap: function () {
                            that.hide();
                        }
                    }],
                    scope: $scope
                });
            } else if (res.data.code == 603) {
                this.show({
                    id: 'uiViews',
                    title: '提示',
                    text: res.data.msg,
                    buttons: [{
                        text: '确定',
                        ontap: function () {
                            window.location = 'login.html';
                        }
                    }],
                    scope: $scope
                });
            } else
                this.show({
                    id: 'uiViews',
                    title: '提示',
                    text: res.data.msg,
                    buttons: [{
                        text: '确定',
                        ontap: function () {
                            that.hide();
                        }
                    }],
                    scope: $scope
                });
        },
        warning: function ($scope, title, message) {
            var that = this;
            this.show({
                id: 'uiViews',
                title: title,
                text: message,
                buttons: [{
                    text: '确定',
                    ontap: function () {
                        that.hide();
                    }
                }],
                scope: $scope
            });
        }
    }
});

//loading
app.factory('$loading', function ($compile, $rootScope, $q) {
    return {
        create: function () { //加入loading动画
            var innerhtml = '<div class="ball-grid-pulse"> ' +
                '<div></div> ' +
                '<div></div> ' +
                '<div></div> ' +
                '</div> ';
            $('.loading-cont').html(innerhtml);
            $('.loading-cont').show();
        },
        show: function (obj) { //显示弹窗
            this.create(obj);
        },
        hide: function (obj) { //隐藏弹窗
            $('.loading-cont').hide();
        }
    }
});

//chart 数据类型转换
app.factory('$chart', function ($q) {
    return {
        toCategories: function (obj, key1, key2) {

            var deferred = $q.defer();
            var objects = {};
            objects.series = [];

            obj.forEach(function (e) {
                var val = [];
                var date = [];
                e.content.forEach(function (o) {
                    date.push(o[key1]);
                    val.push(o[key2]);
                });
                objects.categories = date;
                objects.series.push({
                    name: e.name,
                    data: val
                });
            });
            //console.log(obj)

            deferred.resolve(objects);
            return deferred.promise;
        },
        drawMap: function (obj, dw) {

            $('#container').highcharts({
                chart: {
                    type: 'spline'
                },
                title: {
                    text: ''
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    categories: obj.categories
                },
                yAxis: {
                    title: {
                        text: ''
                    },
                    labels: {
                        formatter: function () {
                            return this.value
                        }
                    }
                },
                tooltip: {
                    crosshairs: true,
                    shared: true,
                    valueSuffix: dw
                },
                plotOptions: {
                    spline: {
                        marker: {
                            radius: 4,
                            lineColor: '#666666',
                            lineWidth: 1
                        }
                    }
                },
                series: obj.series
            });
        }
    }
});


//factory fo Wrapper
app.factory('$Wrapper', function ($compile, $rootScope, $q) {
    return {
        create: function (obj) { //创建弹窗
            this.pop = document.getElementById(obj.id);
            var innerhtml = '<div id="WrapDrap" style="position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:999">' +
                '<div style="position:relative;top:55%;margin:-300px 0 0 -300px;left:40%;width:825px;height:485px;background:#ffffff;">' +
                '<header style="width:100%;height:40px;background: #f1f1f1;text-align: center">' +
                '<span>未通过原因</span><img id="btnCloss" src="images/btn_close.png" />' +
                '</header>' +
                '<ul style="height: 84%;overflow-y: auto;float:left;width:73%;border-right:1px solid #e5e5e5;">' +
                '<li style="padding: 0 20px;" class="error-list" ng-repeat="item in ' + obj.scopeKey + '">' +
                '<p style="line-height: 36px;" ng-bind="item.name"></p>' +
                '<div>' +
                '<span ng-class="{selected:errorObj[$parent.$index]==s.code}" ng-click=selectError(s.code,$parent.$index) ng-repeat="s in item.content" ng-bind="s.message"></span>' +
                '</div>' +
                '</li>' +
                '</ul>' +
                '<div style="float:right;width:27%;height:83%;padding:15px;">' +
                '<div style="width100%;height:100%;">' +
                '<div style="font-size: 12px;color: #999999;margin-bottom:5px;">其他原因</div>' +
                '<div style="border: 1px solid #e5e5e5;height: 95%;border-radius: 5px;">' +
                '<textarea maxlength="{{errorMaxlength}}" ng-model="otherReason" style="border-radius: 5px;border:0;resize: none;width:100%;height:90%;outline:none"></textarea>' +
                '<div class="text-right" style="color: #999999;padding-right:5px;">' +
                '<span class="nowNumber" ng-bind="nowNumber? nowNumber:0">0</span>' +
                '/' +
                '<span class="maxNumber">20</span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<footer class="footer-img" style="position:absolute;bottom:0;width:100%;height: 40px;border-top: 1px solid #cdcdcd;background: #f1f1f1">' +
                '<button class="btn" id="cancelbtn">取 消</button><button class="btn tg" ng-click="nextStep(false)">确 定</button>' +
                '</footer>' +
                '</div>' +
                '</div>';

            this.innerhtml = $compile(innerhtml)(obj.scope);
            angular.element(this.pop).append(this.innerhtml)

            var that = this;
            document.getElementById('btnCloss').addEventListener('click', function () {
                try {
                    that.hide();
                } catch (e) {
                }
                ;
            });
            document.getElementById('cancelbtn').addEventListener('click', function () {
                try {
                    that.hide();
                } catch (e) {
                }
                ;
            });
        },
        show: function (obj) { //显示弹窗
            if (this.popDiv) {
                this.remove();
                this.popDiv = null;
                this.innerhtml = null;
            }
            this.create(obj);
            this.popDiv = document.getElementById('WrapDrap');
        },
        hide: function () { //隐藏弹窗
            this.remove();
            this.popDiv = null;
            this.innerhtml = null;
        },
        remove: function () { //移除弹窗
            try {
                this.pop.removeChild(this.popDiv);
            } catch (e) {

            }
        }
    }

});
