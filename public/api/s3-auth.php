<?php
// public/api/s3-auth.php

// 1. vendorフォルダを読み込む
require_once __DIR__ . '/../../vendor/autoload.php';
// 2. 安全な場所から設定ファイルを読み込む (パスはご自身の環境に合わせて調整してください)
$config = require '/home/your_user_name/config/aws-credentials.php';

use Aws\S3\S3Client;

$s3Client = new S3Client([
    'version'     => 'latest',
    'region'      => $config['region'],
    'credentials' => [
        'key'    => $config['access_key_id'],
        'secret' => $config['secret_access_key'],
    ],
]);

// 3. S3のパスと署名付きURLを生成
$fileName = $_GET['file'] ?? 'unknown-file';
$now = new DateTime();
$key = 'posts/images/' . $now->format('Y/m/') . $fileName;

$command = $s3Client->getCommand('PutObject', [
    'Bucket' => $config['bucket'],
    'Key'    => $key,
]);

$request = $s3Client->createPresignedRequest($command, '+15 minutes');
$uploadUrl = (string) $request->getUri();
$publicUrl = $s3Client->getObjectUrl($config['bucket'], $key);

// 4. Decap CMSに応答を返す
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // 必要に応じて制限してください
echo json_encode([
    'uploadURL' => $uploadUrl,
    'publicURL' => $publicUrl,
]);