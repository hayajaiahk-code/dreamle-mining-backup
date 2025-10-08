/**
 * 多钱包检测和连接管理器
 * 支持：币安钱包、欧意钱包、MetaMask
 */

class WalletDetector {
    constructor() {
        this.walletType = null;
        this.provider = null;
    }

    /**
     * 检测可用的钱包
     */
    detectWallets() {
        const wallets = [];

        // 检测币安钱包
        if (window.BinanceChain) {
            wallets.push({
                name: 'Binance Wallet',
                type: 'binance',
                provider: window.BinanceChain,
                icon: '🟡'
            });
        }

        // 检测欧意钱包
        if (window.okxwallet) {
            wallets.push({
                name: 'OKX Wallet',
                type: 'okx',
                provider: window.okxwallet,
                icon: '⚫'
            });
        }

        // 检测 MetaMask
        if (window.ethereum && !window.BinanceChain && !window.okxwallet) {
            wallets.push({
                name: 'MetaMask',
                type: 'metamask',
                provider: window.ethereum,
                icon: '🦊'
            });
        }

        // 检测通用 ethereum provider
        if (window.ethereum && wallets.length === 0) {
            wallets.push({
                name: 'Web3 Wallet',
                type: 'ethereum',
                provider: window.ethereum,
                icon: '💼'
            });
        }

        return wallets;
    }

    /**
     * 获取当前钱包类型
     */
    getCurrentWalletType() {
        if (window.BinanceChain) {
            return 'binance';
        } else if (window.okxwallet) {
            return 'okx';
        } else if (window.ethereum) {
            return 'metamask';
        }
        return null;
    }

    /**
     * 连接钱包
     */
    async connectWallet(walletType = null) {
        try {
            // 如果没有指定钱包类型，自动检测
            if (!walletType) {
                walletType = this.getCurrentWalletType();
            }

            if (!walletType) {
                throw new Error('未检测到钱包，请在币安或欧意 DApp 浏览器中打开');
            }

            let provider;
            let accounts;

            switch (walletType) {
                case 'binance':
                    console.log('🟡 连接币安钱包...');
                    provider = window.BinanceChain;
                    accounts = await provider.request({ method: 'eth_requestAccounts' });
                    break;

                case 'okx':
                    console.log('⚫ 连接欧意钱包...');
                    provider = window.okxwallet;
                    accounts = await provider.request({ method: 'eth_requestAccounts' });
                    break;

                case 'metamask':
                case 'ethereum':
                    console.log('🦊 连接 MetaMask...');
                    provider = window.ethereum;
                    accounts = await provider.request({ method: 'eth_requestAccounts' });
                    break;

                default:
                    throw new Error('不支持的钱包类型');
            }

            this.walletType = walletType;
            this.provider = provider;

            console.log('✅ 钱包连接成功:', accounts[0]);
            return {
                success: true,
                address: accounts[0],
                walletType: walletType,
                provider: provider
            };

        } catch (error) {
            console.error('❌ 钱包连接失败:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * 检查并切换到正确的网络
     */
    async switchToNetwork(chainId, networkConfig) {
        try {
            const provider = this.provider || window.ethereum;
            
            if (!provider) {
                throw new Error('未检测到钱包');
            }

            // 尝试切换网络
            try {
                await provider.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: `0x${chainId.toString(16)}` }],
                });
                console.log('✅ 网络切换成功');
                return { success: true };
            } catch (switchError) {
                // 如果网络不存在，尝试添加
                if (switchError.code === 4902) {
                    console.log('📡 网络不存在，尝试添加...');
                    await this.addNetwork(networkConfig);
                    return { success: true };
                }
                throw switchError;
            }
        } catch (error) {
            console.error('❌ 网络切换失败:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * 添加网络
     */
    async addNetwork(networkConfig) {
        try {
            const provider = this.provider || window.ethereum;
            
            await provider.request({
                method: 'wallet_addEthereumChain',
                params: [{
                    chainId: `0x${networkConfig.chainId.toString(16)}`,
                    chainName: networkConfig.chainName,
                    nativeCurrency: networkConfig.nativeCurrency,
                    rpcUrls: networkConfig.rpcUrls,
                    blockExplorerUrls: networkConfig.blockExplorerUrls
                }]
            });

            console.log('✅ 网络添加成功');
            return { success: true };
        } catch (error) {
            console.error('❌ 网络添加失败:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * 获取当前链 ID
     */
    async getCurrentChainId() {
        try {
            const provider = this.provider || window.ethereum;
            const chainId = await provider.request({ method: 'eth_chainId' });
            return parseInt(chainId, 16);
        } catch (error) {
            console.error('获取链 ID 失败:', error);
            return null;
        }
    }

    /**
     * 监听账户变化
     */
    onAccountsChanged(callback) {
        const provider = this.provider || window.ethereum;
        if (provider) {
            provider.on('accountsChanged', callback);
        }
    }

    /**
     * 监听网络变化
     */
    onChainChanged(callback) {
        const provider = this.provider || window.ethereum;
        if (provider) {
            provider.on('chainChanged', callback);
        }
    }

    /**
     * 显示钱包选择器（如果有多个钱包）
     */
    showWalletSelector() {
        const wallets = this.detectWallets();

        if (wallets.length === 0) {
            alert('未检测到钱包\n\n请在以下浏览器中打开：\n• 币安 DApp 浏览器\n• 欧意 DApp 浏览器\n• MetaMask 浏览器');
            return null;
        }

        if (wallets.length === 1) {
            // 只有一个钱包，直接连接
            return this.connectWallet(wallets[0].type);
        }

        // 多个钱包，显示选择器
        console.log('检测到多个钱包:', wallets);
        // 这里可以实现一个 UI 选择器
        // 暂时返回第一个
        return this.connectWallet(wallets[0].type);
    }

    /**
     * 检查是否在移动端
     */
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    /**
     * 获取钱包友好名称
     */
    getWalletName() {
        switch (this.walletType) {
            case 'binance':
                return '币安钱包';
            case 'okx':
                return '欧意钱包';
            case 'metamask':
                return 'MetaMask';
            default:
                return 'Web3 钱包';
        }
    }
}

// 创建全局实例
window.walletDetector = new WalletDetector();

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WalletDetector;
}

console.log('✅ 钱包检测器已加载');

