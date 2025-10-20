/**
 * 自动加载管理员数据
 * 即使没有连接钱包也能显示管理员的挖矿数据
 */

console.log('🚀 加载自动管理员数据模块...');

// 使用window作用域避免重复声明
window.AUTO_LOAD_ADMIN_ADDRESS = '0xfC3b7735Dae4C7AB3Ab85Ffa9987661e795B74b7';

// 等待Web3和合约初始化
async function waitForWeb3() {
    let attempts = 0;
    const maxAttempts = 50;
    
    while (attempts < maxAttempts) {
        if (window.web3 && window.CONTRACT_ADDRESSES) {
            console.log('✅ Web3已准备就绪');
            return true;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
    }
    
    console.error('❌ Web3初始化超时');
    return false;
}

// 加载管理员数据
async function loadAdminData() {
    // 🔒 安全修复：只有连接钱包后才加载数据
    if (!window.isConnected || !window.userAccount) {
        console.log('🔒 未连接钱包，禁止加载管理员数据（安全保护）');
        return;
    }

    // 🔒 额外检查：只有管理员本人连接钱包才能看到数据
    if (window.userAccount.toLowerCase() !== window.AUTO_LOAD_ADMIN_ADDRESS.toLowerCase()) {
        console.log('🔒 非管理员账户，禁止加载管理员数据');
        return;
    }

    try {
        console.log('🔍 开始加载管理员数据...');

        // 等待Web3准备就绪
        const ready = await waitForWeb3();
        if (!ready) {
            console.error('❌ Web3未准备就绪');
            return;
        }

        // 创建合约实例
        const unifiedContract = new window.web3.eth.Contract(
            window.UNIFIED_SYSTEM_V19_ABI,
            window.CONTRACT_ADDRESSES.UNIFIED_SYSTEM
        );

        console.log('✅ 合约实例已创建');

        // 获取挖矿数据
        console.log('📡 正在获取管理员挖矿数据...');
        const miningData = await unifiedContract.methods.getUserMiningData(window.AUTO_LOAD_ADMIN_ADDRESS).call();
        console.log('✅ 挖矿数据:', miningData);

        // 更新UI
        updateMiningUI(miningData);

        // 获取矿机列表
        console.log('📡 正在获取管理员矿机列表...');
        const minerIds = await unifiedContract.methods.getUserMiners(window.AUTO_LOAD_ADMIN_ADDRESS).call();
        console.log('✅ 矿机列表:', minerIds);

        // 更新矿机UI
        await updateMinersUI(unifiedContract, minerIds);

        // 获取代币余额 - 已禁用（防止显示管理员余额给未登录用户）
        // await updateBalances(window.AUTO_LOAD_ADMIN_ADDRESS);
        console.log('⚠️ 跳过余额更新 - 余额只在用户连接钱包后显示');

        // 获取网络统计
        await updateNetworkStats(unifiedContract);

        console.log('🎉 管理员数据加载完成！');

    } catch (error) {
        console.error('❌ 加载管理员数据失败:', error);
        console.error('错误堆栈:', error.stack);
    }
}

// 更新挖矿数据UI
function updateMiningUI(miningData) {
    try {
        console.log('🔄 开始更新挖矿UI，原始数据:', miningData);

        // 总算力
        const totalHashpower = document.getElementById('totalHashpower');
        if (totalHashpower) {
            const value = Number(miningData[0]);
            totalHashpower.textContent = value.toLocaleString();
            console.log('✅ 总算力已更新:', value);
        }

        // 有效算力
        const validHashpower = document.getElementById('validHashpower');
        if (validHashpower) {
            const value = Number(miningData[11]);
            validHashpower.textContent = value.toLocaleString();
            console.log('✅ 有效算力已更新:', value);
        }

        // 待领取DRM
        const pendingRewards = document.getElementById('pendingRewards');
        if (pendingRewards) {
            const pending = window.web3.utils.fromWei(miningData[8].toString(), 'ether');
            const value = parseFloat(pending);
            pendingRewards.textContent = isNaN(value) ? '0.0000' : value.toFixed(4);
            console.log('✅ 待领取DRM已更新:', value);
        }

        // 总领取DRM
        const totalClaimed = document.getElementById('totalClaimed');
        if (totalClaimed) {
            const claimed = window.web3.utils.fromWei(miningData[3].toString(), 'ether');
            const value = parseFloat(claimed);
            totalClaimed.textContent = isNaN(value) ? '0.0000' : value.toFixed(4);
            console.log('✅ 总领取DRM已更新:', value);
        }

        // 矿机数量
        const minerCount = document.getElementById('minerCount');
        if (minerCount) {
            const value = Number(miningData[5]);
            minerCount.textContent = value.toString();
            console.log('✅ 矿机数量已更新:', value);
        }

        console.log('✅ 挖矿数据UI更新完成');
    } catch (error) {
        console.error('❌ 更新挖矿UI失败:', error);
        console.error('错误堆栈:', error.stack);
    }
}

// 更新矿机列表UI
async function updateMinersUI(contract, minerIds) {
    try {
        const minersList = document.getElementById('minersList');
        if (!minersList) {
            console.warn('⚠️ 矿机列表元素未找到');
            return;
        }
        
        if (minerIds.length === 0) {
            minersList.innerHTML = '<div class="no-miners">NO MINERS<br>没有矿工</div>';
            return;
        }
        
        let html = '';
        const now = Math.floor(Date.now() / 1000);
        
        for (const tokenId of minerIds) {
            const metadata = await contract.methods.getNFTMetadata(tokenId).call();
            const level = metadata[0];
            const hashPower = metadata[1];
            const purchaseTime = metadata[2];
            const expiryTime = metadata[3];
            
            const remainingTime = Math.max(0, Number(expiryTime) - now);
            const remainingDays = (remainingTime / 86400).toFixed(1);
            const isExpired = now >= Number(expiryTime);
            
            html += `
                <div class="miner-card ${isExpired ? 'expired' : 'active'}">
                    <div class="miner-header">
                        <span class="miner-id">Miner #${tokenId}</span>
                        <span class="miner-level">Level ${level}</span>
                    </div>
                    <div class="miner-stats">
                        <div class="stat">
                            <span class="label">Hashpower:</span>
                            <span class="value">${hashPower} TH/s</span>
                        </div>
                        <div class="stat">
                            <span class="label">Remaining:</span>
                            <span class="value">${remainingDays} days</span>
                        </div>
                        <div class="stat">
                            <span class="label">Status:</span>
                            <span class="value ${isExpired ? 'expired' : 'active'}">${isExpired ? '❌ Expired' : '✅ Active'}</span>
                        </div>
                    </div>
                </div>
            `;
        }
        
        minersList.innerHTML = html;
        console.log(`✅ 矿机列表UI更新完成: ${minerIds.length} 台矿机`);
    } catch (error) {
        console.error('❌ 更新矿机UI失败:', error);
    }
}

// 更新余额 - 已禁用（防止显示管理员余额给未登录用户）
async function updateBalances(address) {
    try {
        console.log('⚠️ updateBalances 已禁用 - 不更新余额显示（防止缓存问题）');
        console.log('💡 余额只在用户连接钱包后通过 getUserBalances() 更新');

        // 不再自动更新余额显示
        // 原因：防止未连接钱包的用户看到管理员的余额（6720000.0000 DRM）

        // const drmContract = new window.web3.eth.Contract(
        //     window.DREAMLE_TOKEN_ABI,
        //     window.CONTRACT_ADDRESSES.DREAMLE_TOKEN
        // );
        //
        // const drmBalance = await drmContract.methods.balanceOf(address).call();
        // const drmFormatted = window.web3.utils.fromWei(drmBalance.toString(), 'ether');
        //
        // // 更新DRM余额显示
        // const drmBalanceElement = document.getElementById('drmBalance');
        // if (drmBalanceElement) {
        //     const value = parseFloat(drmFormatted);
        //     drmBalanceElement.textContent = isNaN(value) ? '0.0000' : value.toFixed(4);
        //     console.log('✅ DRM余额已更新:', drmFormatted);
        // }

        console.log('✅ updateBalances 跳过（已禁用）');
    } catch (error) {
        console.error('❌ 更新余额失败:', error);
    }
}

// 更新网络统计
async function updateNetworkStats(contract) {
    try {
        console.log('📡 正在获取网络统计...');

        // 获取网络统计
        const networkStats = await contract.methods.getNetworkStats().call();
        console.log('✅ 网络统计:', networkStats);

        // 获取合约信息
        const contractInfo = await contract.methods.getContractInfo().call();
        console.log('✅ 合约信息:', contractInfo);

        // 更新网络算力
        const networkHashpower = document.getElementById('networkHashpower');
        if (networkHashpower) {
            const value = Number(networkStats[0]);
            networkHashpower.textContent = value.toLocaleString();
            console.log('✅ 网络算力已更新:', value);
        }

        // 更新活跃矿工
        const activeMiners = document.getElementById('activeMiners');
        if (activeMiners) {
            const value = Number(networkStats[1]);
            activeMiners.textContent = value.toString();
            console.log('✅ 活跃矿工已更新:', value);
        }

        // 更新总矿机 (使用正确的ID)
        const totalNetworkMiners = document.getElementById('totalNetworkMiners');
        if (totalNetworkMiners) {
            const value = Number(contractInfo[1]);
            totalNetworkMiners.textContent = value.toString();
            console.log('✅ 总矿机已更新:', value);
        }

        // 更新总奖励支付
        const totalRewardsPaid = document.getElementById('totalRewardsPaid');
        if (totalRewardsPaid) {
            const rewards = window.web3.utils.fromWei(networkStats[2].toString(), 'ether');
            const value = parseFloat(rewards);
            totalRewardsPaid.textContent = isNaN(value) ? '0.0000' : value.toFixed(4);
            console.log('✅ 总奖励支付已更新:', value);
        }

        // 计算日产出 (基于全网算力) - 使用正确的ID
        const dailyMiningOutput = document.getElementById('dailyMiningOutput');
        if (dailyMiningOutput) {
            const hashpower = Number(networkStats[0]);
            // 公式: hashpower * 86400秒 * 1e13 / 1e18
            const dailyDRM = (hashpower * 86400 * 1e13) / 1e18;
            dailyMiningOutput.textContent = isNaN(dailyDRM) ? '0.0' : dailyDRM.toFixed(1);
            console.log('✅ 日产出已更新:', dailyDRM);
        }

        // 更新奖励倍数 (Reward Multiplier)
        const rewardRate = document.getElementById('rewardRate');
        if (rewardRate) {
            // 显示为 1x (固定倍数)
            rewardRate.textContent = '1x';
            console.log('✅ 奖励倍数已更新: 1x');
        }

        console.log('✅ 网络统计更新完成');
    } catch (error) {
        console.error('❌ 更新网络统计失败:', error);
        console.error('错误堆栈:', error.stack);
    }
}

// 页面加载后自动执行
window.addEventListener('load', async () => {
    console.log('📄 页面已加载，等待2秒后加载管理员数据...');
    
    // 等待2秒让其他脚本初始化
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 加载管理员数据
    await loadAdminData();

    // 定期刷新已禁用 - 避免频繁请求RPC节点
    // 用户可以手动刷新页面来更新数据
    // setInterval(async () => {
    //     console.log('🔄 刷新管理员数据...');
    //     await loadAdminData();
    // }, 30000);

    console.log('✅ 自动加载管理员数据完成（定期刷新已禁用）');
});

// 导出函数供其他模块使用
window.loadAdminData = loadAdminData;

console.log('✅ 自动管理员数据模块加载完成');

