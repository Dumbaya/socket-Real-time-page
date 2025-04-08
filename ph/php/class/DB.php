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
        die("DB ���� ����: " . $e->getMessage());
			}
		}

		function disconnect(){
			if ($this->con instanceof PDO) {
        $this->con = null;
        echo "<script>console.log('PDO ���� ���� �Ϸ�')</script>";
				return true;
			} else {
        echo "<script>console.log('���� ��ü�� ��ȿ���� ����')</script>";
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
				throw new Exception("Statement�� �غ���� �ʾҽ��ϴ�.");
			}
		}

		function execute(){
			if ($this->stmt) {
				return $this->stmt->execute();
			} else {
				throw new Exception("Statement�� �غ���� �ʾҽ��ϴ�.");
			}
		}
		function exec(){
			if ($this->stmt) {
				return $this->stmt->exec();
			} else {
				throw new Exception("Statement�� �غ���� �ʾҽ��ϴ�.");
			}
		}

		function fetch(){
			if ($this->stmt) {
				return $this->stmt->fetch(PDO::FETCH_ASSOC);
			} else {
				throw new Exception("Statement�� �غ���� �ʾҽ��ϴ�.");
			}
		}

		function rowCount(){
			return $this->stmt->rowCount();
		}
	}
?>