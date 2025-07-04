<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// .envファイルの読み込み
$env_file = __DIR__ . '/.env';
if (file_exists($env_file)) {
    $env_vars = parse_ini_file($env_file);
    foreach ($env_vars as $key => $value) {
        $_ENV[$key] = $value;
        $_SERVER[$key] = $value;
    }
}

$host = $_ENV['DB_HOST'] ?? $_SERVER['DB_HOST'] ?? 'localhost';
$dbname = $_ENV['DB_NAME'] ?? $_SERVER['DB_NAME'];
$username = $_ENV['DB_USERNAME'] ?? $_SERVER['DB_USERNAME'];
$password = $_ENV['DB_PASSWORD'] ?? $_SERVER['DB_PASSWORD'];

if (!$dbname || !$username || !$password) {
    die(json_encode(['error' => 'Database configuration missing. Please check .env file settings.']));
}

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die(json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]));
}
?>
