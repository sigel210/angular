<?php
namespace app\common\lib;


/**
 * 泰坦(titan)接口
 */
class TitanLib {

    /**
     * 获取用户组别下属用户ID
     * @author gaodongxu
     * @param unknown $userId
     */
    public static function getUserGroupSubordinate($userId) {
        $arrData['user_id'] = $userId;
        $url                = config('database.titan_url') . 'zeus/Rbac/getUserGroupSubordinate';
        $request            = request_by_curl($arrData, $url, config('database.titan_sign_key'));
        if ($request['data']) {
            return $request['data'];
        } else {
            return array();
        }
    }
    /**
     * 获取用户的下属
     * @author gaodongxu
     * @param unknown $userId
     */
    public static function getUserSubordinate($userId) {
        $arrData['user_id'] = $userId;
        $url                = config('database.titan_url') . 'zeus/Rbac/getUserSubordinate';
        $request            = request_by_curl($arrData, $url, config('database.titan_sign_key'));
        if ($request['data']) {
            return $request['data'];
        } else {
            return array();
        }
    }

    /**
     * 获取所有角色列表
     * @author gaodongxu
     */
    public static function getAllRole() {
        $url     = config('database.titan_url') . 'zeus/Rbac/getAllRole';
        $request = request_by_curl([], $url, config('database.titan_sign_key'));
        if ($request['data']) {
            return $request['data'];
        } else {
            return array();
        }
    }

    /**
     * 获取角色码的用户列表
     * @author gaodongxu
     * @param string $roleCode 角色码
     * @return array
     */
    public static function getUserByRoleCode($roleCode) {
        $url = config('database.titan_url') . '/zeus/Rbac/getUserByRoleCode';
        if (is_array($roleCode)) {
            $arrData['role_code'] = implode(',', $roleCode);
        } else {
            $arrData['role_code'] = $roleCode;
        }
        $request = request_by_curl($arrData, $url, config('database.titan_sign_key'));
        if ($request['data']) {
            return $request['data'];
        } else {
            return array();
        }
    }

    /**
     * 获取部门主管
     * @author lichengping
     * @param $iDeptId
     * @return array
     */
    public static function getDeptHeader($iDeptId) {
        $url                = config('database.titan_url') . 'zeus/Rbac/getDeptHeader';
        $arrData['dept_id'] = $iDeptId;
        $request            = request_by_curl($arrData, $url, config('database.titan_sign_key'));
        if ($request['data']) {
            return $request['data'];
        } else {
            return array();
        }
    }

    /**
     * 获取部门直属用户
     * @author lichengping
     * @param $iDeptId
     * @return array
     */
    public static function getUserByDeptId($iDeptId) {
        $url                = config('database.titan_url') . 'zeus/Rbac/getUserByDeptId';
        $arrData['dept_id'] = $iDeptId;
        $request            = request_by_curl($arrData, $url, config('database.titan_sign_key'));
        if ($request['data']) {
            return $request['data'];
        } else {
            return array();
        }
    }

    /**
     * 获取直属子部门
     * @author lichengping
     * @param $iDeptId
     * @return array
     */
    public static function getChildDeptList($iDeptId) {
        $url                = config('database.titan_url') . 'zeus/Rbac/getChildDeptList';
        $arrData['dept_id'] = $iDeptId;
        $request            = request_by_curl($arrData, $url, config('database.titan_sign_key'));
        if ($request['data']) {
            return $request['data'];
        } else {
            return array();
        }
    }

    /**
     * 获取用户的节点
     * @author lichengping
     * @param $iUserId
     * @return array
     */
    public static function getUserNode($iUserId) {
        $url                = config('database.titan_url') . 'zeus/Rbac/getUserNode';
        $arrData['user_id'] = $iUserId;
        $request            = request_by_curl($arrData, $url, config('database.titan_sign_key'));
        if (count($request)) {
            return $request;
        } else {
            return array();
        }
    }

    /**
     * 获取递归子部门
     * @author lichengping
     * @param $iDeptId
     * @return array
     */
    public static function getSubDeptId($iDeptId) {
        $url                = config('database.titan_url') . 'zeus/Rbac/getSubDeptId';
        $arrData['dept_id'] = $iDeptId;
        $request            = request_by_curl($arrData, $url, config('database.titan_sign_key'));
        if ($request['data']) {
            return $request['data'];
        } else {
            return array();
        }
    }

    /**
     * 获取用户的角色ID
     * @author genghui
     * @param int $iUserId 用户ID
     * @return array
     */
    public static function getUserRole($iUserId) {
        $strPostUrl         = config('database.titan_url') . '/zeus/Rbac/getUserRole';
        $arrData['user_id'] = $iUserId;
        $arrRequestData     = request_by_curl($arrData, $strPostUrl, config('database.titan_sign_key'));
        if ($arrRequestData['data']) {
            return $arrRequestData['data'];
        } else {
            return [];
        }
    }

    /**
     * 用户登录信息
     * @author Devil
     * @param string $strUserName
     * @param string $strPassword
     * @return array
     */
    public static function getUserInfo($strUserName, $strPassword) {
        $strPostUrl              = config('database.titan_url') . '/zeus/Rbac/getUserInfo';
        $arrPostData['nickname'] = $strUserName;
        $arrPostData['password'] = $strPassword;

        return $arrRequestData = request_by_curl($arrPostData, $strPostUrl, config('database.titan_sign_key'));
    }

    public static function getDeptByUid($iUserId) {
        $strPostUrl             = config('database.titan_url') . '/zeus/Rbac/getDeptByUid';
        $arrPostData['user_id'] = $iUserId;
        $arrRequestData         = request_by_curl($arrPostData, $strPostUrl, config('database.titan_sign_key'));
        if ($arrRequestData['data']) {
            return $arrRequestData['data'];
        } else {
            return [];
        }
    }

    public static function setPassword($iUserId, $strPassword) {
        $strPostUrl              = config('database.titan_url') . '/zeus/Rbac/setPassword';
        $arrPostData['user_id']  = $iUserId;
        $arrPostData['password'] = $strPassword;
        return request_by_curl($arrPostData, $strPostUrl, config('database.titan_sign_key'));
    }

}
