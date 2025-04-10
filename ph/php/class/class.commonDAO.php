<?php
	include_once($_SERVER['DOCUMENT_ROOT'].'/php/class/DB.php');
	include_once($_SERVER['DOCUMENT_ROOT'].'/php/class/class.commonObject.php');

	class commonDAO extends DB{
		private $dbEncoding = 'UTF-8';
		private $viewEncoding = 'EUC-KR';

		function __construct()
		{
		}
		function __destruct()
		{
			$this->close();
		}

		function open(){
			return $this->connect();
		}
		function close(){
			return $this->disconnect();
		}

		function getDbEncoding(){
			return $this->dbEncoding;
		}
		function setDbEncoding($arg){
			$this->dbEncoding = $arg;
		}
		function getViewEncoding(){
			return $this->viewEncoding;
		}
		function setViewEncoding($arg){
			$this->viewEncoding = $arg;
		}

		function getObjectVariable(commonObject $obj, $variable){
			$className = get_class($obj);
			if(method_exists($obj, 'get'.$variable)){
				return $this->decodedValue($obj->{'get'.$variable}());
			}
			else{
				return $this->decodedValue($obj->$variable);
			}
		}

		function setObjectVariable(commonObject $obj, $variable, $value){
			$value = $this->encodedValue($value);
			if(method_exists($obj, 'set'.$variable)){
				return $obj->{'set'.$variable}($value);
			}
			else{
				$obj->$variable = $value;
			}
		}

		function decodedValue($value){
			$value = iconv($this->getViewEncoding(), $this->getDbEncoding(), $value);
			return $value;
		}
		function encodedValue($value){
			$value = iconv($this->getDbEncoding(), $this->getViewEncoding(), $value);

			return $value;
		}

		function bind($query, commonObject $obj){
			preg_match_all('/:([a-zA-Z0-9_]+)/', $query, $binds);
			if(count($binds[1])){
				foreach($binds[1] as $bindkey=>$bind){
					${$bind} = $this->getObjectVariable($obj, $bind);
					$this->bindValue(':'.$bind, ${$bind});
				}
			}
		}

		/*
		* bind 있는 dml 실행
		*/
		function dml($query, commonObject $obj){
			$this->open();
			$this->prepare($query);
			$this->bind($query, $obj);
			try {
				return $this->execute();
			} catch (Exception $e) {
				return false;
			}
		}

		/*
		* bind 없는 dml 실행
		*/
		function nob_dml($query){
			$this->open();
			$this->prepare($query);
			try {
				return $this->execute();
			} catch (Exception $e) {
				return false;
			}
		}

		function insert($query, commonObject $obj){//dml로 보내기
			return $this->dml($query, $obj);
		}

		function selectList($query, commonObject $obj, $search=array()){
			$doSearch = count($search)>0 ?true:false;
			$res = array();
			$this->open();
			$this->prepare($query);
			$this->bind($query, $obj);
			$this->execute();
			while($row = $this->fetch()){
				if($doSearch){
					foreach($search as $sKey=>$sVal){
						if($sVal !== $this->encodedValue($row[$sKey])){
							continue 2;
						}
					}
				}
				$tempObj = clone $obj;
				foreach($row as $key=>$val){
					$this->setObjectVariable($tempObj, $key, $val);
				}
				array_push($res, $tempObj);
			}
			return $res;
		}
		function select($query, commonObject $obj){
			$res = array();
			$this->open();
			$this->prepare($query);
			$this->bind($query, $obj);
			$this->execute();
			while($row = $this->fetch()){
				$tempObj = clone $obj;
				foreach($row as $key=>$val){
					$this->setObjectVariable($tempObj, $key, $val);
				}
				array_push($res, $tempObj);
			}
			return $res;
		}

		function update($query, commonObject $obj){
			return $this->dml($query, $obj);
		}

		/*
		* mode
		* 1 == user
		* 2 == announ_board
		* 3 == announ_bonoga
		*/
		function alter($auto_increment, $mode=1){//dml 함수처럼 하면 안먹음
			if($mode==1){
				$query = "ALTER TABLE user AUTO_INCREMENT=$auto_increment";
			}
			else if($mode==2){
				$query = "ALTER TABLE announ_board AUTO_INCREMENT=$auto_increment";
			}
			else if($mode==3){
				$query = "ALTER TABLE announ_bonoga AUTO_INCREMENT=$auto_increment";
			}
			else if($mode==4){
				$query = "ALTER TABLE diary_list AUTO_INCREMENT=$auto_increment";
			}
			
			$this->prepare($query);
			try {
				return $this->execute();
			} catch (Exception $e) {
				return false;
			}
		}

		function count_select($query, commonObject $obj){
			$this->open();
			$this->prepare($query);
			$this->bind($query, $obj);
			$this->execute();

			$rowcount = $this->rowCount();

			return $rowcount;
		}

		function delete($query, commonObject $obj){
			try {
				return $this->dml($query, $obj);
			} catch (Exception $e) {
				return false;
			}
		}
	}
?>