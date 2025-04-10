<?php
	header('Content-Type: application/json');
	$userData = file_get_contents("php://input");
	$nickname = json_decode($userData, true);
	if($nickname && isset($nickname['user_nickname'])){
		include_once($_SERVER['DOCUMENT_ROOT'].'/php/class/class.ranChatVO.php');
		$rv = new ranChatVO();

		$rv->nickname_bind($nickname['user_nickname']);
		
		$row = $rv->chk_select();
		//SELECT * FROM waiting_chat WHERE w_user_nickname=:w_user_nickname
		if($row && $row[0]->{'w_user_nickname'} && $row[0]->{'status'}=='waiting'){
			echo json_encode([
				'flag' => 'fail',
				'message' => '잠시만 기다려주세요.'
			]);
			exit;
		}
		else{
			if(!$rv->insert()){
				//INSERT INTO waiting_chat(w_user_nickname) VALUES(:w_user_nickname)
				echo json_encode([
					'flag' => 'fail',
					'message' => '다시 시도해주세요.'
				]);
				exit;
			}
		}

		$row = $rv->cnt_select();
		//SELECT COUNT(*) FROM waiting_chat WHERE w_user_nickname != :w_user_nickname
		if($row[0]->{'COUNT(*)'}==0){
			echo json_encode([
				'flag' => 'fail',
				'message' => '찾을 상대가 없습니다.'
			]);
			exit;
		}

		$nodeServerUrl = "http://node:3000/ranChat";
		$row = $rv->select();
		//SELECT w_user_nickname FROM waiting_chat WHERE w_user_nickname != :w_user_nickname AND status='waiting' ORDER BY RAND() LIMIT 1
		$my_nickname = $nickname['user_nickname'];
		$partner_nickname = $row[0]->{'w_user_nickname'};

		if(!$my_nickname || !$partner_nickname){
			echo json_encode([
				'flag' => 'fail',
				'message' => '다시 시도해주세요.'
			]);
			exit;
		}
		$data = ['my_nickname' => $my_nickname, 'partner_nickname' => $partner_nickname];
		$options = [
			'http' => [
				'header'  => "Content-type: application/json\r\n",
				'method'  => 'POST',
				'content' => json_encode($data)
			]
		];
		
		$context  = stream_context_create($options);
		$result = file_get_contents($nodeServerUrl, false, $context);
		
		if ($result === FALSE) {
			error_log("Node 서버 호출 실패: $nodeServerUrl");
			echo json_encode([
				'flag' => 'fail',
				'message' => 'Node 연결 실패'
			]);
			exit;
		}

		echo json_encode([
			'flag' => 'success',
			'message' => '상대방 검색 시작합니다.'
		]);
	}
	else{
		echo json_encode([
			'flag' => 'fail',
			'message' => '다시 시도해주세요.'
		]);
	}