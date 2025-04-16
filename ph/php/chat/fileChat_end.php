<?php
	header('Content-Type: application/json');
	$userData = file_get_contents("php://input");
	$nickname = json_decode($userData, true);
	if($nickname && isset($nickname['user_nickname'])){
		include_once($_SERVER['DOCUMENT_ROOT'].'/php/class/class.fileChatVO.php');
		$fv = new fileChatVO();

		$fv->setchat_user($nickname['user_nickname']);
		$fv->delete();
		
		$dir = $_SERVER['DOCUMENT_ROOT']."/uploads";
		
		$handle = opendir($dir);

		$files = array();

		while(($filename = readdir($handle)) !== false){
			if ($filename == '.' || $filename == '..') {
        continue;
			}

			$filepath = $dir . "/" . $filename;
			if (is_file($filepath)) {
				$re_filename = explode('_', $filename);
        $tmp_filename = end($re_filename);

        $compare_filename = pathinfo($tmp_filename, PATHINFO_FILENAME);

				if($compare_filename == $nickname['user_nickname']){
					unlink($filepath);
				}
			}
		}

		closedir($handle);

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