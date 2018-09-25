<?php

//use PHPExcel;
//use PHPExcel_IOFactory;
//use PHPExcel_Reader_Excel5;
//use PHPExcel_Reader_Excel2007;
//use PHPExcel_Shared_Date;
//use PHPExcel_Writer_Excel5;


/**
 * 调试
 */
function sql() {
    $obj = model('Base');
    echo $obj->getLastSql();
    die;
}

/**
 * 格式化当前时间
 * 
 * @return string 时间
 */
function format_time() {
    return date('Y-m-d H:i:s');
}

/**
 * 发送curl请求
 * 
 * @param array $arrPushData 发送的请求数据
 * @param string $strRemoteUrl 请求地址
 * @param string $key 签名key
 * @return type
 */
function request_by_curl($arrPushData, $strRemoteUrl, $key) {
    $arrSignData = sign($arrPushData, $key);
    $objCurl = curl_init();
    curl_setopt($objCurl, CURLOPT_URL, $strRemoteUrl);
    curl_setopt($objCurl, CURLOPT_POSTFIELDS, $arrSignData);
    curl_setopt($objCurl, CURLOPT_RETURNTRANSFER, true);
    $jsonReturnData = curl_exec($objCurl);
    curl_close($objCurl);
    return json_decode($jsonReturnData, true);
}

/**
 * 签名
 * 
 * @param array $arrData  签名数据
 * @param string $key  签名key
 * @return mixed
 */
function sign($arrData, $key) {
    ksort($arrData);
    $strData = http_build_query($arrData);
    $arrData['sign'] = md5($strData . $key);
    return $arrData;
}

/**
 * 检查签名
 * 
 * @param  array $arrData  签名数据
 * @param string $sign 待检查的签名
 * @param string $key 签名key
 * @return boolean
 */
function check_sign($arrData, $sign, $key) {
    if ($sign != sign($arrData, $key)) {
        return false;
    } else {
        return true;
    }
}

/**
 * 获取客户端IP地址
 * 
 * @param integer $type 返回类型 0 返回IP地址 1 返回IPV4地址数字
 * @param boolean $adv 是否进行高级模式获取（有可能被伪装）
 * @return mixed
 */
function get_client_ip($type = 0, $adv = false) {
    $type = $type ? 1 : 0;
    static $ip = NULL;
    if ($ip !== NULL) {
        return $ip[$type];
    }
    if ($adv) {
        if (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $arr = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
            $pos = array_search('unknown', $arr);
            if (false !== $pos) {
                unset($arr[$pos]);
            }
            $ip = trim($arr[0]);
        } elseif (isset($_SERVER['HTTP_CLIENT_IP'])) {
            $ip = $_SERVER['HTTP_CLIENT_IP'];
        } elseif (isset($_SERVER['REMOTE_ADDR'])) {
            $ip = $_SERVER['REMOTE_ADDR'];
        }
    } elseif (isset($_SERVER['REMOTE_ADDR'])) {
        $ip = $_SERVER['REMOTE_ADDR'];
    }
    
    // IP地址合法验证
    $long = sprintf("%u", ip2long($ip));
    $ip = $long ? [$ip, $long] : ['0.0.0.0', 0];
    return $ip[$type];
}

/**
 * 格式化价格函数（四舍五入保留2位小数）
 * 
 * @param float $price  价格
 * @return float
 */
function sprintf_price($price) {
    return number_format($price, 2, '.', '');
}

/**
 * 树形结构
 * @param type $items
 * @param type $id
 * @param type $pid
 * @param type $son
 * @return type
 */
function get_data_tree($items, $id = 'id', $pid = 'pid', $son = '_child') {
    $tree   = [];  //格式化的树
    $tmpMap = [];  //临时扁平数据

    foreach($items as $item) {
        $tmpMap[$item[$id]] = $item;
    }

    foreach($items as $item) {
        if(isset($tmpMap[$item[$pid]])) {
            $tmpMap[$item[$pid]][$son][] = &$tmpMap[$item[$id]];
        } else {
            $tree[] = &$tmpMap[$item[$id]];
        }
    }
    return $tree;
}

