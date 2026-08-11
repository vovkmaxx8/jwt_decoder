<?php
// jwt_decoder.php — PHP версия

require_once 'vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

if ($argc < 2) {
    echo "Usage: php jwt_decoder.php <token>\n";
    exit(1);
}

$token = $argv[1];

try {
    // Декодируем без проверки подписи (только просмотр)
    $decoded = JWT::decode($token, new Key('', 'HS256'));
    $header = JWT::jsonDecode(JWT::urlsafeB64Decode(explode('.', $token)[0]), true);
} catch (Exception $e) {
    echo "Ошибка декодирования: " . $e->getMessage() . "\n";
    exit(1);
}

$payload = (array) $decoded;

echo "🔐 JWT Decoder (PHP)\n";
echo "--------------------\n";
echo "Header: " . json_encode($header, JSON_PRETTY_PRINT) . "\n";
echo "Payload: " . json_encode($payload, JSON_PRETTY_PRINT) . "\n";

if (isset($payload['exp'])) {
    $expTime = (new DateTime())->setTimestamp($payload['exp']);
    $now = new DateTime();
    if ($expTime > $now) {
        $diff = $now->diff($expTime);
        echo "✅ Действителен, осталось: {$diff->d} дн, {$diff->h} ч, {$diff->i} мин\n";
    } else {
        $diff = $expTime->diff($now);
        echo "❌ Просрочен на: {$diff->d} дн, {$diff->h} ч, {$diff->i} мин\n";
    }
} else {
    echo "⏳ Поле exp отсутствует\n";
}
echo "Алгоритм: " . ($header['alg'] ?? 'unknown') . "\n";
