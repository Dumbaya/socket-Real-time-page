<?php
	header('Content-Type: application/json');
	$userData = file_get_contents("php://input");
	$nickname = json_decode($userData, true);
	if($nickname && isset($nickname['user_nickname'])){
		include_once($_SERVER['DOCUMENT_ROOT'].'/php/class/class.ranChatVO.php');
		$rv = new ranChatVO();

		$rv->nickname_bind($nickname['user_nickname']);
		
		$row = $rv->chk_select();
		if ($row && $row[0]->{'w_user_nickname'} && $row[0]->{'status'} == 'waiting') {
			echo json_encode([
					'flag' => 'fail',
					'message' => '잠시만 기다려주세요.'
			]);
			exit;
	}
	
	// 매칭 가능한 상대 확인
	$row = $rv->cnt_select();
	if ($row[0]->{'COUNT(*)'} == 0) {
			$rv->insert(); // 나를 대기열에 등록
			echo json_encode([
					'flag' => 'fail',
					'message' => '상대방을 기다리는 중입니다...'
			]);
			exit;
	}
	
	// 상대 존재 시, 매칭
	$row = $rv->select(); // 랜덤 상대 선택
	$partner_nickname = $row[0]->{'w_user_nickname'};
	$my_nickname = $nickname['user_nickname'];
	
	if (!$my_nickname || !$partner_nickname) {
			echo json_encode([
					'flag' => 'fail',
					'message' => '다시 시도해주세요.'
			]);
			exit;
	}
	
	// 둘 다 waiting_chat에서 제거
	$rv->nickname_bind($partner_nickname);
	$rv->delete();
	
	$rv->nickname_bind($my_nickname);
	$rv->delete();
	
	// Node.js로 매칭 POST
	$data = ['my_nickname' => $my_nickname, 'partner_nickname' => $partner_nickname];
	$options = [
			'http' => [
					'header'  => "Content-type: application/json\r\n",
					'method'  => 'POST',
					'content' => json_encode($data)
			]
	];
	
	$context  = stream_context_create($options);
	$result = file_get_contents("http://node:3000/ranChat", false, $context);
	
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