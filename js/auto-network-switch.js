// 自动网络切换脚本 - 无需用户点击，直接切换到BSC主网
console.log('🚀 Loading automatic network switching script...');

// BSC主网配置
const BSC_MAINNET = {
    chainId: '0x38', // 56 in hex
    chainName: 'BSC Mainnet',
    rpcUrls: ['https://lb.drpc.org/bsc/AqlGpHrYB01Fo1dFtBRULdHcTuavm9wR8L7hwg8TMB_n'],
    blockExplorerUrls: ['https://bscscan.com/'],
    nativeCurrency: {
        name: 'BNB',
        symbol: 'BNB',
        decimals: 18
    }
};

// 显示切换状态
function showSwitchStatus(message, type = 'info') {
    // 移除旧的状态提示
    const oldStatus = document.getElementById('network-switch-status');
    if (oldStatus) {
        oldStatus.remove();
    }

    // 创建新的状态提示
    const statusDiv = document.createElement('div');
    statusDiv.id = 'network-switch-status';
    statusDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        font-weight: bold;
        z-index: 10001;
        font-family: Arial, sans-serif;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        ${type === 'success' ? 'background: #4CAF50;' : 
          type === 'error' ? 'background: #f44336;' : 
          type === 'warning' ? 'background: #ff9800;' : 
          'background: #2196F3;'}
    `;
    statusDiv.textContent = message;
    document.body.appendChild(statusDiv);

    // 3秒后自动移除
    setTimeout(() => {
        if (statusDiv.parentNode) {
            statusDiv.parentNode.removeChild(statusDiv);
        }
    }, 3000);
}

// 自动切换到BSC测试网
async function autoSwitchToMainnet() {
    if (!window.ethereum) {
        console.log('❌ MetaMask未安装');
        showSwitchStatus('❌ 请安装MetaMask钱包', 'error');
        return false;
    }

    try {
        // 获取当前网络
        const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
        console.log('🔍 当前网络ID:', currentChainId);

        if (currentChainId === '0x38') {
            console.log('✅ 已在BSC主网');
            showSwitchStatus('✅ 已在BSC主网', 'success');
            return true;
        }

        console.log('🔄 自动切换到BSC主网...');
        showSwitchStatus('🔄 正在切换到BSC主网...', 'info');

        // 尝试切换网络
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: BSC_MAINNET.chainId }],
        });

        console.log('✅ 成功切换到BSC主网');
        showSwitchStatus('✅ 成功切换到BSC主网', 'success');

        // 🔧 修复：DApp 浏览器禁用自动刷新（防止无限刷新）
        const isDAppBrowser = !!(window.BinanceChain || window.okxwallet || window.okex || window.trustwallet);

        if (isDAppBrowser) {
            console.log('📱 DApp 浏览器检测到，跳过自动刷新（防止无限刷新）');
            showSwitchStatus('✅ 网络已切换，请手动刷新页面', 'success');
        } else {
            // 非 DApp 浏览器，延迟刷新页面
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }

        return true;

    } catch (switchError) {
        console.log('⚠️ 切换失败，尝试添加网络...', switchError.code);

        if (switchError.code === 4902) {
            try {
                showSwitchStatus('🔧 正在添加BSC主网...', 'warning');

                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [BSC_MAINNET],
                });

                console.log('✅ 成功添加并切换到BSC主网');
                showSwitchStatus('✅ 成功添加BSC主网', 'success');

                // 🔧 修复：DApp 浏览器禁用自动刷新（防止无限刷新）
                const isDAppBrowser = !!(window.BinanceChain || window.okxwallet || window.okex || window.trustwallet);

                if (isDAppBrowser) {
                    console.log('📱 DApp 浏览器检测到，跳过自动刷新（防止无限刷新）');
                    showSwitchStatus('✅ 网络已添加，请手动刷新页面', 'success');
                } else {
                    // 非 DApp 浏览器，延迟刷新页面
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                }

                return true;

            } catch (addError) {
                console.error('❌ 添加BSC主网失败:', addError);
                showSwitchStatus('❌ 添加BSC主网失败', 'error');
                return false;
            }
        } else if (switchError.code === 4001) {
            console.log('⚠️ 用户拒绝切换网络');
            showSwitchStatus('⚠️ 用户拒绝切换网络', 'warning');
            return false;
        } else {
            console.error('❌ 切换网络失败:', switchError);
            showSwitchStatus('❌ 切换网络失败', 'error');
            return false;
        }
    }
}

// 页面加载时自动检查并切换网络
async function initAutoNetworkSwitch() {
    // 🔧 修复：DApp 浏览器完全禁用自动网络切换（防止无限刷新）
    const isDAppBrowser = !!(window.BinanceChain || window.okxwallet || window.okex || window.trustwallet);

    if (isDAppBrowser) {
        console.log('📱 DApp 浏览器检测到，完全禁用自动网络切换（防止无限刷新）');
        console.log('💡 用户需要手动切换到 BSC 主网 (Chain ID: 56)');
        return; // 直接返回，不执行任何网络检查和切换
    }

    // 等待页面完全加载
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAutoNetworkSwitch);
        return;
    }

    // 等待MetaMask加载
    if (typeof window.ethereum === 'undefined') {
        console.log('⏳ 等待MetaMask加载...');
        setTimeout(initAutoNetworkSwitch, 1000);
        return;
    }

    console.log('🔍 Checking network status...');

    try {
        const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });

        if (currentChainId !== '0x38') {
            console.log('⚠️ 检测到非BSC主网，自动切换...');
            await autoSwitchToMainnet();
        } else {
            console.log('✅ Already on BSC Mainnet, no switching needed');
        }
    } catch (error) {
        console.error('❌ 网络检查失败:', error);
    }
}

// 监听网络变化
if (window.ethereum) {
    window.ethereum.on('chainChanged', (chainId) => {
        console.log('🔄 网络已切换:', chainId);

        // 🔧 修复：DApp 浏览器禁用自动刷新（防止无限刷新）
        const isDAppBrowser = !!(window.BinanceChain || window.okxwallet || window.okex || window.trustwallet);

        if (chainId === '0x38') {
            console.log('✅ 已切换到BSC主网');
            showSwitchStatus('✅ 已切换到BSC主网', 'success');

            if (isDAppBrowser) {
                console.log('📱 DApp 浏览器检测到，跳过自动刷新（防止无限刷新）');
                showSwitchStatus('✅ 网络已切换，请手动刷新页面', 'success');
            } else {
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        } else {
            console.log('⚠️ 切换到了其他网络，重新切换到BSC主网');
            if (!isDAppBrowser) {
                setTimeout(autoSwitchToMainnet, 1000);
            } else {
                console.log('📱 DApp 浏览器检测到，请手动切换到 BSC 主网');
                showSwitchStatus('⚠️ 请手动切换到 BSC 主网', 'warning');
            }
        }
    });
}

// 导出函数
window.autoNetworkSwitch = {
    autoSwitchToMainnet,
    initAutoNetworkSwitch
};

// 立即初始化
initAutoNetworkSwitch();

console.log('✅ Automatic network switching script loading completed');
