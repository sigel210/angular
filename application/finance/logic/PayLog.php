<?php
/**
 * 对账上传
 * User: lcp
 * Date: 2018/8/7
 * Time: 20:05
 */

namespace app\finance\logic;

use app\common\logic\Base;

class PayLog extends Base
{
    const PAY_WAY_ALI = 1;//支付方式-支付宝
    const PAY_WAY_BANK = 2;//支付方式-银行
    const PAY_WAY_TD_ALI = 3;//支付方式-淘大培训-支付宝
    const PAY_WAY_TD_BANK = 4;//支付方式-淘大培训-银行
    //const DATE = '/^([1-9]\d{3}(\-|\/|.)((0[1-9]|1[0-2])|([1-9]|1[0-2]))(\-|\/|.)(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d)|([1-9]\d{3}(\-|\/|.)((0[1-9]|1[0-2])|([1-9]|1[0-2]))(\-|\/|.)(0[1-9]|[1-2][0-9]|3[0-1]))$/';//年月日 时分秒
    const DATE = '/^([1-9]\d{3}-((0[1-9]|1[0-2])|([1-9]|1[0-2]))-(0[1-9]|[1-2][0-9]|3[0-1]))$/';//年月日
    //进账日期要符合这几种格式:YYYY-MM-DD HH:MM:SS, YYYY-M-DD HH:MM:SS,YYYY-MM-D HH:MM:SS，YYYY-M-D HH:MM:SS
    const INCOME_DATE = '/^([1-9]\d{3}-((0[1-9]|1[0-2])|([1-9]|1[0-2])|[1-9])-(0[1-9]|[1-2][0-9]|3[0-1]|[1-9])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d)$/';
    //体现日期要符合这几种格式:YYYY-MM-DD ，YYYY-M-DD，YYYY-MM-D，YYYY-M-D
    const WITHDRAW_DATE = '/^([1-9]\d{3}-((0[1-9]|1[0-2])|([1-9]|1[0-2])|[1-9])-(0[1-9]|[1-2][0-9]|3[0-1]|[1-9]))$/';
    const AMOUNT = '/^(\d{1,9})(\.\d{1,2})$/';
    private $payWay = NULL;
    private $_tempKeys = [];

    /**
     * 获取模版
     */
    public function getTmp()
    {
        $data[] = ['type' => self::PAY_WAY_ALI, 'temp_url' => config('database.http_host') . '/upload/file/alipay.xlsx'];
        $data[] = ['type' => self::PAY_WAY_BANK, 'temp_url' => config('database.http_host') . '/upload/file/bank.xlsx'];
        $data[] = ['type' => self::PAY_WAY_TD_ALI, 'temp_url' => config('database.http_host') . '/upload/file/taoda_alipay.xlsx'];
        $data[] = ['type' => self::PAY_WAY_TD_BANK, 'temp_url' => config('database.http_host') . '/upload/file/taoda_bank.xlsx'];
        return $data;
    }