/**
 * 检查手机号格式
 * 
 * @param int $mobile  手机号
 * @return boolean
 */
function check_mobile($mobile) {
    $pattern = '/^1([358]\d{9}|7[013678]\d{8}|4[25789]\d{8})$/';
    if(preg_match($pattern, $mobile)) {
        return true;
    } else {
        return false;
    }
}

/**
 * 检查是否为座机电话号码
 * 
 * @param string $tel  座机号码
 * @return boolean
 */
function check_tel($tel) {
    if(preg_match('/^([0-9]{3,4}[-]?)?[0-9]{7,8}$/', $tel)) {
        return true;
    }
    else {
        return false;
    }
}

/**
 * 检查是否为手机号或座机电话
 * 
 * @param string $phone  电话号码
 * @return boolean
 */
function check_phone($phone) {
    if(check_mobile($phone) || check_tel($phone)) {
        return true;
    } else {
        return false;
    }
}

/**
 * 检查是否是正确的url
 * 
 * @param type $url  url地址
 * @return boolean
 */
function check_url($url) {
    if(!preg_match('/^(http|https):\/\/[\w.]+[\w\/]*[\w.]*\??[\w=&\+\%]*/is', $url)) {
        return false;
    }
    return true;
}

/**
 * 获取当前登录用户ID
 * @return mixed
 */
function get_session_uid() {
    return session(config('USER_AUTH_KEY')) ? session(config('USER_AUTH_KEY')) : 0;
}

/**
 * 获取当前登录用户的部门ID
 * 
 * @return string
 */
function get_session_did() {
    return session('department_id');
}

/**
 * 修复UTF-8转GBK造成的一个非法字符
 * 
 * @param type $str 待修复字符串
 * @return string
 */
function fix_gbkToUtf8($str) {
    return pack("H*",(str_replace('c2a0','2020',bin2hex($str))));
}

/**
 * 二维数组排序
 * @param array $multi_array
 * @param type $sort_field
 * @param type $sort_type
 * @return boolean
 */
function multi_array_sort($multi_array, $sort_field, $sort_type = SORT_ASC) {
    if(empty($multi_array)) {
        return false;
    }
    $arr_field = [];
    foreach($multi_array as $row) {
        if(empty($row)) {
            return false;
        }
        array_push($arr_field,$row[$sort_field]);
    }
    array_multisort($arr_field,$sort_type,$multi_array);
    return $multi_array;
}

/**
 * 生成随机数
 * 
 * @return int
 */
function generate_code() {
    return str_pad(rand(0, 999), 3, '0', STR_PAD_LEFT);
}

/**
 * 是否是日期格式
 * 
 * @param string $date
 * @return boolean
 */
function is_date($date) {
    $date    = strtolower($date);
    $strRule = '/^\d{4}-\d{2}-\d{2}$/';
    return preg_match($strRule,$date) == 1;
}

/**
 * 合并表头 导出excel.xls文件
 * @param $fileName 文件名
 * @param $arrHead 表头
 * @param $data 表值
 * @param $sheet 合并表头
 */
