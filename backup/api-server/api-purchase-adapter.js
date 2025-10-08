/**
 * API购买适配器
 * 将购买矿机功能改为通过API调用，支持所有钱包（包括欧意钱包）
 */

(function() {
    'use strict';
    
    console.log('🔌 加载 API 购买适配器...');
    
    // API配置
    const API_BASE_URL = 'http://localhost:3000';
    
    /**
     * API客户端
     */
    class APIClient {
        constructor(baseURL) {
            this.baseURL = baseURL;
        }
        
        async request(method, endpoint, data = null) {
            const url = `${this.baseURL}${endpoint}`;
            const options = {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            
            if (data) {
                options.body = JSON.stringify(data);
            }
            
            try {
                const response = await fetch(url, options);
                const result = await response.json();
                return result;
            } catch (error) {
                console.error('❌ API请求失败:', error);
                throw error;
            }
        }
        
        async get(endpoint) {
            return await this.request('GET', endpoint);
        }
        
        async post(endpoint, data) {
            return await this.request('POST', endpoint, data);
        }
    }
    
    // 创建API客户端实例
    const apiClient = new APIClient(API_BASE_URL);
    
    /**
     * 通过API购买矿机（支持所有钱包）
     */
    async function purchaseMinerViaAPI(level, paymentType) {
        console.log('🚀 使用API购买矿机');
        console.log('   等级:', level);
        console.log('   支付方式:', paymentType);
        
        try {
            // 1. 检查钱包连接
            if (!window.ethereum) {
                throw new Error('未检测到钱包，请安装MetaMask、欧意钱包或其他Web3钱包');
            }
            
            // 2. 获取用户地址
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (!accounts || accounts.length === 0) {
                // 请求连接
                const newAccounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                if (!newAccounts || newAccounts.length === 0) {
                    throw new Error('请先连接钱包');
                }
            }
            
            const userAddress = accounts[0];
            console.log('👤 用户地址:', userAddress);
            
            // 3. 检查网络
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            console.log('🌐 当前网络:', chainId);
            
            if (chainId !== '0x38') { // BSC Mainnet
                throw new Error('请切换到BSC测试网 (Chain ID: 97)');
            }
            
            // 4. 获取推荐人地址（优先级：URL参数 > 输入框 > 默认管理员）
            let referrer = getReferrerFromUrl();

            // 检查推荐人输入框
            if (!referrer) {
                const referrerInput = document.getElementById('referrerInput');
                if (referrerInput && referrerInput.value.trim()) {
                    const inputReferrer = referrerInput.value.trim();
                    if (/^0x[a-fA-F0-9]{40}$/.test(inputReferrer)) {
                        referrer = inputReferrer;
                        console.log('👥 使用输入框中的推荐人');
                    }
                }
            }

            // 如果仍然没有推荐人，使用管理员作为默认推荐人
            if (!referrer) {
                referrer = '0xfC3b7735Dae4C7AB3Ab85Ffa9987661e795B74b7'; // 主网管理员地址
                console.log('👥 使用管理员作为默认推荐人');
            }

            console.log('👥 最终推荐人:', referrer);
            
            // 5. 显示加载提示
            if (window.showMessage) {
                window.showMessage('正在准备交易...', 'info');
            }
            
            // 6. 通过API准备交易
            console.log('📡 调用API准备交易...');
            const response = await apiClient.post('/api/transaction/prepare', {
                action: 'purchaseMiner',
                params: {
                    level: parseInt(level),
                    referrer: referrer
                },
                from: userAddress
            });
            
            if (!response.success) {
                throw new Error(response.error || 'API准备交易失败');
            }
            
            console.log('✅ API返回交易数据:', response.data);
            
            const txData = response.data;
            
            // 7. 显示交易确认提示
            if (window.showMessage) {
                window.showMessage('请在钱包中确认交易...', 'info');
            }
            
            // 8. 发送交易（使用ethereum.request，兼容所有钱包）
            console.log('📤 发送交易到钱包...');
            const txHash = await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: txData.from,
                    to: txData.to,
                    data: txData.data,
                    gas: txData.gas,
                    gasPrice: txData.gasPrice,
                    value: txData.value || '0x0'
                }]
            });
            
            console.log('✅ 交易已发送:', txHash);
            
            // 9. 显示成功提示
            if (window.showMessage) {
                window.showMessage(`🎉 交易已提交！交易哈希: ${txHash}`, 'success');
            }
            
            // 10. 等待交易确认
            console.log('⏳ 等待交易确认...');
            if (window.showMessage) {
                window.showMessage('等待交易确认...', 'info');
            }
            
            // 轮询交易状态
            let confirmed = false;
            let attempts = 0;
            const maxAttempts = 60; // 最多等待60秒
            
            while (!confirmed && attempts < maxAttempts) {
                try {
                    const receipt = await window.ethereum.request({
                        method: 'eth_getTransactionReceipt',
                        params: [txHash]
                    });
                    
                    if (receipt && receipt.blockNumber) {
                        confirmed = true;
                        console.log('✅ 交易已确认！区块:', receipt.blockNumber);
                        
                        if (window.showMessage) {
                            window.showMessage('🎉 购买成功！正在刷新数据...', 'success');
                        }
                        
                        // 清除API缓存
                        try {
                            await apiClient.post('/api/cache/clear', {});
                        } catch (e) {
                            console.warn('清除缓存失败:', e);
                        }
                        
                        // 刷新用户数据
                        if (window.loadUserData) {
                            setTimeout(() => {
                                window.loadUserData();
                            }, 2000);
                        }
                        
                        return {
                            success: true,
                            transactionHash: txHash,
                            receipt: receipt
                        };
                    }
                } catch (e) {
                    // 继续等待
                }
                
                attempts++;
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            
            if (!confirmed) {
                console.warn('⚠️ 交易确认超时，但交易可能仍在处理中');
                if (window.showMessage) {
                    window.showMessage('交易已提交，请稍后刷新查看结果', 'warning');
                }
            }
            
            return {
                success: true,
                transactionHash: txHash
            };
            
        } catch (error) {
            console.error('❌ API购买失败:', error);
            
            // 显示错误提示
            if (window.showMessage) {
                let errorMsg = error.message || '购买失败';
                
                // 用户拒绝交易
                if (error.code === 4001 || errorMsg.includes('User rejected')) {
                    errorMsg = '您取消了交易';
                }
                // 余额不足
                else if (errorMsg.includes('insufficient funds')) {
                    errorMsg = 'BNB余额不足，无法支付Gas费';
                }
                // 网络错误
                else if (errorMsg.includes('network')) {
                    errorMsg = '网络错误，请检查网络连接';
                }
                
                window.showMessage(`❌ ${errorMsg}`, 'error');
            }
            
            throw error;
        }
    }
    
    /**
     * 获取URL中的推荐人地址
     */
    function getReferrerFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const ref = urlParams.get('ref');
        
        if (ref && /^0x[a-fA-F0-9]{40}$/.test(ref)) {
            return ref;
        }
        
        return null;
    }
    
    /**
     * 检查API服务器是否可用
     */
    async function checkAPIAvailability() {
        try {
            const response = await apiClient.get('/api/health');
            if (response.status === 'healthy') {
                console.log('✅ API服务器可用');
                return true;
            }
        } catch (error) {
            console.warn('⚠️ API服务器不可用，将回退到直接调用合约');
        }
        return false;
    }
    
    /**
     * 替换原有的purchaseMiner函数
     */
    async function purchaseMinerWithAPIFallback(level, paymentType) {
        console.log('🔄 购买矿机 - API优先模式');
        
        // 检查API是否可用
        const apiAvailable = await checkAPIAvailability();
        
        if (apiAvailable) {
            console.log('✅ 使用API购买');
            return await purchaseMinerViaAPI(level, paymentType);
        } else {
            console.log('⚠️ API不可用，回退到原有方法');
            
            // 回退到原有的purchaseMiner函数
            if (window.originalPurchaseMiner) {
                return await window.originalPurchaseMiner(level, paymentType);
            } else {
                throw new Error('API服务器不可用，且没有回退方案');
            }
        }
    }
    
    /**
     * 通过API授权USDT
     */
    async function authorizeUSDTViaAPI() {
        console.log('🔐 使用API授权USDT');

        try {
            // 1. 检查钱包连接
            if (!window.ethereum) {
                throw new Error('未检测到钱包');
            }

            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (!accounts || accounts.length === 0) {
                throw new Error('请先连接钱包');
            }

            const userAddress = accounts[0];
            console.log('👤 用户地址:', userAddress);

            // 2. 显示提示
            if (window.showMessage) {
                window.showMessage('正在准备授权交易...', 'info');
            }

            // 3. 通过API准备授权交易
            const response = await apiClient.post('/api/transaction/prepare', {
                action: 'authorizeUSDT',
                params: {
                    amount: '1000000000000000000000000' // 1,000,000 USDT (18 decimals)
                },
                from: userAddress
            });

            if (!response.success) {
                throw new Error(response.error || 'API准备授权交易失败');
            }

            const txData = response.data;

            // 4. 发送交易
            if (window.showMessage) {
                window.showMessage('请在钱包中确认授权...', 'info');
            }

            const txHash = await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: txData.from,
                    to: txData.to,
                    data: txData.data,
                    gas: txData.gas,
                    gasPrice: txData.gasPrice,
                    value: '0x0'
                }]
            });

            console.log('✅ 授权交易已发送:', txHash);

            if (window.showMessage) {
                window.showMessage('🎉 授权成功！', 'success');
            }

            return { success: true, transactionHash: txHash };

        } catch (error) {
            console.error('❌ 授权失败:', error);

            if (window.showMessage) {
                let errorMsg = error.message || '授权失败';
                if (error.code === 4001) {
                    errorMsg = '您取消了授权';
                }
                window.showMessage(`❌ ${errorMsg}`, 'error');
            }

            throw error;
        }
    }

    /**
     * 通过API一键授权并购买
     */
    async function oneClickPurchaseViaAPI(level) {
        console.log('⚡ 使用API一键授权并购买');

        try {
            // 先授权
            if (window.showMessage) {
                window.showMessage('步骤1/2: 授权USDT...', 'info');
            }

            await authorizeUSDTViaAPI();

            // 等待1秒
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 再购买
            if (window.showMessage) {
                window.showMessage('步骤2/2: 购买矿机...', 'info');
            }

            await purchaseMinerViaAPI(level, 'USDT');

            return { success: true };

        } catch (error) {
            console.error('❌ 一键购买失败:', error);
            throw error;
        }
    }

    /**
     * 通过API领取奖励
     */
    async function claimRewardsViaAPI() {
        console.log('💎 使用API领取奖励');

        try {
            // 1. 检查钱包连接
            if (!window.ethereum) {
                throw new Error('未检测到钱包');
            }

            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (!accounts || accounts.length === 0) {
                throw new Error('请先连接钱包');
            }

            const userAddress = accounts[0];
            console.log('👤 用户地址:', userAddress);

            // 2. 显示提示
            if (window.showMessage) {
                window.showMessage('正在准备领取交易...', 'info');
            }

            // 3. 通过API准备领取交易
            const response = await apiClient.post('/api/transaction/prepare', {
                action: 'claimRewards',
                params: {},
                from: userAddress
            });

            if (!response.success) {
                throw new Error(response.error || 'API准备领取交易失败');
            }

            const txData = response.data;

            // 4. 发送交易
            if (window.showMessage) {
                window.showMessage('请在钱包中确认领取...', 'info');
            }

            const txHash = await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: txData.from,
                    to: txData.to,
                    data: txData.data,
                    gas: txData.gas,
                    gasPrice: txData.gasPrice,
                    value: '0x0'
                }]
            });

            console.log('✅ 领取交易已发送:', txHash);

            if (window.showMessage) {
                window.showMessage('🎉 领取成功！', 'success');
            }

            // 等待确认并刷新数据
            setTimeout(async () => {
                if (window.loadUserData) {
                    await window.loadUserData();
                }
            }, 3000);

            return { success: true, transactionHash: txHash };

        } catch (error) {
            console.error('❌ 领取失败:', error);

            if (window.showMessage) {
                let errorMsg = error.message || '领取失败';
                if (error.code === 4001) {
                    errorMsg = '您取消了领取';
                }
                window.showMessage(`❌ ${errorMsg}`, 'error');
            }

            throw error;
        }
    }

    /**
     * 通过API授权DRM
     */
    async function authorizeDRMViaAPI(amount = '1000000000000000000000000') {
        console.log('🔐 使用API授权DRM');

        try {
            // 1. 检查钱包连接
            if (!window.ethereum) {
                throw new Error('未检测到钱包');
            }

            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (!accounts || accounts.length === 0) {
                throw new Error('请先连接钱包');
            }
            const userAddress = accounts[0];

            // 2. 调用API准备授权交易
            console.log('📡 调用API准备授权交易...');
            const response = await apiClient.post('/api/transaction/prepare', {
                action: 'authorizeDRM',
                params: { amount },
                from: userAddress
            });

            if (!response.success) {
                throw new Error(response.error || 'API返回失败');
            }

            const txData = response.data;
            console.log('✅ API返回交易数据');

            // 3. 使用标准方法发送交易
            console.log('📝 发送授权交易到钱包...');
            const txHash = await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: txData.from,
                    to: txData.to,
                    data: txData.data,
                    gas: txData.gas,
                    gasPrice: txData.gasPrice,
                    value: '0x0'
                }]
            });

            console.log('✅ DRM授权交易已发送:', txHash);

            if (window.showMessage) {
                window.showMessage('🎉 DRM授权成功！', 'success');
            }

            return { success: true, transactionHash: txHash };

        } catch (error) {
            console.error('❌ DRM授权失败:', error);

            if (window.showMessage) {
                let errorMsg = error.message || 'DRM授权失败';
                if (error.code === 4001) {
                    errorMsg = '您取消了授权';
                }
                window.showMessage(`❌ ${errorMsg}`, 'error');
            }

            throw error;
        }
    }

    /**
     * 通过API兑换USDT→DRM
     */
    async function exchangeUsdtToDrmViaAPI(usdtAmount) {
        console.log('🔄 使用API兑换USDT→DRM');

        try {
            // 1. 检查钱包连接
            if (!window.ethereum) {
                throw new Error('未检测到钱包');
            }

            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (!accounts || accounts.length === 0) {
                throw new Error('请先连接钱包');
            }
            const userAddress = accounts[0];

            // 2. 调用API准备兑换交易
            console.log('📡 调用API准备兑换交易...');
            const response = await apiClient.post('/api/transaction/prepare', {
                action: 'exchangeUsdtToDrm',
                params: { usdtAmount },
                from: userAddress
            });

            if (!response.success) {
                throw new Error(response.error || 'API返回失败');
            }

            const txData = response.data;
            console.log('✅ API返回交易数据');

            // 3. 使用标准方法发送交易
            console.log('📝 发送兑换交易到钱包...');
            const txHash = await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: txData.from,
                    to: txData.to,
                    data: txData.data,
                    gas: txData.gas,
                    gasPrice: txData.gasPrice,
                    value: '0x0'
                }]
            });

            console.log('✅ 兑换交易已发送:', txHash);

            if (window.showMessage) {
                window.showMessage('🎉 兑换成功！', 'success');
            }

            // 等待确认并刷新数据
            setTimeout(async () => {
                if (window.loadUserData) {
                    await window.loadUserData();
                }
            }, 3000);

            return { success: true, transactionHash: txHash };

        } catch (error) {
            console.error('❌ 兑换失败:', error);

            if (window.showMessage) {
                let errorMsg = error.message || '兑换失败';
                if (error.code === 4001) {
                    errorMsg = '您取消了兑换';
                }
                window.showMessage(`❌ ${errorMsg}`, 'error');
            }

            throw error;
        }
    }

    /**
     * 通过API兑换DRM→USDT
     */
    async function exchangeDrmToUsdtViaAPI(drmAmount) {
        console.log('🔄 使用API兑换DRM→USDT');

        try {
            // 1. 检查钱包连接
            if (!window.ethereum) {
                throw new Error('未检测到钱包');
            }

            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (!accounts || accounts.length === 0) {
                throw new Error('请先连接钱包');
            }
            const userAddress = accounts[0];

            // 2. 调用API准备兑换交易
            console.log('📡 调用API准备兑换交易...');
            const response = await apiClient.post('/api/transaction/prepare', {
                action: 'exchangeDrmToUsdt',
                params: { drmAmount },
                from: userAddress
            });

            if (!response.success) {
                throw new Error(response.error || 'API返回失败');
            }

            const txData = response.data;
            console.log('✅ API返回交易数据');

            // 3. 使用标准方法发送交易
            console.log('📝 发送兑换交易到钱包...');
            const txHash = await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: txData.from,
                    to: txData.to,
                    data: txData.data,
                    gas: txData.gas,
                    gasPrice: txData.gasPrice,
                    value: '0x0'
                }]
            });

            console.log('✅ 兑换交易已发送:', txHash);

            if (window.showMessage) {
                window.showMessage('🎉 兑换成功！', 'success');
            }

            // 等待确认并刷新数据
            setTimeout(async () => {
                if (window.loadUserData) {
                    await window.loadUserData();
                }
            }, 3000);

            return { success: true, transactionHash: txHash };

        } catch (error) {
            console.error('❌ 兑换失败:', error);

            if (window.showMessage) {
                let errorMsg = error.message || '兑换失败';
                if (error.code === 4001) {
                    errorMsg = '您取消了兑换';
                }
                window.showMessage(`❌ ${errorMsg}`, 'error');
            }

            throw error;
        }
    }

    /**
     * 通过API转让矿机
     */
    async function transferMinerViaAPI(tokenId, toAddress) {
        console.log('📤 使用API转让矿机');

        try {
            // 1. 检查钱包连接
            if (!window.ethereum) {
                throw new Error('未检测到钱包');
            }

            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (!accounts || accounts.length === 0) {
                throw new Error('请先连接钱包');
            }
            const userAddress = accounts[0];

            // 2. 验证参数
            if (!tokenId || !toAddress) {
                throw new Error('缺少必要参数：矿机ID或接收地址');
            }

            // 验证接收地址格式
            if (!/^0x[a-fA-F0-9]{40}$/.test(toAddress)) {
                throw new Error('接收地址格式无效');
            }

            // 不能转给自己
            if (toAddress.toLowerCase() === userAddress.toLowerCase()) {
                throw new Error('不能转让给自己');
            }

            // 2. 调用API准备转让交易
            console.log('📡 调用API准备转让交易...');
            const response = await apiClient.post('/api/transaction/prepare', {
                action: 'transferMiner',
                params: { tokenId, toAddress },
                from: userAddress
            });

            if (!response.success) {
                throw new Error(response.error || 'API返回失败');
            }

            const txData = response.data;
            console.log('✅ API返回交易数据');

            // 3. 使用标准方法发送交易
            console.log('📝 发送转让交易到钱包...');
            const txHash = await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: txData.from,
                    to: txData.to,
                    data: txData.data,
                    gas: txData.gas,
                    gasPrice: txData.gasPrice,
                    value: '0x0'
                }]
            });

            console.log('✅ 转让交易已发送:', txHash);

            if (window.showMessage) {
                window.showMessage('🎉 矿机转让成功！', 'success');
            }

            // 等待确认并刷新数据
            setTimeout(async () => {
                if (window.loadUserData) {
                    await window.loadUserData();
                }
            }, 3000);

            return { success: true, transactionHash: txHash };

        } catch (error) {
            console.error('❌ 转让失败:', error);

            if (window.showMessage) {
                let errorMsg = error.message || '转让失败';
                if (error.code === 4001) {
                    errorMsg = '您取消了转让';
                }
                window.showMessage(`❌ ${errorMsg}`, 'error');
            }

            throw error;
        }
    }

    // 保存原有函数
    if (window.purchaseMiner) {
        window.originalPurchaseMiner = window.purchaseMiner;
        console.log('💾 已保存原有的purchaseMiner函数');
    }
    if (window.authorizeUSDT) {
        window.originalAuthorizeUSDT = window.authorizeUSDT;
        console.log('💾 已保存原有的authorizeUSDT函数');
    }
    if (window.oneClickPurchase) {
        window.originalOneClickPurchase = window.oneClickPurchase;
        console.log('💾 已保存原有的oneClickPurchase函数');
    }
    if (window.claimRewards) {
        window.originalClaimRewards = window.claimRewards;
        console.log('💾 已保存原有的claimRewards函数');
    }

    // 替换为新的函数（API优先）
    window.purchaseMiner = purchaseMinerWithAPIFallback;
    window.authorizeUSDT = authorizeUSDTViaAPI;
    window.authorizeDRM = authorizeDRMViaAPI;
    window.oneClickPurchase = oneClickPurchaseViaAPI;
    window.claimRewards = claimRewardsViaAPI;
    window.exchangeUsdtToDrm = exchangeUsdtToDrmViaAPI;
    window.exchangeDrmToUsdt = exchangeDrmToUsdtViaAPI;
    window.transferMiner = transferMinerViaAPI;

    // 导出API方法
    window.purchaseMinerViaAPI = purchaseMinerViaAPI;
    window.authorizeUSDTViaAPI = authorizeUSDTViaAPI;
    window.authorizeDRMViaAPI = authorizeDRMViaAPI;
    window.oneClickPurchaseViaAPI = oneClickPurchaseViaAPI;
    window.claimRewardsViaAPI = claimRewardsViaAPI;
    window.exchangeUsdtToDrmViaAPI = exchangeUsdtToDrmViaAPI;
    window.exchangeDrmToUsdtViaAPI = exchangeDrmToUsdtViaAPI;
    window.transferMinerViaAPI = transferMinerViaAPI;
    window.apiClient = apiClient;

    console.log('✅ API完整适配器加载完成');
    console.log('📋 已替换的函数:');
    console.log('   - window.purchaseMiner → API优先');
    console.log('   - window.authorizeUSDT → API方法');
    console.log('   - window.authorizeDRM → API方法');
    console.log('   - window.oneClickPurchase → API方法');
    console.log('   - window.claimRewards → API方法');
    console.log('   - window.exchangeUsdtToDrm → API方法');
    console.log('   - window.exchangeDrmToUsdt → API方法');
    console.log('   - window.transferMiner → API方法');
    console.log('📋 原有函数备份:');
    console.log('   - window.originalPurchaseMiner');
    console.log('   - window.originalAuthorizeUSDT');
    console.log('   - window.originalOneClickPurchase');
    console.log('   - window.originalClaimRewards');

})();

