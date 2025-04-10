<?php
	include_once($_SERVER['DOCUMENT_ROOT'].'/php/class/class.signDAO.php');
	include_once($_SERVER['DOCUMENT_ROOT'].'/php/class/class.common.php');

	class signVO extends commonObject{
		var $user_id;
		var $user_password;
		var $user_nickname;
		var $user_email;

		function __construct()
		{
			$this->com = new common();
			$this->dao = new signDAO();
		}

		function reg_con($user_id, $user_password, $user_nickname, $user_email){
			$this->setuser_id($user_id);
			$this->setuser_password($this->com->aes128_encode($user_password));
			$this->setuser_nickname($user_nickname);
			$this->setuser_email($user_email);
		}
		function before_soChk($user_id, $user_nickname, $user_email){
			$this->setuser_id($user_id);
			$this->setuser_nickname($user_nickname);
			$this->setuser_email($user_email);
		}
		function before_siChk($user_id, $user_password){
			$this->setuser_id($user_id);
			$this->setuser_password($this->com->aes128_encode($user_password));
		}

		function insert(){
			$res = $this->dao->insertInfo($this);
			return $res;
		}

		function chk_select($chk_arg1, $chk_arg2=null){
			$res = $this->dao->chk_selectInfo($this, $chk_arg1, $chk_arg2);
			return $res;
		}

		function getuser_id(){return $this->user_id;}
		function setuser_id($arg){$this->user_id = $arg; return $this->user_id;}
		function getuser_password(){return $this->user_password;}
		function setuser_password($arg){$this->user_password = $arg; return $this->user_password;}
		function getuser_nickname(){return $this->user_nickname;}
		function setuser_nickname($arg){$this->user_nickname = $arg; return $this->user_nickname;}
		function getuser_email(){return $this->user_email;}
		function setuser_email($arg){$this->user_email = $arg; return $this->user_email;}
	}
?>