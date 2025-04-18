<?php
	include_once($_SERVER['DOCUMENT_ROOT'].'/php/class/DB.php');
	include_once($_SERVER['DOCUMENT_ROOT'].'/php/class/class.commonDAO.php');

	class roomChatDAO extends commonDAO{
		private $insertQuery = "
			INSERT INTO room_chat(chat_user) VALUES(:chat_user)
		";

		private $selectQuery = "
			SELECT * FROM room_chat
		";
		private $chk_selectQuery = "
			SELECT * FROM room_chat WHERE room_title=:room_title and chat_user=:chat_user
		";
		private $cnt_selectQuery = "
			SELECT COUNT(*) FROM room_chat
		";

		private $deleteQuery = "
			DELETE FROM room_chat WHERE room_title=:room_title and chat_user=:chat_user
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