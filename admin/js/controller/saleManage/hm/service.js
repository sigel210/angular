//通用服务
app.registerService('OrderService', function () {
    // check基本信息
    this.normalCheck = function (data) {
        if (!data.customer) {
            return '客户名称不得为空';
        }
        if (!data.total_price) {
            return '购买数量不得为空';
        }
        if (data.order_sign_type == 1) {
            if (!data.order_sign_name) {
                return '签约人不得为空';
            }
            if (!data.order_sign_card_id) {
                return '身份证号码不得为空';
            }
            if (!data.order_sign_phone) {
                return '联系方式不得为空';
            }
        } else {
            if (!data.order_sign_authorize) {
                return '签约授权人不得为空';
            }
            if (!data.order_sign_phone) {
                return '联系方式不得为空';
            }
            if (!data.order_sign_company) {
                return '公司名字不得为空';
            }
            if (!data.order_sign_address) {
                return '办公地址不得为空';
            }
        }
        if (!data.order_received_date) {
            return '到单日期不得为空';
        }
        if (!data.is_new) {
            return '签约类型不得为空';
        }
        // if (!data.service_start_time) {
        //     return '执行周期不得为空';
        // }
        // if (!data.service_end_time) {
        //     return '执行周期不得为空';
        // }
        // if (data.income_type.length == 0) {
        //     return '营收类型不得为空';
        // }
        return false;

    };
    // 构建后端模型，用于提交和check
    this.reModelData = function (data) {
        var array = [];
        var price = 0;
        var zeroFlag = false;
        data.forEach(function (item) {
            item.product_list.forEach(function (product) {
                // 如果存在购买数量
                if (product.product_num) {
                    if (product.product_num === '0') {
                        zeroFlag = true;
                    }
                    array.push(product);
                    price += product.product_num * product.product_price;
                }
            });
        });
        if (zeroFlag) {
            return false;
        } else {
            return {
                total_price: price,
                buy_product_list: array
            };
        }
    };


});