<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$admin_password = $_ENV['ADMIN_PASSWORD'];

if (!$admin_password) {
    http_response_code(500);
    die(json_encode(['error' => 'Admin password not configured. Please set ADMIN_PASSWORD environment variable.']));
}

function authenticate() {
    $headers = getallheaders();
    $auth_header = $headers['Authorization'] ?? '';
    
    if (strpos($auth_header, 'Bearer ') === 0) {
        $token = substr($auth_header, 7);
        return validateToken($token);
    }
    return false;
}

function validateToken($token) {
    $token_file = sys_get_temp_dir() . '/himawari_tokens.json';
    
    if (!file_exists($token_file)) {
        return false;
    }
    
    $tokens = json_decode(file_get_contents($token_file), true) ?: [];
    
    if (!isset($tokens[$token])) {
        return false;
    }
    
    if ($tokens[$token] < time()) {
        unset($tokens[$token]);
        file_put_contents($token_file, json_encode($tokens));
        return false;
    }
    
    return true;
}

switch ($method) {
    case 'GET':
        try {
            $stmt = $pdo->query("SELECT * FROM videos ORDER BY created_at DESC");
            $videos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($videos);
        } catch(PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;
        
    case 'POST':
        if (!authenticate()) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            break;
        }
        
        $input = json_decode(file_get_contents('php://input'), true);
        
        try {
            $stmt = $pdo->prepare("INSERT INTO videos (title, description, video_url) VALUES (?, ?, ?)");
            $stmt->execute([$input['title'], $input['description'], $input['videoUrl']]);
            
            $id = $pdo->lastInsertId();
            $stmt = $pdo->prepare("SELECT * FROM videos WHERE id = ?");
            $stmt->execute([$id]);
            $video = $stmt->fetch(PDO::FETCH_ASSOC);
            
            echo json_encode($video);
        } catch(PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;
        
    case 'PUT':
        if (!authenticate()) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            break;
        }
        
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $_GET['id'] ?? null;
        
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'ID required']);
            break;
        }
        
        try {
            $stmt = $pdo->prepare("UPDATE videos SET title = ?, description = ?, video_url = ? WHERE id = ?");
            $stmt->execute([$input['title'], $input['description'], $input['videoUrl'], $id]);
            
            $stmt = $pdo->prepare("SELECT * FROM videos WHERE id = ?");
            $stmt->execute([$id]);
            $video = $stmt->fetch(PDO::FETCH_ASSOC);
            
            echo json_encode($video);
        } catch(PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;
        
    case 'DELETE':
        if (!authenticate()) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            break;
        }
        
        $id = $_GET['id'] ?? null;
        
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'ID required']);
            break;
        }
        
        try {
            $stmt = $pdo->prepare("DELETE FROM videos WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true]);
        } catch(PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}
?>
