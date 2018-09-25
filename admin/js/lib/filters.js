// 学员状态
app.filter('studentStatus', function () {
    return function (status) {
        status = parseInt(status);
        switch (status) {
            case 0:
                return '未执行';
            case 100:
                return '未执行';
            case 200:
                return '执行中';
            case 300:
                return '退款中';
            case 400:
                return '已执行';
            case 500:
                return '已终止';
        }
    };
});
app.filter('paymentMethod', function () {
    return function (status) {
        status = parseInt(status);
        switch (status) {
            case 1:
                return '天下网商支付宝';
            case 2:
                return '天下网商银行卡';
            case 3:
                return '淘大培训支付宝';
            case 4:
                return '淘大培训银行卡';
            default:
                return '-';
        }
    };
});

/* 退款渠道 */
app.filter('refundChannelFilter', function () {
    return function (status) {
        status = parseInt(status);
        switch (status) {
            case 1:
                return '支付宝';
            case 2:
                return '银行';
            case 3:
                return '其他';
            default:
                return '';
        }
    };
});
app.filter('sex', function () {
    return function (status) {
        status = parseInt(status);
        switch (status) {
            case 1:
                return '男';
            case 2:
                return '女';
        }
    };
});
app.filter('educational', function () {
    return function (status) {
        status = parseInt(status);
        switch (status) {
            case 0:
                return '无';
            case 1:
                return '小学';
            case 2:
                return '初中';
            case 3:
                return '高中';
            case 4:
                return '中专';
            case 5:
                return '大专';
            case 6:
                return '本科及以上';
        }
    };
});
app.filter('logStatus', function () {
    return function (status) {
        status = parseInt(status);
        switch (status) {
            case 100:
                return '待提交';
            case 112:
                return '待提交';
            case 110:
                return '资质审核中';
            case 111:
                return '资质审核中';
            case 210:
                return '待对账';
            case 220:
                return '对账成功';
            case 300:
                return '执行中';
            case 400:
                return '退款中';
            case 410:
                return '退款中';
            case 420:
                return '已终止';
            case 1000:
                return '已完结';
        }
    };
});
app.filter('discount', function () {
    return function (discount) {
        discount = parseInt(discount);
        switch (discount) {
            case 0:
                return '免费';
            case 1:
                return '1折';
            case 2:
                return '2折';
            case 3:
                return '3折';
            case 4:
                return '4折';
            case 5:
                return '5折';
            case 6:
                return '6折';
            case 7:
                return '7折';
            case 8:
                return '8折';
            case 9:
                return '9折';
            case 10:
                return '无折扣';
        }
    };
});

app.filter('lengthLimit', function () {
    return function (str, num) {
        if (str && str.length > num) {
            return str.substring(0, num) + '...';
        } else {
            return str;
        }
    };
});
//小数后取位数（未测试）
/* app.filter('pointLength', function () {
 return function (str, num) {
 var pointIndex = str.toString().indexOf(".");
 if(pointIndex != -1){
 if (str && str.length > pointIndex+num) {
 return str.substring(0, pointIndex+num) + '...'
 }else {
 var text =str.substring(0, pointIndex+num);
 for(var index=0;index<pointIndex+num-str.length;index++){
 text=text+'0';
 }
 str= text;
 return str;
 }  
 }else{
 var text =str.substring(0, str.length+num);
 for(var index=0;index<num;index++){
 text=text+'0';
 }
 str= text;
 return str;
 }
 
 };
 }); */

app.filter('lengthCut', function () {
    return function (str, num) {
        if (str && str.length > num) {
            return str.substring(0, num);
        } else {
            return str;
        }
    };
});



app.filter('templateStatus', function () {
    return function (status) {
        status = parseInt(status);
        switch (status) {
            case 0:
                return '无效';
            case 1:
                return '有效';
        }
    };
});