function export_excels($fileName,$arrHead,$data,$sheet) {
    ini_set('memory_limit','-1');

    //对数据进行检验
    if(empty($data) || !is_array($data)) {
        die("导出excel数据不存在");
    }
    //检查文件名
    if(empty($fileName)) {
        exit;
    }

    $date     = date("Y_m_d",time());
    $fileName .= "_{$date}.xls";

    $objPHPExcel = new PHPExcel();
    $objProps    = $objPHPExcel->getProperties();

    //设置表头
    $key = ord("A");
    foreach($arrHead as $v) {
        $colum = chr($key);
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue($colum . '2',$v);
        $key   += 1;
    }

    $column      = 3;
    $objActSheet = $objPHPExcel->getActiveSheet();

    foreach($data as $key => $rows) { //行写入
        $span = ord("A");
        if($span == '65') {
            $objActSheet->setCellValue('A1',$sheet);
            $objActSheet->mergeCells('A1:L1'); //合并
            $objActSheet->getRowDimension(1)->setRowHeight(30); //指定行高
            $objActSheet->getStyle("A1:L1")->getFont()->setSize(12)->setBold(true); //指定行,字体大小/加粗
            $objActSheet->getStyle('A1:L1')->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER); //居中
        }

        foreach($rows as $keyName => $value) {// 列写入
            $j = chr($span);
            if(preg_match('/^[-+]?[0-9]+\.([0-9]+)?$/',$value,$matches)) {
                $objActSheet->setCellValueExplicit($j . $column,$matches[0], PHPExcel_Cell_DataType::TYPE_NUMERIC);
                $objActSheet->getStyle($j . $column)->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1);
                $objActSheet->getColumnDimension($j)->setAutoSize(true);
            }
            elseif(preg_match('/^\d{4}(\-|\/|.)\d{1,2}\1\d{1,2}$/',$value,$matches)) {
                $objActSheet->setCellValue($j . $column,date("Y-m-d",strtotime($matches[0])));
                $objActSheet->getStyle($j . $column)->getNumberFormat()->setFormatCode('yyyy-mm-dd;@');
            }
            else {
                $objActSheet->setCellValueExplicit($j . $column,$value);
            }
            $span++;
        }
        $column++;
    }

    $fileName = iconv("utf-8","gb2312",$fileName);
    //重命名表
    // $objPHPExcel->getActiveSheet()->setTitle('test');
    //打开这是第一个表
    $objPHPExcel->setActiveSheetIndex(0);
    header('Content-Type: application/vnd.ms-excel');
    header("Content-Disposition: attachment;filename=\"$fileName\"");
    header('Cache-Control: max-age=0');

    $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel,'Excel5');
    $objWriter->save('php://output');
    exit;
}

/**
 * 导出excel.xls文件
 * 
 * @param string $fileName 文件名
 * @param array $arrHead   表头
 * @param array $data      表值
 * @return void
 */
function export_excel($fileName, $arrHead, $data) {
    ini_set('memory_limit','-1');

    //对数据进行检验
    if(empty($data) || !is_array($data)) {
        die("导出excel数据不存在");
    }

    //检查文件名
    if(empty($fileName)) {
        exit;
    }

    $date     = date("Y_m_d",time());
    $fileName .= "_{$date}.xls";

    $objPHPExcel = new PHPExcel();
    $objProps    = $objPHPExcel->getProperties();

    //设置表头
    $key = ord("A");
    foreach($arrHead as $v) {
        $colum = chr($key);
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue($colum . '1',$v);
        $key   += 1;
    }

    $column      = 2;
    $objActSheet = $objPHPExcel->getActiveSheet();
    foreach($data as $key => $rows) { //行写入
        $span = ord("A");
        foreach($rows as $keyName => $value) {// 列写入
            $j = chr($span);
            if(preg_match('/^[-+]?[0-9]+\.([0-9]+)?$/',$value,$matches)) {
                $objActSheet->setCellValueExplicit($j . $column,$matches[0],PHPExcel_Cell_DataType::TYPE_NUMERIC);
                $objActSheet->getStyle($j . $column)->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1);
                $objActSheet->getColumnDimension($j)->setAutoSize(true);
            }
            elseif(preg_match('/^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/',$value,$matches)) {
                $objActSheet->setCellValue($j . $column,date("Y-m-d",strtotime($matches[0])));
                $objActSheet->getStyle($j . $column)->getNumberFormat()->setFormatCode('yyyy-mm-dd;@');
            }
            else {
                $objActSheet->setCellValueExplicit($j . $column,$value);
            }
            $span++;
        }
        $column++;
    }

    $fileName = iconv("utf-8","gb2312",$fileName);
    //重命名表
    // $objPHPExcel->getActiveSheet()->setTitle('test');
    //打开这是第一个表
    $objPHPExcel->setActiveSheetIndex(0);
    header('Content-Type: application/vnd.ms-excel');
    header("Content-Disposition: attachment;filename=\"$fileName\"");
    header('Cache-Control: max-age=0');

    $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
    $objWriter->save('php://output');
    exit;
}

