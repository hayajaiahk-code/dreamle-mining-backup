// BSC 主网配置 - Mainnet (2025-09-30 部署)
console.log('🔄 Loading BSC Mainnet contract configuration...');

// BSC 主网合约地址 - Mainnet
const CONTRACT_ADDRESSES = {
    UNIFIED_SYSTEM: '0xf9462c7fE57Fc7Aff662204228cCdCd0a9d3398A', // 统一系统合约 (BSC Mainnet)
    DREAMLE_TOKEN: '0x4440409e078D44A63c72696716b84A46814717e9',  // DRM代币地址 (BSC Mainnet)
    USDT_TOKEN: '0x55d398326f99059fF775485246999027B3197955'     // USDT代币地址 (BSC Mainnet)
};

// 管理员地址
const ADMIN_ADDRESS = '0xfC3b7735Dae4C7AB3Ab85Ffa9987661e795B74b7';

// 矿机配置（V18 Optimized - 与主网合约完全一致）
const MINER_LEVELS = {
    1: { price: 100, hashPower: 40, maxSupply: 10000 },
    2: { price: 300, hashPower: 130, maxSupply: 8000 },
    3: { price: 800, hashPower: 370, maxSupply: 6000 },
    4: { price: 1500, hashPower: 780, maxSupply: 24000 },
    5: { price: 2500, hashPower: 1450, maxSupply: 2000 },
    6: { price: 4000, hashPower: 2600, maxSupply: 1000 },
    7: { price: 6000, hashPower: 4500, maxSupply: 500 },
    8: { price: 8000, hashPower: 6400, maxSupply: 100 }
};

// 网络配置 - BSC 主网（多RPC节点配置 - 针对中国DApp用户优化）
const NETWORK_CONFIG = {
    BSC_MAINNET: {
        chainId: '0x38', // 56 in hex - MetaMask 需要十六进制格式
        chainName: 'BSC Mainnet',
        nativeCurrency: {
            name: 'BNB',
            symbol: 'BNB',
            decimals: 18
        },
        // 多RPC节点配置（按延迟优化排序）
        // 基于实际测试结果（2025-09-30 19:15）- 针对中国DApp用户优化
        // 特别优化：欧易钱包（OKX）用户优先使用币安官方节点
        rpcUrls: [
            // 🥇 1. drpc.org - 主力节点（实测延迟: 58ms，极快）
            'https://lb.drpc.org/bsc/AqlGpHrYB01Fo1dFtBRULdHcTuavm9wR8L7hwg8TMB_n',

            // 🥈 2. BSC 官方节点 - 欧易/币安钱包优先（实测延迟: 255-271ms，稳定）
            'https://bsc-dataseed1.binance.org',
            'https://bsc-dataseed2.binance.org',

            // 🥉 3. PublicNode - 备用节点（实测延迟: 116ms，稳定）
            'https://bsc-rpc.publicnode.com',

            // 4. 1RPC - 备用节点（实测延迟: 126ms，快速）
            'https://1rpc.io/bnb',

            // 5. NodeReal - 最后备用（实测延迟: 285ms）
            'https://bsc-mainnet.nodereal.io/v1/1659dfb40aa24bbb8153a677b98064d7',

            // 6. BSC 官方备用节点 - 中国友好
            'https://bsc-dataseed3.binance.org',
            'https://bsc-dataseed4.binance.org'

            // ❌ 已移除 Ankr（连接失败，0% 成功率）
        ],
        blockExplorerUrls: ['https://bscscan.com']
    }
};

// 强制覆盖全局变量
window.CONTRACT_ADDRESSES = CONTRACT_ADDRESSES;
window.ADMIN_ADDRESS = ADMIN_ADDRESS;
window.MINER_LEVELS = MINER_LEVELS;
window.NETWORK_CONFIG = NETWORK_CONFIG;

console.log('✅ BSC Mainnet contract address loaded:', CONTRACT_ADDRESSES.UNIFIED_SYSTEM);
console.log('✅ DRM Token:', CONTRACT_ADDRESSES.DREAMLE_TOKEN);
console.log('✅ USDT Token:', CONTRACT_ADDRESSES.USDT_TOKEN);
console.log('✅ Admin Address:', ADMIN_ADDRESS);

// 验证地址是否正确
if (CONTRACT_ADDRESSES.UNIFIED_SYSTEM === '0xf9462c7fE57Fc7Aff662204228cCdCd0a9d3398A') {
    console.log('🎉 BSC Mainnet contract address verified!');
} else {
    console.error('❌ Contract address verification failed!');
}

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CONTRACT_ADDRESSES,
        ADMIN_ADDRESS,
        MINER_LEVELS,
        NETWORK_CONFIG
    };
}
