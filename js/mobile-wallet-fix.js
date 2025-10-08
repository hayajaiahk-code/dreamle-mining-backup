/**
 * 移动端钱包兼容性修复
 * 专门解决 eth_sendTransaction 不可用等钱包兼容性问题
 */

(function() {
    'use strict';
    
    console.log('🔧 移动端钱包兼容性修复模块加载...');
    
    // 移动端钱包检测
    const WALLET_DETECTION = {
        isMetaMask: () => window.ethereum && window.ethereum.isMetaMask,
        isTokenPocket: () => window.ethereum && window.ethereum.isTokenPocket,
        isImToken: () => window.ethereum && window.ethereum.isImToken,
        isBinanceWallet: () => window.ethereum && window.ethereum.isBinanceChain,
        isOKXWallet: () => window.ethereum && window.ethereum.isOkxWallet,
        isTrustWallet: () => window.ethereum && window.ethereum.isTrust,
        
        getCurrentWallet: function() {
            if (this.isMetaMask()) return 'MetaMask';
            if (this.isTokenPocket()) return 'TokenPocket';
            if (this.isImToken()) return 'ImToken';
            if (this.isBinanceWallet()) return 'BinanceWallet';
            if (this.isOKXWallet()) return 'OKXWallet';
            if (this.isTrustWallet()) return 'TrustWallet';
            return 'Unknown';
        }
    };
    
    // 钱包特定配置
    const WALLET_CONFIGS = {
        MetaMask: {
            supportsEthSendTransaction: true,
            preferredMethod: 'contract.send',
            gasMultiplier: 1.2
        },
        TokenPocket: {
            supportsEthSendTransaction: false,
            preferredMethod: 'contract.send',
            gasMultiplier: 1.3
        },
        ImToken: {
            supportsEthSendTransaction: false,
            preferredMethod: 'contract.send',
            gasMultiplier: 1.3
        },
        BinanceWallet: {
            supportsEthSendTransaction: false,
            preferredMethod: 'contract.send',
            gasMultiplier: 1.2
        },
        OKXWallet: {
            supportsEthSendTransaction: false,
            preferredMethod: 'contract.send',
            gasMultiplier: 1.2
        },
        TrustWallet: {
            supportsEthSendTransaction: false,
            preferredMethod: 'contract.send',
            gasMultiplier: 1.3
        },
        Unknown: {
            supportsEthSendTransaction: false,
            preferredMethod: 'contract.send',
            gasMultiplier: 1.5
        }
    };
    
    // 检查钱包是否支持 eth.sendTransaction
    function checkEthSendTransactionSupport() {
        const currentWallet = WALLET_DETECTION.getCurrentWallet();
        const config = WALLET_CONFIGS[currentWallet];
        
        console.log(`🔍 检查钱包支持: ${currentWallet}`);
        
        // 首先检查配置
        if (!config.supportsEthSendTransaction) {
            console.log(`❌ ${currentWallet} 不支持 eth.sendTransaction (配置)`);
            return false;
        }
        
        // 然后检查实际方法是否存在
        if (!window.web3 || !window.web3.eth || typeof window.web3.eth.sendTransaction !== 'function') {
            console.log(`❌ eth.sendTransaction 方法不存在`);
            return false;
        }
        
        console.log(`✅ ${currentWallet} 支持 eth.sendTransaction`);
        return true;
    }
    
    // 智能交易发送函数
    async function smartSendTransaction(contract, method, params, txParams) {
        const currentWallet = WALLET_DETECTION.getCurrentWallet();
        const config = WALLET_CONFIGS[currentWallet];
        
        console.log(`🚀 智能交易发送 - 钱包: ${currentWallet}, 方法: ${method}`);
        
        // 优先使用合约的 send 方法
        try {
            console.log('📱 尝试使用合约 send 方法...');
            
            const contractMethod = contract.methods[method](...params);
            const result = await contractMethod.send(txParams);
            
            console.log('✅ 合约 send 方法成功');
            return result;
            
        } catch (sendError) {
            console.warn('⚠️ 合约 send 方法失败:', sendError.message);
            
            // 如果钱包支持 eth.sendTransaction，尝试使用
            if (checkEthSendTransactionSupport()) {
                try {
                    console.log('📱 尝试使用 eth.sendTransaction...');
                    
                    const contractMethod = contract.methods[method](...params);
                    const encodedData = contractMethod.encodeABI();
                    
                    const result = await window.web3.eth.sendTransaction({
                        from: txParams.from,
                        to: contract.options.address,
                        gas: txParams.gas,
                        gasPrice: txParams.gasPrice,
                        value: txParams.value || '0x0',
                        data: encodedData
                    });
                    
                    console.log('✅ eth.sendTransaction 成功');
                    return result;
                    
                } catch (ethError) {
                    console.error('❌ eth.sendTransaction 也失败:', ethError.message);
                    throw ethError;
                }
            } else {
                // 钱包不支持 eth.sendTransaction，抛出原始错误
                throw sendError;
            }
        }
    }
    
    // 错误消息优化
    function getOptimizedErrorMessage(error, walletType) {
        const errorMsg = error.message || error.toString();
        
        if (errorMsg.includes('eth_sendTransaction does not exist')) {
            return `当前钱包 (${walletType}) 不支持此交易方法，请尝试刷新页面或使用其他钱包`;
        }
        
        if (errorMsg.includes('user rejected')) {
            return '用户取消了交易';
        }
        
        if (errorMsg.includes('insufficient funds')) {
            return 'BNB余额不足，无法支付Gas费用';
        }
        
        if (errorMsg.includes('insufficient allowance')) {
            return 'USDT授权额度不足，请先授权';
        }
        
        if (errorMsg.includes('execution reverted')) {
            return '交易被拒绝，可能是合约条件不满足';
        }
        
        return errorMsg;
    }
    
    // 显示用户友好的错误消息（不再自动显示，只返回优化后的消息）
    function showWalletError(error, context = '') {
        const currentWallet = WALLET_DETECTION.getCurrentWallet();
        const optimizedMessage = getOptimizedErrorMessage(error, currentWallet);

        console.error(`❌ 钱包错误 [${currentWallet}] ${context}:`, error);

        // 只记录日志，不显示弹窗（由调用方决定是否显示）
        // 这样可以避免重复弹窗
        return optimizedMessage;
    }
    
    // 导出到全局
    window.mobileWalletFix = {
        WALLET_DETECTION,
        WALLET_CONFIGS,
        checkEthSendTransactionSupport,
        smartSendTransaction,
        getOptimizedErrorMessage,
        showWalletError
    };
    
    console.log('✅ 移动端钱包兼容性修复模块加载完成');
    
})();
