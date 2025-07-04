<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$admin_password = $_ENV['VITE_ADMIN_PASSWORD'] ?? 'himawari-admin-2025';

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $password = $input['password'] ?? '';
    
    if ($password === $admin_password) {
        echo json_encode([
            'success' => true,
            'token' => $admin_password
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
