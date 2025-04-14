<?php
	header('Content-Type: application/json');
	$userData = file_get_contents("php://input");
	$nickname = json_decode($userData, true);
	if($nickname && isset($nickname['user_nickname'])){
		include_once($_SERVER['DOCUMENT_ROOT'].'/php/class/class.ranChatVO.php');
		$rv = new ranChatVO();

		$rv->f_update($nickname['user_nickname'], 'waiting');
		$rv->update();
		
		$row = $rv->chk_select();
		if ($row && $row[0]->{'w_user_nickname'} && $row[0]->{'status'} == 'matched') {
			echo json_encode([
					'flag' => 'fail',
					'message' => '이미 매칭된 상태입니다.'
			]);
			exit;
		}

		$row = $rv->cnt_select();
		if ($row[0]->{'COUNT(*)'} == 0) {
				echo json_encode([
						'flag' => 'fail',
						'message' => '상대방을 기다리는 중입니다...'
				]);
				exit;
		}
		
		$row = $rv->select();
		$partner_nickname = $row[0]->{'w_user_nickname'};
		$my_nickname = $nickname['user_nickname'];
		
		if (!$my_nickname || !$partner_nickname) {
				echo json_encode([
						'flag' => 'fail',
						'message' => '다시 시도해주세요.'
				]);
				exit;
		}
		
		$rv->f_update($partner_nickname, 'matched');
		$rv->update();
		
		$rv->f_update($my_nickname, 'matched');
		$rv->update();
		
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