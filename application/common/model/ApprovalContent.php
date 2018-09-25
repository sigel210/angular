<?php
namespace app\common\model;

use app\common\model\Base;

class ApprovalContent extends Base {
    protected $table = 'oms_approval_content';
    protected $pk = 'approval_content_id';
    protected $autoWriteTimestamp = 'datetime';
    protected $createTime = 'approval_apply_time';
    protected $updateTime = false;
    

}