/**
 * 导出excel.xls文件：针对超过26列的excel
 * @param string $fileName 文件名
 * @param array $arrHead   表头
 * @param array $data      表值
 */
function export_excel_long($fileName,$arrHead,$data) {
    ini_set('memory_limit','-1');
    
    //对数据进行检验
    if(empty($data) || !is_array($data)) {
        die("导出excel数据不存在");
    }
    //检查文件名
    if(empty($fileName)) {
        exit;
    }

    $date     = date("Y_m_d",time());
    $fileName .= "_{$date}.xls";

    $objPHPExcel = new PHPExcel();
    $objProps    = $objPHPExcel->getProperties();

    //设置表头
    foreach($arrHead as $k => $v) {
        $objPHPExcel->setActiveSheetIndex(0)->setCellValueByColumnAndRow($k,1,$v);
    }

    $column      = 2;
    $objActSheet = $objPHPExcel->getActiveSheet();

    foreach($data as $key => $rows) { //行写入
        $j    = 0;
        $span = ord("A");
        foreach($rows as $keyName => $value) {// 列写入
            if(preg_match('/^[-+]?[0-9]+\.([0-9]+)?$/',$value,$matches)) {
                //设置单元格数据格式为数值
                $objActSheet->setCellValueExplicitByColumnAndRow($j,$column,$matches[0],PHPExcel_Cell_DataType::TYPE_NUMERIC);
                //设置单元格数据格式为货币,逗号分隔
                $objActSheet->getStyleByColumnAndRow($j,$column)->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1);
                $objActSheet->getColumnDimension($j)->setAutoSize(true);
            }
            elseif(preg_match('/^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/',$value,$matches)) {
                $objActSheet->setCellValueExplicitByColumnAndRow($j,$column,date("Y-m-d",strtotime($matches[0])));
                $objActSheet->getStyleByColumnAndRow($j,$column)->getNumberFormat()->setFormatCode('yyyy-mm-dd;@');
            }
            else {
                $objActSheet->setCellValueExplicitByColumnAndRow($j,$column,$value);
            }
            $j++;
            $span++;
        }
        $column++;
    }
    //打开这是第一个表
    $objPHPExcel->setActiveSheetIndex(0);
    header('Content-Type: application/vnd.ms-excel; charset=UTF-8');
    header("Content-Disposition: attachment;filename=\"$fileName\"");
    header('Cache-Control: max-age=0');

    $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel,'Excel5');
    $objWriter->save('php://output');
    exit;
}

/**
 * 导出excel.xls文件：针对多sheet导出
 * @param string $fileName 文件名
 * @param array $arrHead   表头
 * @param array $data      表值(三维数组)
 * @param array $sheetName sheet名称
 * @param array $arrMerge  单元格合并信息
 * @param bool  $autoSize  是否设置单元格自适应
 */
