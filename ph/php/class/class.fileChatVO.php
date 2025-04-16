<?php
	include_once($_SERVER['DOCUMENT_ROOT'].'/php/class/class.fileChatDAO.php');
	include_once($_SERVER['DOCUMENT_ROOT'].'/php/class/class.common.php');

	class fileChatVO extends commonObject{
		var $chat_user;

		function __construct()
		{
			$this->com = new common();
			$this->dao = new fileChatDAO();
		}

		function insert(){
			$res = $this->dao->insertUser($this);
			return $res;
		}

		function select(){
			$res = $this->dao->selectUsers($this);
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

		function getchat_user(){return $this->chat_user;}
		function setchat_user($arg){$this->chat_user = $arg; return $this->chat_user;}
	}
?>