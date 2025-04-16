<?
	$filename = basename($_GET['file']);
	$filepath = $_GET['url'].$filename;

	if (file_exists($filepath)) {
		header('Content-Type: application/zip');
		header('Content-Disposition: attachment; filename="' . $filename . '"');
		readfile($filepath);
		exit;
	} else {
		echo "파일 없음";
	}
?>