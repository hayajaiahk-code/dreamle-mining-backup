// Web3 Configuration for Dreamle Mining Platform
// Production-ready configuration with complete contract integration

// ========================================
// 网络配置 - BSC 主网配置
// ========================================
// 注意：NETWORK_CONFIG 由 config/contracts.js 统一管理
// 这里不再重复声明，避免冲突

// ========================================
// 合约地址配置 - V16版本 (2024-09-25部署)
// ========================================
// 注意：CONTRACT_ADDRESSES 将由 v16-config.js 统一管理，避免重复声明

// ========================================
// 标准ERC20 ABI
// ========================================
const ERC20_ABI = [
    {
        "constant": true,
        "inputs": [{"name": "_owner", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "balance", "type": "uint256"}],
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {"name": "_to", "type": "address"},
            {"name": "_value", "type": "uint256"}
        ],
        "name": "transfer",
        "outputs": [{"name": "", "type": "bool"}],
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {"name": "_spender", "type": "address"},
            {"name": "_value", "type": "uint256"}
        ],
        "name": "approve",
        "outputs": [{"name": "", "type": "bool"}],
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {"name": "_owner", "type": "address"},
            {"name": "_spender", "type": "address"}
        ],
        "name": "allowance",
        "outputs": [{"name": "", "type": "uint256"}],
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [{"name": "", "type": "uint8"}],
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [{"name": "", "type": "string"}],
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [{"name": "", "type": "string"}],
        "type": "function"
    }
];

// ========================================
// 统一挖矿系统 ABI - V15版本完整ABI
// ========================================
const UNIFIED_SYSTEM_ABI = [
    // 基础信息
    {
        "inputs": [],
        "name": "getVersion",
        "outputs": [{"name": "", "type": "string"}],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getContractInfo",
        "outputs": [
            {"name": "version", "type": "string"},
            {"name": "totalMiners", "type": "uint256"},
            {"name": "totalNetworkHash", "type": "uint256"},
            {"name": "activeMiners", "type": "uint256"},
            {"name": "admin", "type": "address"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    // 矿机级别配置
    {
        "inputs": [{"name": "level", "type": "uint8"}],
        "name": "minerLevels",
        "outputs": [
            {"name": "price", "type": "uint256"},
            {"name": "hashPower", "type": "uint16"},
            {"name": "maxSupply", "type": "uint16"},
            {"name": "currentSupply", "type": "uint16"}
        ],
        "stateMutability": "view",
        "type": "function"
    },

    // 矿机信息
    {
        "inputs": [{"name": "tokenId", "type": "uint256"}],
        "name": "miners",
        "outputs": [
            {"name": "level", "type": "uint8"},
            {"name": "purchaseTime", "type": "uint32"},
            {"name": "referrer", "type": "address"},
            {"name": "isTransferred", "type": "bool"}
        ],
        "stateMutability": "view",
        "type": "function"
    },

    // 用户数据查询
    {
        "inputs": [{"name": "user", "type": "address"}],
        "name": "getUserMiningData",
        "outputs": [
            {"name": "totalHashPower", "type": "uint256"},
            {"name": "ownHashPower", "type": "uint256"},
            {"name": "referralHashPower", "type": "uint256"},
            {"name": "totalClaimed", "type": "uint256"},
            {"name": "minerCount", "type": "uint16"},
            {"name": "lastUpdateTime", "type": "uint32"},
            {"name": "isActive", "type": "bool"},
            {"name": "pendingRewards", "type": "uint256"},
            {"name": "lockEndTime", "type": "uint32"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"name": "user", "type": "address"}],
        "name": "getUserMiners",
        "outputs": [{"name": "", "type": "uint256[]"}],
        "stateMutability": "view",
        "type": "function"
    },

    // 网络统计
    {
        "inputs": [],
        "name": "getNetworkStats",
        "outputs": [
            {"name": "_totalNetworkHashPower", "type": "uint256"},
            {"name": "_activeMinersCount", "type": "uint256"},
            {"name": "_totalRewardsPaid", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    },

    // 购买功能
    {
        "inputs": [
            {"name": "level", "type": "uint8"},
            {"name": "referrer", "type": "address"}
        ],
        "name": "purchaseMinerWithUSDT",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"name": "level", "type": "uint8"},
            {"name": "referrer", "type": "address"}
        ],
        "name": "purchaseMinerWithDRM",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },

    // 推荐系统
    {
        "inputs": [{"name": "referrer", "type": "address"}],
        "name": "specialReferrers",
        "outputs": [{"name": "", "type": "bool"}],
        "stateMutability": "view",
        "type": "function"
    },

    // 奖励功能
    {
        "inputs": [],
        "name": "claimRewards",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    // ERC721 转让函数
    {
        "inputs": [
            {"name": "from", "type": "address"},
            {"name": "to", "type": "address"},
            {"name": "tokenId", "type": "uint256"}
        ],
        "name": "transferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"name": "from", "type": "address"},
            {"name": "to", "type": "address"},
            {"name": "tokenId", "type": "uint256"}
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"name": "from", "type": "address"},
            {"name": "to", "type": "address"},
            {"name": "tokenId", "type": "uint256"},
            {"name": "data", "type": "bytes"}
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"name": "to", "type": "address"},
            {"name": "tokenId", "type": "uint256"}
        ],
        "name": "approve",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"name": "tokenId", "type": "uint256"}
        ],
        "name": "getApproved",
        "outputs": [{"name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"name": "owner", "type": "address"},
            {"name": "operator", "type": "address"}
        ],
        "name": "setApprovalForAll",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"name": "owner", "type": "address"},
            {"name": "operator", "type": "address"}
        ],
        "name": "isApprovedForAll",
        "outputs": [{"name": "", "type": "bool"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"name": "tokenId", "type": "uint256"}
        ],
        "name": "ownerOf",
        "outputs": [{"name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
    },

    // 事件定义
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "name": "buyer", "type": "address"},
            {"indexed": false, "name": "level", "type": "uint8"},
            {"indexed": false, "name": "tokenId", "type": "uint256"},
            {"indexed": false, "name": "referrer", "type": "address"}
        ],
        "name": "MinerPurchased",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "name": "user", "type": "address"},
            {"indexed": false, "name": "amount", "type": "uint256"}
        ],
        "name": "RewardClaimed",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "name": "from", "type": "address"},
            {"indexed": true, "name": "to", "type": "address"},
            {"indexed": true, "name": "tokenId", "type": "uint256"}
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "name": "owner", "type": "address"},
            {"indexed": true, "name": "approved", "type": "address"},
            {"indexed": true, "name": "tokenId", "type": "uint256"}
        ],
        "name": "Approval",
        "type": "event"
    }
];