app.filter('isTrueOrFalse', function () {
    return function (status) {
        status = parseInt(status);
        switch (status) {
            case 0:
                return '否';
            case 1:
                return '是';
        }
    };
});
app.filter('hasDataOrNot', function () {
    return function (status) {
        status = parseInt(status);
        switch (status) {
            case 0:
                return '否';
            case 1:
                return '是';
            case 2:
                return '';
        }
    };
});
app.filter('hasDataOrNot2', function () {
    return function (status) {
        status = parseInt(status);
        switch (status) {
            case 0:
                return '无';
            case 1:
                return '有';
            case 2:
                return '';
        }
    };
});
app.filter('stringTruncation', function () {
    return function (text, length) {
        if (text) {
            text = text.toString();
            if (text.length && text.length > length) {
                return text.substring(0, length) + '...';
            } else {
                return text;
            }
        }
    };
});

app.filter('cutString', function () {
    return function (text, length) {
        if (text) {
            text = text.toString();
            if (text.length && text.length > length) {
                return text.substring(0, length);
            } else {
                return text;
            }
        }
    };
});
app.filter('dateFormat', function () {
    return function (date, num) {
        if (date == '0000-00-00 00:00:00') {
            return '';
        } else if (!date) {
            return '';
        } else {
            return date.substring(0, num);
        }
    };
});
app.filter('timeFormat', function () {
    return function (data, mode) {
        if ((isFirefox = navigator.userAgent.indexOf('Firefox') > 0)) {
            if (new Date(data) != 'Invalid Date') {
                data = new Date(data);
            } else {
                data = data.replace(/-/g, '\\');
                data = data.replace(/ /g, '\\');
                data = data.replace(/:/g, '\\');
                data = data.split('\\');
                data = new Date(
                        data[0],
                        data[1] - 1,
                        data[2],
                        data[3],
                        data[4],
                        data[5]
                        );
            }
        }

        if ((isSafari = navigator.userAgent.indexOf('Safari') > 0)) {
            data = data.replace(/-/g, '/');
        }

        ///格式日期
        Date.prototype.format = function (format) {
            if ((isFirefox = navigator.userAgent.indexOf('Firefox') > 0)) {
                var o = {
                    'M+': this.getMonth() + 1, //month
                    'd+': this.getDate(), //day
                    'h+': this.getHours(), //hour
                    's+': this.getSeconds(), //second
                    'm+': this.getMinutes(), //minute
                    'q+': Math.floor((this.getMonth() + 3) / 3), //quarter
                    S: this.getMilliseconds() //millisecond
                };
            } else {
                var o = {
                    'M+': this.getMonth() + 1, //month
                    'd+': this.getDate(), //day
                    'h+': this.getHours(), //hour
                    's+': this.getSeconds(), //second
                    'm+': this.getMinutes(), //minute
                    'q+': Math.floor((this.getMonth() + 3) / 3), //quarter
                    S: this.getMilliseconds() //millisecond
                };
            }
            if (/(y+)/.test(format)) {
                format = format.replace(
                        RegExp.$1,
                        (this.getFullYear() + '').substr(4 - RegExp.$1.length)
                        );
            }
            for (var k in o) {
                if (new RegExp('(' + k + ')').test(format)) {
                    format = format.replace(
                            RegExp.$1,
                            RegExp.$1.length == 1
                            ? o[k]
                            : ('00' + o[k]).substr(('' + o[k]).length)
                            );
                }
            }
            return format;
        };

        /*
         * data: 传入时间
         *
         * mode可以是以下类似的格式
         * yy-MM-dd hh:mm:ss
         * yy/MM/dd hh:mm:ss
         * yy-MM-dd
         */
        return data ? new Date(data).format(mode) : '';
    };
});
app.filter('propsFilter', function () {
    return function (items, props) {
        var out = [];

        if (angular.isArray(items)) {
            items.forEach(function (item) {
                var itemMatches = false;

                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (
                            item[prop]
                            .toString()
                            .toLowerCase()
                            .indexOf(text) !== -1
                            ) {
                        itemMatches = true;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
});

app.filter('compAccountRole', function () {
    return function (status) {
        status = parseInt(status);
        switch (status) {
            case 0:
                return '普通成员';
            case 1:
                return '老板';
            case 2:
                return '管理员';
        }
    };
});
app.filter('compStatus', function () {
    return function (status) {
        status = parseInt(status);
        switch (status) {
            case 0:
                return '待生效';
            case 1:
                return '使用中';
            case 2:
                return '已过期';
            case 3:
                return '已终止';
        }
    };
});
app.filter('classRank', function () {
    return function (status) {
        status = parseInt(status);
        switch (status) {
            case 1:
                return '孵化班';
            case 2:
                return '进阶班';
            case 3:
                return '精英班';
            case 4:
                return '研修班';
        }
    };
});
app.filter('opClassStatus', function () {
    return function (status) {
        status = parseInt(status);
        switch (status) {
            case 100:
                return '未打单';
            case 110:
                return '打单中';
            case 120:
                return '执行中';
            case 130:
                return '已完结';
        }
    };
});
app.filter('unit', function () {
    return function (status) {
        switch (status) {
            case 'tuwen':
                return '篇';
            case 'zhibo':
                return '场';
            case 'shipin':
                return '个';
        }
    };
});
// 订单对账
app.filter('receivedStatus', function () {
    return function (status) {
        status = parseInt(status);
        switch (status) {
            case 2:
                return '待对账';
            case 1:
                return '对账成功'; //销售
            case 3:
                return '对账成功'; //财务
            default:
                return '待对账';
        }
    };
});
//相关支付信息对账
app.filter('receivedStatus_line', function () {
    return function (status) {
        status = parseInt(status);
        switch (status) {
            case 0:
                return '待对账';
            case 1:
                return '对账成功';
            case 2:
                return '对账失败';
        }
    };
});
//执行状态
app.filter('step_status', function () {
    return function (status) {
        status = parseInt(status);
        switch (status) {
            case 1:
                return '已执行';
            default:
                return '未执行';
        }
    };
});
//产品状态
app.filter('productStatus', function () {
    return function (status) {
        status = parseInt(status);
        switch (status) {
            case 0:
                return '待审核';
            case 50:
                return '审核中';
            case 100:
                return '未执行';
            case 200:
                return '执行中';
            case 300:
                return '冻结中';
            case 400:
                return '已完结';
            case 500:
                return '已终止';
        }
    };
});
// 订单状态
app.filter('orderStatus', function () {
    return function (status) {
        status = parseInt(status);
        switch (status) {
            case 0:
                return '待审核';
            case 50:
                return '审批中';
            case 100:
                return '待执行';
            case 200:
                return '执行中';
            case 300:
                return '退款中';
            case 400:
                return '已完结';
            case 500:
                return '已终止';
        }
    };
});
app.filter('orderStatus3', function () {
    return function (status) {
        status = parseInt(status);
        switch (status) {
            case 0:
                return '待审核';
            case 50:
                return '审批中';
            case 100:
                return '待执行';
            case 200:
                return '执行中';
            case 300:
                return '暂停中';
            case 400:
                return '已完结';
            case 500:
                return '已终止';
        }
    };
});
app.filter('orderStatus2', function () {
    return function (status, refund_status) {
        refund_status = parseInt(refund_status);
        if (refund_status != 0) {
            switch (refund_status) {
                case 10:
                case 20:
                    return '退款中';
                case 30:
                    return '已终止';
            }
        } else {
            status = parseInt(status);
            switch (status) {
                case 0:
                    return '待审核';
                case 50:
                    return '审批中';
                case 100:
                    return '待执行';
                case 200:
                    return '执行中';
                case 300:
                    return '退款中';
                case 400:
                    return '已完结';
                case 500:
                    return '已终止';
            }
        }
    };
});
app.filter('isOld', function () {
    return function (status) {
        status = parseInt(status);
        switch (status) {
            case 0:
                return '新客户';
            case 1:
                return '老客户';
        }
    };
});
app.filter('isNew', function () {
    return function (status) {
        status = parseInt(status);
        switch (status) {
            case 0:
                return '新签';
            case 1:
                return '续签';
        }
    };
});
app.filter('stepStatus', function () {
    return function (status) {
        status = parseInt(status);
        switch (status) {
            case -1:
                return '已冻结';
            case 0:
                return '未执行';
            case 1:
                return '已执行';
            default:
                return '-';
        }
    };
});
app.filter('productDiscount', function () {
    return function (num) {
        if (num == 10) {
            return '无折扣';
        } else {
            return num + '折';
        }
    };
});
// 成熟度筛选cwj
app.filter('levelFilter', function () {
    return function (level_id) {
        switch (level_id) {
            case '0':
                return '';
            case '1':
                return '0类';
            case '2':
                return '1类';
            case '3':
                return '2类';
            case '4':
                return '3+类';
            case '5':
                return '3-类';
            case '6':
                return '4类';
            case '7':
                return '5类';
            case '8':
                return 'XO类';
        }
    };
});

// 客户类型筛选
app.filter('customerTypeFilter', function () {
    return function (type) {
        switch (type) {
            case '1':
                return '淘宝';
            case '2':
                return '天猫';
            case '3':
                return '企业';
        }
    };
});

// 主营类目筛选（愛柚）
app.filter('categoryAy', function () {
    return function (categoryId) {
        categoryId = parseInt(categoryId);
        switch (categoryId) {
            case 1 || 'tuwen':
                return '图文';
            case 2 || 'zhibo':
                return '直播';
            case 3 || 'shipin':
                return '短视频';
            default:
                return '';
        }
    };
});
app.filter('categoryAyName', function () {
    return function (categoryName) {
        switch (categoryName) {
            case 'tuwen':
                return '图文';
            case 'zhibo':
                return '直播';
            case 'shipin':
                return '短视频';
            default:
                return '';
        }
    };
});

// 店铺状态筛选
app.filter('shopStatusFilter', function () {
    return function (status) {
        switch (status) {
            case '2':
                return '已关店';
            case '1':
                return '正常运营';
        }
    };
});
// 售卖状态(愛柚)
app.filter('saleStatusAy', function () {
    return function (status) {
        status = parseInt(status);
        switch (status) {
            case 1:
                return '在售';
            case 2:
                return '停售';
            default:
                return '';
        }
    };
});
app.filter('productFilter', function () {
    return function (type) {
        switch (type) {
            case '1':
                return '淘宝培训';
            case '2':
                return '天猫培训';
            case '4':
                return '爱柚营销';
            case '8':
                return '黑曼营销';
        }
    };
});
app.filter('productId', function () {
    return function (type) {
        type = type.toString();
        switch (type) {
            case '0':
                return '合计';
            case '4':
                return '新爱柚';
            case '5':
                return '在线培训';
            case '6':
                return '线下培训';
            case '8':
                return '黑曼  ';
            case '16':
                return 'PR及其他';
            case '10000':
                return '菁英汇';
            case '10001':
                return '云学院';
            case '10110':
                return '新孵化班';
            case '10101':
                return '玩爆运营';
        }
    };
});

// 审批类型筛选
app.filter('approvalTypeFilter', function () {
    return function (status) {
        switch (status) {
            case '1':
                return '执行申请';
            case '2':
                return '开票申请';
            case '3':
                return '违约退款';
            case '4':
                return '暂存款退款';
            case '5':
                return '订单合同';
            case '6':
                return '变更执行';
            case '7':
                return '补充协议';
            case '8':
                return '解除协议';
            case '9':
                return '赠送审批';
            case '10':
                return '押金退款';
            case '20':
                return '制作审批';
            case '21':
                return '制作审批';
            case '22':
                return '制作审批';
        }
    };
});
//制作内容
app.filter('approvalMakeFilter', function () {
    return function (status) {
        switch (status) {
            case '20':
                return '订单合同';
            case '21':
                return '补充协议';
            case '22':
                return '解除协议';
        }
    };
});
// 支付类型
app.filter('payType', function () {
    return function (status) {
        switch (status) {
            case '0':
                return '-';
            case '1':
                return '定金';
            case '2':
                return '全款';
            case '3':
                return '余款(尾款)';
            case '4':
                return '押金';
            case '5':
                return '预付款';
            case '6':
                return '预付款+押金';
        }
    };
});
// 支付方式
app.filter('payWay', function () {
    return function (status) {
        switch (status) {
            case '1':
                return '支付宝';
            case '2':
                return '银行';
            case '3':
                return '淘大培训支付';
        }
    };
});
// 签约类型
app.filter('signTypeFilter', function () {
    return function (status) {
        switch (status) {
            case '1':
                return '个人签约';
            case '2':
                return '公司签约';
        }
    };
});
// 审核状态
app.filter('approvalStatusFilter', function () {
    return function (status) {
        status = parseInt(status);
        switch (status) {
            case 0:
            case 300:
                return '待审批';
            case 100:
                return '审批中';
            case 200:
                return '审批同意';
        }
    };
});

// 开票用途
app.filter('purposeFilter', function () {
    return function (status) {
        status = parseInt(status);
        switch (status) {
            case 1:
                return '正常';
            case 2:
                return '退款';
            default:
                return '-';
        }
    };
});
// 开票次数
app.filter('tax_num', function () {
    return function (d) {
        if (d) {
            d = parseInt(d);
        } else {
            d = 0;
        }
        switch (d) {
            case 0:
                return '0';
            default:
                return '开票' + d + '次';
        }
    };
});

// 开票类型
app.filter('taxTypeFilter', function () {
    return function (status) {
        status = parseInt(status);
        switch (status) {
            case 1:
                return '专票';
            case 2:
                return '普票';
            default:
                return '-';
        }
    };
});

// 支付对账
app.filter('billStatus', function () {
    return function (status) {
        status = parseInt(status);
        switch (status) {
            case 1:
                return '待对账';
            case 2:
                return '对账成功';
            case 3:
                return '对账失败';
        }
    };
});

//年月
app.filter('formartStrDate', function () {
    return function (period_date_sum) {
        var date = new Date(period_date_sum);
        var formatDate = date.getFullYear() + '年' + (date.getMonth() + 1) + '月';
        return formatDate;
    };
});

//财务-确认营收统计-不含税计算
app.filter('afterTex', function () {
    return function (afterTex_price) {
        var price = Math.floor(afterTex_price / 1.06 * 100) / 100;
        return price;
    };
});

//超出10个不展示
app.filter('tenChar', function () {
    return function (str) {
        var strNew;
        str ? (strNew = str.substring(0, 10)) : (strNew = '');
        return strNew;
    };
});
//字符展示不超过20
app.filter('twentyChar', function () {
    return function (str) {
        var strNew;
        str ? (strNew = str.substring(0, 20)) : (strNew = '');
        return strNew;
    };
});
//字符展示不超过30
app.filter('thirtyChar', function () {
    return function (str) {
        var strNew;
        str ? (strNew = str.substring(0, 30)) : (strNew = '');
        return strNew;
    };
});
//字符展示不超过35
app.filter('thirtyfiveChar', function () {
    return function (str) {
        var strNew;
        str ? (strNew = str.substring(0, 35)) : (strNew = '');
        return strNew;
    };
});
// 订单详情日期筛选
app.filter('orderInfoListDateFilter', function () {
    return function (type) {
        switch (type) {
            case 100:
                return '到单日期';
            case 200:
                return '截止日期';
            case 300:
                return '申请日期';
            case 400:
                return '完结日期';
            case 500:
                return '终止日期';
            default:
                return '到单日期';
        }
    };
});
//客户轨迹
app.filter('customerLogOperate', function () {
    return function (type) {
        switch (type) {
            case '1':
                return '进入私海';
            case '2':
                return '进入公海';
            case '3':
                return '转移';
            case '4':
                return '分配';
            case '5':
                return '进入资源管理部';
            default:
                return '';
        }
    };
});
//支付日志
app.filter('billLogFilter', function () {
    return function (type) {
        switch (type) {
            case '1':
                return '新增';
            case '2':
                return '编辑';
            case '3':
                return '对账成功';
            case '4':
                return '对账失败';
            default:
                return '';
        }
    };
});
// 合同类型
app.filter('constractTypeFilter', function () {
    return function (type) {
        switch (type) {
            case '1':
                return '标准合同';
            case '2':
                return '非标合同';
            case '3':
                return '电子合同';
            default:
                return '-';
        }
    };
});

// 合同类型
app.filter('classStatusFilter', function () {
    return function (type) {
        switch (type) {
            case '100':
                return '未打单';
            case '110':
                return '打单中';
            case '120':
                return '执行中';
            case '130':
                return '完结';
            default:
                return 'error';
        }
    };
});

// 联系方式
app.filter('concatFilter', function () {
    return function (type, number) {
        switch (type) {
            case '1':
                return '电话 |' + number;
            case '2':
                return '微信 |' + number;
            case '3':
                return '旺旺 |' + number;
            case '4':
                return '钉钉 |' + number;
            case '5':
                return 'QQ |' + number;
            case '6':
                return '短信 |' + number;
            default:
                return 'error';
        }
    };
});
// 类型方式
app.filter('noticeTypeFilter', function () {
    return function (type) {
        switch (type) {
            case '1':
                return '法务';
            case '2':
                return '系统';
            case '3':
                return '财务';
            default:
                return 'error';
        }
    };
});

// RMB转大写
app.filter('RMBFilter', function () {
    return function (money) {
        //汉字的数字
        var cnNums = new Array(
                '零',
                '壹',
                '贰',
                '叁',
                '肆',
                '伍',
                '陆',
                '柒',
                '捌',
                '玖'
                );
        //基本单位
        var cnIntRadice = new Array('', '拾', '佰', '仟');
        //对应整数部分扩展单位
        var cnIntUnits = new Array('', '万', '亿', '兆');
        //对应小数部分单位
        var cnDecUnits = new Array('角', '分', '毫', '厘');
        //整数金额时后面跟的字符
        var cnInteger = '整';
        //整型完以后的单位
        var cnIntLast = '元';
        //最大处理的数字
        var maxNum = 999999999999999.9999;
        //金额整数部分
        var integerNum;
        //金额小数部分
        var decimalNum;
        //输出的中文金额字符串
        var chineseStr = '';
        //分离金额后用的数组，预定义
        var parts;
        if (money == '') {
            return '';
        }
        money = parseFloat(money);
        if (money >= maxNum) {
            //超出最大处理数字
            return '';
        }
        if (money == 0) {
            chineseStr = cnNums[0] + cnIntLast + cnInteger;
            return chineseStr;
        }
        //转换为字符串
        money = money.toString();
        if (money.indexOf('.') == -1) {
            integerNum = money;
            decimalNum = '';
        } else {
            parts = money.split('.');
            integerNum = parts[0];
            decimalNum = parts[1].substr(0, 4);
        }
        //获取整型部分转换
        if (parseInt(integerNum, 10) > 0) {
            var zeroCount = 0;
            var IntLen = integerNum.length;
            for (var i = 0; i < IntLen; i++) {
                var n = integerNum.substr(i, 1);
                var p = IntLen - i - 1;
                var q = p / 4;
                var m = p % 4;
                if (n == '0') {
                    zeroCount++;
                } else {
                    if (zeroCount > 0) {
                        chineseStr += cnNums[0];
                    }
                    //归零
                    zeroCount = 0;
                    chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
                }
                if (m == 0 && zeroCount < 4) {
                    chineseStr += cnIntUnits[q];
                }
            }
            chineseStr += cnIntLast;
        }
        //小数部分
        if (decimalNum != '') {
            var decLen = decimalNum.length;
            for (var i = 0; i < decLen; i++) {
                var n = decimalNum.substr(i, 1);
                if (n != '0') {
                    chineseStr += cnNums[Number(n)] + cnDecUnits[i];
                }
            }
        }
        if (chineseStr == '') {
            chineseStr += cnNums[0] + cnIntLast + cnInteger;
        } else if (decimalNum == '') {
            chineseStr += cnInteger;
        }
        return chineseStr;
    };
});

//日志操作
app.filter('operateTypeFilter', function () {
    return function (type) {
        type = parseInt(type);
        switch (type) {
            case 1:
                return '挑入私海';
            case 2:
                return '踢入公海';
            case 3:
                return '私海转移';
            case 4:
                return '公海分配';
            case 5:
                return '进入资管';
            case 6:
                return '个人新增';
            case 7:
                return '主管导入';
            case 8:
                return '资管分配';
            case 9:
                return '基本信息';
            case 10:
                return '自动流出';
            case 11:
                return '资管分配至公海';
            case 12:
                return '资管分配至资管';
            default:
                return 'error';
        }
    };
});
// 财务业绩操作
app.filter('financeTypeFilter', function () {
    return function (type) {
        type = parseInt(type);
        switch (type) {
            case 1:
                return '到账';
            case 2:
                return '违约退款';
            case 5:
                return '暂存款退款';
            default:
                return '';
        }
    };
});
// 风控中心-通告管理-通告状态
app.filter('notice_statusFilter', function () {
    return function (status) {
        switch (status) {
            case '0':
                return '历史数据';
            case '1':
                return '审核中';
            case '2':
                return '已发布';
            default:
                return 'error';
        }
    };
});
//发票类型
app.filter('taxType', function () {
    return function (status) {
        if (status) {
            status = status.toString();
            switch (status) {
                case '0':
                    return '-';
                case '1':
                    return '服务';
                case '2':
                    return '广告';
                case '4':
                    return '杂志';
                default:
                    return 'error';
            }
        }
    };
});
//打单开关
app.filter('onoffType', function () {
    return function (status) {
        if (status) {
            status = status.toString();
            switch (status) {
                case '1':
                    return '关';
                case '2':
                    return '开';
                default:
                    return 'error';
            }
        }
    }
});
//营收类型
app.filter('incomesType', function () {
    return function (status) {
        if (status) {
            status = status.toString();
            switch (status) {
                case '1':
                    return '服务类';
                case '4':
                    return '广告类';
                case '5':
                    return '服务类+广告类';
                default:
                    return '';
            }
        }
    };
});
// 风控中心-纸质协议类型
app.filter('paperTypeFilter', function () {
    return function (status) {
        switch (status) {
            case '1':
                return '订单合同';
            case '2':
                return '变更协议';
            case '3':
                return '解除协议';
            default:
                return '';
        }
    };
});
//物流支付类型
app.filter('logisticPay', function () {
    return function (status) {
        if (status) {
            status = status.toString();
            switch (status) {
                case '1':
                    return '个人';
                case '2':
                    return '公司';
                case '3':
                    return '对方';
                default:
                    return '-';
            }
        }
    };
});

//物流是否要寄回
app.filter('logisticIsback', function () {
    return function (status) {
        if (status) {
            status = status.toString();
            switch (status) {
                case '1':
                    return '是';
                case '0':
                    return '否';
            }
        }
    };
});
//任务状态
app.filter('taskStatus', function () {
    return function (status) {
        switch (status) {
            case '0':
                return '-';
            case '1':
                return '派发中';
            case '10':
                return '制作中';
            case '20':
                return '投放中';
            case '30':
                return '已暂停';
            case '40':
                return '已终止';
            case '50':
                return '已上线';
            default:
                return '';
        }
    };
});
//任务状态
app.filter('taskStatus2', function () {
    return function (status) {
        switch (status) {
            case '0':
                return '-';
            case '1':
                return '派发中';
            case '10':
                return '制作中';
            case '20':
                return '投放中';
            case '30':
                return '已暂停';
            case '40':
                return '已终止';
            case '50':
                return '已制作';
            default:
                return '';
        }
    };
});
//营收类型
app.filter('incomeType', function () {
    return function (status) {
        status = parseInt(status);
        var str = '';
        if ((status & 1) > 0) {
            str += '服务类';
        }
        if ((status & 4) > 0) {
            if (str) {
                str += '/'
            }
            str += '广告类';
        }
        if ((status & 2) > 0) {
            if (str) {
                str += '/'
            }
            str += '杂志类';
        }
        if (str == '') {
            str = '-';
        }
        return str;
    };
});
// 签约类型
app.filter('agreementTypeFilter', function () {
    return function (status) {
        switch (status) {
            case '1':
                return '补充协议';
            case '2':
                return '解除协议';
            case '3':
                return '订单合同';
            default:
                return '';
        }
    };
});
// 合同审核状态
app.filter('contractStatusFilter', function () {
    return function (status) {
        switch (status) {
            case 0:
                return '未发起';
            case 1:
                return '未通过';
            case 2:
                return '通过';
            case 3:
                return '审核中';
            default:
                return '-';
        }
    };
});
//产品售卖状态
app.filter('product_status', function () {
    return function (status) {
        switch (status) {
            case '1':
                return '停售';
            case '2':
                return '售卖';
            default:
                return '-';
        }
    };
});
//内容形态
app.filter('contentType', function () {
    return function (status) {
        switch (status) {
            case '1':
                return '图文';
            case '2':
                return '直播';
            case '3':
                return '短视频';
            default:
                return '-';
        }
    };
});
//视频类型
app.filter('video_Type', function () {
    return function (status) {
        switch (status) {
            case '1':
                return '单品';
            case '2':
                return '内容';
            default:
                return '-';
        }
    };
});
//是否看稿
app.filter('look_Type', function () {
    return function (status) {
        switch (status) {
            case '1':
                return '是';
            case '0':
                return '否';
            default:
                return '-';
        }
    };
});
//直播类型
app.filter('live_Type', function () {
    return function (status) {
        switch (status) {
            case '1':
                return '专场';
            case '2':
                return '混场';
            default:
                return '-';
        }
    };
});
//制作核实
app.filter('isok_make_Type', function () {
    return function (status) {
        switch (status) {
            case '0':
                return '未核实';
            case '1':
                return '已核实';
            default:
                return '-';
        }
    };
});

// 标准合同模板类型
app.filter('temTypeFilter', function () {
    return function (status) {
        switch (status) {
            case '1':
                return '订单合同';
            case '2':
                return '补充协议';
            case '3':
                return '解除协议';
            default:
                return '';
        }
    };
});
// 标准合同模板类型
app.filter('temStatusFilter', function () {
    return function (status) {
        switch (status) {
            case '1':
                return '正常使用';
            case '2':
                return '暂停使用';
            case '3':
                return '删除';
            default:
                return '';
        }
    };
});
app.filter('signStatus', function () {
    return function (status) {
        switch (status) {
            case '0':
                return '未审核';
            case '1':
                return '未通过';
            case '2':
                return '已通过';
            default:
                return '-';
        }
    };
});
app.filter('saleTypeFilter', function () {
    return function (status) {
        switch (status) {
            case '1':
                return '现销';
            case '2':
                return '赊销';
            default:
                return '-';
        }
    };
});
app.filter('orderStatusFilter', function () {//订单派发状态
    return function (status) {
        switch (status) {
            case '10':
                return '待派发';
            case '20':
                return '派发中';
            case '30':
                return '已派发';
            default:
                return '-';
        }
    };
});

//约稿类型
app.filter('draftType', function () {
    return function (status) {
        if (status) {
            status = status.toString();
            switch (status) {
                case '1':
                    return '自主约稿';
                case '2':
                    return '普通约稿';
                case '3':
                    return '招商约稿';
            }
        }
    };
});

//对比核实
app.filter('comparaResponse', function () {
    return function (status) {
        if (status || status == 0) {
            status = status.toString();
            switch (status) {
                case '0':
                    return '对比失败';
                case '1':
                    return '对比成功';
                case '2':
                    return '重复核实';
            }
        }
    };
});
//成本类型
app.filter('costType', function () {
    return function (status) {
        if (status || status == 0) {
            status = status.toString();
            switch (status) {
                case '1':
                    return '制作';
                case '2':
                    return '投放';
            }
        }
    };
});
//押金对账
app.filter('deposit_price_status', function () {
    return function (status) {
        if (status) {
            status = status.toString();
            switch (status) {
                case '0':
                    return '待对账';
                case '1':
                    return '对账成功';
                case '2':
                    return '对账失败';
            }
        }
    };
});
//操作类型
app.filter('optType', function () {
    return function (status) {
        if (status) {
            switch (status) {
                case '1':
                    return '创建';
                case '2':
                    return '更新';
                case '3':
                    return '删除';
            }
        }
    }
});
//是否录音
app.filter('recordFilter', function () {
    return function (status) {
        if (status) {
            status = status.toString();
            switch (status) {
                case '0':
                    return '';
                case '1':
                    return '是';
                case '2':
                    return '否';
                default:
                    return 'error';
            }
        }
    };
});
app.filter('allotStatus', function () {//派发状态
    return function (status) {
        status = parseInt(status);
        switch (status) {
            case 10:
                return '待派发';
            case 20:
                return '已派发';
            default:
                return '-';
        }
    };
});
//视频类型
app.filter('live_type', function () {
    return function (status) {
        switch (status) {
            case '1':
                return '专场';
            case '2':
                return '混场';
            default:
                return '-';
        }
    };
});
//爱柚-基本信息-退款-解除协议
app.filter('isPaper', function () {
    return function (status) {
        switch (status) {
            case '0':
                return '不需要';
            case '1':
                return '需要';
            default:
                return '-';
        }
    };
});