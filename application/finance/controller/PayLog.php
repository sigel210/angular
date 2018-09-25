<?php
/**
 * 财务中心-对账上传
 * User: lcp
 * Date: 2018/8/3
 * Time: 17:26
 */

namespace app\finance\controller;

use app\common\controller\Base;

class PayLog extends Base
{
    const PAY_WAY_ALI = 1;//支付方式-支付宝
    const PAY_WAY_BANK = 2;//支付方式-银行
    const PAY_WAY_TD_ALI = 3;//支付方式-淘大培训-支付宝
    const PAY_WAY_TD_BANK = 4;//支付方式-淘大培训-银行
    private $payWay = NULL;

    /**
     * 获取支付对账模板
     */
    public function getTemp()
    {
        $payLogLogic = new \app\finance\logic\PayLog();
        $result = $payLogLogic->getTmp();
        $this->rtnList($result);
    }

    /**
     * 上传对账excel校验
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function import()
    {
        $payWay = input('post.');

        $payValidate = new \app\finance\validate\PayLog();
        if (!$payValidate->scene('type')->check($payWay)) {
            $this->rtnError($payValidate->getError());
        }

        $this->payWay = $payWay;

        $this->payWay = $this->payWay['type'];

        if (!isset($_FILES['excel_file'])) {
            $this->rtnError('请上传文件');
        }

        if ($_FILES['excel_file']['size'] <= 0) {
            $this->rtnError('文件不可为空');
        }

        $filename = $_FILES['excel_file']['name'];
        $ext = substr($filename, strrpos($filename, '.') + 1);
        if ($ext != 'xls' && $ext != 'xlsx') {
            $this->rtnError('只支持EXCEL文件导入');
        }

        $name = explode('.', $filename);
        if (in_array($this->payWay, ['1']) && !in_array($name[0], ['alipay'])) {
            $this->rtnError('文件模版名称不正确');
        } elseif (in_array($this->payWay, ['2']) && !in_array($name[0], ['bank'])) {
            $this->rtnError('文件模版名称不正确');
        } elseif (in_array($this->payWay, ['3']) && !in_array($name[0], ['taoda_alipay'])) {
            $this->rtnError('文件模版名称不正确');
        } elseif (in_array($this->payWay, ['4']) && !in_array($name[0], ['taoda_bank'])) {
            $this->rtnError('文件模版名称不正确');
        }

        $contents = auto_import_excel($_FILES['excel_file']['tmp_name'], $ext);
        $line = count($contents);
        if ($line == 1) {
            $this->rtnError('文件内容不能为空');
        }

        // 检查模板
        $tempKeys = $this->_checkContentHeader($contents[1]);
        unset($contents[1]);
        $payLogLogic = new \app\finance\logic\PayLog();
        list($result, $line) = $payLogLogic->checkImport($payWay, $contents, $tempKeys);
        if ($result) {
            /*sort($this->arrIncomeTime);
            $strMinDate = date('Y年m月d日', strtotime($this->arrIncomeTime[0]));
            $strMaxDate = date('Y年m月d日', strtotime(array_pop($this->arrIncomeTime)));
            $arrNotice['notice_type'] = '3';
            $arrNotice['notice_title'] = '对账信息已上传';
            $arrNotice['notice_content'] = "{$strMinDate}至{$strMaxDate}的对账信息已上传系统，请各位及时前往订单信息处进行对账处理。";
            //对接titan，获取销售部门下所有的员工id
            if (!$res = TitanLib::getUserByRoleCode(ROLE_CODE_SELLER . ',' . ROLE_CODE_SELLER_MANAGER)) {
                $this->rtnError('获取数据失败');
            }
            $sale_dept_userIds = join(',', array_unique(array_column($res, 'user_id')));
            $this->sendCommonNotice($arrNotice, $sale_dept_userIds);*/
            $this->rtnSuccess("excel表{$line}条，上传成功{$line}条");
        } else {
            $this->rtnError('', 0, $line);
        }
    }

    /**
     * 检查上传文件的模板
     * @param $fields
     * @return array
     */
    private function _checkContentHeader($fields)
    {
        $tempKeys = [];
        // 获取模板
        $header = $this->_getHeader();

        foreach ($header as $key => $arr) {
            if (!isset($fields[$key])) {
                $this->rtnError('文件模板不正确');
            }
            
            if ($fields[$key] != $arr[0]) {
                $this->rtnError('文件模板不正确');
            }
            $tempKeys[$arr[1]] = $key;
        }
        return $tempKeys;
    }


    /**
     * 获取文件头内容模板
     */
    private function _getHeader()
    {
        $temp[self::PAY_WAY_ALI] = [
            'A' => ['收款方支付宝', 'pay_account'],
            'B' => ['交易号', 'trade_no'],
            'C' => ['进账日期', 'income_time'],
            'D' => ['付款名', 'pay_name'],
            'E' => ['金额', 'pay_amount'],
            'F' => ['支付宝提现日期', 'withdraw_time'],
            'G' => ['客户支付宝', 'customer_account']
        ];
        $temp[self::PAY_WAY_BANK] = [
            'A' => ['进账日期', 'income_time'],
            'B' => ['付款名', 'pay_name'],
            'C' => ['金额', 'pay_amount'],
            'D' => ['客户对账帐号', 'customer_account'],
            'E' => ['开户网点', 'customer_bank']
        ];
        $temp[self::PAY_WAY_TD_ALI] = array(
            'A' => array('客户支付宝', 'customer_account'),
            'B' => array('交易号', 'trade_no'),
            'C' => array('进账日期', 'income_time'),
            'D' => array('金额', 'pay_amount'),
            'E' => array('支付宝提现日期', 'withdraw_time')
        );
        $temp[self::PAY_WAY_TD_BANK] = array(
            'A' => array('进账日期', 'income_time'),
            'B' => array('付款名', 'pay_name'),
            'C' => array('金额', 'pay_amount')
        );
        return $temp[$this->payWay];
    }
}