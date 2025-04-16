<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nickname = $_POST['user_nickname'];
    $uploadDir = $_SERVER['DOCUMENT_ROOT']."/uploads/";
    if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

    if (isset($_FILES['zipfile'])) {
        $tmpName = $_FILES['zipfile']['tmp_name'];
        $fileName = $_FILES['zipfile']['name'];
        $targetFile = $uploadDir . $fileName;

        if (move_uploaded_file($tmpName, $targetFile)) {
            echo 'success';
        } else {
            echo 'ZIP 저장 실패';
        }
    } else {
        echo 'ZIP 파일이 없습니다';
    }
}
?>
