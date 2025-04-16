<?php
	header('Content-Type: application/json');
	$userData = file_get_contents("php://input");
	$nickname = json_decode($userData, true);
	if($nickname && isset($nickname['user_nickname'])){
		include_once($_SERVER['DOCUMENT_ROOT'].'/php/class/class.fileChatVO.php');
		$cv = new fileChatVO();

		$cv->setchat_user($nickname['user_nickname']);
		
		$row = $cv->chk_select();

		if(!$row[0]->{'chat_user'}){
			$cv->insert();
		}
		
		$my_nickname = $nickname['user_nickname'];
		
		$data = ['my_nickname' => $my_nickname];
		$options = [
				'http' => [
						'header'  => "Content-type: application/json\r\n",
						'method'  => 'POST',
						'content' => json_encode($data)
				]
		];
		
		$context  = stream_context_create($options);
		$result = file_get_contents("http://node:3000/fileChat", false, $context);
		
		if ($result === FALSE) {
				echo json_encode([
						'flag' => 'fail',
						'message' => 'Node 서버 호출 실패'
				]);
				exit;
		}
		
		echo json_encode([
				'flag' => 'success',
				'message' => '상대방을 찾았습니다.'
		]);
	
	}
	else{
		echo json_encode([
			'flag' => 'fail',
			'message' => '다시 시도해주세요.'
		]);
	}