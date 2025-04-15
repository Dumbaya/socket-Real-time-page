<?php
	header('Content-Type: application/json');
	$userData = file_get_contents("php://input");
	$nickname = json_decode($userData, true);
	if($nickname && isset($nickname['user_nickname'])){
		include_once($_SERVER['DOCUMENT_ROOT'].'/php/class/class.chaosChatVO.php');
		$cv = new chaosChatVO();

		$cv->setchat_user($nickname['user_nickname']);
		$cv->delete();
		
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