<?php
$host = '127.0.0.1';
$port = 3000;

function checkServer($host, $port) {
    $connection = @fsockopen($host, $port, $errno, $errstr, 1);
    if (is_resource($connection)) {
        fclose($connection);
        return true;
    } else {
        return false;
    }
}

$server_running = checkServer($host, $port);

if ($server_running) {
    echo json_encode(['flag' => 'success', 'message' => 'Server already running']);
} else {
    $command = 'node /app/node/index.js';
    $output = shell_exec($command);
    echo json_encode(['flag' => 'success', 'message' => 'Server started', 'output' => $output]);
}
?>
