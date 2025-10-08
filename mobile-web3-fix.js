/**
 * 移动端Web3兼容性修复脚本
 * 专门解决移动端钱包浏览器中的Web3加载和兼容性问题
 */

(function() {
    'use strict';
    
    console.log('🔧 移动端Web3修复脚本启动...');
    
    // 移动端检测
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTPWallet = /TokenPocket/i.test(navigator.userAgent);
    const isIMWallet = /imToken/i.test(navigator.userAgent);
    const isBinanceWallet = /BinanceChain/i.test(navigator.userAgent);
    const isOKXWallet = /OKApp/i.test(navigator.userAgent);
    
    if (!isMobile) {
        console.log('💻 桌面环境，跳过移动端修复');
        return;
    }
    
    console.log(`📱 移动端环境检测: TP=${isTPWallet}, IM=${isIMWallet}, Binance=${isBinanceWallet}, OKX=${isOKXWallet}`);
    
    // 移动端Web3配置
    const MOBILE_CONFIG = {
        web3LoadTimeout: 10000,
        maxRetries: 3,
        retryDelay: 2000,
        gasConfig: {
            TokenPocket: { gasLimit: 400000, gasPrice: '8000000000' },
            imToken: { gasLimit: 380000, gasPrice: '7500000000' },
            BinanceWallet: { gasLimit: 350000, gasPrice: '7000000000' },
            OKXWallet: { gasLimit: 350000, gasPrice: '7000000000' },
            default: { gasLimit: 350000, gasPrice: '7000000000' }
        }
    };
    
    // 获取当前钱包类型
    function getCurrentWalletType() {
        if (isTPWallet) return 'TokenPocket';
        if (isIMWallet) return 'imToken';
        if (isBinanceWallet) return 'BinanceWallet';
        if (isOKXWallet) return 'OKXWallet';
        return 'default';
    }
    
    // 移动端专用错误处理
    function handleMobileError(error, context) {
        console.error(`📱 移动端错误 [${context}]:`, error);
        
        const errorMsg = error.message || error.toString();
        
        // Web3库未加载错误
        if (errorMsg.includes('Web3 library not loaded') || errorMsg.includes('Web3 is not defined')) {
            console.log('🔄 Web3库加载问题，尝试修复...');
            
            // 显示用户友好提示
            showMobileMessage('正在重新加载Web3库，请稍候...', 'info');
            
            // 尝试重新加载Web3
            setTimeout(() => {
                loadWeb3ForMobile();
            }, 1000);
            
            return { shouldRetry: true, retryDelay: 3000 };
        }
        
        // 交易执行错误
        if (errorMsg.includes('execution reverted') || errorMsg.includes('revert')) {
            console.log('🔄 交易被拒绝，可能是Gas配置问题');
            showMobileMessage('交易被拒绝，正在调整参数重试...', 'warning');
            return { shouldRetry: true, retryDelay: 3000 };
        }
        
        // 网络连接错误
        if (errorMsg.includes('network') || errorMsg.includes('timeout') || errorMsg.includes('connection')) {
            console.log('🔄 网络连接问题');
            showMobileMessage('网络连接不稳定，正在重试...', 'warning');
            return { shouldRetry: true, retryDelay: 5000 };
        }
        
        // 用户拒绝错误
        if (errorMsg.includes('User denied') || errorMsg.includes('user rejected')) {
            showMobileMessage('用户取消了操作', 'info');
            return { shouldRetry: false };
        }
        
        return { shouldRetry: false };
    }
    
    // 移动端消息显示
    function showMobileMessage(message, type = 'info') {
        console.log(`📱 ${type.toUpperCase()}: ${message}`);
        
        // 如果页面有showMessage函数，使用它
        if (typeof window.showMessage === 'function') {
            window.showMessage(message, type);
            return;
        }
        
        // 否则创建简单的移动端提示
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'error' ? '#dc3545' : type === 'warning' ? '#ffc107' : '#17a2b8'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10000;
            font-size: 14px;
            max-width: 90%;
            text-align: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 5000);
    }
    
    // 移动端Web3加载函数
    function loadWeb3ForMobile() {
        return new Promise((resolve, reject) => {
            console.log('📱 开始加载移动端Web3...');
            
            // 如果Web3已经存在，直接返回
            if (typeof window.Web3 !== 'undefined') {
                console.log('✅ Web3已存在');
                resolve(window.Web3);
                return;
            }
            
            // 移动端优先的CDN列表
            const cdnUrls = [
                'https://cdn.jsdelivr.net/npm/web3@1.10.0/dist/web3.min.js',
                'https://unpkg.com/web3@1.10.0/dist/web3.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/web3/1.10.0/web3.min.js'
            ];
            
            let currentIndex = 0;
            
            function tryLoadFromCDN() {
                if (currentIndex >= cdnUrls.length) {
                    reject(new Error('所有CDN加载失败'));
                    return;
                }
                
                const script = document.createElement('script');
                script.src = cdnUrls[currentIndex];
                script.async = true;
                
                const timeout = setTimeout(() => {
                    console.warn(`⏰ CDN ${currentIndex + 1} 加载超时`);
                    script.remove();
                    currentIndex++;
                    tryLoadFromCDN();
                }, MOBILE_CONFIG.web3LoadTimeout);
                
                script.onload = () => {
                    clearTimeout(timeout);
                    console.log(`✅ Web3从CDN ${currentIndex + 1}加载成功`);
                    
                    // 验证Web3对象
                    if (typeof window.Web3 !== 'undefined') {
                        resolve(window.Web3);
                    } else {
                        console.error('❌ Web3对象未定义');
                        currentIndex++;
                        tryLoadFromCDN();
                    }
                };
                
                script.onerror = () => {
                    clearTimeout(timeout);
                    console.error(`❌ CDN ${currentIndex + 1} 加载失败`);
                    script.remove();
                    currentIndex++;
                    tryLoadFromCDN();
                };
                
                document.head.appendChild(script);
            }
            
            tryLoadFromCDN();
        });
    }
    
    // 移动端交易重试机制
    async function mobileTransactionRetry(transactionFn, context = 'transaction') {
        const maxRetries = MOBILE_CONFIG.maxRetries;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                console.log(`📱 ${context} 尝试 ${attempt}/${maxRetries}`);
                
                const result = await transactionFn();
                console.log(`✅ ${context} 成功`);
                return result;
                
            } catch (error) {
                console.warn(`⚠️ ${context} 尝试 ${attempt} 失败:`, error.message);
                
                const errorInfo = handleMobileError(error, context);
                
                if (!errorInfo.shouldRetry || attempt === maxRetries) {
                    throw error;
                }
                
                // 等待后重试
                const delay = errorInfo.retryDelay || MOBILE_CONFIG.retryDelay;
                console.log(`⏳ 等待 ${delay}ms 后重试...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    
    // 获取移动端Gas配置
    function getMobileGasConfig() {
        const walletType = getCurrentWalletType();
        const config = MOBILE_CONFIG.gasConfig[walletType] || MOBILE_CONFIG.gasConfig.default;
        
        console.log(`📱 使用${walletType}的Gas配置:`, config);
        return config;
    }
    
    // 导出移动端工具函数
    window.mobileWeb3Utils = {
        isMobile,
        getCurrentWalletType,
        handleMobileError,
        showMobileMessage,
        loadWeb3ForMobile,
        mobileTransactionRetry,
        getMobileGasConfig,
        MOBILE_CONFIG
    };
    
    // 自动初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('📱 DOM加载完成，初始化移动端Web3修复');
            loadWeb3ForMobile().catch(error => {
                console.error('❌ 移动端Web3初始化失败:', error);
                showMobileMessage('Web3加载失败，请刷新页面重试', 'error');
            });
        });
    } else {
        console.log('📱 立即初始化移动端Web3修复');
        loadWeb3ForMobile().catch(error => {
            console.error('❌ 移动端Web3初始化失败:', error);
            showMobileMessage('Web3加载失败，请刷新页面重试', 'error');
        });
    }
    
    console.log('✅ 移动端Web3修复脚本加载完成');
})();
