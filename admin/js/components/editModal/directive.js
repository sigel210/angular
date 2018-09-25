/*
    author:cwj
    created：2018年1月22日 16:58:57
    本指令用于生成编辑弹窗页
    
 */
// config 举例
// {
//     flag:false,
//     data:{},
//     confirm: function(data){
//             / do something
//     }
// }

app.registerDirective('editModal', function () {
    return {
        restrict: 'A',
        templateUrl: './js/components/editModal/template.html',
        transclude: true,
        scope: {
            config: '=',  // 数据
            confirm: '&',  // 确认回调
            size:'@'  //  sm,lg 弹窗尺寸控制 
        },
        link: function (scope) {
            
            scope.hide =  function() {
                scope.config.flag = false;
            };
            scope.init = function() {
                scope.size = scope.size || 'sm';
            };
            scope.init();
        }
    };
});