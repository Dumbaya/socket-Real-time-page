<?php
$hostname = "newmysql_test";  // �Ǵ� "sockettest"
$dbname = "sockettest";
$username = "root";
$password = "root";
$pdo = null;

try {
    $dsn = "mysql:host=$hostname;dbname=$dbname;charset=utf8mb4";
    $pdo = new PDO($dsn, $username, $password);
    // ���� ��带 ���ܷ� ����
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "<script>console.log('PDO ���� ����')</script>";
} catch (PDOException $e) {
    die("PDO ���� ����: " . $e->getMessage());
}
?>
