<?php
	header('Content-Type: application/json');
	$infoData = file_get_contents("php://input");
	$info = json_decode($infoData, true);
	if($info && isset($info['user_id'])){
		include_once($_SERVER['DOCUMENT_ROOT'].'/ph/php/class/class.signVO.php');
		$sv = new signVO();

		$sv->before_soChk($info['user_id'], $info['user_nickname'], $info['user_email']);
		
		$row = $sv->chk_select('user_id');
		if($row[0]->{'uid'}){
			echo json_encode([
				'flag' => 'fail',
				'message' => '이미 존재하는 ID 입니다.'
			]);
			exit;
		}
		$row = $sv->chk_select('user_nickname');
		if($row[0]->{'uid'}){
			echo json_encode([
				'flag' => 'fail',
				'message' => '이미 존재하는 닉네임 입니다.'
			]);
			exit;
		}
		$row = $sv->chk_select('user_email');
		if($row[0]->{'uid'}){
			echo json_encode([
				'flag' => 'fail',
				'message' => '이미 존재하는 이메일 입니다.'
			]);
			exit;
		}

		$sv->reg_con($info['user_id'], $info['user_password'], $info['user_nickname'], $info['user_email']);

		if($sv->insert()){
			echo json_encode([
				'flag' => 'success',
				'message' => '회원가입이 되었습니다.'
			]);
		}
		else{
			echo json_encode([
				'flag' => 'fail',
				'message' => '회원가입이 실패했습니다.'
			]);
		}
	}
	else{
		echo json_encode([
			'flag' => 'fail',
			'message' => '다시 시도해주세요.'
		]);
	}