<?php
	header('Content-Type: application/json');
	$userData = file_get_contents("php://input");
	$nickname = json_decode($userData, true);
	if($nickname && isset($nickname['user_nickname'])){
		include_once($_SERVER['DOCUMENT_ROOT'].'/php/class/class.ranChatVO.php');
		$rv = new ranChatVO();

		$rv->setw_user_nickname($nickname['user_nickname']);
		$rv->delete();
		
		echo json_encode([
				'flag' => 'success',
				'message' => '대화가 종료되었습니다.'
		]);
	}
	else{
		echo json_encode([
			'flag' => 'fail',
			'message' => '다시 시도해주세요.'
		]);
	}