<?php
	include_once($_SERVER['DOCUMENT_ROOT'].'/php/class/DB.php');
	include_once($_SERVER['DOCUMENT_ROOT'].'/php/class/class.commonDAO.php');

	class ranChatDAO extends commonDAO{
		private $insertQuery = "
			INSERT INTO waiting_chat(w_user_nickname) VALUES(:w_user_nickname)
		";
		
		private $selectQuery = "
			SELECT w_user_nickname FROM waiting_chat WHERE w_user_nickname != :w_user_nickname AND status='waiting' ORDER BY RAND() LIMIT 1
		";
		private $chk_selectQuery = "
			SELECT * FROM waiting_chat WHERE w_user_nickname=:w_user_nickname
		";
		private $cnt_selectQuery = "
			SELECT COUNT(*) FROM waiting_chat WHERE w_user_nickname != :w_user_nickname AND status='waiting'
		";

		private $updateQuery = "
			UPDATE waiting_chat SET status=:status WHERE w_user_nickname=:w_user_nickname
		";

		private $deleteQuery = "
			DELETE FROM waiting_chat WHERE w_user_nickname=:w_user_nickname
		";

		function insertUser($obj){
			return $this->insert($this->insertQuery, $obj);
		}

		function selectUser($obj){
			return $this->select($this->selectQuery, $obj);
		}
		function chk_selectUser($obj){
			return $this->select($this->chk_selectQuery, $obj);
		}
		function cnt_selectUser($obj){
			return $this->select($this->cnt_selectQuery, $obj);
		}

		function updateUser($obj){
			return $this->update($this->updateQuery, $obj);
		}
		
		function deleteUser($obj){
			return $this->delete($this->deleteQuery, $obj);
		}
	}
?>