<?php
error_reporting(0);
ini_set('display_errors', 0);

$nodePort = 5001;

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
            $nameLower = strtolower($name);
            // Skip host header and content-type/content-length for multipart (cURL auto-sets them)
            if ($nameLower !== 'host' && $nameLower !== 'content-type' && $nameLower !== 'content-length') {
                $headers[] = $name . ': ' . $value;
            }
        }
    }

    $contentType = $_SERVER['CONTENT_TYPE'] ?? $_SERVER['HTTP_CONTENT_TYPE'] ?? '';

    // Handle multipart/form-data (image uploads)
    if (strpos($contentType, 'multipart/form-data') !== false) {
        $postData = $_POST;
        foreach ($_FILES as $key => $file) {
            if ($file['error'] === UPLOAD_ERR_OK && !empty($file['tmp_name'])) {
                $postData[$key] = new CURLFile(
                    $file['tmp_name'],
                    $file['type'],
                    $file['name']
                );
            }
        }
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
    } else {
        // Handle JSON and raw requests
        if (!empty($contentType)) {
            $headers[] = 'Content-Type: ' . $contentType;
        }
        $body = file_get_contents('php://input');
        if (!empty($body)) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
        }
    }

    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    $response = curl_exec($ch);
    $error = curl_error($ch);
    $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    curl_close($ch);

    return array('response' => $response, 'error' => $error, 'headerSize' => $headerSize);
}

// 1. Try forwarding request to Node server
$result = makeCurlRequest($nodePort);

// 2. Output response safely
if ($result['response'] === false || empty($result['response'])) {
    http_response_code(502);
    header('Content-Type: application/json');
    echo json_encode(array('message' => 'Backend server unreachable', 'error' => $result['error']));
    exit;
}

$headerStr = substr($result['response'], 0, (int)$result['headerSize']);
$bodyStr = substr($result['response'], (int)$result['headerSize']);

$headerLines = explode("\r\n", $headerStr);
foreach ($headerLines as $h) {
    if (!empty($h) && !preg_match('/^Transfer-Encoding:/i', $h) && !preg_match('/^HTTP\//i', $h)) {
        header($h);
    }
}

echo $bodyStr;