    /**
     * 验证数据
     * @param $data
     * @param $contents
     * @param $tempKeys
     * @return array|string
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function checkImport($data, $contents, $tempKeys)
    {
        $this->payWay = $data;

        $this->payWay = $this->payWay['type'];

        $this->_tempKeys = $tempKeys;

        if ($this->payWay == self::PAY_WAY_ALI) {
            list ($datas, $errors) = $this->_checkContentByAli($contents);
        } else if ($this->payWay == self::PAY_WAY_BANK) {
            list ($datas, $errors) = $this->_checkContentByBank($contents);
        } else if ($this->payWay == self::PAY_WAY_TD_ALI) {
            list ($datas, $errors) = $this->_checkContentByTdAli($contents);
        } else if ($this->payWay == self::PAY_WAY_TD_BANK) {
            list ($datas, $errors) = $this->_checkContentByTdBank($contents);
        }

        if ($errors) {
            return [false, $errors];
        } else {
            $line = count($datas);
            $ret = false;
            try {
                $payLogModel = new \app\finance\model\PayLog();
                $ret = $payLogModel->addData($datas);
            } catch (\Exception $e) {
                return $e->getMessage();
            }
            return [$ret, $line];
        }
    }

    /**
     * 校验天下网商-支付宝
     * @param $contents
     * @return array
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    private function _checkContentByAli($contents)
    {
        $errors = $datas = $data = $tradeNos = $uniqueKeys = [];
        $nowDate = format_time();
        foreach ($contents as $line => $value) {
            if ($value['A'] == '' && $value['B'] == '' && $value['C'] == '' && $value['D'] == '' && $value['E'] == ''
                && $value['F'] == '' && $value['G'] == '') {
                $errors[] = ['line' => $line, 'error' => '文件不可为空'];
                continue;
            }
            $data['pay_account'] = trim($value[$this->_tempKeys['pay_account']]);
            if (empty($data['pay_account'])) {
                $errors[] = ['line' => $line, 'error' => '收款方支付宝不能为空'];
                continue;
            }
            $data['trade_no'] = preg_replace('/\s*/', '', trim($value[$this->_tempKeys['trade_no']]));
            if (empty($data['trade_no'])) {
                $errors[] = ['line' => $line, 'error' => '交易号不能为空'];
                continue;
            }
            /*if (!preg_match('/^[a-zA-Z0-9]{1,50}$/', $data['trade_no'])) {
                $errors[] = array('line' => $line, 'error' => '交易号必需为1-50位数字或字母');
                continue;
            }*/
            $data['pay_amount'] = trim($value[$this->_tempKeys['pay_amount']]);
            if (empty($data['pay_amount'])) {
                $errors[] = ['line' => $line, 'error' => '金额不能为空'];
                continue;
            }
            if (!preg_match('/^((\d|[123456789]\d*)(\.\d{1,2})?)$/', $data['pay_amount'])) {
                $errors[] = ['line' => $line, 'error' => '金额不正确'];
                continue;
            }
            $data['pay_name'] = trim($value[$this->_tempKeys['pay_name']]);
            if (empty($data['pay_name'])) {
                $errors[] = ['line' => $line, 'error' => '付款名不能为空'];
                continue;
            }
            /*if (!preg_match('/^[\x{4e00}-\x{9fa5}A-Za-z0-9\(\)\（\）]+$/u', $data['pay_name'])) {
                $errors[] = array('line' => $line, 'error' => '付款名必须为中文、英文和数字字符');
                continue;
            }*/
            $data['customer_account'] = trim($value[$this->_tempKeys['customer_account']]);
            if (empty($data['customer_account'])) {
                $errors[] = ['line' => $line, 'error' => '客户支付宝不能为空'];
                continue;
            }
            /*if (!preg_match('/^.{1,30}$/', $data['customer_account'])) {
                $errors[] = array('line' => $line, 'error' => '客户支付宝账号大于30位');
                continue;
            }*/
            $income_time = trim($value[$this->_tempKeys['income_time']]);
            if (empty($income_time)) {
                $errors[] = ['line' => $line, 'error' => '进账日期不能为空'];
                continue;
            }

