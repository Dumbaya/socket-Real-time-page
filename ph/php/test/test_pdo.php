<?php
$hostname = "newmysql_test";  // 또는 "sockettest"
$dbname = "sockettest";
$username = "root";
$password = "root";
$pdo = null;

try {
    $dsn = "mysql:host=$hostname;dbname=$dbname;charset=utf8mb4";
    $pdo = new PDO($dsn, $username, $password);
    // 에러 모드를 예외로 설정
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "<script>console.log('PDO 연결 성공')</script>";
} catch (PDOException $e) {
    die("PDO 연결 실패: " . $e->getMessage());
}
?>