// ========================================
// 矿机配置 - V15新规格 (与合约完全一致)
// ========================================
const MINER_CONFIGS = {
    1: { hashPower: 40, price: 100, maxSupply: 10000, rarity: '普通' },
    2: { hashPower: 130, price: 300, maxSupply: 8000, rarity: '普通' },
    3: { hashPower: 370, price: 800, maxSupply: 6000, rarity: '稀有' },
    4: { hashPower: 780, price: 1500, maxSupply: 24000, rarity: '稀有' },
    5: { hashPower: 1450, price: 2500, maxSupply: 2000, rarity: '史诗' },
    6: { hashPower: 2600, price: 4000, maxSupply: 1000, rarity: '史诗' },
    7: { hashPower: 4500, price: 6000, maxSupply: 500, rarity: '传说' },
    8: { hashPower: 6400, price: 8000, maxSupply: 100, rarity: '神话' }
};

// ========================================
// 高级RPC连接测试和管理系统
// ========================================

// RPC连接缓存和失败追踪（增强版）
let rpcCache = {
    bestRPC: null,
    lastTest: 0,
    cacheTimeout: 5 * 60 * 1000, // 5分钟缓存
    results: [],
    // 失败节点黑名单
    failedNodes: new Map(), // { url: { count: 失败次数, lastFail: 时间戳 } }
    blacklistTimeout: 30 * 1000, // 30秒黑名单时间
    maxFailures: 3 // 最大失败次数
};

// 记录RPC节点失败
function recordRPCFailure(rpcUrl) {
    const now = Date.now();
    const failInfo = rpcCache.failedNodes.get(rpcUrl) || { count: 0, lastFail: 0 };

    failInfo.count++;
    failInfo.lastFail = now;
    rpcCache.failedNodes.set(rpcUrl, failInfo);

    console.warn(`⚠️ RPC节点失败: ${rpcUrl} (失败次数: ${failInfo.count})`);

    // 如果失败次数超过阈值，加入黑名单
    if (failInfo.count >= rpcCache.maxFailures) {
        console.error(`❌ RPC节点已加入黑名单: ${rpcUrl}`);
    }
}

