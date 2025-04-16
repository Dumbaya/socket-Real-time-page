<?php
	include_once($_SERVER['DOCUMENT_ROOT'].'/php/class/DB.php');
	include_once($_SERVER['DOCUMENT_ROOT'].'/php/class/class.commonDAO.php');

	class fileChatDAO extends commonDAO{
		private $insertQuery = "
			INSERT INTO file_chat(chat_user) VALUES(:chat_user)
		";

		private $selectQuery = "
			SELECT * FROM file_chat
		";
		private $chk_selectQuery = "
			SELECT * FROM file_chat WHERE chat_user=:chat_user
		";
		private $cnt_selectQuery = "
			SELECT COUNT(*) FROM file_chat
		";

		private $deleteQuery = "
			DELETE FROM file_chat WHERE chat_user=:chat_user
		";

		function insertUser($obj){
			return $this->insert($this->insertQuery, $obj);
		}

		function selectUsers($obj){
			return $this->select($this->selectQuery, $obj);
		}
		function chk_selectUser($obj){
			return $this->select($this->chk_selectQuery, $obj);
		}
		function cnt_selectUser($obj){
			return $this->select($this->cnt_selectQuery, $obj);
		}
		
		function deleteUser($obj){
			return $this->delete($this->deleteQuery, $obj);
		}
	}
?>