/**
 * 额外功能模块
 * 包含续费、管理员功能等
 * 
 * 日期: 2025-09-30
 */

(function() {
    'use strict';
    
    console.log('🔧 加载额外功能模块...');

    // ==================== 续费矿机功能 ====================

    /**
     * 续费单个矿机
     * @param {number} tokenId - 矿机ID
     */
    window.renewMiner = async function(tokenId) {
        console.log(`🔄 准备续费矿机 #${tokenId}`);

        if (!window.isConnected || !window.userAccount) {
            window.showMessage('请先连接钱包', 'warning');
            return;
        }

        try {
            // 1. 获取续费价格
            window.showMessage('正在查询续费价格...', 'info');
            
            const renewalPrice = await window.unifiedContract.methods.getRenewalPrice(tokenId).call();
            const priceInUSDT = (Number(renewalPrice) / 1e18).toFixed(2);
            
            console.log(`💰 续费价格: ${priceInUSDT} USDT`);

            // 2. 确认续费
            const confirmed = confirm(
                `确认续费矿机 #${tokenId}？\n\n` +
                `续费价格: ${priceInUSDT} USDT\n` +
                `续费后将延长30天使用期限\n\n` +
                `⚠️ 请确保您有足够的USDT余额并已授权`
            );

            if (!confirmed) {
                window.showMessage('已取消续费', 'info');
                return;
            }

            // 3. 优先使用API方法
            if (window.renewMinerViaAPI) {
                try {
                    console.log('🌐 使用API续费矿机');
                    await window.renewMinerViaAPI(tokenId);
                    
                    window.showMessage(`✅ 矿机 #${tokenId} 续费成功！`, 'success');
                    
                    // 刷新矿机列表
                    setTimeout(() => {
                        if (window.loadUserData) {
                            window.loadUserData();
                        }
                    }, 3000);
                    
                    return;
                } catch (error) {
                    console.error('❌ API续费失败，尝试使用原始方法:', error);
                    // 继续执行原始方法
                }
            }

            // 4. 原始方法（回退）
            if (!window.unifiedContract) {
                throw new Error('合约未初始化');
            }

            window.showMessage(`正在续费矿机 #${tokenId}...`, 'info');

            const gasEstimate = await window.unifiedContract.methods.renewMiner(tokenId).estimateGas({
                from: window.userAccount
            });

            const gasLimit = window.safeGasLimit ? window.safeGasLimit(gasEstimate, 1.2) : Math.floor(gasEstimate * 1.2);

            const result = await window.unifiedContract.methods.renewMiner(tokenId).send({
                from: window.userAccount,
                gas: gasLimit
            });

            console.log(`✅ 矿机 #${tokenId} 续费成功:`, result);
            window.showMessage(`✅ 矿机 #${tokenId} 续费成功！`, 'success');

            // 刷新矿机列表
            setTimeout(() => {
                if (window.loadUserData) {
                    window.loadUserData();
                }
            }, 3000);

        } catch (error) {
            console.error('❌ 续费失败:', error);
            
            let errorMsg = '续费失败';
            if (error.message) {
                if (error.message.includes('insufficient funds')) {
                    errorMsg = 'USDT余额不足';
                } else if (error.message.includes('not approved')) {
                    errorMsg = '请先授权USDT';
                } else if (error.message.includes('user rejected')) {
                    errorMsg = '您取消了交易';
                } else {
                    errorMsg = error.message;
                }
            }
            
            window.showMessage(`❌ ${errorMsg}`, 'error');
        }
    };

    /**
     * 批量续费矿机
     * @param {number[]} tokenIds - 矿机ID数组
     */
    window.renewMultipleMiners = async function(tokenIds) {
        console.log(`🔄 准备批量续费 ${tokenIds.length} 个矿机`);

        if (!window.isConnected || !window.userAccount) {
            window.showMessage('请先连接钱包', 'warning');
            return;
        }

        if (!tokenIds || tokenIds.length === 0) {
            window.showMessage('请选择要续费的矿机', 'warning');
            return;
        }

        try {
            // 1. 获取批量续费价格
            window.showMessage('正在查询批量续费价格...', 'info');
            
            const batchPrice = await window.unifiedContract.methods.getBatchRenewalPrice(tokenIds).call();
            const priceInUSDT = (Number(batchPrice) / 1e18).toFixed(2);
            
            console.log(`💰 批量续费价格: ${priceInUSDT} USDT`);

            // 2. 确认续费
            const confirmed = confirm(
                `确认批量续费 ${tokenIds.length} 个矿机？\n\n` +
                `矿机ID: ${tokenIds.join(', ')}\n` +
                `总价格: ${priceInUSDT} USDT\n` +
                `续费后每个矿机将延长30天使用期限\n\n` +
                `⚠️ 请确保您有足够的USDT余额并已授权`
            );

            if (!confirmed) {
                window.showMessage('已取消批量续费', 'info');
                return;
            }

            // 3. 优先使用API方法
            if (window.renewMultipleMinersViaAPI) {
                try {
                    console.log('🌐 使用API批量续费矿机');
                    await window.renewMultipleMinersViaAPI(tokenIds);
                    
                    window.showMessage(`✅ ${tokenIds.length} 个矿机批量续费成功！`, 'success');
                    
                    // 刷新矿机列表
                    setTimeout(() => {
                        if (window.loadUserData) {
                            window.loadUserData();
                        }
                    }, 3000);
                    
                    return;
                } catch (error) {
                    console.error('❌ API批量续费失败，尝试使用原始方法:', error);
                    // 继续执行原始方法
                }
            }

            // 4. 原始方法（回退）
            if (!window.unifiedContract) {
                throw new Error('合约未初始化');
            }

            window.showMessage(`正在批量续费 ${tokenIds.length} 个矿机...`, 'info');

            const gasEstimate = await window.unifiedContract.methods.renewMultipleMiners(tokenIds).estimateGas({
                from: window.userAccount
            });

            const gasLimit = window.safeGasLimit ? window.safeGasLimit(gasEstimate, 1.2) : Math.floor(gasEstimate * 1.2);

            const result = await window.unifiedContract.methods.renewMultipleMiners(tokenIds).send({
                from: window.userAccount,
                gas: gasLimit
            });

            console.log(`✅ ${tokenIds.length} 个矿机批量续费成功:`, result);
            window.showMessage(`✅ ${tokenIds.length} 个矿机批量续费成功！`, 'success');

            // 刷新矿机列表
            setTimeout(() => {
                if (window.loadUserData) {
                    window.loadUserData();
                }
            }, 3000);

        } catch (error) {
            console.error('❌ 批量续费失败:', error);
            
            let errorMsg = '批量续费失败';
            if (error.message) {
                if (error.message.includes('insufficient funds')) {
                    errorMsg = 'USDT余额不足';
                } else if (error.message.includes('not approved')) {
                    errorMsg = '请先授权USDT';
                } else if (error.message.includes('user rejected')) {
                    errorMsg = '您取消了交易';
                } else {
                    errorMsg = error.message;
                }
            }
            
            window.showMessage(`❌ ${errorMsg}`, 'error');
        }
    };

    /**
     * 显示批量续费对话框
     */
    window.showBatchRenewDialog = function() {
        if (!window.isConnected || !window.userAccount) {
            window.showMessage('请先连接钱包', 'warning');
            return;
        }

        // 获取用户的所有矿机
        if (!window.userMinersData || window.userMinersData.length === 0) {
            window.showMessage('您还没有矿机', 'info');
            return;
        }

        // 创建对话框HTML
        const dialogHTML = `
            <div id="batchRenewDialog" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; align-items: center; justify-content: center;">
                <div style="background: white; border-radius: 15px; padding: 30px; max-width: 600px; max-height: 80vh; overflow-y: auto;">
                    <h3 style="margin-top: 0; color: #333;">🔄 批量续费矿机</h3>
                    <p style="color: #666;">选择要续费的矿机：</p>
                    <div id="minerCheckboxList" style="margin: 20px 0;">
                        ${window.userMinersData.map(miner => `
                            <label style="display: block; padding: 10px; margin: 5px 0; background: #f5f5f5; border-radius: 8px; cursor: pointer;">
                                <input type="checkbox" value="${miner.tokenId}" style="margin-right: 10px;">
                                矿机 #${miner.tokenId} - Level ${miner.level} - ${miner.isActive ? '✅ 活跃' : '❌ 已过期'}
                            </label>
                        `).join('')}
                    </div>
                    <div style="display: flex; gap: 10px; margin-top: 20px;">
                        <button onclick="window.executeBatchRenew()" style="flex: 1; padding: 12px; background: #4CAF50; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">
                            ✅ 确认续费
                        </button>
                        <button onclick="window.closeBatchRenewDialog()" style="flex: 1; padding: 12px; background: #f44336; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">
                            ❌ 取消
                        </button>
                    </div>
                </div>
            </div>
        `;

        // 添加到页面
        document.body.insertAdjacentHTML('beforeend', dialogHTML);
    };

    /**
     * 执行批量续费
     */
    window.executeBatchRenew = function() {
        const checkboxes = document.querySelectorAll('#minerCheckboxList input[type="checkbox"]:checked');
        const tokenIds = Array.from(checkboxes).map(cb => parseInt(cb.value));
        
        window.closeBatchRenewDialog();
        
        if (tokenIds.length === 0) {
            window.showMessage('请至少选择一个矿机', 'warning');
            return;
        }
        
        window.renewMultipleMiners(tokenIds);
    };

    /**
     * 关闭批量续费对话框
     */
    window.closeBatchRenewDialog = function() {
        const dialog = document.getElementById('batchRenewDialog');
        if (dialog) {
            dialog.remove();
        }
    };

    console.log('✅ 额外功能模块加载完成');
    console.log('   - renewMiner() - 续费单个矿机');
    console.log('   - renewMultipleMiners() - 批量续费矿机');
    console.log('   - showBatchRenewDialog() - 显示批量续费对话框');

})();

