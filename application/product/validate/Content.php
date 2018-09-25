<?php
/**
 * 内容验证器
 * 
 * @author  dzt
 * @create  2018-08-06
 */
namespace app\product\validate;

use think\Validate;

class Content extends Validate
{
    //验证规则
    protected $rule = [
        'content_id'            =>  'require|integer|gt:0',
        'content_name'          =>  'require|unique:content',
        'content_category_id'   =>  'require|integer|gt:0',
        'content_status'        =>  'require|integer',
        'content_desc'          =>  'max:200',
        'start_time'            =>  'date',
        'end_time'              =>  'date'
    ];
   
    //错误提示信息
    protected $message = [
        'content_name.unique'  =>  '您输入的内容名称已被使用，请重新输入'
    ];
    
    //定义验证场景
    protected $scene = [
        'insert'        =>  ['content_name', 'content_category_id', 'content_desc'],
        'edit'          =>  ['content_id', 'content_desc'],
        'delete'        =>  ['content_id'],
        'list'          =>  ['content_id'],
        'detail'        =>  ['content_id'],
    ];

    protected function sceneIndex()
    {
        return $this->only(['content_name', 'start_time', 'end_time', 'content_status'])
            ->remove(['content_name', 'require'])->remove(['content_status', 'require']);
    }
}