            if (!preg_match(self::DATE, $income_time)) {
                $errors[] = ['line' => $line, 'error' => '进账日期格式不正确'];
                continue;
            }
            $withdraw_time = trim($value[$this->_tempKeys['withdraw_time']]);
            if (empty($withdraw_time)) {
                $errors[] = ['line' => $line, 'error' => '支付宝提现日期不能为空'];
                continue;
            }
            if (!preg_match(self::DATE, $withdraw_time)) {
                $errors[] = ['line' => $line, 'error' => '支付宝提现日期格式不正确'];
                continue;
            }
            $md5Key = md5($this->payWay . $data['trade_no'] . $data['pay_amount'] . $data['pay_name']);
            if (isset($uniqueKeys[$md5Key])) {
                $errors[] = array('line' => $line, 'error' => '交易信息重复');
                continue;
            }
            $uniqueKeys[$md5Key] = $line;
            $data['income_time'] = date('Y-m-d H:i:s', strtotime($income_time));
            $data['withdraw_time'] = date('Y-m-d H:i:s', strtotime($withdraw_time));
            $data['create_time'] = $nowDate;
            $data['update_time'] = $nowDate;
            $data['pay_way'] = $this->payWay;
            $data['md5_key'] = $md5Key;
            $datas[] = $data;
        }
        //有错误数据，直接返回
        if ($errors) {
            return [$datas, $errors];
        } else {
            //检查数据是否存在
            $errors = $this->_getLogByKey($uniqueKeys);
            return [$datas, $errors];
        }
    }

    /**
     * 检验天下网商-银行卡
     * @param $contents
     * @return array
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    private function _checkContentByBank($contents)
    {
        $errors = $datas = $data = $uniqueKeys = [];
        $nowDate = format_time();
        foreach ($contents as $line => $value) {
            if ($value['A'] == '' && $value['B'] == '' && $value['C'] == '' && $value['D'] == '' && $value['E'] == '') {
                $errors[] = ['line' => $line, 'error' => '文件不可为空'];
                continue;
            }

            $data['pay_amount'] = trim($value[$this->_tempKeys['pay_amount']]);
            if (empty($data['pay_amount'])) {
                $errors[] = ['line' => $line, 'error' => '金额不能为空'];
                continue;
            }
            if (!preg_match('/^((\d|[123456789]\d*)(\.\d{1,2})?)$/', $data['pay_amount'])) {
                $errors[] = ['line' => $line, 'error' => '金额不正确'];
                continue;
            }
            $data['pay_name'] = trim($value[$this->_tempKeys['pay_name']]);
            if (empty($data['pay_name'])) {
                $errors[] = ['line' => $line, 'error' => '付款名不能为空'];
                continue;
            }
            /*if (!preg_match('/^[\x{4e00}-\x{9fa5}A-Za-z0-9\(\)\（\）]+$/u', $data['pay_name'])) {
                $errors[] = array('line' => $line, 'error' => '付款名必须为中文、英文和数字字符');
                continue;
            }*/
            $data['customer_account'] = trim($value[$this->_tempKeys['customer_account']]);
            if (empty($data['customer_account'])) {
                $errors[] = ['line' => $line, 'error' => '客户对账账号不能为空'];
                continue;
            }
            /*if (!preg_match('/^\d{1,35}$/', $data['customer_account'])) {
                $errors[] = array('line' => $line, 'error' => '客户对账账号最大长度35位数字');
                continue;
            }*/
            $income_time = trim($value[$this->_tempKeys['income_time']]);
            if (empty($income_time)) {
                $errors[] = ['line' => $line, 'error' => '进账日期不能为空'];
                continue;
            }
            if (!preg_match(self::DATE, $income_time)) {
                $errors[] = ['line' => $line, 'error' => '进账日期格式不正确'];
                continue;
            }
            $data['customer_bank'] = trim($value[$this->_tempKeys['customer_bank']]);
            if (empty($data['customer_bank'])) {
                $errors[] = ['line' => $line, 'error' => '开户网点不能为空'];
                continue;
            }

            $md5Key = md5($this->payWay . $data['pay_name'] . $data['pay_amount'] . $income_time);
            if (isset($uniqueKeys[$md5Key])) {
                $errors[] = array('line' => $line, 'error' => '交易信息重复');
                continue;
            }
            $uniqueKeys[$md5Key] = $line;
            $data['income_time'] = date('Y-m-d H:i:s', strtotime($income_time));
            $data['create_time'] = $nowDate;
            $data['update_time'] = $nowDate;
            $data['pay_way'] = $this->payWay;
            $data['md5_key'] = $md5Key;
            $datas[] = $data;
        }
        //有错误数据，直接返回
        if ($errors) {
            return [$datas, $errors];
        } else {
            //检查数据是否存在
            $errors = $this->_getLogByKey($uniqueKeys);
            return [$datas, $errors];
        }
    }

    /**
     * 校验淘大-支付宝
     * @param $contents
     * @return array
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     *
     */
    private function _checkContentByTdAli($contents)
    {
        $errors = $datas = $data = $tradeNos = $uniqueKeys = [];
        $nowDate = format_time();
        foreach ($contents as $line => $value) {
            if ($value['A'] == '' && $value['B'] == '' && $value['C'] == '' && $value['D'] == '' && $value['E'] == '') {
                continue;
            }

            $data['customer_account'] = trim($value[$this->_tempKeys['customer_account']]);
            if (empty($data['customer_account'])) {
                $errors[] = ['line' => $line, 'error' => '客户支付宝不能为空'];
                continue;
            }

            $data['trade_no'] = preg_replace('/\s*/', '', trim($value[$this->_tempKeys['trade_no']]));
            if (empty($data['trade_no'])) {
                $errors[] = ['line' => $line, 'error' => '交易号不能为空'];
                continue;
            }

            $income_time = trim($value[$this->_tempKeys['income_time']]);
            if (empty($income_time)) {
                $errors[] = ['line' => $line, 'error' => '进账日期不能为空'];
                continue;
            }
            if (!preg_match(self::INCOME_DATE, $income_time)) {
                $errors[] = array('line' => $line, 'error' => '进账日期格式不正确');
                continue;
            }

            $data['pay_amount'] = trim($value[$this->_tempKeys['pay_amount']]);
            if (empty($data['pay_amount'])) {
                $errors[] = ['line' => $line, 'error' => '金额不能为空'];
                continue;
            }

            if (!preg_match('/^((\d|[123456789]\d*)(\.\d{1,2})?)$/', $data['pay_amount'])) {
                $errors[] = ['line' => $line, 'error' => '金额不正确'];
                continue;
            }

            $withdraw_time = trim($value[$this->_tempKeys['withdraw_time']]);
            if (empty($withdraw_time)) {
                $errors[] = ['line' => $line, 'error' => '支付宝提现日期不能为空'];
                continue;
            }
            if (!preg_match(self::WITHDRAW_DATE, $withdraw_time)) {
                $errors[] = array('line' => $line, 'error' => '支付宝提现日期格式不正确');
                continue;
            }

            //支付方式,交易号,支付金额生成唯一值
            $md5Key = md5($this->payWay . $data['trade_no'] . $data['pay_amount']);
            if (isset($uniqueKeys[$md5Key])) {
                $errors[] = array('line' => $line, 'error' => '交易信息重复');
                continue;
            }

            $uniqueKeys[$md5Key] = $line;
            $data['income_time'] = date('Y-m-d H:i:s', strtotime($income_time));
            $data['withdraw_time'] = date('Y-m-d H:i:s', strtotime($withdraw_time));
            $data['create_time'] = $nowDate;
            $data['update_time'] = $nowDate;
            $data['pay_way'] = $this->payWay;
            $data['md5_key'] = $md5Key;
            $datas[] = $data;
        }
        //有错误数据，直接返回
        if ($errors) {
            return [$datas, $errors];
        } else {
            //检查数据是否存在
            $errors = $this->_getLogByKey($uniqueKeys);
            return [$datas, $errors];
        }
    }

    /**
     * 检验淘大-银行卡
     * @param $contents
     * @return array
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     **/
    private function _checkContentByTdBank($contents)
    {
        $errors = $datas = $data = $uniqueKeys = [];
        $nowDate = format_time();
        foreach ($contents as $line => $value) {
            if ($value['A'] == '' && $value['B'] == '' && $value['C'] == '') {
                continue;
            }

            $income_time = trim($value[$this->_tempKeys['income_time']]);
            if (empty($income_time)) {
                $errors[] = ['line' => $line, 'error' => '进账日期不能为空'];
                continue;
            }
            if (!preg_match(self::WITHDRAW_DATE, $income_time)) {
                $errors[] = array('line' => $line, 'error' => '进账日期格式不正确');
                continue;
            }

            $data['pay_amount'] = trim($value[$this->_tempKeys['pay_amount']]);
            if (empty($data['pay_amount'])) {
                $errors[] = ['line' => $line, 'error' => '金额不能为空'];
                continue;
            }
            if (!preg_match('/^((\d|[123456789]\d*)(\.\d{1,2})?)$/', $data['pay_amount'])) {
                $errors[] = array('line' => $line, 'error' => '金额不正确');
                continue;
            }

            $data['pay_name'] = trim($value[$this->_tempKeys['pay_name']]);
            if (empty($data['pay_name'])) {
                $errors[] = ['line' => $line, 'error' => '付款名不能为空'];
                continue;
            }

            $md5Key = md5($this->payWay . $data['pay_name'] . $data['pay_amount'] . $income_time);
            if (isset($uniqueKeys[$md5Key])) {
                $errors[] = array('line' => $line, 'error' => '交易信息重复');
                continue;
            }
            $uniqueKeys[$md5Key] = $line;
            $data['income_time'] = date('Y-m-d H:i:s', strtotime($income_time));;
            $data['create_time'] = $nowDate;
            $data['update_time'] = $nowDate;
            $data['pay_way'] = $this->payWay;
            $data['md5_key'] = $md5Key;
            $datas[] = $data;
        }
        //有错误数据，直接返回
        if ($errors) {
            return [$datas, $errors];
        } else {
            //检查数据是否存在
            $errors = $this->_getLogByKey($uniqueKeys);
            return [$datas, $errors];
        }
    }

    /**
     * 检查数据是否已存在
     * @param $uniqueKeys
     * @return array
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    private function _getLogByKey($uniqueKeys = [])
    {
        $errors = [];
        foreach ($uniqueKeys as $key => $v) {
            $arrUniqueKeys[] = $key;
        }
        if (!empty($arrUniqueKeys)) {
            $payLoyModel = new \app\finance\model\PayLog();
            $result = $payLoyModel->checkExist($arrUniqueKeys);
            if ($result) {
                foreach ($result as $value) {
                    if (isset($uniqueKeys[$value['md5_key']])) {
                        $errors[] = ['line' => $uniqueKeys[$value['md5_key']], 'error' => '数据已导入过'];
                    }
                }
            }
        }
        return $errors;
    }

}