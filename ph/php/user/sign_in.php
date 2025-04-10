<?php
	header('Content-Type: application/json');
	$infoData = file_get_contents("php://input");
	$info = json_decode($infoData, true);
	if($info && isset($info['user_id'])){
		include_once($_SERVER['DOCUMENT_ROOT'].'/php/class/class.signVO.php');
		$sv = new signVO();

		$sv->before_siChk($info['user_id'], $info['user_password']);

		$rowi = $sv->chk_select('user_id');
		$rowp = $sv->chk_select('user_password');
		if(!$rowi[0]->{'uid'}){
			echo json_encode([
				'flag' => 'fail',
				'message' => '일치하는 ID가 없습니다.'
			]);
			exit;
		}
		else if(!$rowp[0]->{'uid'}){
			echo json_encode([
				'flag' => 'fail',
				'message' => '비밀번호를 확인해주세요.'
			]);
			exit;
		}

		if($rowi[0]->{'uid'} && $rowp[0]->{'uid'}){
			echo json_encode([
				'flag' => 'success',
				'message' => '로그인 되었습니다.',
				'user_nickname' => $rowi[0]->{'user_nickname'},
				'user_role' => $rowi[0]->{'user_role'},
			]);
		}
		else{
			echo json_encode([
				'flag' => 'fail',
				'message' => '회원 정보가 없습니다.'
			]);
		}
	}
	else{
		echo json_encode([
			'flag' => 'fail',
			'message' => '다시 시도해주세요.'
		]);
	}