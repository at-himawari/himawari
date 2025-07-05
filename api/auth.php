<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$admin_password = $_ENV['ADMIN_PASSWORD'];

if (!$admin_password) {
    http_response_code(500);
    die(json_encode(['error' => 'Admin password not configured. Please set ADMIN_PASSWORD environment variable.']));
}

function generateSecureToken() {
    return bin2hex(random_bytes(32));
}

function storeToken($token) {
    $token_file = sys_get_temp_dir() . '/himawari_tokens.json';
    $tokens = [];
    
    if (file_exists($token_file)) {
        $tokens = json_decode(file_get_contents($token_file), true) ?: [];
    }
    
    $tokens[$token] = time() + (24 * 60 * 60);
    file_put_contents($token_file, json_encode($tokens));
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $password = $input['password'] ?? '';
    
    if ($password === $admin_password) {
        $token = generateSecureToken();
        storeToken($token);
        
        echo json_encode([
            'success' => true,
            'token' => $token
        ]);
    } else {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error' => 'Invalid password'
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>
