<?
interface commonInterface
{
}

abstract class commonObject implements commonInterface
{
	var $dao;

	function select(){
		return $this->dao->select($this);
	}
	function selectList($search=array()){
		return $this->dao->selectList($this, $search);
	}

	function insert(){
		return $this->dao->insert($this);
	}

	function alter(){
		return $this->dao->alter($this);
	}
}

function commonObjectFactory($objName){
	eval('class'.$objName.' extends commonObject{}');
	eval('$tempClass = new '.$objName.'();');
	return $tempClass;
}