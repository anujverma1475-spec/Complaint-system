<?php
error_reporting(0);
ini_set('display_errors', 0);

$nodePort = 5001;
$backendDir = '/home/u120985039/domains/anuj.jaidevs.in/backend';

function makeCurlRequest($nodePort) {
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

    return array('response' => $response, 'error' => $error, 'headerSize' => $headerSize);
}

// 1. Try forwarding request to Node server
$result = makeCurlRequest($nodePort);

// 2. If Node server is not running / unreachable, auto-start Node server and retry!
if ($result['response'] === false) {
    $cmd = "export PATH=/opt/alt/alt-nodejs22/root/usr/bin:\$PATH && cd {$backendDir} && PORT={$nodePort} node server.js >> app.log 2>&1 &";
    exec($cmd);

    // Wait 2 seconds for Node.js + MongoDB Atlas to connect
    usleep(2000000);

    // Retry request
    $result = makeCurlRequest($nodePort);
}

// 3. Output response
if ($result['response'] === false) {
    http_response_code(502);
    header('Content-Type: application/json');
    echo json_encode(array('message' => 'Backend server starting up, please refresh...', 'error' => $result['error']));
    exit;
}

$headerStr = substr($result['response'], 0, $result['headerSize']);
$bodyStr = substr($result['response'], $result['headerSize']);

$headerLines = explode("\r\n", $headerStr);
foreach ($headerLines as $h) {
    if (!empty($h) && !preg_match('/^Transfer-Encoding:/i', $h) && !preg_match('/^HTTP\//i', $h)) {
        header($h);
    }
}

echo $bodyStr;
