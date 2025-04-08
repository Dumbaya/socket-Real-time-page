<?
	class DB{
		var $con = null;
		var $stmt = null;

		function connect($hostname='mysql', $dbname='socket_study', $username='root', $password='root'){
			$dsn = "mysql:host={$hostname};dbname={$dbname};charset=utf8mb4";
			try{
        $this->pdo = new PDO($dsn, $username, $password);
        $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

				$this->con = $this->pdo;

				return $this->con;
			}catch (PDOException $e) {
        die("DB 연결 실패: " . $e->getMessage());
			}
		}

		function disconnect(){
			if ($this->con instanceof PDO) {
        $this->con = null;
        echo "<script>console.log('PDO 연결 해제 완료')</script>";
				return true;
			} else {
        echo "<script>console.log('연결 객체가 유효하지 않음')</script>";
				return false;
			}
		}

		function prepare($sql){
			$this->stmt = $this->con->prepare($sql);
      return $this->stmt;
		}

		function bindValue($place_holder, &$var){
			if ($this->stmt) {
				return $this->stmt->bindValue($place_holder, $var);
			} else {
				throw new Exception("Statement가 준비되지 않았습니다.");
			}
		}

		function execute(){
			if ($this->stmt) {
				return $this->stmt->execute();
			} else {
				throw new Exception("Statement가 준비되지 않았습니다.");
			}
		}
		function exec(){
			if ($this->stmt) {
				return $this->stmt->exec();
			} else {
				throw new Exception("Statement가 준비되지 않았습니다.");
			}
		}

		function fetch(){
			if ($this->stmt) {
				return $this->stmt->fetch(PDO::FETCH_ASSOC);
			} else {
				throw new Exception("Statement가 준비되지 않았습니다.");
			}
		}

		function rowCount(){
			return $this->stmt->rowCount();
		}
	}
?>