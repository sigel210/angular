// 注册服务
app.registerService('CustomerService', function () {
    //校验审核状态三选一
    this.checkApprovalStatus = function (status, type, array) {
        if (status == '100') {
            // 特定审核校验
            if (array && array.indexOf(type) == -1) {
                return false;
            }
            switch (type) {
                case '1': return '资质审核';
                case '2': return '开票审核';
                case '3': return '退款审核';
                default: return false;
            }
        } else {
            return false;
        }
    };
    this.checkBillUpdate = function (data, product_id) {
        if (data.sale_type != 2 && data.price == '') {
            return '请输入支付金额';
        } else if (
            (data.pay_way != '3') &&
            data.pay_name == ''
        ) {
            return '请输入付款人';
        } else if (
            data.trade_no == '' &&
            data.payway == 1
        ) {
            return '请输入交易号';
        } else if (
            data.trade_no == '' &&
            data.pay_way == '3'
        ) {
            return '请输入订单号';
        } else if (
            data.trade_no != '' &&
            data.pay_way == '3'
        ) {
            if (
                !(
                    /[a-zA-Z]/.test(data.trade_no) &&
                    /\d/.test(data.trade_no)
                )
            ) {
                return '订单号必须包含数字和字母';
            } else {
                return '';
            }
        } else if (data.pay_type == '' && data.sale_type == 2 && product_id == 10217) {
            return '请输入支付类型';
        } else if (data.pay_type == 3 && data.price == '') {
            return '请输入尾款';
        } else if ((data.pay_type == 4 || data.pay_type == 6) && data.deposit_price == '') {
            return '请输入押金';
        } else if ((data.pay_type == 5 || data.pay_type == 6) && data.price == '') {
            return '请输入预付款';
        }
        else if (data.pay_date == '') {
            return '请输入到账日期';
        } else {
            return '';
        }
    };
    this.addDays = function (olddate, days) {
        var date = new Date(olddate);
        date = +date + 86400000 * days;
        date = new Date(date);
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
    };
    // 新增跟进check
    this.checkFollow = function (data) {
        if (!data.customer_id) {
            return 'customer_id不存在';
        } else if (!data.operate_pid) {
            return '业务线错误';
        } else if (!data.contact_name) {
            return '请输入联系人';
        } else if (data.is_effect != '0' && !data.contact_way) {
            return '请输入联系方式';
        }
        else if (data.is_effect != '0' && !data.contact_phone) {
            return '请输入联系号码';
        } else if (!data.is_effect) {
            return '请输入联系类型';
        } else if (!data.level_id) {
            return '请输入成熟度';
        } else if (!data.contact_time) {
            return '请输入本次联系时间';
        } else if (data.level_id != '6' && data.level_id != '7' && !data.next_time) {
            return '请输入预约时间';
        } else if (!data.info) {
            return '请输入联系内容';
        } else if (new Date(data.next_time) < new Date()) {
            return '预约时间不能早于当前时间';
        } else {
            return '';
        }
    };
    // 检测订单申请开票字段
    this.checkApplyTax = function (data) {
        if (!data.order_id) {
            return '订单Id为空！请重新选择订单';
        } else if (!data.type) {
            return '请选择开票类型';
        } else if (!data.purpose) {
            return '请选择开票用途';
        } else if (data.price == '') {
            return '请输入开票金额';
        }
        return '';
    };
    // 专票/普票选项
    this.switchTaxType = function (signType) {
        if (signType == '2') {
            return [{ id: '1', name: '专票', }, { id: '2', name: '普票' }];
        } else {
            return [{ id: '2', name: '普票' }];
        }
    };
    // 订单编辑 start
    this.getTemplateFormList = function () {
        return {
            '10026': { type: 0, url: 'Crm/Order/updateAiyoDZ' }, // 爱柚定制，不做
            // 菁英汇
            '10002': { type: 1, url: 'Crm/Order/updateFuHua', step: 2 }, // 孵化班
            '10003': { type: 1, url: 'Crm/Order/updateJinJie', step: 2 }, // 进阶班
            '10004': { type: 1, url: 'Crm/Order/updateJingYing', step: 2 }, // 精英班
            // 淘大
            '10006': { type: 2, url: 'Crm/Order/updateNeiRong', step: 2 }, // 内容引爆
            // 天猫线下
            '10007': { type: 2, url: 'Crm/Order/updateTeXun', step: 2 }, // 特训营
            // 淘大
            '10011': { type: 2, url: 'Crm/Order/updateNeiRong', step: 2 }, // 内容引爆
            // 爱柚
            '10015': { type: 4, url: 'Crm/Order/updateTuWen', step: 3 }, // 图文定制
            '10017': { type: 5, url: 'Crm/Order/updateShiPin', step: 3 }, // 短视频定制
            '10019': { type: 3, url: 'Crm/Order/updateJingXuan', step: 3 }, // 精选包
            '10020': { type: 5, url: 'Crm/Order/updateZhibo', step: 3 }, // 直播A
            '10021': { type: 5, url: 'Crm/Order/updateZhibo', step: 3 }, // 直播B
            '10022': { type: 5, url: 'Crm/Order/updateShiPin', step: 3 }, // 短视频D1
            '10023': { type: 5, url: 'Crm/Order/updateShiPin', step: 3 }, // 短视频D2
            '10024': { type: 5, url: 'Crm/Order/updateShiPin', step: 3 }, //  短视频D3
            '10025': { type: 5, url: 'Crm/Order/updateShiPin', step: 3 }  // 短视频D4
            // 爱柚定制 没有第三层
        };
    };
    this.forEachProductList = function (productList) {
        var list = [];
        if (productList) {
            productList.forEach(function (v) {
                v.include.forEach(function (v) {
                    v.list.forEach(
                        function (v) {
                            list.push(v);
                        }
                    );
                });
            });
        }
        return JSON.stringify(list);
    };
    // 订单编辑 end

    // 按钮筛选
    // this.switchResource = function (type) {
    //     switch ($stateParams.resource) {
    //         case 1:
    //             return {
    //                 delete: true,
    //                 alloc: true,
    //                 edit1: true
    //             }
    //         case 2:
    //             return {
    //                 alloc: true,
    //                 goPublic: true,
    //                 edit: true,
    //                 contactEdit: true,
    //                 taxEdit:true,
    //                 applyTax:true,
    //                 applyRefund:true,
    //                 applyCheck:true,
    //                 orderEdit:true,
    //                 billDelete:true,
    //             }
    //     }
    // }

    // 淘大订单特殊处理
    this.specialForTD = function (product_id) {
        if (product_id == 10006 || product_id == 10011) {
            return {
                isTD: true,
                tradeName: '订单号'
            };
        } else {
            return {
                isTD: false,
                tradeName: '交易号'
            };
        }
    };
    //  执行班次check
    this.checkClassChange = function (type, status, orderstatus) {
        if ((type == '1' && status == '100') || status == '300' || status === '0') {
            return '资格审核通过后的才能变更订单执行班次';
        }
        if (orderstatus == '300') {
            return '退款中的订单不能变更执行班次';
        }
        return '';
    };
    // 设置按钮置灰情况
    this.buttonController = function (obj, second_product_id) {
        var config = {
            common: true,
            createTax: true,
            refund: true,
            changeClass: true,
            studentEdit: true
        };
        if (obj.status == 400 || obj.status == 500) {
            config.createTax = false;
            return config;
        }
        // 菁英汇处理
        if (obj.status == 300 && second_product_id == 10000) {
            config.createTax = false;
            config.refund = false;
            return config;
        }
        // 流程中
        if (obj.approval_status == 100 || obj.tax_status == 100 || obj.refund_status == 100) {
            return config;
        }
        // 初始状态
        if (!obj.approval_type && (!obj.approval_status || obj.approval_status == '300' || obj.approval_status == '0')) {
            config = {
                common: false,
                createTax: false,
                refund: false,
                changeClass: false,
                studentEdit: false
            };
            return config;
        }

        if ((obj.status == '0' || obj.status == '200' || obj.status == '100') && (obj.approval_type == 0 || obj.approval_type == 100)) {
            config.common = false;
        }
        // if ((obj.status == '100' && obj.approval_status == 200) || (obj.status == '200' && obj.approval_status != 100)) {

        // }
        if ((obj.status == '100' && obj.approval_status == 200) || (obj.status == '200' && obj.approval_status != 100)) {
            // 退款成功后不能继续退款
            if (obj.refund_status != 400) {
                config.refund = false;
            }
            config.changeClass = false;
            config.studentEdit = false;
            config.createTax = false;
        }
        return config;
    };

    // v3.0.0
    // 校验支付信息
    this.checkTax = function (obj) {
        if (!obj.tax_title) {
            return '请输入企业名称';
        }
        if (!obj.tax_no) {
            return '请输入企业税号';
        }
        if (!obj.tax_address) {
            return '请输入公司地址';
        }
        if (!obj.tax_phone) {
            return '请输入公司电话';
        }
        if (!obj.tax_account) {
            return '请输入公司银行账号';
        }
        if (!obj.tax_bank) {
            return '请输入公司开户行';
        }
        return '';
    };
    // 校验邮寄信息
    this.checkAddress = function (obj) {
        if (!obj.mail_address) {
            return '请输入邮寄地址';
        }
        if (!obj.receiver) {
            return '请输入收件人';
        }
        if (!obj.receiver_phone) {
            return '请输入联系电话';
        }
        return '';
    };
    // 校验签约信息
    this.checkSign = function (obj) {
        if (obj.sign_type == 1) {
            if (!obj.sign_name) {
                return '请输入签约人';
            }
            if (!obj.sign_card_id) {
                return '请输入身份证';
            }
            if (!obj.sign_phone) {
                return '请输入联系方式';
            }
            return '';
        } else if (obj.sign_type == 2) {
            if (!obj.sign_authorize) {
                return '请输入签约授权人';
            }
            if (!obj.sign_company) {
                return '请输入公司名字';
            }
            if (!obj.sign_address) {
                return '请输入办公地址';
            }
            if (!obj.sign_phone) {
                return '请输入联系方式';
            }
            return '';
        } else {
            return '请选择签约类型';
        }
    };
    // 校验邮寄信息
    this.checkTaxInfo = function (obj) {
        if (!obj.type) {
            return '请选择开票类型';
        }
        if (!obj.price) {
            return '请输入开票金额';
        }
        if (!obj.tax_id) {
            return '请选择付款信息';
        }
        if (!obj.tax_id) {
            return '请选择邮寄信息';
        }
        return '';
    };
    //爱柚编辑校验
    this.requiredCheck = function (data, data1) {
        for (var i = 0; i < data1.length; i++) {
            if (!data1[i].third_product_id) {
                return '请选择产品！';
            }
            if (!data1[i].discount_price) {
                return '请输入价格！';
            }
            if (!data1[i].product_num) {
                return '请输入数量！';
            }
        }
        if (!data.is_new) {
            return '请选择签约类型！';
        } else if (!data.received_date) {
            return '请选择到单日期！';
        }
        return true;

    };

});