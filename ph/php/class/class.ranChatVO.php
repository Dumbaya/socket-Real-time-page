<?php
	include_once($_SERVER['DOCUMENT_ROOT'].'/php/class/class.ranChatDAO.php');
	include_once($_SERVER['DOCUMENT_ROOT'].'/php/class/class.common.php');

	class ranChatVO extends commonObject{
		var $chat_user;
		var $status;

		function __construct()
		{
			$this->com = new common();
			$this->dao = new ranChatDAO();
		}

		function f_update($nickname, $status){
			$this->setchat_user($nickname);
			$this->setstatus($status);
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

		function update(){
			$res = $this->dao->updateUser($this);
			return $res;
		}

		function delete(){
			$res = $this->dao->deleteUser($this);
			return $res;
		}

		function getchat_user(){return $this->chat_user;}
		function setchat_user($arg){$this->chat_user = $arg; return $this->chat_user;}
		function getstatus(){return $this->status;}
		function setstatus($arg){$this->status = $arg; return $this->status;}
	}
?>