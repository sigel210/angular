<?php

namespace app\commonality\controller;

use app\common\controller\Base;
use app\common\lib\TitanLib;
use think\facade\Cache;

class Pub extends Base {

    /**
     * 登录
     */
    public function login()
    {
        $account = input('post.account');
        $password = input('post.password');
        
        $data = [
            'account' => $account,
            'password' => $password,
        ];

        $pubValidate = new \app\commonality\validate\Pub();
        if (!$pubValidate->scene('login')->check($data)) {
            $this->rtnError($pubValidate->getError());
        }

        $arrTitanData = TitanLib::getUserInfo($account, $password);
        
        
        if ($arrTitanData['code'] == 1) {
            $userInfo = $arrTitanData['data'];
        } else {
            $this->rtnError($arrTitanData['msg']);
        }
        
        //验证登录信息
        if (!$userInfo) {
            $this->rtnError('账号或密码错误！');
        } elseif ($userInfo['status'] != 1) {
            $this->rtnError('帐号已经停用！');
        }
        //当前用户拥有角色ID数组
        $roleCode = array_column($userInfo['relation_to_role'], 'role_code');
        
        $userInfo['token'] = $this->_createToken();
        $userCacheData = [
            'token' => $userInfo['token'],
            'user_id' => $userInfo['user_id'],
            'department_id' => $userInfo['dept_id'],
            'role_code' => $roleCode
        ];
        Cache::set($userInfo['token'], $userCacheData, 86400);

        //保存登录信息
        $userData['id'] = $userInfo['user_id'];
        $userData['last_login_time'] = format_time();
        $userData['login_count'] = ['exp', 'login_count+1'];
        $userData['last_login_ip'] = get_client_ip();
        $pubModel = new \app\commonality\model\Pub();
        $pubModel->updateUser($userData);
        $this->rtnSuccess('登录成功！', 1, $userInfo);
    }

    private function _createToken()
    {
        $token = hash('md5', uniqid());
        //Cache::set($token, $_SESSION, 86400);
        return $token;
    }

    /**
     * 退出
     */
    public function logout()
    {
        $strToken = $this->request->server('HTTP_TOKEN', '');
        Cache::rm($strToken);
        $this->rtnSuccess('登出成功！');
    }
    
    /**
     * 用户的节点列表
     */
    public function myNode() {
        $arrPushData['user_id'] = $this->userId;
        if ($this->userId == 1) {
            $arrNodeList = range(0, 2000);
        } else {
            $strRemoteUrl = config('database.titan_url') . 'zeus/Rbac/getUserNode';
            $arrNodeList  = request_by_curl($arrPushData, $strRemoteUrl, config('database.titan_sign_key'));
        }

        $this->rtnList($arrNodeList);
    }

}
