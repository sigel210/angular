/*
    author: cwj
    created:2017年11月2日 16:49:30
    人员分配组件。操作全部在内部实现。减少外部代码量。
    支持复选和单选2种选项。参考属性 multipieAllot
    v1.0 
    后续可优化项，支持其他类型分配。属性名自定义化；
 */
app.registerDirective('allot', function () {
    return {
        restrict: 'A',
        templateUrl: './js/components/allot/template.html',
        scope: {
            show: '=', // 用于控制弹窗是否显示
            title: '@', // 弹窗标题
            callback: '&', // 回调处理分配操作
            model: '=', // 用于渲染的数据，返回数据类型参考接口/Resource/CustomerFirm/getAdmUser            
            multipieAllot: '@',  // boolean true 为多选模式
        },
        link: function (scope, element) {
            scope.tabIndex = '';
            scope.temp = {
                tab: '',
                departmentList: [],
                currentDepartmentId: '',
                departmentIndex: '',
                peopleList: [],
                currentPeople: null
            };
            scope.listShow = false;
            scope.currentPeople = {};
            scope.init = function () {
                var isFirst = true;
                scope.currentPeople = {};
                for (var item in scope.model) {
                    if (isFirst) {
                        scope.temp.tab = item;
                        scope.temp.departmentList = scope.model[item].department;
                        scope.temp.departmentIndex = 0;
                        scope.temp.currentDepartmentId = scope.temp.departmentList[0].department_id;
                        scope.temp.currentDepartmentName = scope.temp.departmentList[0].department_name;
                        scope.temp.peopleList = scope.model[item].department[0]._list;
                        isFirst = false;
                    }
                    if (scope.model[item].user) {
                        scope.currentPeople[item] = scope.model[item].user;
                    }
                }
            };
            scope.changeTab = function (key) {
                if (scope.temp.tab != key) {
                    scope.temp.tab = key;
                    scope.temp.departmentList = scope.model[key].department;
                    scope.temp.departmentIndex = 0;
                    scope.temp.peopleList = scope.temp.departmentList[0]._list;
                }
            };
            scope.showList = function () {
                scope.listShow = true;
            };
            scope.hideList = function () {
                scope.show = false;
            };
            scope.showChild = function (index, item) {
                scope.temp.departmentIndex = index;
                scope.temp.currentDepartmentId = item.department_id;
                scope.temp.currentDepartmentName = item.department_name;
                scope.temp.peopleList = item._list;
            };
            scope.choose = function (people) {
                if (scope.currentPeople[scope.temp.tab].id && scope.currentPeople[scope.temp.tab].id == people.id) {
                    scope.currentPeople[scope.temp.tab] = {};
                } else {
                    scope.currentPeople[scope.temp.tab] = people;
                    scope.currentPeople[scope.temp.tab].department_id = scope.temp.currentDepartmentId;
                    scope.currentPeople[scope.temp.tab].department_name = scope.temp.currentDepartmentName;
                }
            };
            scope.confirm = function () {
                scope.show = false;
                scope.listShow = false;
                if (scope.multipieAllot) {
                    scope.callback({obj:scope.currentPeople});
                } else {
                    scope.callback({obj:scope.currentPeople[scope.temp.tab]});
                }
            };
            scope.$watch('show', function (n) {
                if (n) {
                    scope.init();
                }
            });
        }
    };
});