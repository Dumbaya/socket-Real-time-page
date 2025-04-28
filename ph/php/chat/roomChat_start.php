<?php
	header('Content-Type: application/json');
	$userData = file_get_contents("php://input");
	$json_data = json_decode($userData, true);
	if($json_data && isset($json_data['user_nickname']) && isset($json_data['room_title'])){
		include_once($_SERVER['DOCUMENT_ROOT'].'/ph/php/class/class.roomChatVO.php');
		$rv = new roomChatVO();

		$my_nickname = $json_data['user_nickname'];
		$room_title = $json_data['room_title'];

		$rv->f_set($my_nickname, $room_title);
		
		$row = $rv->chk_select();

		if(!$row[0]->{'chat_user'}){
			$rv->insert();
		}
		echo json_encode([
			'flag' => 'success',
			'message' => '연결되었습니다.'
		]);
	}
	else{
		echo json_encode([
			'flag' => 'fail',
			'message' => '다시 시도해주세요.'
		]);
	}