// 检查RPC节点是否在黑名单中
function isRPCBlacklisted(rpcUrl) {
    const failInfo = rpcCache.failedNodes.get(rpcUrl);
    if (!failInfo) return false;

    const now = Date.now();
    const timeSinceLastFail = now - failInfo.lastFail;

    // 如果超过黑名单时间，清除失败记录
    if (timeSinceLastFail > rpcCache.blacklistTimeout) {
        console.log(`✅ RPC节点已从黑名单移除: ${rpcUrl}`);
        rpcCache.failedNodes.delete(rpcUrl);
        return false;
    }

    // 如果失败次数超过阈值，且在黑名单时间内
    return failInfo.count >= rpcCache.maxFailures;
}

// 记录RPC节点成功
function recordRPCSuccess(rpcUrl) {
    // 清除失败记录
    if (rpcCache.failedNodes.has(rpcUrl)) {
        console.log(`✅ RPC节点恢复正常: ${rpcUrl}`);
        rpcCache.failedNodes.delete(rpcUrl);
    }
}

// 测试单个RPC连接的延迟和可用性（增强版 - 支持黑名单）
async function testRPCConnection(rpcUrl, timeout = 3000) {
    // 检查是否在黑名单中
    if (isRPCBlacklisted(rpcUrl)) {
        console.warn(`⚠️ RPC节点在黑名单中，跳过测试: ${rpcUrl}`);
        return {
            success: false,
            responseTime: 999999,
            error: '节点在黑名单中'
        };
    }

    const startTime = performance.now();

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const testPayload = {
            jsonrpc: '2.0',
            method: 'eth_chainId',
            params: [],
            id: Date.now()
        };

        const response = await fetch(rpcUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(testPayload),
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        const responseTime = performance.now() - startTime;

        if (response.ok) {
            const data = await response.json();
            const expectedChainId = '0x38'; // BSC主网

            if (data.result === expectedChainId) {
                // 记录成功
                recordRPCSuccess(rpcUrl);
                return {
                    success: true,
                    responseTime: Math.round(responseTime),
                    error: null
                };
            } else {
                // 记录失败
                recordRPCFailure(rpcUrl);
                return {
                    success: false,
                    responseTime: Math.round(responseTime),
                    error: `错误的链ID: ${data.result}, 期望: ${expectedChainId}`
                };
            }
        } else {
            // 记录失败
            recordRPCFailure(rpcUrl);
            return {
                success: false,
                responseTime: Math.round(responseTime),
                error: `HTTP ${response.status}: ${response.statusText}`
            };
        }
    } catch (error) {
        const responseTime = performance.now() - startTime;
        // 记录失败
        recordRPCFailure(rpcUrl);
        return {
            success: false,
            responseTime: Math.round(responseTime),
            error: error.name === 'AbortError' ? '超时' : error.message
        };
    }
}

// 并行测试多个RPC节点
async function testMultipleRPCs(rpcUrls, maxConcurrent = 5) {
    console.log(`🔍 开始测试 ${rpcUrls.length} 个RPC节点...`);

    const results = [];

    // 分批并行测试，避免过多并发请求
    for (let i = 0; i < rpcUrls.length; i += maxConcurrent) {
        const batch = rpcUrls.slice(i, i + maxConcurrent);

        const batchPromises = batch.map(async (rpcUrl) => {
            const result = await testRPCConnection(rpcUrl);
            return {
                url: rpcUrl,
                ...result
            };
        });

        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);

        // 显示进度
        console.log(`📊 已测试 ${Math.min(i + maxConcurrent, rpcUrls.length)}/${rpcUrls.length} 个节点`);
    }

    return results;
}