function export_excel_sheets($arrHead, $fileName, $data, $sheetName, $arrOperate, $autoSize=FALSE) {
    ini_set('memory_limit','-1');

    //对数据进行检验
    if(empty($data) || !is_array($data)) {
        die("导出excel数据不存在");
    }
    if (count($arrHead) != count($sheetName)) {
        die("传参错误！");
    }

    $date     = date("Ymd",time());
    $fileName .= "_{$date}.xls";

    $objPHPExcel = new PHPExcel();
    $objProps    = $objPHPExcel->getProperties();

    $sheet = 0;//初始页码值
    foreach ($data as $tag => $value) {
        if ($sheet != 0) {
            $objPHPExcel->createSheet();
        }
        $objPHPExcel->setActiveSheetIndex($sheet);
        $objActSheet = $objPHPExcel->getActiveSheet($sheet);
        $objActSheet->setTitle($sheetName[$tag]);
        $columns = array_keys($arrHead[$tag]);
        foreach ($columns as $key => $name) {
            //设置表头
            $objPHPExcel->setActiveSheetIndex($sheet)->setCellValueByColumnAndRow($key,1,$arrHead[$tag][$name]);
            if ($autoSize) {
                $itemCell = PHPExcel_Cell::stringFromColumnIndex($key);
                $objPHPExcel->setActiveSheetIndex($sheet)->getStyle($itemCell.'1')->getFont()->setBold(TRUE);
                $objPHPExcel->getActiveSheet()->getColumnDimension($itemCell)->setAutoSize(TRUE);
            }
        }

        $column      = 2;
        foreach($value as $rows) { //行写入
            $j    = 0;
            foreach($rows as $keyName => $val) {// 列写入
                if(preg_match('/^[-+]?[0-9]+\.([0-9]+)?$/',$val,$matches)) {
                    //设置单元格数据格式为数值
                    $objActSheet->setCellValueExplicitByColumnAndRow($j,$column,$matches[0],PHPExcel_Cell_DataType::TYPE_NUMERIC);
                    //设置单元格数据格式为货币,逗号分隔
                    $objActSheet->getStyleByColumnAndRow($j,$column)->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1);
                    $objActSheet->getColumnDimension($j)->setAutoSize(true);
                }
                elseif(preg_match('/^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/',$val,$matches)) {
                    $objActSheet->setCellValueExplicitByColumnAndRow($j,$column,date("Y-m-d",strtotime($matches[0])));
                    $objActSheet->getStyleByColumnAndRow($j,$column)->getNumberFormat()->setFormatCode('yyyy-mm-dd;@');
                }
                else {
                    $objActSheet->setCellValueExplicitByColumnAndRow($j,$column,$val);
                }
                $j++;
            }
            $column++;
        }
        $sheet++;
        if (isset($arrOperate[$tag])) {
            foreach ($arrOperate[$tag]['merge'] as $vol) {
                $v = explode(':', $vol);
                $objActSheet->mergeCells($vol);
                $objActSheet->getStyle($v[0])->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
                $objActSheet->getStyle($v[0])->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
            }
            foreach ($arrOperate[$tag]['border'] as $vol) {
                $objPHPExcel->getActiveSheet()->getStyle($vol)->getBorders()->getAllBorders()->setBorderStyle(PHPExcel_Style_Border::BORDER_THIN);
            }
        }
    }
    //打开这是第一个表
    $objPHPExcel->setActiveSheetIndex(0);
    header('Content-Type: application/vnd.ms-excel; charset=UTF-8');
    header("Content-Disposition: attachment;filename=\"$fileName\"");
    header('Cache-Control: max-age=0');

    $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel,'Excel5');
    $objWriter->save('php://output');
    exit;
}

/**
 * 导入excel文件
 * 
 * @param string $filename  文件名
 * @return array
 */
function import_excel($filename) {
    $arr = array();
    $ext = substr($filename,strrpos($filename,'.') + 1);

    $PHPExcel = new PHPExcel();
    //如果excel文件后缀名为.xls，导入这个类
    if($ext == 'xls') {
        $PHPReader = new PHPExcel_Reader_Excel5();
    } else {
        //如果excel文件后缀名为.xlsx，导入这个类
        $PHPReader = new PHPExcel_Reader_Excel2007();
    }

    //载入文件
    $PHPExcel     = $PHPReader->load($filename);
    //获取表中的第一个工作表，如果要获取第二个，把0改为1，依次类推
    $currentSheet = $PHPExcel->getSheet(0);
    //获取总列数
    $allColumn    = $currentSheet->getHighestColumn();
    //获取总行数
    $allRow       = $currentSheet->getHighestRow();
    //循环获取表中的数据，$currentRow表示当前行，从哪行开始读取数据，索引值从0开始
    for($currentRow = 1; $currentRow <= $allRow; $currentRow++) {
        //从哪列开始，A表示第一列
        for($currentColumn = 'A'; $currentColumn <= $allColumn; $currentColumn++) {
            //数据坐标
            $address                          = $currentColumn . $currentRow;
            //读取到的数据，保存到数组$arr中
            $arr[$currentRow][$currentColumn] = $currentSheet->getCell($address)->getValue();
            $cell                             = $currentSheet->getCell($address);

            // http://www.osakac.ac.jp/labs/koeda/tmp/phpexcel/Documentation/API/PHPExcel_Shared/PHPExcel_Shared_Date.html
            if(PHPExcel_Shared_Date::isDateTime($cell)) {
                $arr[$currentRow][$currentColumn] = gmdate("Y-m-d H:i:s",PHPExcel_Shared_Date::ExcelToPHP($currentSheet->getCell($address)->getValue()));
                // $arr[$currentRow][$currentColumn]=gmdate("Y-m-d", PHPExcel_Shared_Date::ExcelToPHP($currentSheet->getCell($address)->getValue()));
            }
            else {
                $arr[$currentRow][$currentColumn] = $currentSheet->getCell($address)->getValue();
            }
        }
    }
    return $arr;
}

