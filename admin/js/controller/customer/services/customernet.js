// net服务
app.registerService('CustomerNetService', ['$Ajax', 'UserService', '$rootScope', function ($Ajax, UserService, $rootScope) {
        var http = $rootScope.http;
        //爱柚编辑订单-详情
        this.getAiyouDetail = function (req) {
            var url = http + '/Crm/Order/detailForUpdate&order_id=' + req + '&second_product_id=10217';
            return $Ajax.get(url);
        };
        //爱柚产品下拉
        this.getProductList = function () {
            var url = http + '/Pub/DropDown/getAiyoProduct';
            return $Ajax.get(url);
        };

        //爱柚产品编辑
        this.editAiYou = function (req) {
            var url = http + '/Crm/Order/update';
            return $Ajax.post(url, req);
        };

        // 获取业务线分布
        this.getProductLevels = function (req) {
            var url = http + '/Crm/CustomerPrivate/getAllPoolLeve&' + $.param(req);
            return $Ajax.get(url);
        };
        // 获取权限点
        this.getMyDB = function () {
            var url = http + '/Crm/index/myDb';
            return $Ajax.get(url);
        };
        // 基本信息模块
        this.base = {
            getDetail: function (req) {
                var url = http + '/Crm/CustomerPrivate/basicInfo&' + $.param(req);
                return $Ajax.get(url);
            },
            update: function (req) {
                var url = http + '/Crm/CustomerPrivate/updateBasicInfo';
                return $Ajax.post(url, req);
            },
            goPublic: function (req) {
                var url = http + '/Crm/CustomerPrivate/goPublic';
                return $Ajax.post(url, req);
            },
            goPrivate: function (req) {
                var url = http + '/Crm/CustomerPublic/goPrivate';
                return $Ajax.post(url, req);
            },
            // 资源管理
            sourceInfoEdit: function (req) {
                var url = http + '/Resource/CustomerResource/edit';
                return $Ajax.post(url, req);
            },
            deleteCustomer_id: function (req) {
                var url = http + '/Resource/CustomerResource/delete';
                return $Ajax.post(url, req);
            },
            // 基本模块用
            getAdmUser: function (req) {
                var url = http + '/Resource/CustomerResource/getAdmUser';
                return $Ajax.post(url, req);
            },
            getMoveSeller: function (req) {
                var url = http + '/Crm/Common/getMoveSeller&' + $.param(req);
                return $Ajax.get(url);
            },
            allot: function (req) {
                var url = http + 'Resource/CustomerResource/allot';
                return $Ajax.post(url, req);
            },
            allotPublic: function (req) {
                var url = http + '/Crm/CustomerPublic/allot';
                return $Ajax.post(url, req);
            },
            transfer: function (req) {
                var url = http + '/Crm/Customer/transfer';
                return $Ajax.post(url, req);
            }

        };
        // 基本信息模块
        // 联系模块 start
        this.contact = {
            getDetail: function (req) {
                var url = http + '/Crm/CustomerPrivate/contactInfo&' + $.param(req);
                return $Ajax.get(url);
            },
            update: function (req) {
                var url = http + '/Crm/CustomerPrivate/updateContactInfo';
                return $Ajax.post(url, req);
            }
        };
        // 联系模块 end

        // 支付模块 start
        this.bill = {
            getDetail: function (req) {
                var url = http + '/Crm/OrderReceived/detail&received_id=' + req;
                return $Ajax.get(url);
            },
            delete: function (req) {
                var url = http + '/Crm/OrderReceived/delete&received_id=' + req;
                return $Ajax.get(url);
            },
            getList: function (orderId) {
                var url = http + '/Crm/OrderReceived/index&order_id=' + orderId;
                return $Ajax.get(url);
            },
            update: function (req) {
                var url = http + '/Crm/OrderReceived/update';
                return $Ajax.post(url, req);
            },
            checkBill: function (req) {
                var url = http + 'Crm/OrderReceived/verify';
                return $Ajax.post(url, req);
            },
            checkBeforeUpdate: function (req) {
                var url = http + 'Crm/OrderReceived/checkBeforeUpdate&' + $.param(req);
                return $Ajax.get(url);
            },
            checkBeforeDelete: function (req) {
                var url = http + 'Crm/OrderReceived/checkBeforeDelete&' + $.param(req);
                return $Ajax.get(url);
            },
            checkBeforeVerify: function (req) {
                var url = http + 'Crm/OrderReceived/checkBeforeVerify&' + $.param(req);
                return $Ajax.get(url);
            }

        };
        // 支付模块 end

        // 跟进模块 start
        this.follow = {
            insert: function (req) {
                var url = http + '/Crm/CustomerComment/insert';
                return $Ajax.post(url, req);
            },
            getList: function (req) {
                var url = http + '/Crm/CustomerComment/index&';
                return $Ajax.get(url + $.param(req));
            },
            getLastComment: function (req) {
                var url = http + '/Crm/CustomerComment/getLastComment&';
                return $Ajax.get(url + $.param(req));
            },
            uploadImg: function (req, scope) {
                var url = http + 'Crm/CustomerComment/uploadPic';
                return $Ajax.fileUpload(url, req, scope);
            }
        };
        // 跟进模块 end

        // 调研模块 start
        this.survey = {
            delete: function (req) {
                var url = http + '/Crm/survey/delete&survey_id=' + req;
                return $Ajax.get(url);
            },
            getList: function (req) {
                var url = http + '/Crm/survey/index&order_id=' + req;
                return $Ajax.get(url);
            },
            getDetail: function (req, orderId) {
                var url = http + '/Crm/survey/detail&survey_id=' + req + '&order_id=' + orderId;
                return $Ajax.get(url);
            },
            createURL: function (req) {
                var url = http + 'Crm/survey/createUrl&';
                return $Ajax.get(url + $.param(req));
            }
        };
        // 调研模块 end

        // 开票管理模块 start
        this.tax = {
            update: function (req) {
                var url = http + '/Crm/CustomerTax/update';
                return $Ajax.post(url, req);
            },
            getList: function (req) {
                var url = http + '/Crm/CustomerTax/index&' + $.param(req);
                return $Ajax.get(url);
            },
            delete: function (req) {
                var url = http + '/Crm/CustomerTax/delete&' + $.param(req);
                return $Ajax.get(url);
            },
            insert: function (req) {
                var url = http + '/Crm/CustomerTax/insert';
                return $Ajax.post(url, req);
            },
            getDetailForApply: function (req) {
                var url = http + '/Crm/Order/detailForTax&order_id=' + req;
                return $Ajax.get(url);
            },
            checkBeforeDelayedPayment: function (req) {
                var url = http + '/Crm/Order/checkBeforeDelayedPayment';
                return $Ajax.post(url, req);
            }
        };
        // 开票管理模块 end
        // 邮寄地址 start
        this.address = {
            update: function (req) {
                var url = http + '/Crm/CustomerAddress/update';
                return $Ajax.post(url, req);
            },
            getList: function (req) {
                var url = http + '/Crm/CustomerAddress/index&' + $.param(req);
                return $Ajax.get(url);
            },
            delete: function (req) {
                var url = http + '/Crm/CustomerAddress/delete&' + $.param(req);
                return $Ajax.get(url);
            },
            insert: function (req) {
                var url = http + '/Crm/CustomerAddress/insert';
                return $Ajax.post(url, req);
            }
        };
        // 邮寄地址end

        // 营收/退款模块 start
        this.orderIncome = {
            // 通用
            getList: function (req, second_product_id) {
                var url = http + '/Crm/OrderIncome/index&order_id=' + req + '&second_product_id=' + second_product_id;
                return $Ajax.get(url);
            },
            changeClass: function (req) {
                var url = http + '/Crm/Order/changeClass';
                return $Ajax.post(url, req);
            }
        };
        // 营收/退款模块 end

        // 学员模块 start
        this.student = {
            insert: function (req) {
                var url = http + '/Crm/OrderStudent/insert';
                return $Ajax.post(url, req);
            },
            getList: function (req, product_id) {
                var url;
                url = http + '/Crm/OrderStudent/index&order_id=' + req + '&second_product_id=' + product_id;
                return $Ajax.get(url);
            },
            delete: function (req, product_id) {
                var url;
                url = http + '/Crm/OrderStudent/delete&student_id=' + req + '&second_product_id=' + product_id;
                return $Ajax.get(url, req);
            },
            getDetail: function (req, product_id) {
                var url;
                url = http + '/Crm/OrderStudent/detail&student_id=' + req + '&second_product_id=' + product_id;
                return $Ajax.get(url);
            },
            update: function (req, product_id) {
                var url;
                url = http + '/Crm/OrderStudent/update' + '&second_product_id=' + product_id;
                return $Ajax.post(url, req);
            },
            updateClass: function (req) {
                var url;
                url = http + '/Crm/OrderStudent/updateClass';
                return $Ajax.post(url, req);
            },
            getClassList: function (req, second_product_id) {
                var url = http + '/Crm/OrderStudent/getChangeClassList&third_product_id=' + req + '&second_product_id=' + second_product_id;
                return $Ajax.get(url);
            }
        };
        // end

        // 订单模块 start
        this.order = {
            uploadImg: function (req, scope) {
                var url = http + 'Crm/Order/uploadPic';
                return $Ajax.fileUpload(url, req, scope);
            },
            checkApprovalStatus: function (req) {
                var url = http + '/Crm/Order/checkApply';
                return $Ajax.post(url, req);
            },
            checkUpdate: function (req) {
                var url = http + '/Crm/Order/checkUpdate&order_id=' + req;
                return $Ajax.get(url);
            },
            // 订单编辑前判断
            checkBeforeUpdate: function (req) {
                var url = http + '/Crm/Order/checkBeforeUpdate&' + $.param(req);
                return $Ajax.get(url);
            },
            getList: function (req) {
                var url = http + '/Crm/Order/index&' + $.param(req);
                return $Ajax.get(url);
            },
            getDetail: function (req, type) {
                var url = http + '/Crm/Order/detail&order_id=' + req + '&second_product_id=' + type;
                return $Ajax.get(url);
            },
            //删除订单
            delete: function (req) {
                var url = http + '/Crm/Order/delete&order_id=' + req;
                return $Ajax.get(url);
            },
            // 订单按钮
            applyTax: function (req) {
                var url = http + '/Crm/Order/applyTax';
                return $Ajax.post(url, req);
            },
            applyExecute: function (req) {
                var url = http + '/Crm/Order/applyExecute';
                return $Ajax.post(url, req);
            },
            applyRefund: function (req) {
                var url = http + '/Crm/Order/applyRefund';
                return $Ajax.post(url, req);
            },
            getRefundInfo: function (req) {
                var url = http + '/Crm/Order/getRefundInfo&order_id=' + req;
                return $Ajax.get(url);
            },
            // 订单合同
            getOrderImg: function (req) {
                var url = http + '/Crm/Order/getOrderImg&order_id=' + req;
                return $Ajax.post(url);
            }
        };
        // 订单模块 end
        // 按钮检测
        this.button = {
            checkBeforeExecute: function (req) {
                var url = http + '/Crm/Order/checkBeforeExecute&' + $.param(req);
                return $Ajax.get(url);
            },
            checkBeforeRefund: function (req) {
                var url = http + '/Crm/Order/checkBeforeRefund&' + $.param(req);
                return $Ajax.get(url);
            },
            checkBeforeTax: function (req) {
                var url = http + '/Crm/Order/checkBeforeTax&' + $.param(req);
                return $Ajax.get(url);
            },
            checkBeforeDelete: function (req) {
                var url = http + '/Crm/Order/checkBeforeDelete&' + $.param(req);
                return $Ajax.get(url);
            },
            checkBeforeUploadImg: function (req) {
                var url = http + '/Crm/Order/checkBeforeUploadImg&' + $.param(req);
                return $Ajax.get(url);
            },
            checkBeforeInsertBill: function (req) {
                var url = http + '/Crm/OrderReceived/checkBeforeInsert&order_id=' + req;
                return $Ajax.get(url);
            },
            checkBeforeDeleteBill: function (req) {
                var url = http + '/Crm/OrderReceived/checkBeforeDelete&received_id=' + req;
                return $Ajax.get(url);
            },
            checkBeforeInsertStu: function (req) {
                var url = http + '/Crm/OrderStudent/checkBeforeInsert&' + $.param(req);
                return $Ajax.get(url);
            },
            checkBeforeUpdateClass: function (req) {
                var url = http + '/Crm/OrderStudent/checkBeforeUpdateClass&' + $.param(req);
                return $Ajax.get(url);
            },
            checkBeforeUpdateStu: function (req) {
                var url = http + '/Crm/OrderStudent/checkBeforeUpdate&' + $.param(req);
                return $Ajax.get(url);
            },
            checkBeforeDeleteStu: function (req) {
                var url = http + '/Crm/TeXunStudent/checkBeforeDelete&' + $.param(req);
                return $Ajax.get(url);
            },
            checkBeforeCreateUrl: function (req, second_product_id) {
                var url = http + '/Crm/Survey/checkBeforeCreateUrl&order_id=' + req + '&second_product_id=' + second_product_id;
                return $Ajax.get(url);
            },
            checkBeforeDeleteSurvey: function (req) {
                var url = http + '/Crm/TeXunSurvey/checkBeforeDelete&order_id=' + req;
                return $Ajax.get(url);
            }
        };

        // 通用请求
        this.common = {
            checkBeforeDeleteStu: function (req) {
                var url = http + '/Crm/OrderStudent/checkBeforeDelete&' + $.param(req);
                return $Ajax.get(url);
            },
        };

        // 用于设置
        this.config = {},
                this.setCustomerId = function (id) {
                    this.config.customer_id = id;
                };
        this.setOperatePid = function (id) {
            this.config.operate_pid = id;
        };
        // 产品模块
        this.product = {
            getList: function (req) {
                var url = http + '/Crm/Product/index&order_id=' + req;
                return $Ajax.get(url);
            },
            getDetail: function (req) {
                var url = http + '/Crm/Product/detail&' + $.param(req);
                return $Ajax.get(url);
            },
            // getChangeList: function (req) {
            //     var url = http + '/Crm/Product/getChangeList&contract_id=' + req;
            //     return $Ajax.get(url);
            // },
            getChangeDetail: function (req) {
                var url = http + '/Crm/Product/getChangeDetail&contract_change_id=' + req;
                return $Ajax.get(url);
            },
            getGiftDetail: function (req) {
                var url = http + '/Crm/Product/getGiftDetail&contract_change_id=' + req;
                return $Ajax.get(url);
            }
        };
        // 变更与赠送模块
        this.change = {
            getList: function (req) {
                var url = http + '/Crm/AiyoChange/index&order_id=' + req;
                return $Ajax.get(url);
            },
            getDetail: function (req) {
                var url = http + '/Crm/AiyoChange/detail&' + $.param(req);
                return $Ajax.get(url);
            },
            changeDelete: function (change_no, order_id) {
                var url = http + '/Crm/AiyoChange/delete&change_no=' + change_no + '&order_id=' + order_id;
                return $Ajax.get(url);
            },
            getGiftDetail: function (req) {
                var url = http + '/Crm/AiyoGift/detail&' + $.param(req);
                return $Ajax.get(url);
            },
            giftDelete: function (change_no, order_id) {
                var url = http + '/Crm/AiyoGift/delete&change_no=' + change_no + '&order_id=' + order_id;
                return $Ajax.get(url);
            },
            // 服务变更执行
            applyServiceChangeExec: function (req) {
                var url = http + '/Crm/AiyoChange/applyServiceChangeExec&' + $.param(req);
                return $Ajax.get(url);
            },
            // 赠送执行
            checkBeforeGift: function (req) {
                var url = http + '/Crm/AiyoGift/checkBeforeGift&' + $.param(req);
                return $Ajax.get(url);
            },
            // 赠送执行
            applyGift: function (req) {
                var url = http + '/Crm/AiyoGift/applyGift&' + $.param(req);
                return $Ajax.get(url);
            },
            // 赠送执行
            checkBeforeInsert: function (req) {
                var url = http + '/Crm/AiyoChange/checkBeforeInsert&' + $.param(req);
                return $Ajax.get(url);
            },
            // check新建赠送
            checkBeforeInsertGift: function (req) {
                var url = http + 'Crm/AiyoGift/checkBeforeInsert&' + $.param(req);
                return $Ajax.get(url);
            },
            // check 变更执行
            checkBeforeServiceChangeExec: function (req) {
                var url = http + 'Crm/AiyoChange/checkBeforeServiceChangeExec&' + $.param(req);
                return $Ajax.get(url);
            },
            // check 变更编辑
            checkBeforeUpdate: function (req) {
                var url = http + 'Crm/AiyoChange/checkBeforeUpdate&' + $.param(req);
                return $Ajax.get(url);
            },
            // check 变更删除
            checkBeforeDelete: function (req) {
                var url = http + 'Crm/AiyoChange/checkBeforeDelete&' + $.param(req);
                return $Ajax.get(url);
            },
            // check 变更编辑
            checkBeforeUpdateGift: function (req) {
                var url = http + 'Crm/AiyoGift/checkBeforeUpdate&' + $.param(req);
                return $Ajax.get(url);
            },
            // check 变更删除
            checkBeforeDeleteGift: function (req) {
                var url = http + 'Crm/AiyoGift/checkBeforeDelete&' + $.param(req);
                return $Ajax.get(url);
            },
            // 纸质协议申请check
            checkBeforePaper: function (req) {
                var url = http + 'Crm/AiyoChange/checkBeforePaper&' + $.param(req);
                return $Ajax.get(url);
            },
        };
        // 合同协议模块
        this.contract = {
            getList: function (req) {
                var url = http + '/Crm/ContractAgreement/getContractAgreementList&order_id=' + req;
                return $Ajax.get(url);
            },
            getDetail: function (req) {
                var url = http + '/Crm/ContractAgreement/getContractDetail&' + $.param(req);
                return $Ajax.get(url);
            },
            getAdditionalAgreementDetail: function (req) {
                var url = http + '/Crm/ContractAgreement/getAdditionalAgreementDetail&' + $.param(req);
                return $Ajax.get(url);
            },
            getEndAgreementDetail: function (req) {
                var url = http + '/Crm/ContractAgreement/getEndAgreementDetail&' + $.param(req);
                return $Ajax.get(url);
            },
            // 编辑签约
            updateContract: function (req) {
                var url = http + '/Crm/ContractAgreement/updateContract';
                return $Ajax.post(url, req);
            },
            // 下载纸质合同
            downPaperContract: function (req) {
                var url = http + '/Crm/ContractAgreement/downPaperContract';
                return $Ajax.post(url, req);
            },
            // 上传合同照片
            uploadContractPicture: function (req, scope) {
                var url = http + '/Crm/ContractAgreement/uploadContractPicture';
                return $Ajax.fileUpload(url, req, scope);
            },
            // 合同上传的图片路径信息入库
            saveContractPic: function (req) {
                var url = http + '/Crm/ContractAgreement/saveContractPic';
                return $Ajax.post(url, req);
            },
            // 新建解除协议
            addEndAgt: function (req) {
                var url = http + '/Crm/ContractAgreement/addEndAgt';
                return $Ajax.post(url, req);
            },
            // 下载补充协议
            downAdditionalAgreement: function (req) {
                var url = http + '/Crm/ContractAgreement/downAdditionalAgreement';
                return $Ajax.post(url, req);
            },
            // 下载解除协议
            downEndAgreement: function (req) {
                var url = http + '/Crm/ContractAgreement/downEndAgreement';
                return $Ajax.post(url, req);
            },
            // 上传合同照片前的检查
            checkBeforeUploadContractPicture: function (req) {
                var url = http + '/Crm/ContractAgreement/checkBeforeUploadContractPicture&order_id=' + req;
                return $Ajax.get(url);
            },
            // 新建解除协议前检查
            checkBeforeAddEndAgt: function (req) {
                var url = http + '/Crm/ContractAgreement/checkBeforeAddEndAgt&order_id=' + req;
                return $Ajax.get(url);
            },
            // 获得合同原来的照片
            getOriginPics: function (req) {
                var url = http + '/Crm/ContractAgreement/getOriginPics&order_id=' + req;
                return $Ajax.get(url);
            },
            // 获得协议原来的附件
            getOriginAttach: function (req) {
                var url = http + '/Crm/ContractAgreement/getOriginAttach&agreement_id=' + req;
                return $Ajax.get(url);
            },
            // 协议上传的附件路径信息入库
            saveAgtAttachs: function (req) {
                var url = http + '/Crm/ContractAgreement/saveAgtAttachs';
                return $Ajax.post(url, req);
            },
            // 标准合同列表
            getStandardContractTemplateList: function (req) {
                var url = http + '/Crm/ContractAgreement/getStandardContractTemplateList&' + $.param(req);
                return $Ajax.get(url);
            },
            // 下载标准合同确认
            downStandardContractConfirm: function (req) {
                var url = http + '/Crm/ContractAgreement/downStandardContractConfirm&order_id=' + req;
                return $Ajax.get(url);
            },
            // 发起合同协议审批
            applyAgreement: function (req) {
                var url = http + '/Crm/Order/applyAgreement&' + $.param(req);
                return $Ajax.get(url);
            },
            // 申请纸质协议流程发起
            createApprovalWithPaper: function (req) {
                var url = http + '/Crm/Order/createApprovalWithPaper&' + $.param(req);
                return $Ajax.get(url);
            },
            // 删除解除协议前检查
            checkBeforeDeleteEndAgt: function (req) {
                var url = http + '/Crm/ContractAgreement/checkBeforeDeleteEndAgt&' + $.param(req);
                return $Ajax.get(url);
            },
            // 删除解除协议
            deleteEndAgt: function (req) {
                var url = http + '/Crm/ContractAgreement/deleteEndAgt&' + $.param(req);
                return $Ajax.get(url);
            },
            checkBeforeUpdateContract: function (req) {
                var url = http + '/Crm/ContractAgreement/checkBeforeUpdateContract&' + $.param(req);
                return $Ajax.get(url);
            },
            checkBeforeApplyPaperContract: function (req) {
                var url = http + '/Crm/ContractAgreement/checkBeforeApplyPaperContract&' + $.param(req);
                return $Ajax.get(url);
            },
            checkBeforeDownStandardContract: function () {
                var url = http + '/Crm/ContractAgreement/checkBeforeDownStandardContract';
                return $Ajax.get(url);
            },
            checkBeforeDownPaperContract: function (req) {
                var url = http + '/Crm/ContractAgreement/checkBeforeDownPaperContract&' + $.param(req);
                return $Ajax.get(url);
            },
            checkBeforeApplyContract: function (req) {
                var url = http + '/Crm/ContractAgreement/checkBeforeApplyContract&' + $.param(req);
                return $Ajax.get(url);
            },
            checkBeforeDownAddnAgt: function (req) {
                var url = http + '/Crm/ContractAgreement/checkBeforeDownAddnAgt&' + $.param(req);
                return $Ajax.get(url);
            },
            checkBeforeUploadAgreementAttachment: function () {
                var url = http + '/Crm/ContractAgreement/checkBeforeUploadAgreementAttachment';
                return $Ajax.get(url);
            },
            checkBeforeApplyAddnAgreement: function (req) {
                var url = http + '/Crm/ContractAgreement/checkBeforeApplyAddnAgreement&' + $.param(req);
                return $Ajax.get(url);
            },
            checkBeforeApplyEndPaperContract: function (req) {
                var url = http + '/Crm/ContractAgreement/checkBeforeApplyEndPaperContract&' + $.param(req);
                return $Ajax.get(url);
            },
            checkBeforeDownEndAgt: function (req) {
                var url = http + '/Crm/ContractAgreement/checkBeforeDownEndAgt&' + $.param(req);
                return $Ajax.get(url);
            },
            checkBeforeUploadEndAgreementAttachment: function (req) {
                var url = http + '/Crm/ContractAgreement/checkBeforeUploadEndAgreementAttachment&' + $.param(req);
                return $Ajax.get(url);
            },
            checkBeforeApplyEndAgreement: function (req) {
                var url = http + '/Crm/ContractAgreement/checkBeforeApplyEndAgreement&' + $.param(req);
                return $Ajax.get(url);
            },
            checkBeforeUploadAddnAgreementAttachment: function (req) {
                var url = http + '/Crm/ContractAgreement/checkBeforeUploadAddnAgreementAttachment&' + $.param(req);
                return $Ajax.get(url);
            },
        };
        // 票据信息
        this.ayTax = {
            getList: function (req) {
                var url = http + '/Crm/AiyoTax/index&order_id=' + req;
                return $Ajax.get(url);
            },
            getDetail: function (req) {
                var url = http + '/Crm/AiyoTax/detail&' + $.param(req);
                return $Ajax.get(url);
            }
        };
    }]);
