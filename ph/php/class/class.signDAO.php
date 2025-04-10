<?php
	include_once($_SERVER['DOCUMENT_ROOT'].'/php/class/DB.php');
	include_once($_SERVER['DOCUMENT_ROOT'].'/php/class/class.commonDAO.php');

	class signDAO extends commonDAO{
		private $insertQuery = "
			INSERT INTO user(user_id, user_password, user_nickname, user_email) VALUES(
				:user_id,
				:user_password,
				:user_nickname,
				:user_email
			)
		";
		
		private $chk_selectQuery = "
			SELECT * FROM user WHERE 
		";

		function insertInfo($obj){//commonDAO로 보내기
			return $this->insert($this->insertQuery, $obj);
		}

		function chk_selectInfo($obj, $chk_arg1, $chk_arg2=null){
			$query = $this->chk_selectQuery;

			if($chk_arg2==null){
				$query .= $chk_arg1."=:".$chk_arg1;
			}
			else{
				$query .= $chk_arg1."=:".$chk_arg1." AND ".$chk_arg2."=:".$chk_arg2;
			}
			return $this->select($query, $obj);
		}
	}
?>