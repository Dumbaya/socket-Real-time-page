<?php
    $hostname = "mymysql";  // �Ǵ� "localhost"
    $dbname = "study_board";
    $username = "root";
    $password = "root";
		try {
			$dsn = "mysql:host=$this->hostname;dbname=$this->dbname;charset=utf8mb4";
			$this->pdo = new PDO($dsn, $this->username, $this->password);

			// ���� ��带 ���ܷ� ����
			$this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			echo "<script>console.log('PDO ���� ����')</script>";
	} catch (PDOException $e) {
			die("PDO ���� ����: " . $e->getMessage());
	}
?>
