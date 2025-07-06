<?php

$request_uri = $_SERVER['REQUEST_URI'];
$request_path = parse_url($request_uri, PHP_URL_PATH);

$path = ltrim($request_path, '/');

if (strpos($path, 'api/') === 0) {
    return false;
}

if (preg_match('/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/i', $path)) {
    return false; // Let Apache serve static files
}

if (file_exists(__DIR__ . '/index.html')) {
    include __DIR__ . '/index.html';
    exit;
} else {
    http_response_code(404);
    echo "React app not found. Please build the application first.";
    exit;
}
?>
