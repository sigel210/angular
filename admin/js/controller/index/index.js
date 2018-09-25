app.controller('myController', ['$scope', '$state', '$Ajax', '$cookies', '$prompt', '$rootScope', '$confirm', '$confirm_cancel', 'UserService', '$interval', '$sce', '$timeout', function ($scope, $state, $Ajax, $cookies, $prompt, $rootScope, $confirm, $confirm_cancel, UserService, $interval, $sce, $timeout) {
    $scope.pageshow = true;
    $scope.msgnum = 0;
    $scope.isAjaxError = false;
    $scope.judge_img = ['', 'carryon-img', 'secusess-img', 'rejuect-img'];
    $rootScope.http = https[0] + '/public/index.php?s=';
    $scope.colorArr = [{ 'color': 'color1' }, { 'color': 'color2' }, { 'color': 'color3' }, { 'color': 'color4' }, { 'color': 'color5' }, { 'color': 'color6' }, { 'color': 'color7' }, { 'color': 'color1' }, { 'color': 'color2' }, { 'color': 'color3' }, { 'color': 'color4' }, { 'color': 'color5' }, { 'color': 'color6' }, { 'color': 'color7' }];
    // 一级路由选中。
    $scope.$on('id', function (e, d) {
        if ($scope.oldId)
            $('#' + $scope.oldId).removeClass('current');
        if (!$scope.oldId) {
            setTimeout(function () {
                $('#' + d).addClass('current');
            }, 300);
        } else {
            $('#' + d).addClass('current');
        }
        $scope.oldId = d;
    });
    if (!$cookies.user) {
        window.location.href = 'login.html';
    } else {
        $scope.user = JSON.parse($cookies.user);
    }

    // 跳转封装
    $scope.statego = function (hash, name) {
        if (name) {
            document.title = '宙斯|' + name;
        }
        $state.go(hash);
    };
    // 带参数跳转
    $scope.stategoParam = function (hash, param, name) {
        if (name) {
            document.title = '宙斯|' + name;
        }
        $state.go(hash, param);
    };
    // 新开页
    $scope.stateNewgoParam = function (hash, param) {
        var url = $state.href(hash, param);
        window.open(url, '_blank');
    };

    $scope.$on('$stateChangeSuccess', function (e, v, k) {
        $scope.article = k;
    });

    $scope.functionArray = [];
    $scope.init = function () {
        $scope.getUserInfo();
        // $scope.showMsgNum();
    };

    $scope.getUserInfo = function () {
        $scope.functionArray = [];
        if (UserService.hasPermission(1464)) {
            $scope.functionArray.push({ name: '业务中心', page: 'saleManage', icon: 'icon-sale1', isNew: false });
        }
        if (UserService.hasPermission(1457)) {
            $scope.functionArray.push({ name: '运营中心', page: 'operativeManage', icon: 'icon-yunying', isNew: false });
        }
        if (UserService.hasPermission(1453)) {
            $scope.functionArray.push({ name: '财务中心', page: 'moneyManage', icon: 'icon-finance1', isNew: false });
        }
        if (UserService.hasPermission(1471)) {
            $scope.functionArray.push({ name: '产品中心', page: 'productCenter', icon: 'icon-resource', isNew: false}); 
        }
    };

    //退出登录
    $scope.logoutConfirm = function () {
        $confirm_cancel.show({
            id: 'uiViews',
            title: '登出',
            text: '确认登出用户？',
            buttons: [{
                text: '确定',
                ontap: function () {
                    $confirm_cancel.hide().then(function () {
                        $scope.logout();
                    });
                }
            }],
            scope: $scope
        });
    };

    $scope.logout = function () {
        var url = $rootScope.http + '/commonality/Pub/logout';
        $Ajax.post(url).then(function (res) {
            if (res.data.code) {
                $cookies.user = '';
                window.location.href = 'login.html';
            } else {
                if (res.data.code == -103) {
                    $cookies.user = '';
                    window.location.href = 'login.html';
                } else {
                    $prompt.timeout($scope, res);
                }
            }

        });
    };

    $scope.showMsgs = function () {
        $scope.statego('msgCenter');
    };

    $scope.showMsgNum = function () {
        var url = $rootScope.http + '/Pub/Index/getNoticeCount';
        $Ajax.post(url).then(function (res) {
            if (res.data.code) {
                $scope.msgnum = parseInt(res.data.data.notice_count);
                //  后续websocket 2.2.1
                if (window.location.origin.indexOf('localhost') == -1) {
                    var socket = io(window.location.origin + ':2120');
                    // socket连接后以uid登录
                    var uid = $scope.user.id;
                    socket.on('connect', function () {
                        socket.emit('login', uid);
                    });

                    // 后端推送来消息时
                    socket.on('new_msg', function (msg) {
                        var data = JSON.parse(msg);
                        if (data.notice_count) {
                            $timeout(function () {
                                $scope.msgnum += parseInt(data.notice_count);
                                if ($scope.msgnum < 0) {
                                    $scope.msgnum = 0;
                                }
                            }, 0);

                        }
                        if (data.content) {
                            $scope.$broadcast('messageCount', data.content);
                        }
                        if (data.total_num || data.total_amount) {
                            $scope.$broadcast('orderSum', { total_num: data.total_num, total_amount: data.total_amount });
                        }
                    });
                    // 后端推送来在线数据时

                    socket.on('update_online_count', function (msg) {
                        var data = JSON.parse(msg);
                        if (data.total_num || data.total_amount) {
                            $scope.$broadcast('orderSum', { total_num: data.total_num, total_amount: data.total_amount });
                        }
                    });

                }
            } else
                $prompt.timeout($scope, res);
        });
    };

    $scope.contHeight = function () {
        var page_h = $('body').height();
        var page_w = $('body').width();
        var head_h = $('.header').height();
        var tab_h = $('.tab-bar').height();
        var cont_h = page_h - head_h - tab_h;
        var cont_w = page_w - 150;
        $('.js-contheight').css({ 'width': page_w });
        // $(".js-page").css({"width":cont_w,"height":cont_h});
        $('.footer-bar').css('width', cont_w);
        //右侧滑动弹窗的内容高度
        var slide_cont_h = page_h - 53 - head_h;
        var detail_info_con2 = page_h - 93;
        var detail_info_con = page_h - 126;
        var detail_info_con3 = page_h - 140;
        //alert(m_cont_h);
        $('.slide-cont').css({ 'height': slide_cont_h, 'overflow': 'auto' });
        $('.info-con').css({ 'height': detail_info_con, 'overflow': 'auto' });
        $('.info-con2').css({ 'height': detail_info_con2, 'overflow': 'auto' });
        $('.info-con3').css({ 'height': detail_info_con3, 'overflow': 'auto' });
    };

    $(window).resize(function () {
        // $scope.contHeight();
        //修复右侧滑块随窗口大小改变宽高
        var page_h = $('body').height();
        var head_h = $('.header').height();
        var page_w = $('body').width();
        var slide_cont_h = page_h - 53 - head_h;
        var detail_info_con2 = page_h - 93;
        var detail_info_con = page_h - 126;
        var detail_info_con3 = page_h - 140;
        $('.js-contheight').css({ 'width': page_w });
        $('.slide-cont').css({ 'height': slide_cont_h, 'overflow': 'auto' });
        $('.info-con').css({ 'height': detail_info_con, 'overflow': 'auto' });
        $('.info-con2').css({ 'height': detail_info_con2, 'overflow': 'auto' });
        $('.info-con3').css({ 'height': detail_info_con3, 'overflow': 'auto' });
    });

    // 查看大图，目前简单处理
    $scope.viewPic = function (img) {
        window.open(img);
    };

    // 获取职位列表
    // $scope.common_positionList = [];
    // $scope.getCommonPositionList = function() {
    //   var url = http + '/crm/downList/position';
    //   $Ajax.get(url).then(function(res) {
    //     if (res.data.code) {
    //       $scope.common_positionList = res.data.data
    //     } else
    //       $prompt.timeout($scope, res);
    //   });
    // };

    // 上传图片本地预览
    $scope.lightbox = {
        id: 'lightbox',
        show: function (file) {
            if (!file) {
                return;
            }
            if (typeof (file) == 'string') {
                var txt = file;
                var img = document.createElement('img');
                img.src = txt;
                var lightbox = document.getElementById($scope.lightbox.id);
                lightbox.style.display = 'block';
                if (lightbox.childNodes.length) {
                    lightbox.removeChild(lightbox.childNodes[0]);
                }
                lightbox.appendChild(img);
            } else {
                var reader = new FileReader();
                reader.onload = function (event) {
                    var txt = event.target.result;
                    var img = document.createElement('img');
                    img.src = txt;
                    var lightbox = document.getElementById($scope.lightbox.id);
                    lightbox.style.display = 'block';
                    if (lightbox.childNodes.length) {
                        lightbox.removeChild(lightbox.childNodes[0]);
                    }
                    lightbox.appendChild(img);
                };
                reader.readAsDataURL(file);
            }
        },
        hide: function () {
            var lightbox = document.getElementById($scope.lightbox.id);
            lightbox.style.display = 'none';
        }
    };

    $scope.isMobile = function (num) {
        return /^1[0-9]{10}$/.test(num);
    };
    $scope.isTel = function (num) {
        return /^0\d{2,3}-\d{5,9}$/.test(num);
    };
    $scope.isNumber = function (num) {
        return /^[0-9]*$/.test(num);
    };

    $scope.uploader = '';
    $scope.defineUploader = function () {
        accessid = '';
        accesskey = '';
        host = '';
        policyBase64 = '';
        signature = '';
        callbackbody = '';
        filename = '';
        key = '';
        expire = 0;
        g_object_name = '';
        g_object_name_type = '';
        now = timestamp = Date.parse(new Date()) / 1000;
        $scope.uploader = new plupload.Uploader({
            runtimes: 'html5,flash,silverlight,html4',
            browse_button: 'selectfiles',
            multi_selection: false,
            container: document.getElementById('container'),
            flash_swf_url: '../../lib/plupload-2.1.2/js/Moxie.swf',
            silverlight_xap_url: '../../lib/plupload-2.1.2/js/Moxie.xap',
            url: ' ',
            filters: {
                mime_types: [//只允许上传图片和zip,rar文件
                    { title: 'mp4 files', extensions: 'mp4' },
                ],
                max_file_size: '1024mb', //最大只能上传1024mb的文件
                prevent_duplicates: false //不允许选取重复文件
            },
            init: {
                PostInit: function (up) {
                    document.getElementById('ossfile').innerHTML = '';
                    $rootScope.video_url = '';
                    // document.getElementById('postfiles').onclick = function () {
                    //     if (up.files.length == 0) {
                    //         $prompt.timeout($scope, {
                    //             data: {
                    //                 code: 500,
                    //                 message: "请先选择文件"
                    //             }
                    //         });
                    //     }
                    //     if (up.total.uploaded == 1) {
                    //         $prompt.timeout($scope, {
                    //             data: {
                    //                 code: 500,
                    //                 message: "您已上传过文件"
                    //             }
                    //         });
                    //     }
                    //     set_upload_param(up, '', false);
                    //     return false;
                    // };
                },
                FilesAdded: function (up, files) {
                    $('#postfiles').show();
                    if ($('#original_file').length > 0) {
                        $('#original_file').hide();
                    }
                    $('#selectfiles').hide();
                    $('.percent').show();
                    $('#ossfile').show();
                    $('.plupload-progress').show();
                    var isconsole = document.getElementById('console').innerHTML;
                    if (isconsole) {
                        document.getElementById('console').innerHTML = '';
                    }
                    if (up.files.length > 1) {
                        up.removeFile(up.files[0]);
                    }
                    plupload.each(files, function (file) {
                        document.getElementById('ossfile').innerHTML = '<span id="' + file.id + '" ng-model="video_url">' + file.name + ' &nbsp;&nbsp;' + plupload.formatSize(file.size) + '<b class = "percent"></b>'
                            + '<span class="plupload-progress"><span class="plupload-progress-bar" style="width: 0%"></span></span>'
                            + '</span>';
                        set_upload_param(up, '', false);
                    });
                },
                BeforeUpload: function (up, file) {
                    check_object_radio();
                    set_upload_param(up, file.name, true);
                },
                UploadProgress: function (up, file) {
                    var d = document.getElementById(file.id);
                    d.getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + '%</span>';
                    var prog = d.getElementsByTagName('span')[1];
                    var progBar = prog.getElementsByTagName('span')[0];
                    progBar.style.width = 1.2 * file.percent + 'px';
                    progBar.setAttribute('aria-valuenow', file.percent);
                },
                FileUploaded: function (up, file, info) {
                    var fileurl = up.settings.url + get_uploaded_object_name(file.name);
                    $rootScope.video_url = fileurl;
                    up.settings.url = ' ';
                    if (info.status == 200) {
                        //document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = 'upload to oss success, object name:' + get_uploaded_object_name(file.name);
                    } else {
                        document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = info.response;
                    }
                },
                Error: function (up, err) {
                    if (err.code == -600) {
                        $prompt.timeout($scope, {
                            data: {
                                code: 500,
                                message: '选择的视频应该小于2G'
                            }
                        });
                        // document.getElementById('console').innerHTML = "\n选择的文件太大了,请小于1G";
                    } else if (err.code == -601) {
                        $prompt.timeout($scope, {
                            data: {
                                code: 500,
                                message: '只能上传mp4后缀文件'
                            }
                        });
                        // document.getElementById('console').innerHTML = "\n选择的文件后缀不对,只能上传mp4后缀文件";
                    } else if (err.code == -602) {
                        $prompt.timeout($scope, {
                            data: {
                                code: 500,
                                message: '这个文件已经上传过一遍了'
                            }
                        });
                        // document.getElementById('console').innerHTML = "\n这个文件已经上传过一遍了";
                    } else {
                        $prompt.timeout($scope, {
                            data: {
                                code: 500,
                                message: err.response
                            }
                        });
                        // document.getElementById('console').innerHTML = "\nError xml:" + err.response;
                    }
                }
            }
        });
        $scope.uploader.init();
    };
    $scope.pageindex = function () {
        var page_num = $('.paging').find('li.current a').text();
        return page_num;
    };

    $rootScope.clicknum = 0;
    $(document).mouseup(function (e) {
        if ($(e.target).parents('.slide-right-wrap').length == 0 && $(e.target).parents('.modal').length == 0 && $(e.target).parents('.datetimepicker').length == 0 && $(e.target).attr('id') != 'global-zeroclipboard-flash-bridge') {
            if ($('.slide-right-wrap').css('display') == 'block') {
                if (!$rootScope.notactive) {
                    $(e.target).parents('.table-list tbody tr').addClass('active');
                }
                if ($(e.target).parents('.table-list tbody').length == 0) {
                    $('.table-list tr').removeClass('active');
                }
                if ($(e.target).parents('.tab-wrap').length != 0) {
                    $('.slide-right-wrap').stop().hide();
                } else {
                    $('.slide-right-wrap').stop().animate({ 'right': -700 }, 500);
                }
            }
            //重复点击开关
            if ($(e.target).parents('.table-list tbody tr').length != 0) {
                var index = $('.table-list tbody tr').index($(e.target).parents('.table-list tbody tr'));
                $scope.isDetail(index);
                if ($rootScope.clicknum != 0) {
                    $('.table-list tr').removeClass('active');
                }
            } else {
                $rootScope.clicknum = 1;
                $rootScope.temp = 'noclass';
            }
        }
        if ($(e.target).parents('.slide-right-wrap .btn-close').length != 0) {
            $rootScope.clicknum = 1;
            $('.slide-right-wrap').stop().hide();
        }
    });
    $scope.isDetail = function (index) {
        if ($rootScope.clickindex != index) {
            $rootScope.clicknum = 0;
            $rootScope.clickindex = index;
        } else {
            $rootScope.clicknum++;
            if ($rootScope.clicknum == 2) {
                $rootScope.clicknum = 0;
            }
        }
    };
    $(window).resize(function () {
        $scope.searchConfig();
    });
    $scope.searchConfig = function () {
        var width = document.documentElement.clientWidth;
        if (width > 1588) {
            if ($('.search-max-w').height() > 38) {
                $('.search-wrap').removeClass('search-wrap-single');
            } else {
                $('.search-wrap').addClass('search-wrap-single');
            }
        } else {
            if ($('.form-group').length > 3) {
                $('.search-wrap').removeClass('search-wrap-single');
            } else {
                $('.search-wrap').addClass('search-wrap-single');
            }
        }
    };

    $scope.changeDetailTab = function (e) {
        var index = $(e.target).parent().find('li').index($(e.target));
        $(e.target).parent().find('li').removeClass('current');
        $(e.target).parent().find('li').eq(index).addClass('current');
        $(e.target).parents('.detail-tab').find('.tab-cont').hide();
        $(e.target).parents('.detail-tab').find('.tab-cont').eq(index).show();
    };

    $scope.configDetailTab = function () {
        $('.detail-tab .tab-rows li').removeClass('current');
        $('.detail-tab .tab-rows li').eq(0).addClass('current');
        $('.detail-tab .tab-cont').hide();
        $('.detail-tab .tab-cont').eq(0).show();
    };

    //当前日期,和本日期选择器同格式
    $scope.getDateTime = function () {
        var mydatetime = new Date();
        var year = mydatetime.getFullYear();
        var month = mydatetime.getMonth() + 1;
        var date = mydatetime.getDate().toString();
        date = date.length == 1 ? '0' + date : date;
        var hours = mydatetime.getHours().toString();
        hours = hours.length == 1 ? '0' + hours : hours;
        var minutes = mydatetime.getMinutes().toString();
        minutes = minutes.length == 1 ? '0' + minutes : minutes;
        return year + '-' + month + '-' + date + ' ' + hours + ':' + minutes;
    };

    $scope.numSum = function (item1, item2) {
        if (!item1) {
            item1 = 0;
        }
        if (!item2) {
            item2 = 0;
        }
        return parseInt(item1) + parseInt(item2);
    };

    //表单数字等格式直接限制方法
    //限制数字
    $scope.replaceNum = function (obj, attr) {
        if (obj[attr]) {
            obj[attr] = obj[attr].replace(/[^\d.]/g, '');
        }
    };
    $scope.arry_replaceNum = function (v, index, arry, name) {
        if (v) {
            v = v.toString().replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace(/(\d{10})\d+/g, '$1').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
            if (name) {
                arry[index][name] = v;
            } else {
                arry[index] = v;
            }
        }
    };
    //限制两位小数点,限制整数位数
    $scope.replaceNum2 = function (obj, attr, num) {
        if (obj[attr]) {
            if (!num) {
                obj[attr] = obj[attr].replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace(/(\d{10})\d+/g, '$1').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
            } else
                obj[attr] = obj[attr].replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace(eval('/(' + '\\d{' + num + '})\\d+/g'), '$1').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
        }
    };

    //只为数字和字符串
    $scope.replaceNum3 = function (obj, attr) {
        if (obj[attr]) {
            obj[attr] = obj[attr].replace(/[^A-Za-z0-9]/g, '');
        }
    };
    //只为数字
    $scope.replaceNumOnly = function (obj, attr) {
        if (obj[attr]) {
            obj[attr] = obj[attr].replace(/[^0-9]/g, '');
        }
    };
    //只为正负数字
    $scope.replaceNumAll = function (obj, attr) {
        if (obj[attr]) {
            obj[attr] = obj[attr].replace(/[^\d.-]/g, '').replace(/\.{2,}/g, '.').replace(/(\d{10})\d+/g, '$1').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
        }
    };
    //限制一位小数点,限制整数位数
    $scope.replaceNum5 = function (obj, attr, num) {
        if (obj[attr]) {
            if (!num) {
                obj[attr] = obj[attr].replace(/[^\d.]/g, '').replace(/\.{1,}/g, '.').replace(eval('/(' + '\\d{' + num + '})\\d+/g'), '$1').replace(/^(\-)*(\d+)\.(\d).*$/, '$1$2.$3');
            } else
                obj[attr] = obj[attr].replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace(eval('/(' + '\\d{' + num + '})\\d+/g'), '$1').replace(/^(\-)*(\d+)\.(\d).*$/, '$1$2.$3');

        }

    };
    //除汉字外不能输入之外都行
    $scope.replaceNum4 = function (obj, attr) {
        if (obj[attr]) {
            obj[attr] = obj[attr].replace(/[\u4e00-\u9fa5]/g, '');
        }
    };
    //身份证正则
    $scope.isCardID = function (sId) {
        if (!/^\d{17}(\d|x)$/i.test(sId)) {
            return false;
        } else {
            return true;
        }
    };
    //授权帐号正则
    $scope.isShouquan = function (sID) {
        if (!/^1([358]\d{9}|7[013678]\d{8}|4[25789]\d{8})$/i.test(sID)) {
            return false;
        } else {
            return true;
        }
    };
    //联系方式正则
    $scope.linkPhone = function (phone) {
        if (!/^[\d]{11}|[\d]{13}$/i.test(phone)) {
            return false;
        } else {
            return true;
        }
    };

    //版本弹窗（弹窗）
    $scope.editModal = {
        isShow: false,
        closeShow: false,
        title: '版本说明',
        data: {},
        cancel: function () {
            this.hide();
        },
        hide: function () {
            this.isShow = false;
        },
        show: function () {
            var url = http + '/Pub/Index/isRead';
            $Ajax.get(url).then(function (res) {
                if (res.data.code == 1) {
                    $scope.editModal.data = res.data.data;
                    $scope.editModal.data.content = $sce.trustAsHtml($scope.editModal.data.content);
                    $scope.editModal.isShow = true;
                    $scope.countDown = 5;
                    $interval(function () {
                        $scope.countDown = $scope.countDown - 1;
                        if ($scope.countDown == 0) {
                            $scope.editModal.closeShow = true;
                            $scope.annunciate_M.show();
                        }
                    }, 1000, 5);

                } else {
                    $scope.editModal.isShow = false;
                    $scope.annunciate_M.show();
                }

            });
        },
    };

    //通告信息（弹窗）
    $scope.annunciate_M = {
        isShow: false,
        closeShow: false,
        title: '通告信息',
        data: {},
        num: 0,
        cancel: function () {
            this.hide();
        },
        hide: function () {
            this.isShow = false;
        },
        show: function () {
            if (window.location.origin.indexOf('localhost') == -1) {    //判断是否本地，本地调试不用一直弹窗。              
                var url = http + 'Pub/Index/getLastNotice';
                $Ajax.get(url).then(function (res) {
                    if (res.data.data.length != 0) {
                        $scope.annunciate_M.data = res.data.data;
                        $scope.annunciate_M.tanchuangEvent();
                    } else {
                        $scope.annunciate_M.isShow = false;
                    }
                });
            }
        },
        tanchuangEvent: function () {
            $scope.annunciate_M.closeShow = false;
            $scope.notice_content = $sce.trustAsHtml($scope.annunciate_M.data[$scope.annunciate_M.num].notice_content);
            $scope.notice_type = $scope.annunciate_M.data[$scope.annunciate_M.num].notice_type;
            $scope.notice_title = $scope.annunciate_M.data[$scope.annunciate_M.num].notice_title;
            $scope.create_time = $scope.annunciate_M.data[$scope.annunciate_M.num].create_time;
            $scope.annunciate_M.isShow = true;
            $scope.countDown = 10;
            $interval(function () {
                $scope.countDown = $scope.countDown - 1;
                if ($scope.countDown == 0) {
                    $scope.annunciate_M.closeShow = true;
                }
            }, 1000, 10);
        },
        guanbiEvent: function () {
            $scope.annunciate_M.num++;
            if ($scope.annunciate_M.num < $scope.annunciate_M.data.length) {
                $scope.annunciate_M.tanchuangEvent();
            } else {
                $scope.annunciate_M.isShow = false;
            }
        }
    };
    // $scope.editModal.show();

    // 初始化
    $scope.init();

}]);
