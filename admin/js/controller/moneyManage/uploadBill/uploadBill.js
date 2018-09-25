app.registerCtrl('uploadBill', ['$scope', 'uploadBillNetService','$prompt', function ($scope, uploadBillNetService,$prompt) {
    $scope.saveReport = function(type){
        uploadBillNetService.saveReport(type).then(function(res){
            if (res.data.code == 0) {
                $prompt.timeout($scope, res);
            } else{
                if(type == 1){
                    window.open(encodeURI(res.data.data[0].temp_url));//天下网商支付宝模板
                }else if(type == 2){
                    window.open(encodeURI(res.data.data[1].temp_url));//天下网商银行卡模板
                } else if(type == 3){
                    window.open(encodeURI(res.data.data[2].temp_url));//淘大培训支付宝模板
                } else if(type == 4){
                    window.open(encodeURI(res.data.data[3].temp_url));//淘大培训银行卡模板
                }
            }
        });
    };
    $scope.uploadModel = { //区分 天下网商和 淘大培训
        uploadAlipayData: '',
        uploadUnionPayData: '',
        uploadContentPayData:'',
        uploadTDBankData:'',
        isShow: true,
        fileChange: function (files, type) { // 更改文件
            if (type == 1) { //天下网上支付宝
                $scope.uploadModel.uploadAlipayData = files[0];
            } else if(type == 2) { //天下网商银行卡
                $scope.uploadModel.uploadUnionPayData = files[0];
            } else if(type == 3){ //淘大培训支付宝
                $scope.uploadModel.uploadContentPayData = files[0];
            } else if(type == 4){ //淘大培训银行卡
                $scope.uploadModel.uploadTDBankData = files[0];
            }
            $scope.$apply();
        },
        clearUploadData : function (type) { //清空文件
            if (type == 1) {//天下网上支付宝
                $scope.uploadModel.uploadAlipayData = '';
                document.getElementById('uploadAlipay').value = '';
            } else if(type == 2) {//天下网商银行卡
                $scope.uploadModel.uploadUnionPayData = '';
                document.getElementById('uploadUnion').value = '';
            } else if(type == 3) { //淘大培训支付宝
                $scope.uploadModel.uploadContentPayData = '';
                document.getElementById('uploadContentPayData').value = '';
            } else if(type == 4) { //淘大培训银行卡
                $scope.uploadModel.uploadTDBankData = '';
                document.getElementById('uploadTDBankData').value = '';
            } else{
                // $scope.uploadModel.uploadAlipayData = '';
                // document.getElementById('uploadAlipay').value = '';
                // $scope.uploadModel.uploadUnionPayData = '';
                // document.getElementById('uploadUnion').value = '';
                $scope.uploadModel.uploadContentPayData = '';
                document.getElementById('uploadContentPayData').value = '';
                $scope.uploadModel.uploadTDBankData = '';
                document.getElementById('uploadTDBankData').value = '';
            }
        },
        uploadFile :function(type){ //上传文件
            $scope.loadingModal.show();
            var data;
            if(type == 1){
                data = $scope.uploadModel.uploadAlipayData;
            }else if(type == 2){
                data = $scope.uploadModel.uploadUnionPayData;
            }else if(type == 3){
                data = $scope.uploadModel.uploadContentPayData;
            }else if(type == 4){
                data = $scope.uploadModel.uploadTDBankData;
            }
            var params = {
                type:type,
                excel_file:data
            };
            uploadBillNetService.import(params).then(function(res){
                $scope.uploadModel.clearUploadData();
                $scope.loadingModal.hide();
                $scope.uploadModel.isShow = false;
                if(res.data.code == 1){
                    $scope.resultModal.uploadContentS = true;
                    $scope.resultModal.dataS = res.data.msg;
                }else{
                    $scope.resultModal.uploadContentF = true;
                    $scope.resultModal.errorTip = res.data.msg;
                    $scope.resultModal.errorGroup = res.data.data;
                }
            });
        },
    };
    $scope.loadingModal = {
        isShow:false,
        show:function(){
            this.isShow = true;
        },
        hide:function(){
            this.isShow = false;
        }
    };
    $scope.resultModal = {
        uploadContentF:false,//对账失败界面显示
        uploadContentS:false,//对账成功界面显示
        dataS:[],//对账成功的返回信息
        errorTip:'',//错误提示信息
        errorGroup:[],//对账失败返回信息
        confirmBill:function(){
            $scope.init();
        }
    };
    $scope.reSubmit = function(){
        $scope.init();
    };
    $scope.init = function(){ //初始状态
        $scope.uploadModel.isShow = true;
        $scope.uploadModel.clearUploadData(5);
        $scope.loadingModal.isShow = false;
        $scope.resultModal.uploadContentF = false;
        $scope.resultModal.uploadContentS = false;
    };
}]);