// 智能选择最佳RPC节点
async function getBestRPC(forceRefresh = false) {
    const now = Date.now();

    // 检查缓存是否有效
    if (!forceRefresh && rpcCache.bestRPC && (now - rpcCache.lastTest) < rpcCache.cacheTimeout) {
        console.log(`✅ 使用缓存的最佳RPC: ${rpcCache.bestRPC}`);
        return rpcCache.bestRPC;
    }

    // 从 window.NETWORK_CONFIG 获取 RPC URLs（由 config/contracts.js 提供）
    const networkConfig = window.NETWORK_CONFIG?.BSC_MAINNET;
    if (!networkConfig || !networkConfig.rpcUrls) {
        console.warn('⚠️ NETWORK_CONFIG 未加载，使用默认 RPC');
        return 'https://lb.drpc.org/bsc/AqlGpHrYB01Fo1dFtBRULdHcTuavm9wR8L7hwg8TMB_n';
    }

    const rpcUrls = networkConfig.rpcUrls;

    // 智能RPC选择 - 优先使用最低延迟节点
    let bestRPCUrl = rpcUrls[0]; // 默认使用第一个

    // 如果智能RPC管理器可用，使用最佳RPC
    if (window.smartRPCManager) {
        const smartBestRPC = window.smartRPCManager.getBestRPCUrl();
        if (smartBestRPC) {
            bestRPCUrl = smartBestRPC;
            console.log(`🚀 使用智能RPC: ${window.smartRPCManager.getBestRPC()?.name || 'Unknown'}`);
        }
    }

    // 优先RPC列表 - BSC主网高性能节点优先
    const priorityRPCs = [
        'https://lb.drpc.org/bsc/AqlGpHrYB01Fo1dFtBRULdHcTuavm9wR8L7hwg8TMB_n'
    ];

    try {
        // 测试所有RPC节点
        const results = await testMultipleRPCs(rpcUrls);

        // 过滤出可用的节点
        const workingRPCs = results.filter(r => r.success);

        if (workingRPCs.length === 0) {
            console.warn('⚠️ 所有RPC节点测试失败，使用智能RPC或默认节点');
            const fallbackRPC = bestRPCUrl || rpcUrls[0];
            rpcCache.bestRPC = fallbackRPC;
            rpcCache.lastTest = now;
            return fallbackRPC;
        }

        // 优先选择指定的高优先级RPC（如果可用）
        const availablePriorityRPC = workingRPCs.find(rpc =>
            priorityRPCs.some(priority => rpc.url.includes(priority.split('/').pop()))
        );

        let bestRPC;
        if (availablePriorityRPC) {
            bestRPC = availablePriorityRPC;
            console.log(`🎯 选择优先RPC: ${bestRPC.url}`);
        } else {
            // 按响应时间排序，选择最快的
            workingRPCs.sort((a, b) => a.responseTime - b.responseTime);
            bestRPC = workingRPCs[0];
            console.log(`⚡ 选择最快RPC: ${bestRPC.url}`);
        }

        // 更新缓存
        rpcCache.bestRPC = bestRPC.url;
        rpcCache.lastTest = now;
        rpcCache.results = results;

        // 显示测试结果
        console.log('📊 RPC节点测试结果:');
        results.forEach((result, index) => {
            const status = result.success ? '✅' : '❌';
            const time = result.success ? `${result.responseTime}ms` : result.error;
            console.log(`  ${status} ${result.url.substring(0, 50)}... - ${time}`);
        });

        console.log(`🚀 选择最佳RPC: ${bestRPC.url} (${bestRPC.responseTime}ms)`);

        // 更新UI状态
        if (typeof window.updateRPCStatus === 'function') {
            let status = 'good';
            if (bestRPC.responseTime > 1000) {
                status = 'poor';
            } else if (bestRPC.responseTime > 500) {
                status = 'fair';
            }
            window.updateRPCStatus(status, '已选择最佳节点', bestRPC.responseTime);
        }

        return bestRPC.url;

    } catch (error) {
        console.error('❌ RPC测试过程出错:', error);
        rpcCache.bestRPC = rpcUrls[0];
        rpcCache.lastTest = now;
        return rpcUrls[0];
    }
}

// 快速切换到下一个可用RPC（用于交易失败时）
async function switchToNextRPC(currentRPC) {
    console.log('🔄 当前RPC失败，尝试切换到下一个节点...');

    const networkConfig = window.NETWORK_CONFIG?.BSC_MAINNET;
    if (!networkConfig || !networkConfig.rpcUrls) {
        console.error('❌ 无法获取RPC列表');
        return null;
    }

    const rpcUrls = networkConfig.rpcUrls;
    const currentIndex = rpcUrls.indexOf(currentRPC);

    // 从当前节点的下一个开始尝试
    for (let i = 1; i < rpcUrls.length; i++) {
        const nextIndex = (currentIndex + i) % rpcUrls.length;
        const nextRPC = rpcUrls[nextIndex];

        // 跳过黑名单节点
        if (isRPCBlacklisted(nextRPC)) {
            console.warn(`⚠️ 跳过黑名单节点: ${nextRPC}`);
            continue;
        }

        console.log(`🧪 测试备用节点: ${nextRPC}`);

        // 快速测试（2秒超时）
        const result = await testRPCConnection(nextRPC, 2000);

        if (result.success) {
            console.log(`✅ 切换到新RPC: ${nextRPC} (${result.responseTime}ms)`);

            // 更新缓存
            rpcCache.bestRPC = nextRPC;
            rpcCache.lastTest = Date.now();

            return nextRPC;
        } else {
            console.warn(`❌ 备用节点失败: ${nextRPC} - ${result.error}`);
        }
    }

    console.error('❌ 所有RPC节点都不可用');
    return null;
}

