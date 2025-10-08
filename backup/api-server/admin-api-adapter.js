/**
 * 管理员功能API适配器
 * 通过API调用管理员功能
 * 
 * 日期: 2025-09-30
 */

(function() {
    'use strict';
    
    console.log('🔧 加载管理员API适配器...');

    const API_BASE_URL = 'http://localhost:3000';

    /**
     * 通用API请求函数
     */
    async function apiRequest(endpoint, method = 'GET', data = null) {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        const result = await response.json();

        if (!result.success) {
            throw new Error(result.error || 'API请求失败');
        }

        return result.data;
    }

    /**
     * 签名并发送交易
     */
    async function signAndSendTransaction(txData) {
        if (!window.ethereum) {
            throw new Error('请先安装MetaMask或其他Web3钱包');
        }

        console.log('📝 准备签名交易:', txData);

        try {
            // 确保钱包已连接
            if (!window.userAccount) {
                throw new Error('请先连接钱包');
            }

            // 使用 ethereum.request 方法发送交易（MetaMask推荐方式）
            // 保持十六进制格式，MetaMask会自动处理
            const txParams = {
                from: txData.from,
                to: txData.to,
                data: txData.data,
                gas: txData.gas,
                gasPrice: txData.gasPrice,
                value: txData.value || '0x0',
                chainId: '0x38' // BSC Mainnet chainId = 56 = 0x38
            };

            console.log('📝 交易参数:', txParams);

            // 使用 eth_sendTransaction 通过 MetaMask 发送
            const txHash = await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [txParams]
            });

            console.log('✅ 交易已发送，哈希:', txHash);

            // 等待交易确认
            console.log('⏳ 等待交易确认...');
            const receipt = await waitForTransaction(txHash);

            console.log('✅ 交易已确认:', receipt);
            return receipt;

        } catch (error) {
            console.error('❌ 交易失败:', error);
            throw error;
        }
    }

    /**
     * 等待交易确认
     */
    async function waitForTransaction(txHash, maxAttempts = 60) {
        for (let i = 0; i < maxAttempts; i++) {
            try {
                const receipt = await window.web3.eth.getTransactionReceipt(txHash);
                if (receipt) {
                    if (receipt.status) {
                        return receipt;
                    } else {
                        throw new Error('交易失败');
                    }
                }
            } catch (error) {
                if (i === maxAttempts - 1) {
                    throw error;
                }
            }
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        throw new Error('交易确认超时');
    }

    // ==================== 管理员功能API适配器 ====================

    /**
     * 添加特殊推荐人（通过API）
     */
    window.addSpecialReferrerViaAPI = async function(referrerAddress) {
        console.log(`🌐 API: 添加特殊推荐人 ${referrerAddress}`);

        if (!window.userAccount) {
            throw new Error('请先连接钱包');
        }

        try {
            // 1. 调用API准备交易
            const txData = await apiRequest('/api/transaction/prepare', 'POST', {
                action: 'addSpecialReferrer',
                from: window.userAccount,  // 修正：使用 'from' 而不是 'fromAddress'
                params: {
                    referrerAddress: referrerAddress
                }
            });

            // 2. 签名并发送交易
            const receipt = await signAndSendTransaction(txData);

            console.log('✅ 特殊推荐人添加成功');
            return receipt;

        } catch (error) {
            console.error('❌ API添加特殊推荐人失败:', error);
            throw error;
        }
    };

    /**
     * 移除特殊推荐人（通过API）
     */
    window.removeSpecialReferrerViaAPI = async function(referrerAddress) {
        console.log(`🌐 API: 移除特殊推荐人 ${referrerAddress}`);

        if (!window.userAccount) {
            throw new Error('请先连接钱包');
        }

        try {
            // 1. 调用API准备交易
            const txData = await apiRequest('/api/transaction/prepare', 'POST', {
                action: 'removeSpecialReferrer',
                fromAddress: window.userAccount,
                params: {
                    referrerAddress: referrerAddress
                }
            });

            // 2. 签名并发送交易
            const receipt = await signAndSendTransaction(txData);

            console.log('✅ 特殊推荐人移除成功');
            return receipt;

        } catch (error) {
            console.error('❌ API移除特殊推荐人失败:', error);
            throw error;
        }
    };

    /**
     * 注入流动性（通过API）
     */
    window.adminInjectLiquidityViaAPI = async function(usdtAmount, drmAmount) {
        console.log(`🌐 API: 注入流动性 USDT=${usdtAmount}, DRM=${drmAmount}`);

        if (!window.userAccount) {
            throw new Error('请先连接钱包');
        }

        try {
            // 1. 调用API准备交易
            const txData = await apiRequest('/api/transaction/prepare', 'POST', {
                action: 'adminInjectLiquidity',
                fromAddress: window.userAccount,
                params: {
                    usdtAmount: usdtAmount,
                    drmAmount: drmAmount
                }
            });

            // 2. 签名并发送交易
            const receipt = await signAndSendTransaction(txData);

            console.log('✅ 流动性注入成功');
            return receipt;

        } catch (error) {
            console.error('❌ API注入流动性失败:', error);
            throw error;
        }
    };

    /**
     * 管理员提取（通过API）
     */
    window.adminWithdrawViaAPI = async function(tokenAddress, amount) {
        console.log(`🌐 API: 管理员提取 token=${tokenAddress}, amount=${amount}`);

        if (!window.userAccount) {
            throw new Error('请先连接钱包');
        }

        try {
            // 1. 调用API准备交易
            const txData = await apiRequest('/api/transaction/prepare', 'POST', {
                action: 'adminWithdraw',
                fromAddress: window.userAccount,
                params: {
                    tokenAddress: tokenAddress,
                    amount: amount
                }
            });

            // 2. 签名并发送交易
            const receipt = await signAndSendTransaction(txData);

            console.log('✅ 管理员提取成功');
            return receipt;

        } catch (error) {
            console.error('❌ API管理员提取失败:', error);
            throw error;
        }
    };

    /**
     * 紧急暂停（通过API）
     */
    window.emergencyPauseViaAPI = async function() {
        console.log(`🌐 API: 紧急暂停合约`);

        if (!window.userAccount) {
            throw new Error('请先连接钱包');
        }

        try {
            // 1. 调用API准备交易
            const txData = await apiRequest('/api/transaction/prepare', 'POST', {
                action: 'emergencyPause',
                fromAddress: window.userAccount,
                params: {}
            });

            // 2. 签名并发送交易
            const receipt = await signAndSendTransaction(txData);

            console.log('✅ 合约已紧急暂停');
            return receipt;

        } catch (error) {
            console.error('❌ API紧急暂停失败:', error);
            throw error;
        }
    };

    /**
     * 更新过期矿机（通过API）
     */
    window.updateExpiredMinersViaAPI = async function(userAddress) {
        console.log(`🌐 API: 更新过期矿机 user=${userAddress}`);

        if (!window.userAccount) {
            throw new Error('请先连接钱包');
        }

        try {
            // 1. 调用API准备交易
            const txData = await apiRequest('/api/transaction/prepare', 'POST', {
                action: 'updateExpiredMiners',
                fromAddress: window.userAccount,
                params: {
                    userAddress: userAddress
                }
            });

            // 2. 签名并发送交易
            const receipt = await signAndSendTransaction(txData);

            console.log('✅ 过期矿机更新成功');
            return receipt;

        } catch (error) {
            console.error('❌ API更新过期矿机失败:', error);
            throw error;
        }
    };

    console.log('✅ 管理员API适配器加载完成');
    console.log('   - addSpecialReferrerViaAPI()');
    console.log('   - removeSpecialReferrerViaAPI()');
    console.log('   - adminInjectLiquidityViaAPI()');
    console.log('   - adminWithdrawViaAPI()');
    console.log('   - emergencyPauseViaAPI()');
    console.log('   - updateExpiredMinersViaAPI()');

})();

