app.registerService("ContentCheckedService", ["$rootScope", function ($rootScope) {
	this.checked = {
		checkedList: [],
		checkedAll: function (event, list, checkedList) {
			var that = this;
			that.checkedList = checkedList;
			if (event.target.checked) {
				list.forEach(function (item) {
					var index = that.checkedList.map(item => item.content_id).indexOf(item.content_id)
					if (index == -1) { //点击全选，如果checkedList没有存储，则添加
						that.checkedList.push(item);
					}
				});
			} else {
				list.forEach(function (item) {
					var index = that.checkedList.map(item => item.content_id).indexOf(item.content_id)//点击取消全选，若checkedList存储此值，则删除。不可清空，原因是checkList存储的不只一页
					if (index != -1) {
						that.checkedList.splice(index, 1);
					}
				});
			}
			return this.checkedList;
		},
		checked: function (event, item, checkedList) {
			var that = this;
			that.checkedList = checkedList;
			if (event.target.checked) {
				var index = that.checkedList.map(item => item.content_id).indexOf(item.content_id)
				if (index == -1) { //点击选择，如果checkedList没有存储，则添加
					that.checkedList.push(item);
				}
			} else {
				//点击取消选择，若checkedList存储此值，则删除。不可清空，原因是checkList存储的不只一页
				var index = that.checkedList.map(item0 => item0.content_id).indexOf(item.content_id)//判断对象 在 对对象数组中的 下标！！
				if (index != -1) {
					that.checkedList.splice(index, 1);
				}
			}
			return that.checkedList;
		},
		defaultChecked: function (checkedList, list) {
			checkedList.forEach(function (item) {
				list.forEach(function (item0) {
					if (item0.content_id == item.content_id) {//每次翻页确定是否该内容已被选中，若是，则在checkedList添加
						item0.checked = true;
					}
				});
			});
			return list;
		}
	};
	this.replaceNum = function (num) {
		var reg = /^[1-9]\d*$/;
		if (reg.test(num)) {
			if (num > 100) {
				num = 100;
			}
		} else {
			num = '';
		}
		return num;
	}
	this.replacePrice = function (price) {
		var reg = /^(0|[1-9][0-9]*)+(.[0-9]{1,2})?$/;//0或非零开头的带两位小数
		if (reg.test(price)) {
			if (price > 10000000.00) {
				price = 10000000.00;
			}
		} else {
			price = '';
		}
		return price;
	}
}]);