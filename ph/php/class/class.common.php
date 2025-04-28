<?php
	include_once($_SERVER['DOCUMENT_ROOT'].'/ph/php/class/DB.php');

	class common{
		private $secret_key = "socket_board_secret_key";
		
		function aes128_encode($password){
			$enc_password = base64_encode(openssl_encrypt($password, "AES-128-CBC", $this->secret_key, false));

			return $enc_password;
		}

		function sha256_encode($password){
			$enc_password = hash('sha256', $password);

			return $enc_password;
		}
	}
?>