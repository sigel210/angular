app.service('CommonService', ['$q', function ($q) {
    // 获取学员状态
    this.getStudentStatus = function () {
        return [{ id: '100', name: '未执行' }, { id: '200', name: '执行中' }, { id: '300', name: '退款中' }, { id: '400', name: '已执行' }, { id: '500', name: '已终止' }];
    };
    // 获取业务线映射,获取权限下业务线
    this.getOperates = function () {
        return [{ id: '1', name: '淘宝培训' }, { id: '2', name: '天猫培训' }, { id: '4', name: '爱柚营销' }, { id: '8', name: '黑曼营销' }];
    };
    // 成熟度
    this.getLevels = function () {
        return [{ id: '1', name: '0类' }, { id: '2', name: '1类' }, { id: '3', name: '2类' }, { id: '4', name: '3+类' }, { id: '5', name: '3-类' }, { id: '6', name: '4类' }, { id: '7', name: '5类' }, { id: '8', name: 'XO类' }];
    };
    //职位
    this.getPosition = function () {
        return [{ position_id: '1', name: '总经理' }, { position_id: '2', name: '销售支持' }, { position_id: '3', name: '总经理助理' },
        { position_id: '4', name: '副总经理' }, { position_id: '5', name: '总监' }, { position_id: '6', name: '经理' },
        { position_id: '7', name: '主管' }, { position_id: '8', name: '销售' }, { position_id: '9', name: '辅导员' }, { position_id: '10', name: '法务' }];
    };
    //折扣
    this.getDiscountList = function () {
        return [{ 'dis_id': '10', 'dis_name': '无折扣' },
        { 'dis_id': '9', 'dis_name': '9折' },
        { 'dis_id': '8', 'dis_name': '8折' },
        { 'dis_id': '7', 'dis_name': '7折' },
        { 'dis_id': '6', 'dis_name': '6折' },
        { 'dis_id': '5', 'dis_name': '5折' },
        { 'dis_id': '4', 'dis_name': '4折' },
        { 'dis_id': '3', 'dis_name': '3折' },
        { 'dis_id': '2', 'dis_name': '2折' },
        { 'dis_id': '1', 'dis_name': '1折' },
        { 'dis_id': '0', 'dis_name': '免费' }];
    };
    //职级
    this.getPositionList = function () {
        return [{ position_name: 'L1', position_id: '1' }, { position_name: 'L2', position_id: '2' }, { position_name: 'L3', position_id: '3' }, { position_name: 'L4', position_id: '4' },
        { position_name: 'L5', position_id: '5' }, { position_name: 'L6', position_id: '6' }, { position_name: 'L7', position_id: '7' }, { position_name: 'L8', position_id: '8' },
        { position_name: 'D1', position_id: '9' }, { position_name: 'D2', position_id: '10' }, { position_name: 'D3', position_id: '11' }, { position_name: 'D4', position_id: '12' },
        { position_name: 'D5', position_id: '13' }, { position_name: 'D6', position_id: '14' }, { position_name: 'D7', position_id: '15' }, { position_name: 'D8', position_id: '16' }];
    };
    //周期
    this.getCycleList = function () {
        return [
            { cycle_id: '1', cycle_name: '1个月' }, { cycle_id: '2', cycle_name: '2个月' }, { cycle_id: '3', cycle_name: '3个月' },
            { cycle_id: '4', cycle_name: '4个月' }, { cycle_id: '5', cycle_name: '5个月' }, { cycle_id: '6', cycle_name: '6个月' },
            { cycle_id: '7', cycle_name: '7个月' }, { cycle_id: '8', cycle_name: '8个月' }, { cycle_id: '9', cycle_name: '9个月' },
            { cycle_id: '10', cycle_name: '10个月' }, { cycle_id: '11', cycle_name: '11个月' }, { cycle_id: '12', cycle_name: '12个月' }];
    };
    //客户类型
    this.getCustomerType = function () {
        return [
            { type_id: '1', type_name: '淘宝' }, { type_id: '2', type_name: '天猫' }, { type_id: '3', type_name: '企业' }
        ];
    };
    // 学历列表
    this.getEducationList = function () {
        return [{ id: '0', name: '无' }, { id: '1', name: '小学' }, { id: '2', name: '初中' }, { id: '3', name: '高中' }, { id: '4', name: '中专' }, { id: '5', name: '大专' }, { id: '6', name: '本科及以上' }];
    };
    // sex
    this.getSexList = function () {
        return [{ id: '1', name: '男' }, { id: '2', name: '女' }];
    };
    // 合同类型
    this.getcontractType = function () {
        return [{ id: '1', name: '标准合同' }, { id: '2', name: '非标合同' }, { id: '3', name: '电子合同' }];
    };
    // 从数组中获取指定某个元素的某个属性值
    this.searchValueFromArray = function (value, array, keyName, valueName) {
        keyName = keyName || 'id';
        valueName = valueName || 'name';
        if (!array) {
            return false;
        }
        for (var i = 0, l = array.length; i < l; i++) {
            if (array[i][keyName] == value) {
                return array[i][valueName];
            }
        }
    };
    // 筛选数组数据用于提交
    this.filterArray = function (allArray, array, key, params) {
        var result = [];
        result = allArray.filter(function (v) {
            return array.indexOf(v[key]) != -1;
        });
        if (params) {
            result = result.map(function (v) {
                var temp = {};
                for (var i = 0; i < params.length; i++) {
                    temp[params[i]] = v[params[i]];
                }
                return temp;
            });
        }
        return result;
    };

    // 时间加月
    this.addMonth = function (originDate, num) {
        var month1 = originDate.getMonth();
        var today = originDate.getDate();
        var date = originDate.setMonth(month1 + num, today);
        var res = new Date(date);
        return res;
    };
    // 时间加天
    this.addDay = function (originDate, num) {
        var date1 = originDate.getDate();
        var date = originDate.setDate(date1 + num);
        var res = new Date(date);
        return res;
    };
    // mock 返回数据
    this.mockData = function (data, message, code, success) {
        return {
            code: code || 200,
            message: message || '',
            data: data || null,
            suceess: success
        };
    };
    // Mock 接口
    // err boolean 是否需要返回错误信息
    // time 返回用时
    // normalWay boolean 是否是传入标准的返回模型
    this.mockXHR = function (res, url, req, filter, err, time, normalWay) {
        var deferred = $q.defer();
        console.log('url:' + url);
        console.log('req:' + req);
        if (!normalWay) {
            res = {
                data: {
                    code: 200,
                    message: err ? '操作失败' : '操作成功',
                    data: res || null,
                    success: true
                }
            };
        }
        // 筛选，纯数字为精确匹配。
        if (filter) {
            res.data = res.data.filter(
                function (v) {
                    for (var item in filter) {
                        if (!Number.isNaN(v[item])) {
                            if (v[item] != filter[item]) {
                                return false;
                            }
                        } else {
                            if (v[item].toString().indexOf(filter[item] == -1)) {
                                return false;
                            }
                        }
                    }
                    return true;
                }
            );
        }
        setTimeout(function (req, res, err) {
            if (err) {
                console.log(res);
                deferred.reject(res);
            } else {
                console.log(res);
                deferred.resolve(res);
            }
        }, time || 500, req, res, err);
        return deferred.promise;
    };

    // 在不同环境中替换特训营的ProductId
    this.replaceTeXunProductId = function (id) {
        id = parseInt(id);
        switch (id) {
            case 10152: return 'zhizhuan';
            case 10153: return 'zhisou';
            case 10154: return 'kefu';
            case 10155: return 'shijue';
            case 10156: return 'yunying';
            case 10151: return 'yingxiao';
        }
    };
    //清空属性值未‘-’
    this.replaceNone = function (target) {
        var call = function (aim) {
            for (q in aim) {
                if (aim[q] instanceof Object) {
                    for (w in aim[q]) {
                        if (aim[q][w] == '-') {
                            aim[q][w] = null;
                        }
                    }
                } else if (aim[q] instanceof Array) {
                    call(aim[q]);
                } else if (aim[q] == '-') {
                    aim[q] = null;
                }
            }
        };
        call(target);
        return target;
    };
}]);
app.service('CommonNetService', ['$q', '$rootScope', '$Ajax', function ($q, $rootScope, $Ajax) {
    var http = $rootScope.http;
    // 获取主营类目下拉
    this.getCategories = function () {
        var url = http + '/Pub/DropDown/categoryWithTitle';
        return $Ajax.get(url);
    };
    // 获取省级列表
    this.getProvinceList = function (id) {
        if (!id) {
            id = 1;
        }
        var url = http + '/Pub/DropDown/area&level=' + id;
        return $Ajax.get(url);
    };
    // 获取市级列表
    this.getCityList = function (id) {
        var url = http + '/Pub/DropDown/area&level=2&parent_id=' + id;
        return $Ajax.get(url);
    };
    /* 获取审批类型 */
    this.getApprovalTypeList = function () {
        var url = http + '/Operation/JyhFhbCheck/approvalTypeList';
        return $Ajax.get(url);
    };
    /* 获取产品线 */
    this.getProductLineList = function () {
        var url = http + 'Pub/DropDown/productLineList';
        return $Ajax.get(url);
    };
    /* 获取销售下拉 */
    this.getSellerTeamList = function (req) {
        var url = http + '/Pub/DropDown/sellerList';
        return $Ajax.post(url, req);
    };
    /* 获取部门下拉 */
    this.getDepartmentList = function () {
        var url = http + '/Pub/DropDown/getMarketDeptList';
        return $Ajax.get(url);
    };

    /* 获取产品 */
    this.getProductList = function (id) {
        var url = http + '/Pub/DropDown/product&parent_id=' + id + '&level=' + 3;
        return $Ajax.get(url);
    };
    // 获取所有产品，复选用
    this.getAllProductList = function () {
        var url = http + '/Pub/DropDown/thirdProductList';
        return $Ajax.get(url);
    };
    /* 获取业务线 */
    this.getOperateList = function () {
        var url = http + '/Crm/index/myDb';
        return $Ajax.get(url);
    };
    //获取业务线权限---订单新建
    this.insertOperateLine = function (req) {
        var url = http + '/Crm/Order/getFirstProduct&operate_pid=' + req;
        return $Ajax.get(url);
    };
    //
    this.getSecondProductList = function (req) {
        var url = http + '/Crm/Order/getClassList&first_product_id=' + req;
        return $Ajax.get(url);
    };
    /* 获取团队 */
    this.getTeamList = function (req) {
        var url = http + '/Pub/DropDown/getDeptList&department_id=' + req;
        return $Ajax.get(url);
    };
    /* 获取销售团队 */
    this.getMarketDeptList = function (req) {
        var url = http + '/Pub/DropDown/getMarketDeptList&department_id=' + req;
        return $Ajax.get(url);
    };
    /* 获取销售列表 */
    this.getSaleList = function (req) {
        var url = http + '/Pub/DropDown/getSellerOfDept&department_id=' + req;
        return $Ajax.get(url);
    };
    /* 获取班次列表 */
    this.getClass = function (req) {
        var url = http + '/Pub/DropDown/getClass&third_product_id=' + req;
        return $Ajax.get(url);
    };
    /* 获取所有班次列表,如果有参数则跟均产品线做筛选 */
    this.getClassListAll = function (req) {
        var url = http + '/Pub/DropDown/classSearchDown&';
        if (req) {
            url += 'second_product_id=' + req;
        }
        return $Ajax.get(url);
    };
    /* 渠道下拉 */
    this.getChannelList = function () {
        return $Ajax.get(http + '/Pub/DropDown/channelList');
    };
    this.getInstitutionsList = function () {
        return $Ajax.get(http + '/Pub/DropDown/institutions');
    };
    /*产品线产品复选二级联动*/
    //选择产品线 =》 产品
    this.linkage = function (data, list) {//data:产品线ng-model绑定的，list：所有产品列表
        var arr = [];
        if (data.length) {
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < list.length; j++) {
                    if (list[j].parent_id == data[i].yw_product_id) {
                        arr.push(list[j]);
                    }
                }
            }
        } else {
            arr = list;
        }
        return arr;
    };
    //选择产品 =》 产品线
    this.linkage0 = function (data, list, id) {//data:产品ng-model绑定，list：所有产品线下拉列表，id：产品线ng-model绑定
        if (!id.length) {
            var arr = [];
            if (data.length) {
                var parent_id = data[0].parent_id;
                for (var j = 0; j < list.length; j++) {
                    if (list[j].yw_product_id == data[0].parent_id) {
                        arr.push(list[j]);
                    }
                }
                for (var i = 1; i < data.length; i++) {
                    if (parent_id != data[i].parent_id) {
                        parent_id = data[i].parent_id;
                        for (var m = 0; m < list.length; m++) {
                            if (list[m].yw_product_id == data[i].parent_id) {
                                arr.push(list[m]);
                            }
                        }
                    }
                }
            }
            return arr;
        }
    };
    /*产品线产品单选二级联动*/
    //选择产品线 =》 产品
    this.linkageSingel = function (data, list) {
        var arr = [];
        if (data) {
            for (var j = 0; j < list.length; j++) {
                if (list[j].parent_id == data.yw_product_id) {
                    arr.push(list[j]);
                }
            }
        } else {
            arr = list;
        }
        return arr;
    };
    //选择产品 =》 产品线
    this.linkageSingel0 = function (data, list) {//data:产品ng-model绑定，list：所有产品线下拉列表，id：产品线ng-model绑定
        var id = {};
        if (data) {
            for (var i = 0; i < list.length; i++) {
                if (list[i].yw_product_id == data.parent_id) {
                    id = list[i];
                }
            }
        }
        return id;
    };
    /*end产品线产品二级联动*/
}]);
app.service('dataFilter', function () {
    function timeChange(date, mode) {
        if (isFirefox = navigator.userAgent.indexOf('Firefox') > 0) {
            if (new Date(date) != 'Invalid Date') {
                date = new Date(date);
            } else {
                date = date.toString().replace(/-/g, '\\');
                date = date.toString().replace(/ /g, '\\');
                date = date.toString().replace(/:/g, '\\');
                date = date.toString().split('\\');
                date = new Date(date[0], date[1] - 1, date[2], date[3], date[4], date[5]);
            }
        }
        if (isSafari = navigator.userAgent.indexOf('Safari') > 0) {
            date = date.toString().replace(/-/g, '\/');
        }

        ///格式日期
        Date.prototype.format = function (format) {
            var o = {
                'M+': this.getMonth() + 1, //月份
                'd+': this.getDate(), //日
                'h+': this.getHours(), //小时
                'm+': this.getMinutes(), //分
                's+': this.getSeconds(), //秒
                'q+': Math.floor((this.getMonth() + 3) / 3), //季度
                'S': this.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp('(' + k + ')').test(format)) format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
            return format;

            /* if (/(y+)/.test(format)) {
             format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
             }
             for (var k in o) {
             if (new RegExp('(' + k + ')').test(format)) {
             format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
             }
             }
             return format;*/
        };

        /*
         * date: 传入时间
         *
         * mode可以是以下类似的格式
         * yy-MM-dd hh:mm:ss
         * yy/MM/dd hh:mm:ss
         * yy-MM-dd
         */
        return date ? new Date(date).format(mode) : '';

    }
    //时间格式转换
    this.timeFormat = function (date, mode) {
        return timeChange(date, mode);
    };
    //将日期格式化 例如 date格式为2017年7月 格式化为 2017-7
    this.formattingDate = function (date) {
        var this_time = date;
        var this_year = this_time.substring(0, 4);
        var this_month = '';
        this_time.length == 7 ? this_month = '0' + this_time.substring(5, 6) : this_month = this_time.substring(5, 7);
        this_time = this_year + '-' + this_month;
        return this_time;
    };
    //获取当前年月  例如2017年7月
    this.presentMonth = function (type) {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var time;
        if (!type) {
            time = year + '年' + month + '月';
        } else {
            time = year + '-' + month;
        }
        return time;
    };
    //获取当前月份第一天和最后一天
    /*
     * begin: 传入'start'or'end'
     */
    this.beginMonth = function (begin, mode) {
        //获取一个月的第一天
        function GetCurrentMonthFirst() {
            var date = new Date();
            date.setDate(1);
            return timeChange(date, mode);
        }
        //获取最后一天
        function GetCurrentMonthLast() {
            var date = new Date();
            var currentMonth = date.getMonth();
            var days = new Date(date.getFullYear(), currentMonth + 1, 0).getDate();
            date.setDate(days);
            return timeChange(date, mode);
        }
        if (begin == 'start') {
            return GetCurrentMonthFirst();
        } else if (begin == 'end') {
            return GetCurrentMonthLast();
        } else {
            return '';
        }
    };
    this.getDateBeginOrEnd = function (begin, mode, time) {
        //获取一个月的第一天
        function GetCurrentMonthFirst() {
            var date = new Date(time);
            date.setDate(1);
            return timeChange(date, mode);
        }
        //获取最后一天
        function GetCurrentMonthLast() {
            var date = new Date(time);
            var currentMonth = date.getMonth();
            var days = new Date(date.getFullYear(), currentMonth + 1, 0).getDate();
            date.setDate(days);
            return timeChange(date, mode);
        }
        if (begin == 'start') {
            return GetCurrentMonthFirst();
        } else if (begin == 'end') {
            return GetCurrentMonthLast();
        } else {
            return '';
        }
    };

    // 获取选中周开始日期
    this.weekstart = function (time, mode) {
        var select_time = time ? new Date(time) : new Date();
        var weekday = [7, 1, 2, 3, 4, 5, 6];
        var today_week = weekday[new Date(time).getDay()] || weekday[new Date().getDay()];
        select_time.setDate(select_time.getDate() - (today_week - 1));
        return timeChange(select_time, mode);
    };
    // 获取选中周结束日期
    this.weekend = function (time, mode) {
        var select_time = time ? new Date(time) : new Date();
        var weekday = [7, 1, 2, 3, 4, 5, 6];
        var today_week = weekday[new Date(time).getDay()] || weekday[new Date().getDay()];
        select_time.setDate(select_time.getDate() + (7 - today_week));
        return timeChange(select_time, mode);
    };


});
