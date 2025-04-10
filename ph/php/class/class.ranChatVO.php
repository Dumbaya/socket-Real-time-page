<?php
	include_once($_SERVER['DOCUMENT_ROOT'].'/php/class/class.ranChatDAO.php');
	include_once($_SERVER['DOCUMENT_ROOT'].'/php/class/class.common.php');

	class ranChatVO extends commonObject{
		var $w_user_nickname;
		var $status;

		function __construct()
		{
			$this->com = new common();
			$this->dao = new ranChatDAO();
		}
		
		function nickname_bind($user_nickname){
			$this->setw_user_nickname($user_nickname);
		}

		function insert(){
			$res = $this->dao->insertUser($this);
			return $res;
		}

		function select(){
			$res = $this->dao->selectUser($this);
			return $res;
		}
		function chk_select(){
			$res = $this->dao->chk_selectUser($this);
			return $res;
		}
		function cnt_select(){
			$res = $this->dao->cnt_selectUser($this);
			return $res;
		}

		function delete(){
			$res = $this->dao->deleteUser($this);
			return $res;
		}

		function getw_user_nickname(){return $this->w_user_nickname;}
		function setw_user_nickname($arg){$this->w_user_nickname = $arg; return $this->w_user_nickname;}
		function getstatus(){return $this->status;}
		function setstatus($arg){$this->status = $arg; return $this->status;}
	}
?>