/**
 * 导入excel文件
 * @param string $filename
 * @param string $ext 文件扩展名
 * @return 
 */
function auto_import_excel($filename, $ext) {
    $arr = [];

    //创建PHPExcel对象，注意，不能少了\
    $PHPExcel = new PHPExcel();
    //如果excel文件后缀名为.xls，导入这个类
    if($ext == 'xls') {
        $PHPReader = new PHPExcel_Reader_Excel5();
    } else {
        //如果excel文件后缀名为.xlsx，导入这个类
        $PHPReader = new PHPExcel_Reader_Excel2007();
    }

    //载入文件
    $PHPExcel     = $PHPReader->load($filename);
    //获取表中的第一个工作表，如果要获取第二个，把0改为1，依次类推
    $currentSheet = $PHPExcel->getSheet(0);
    //获取总列数
    $allColumn    = $currentSheet->getHighestColumn();
    //获取总行数
    $allRow       = $currentSheet->getHighestRow();
    //循环获取表中的数据，$currentRow表示当前行，从哪行开始读取数据，索引值从0开始
    for($currentRow = 1; $currentRow <= $allRow; $currentRow++) {
        //从哪列开始，A表示第一列
        for($currentColumn = 'A'; $currentColumn <= $allColumn; $currentColumn++) {
            //数据坐标
            $address                          = $currentColumn . $currentRow;
            //读取到的数据，保存到数组$arr中
            $arr[$currentRow][$currentColumn] = $currentSheet->getCell($address)->getValue();
            $cell                             = $currentSheet->getCell($address);

            // http://www.osakac.ac.jp/labs/koeda/tmp/phpexcel/Documentation/API/PHPExcel_Shared/PHPExcel_Shared_Date.html
            if (PHPExcel_Shared_Date::isDateTime($cell)) {
                $time = $currentSheet->getCell($address)->getValue();
                //财务上传对账,日期为零

                if ($time) {
                    $arr[$currentRow][$currentColumn] = gmdate("Y-m-d H:i:s", PHPExcel_Shared_Date::ExcelToPHP($time));
                } else {
                    $arr[$currentRow][$currentColumn] = $time;
                }

                // $arr[$currentRow][$currentColumn]=gmdate("Y-m-d", PHPExcel_Shared_Date::ExcelToPHP($currentSheet->getCell($address)->getValue()));
            }
            else {
                $arr[$currentRow][$currentColumn] = $currentSheet->getCell($address)->getValue();
                if(is_object($arr[$currentRow][$currentColumn])) {
                    $arr[$currentRow][$currentColumn] = $arr[$currentRow][$currentColumn]->__toString();
                }
            }
        }
    }
    return $arr;
}

/**
 * phpSpreadsheet 下载表格
 * @param string $fileName 表名
 * @param array $arrHead 表头
 * @param array $data 数据[多个工作表格时,要三维数组]
 * @param array $sheets 合并表头 [要合并的名称,要合并的行范围(不能是列)]
 * @param array $sheetName 工作表名称
 * @throws \PhpOffice\PhpSpreadsheet\Exception
 * @throws \PhpOffice\PhpSpreadsheet\Writer\Exception
 */
