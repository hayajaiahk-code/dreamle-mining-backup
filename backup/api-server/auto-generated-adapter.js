/**
 * 自动生成的前端适配器
 * 生成时间: 2025-09-30T01:20:13.719Z
 * 
 * ⚠️ 警告：此文件由脚本自动生成，请勿手动编辑！
 * 如需修改，请编辑生成脚本: scripts/generate-frontend-functions.js
 */

(function() {
    'use strict';
    
    console.log('🤖 加载自动生成的API适配器...');
    
    const API_BASE_URL = 'http://localhost:3000';
    
    // API客户端
    class APIClient {
        constructor(baseURL) {
            this.baseURL = baseURL;
        }
        
        async request(method, endpoint, data = null) {
            const url = `${this.baseURL}${endpoint}`;
            const options = {
                method: method,
                headers: { 'Content-Type': 'application/json' }
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
    
    const apiClient = new APIClient(API_BASE_URL);
    
    // 检查API可用性
    async function checkAPIAvailability() {
        try {
            const response = await apiClient.get('/api/health');
            return response.status === 'healthy';
        } catch (error) {
            return false;
        }
    }
    
    // 获取推荐人地址
    function getReferrerFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('ref') || '0x0000000000000000000000000000000000000000';
    }
    

    /**
     * claimRewards - 通过API调用
     * 
     */
    async function claimRewardsViaAPI() {
        console.log('🚀 调用API: claimRewards');
        
        try {
            // 检查钱包连接
            if (!window.ethereum) {
                throw new Error('未检测到钱包');
            }
            
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (!accounts || accounts.length === 0) {
                throw new Error('请先连接钱包');
            }
            
            const userAddress = accounts[0];
            
            // 准备参数
            const apiParams = {
                
            };
            
            // 调用API准备交易
            const response = await apiClient.post('/api/transaction/prepare', {
                action: 'claimRewards',
                params: apiParams,
                from: userAddress
            });
            
            if (!response.success) {
                throw new Error(response.error || 'API返回失败');
            }
            
            const txData = response.data;
            
            // 发送交易
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
            
            if (window.showMessage) {
                window.showMessage('🎉 交易已提交！', 'success');
            }
            
            return { success: true, transactionHash: txHash };
            
        } catch (error) {
            console.error('❌ claimRewards 失败:', error);
            
            if (window.showMessage) {
                let errorMsg = error.message || '操作失败';
                if (error.code === 4001) {
                    errorMsg = '您取消了操作';
                }
                window.showMessage(`❌ ${errorMsg}`, 'error');
            }
            
            throw error;
        }
    }

    /**
     * exchangeDrmToUsdt - 通过API调用
     * @param {uint256} drmAmount
     */
    async function exchangeDrmToUsdtViaAPI(drmAmount) {
        console.log('🚀 调用API: exchangeDrmToUsdt');
        
        try {
            // 检查钱包连接
            if (!window.ethereum) {
                throw new Error('未检测到钱包');
            }
            
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (!accounts || accounts.length === 0) {
                throw new Error('请先连接钱包');
            }
            
            const userAddress = accounts[0];
            
            // 准备参数
            const apiParams = {
                drmAmount: drmAmount
            };
            
            // 调用API准备交易
            const response = await apiClient.post('/api/transaction/prepare', {
                action: 'exchangeDrmToUsdt',
                params: apiParams,
                from: userAddress
            });
            
            if (!response.success) {
                throw new Error(response.error || 'API返回失败');
            }
            
            const txData = response.data;
            
            // 发送交易
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
            
            if (window.showMessage) {
                window.showMessage('🎉 交易已提交！', 'success');
            }
            
            return { success: true, transactionHash: txHash };
            
        } catch (error) {
            console.error('❌ exchangeDrmToUsdt 失败:', error);
            
            if (window.showMessage) {
                let errorMsg = error.message || '操作失败';
                if (error.code === 4001) {
                    errorMsg = '您取消了操作';
                }
                window.showMessage(`❌ ${errorMsg}`, 'error');
            }
            
            throw error;
        }
    }

    /**
     * exchangeUsdtToDrm - 通过API调用
     * @param {uint256} usdtAmount
     */
    async function exchangeUsdtToDrmViaAPI(usdtAmount) {
        console.log('🚀 调用API: exchangeUsdtToDrm');
        
        try {
            // 检查钱包连接
            if (!window.ethereum) {
                throw new Error('未检测到钱包');
            }
            
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (!accounts || accounts.length === 0) {
                throw new Error('请先连接钱包');
            }
            
            const userAddress = accounts[0];
            
            // 准备参数
            const apiParams = {
                usdtAmount: usdtAmount
            };
            
            // 调用API准备交易
            const response = await apiClient.post('/api/transaction/prepare', {
                action: 'exchangeUsdtToDrm',
                params: apiParams,
                from: userAddress
            });
            
            if (!response.success) {
                throw new Error(response.error || 'API返回失败');
            }
            
            const txData = response.data;
            
            // 发送交易
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
            
            if (window.showMessage) {
                window.showMessage('🎉 交易已提交！', 'success');
            }
            
            return { success: true, transactionHash: txHash };
            
        } catch (error) {
            console.error('❌ exchangeUsdtToDrm 失败:', error);
            
            if (window.showMessage) {
                let errorMsg = error.message || '操作失败';
                if (error.code === 4001) {
                    errorMsg = '您取消了操作';
                }
                window.showMessage(`❌ ${errorMsg}`, 'error');
            }
            
            throw error;
        }
    }

    /**
     * purchaseMinerWithDRM - 通过API调用
     * @param {uint8} level
     * @param {address} referrer
     */
    async function purchaseMinerWithDRMViaAPI(level, referrer) {
        console.log('🚀 调用API: purchaseMinerWithDRM');
        
        try {
            // 检查钱包连接
            if (!window.ethereum) {
                throw new Error('未检测到钱包');
            }
            
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (!accounts || accounts.length === 0) {
                throw new Error('请先连接钱包');
            }
            
            const userAddress = accounts[0];
            
            // 准备参数
            const apiParams = {
                level: level,
                referrer: referrer
            };
            
            // 调用API准备交易
            const response = await apiClient.post('/api/transaction/prepare', {
                action: 'purchaseMinerWithDRM',
                params: apiParams,
                from: userAddress
            });
            
            if (!response.success) {
                throw new Error(response.error || 'API返回失败');
            }
            
            const txData = response.data;
            
            // 发送交易
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
            
            if (window.showMessage) {
                window.showMessage('🎉 交易已提交！', 'success');
            }
            
            return { success: true, transactionHash: txHash };
            
        } catch (error) {
            console.error('❌ purchaseMinerWithDRM 失败:', error);
            
            if (window.showMessage) {
                let errorMsg = error.message || '操作失败';
                if (error.code === 4001) {
                    errorMsg = '您取消了操作';
                }
                window.showMessage(`❌ ${errorMsg}`, 'error');
            }
            
            throw error;
        }
    }

    /**
     * purchaseMinerWithUSDT - 通过API调用
     * @param {uint8} level
     * @param {address} referrer
     */
    async function purchaseMinerWithUSDTViaAPI(level, referrer) {
        console.log('🚀 调用API: purchaseMinerWithUSDT');
        
        try {
            // 检查钱包连接
            if (!window.ethereum) {
                throw new Error('未检测到钱包');
            }
            
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (!accounts || accounts.length === 0) {
                throw new Error('请先连接钱包');
            }
            
            const userAddress = accounts[0];
            
            // 准备参数
            const apiParams = {
                level: level,
                referrer: referrer
            };
            
            // 调用API准备交易
            const response = await apiClient.post('/api/transaction/prepare', {
                action: 'purchaseMinerWithUSDT',
                params: apiParams,
                from: userAddress
            });
            
            if (!response.success) {
                throw new Error(response.error || 'API返回失败');
            }
            
            const txData = response.data;
            
            // 发送交易
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
            
            if (window.showMessage) {
                window.showMessage('🎉 交易已提交！', 'success');
            }
            
            return { success: true, transactionHash: txHash };
            
        } catch (error) {
            console.error('❌ purchaseMinerWithUSDT 失败:', error);
            
            if (window.showMessage) {
                let errorMsg = error.message || '操作失败';
                if (error.code === 4001) {
                    errorMsg = '您取消了操作';
                }
                window.showMessage(`❌ ${errorMsg}`, 'error');
            }
            
            throw error;
        }
    }

    /**
     * renewMiner - 通过API调用
     * @param {uint256} tokenId
     */
    async function renewMinerViaAPI(tokenId) {
        console.log('🚀 调用API: renewMiner');
        
        try {
            // 检查钱包连接
            if (!window.ethereum) {
                throw new Error('未检测到钱包');
            }
            
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (!accounts || accounts.length === 0) {
                throw new Error('请先连接钱包');
            }
            
            const userAddress = accounts[0];
            
            // 准备参数
            const apiParams = {
                tokenId: tokenId
            };
            
            // 调用API准备交易
            const response = await apiClient.post('/api/transaction/prepare', {
                action: 'renewMiner',
                params: apiParams,
                from: userAddress
            });
            
            if (!response.success) {
                throw new Error(response.error || 'API返回失败');
            }
            
            const txData = response.data;
            
            // 发送交易
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
            
            if (window.showMessage) {
                window.showMessage('🎉 交易已提交！', 'success');
            }
            
            return { success: true, transactionHash: txHash };
            
        } catch (error) {
            console.error('❌ renewMiner 失败:', error);
            
            if (window.showMessage) {
                let errorMsg = error.message || '操作失败';
                if (error.code === 4001) {
                    errorMsg = '您取消了操作';
                }
                window.showMessage(`❌ ${errorMsg}`, 'error');
            }
            
            throw error;
        }
    }

    /**
     * transferFrom - 通过API调用
     * @param {address} from
     * @param {address} to
     * @param {uint256} tokenId
     */
    async function transferFromViaAPI(from, to, tokenId) {
        console.log('🚀 调用API: transferFrom');
        
        try {
            // 检查钱包连接
            if (!window.ethereum) {
                throw new Error('未检测到钱包');
            }
            
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (!accounts || accounts.length === 0) {
                throw new Error('请先连接钱包');
            }
            
            const userAddress = accounts[0];
            
            // 准备参数
            const apiParams = {
                from: from,
                to: to,
                tokenId: tokenId
            };
            
            // 调用API准备交易
            const response = await apiClient.post('/api/transaction/prepare', {
                action: 'transferFrom',
                params: apiParams,
                from: userAddress
            });
            
            if (!response.success) {
                throw new Error(response.error || 'API返回失败');
            }
            
            const txData = response.data;
            
            // 发送交易
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
            
            if (window.showMessage) {
                window.showMessage('🎉 交易已提交！', 'success');
            }
            
            return { success: true, transactionHash: txHash };
            
        } catch (error) {
            console.error('❌ transferFrom 失败:', error);
            
            if (window.showMessage) {
                let errorMsg = error.message || '操作失败';
                if (error.code === 4001) {
                    errorMsg = '您取消了操作';
                }
                window.showMessage(`❌ ${errorMsg}`, 'error');
            }
            
            throw error;
        }
    }

    /**
     * 授权USDT代币 - 通过API调用
     * @param {string} amount - 授权金额（可选，默认最大值）
     */
    async function authorizeUSDTViaAPI(amount) {
        console.log('🔓 授权USDT代币');
        
        try {
            if (!window.ethereum) {
                throw new Error('未检测到钱包');
            }
            
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (!accounts || accounts.length === 0) {
                throw new Error('请先连接钱包');
            }
            
            const userAddress = accounts[0];
            const approveAmount = amount || '1000000000000000000000000'; // 默认1,000,000
            
            const response = await apiClient.post('/api/transaction/prepare', {
                action: 'authorizeUSDT',
                params: { amount: approveAmount },
                from: userAddress
            });
            
            if (!response.success) {
                throw new Error(response.error || 'API返回失败');
            }
            
            const txData = response.data;
            
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
            
            console.log('✅ USDT授权成功:', txHash);
            
            if (window.showMessage) {
                window.showMessage('✅ USDT授权成功！', 'success');
            }
            
            return { success: true, transactionHash: txHash };
            
        } catch (error) {
            console.error('❌ USDT授权失败:', error);
            
            if (window.showMessage) {
                window.showMessage(`❌ 授权失败: ${error.message}`, 'error');
            }
            
            throw error;
        }
    }

    /**
     * 授权DRM代币 - 通过API调用
     * @param {string} amount - 授权金额（可选，默认最大值）
     */
    async function authorizeDRMViaAPI(amount) {
        console.log('🔓 授权DRM代币');
        
        try {
            if (!window.ethereum) {
                throw new Error('未检测到钱包');
            }
            
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (!accounts || accounts.length === 0) {
                throw new Error('请先连接钱包');
            }
            
            const userAddress = accounts[0];
            const approveAmount = amount || '1000000000000000000000000'; // 默认1,000,000
            
            const response = await apiClient.post('/api/transaction/prepare', {
                action: 'authorizeDRM',
                params: { amount: approveAmount },
                from: userAddress
            });
            
            if (!response.success) {
                throw new Error(response.error || 'API返回失败');
            }
            
            const txData = response.data;
            
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
            
            console.log('✅ DRM授权成功:', txHash);
            
            if (window.showMessage) {
                window.showMessage('✅ DRM授权成功！', 'success');
            }
            
            return { success: true, transactionHash: txHash };
            
        } catch (error) {
            console.error('❌ DRM授权失败:', error);
            
            if (window.showMessage) {
                window.showMessage(`❌ 授权失败: ${error.message}`, 'error');
            }
            
            throw error;
        }
    }

    // 导出所有函数到全局
    console.log('📦 导出自动生成的函数...');
    
    window.claimRewardsViaAPI = claimRewardsViaAPI;
    window.exchangeDrmToUsdtViaAPI = exchangeDrmToUsdtViaAPI;
    window.exchangeUsdtToDrmViaAPI = exchangeUsdtToDrmViaAPI;
    window.purchaseMinerWithDRMViaAPI = purchaseMinerWithDRMViaAPI;
    window.purchaseMinerWithUSDTViaAPI = purchaseMinerWithUSDTViaAPI;
    window.renewMinerViaAPI = renewMinerViaAPI;
    window.transferFromViaAPI = transferFromViaAPI;
    window.authorizeUSDTViaAPI = authorizeUSDTViaAPI;
    window.authorizeDRMViaAPI = authorizeDRMViaAPI;

    window.apiClient = apiClient;
    window.checkAPIAvailability = checkAPIAvailability;
    
    console.log('✅ 自动生成的API适配器加载完成');
})();