// 使用RPC执行请求（带自动重试和切换）
async function executeWithRPCFallback(requestFunc, maxRetries = 2) {
    let currentRPC = rpcCache.bestRPC || await getBestRPC();
    let lastError = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            console.log(`📡 尝试 ${attempt + 1}/${maxRetries + 1}: 使用RPC ${currentRPC}`);

            // 执行请求
            const result = await requestFunc(currentRPC);

            // 成功，记录成功
            recordRPCSuccess(currentRPC);
            return result;

        } catch (error) {
            lastError = error;
            console.error(`❌ 请求失败 (尝试 ${attempt + 1}/${maxRetries + 1}):`, error.message);

            // 记录失败
            recordRPCFailure(currentRPC);

            // 如果还有重试机会，切换到下一个RPC
            if (attempt < maxRetries) {
                const nextRPC = await switchToNextRPC(currentRPC);
                if (nextRPC) {
                    currentRPC = nextRPC;
                    console.log(`🔄 已切换到备用RPC，准备重试...`);
                } else {
                    console.error('❌ 无可用的备用RPC节点');
                    break;
                }
            }
        }
    }

    // 所有尝试都失败
    throw new Error(`所有RPC节点都失败: ${lastError?.message || '未知错误'}`);
}

// ========================================
// Web3实例创建函数
// ========================================
async function createWeb3Instance() {
    if (typeof Web3 !== 'undefined') {
        const rpcUrl = await getBestRPC();
        console.log('🌐 Creating Web3 instance with RPC:', rpcUrl);
        return new Web3(rpcUrl);
    }
    return null;
}

// 同步版本（备用）
function createWeb3InstanceSync() {
    if (typeof Web3 !== 'undefined') {
        const networkConfig = window.NETWORK_CONFIG?.BSC_MAINNET;
        const rpcUrl = networkConfig?.rpcUrls?.[0] || 'https://lb.drpc.org/bsc/AqlGpHrYB01Fo1dFtBRULdHcTuavm9wR8L7hwg8TMB_n';
        console.log('🌐 Creating Web3 instance with default RPC:', rpcUrl);
        return new Web3(rpcUrl);
    }
    return null;
}

// ========================================
// 全局配置对象（增强版 - 支持RPC自动切换）
// ========================================
window.config = {
    CHAIN_ID: 56, // BSC 主网
    // CURRENT_NETWORK 和 NETWORK_CONFIG 由 config/contracts.js 提供
    // CONTRACT_ADDRESSES 由 config/contracts.js 提供
    ERC20_ABI: ERC20_ABI,
    UNIFIED_SYSTEM_ABI: window.UNIFIED_SYSTEM_V18_ABI || UNIFIED_SYSTEM_ABI, // 优先使用V18 ABI
    MINER_CONFIGS: MINER_CONFIGS,
    getBestRPC: getBestRPC,
    createWeb3Instance: createWeb3Instance,
    // 新增：RPC管理函数
    switchToNextRPC: switchToNextRPC,
    executeWithRPCFallback: executeWithRPCFallback,
    testRPCConnection: testRPCConnection,
    recordRPCFailure: recordRPCFailure,
    recordRPCSuccess: recordRPCSuccess,
    isRPCBlacklisted: isRPCBlacklisted
};

// 导出配置供其他模块使用
// NETWORK_CONFIG 由 config/contracts.js 管理，不在这里导出
window.ERC20_ABI = ERC20_ABI;
window.UNIFIED_SYSTEM_ABI = window.UNIFIED_SYSTEM_V16_ABI || UNIFIED_SYSTEM_ABI; // 优先使用V16 ABI
window.MINER_CONFIGS = MINER_CONFIGS;
window.getBestRPC = getBestRPC;
window.createWeb3Instance = createWeb3Instance;
// 新增：导出RPC管理函数
window.switchToNextRPC = switchToNextRPC;
window.executeWithRPCFallback = executeWithRPCFallback;
window.testRPCConnection = testRPCConnection;

// ========================================
// V16 ABI 初始化检查
// ========================================
// 检查V16 ABI是否已加载，如果已加载则更新配置
if (typeof window.UNIFIED_SYSTEM_V16_ABI !== 'undefined') {
    window.config.UNIFIED_SYSTEM_ABI = window.UNIFIED_SYSTEM_V16_ABI;
    window.UNIFIED_SYSTEM_ABI = window.UNIFIED_SYSTEM_V16_ABI;
    console.log('✅ V16 ABI loaded and applied');
} else {
    console.log('⚠️ V16 ABI未找到，使用默认ABI');
}

console.log('✅ Web3 configuration loaded');
console.log('🚀 Smart RPC management enabled');
