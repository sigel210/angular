app.registerService('CustomerOrderNetService', ['$Ajax', '$rootScope', function ($Ajax, $rootScope) {
    var http = $rootScope.http;
    // 获取列表
    this.getList = function (req) {
        return $Ajax.get(http + '/sale/Order/getOrderList&customer_id='+req);
    };
    // 获取订单详情
    this.getDetail = function (req) {
        return $Ajax.get(http + '/sale/Order/detail&order_id=' + req);
    };
    // 获取产品内容详情
    this.getOrderProduct = function (req) {
        return $Ajax.post(http + '/sale/OrderProduct/orderProductList', req);
    };

    this.checkBeforeDelete = function (req) {
        return $Ajax.post(http + '/sale/Order/checkBeforeDelete', req);
    };
    this.delete = function (req) {
        return $Ajax.post(http + '/sale/Order/delete', req);
    };

    this.order = {
        checkBeforeRefund: function (req) {
            return $Ajax.post(http + '/sale/Order/checkBeforeRefund', req);
        },
        getRefundInfo: function (req) {
            return $Ajax.post(http + '/sale/Order/getRefundInfo', req);
        },
        uploadImg: function(req) {
            return $Ajax.fileUpload(http+ '/sale/Order/uploadRefundPic',req);
        },
        applyRefund: function(req) {
            return $Ajax.post(http + '/sale/Order/applyRefund', req);
        },
        getRefundList: function(req) {
            return $Ajax.post(http + '/sale/Order/getRefundList', req);
        },
    };

    // 支付相关
    this.bill = {
        getList: function (req) {
            return $Ajax.post(http + '/sale/Pay/index', req);
        },
        getDetail: function (req) {
            return $Ajax.post(http + '/sale/Pay/detail', req);
        },
        checkBeforeDelete: function (req) {
            return $Ajax.post(http + '/sale/Pay/checkBeforeDelete', req);
        },
        delete: function (req) {
            return $Ajax.post(http + '/sale/Pay/delete', req);
        },
        checkBeforeInsert: function (req) {
            return $Ajax.post(http + '/sale/Pay/checkBeforeInsert', req);
        },
        checkBeforeUpdate: function (req) {
            return $Ajax.post(http + '/sale/Pay/checkBeforeUpdate', req);
        },
        update: function (req) {
            return $Ajax.post(http + '/sale/Pay/update', req);
        },
        checkBeforeVerify: function (req) {
            return $Ajax.post(http + '/sale/Pay/checkBeforeVerify', req);
        },
        verify: function (req) {
            return $Ajax.post(http + '/sale/Pay/verify', req);
        }
    };
}]);
