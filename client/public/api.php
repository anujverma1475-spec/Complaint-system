<?php
error_reporting(0);
ini_set('display_errors', 0);

$nodePort = 5001;

$uri = $_SERVER['REQUEST_URI'] ?? '/';
$url = 'http://127.0.0.1:' . $nodePort . $uri;

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $_SERVER['REQUEST_METHOD']);

$headers = array();
if (function_exists('getallheaders')) {
    foreach (getallheaders() as $name => $value) {
        if (strtolower($name) !== 'host') {
            $headers[] = $name . ': ' . $value;
        }
    }
}
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

$body = file_get_contents('php://input');
if (!empty($body)) {
    curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
}

$response = curl_exec($ch);
$error = curl_error($ch);
$headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
curl_close($ch);

if ($response === false) {
    http_response_code(502);
    header('Content-Type: application/json');
    echo json_encode(array('message' => 'Backend server unreachable', 'error' => $error));
    exit;
}

$headerStr = substr($response, 0, $headerSize);
$bodyStr = substr($response, $headerSize);

$headerLines = explode("\r\n", $headerStr);
foreach ($headerLines as $h) {
    if (!empty($h) && !preg_match('/^Transfer-Encoding:/i', $h) && !preg_match('/^HTTP\//i', $h)) {
        header($h);
    }
}

echo $bodyStr;
