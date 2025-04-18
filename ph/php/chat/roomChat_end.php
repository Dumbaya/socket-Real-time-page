<?php
	header('Content-Type: application/json');
	$userData = file_get_contents("php://input");
	$data = json_decode($userData, true);
	if($data && isset($data['user_nickname'])){
		include_once($_SERVER['DOCUMENT_ROOT'].'/php/class/class.roomChatVO.php');
		$rv = new roomChatVO();

		$rv->f_set($data['user_nickname'], $data['room_title']);
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