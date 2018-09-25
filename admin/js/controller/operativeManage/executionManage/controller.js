app.registerCtrl('executionManage',['$scope','executionNetService','$prompt',function($scope,executionNetService,$prompt){
    $scope.getTypeList  = function(){
		executionNetService.getTypeList().then(function(res){
			if(res.data.code == 1){
				$scope.typeList = res.data.data;
			}else{
				$prompt.timeout($scope,res);
			}
		});
	};
	$scope.getTypeList();
	$scope.firstSelect = function(firstContent){ //选中一级显示二级下拉
		if(!firstContent){
			$scope.clearList();
		}else{
			$scope.secondContentList = firstContent.junior_category;
		}
	};
	$scope.secondSelect = function(secondContent){ //选中二级显示三级下拉
		if(!secondContent){
			$scope.clearList_second();
		}else{
			$scope.thirdContentList = secondContent.junior_category;
		}
	};
	$scope.clearList = function(){//一级清空，清空二级三级下拉
		$scope.firstContent = '';
		$scope.secondContentList = [];
		$scope.clearList_second();
	};
	$scope.clearList_second = function(){//二级清空，清空三级下拉
		$scope.secondContent = '';
		$scope.thirdContent = '';
		$scope.thirdContentList = [];
	};
    $scope.uiModel = {
        filters:{
            execute_content_name:'',
            first_content_id:'',
            second_content_id:'',
            third_content_id:'',
        }
    };
    $scope.page = {
        page_no: '',
		pageSize: 10,
		total: 0,
		pageCount: 0,
	};
	//处理搜索条件
	$scope.searchItem = function(){
		$scope.uiModel.filters.first_content_id = $scope.firstContent?$scope.firstContent.content_category_id:'';
		$scope.uiModel.filters.second_content_id = $scope.secondContent?$scope.secondContent.content_category_id:'';
		$scope.uiModel.filters.third_content_id = $scope.thirdContent?$scope.thirdContent.content_category_id:'';
	};
	//获取列表
	$scope.orginFilters = angular.copy($scope.uiModel.filters);
    $scope.getList = function(pageIndex){
        executionNetService.getList(pageIndex, $scope.orginFilters, $scope,{page_size: $scope.page.page_size}).then(function(res){
            if(res.data.code == 1){
                $scope.page.page_no = res.data.page_info.page_no;
				$scope.page.total = res.data.page_info.total;
				$scope.page.pageCount = res.data.page_info.page_count;
				$scope.list = res.data.data;
            }else{
                $prompt.timeout($scope,res);
            }
        });
    };
    $scope.getList();
    $scope.search = function () {
		$scope.searchItem();
		$scope.orginFilters = angular.copy($scope.uiModel.filters);
		$scope.page.page_no = 1;
		$scope.getList();
	};
}]);