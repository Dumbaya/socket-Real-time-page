<?php
	include_once($_SERVER['DOCUMENT_ROOT'].'/ph/php/class/class.roomChatDAO.php');
	include_once($_SERVER['DOCUMENT_ROOT'].'/ph/php/class/class.common.php');

	class roomChatVO extends commonObject{
		function __construct()
		{
			$this->com = new common();
			$this->dao = new roomChatDAO();
		}

		function f_set($user, $title){
			$this->setroom_title($title);
			$this->setchat_user($user);
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

		function getroom_title(){return $this->room_title;}
		function setroom_title($arg){$this->room_title = $arg; return $this->room_title;}
		function getchat_user(){return $this->chat_user;}
		function setchat_user($arg){$this->chat_user = $arg; return $this->chat_user;}
	}
?>