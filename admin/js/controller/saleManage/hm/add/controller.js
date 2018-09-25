// 黑曼新增
app.registerCtrl('HmAddController', ['$scope', '$state', '$prompt', 'OrderHeimanNetService', 'CommonNetService', 'OrderService', function ($scope, $state, $prompt, OrderHeimanNetService, CommonNetService, OrderService) {
    $scope.$emit('id', 'saleManage');
    $scope.isAjaxError = false;
    var isAjaxing = false;

    $scope.uiModel = {
        step: 1,
        data:
        {
            // 第一步 旺旺
            customer: '',
            // 第二步
            income_type: [],
            service_start_time: '',
            service_end_time: '',
            product_category_id: '',
            buy_product_list: [],  // 购买的产品列表
            total_price: '',
            order_received_date: '',
            order_sign_type: '',
            order_sign_name: '',
            order_sign_card_id: '',
            order_sign_authorize: '',
            order_sign_company: '',
            order_sign_address: '',
            order_sign_phone: '',
            order_remarks: '',
            is_new: '',
            // pool_id: 1
        },
        income_type: '',
        income_typeForShow: '',
        modal: {
            confirm: false
        },
        dataForShow: {},
        showData: false,
        // 二级选购模型
        mainModel: [],
        productList: [],
        currentProductType: '',
        currentProductId: '',
        selectList: {
            typeList: [{ id: '0', status: '新签' }, { id: '1', status: '续签' }],
            incomeType: [{ value: 1, label: '服务类' }, { value: 4, label: '广告类' }]
        }
    };
    // 缓存班型
    var index = '';
    // 缓存班次
    var subIndex = '';
    // 修改签约类型
    $scope.changeSignType = function (type) {
        if ($scope.uiModel.data.order_sign_type != type) {
            $scope.uiModel.data.order_sign_type = type;
        }
    };

    // 第一步,校验名字，成功就下一步
    $scope.checkName = function () {
        OrderHeimanNetService.checkName({
            customer: $scope.uiModel.data.customer
        }).then(function (res) {
            if (res.data.code) {
                $scope.uiModel.step = 2;
                $scope.getProductCategoryList();
            } else {
                $prompt.timeout($scope, res);
            }
        });
    };
    // 选择产品类型
    $scope.chooseProductType = function (first, firstIndex) {
        $scope.uiModel.data.product_category_id = first.product_category_id;
        $scope.uiModel.productList = first.product_list || [];
        index = firstIndex;
        // 如果下面有产品，则选中第一个产品
        if (first.product_list && first.product_list.length > 0) {
            $scope.chooseProduct(first.product_list[0], 0);
        }
    };
    // 选择产品
    $scope.chooseProduct = function (product, index) {
        $scope.uiModel.currentProductId = product.product_id;
        // 缓存二级当前选中项
        subIndex = index;
        // 设置展示信息
        $scope.uiModel.dataForShow = {
            product_remarks: product.product_remarks,
            product_name: product.product_name,
            product_price: product.product_price,
            content_list: product.content_list,
            // 购买数量
            product_num: product.product_num
        };
        $scope.uiModel.showData = true;
    };

    // 菜单校验
    $scope.check = function (subIndex) {
        // 存在三级区块
        if ($scope.uiModel.dataForShow) {
            // 存在购买数量
            $scope.uiModel.mainModel[index].total_number = 0;
            // 遍历当前产品类型购买的产品总数
            $scope.uiModel.mainModel[index].product_list.forEach(function (product) {
                if (product.product_num) {
                    $scope.uiModel.mainModel[index].total_number += parseInt(product.product_num);
                }
            })
        }
    };
    // 保存填写信息
    $scope.saveTemp = function () {
        // 保存产品购买数量
        $scope.uiModel.mainModel[index].product_list[subIndex].product_num = $scope.uiModel.dataForShow.product_num;
    };
    $scope.next = function () {
        var temp = OrderService.reModelData($scope.uiModel.mainModel);
        if (!temp) {
            $prompt.timeout($scope, {
                data: {
                    code: 0,
                    msg: '请输入正确的数量'
                }
            });
            return;
        }
        if (temp.buy_product_list.length == 0) {
            $prompt.timeout($scope, {
                data: {
                    code: 500,
                    msg: '请输入购买数量'
                }
            });
            return;
        }
        $scope.uiModel.step += 1;
    };
    $scope.back = function () {
        if ($scope.uiModel.step == 3) {
            // 重置签约信息
            $scope.uiModel.data.income_type = [];
            $scope.uiModel.data.service_start_time = '';
            $scope.uiModel.data.service_end_time = '';
            $scope.uiModel.data.buy_product_list = [];  // 购买的产品列表
            $scope.uiModel.data.total_price = '';
            $scope.uiModel.data.order_received_date = '';
            $scope.uiModel.data.order_sign_type = '';
            $scope.uiModel.data.order_sign_name = '';
            $scope.uiModel.data.order_sign_card_id = '';
            $scope.uiModel.data.order_sign_authorize = '';
            $scope.uiModel.data.order_sign_company = '';
            $scope.uiModel.data.order_sign_address = '';
            $scope.uiModel.data.order_sign_phone = '';
            $scope.uiModel.data.order_remarks = '';
            $scope.uiModel.data.is_new = '';
            $scope.uiModel.income_type = '';
            $scope.uiModel.income_typeForShow = '';
        } else {
            // 重置第二页信息
            $scope.uiModel.dataForShow = {};
            $scope.uiModel.productList = [];
            $scope.uiModel.showData = false;
        }
        if ($scope.uiModel.step > 1) {
            $scope.uiModel.step -= 1;
        }
    };
    $scope.cancel = function () {
        window.history.go(-1);
    };
    // 弹窗控制
    $scope.showModal = function (type) {
        if (type == 'confirm') {
            // var showArray = [];
            // $scope.uiModel.data.income_type = [];
            // $scope.uiModel.income_type.forEach(function (item) {
            //     $scope.uiModel.data.income_type.push(item.value);
            //     showArray.push(item.label);
            // });
            // $scope.uiModel.income_typeForShow = showArray.join();
            var temp = OrderService.reModelData($scope.uiModel.mainModel);
            $scope.uiModel.data.buy_product_list = temp.buy_product_list;
            $scope.uiModel.data.total_price = temp.total_price;
            var err = OrderService.normalCheck($scope.uiModel.data);
            if (err) {
                $prompt.timeout($scope, {
                    data: {
                        code: 500,
                        msg: err
                    }
                });
                return;
            }
        }
        $scope.uiModel.modal[type] = true;
    };
    $scope.hideModal = function (type) {
        $scope.uiModel.modal[type] = false;
    };
    // 加载
    $scope.getProductCategoryList = function () {
        OrderHeimanNetService.getProductCategoryList().then(function (res) {
            if (res.data.code) {
                $scope.uiModel.mainModel = res.data.data;
                if (res.data.data && res.data.data.length > 0) {
                    // $scope.uiModel.productId = res.data.data[0].product_list[0].third_product_id;
                    // $scope.uiModel.productName = res.data.data[0].product_list[0].product_name;
                    // $scope.uiModel.classList = res.data.data[0].product_list[0].class_list;
                    // if (res.data.data[0].product_list[0].class_list[0]) {
                    //     $scope.chooseClass(res.data.data[0].product_list[0].class_list[0], 0);
                    // }
                    index = 0;
                    subIndex = 0;
                    $scope.chooseProductType(res.data.data[0], 0);
                }
            } else {
                $prompt.timeout($scope, res);
            }
        });
    };
    // 初始化
    $scope.init = function () {
        $scope.getProductCategoryList();
    };
    // 重新构建菜单信息
    $scope.reload = function () {
        if (parseInt($scope.uiModel.dataForShow.product_num) > 10) {
            $prompt.timeout($scope, {
                code: 500,
                msg: '产品数量不得大于10'
            });
            $scope.uiModel.dataForShow.product_num = $scope.uiModel.dataForShow.product_num.substring(0, $scope.uiModel.dataForShow.product_num.length - 1);
        } else {
            $scope.saveTemp();
            $scope.check(subIndex);
        }
    };
    // 新增
    $scope.insert = function () {
        if (isAjaxing) {
            return;
        }
        isAjaxing = true;
        // if ($scope.first_product_id) {
        //     $scope.uiModel.data.first_product_id = $scope.first_product_id
        // }
        // $scope.uiModel.data.operate_pid = $stateParams.operate_pid;
        OrderHeimanNetService.insert($scope.uiModel.data).then(function (res) {
            isAjaxing = false;
            if (res.data.code) {
                $scope.hideModal('confirm');
                $prompt.timeout($scope, res);
                $state.go('orderInformation');
            } else {
                $prompt.timeout($scope, res);
            }
        });
    };
    $scope.init();
}]);