function phpSpread_export_excel($fileName = '', $arrHead = [], $data = [], $sheets = [], $sheetName = [])
{
    //对数据进行检验
    if (empty($data) || !is_array($data)) {
        die("导出excel数据不存在");
    }

    $date = date("Y_m_d", time());
    $fileName .= "_{$date}.xls";

    $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
    $spreadsheet->getProperties();

    if ($sheetName) {
        $num = 0;//初始页码值
        foreach ($data as $kk => $vv) {
            if (!in_array($kk, array_keys($sheetName))) {
                break;
            }
            if ($sheets) {
                $row = 2;
                $column = 3;
            } else {
                $row = 1; //表头从第一行开始写入数据
                $column = 2;//从第二行开始写入数据
            }
            if ($num != 0) {
                $spreadsheet->createSheet();
            }
            $spreadsheet->setActiveSheetIndex($num);
            $sheet = $spreadsheet->getActiveSheet();
            $sheet->setTitle($sheetName[$kk]);
            //设置表头
            foreach ($arrHead as $k => $v) {
                $k++;
                $sheet->setCellValueByColumnAndRow($k, $row, $v);
            }

            foreach ($vv as $key => $rows) { //行写入
                $j = 1;
                if ($sheets) {
                    $sheet->setCellValue('A1', $sheets[0]);
                    $sheet->mergeCells($sheets[1]); //合并
                    $sheet->getRowDimension(1)->setRowHeight(30); //指定行高
                    $sheet->getStyle($sheets[1])->getFont()->setSize(12)->setBold(true); //指定行,字体大小/加粗
                    $sheet->getStyle($sheets[1])->getAlignment()->setHorizontal(\PHPExcel_Style_Alignment::HORIZONTAL_CENTER); //居中
                }
                foreach ($rows as $keyName => $value) {// 列写入
                    $sheet->setCellValueByColumnAndRow($j, $column, $value);
                    $j++;
                }
                $column++;
            }
            $num++;
        }
    } else {
        $sheet = $spreadsheet->getActiveSheet();
        if ($sheets) {
            $row = 2;
            $column = 3;
        } else {
            $row = 1; //表头从第一行开始写入数据
            $column = 2;//从第二行开始写入数据
        }
        //设置表头
        foreach ($arrHead as $k => $v) {
            $k++;
            $sheet->setCellValueByColumnAndRow($k, $row, $v);
        }

        foreach ($data as $key => $rows) { //行写入
            $j = 1;
            $span = ord("A");
            if ($sheets) {
                $sheet->setCellValue('A1', $sheets[0]);
                $sheet->mergeCells($sheets[1]); //合并
                $sheet->getRowDimension(1)->setRowHeight(30); //指定行高
                $sheet->getStyle($sheets[1])->getFont()->setSize(12)->setBold(true); //指定行,字体大小/加粗
                $sheet->getStyle($sheets[1])->getAlignment()->setHorizontal(\PHPExcel_Style_Alignment::HORIZONTAL_CENTER); //居中
            }

            foreach ($rows as $keyName => $value) {// 列写入
                $sheet->setCellValueByColumnAndRow($j, $column, $value);
                $j++;
                $span++;
            }
            $column++;
        }
    }

    //默认打开第一个工作表
    //$spreadsheet->setActiveSheetIndex(0);

    $writer = \PhpOffice\PhpSpreadsheet\IOFactory::createWriter($spreadsheet, 'Xls');
    header('Content-Type: application/vnd.ms-excel; charset=UTF-8');
    header("Content-Disposition: attachment;filename=\"$fileName\"");
    header('Cache-Control: max-age=0');
    $writer->save('php://output');
    exit;
}

/**
 * 数字拆分成2的次幂的和
 * @param int $num 待分割的数字
 * @return array
 */
function split_num_to_pow($num = 0) {
    $strBin  = decbin($num);
    $iLength = strlen($strBin);
    $result  = [];

    for($i = 0; $i < $iLength; $i++) {
        $n = substr($strBin, $i, 1);
        if($n == 1) {
            $result[] = pow(2, $iLength - 1 - $i);
        } else {
            continue;
        }
    }
    sort($result);
    return $result;
}
