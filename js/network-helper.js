// 网络切换助手 - BSC主网专用
console.log('🌐 Loading network switching helper...');

// BSC主网配置
const BSC_MAINNET_CONFIG = {
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

// 检查当前网络
async function getCurrentNetwork() {
    if (!window.ethereum) {
        return null;
    }
    
    try {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        return chainId;
    } catch (error) {
        console.error('❌ 获取网络ID失败:', error);
        return null;
    }
}

// 切换到BSC主网
async function switchToBSCTestnet() {
    if (!window.ethereum) {
        alert('❌ 请安装MetaMask钱包');
        return false;
    }

    try {
        console.log('🔄 正在切换到BSC主网...');

        // 尝试切换到BSC主网
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: BSC_MAINNET_CONFIG.chainId }],
        });

        console.log('✅ 成功切换到BSC主网');
        return true;

    } catch (switchError) {
        console.log('⚠️ 切换失败，尝试添加BSC主网...', switchError.code);

        // 如果网络不存在，尝试添加
        if (switchError.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [BSC_MAINNET_CONFIG],
                });

                console.log('✅ 成功添加并切换到BSC主网');
                return true;

            } catch (addError) {
                console.error('❌ 添加BSC主网失败:', addError);
                return false;
            }
        } else {
            console.error('❌ 切换网络失败:', switchError);
            return false;
        }
    }
}

// 自动切换到BSC主网（无需用户点击）
async function autoSwitchToBSCTestnet() {
    console.log('🚀 自动切换到BSC主网...');

    const success = await switchToBSCTestnet();
    if (success) {
        console.log('✅ 自动切换成功');

        // 🔧 修复：DApp 浏览器禁用自动刷新（防止无限刷新）
        const isDAppBrowser = !!(window.BinanceChain || window.okxwallet || window.okex || window.trustwallet);

        if (isDAppBrowser) {
            console.log('📱 DApp 浏览器检测到，跳过自动刷新（防止无限刷新）');
        } else {
            console.log('✅ 3秒后刷新页面...');
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        }
    } else {
        console.log('❌ 自动切换失败，请手动切换');
    }
    return success;
}

// 显示网络切换提示
function showNetworkSwitchPrompt() {
    // 创建提示弹窗
    const modal = document.createElement('div');
    modal.id = 'network-switch-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        font-family: Arial, sans-serif;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 30px;
        border-radius: 15px;
        text-align: center;
        max-width: 400px;
        color: white;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `;

    content.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 20px;">🌐</div>
        <h2 style="margin: 0 0 15px 0; color: #fff;">网络切换提醒</h2>
        <p style="margin: 0 0 20px 0; line-height: 1.6; color: #f0f0f0;">
            检测到您的钱包未连接到 <strong>BSC主网</strong><br>
            合约部署在 <strong>BSC主网</strong><br><br>
            请切换到BSC主网以正常使用功能
        </p>
        <div style="display: flex; gap: 10px; justify-content: center;">
            <button id="switch-network-btn" style="
                background: #4CAF50;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
                transition: all 0.3s;
            ">🔄 切换到BSC主网</button>
            <button id="close-modal-btn" style="
                background: #f44336;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                transition: all 0.3s;
            ">❌ 稍后切换</button>
        </div>
        <p style="margin: 20px 0 0 0; font-size: 12px; color: #ddd;">
            💡 提示：切换网络后页面将自动刷新
        </p>
    `;

    modal.appendChild(content);
    document.body.appendChild(modal);

    // 添加事件监听器
    document.getElementById('switch-network-btn').onclick = async () => {
        const success = await switchToBSCTestnet();
        if (success) {
            // 🔧 修复：DApp 浏览器禁用自动刷新（防止无限刷新）
            const isDAppBrowser = !!(window.BinanceChain || window.okxwallet || window.okex || window.trustwallet);

            if (isDAppBrowser) {
                console.log('📱 DApp 浏览器检测到，跳过自动刷新（防止无限刷新）');
                alert('✅ 网络已切换，请手动刷新页面');
                document.body.removeChild(modal);
            } else {
                // 切换成功，刷新页面
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        } else {
            alert('❌ 网络切换失败，请手动在钱包中切换到BSC主网');
        }
    };

    document.getElementById('close-modal-btn').onclick = () => {
        document.body.removeChild(modal);
    };

    // 点击背景关闭
    modal.onclick = (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    };
}

// 检查并自动切换网络
async function checkAndPromptNetworkSwitch() {
    const currentChainId = await getCurrentNetwork();

    if (currentChainId === '0x38') { // BSC主网
        console.log('✅ 当前网络为BSC主网，正确');
        return true; // 网络匹配，无需切换
    } else {
        console.log('⚠️ 检测到非BSC主网 (当前:', currentChainId, ')，需要切换到BSC主网');
        const success = await autoSwitchToBSCTestnet();
        return success; // 返回切换结果
    }
}

// 监听网络变化
// 🔧 修复：DApp 浏览器中完全禁用网络变化监听（防止无限刷新）
const isDAppBrowserForListener = !!(window.BinanceChain || window.okxwallet || window.okex || window.trustwallet);

if (window.ethereum && !isDAppBrowserForListener) {
    console.log('💻 桌面浏览器：启用网络变化监听');
    window.ethereum.on('chainChanged', (chainId) => {
        console.log('🔄 网络已切换:', chainId);
        if (chainId === '0x38') {
            console.log('✅ 已切换到BSC主网');
            // 移除可能存在的提示弹窗
            const modal = document.getElementById('network-switch-modal');
            if (modal) {
                document.body.removeChild(modal);
            }

            // 刷新页面以重新初始化合约
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    });
} else if (isDAppBrowserForListener) {
    console.log('📱 DApp 浏览器：禁用网络变化监听（防止无限刷新）');
}

// 导出函数
window.networkHelper = {
    getCurrentNetwork,
    switchToBSCTestnet,
    checkAndPromptNetworkSwitch,
    showNetworkSwitchPrompt
};

console.log('✅ Network switching helper loading completed');
