<?php
/**
 * Dreamle NFT Metadata API
 * 动态返回 NFT metadata JSON
 * 支持 OpenSea、MetaMask 等标准 NFT 平台
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// 处理 OPTIONS 请求
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 获取 tokenId（从 URL 路径或查询参数）
$tokenId = null;

// 方法 1: 从路径获取 /api/metadata/123.json
if (preg_match('/\/metadata\/(\d+)\.json$/', $_SERVER['REQUEST_URI'], $matches)) {
    $tokenId = intval($matches[1]);
}

// 方法 2: 从查询参数获取 ?tokenId=123
if (!$tokenId && isset($_GET['tokenId'])) {
    $tokenId = intval($_GET['tokenId']);
}

// 方法 3: 从路径参数获取 /api/metadata/123
if (!$tokenId && isset($_GET['id'])) {
    $tokenId = intval($_GET['id']);
}

// 验证 tokenId
if (!$tokenId || $tokenId < 1) {
    http_response_code(400);
    echo json_encode([
        'error' => 'Invalid tokenId',
        'message' => 'Please provide a valid tokenId (positive integer)'
    ], JSON_PRETTY_PRINT);
    exit;
}

// 矿机配置（与合约一致）
$minerLevels = [
    1 => ['price' => 100, 'hashPower' => 40, 'maxSupply' => 10000, 'rarity' => 'Common'],
    2 => ['price' => 300, 'hashPower' => 130, 'maxSupply' => 8000, 'rarity' => 'Uncommon'],
    3 => ['price' => 800, 'hashPower' => 370, 'maxSupply' => 6000, 'rarity' => 'Rare'],
    4 => ['price' => 1500, 'hashPower' => 780, 'maxSupply' => 24000, 'rarity' => 'Epic'],
    5 => ['price' => 2500, 'hashPower' => 1450, 'maxSupply' => 2000, 'rarity' => 'Legendary'],
    6 => ['price' => 4000, 'hashPower' => 2600, 'maxSupply' => 1000, 'rarity' => 'Mythic'],
    7 => ['price' => 6000, 'hashPower' => 4500, 'maxSupply' => 500, 'rarity' => 'Divine'],
    8 => ['price' => 8000, 'hashPower' => 6400, 'maxSupply' => 100, 'rarity' => 'Celestial']
];

// 计算矿机等级（基于 tokenId）
// 假设: tokenId 1-10000 = Level 1, 10001-18000 = Level 2, 等等
function getLevel($tokenId) {
    global $minerLevels;
    
    $currentId = 0;
    foreach ($minerLevels as $level => $config) {
        $currentId += $config['maxSupply'];
        if ($tokenId <= $currentId) {
            return $level;
        }
    }
    
    // 如果超出范围，返回最高等级
    return 8;
}

// 获取矿机等级
$level = getLevel($tokenId);
$config = $minerLevels[$level];

// 生成 metadata
$metadata = [
    'name' => "Dreamle AI Miner #{$tokenId}",
    'description' => "Level {$level} AI Computing Power Miner - Participate in decentralized AI training and earn DRM rewards. This {$config['rarity']}-tier miner provides {$config['hashPower']} hash power for AI computing tasks.",
    'image' => "https://www.dreamlewebai.com/images/miners/{$level}.png",
    'external_url' => "https://www.dreamlewebai.com/platform.html",
    'attributes' => [
        [
            'trait_type' => 'Level',
            'value' => $level
        ],
        [
            'trait_type' => 'Hash Power',
            'value' => $config['hashPower']
        ],
        [
            'trait_type' => 'Rarity',
            'value' => $config['rarity']
        ],
        [
            'trait_type' => 'Price',
            'value' => "{$config['price']} USDT"
        ],
        [
            'trait_type' => 'Max Supply',
            'value' => $config['maxSupply']
        ],
        [
            'trait_type' => 'Mining Duration',
            'value' => '365 Days'
        ],
        [
            'trait_type' => 'Category',
            'value' => 'AI Computing Miner'
        ],
        [
            'trait_type' => 'Token ID',
            'value' => $tokenId
        ]
    ]
];

// 返回 JSON
http_response_code(200);
echo json_encode($metadata, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
?>

