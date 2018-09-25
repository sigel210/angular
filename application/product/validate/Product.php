<?php
/**
 * 内容验证器
 * 
 * @author  dzt
 * @create  2018-08-06
 */
namespace app\product\validate;

use think\Validate;

class Product extends Validate
{
    //验证规则
    protected $rule = [
        'product_id'            =>  'require|integer|gt:0',
        'product_price'         =>  'require|gt:0',
        'product_name'          =>  'require|unique:product',
        'product_category_id'   =>  'require|integer|gt:0',
        'product_status'        =>  'require|integer',
        'product_remarks'       =>  'max:200',
        'contents'              =>  'require|checkContents',
        'start_time'            =>  'date',
        'end_time'              =>  'date'
    ];
   
    //错误提示信息
    protected $message = [
        'product_name.unique'   =>  '您输入的产品名称已被使用，请重新输入'
    ];
    
    //定义验证场景
    protected $scene = [
        'insert'        =>  ['product_name', 'product_price', 'product_category_id', 'product_status', 'product_remarks', 'contents'],
        'edit'          =>  ['product_id', 'product_remarks', 'contents'],
        'delete'        =>  ['product_id'],
        'list'          =>  ['product_id'],
        'detail'        =>  ['product_id'],
        'optStatus'     =>  ['product_id', 'product_status']
    ];
    
    protected function checkContents($value, $rule='', $data)
    {
        if (!is_array($value) || !count($value)) {
            return '内容不能为空';
        }
        if (count($value)>10) {
            return '最多可添加10条内容';
        }
        foreach ($value as $val) {
            if (!$val['content_id']) {
                return '缺少内容id';
            }
            if (!$val['content_num'] || $val['content_num']<1) {
                return '请填写内容数量';
            }
            if (!isset($val['content_price'])) {
                return '请填写内容价格';
            }
//             if ($val['content_price'] == 0) {
//                 return '内容价格不能为0';
//             }
        }
        return TRUE;
    }

    protected function sceneIndex()
    {
        return $this->only(['product_name', 'start_time', 'end_time', 'product_status'])
            ->remove(['product_name', 'require'])->remove(['product_status', 'require']);
    }
    
    protected function sceneContentList()
    {
        return $this->only(['product_name'])->remove(['product_name', 'require']);
    }
}
