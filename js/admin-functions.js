/**
 * 管理员功能模块
 * 包含特殊推荐人管理、流动性管理、提取等功能
 * 
 * 日期: 2025-09-30
 */

(function() {
    'use strict';
    
    console.log('🔧 加载管理员功能模块...');

    // 管理员地址
    const ADMIN_ADDRESS = '0xfC3b7735Dae4C7AB3Ab85Ffa9987661e795B74b7';

    /**
     * 检查是否为管理员
     */
    window.isAdminUser = function() {
        if (!window.userAccount) return false;
        return window.userAccount.toLowerCase() === ADMIN_ADDRESS.toLowerCase();
    };

    /**
     * 创建使用钱包 provider 的合约实例
     * 确保可以发送交易（不使用 RPC provider）
     */
    function getWalletContract() {
        // 检查钱包是否连接
        if (!window.ethereum) {
            throw new Error('请先连接钱包（MetaMask、币安钱包等）');
        }

        if (!window.userAccount) {
            throw new Error('请先连接钱包账户');
        }

        if (!window.CONTRACT_ADDRESSES || !window.CONTRACT_ADDRESSES.UNIFIED_SYSTEM) {
            throw new Error('合约地址未加载');
        }

        if (!window.UNIFIED_SYSTEM_V19_ABI && !window.UNIFIED_SYSTEM_V16_ABI) {
            throw new Error('合约 ABI 未加载');
        }

        // 重要：使用 window.ethereum 创建新的 Web3 实例
        // 不使用 window.web3，因为它可能被替换成 RPC provider
        if (typeof window.Web3 === 'undefined') {
            throw new Error('Web3 库未加载');
        }

        const walletWeb3 = new window.Web3(window.ethereum);
        const contractABI = window.UNIFIED_SYSTEM_V19_ABI || window.UNIFIED_SYSTEM_V16_ABI;

        console.log('🔧 使用钱包 provider 创建合约实例');
        console.log('   Provider:', window.ethereum.isMetaMask ? 'MetaMask' :
                                    window.ethereum.isBinance ? 'Binance' :
                                    window.ethereum.isOkxWallet ? 'OKX' : 'Unknown');
        console.log('   合约地址:', window.CONTRACT_ADDRESSES.UNIFIED_SYSTEM);

        return new walletWeb3.eth.Contract(
            contractABI,
            window.CONTRACT_ADDRESSES.UNIFIED_SYSTEM
        );
    }

    /**
     * 执行管理员交易的通用函数
     */
    async function executeAdminTransaction(methodName, params, successMessage) {
        const contract = getWalletContract();

        console.log(`📝 准备执行: ${methodName}`, params);

        const method = contract.methods[methodName](...params);

        const gasEstimate = await method.estimateGas({
            from: window.userAccount
        });

        const gasLimit = Math.floor(gasEstimate * 1.2);
        console.log(`Gas估算: ${gasEstimate} -> 限制: ${gasLimit} (倍数: 1.2)`);

        console.log('📤 发送交易...');
        const result = await method.send({
            from: window.userAccount,
            gas: gasLimit
        });

        console.log(`✅ 交易成功:`, result);
        window.showMessage(successMessage, 'success');

        return result;
    }

    // ==================== 通用ERC20工具 ====================
    function toBN(v) { return window.web3.utils.toBN(v); }

    function isLess(a, b) { return toBN(a).lt(toBN(b)); }

    function getERC20(address) {
        if (!window.ERC20_ABI) throw new Error('ERC20_ABI 未加载');
        if (typeof window.Web3 === 'undefined' || !window.ethereum) {
            throw new Error('钱包未就绪，请先连接钱包');
        }
        // 关键：使用钱包的 provider，确保支持 eth_sendTransaction
        const walletWeb3 = new window.Web3(window.ethereum);
        return new walletWeb3.eth.Contract(window.ERC20_ABI, address);
    }

    async function ensureAllowanceAndBalance(tokenName, tokenAddress, owner, spender, amountWei) {
        const erc20 = getERC20(tokenAddress);

        // 余额检查
        const balance = await erc20.methods.balanceOf(owner).call();
        console.log(`🔍 ${tokenName} 余额:`, balance);
        if (isLess(balance, amountWei)) {
            const fmt = window.web3.utils.fromWei(balance, 'ether');
            const need = window.web3.utils.fromWei(amountWei, 'ether');
            throw new Error(`${tokenName}余额不足，需要 ${need}，当前余额 ${fmt}`);
        }

        // 授权检查
        const allowance = await erc20.methods.allowance(owner, spender).call();
        console.log(`🔍 ${tokenName} 授权额度:`, allowance);
        if (isLess(allowance, amountWei)) {
            const need = window.web3.utils.fromWei(amountWei, 'ether');
            const ok = confirm(`需要授权 ${tokenName} ${need} 给合约，是否现在授权？`);
            if (!ok) throw new Error(`已取消 ${tokenName} 授权`);

            // 执行授权（授权精确所需额度，避免无限授权风险）
            window.showMessage(`🔐 正在授权 ${tokenName}...`, 'info');
            const tx = await erc20.methods.approve(spender, amountWei).send({
                from: owner,
                gas: 100000
            });
            console.log(`✅ ${tokenName} 授权成功:`, tx.transactionHash);
        }
    }

    // ==================== 特殊推荐人管理 ====================

    /**
     * 添加特殊推荐人
     * @param {string} referrerAddress - 推荐人地址
     */
    window.addSpecialReferrer = async function(referrerAddress) {
        console.log(`➕ 准备添加特殊推荐人: ${referrerAddress}`);

        if (!window.isConnected || !window.userAccount) {
            window.showMessage('请先连接钱包', 'warning');
            return;
        }

        if (!window.isAdminUser()) {
            window.showMessage('❌ 只有管理员可以执行此操作', 'error');
            return;
        }

        try {
            // 验证地址格式
            if (!window.web3.utils.isAddress(referrerAddress)) {
                throw new Error('无效的地址格式');
            }

            const confirmed = confirm(
                `确认添加特殊推荐人？\n\n` +
                `地址: ${referrerAddress}\n\n` +
                `特殊推荐人将享有额外的奖励`
            );

            if (!confirmed) {
                window.showMessage('已取消操作', 'info');
                return;
            }

            // 优先使用API方法
            if (window.addSpecialReferrerViaAPI) {
                try {
                    console.log('🌐 使用API添加特殊推荐人');
                    await window.addSpecialReferrerViaAPI(referrerAddress);
                    
                    window.showMessage(`✅ 特殊推荐人添加成功！`, 'success');
                    return;
                } catch (error) {
                    console.error('❌ API添加失败，尝试使用原始方法:', error);
                }
            }

            // 原始方法（回退）
            window.showMessage('正在添加特殊推荐人...', 'info');

            await executeAdminTransaction(
                'addSpecialReferrer',
                [referrerAddress],
                '✅ 特殊推荐人添加成功！'
            );

        } catch (error) {
            console.error('❌ 添加失败:', error);
            window.showMessage(`❌ 添加失败: ${error.message}`, 'error');
        }
    };

    /**
     * 移除特殊推荐人
     * @param {string} referrerAddress - 推荐人地址
     */
    window.removeSpecialReferrer = async function(referrerAddress) {
        console.log(`➖ 准备移除特殊推荐人: ${referrerAddress}`);

        if (!window.isConnected || !window.userAccount) {
            window.showMessage('请先连接钱包', 'warning');
            return;
        }

        if (!window.isAdminUser()) {
            window.showMessage('❌ 只有管理员可以执行此操作', 'error');
            return;
        }

        try {
            // 验证地址格式
            if (!window.web3.utils.isAddress(referrerAddress)) {
                throw new Error('无效的地址格式');
            }

            const confirmed = confirm(
                `确认移除特殊推荐人？\n\n` +
                `地址: ${referrerAddress}\n\n` +
                `移除后该地址将失去特殊推荐人权限`
            );

            if (!confirmed) {
                window.showMessage('已取消操作', 'info');
                return;
            }

            // 优先使用API方法
            if (window.removeSpecialReferrerViaAPI) {
                try {
                    console.log('🌐 使用API移除特殊推荐人');
                    await window.removeSpecialReferrerViaAPI(referrerAddress);
                    
                    window.showMessage(`✅ 特殊推荐人移除成功！`, 'success');
                    return;
                } catch (error) {
                    console.error('❌ API移除失败，尝试使用原始方法:', error);
                }
            }

            // 原始方法（回退）
            window.showMessage('正在移除特殊推荐人...', 'info');

            await executeAdminTransaction(
                'removeSpecialReferrer',
                [referrerAddress],
                '✅ 特殊推荐人移除成功！'
            );

        } catch (error) {
            console.error('❌ 移除失败:', error);
            window.showMessage(`❌ 移除失败: ${error.message}`, 'error');
        }
    };

    // ==================== 流动性管理 ====================

    /**
     * 注入流动性
     * @param {string} usdtAmount - USDT数量（wei）
     * @param {string} drmAmount - DRM数量（wei）
     */
    window.adminInjectLiquidity = async function(usdtAmount, drmAmount) {
        console.log(`💧 准备注入流动性: USDT=${usdtAmount}, DRM=${drmAmount}`);

        if (!window.isConnected || !window.userAccount) {
            window.showMessage('请先连接钱包', 'warning');
            return;
        }

        if (!window.isAdminUser()) {
            window.showMessage('❌ 只有管理员可以执行此操作', 'error');
            return;
        }

        try {
            const usdtInEther = window.web3.utils.fromWei(usdtAmount, 'ether');
            const drmInEther = window.web3.utils.fromWei(drmAmount, 'ether');

            const confirmed = confirm(
                `确认注入流动性？\n\n` +
                `USDT: ${usdtInEther}\n` +
                `DRM: ${drmInEther}\n\n` +
                `⚠️ 请确保您有足够的代币余额并已授权`
            );

            if (!confirmed) {
                window.showMessage('已取消操作', 'info');
                return;
            }

            // 优先使用API方法
            if (window.adminInjectLiquidityViaAPI) {
                try {
                    console.log('🌐 使用API注入流动性');
                    await window.adminInjectLiquidityViaAPI(usdtAmount, drmAmount);
                    
                    window.showMessage(`✅ 流动性注入成功！`, 'success');
                    return;
                } catch (error) {
                    console.error('❌ API注入失败，尝试使用原始方法:', error);
                }
            }

            // 1) 注入前校验余额与授权
            const spender = window.CONTRACT_ADDRESSES.UNIFIED_SYSTEM;
            const user = window.userAccount;

            try {
                await ensureAllowanceAndBalance('USDT', window.CONTRACT_ADDRESSES.USDT_TOKEN, user, spender, usdtAmount);
                await ensureAllowanceAndBalance('DRM', (window.CONTRACT_ADDRESSES.DREAMLE_TOKEN || window.CONTRACT_ADDRESSES.DRM_TOKEN), user, spender, drmAmount);
            } catch (checkError) {
                console.error('❌ 余额/授权检查未通过:', checkError);
                window.showMessage(checkError.message || '余额/授权检查失败', 'error');
                return;
            }

            // 2) 原始方法（回退）
            window.showMessage('正在注入流动性...', 'info');

            await executeAdminTransaction(
                'adminInjectLiquidity',
                [usdtAmount, drmAmount],
                '✅ 流动性注入成功！'
            );

        } catch (error) {
            console.error('❌ 注入失败:', error);
            window.showMessage(`❌ 注入失败: ${error.message}`, 'error');
        }
    };

    /**
     * 管理员提取
     * @param {string} tokenAddress - 代币地址
     * @param {string} amount - 提取数量（wei）
     */
    window.adminWithdraw = async function(tokenAddress, amount) {
        console.log(`💸 准备提取代币: token=${tokenAddress}, amount=${amount}`);

        if (!window.isConnected || !window.userAccount) {
            window.showMessage('请先连接钱包', 'warning');
            return;
        }

        if (!window.isAdminUser()) {
            window.showMessage('❌ 只有管理员可以执行此操作', 'error');
            return;
        }

        try {
            // 验证地址格式
            if (!window.web3.utils.isAddress(tokenAddress)) {
                throw new Error('无效的代币地址格式');
            }

            const amountInEther = window.web3.utils.fromWei(amount, 'ether');

            const confirmed = confirm(
                `确认提取代币？\n\n` +
                `代币地址: ${tokenAddress}\n` +
                `数量: ${amountInEther}\n\n` +
                `⚠️ 此操作不可撤销`
            );

            if (!confirmed) {
                window.showMessage('已取消操作', 'info');
                return;
            }

            // 1) 预检查：合约余额是否足够
            try {
                const erc20 = getERC20(tokenAddress);
                const contractAddr = window.CONTRACT_ADDRESSES.UNIFIED_SYSTEM;
                const contractTokenBalance = await erc20.methods.balanceOf(contractAddr).call();

                if (window.web3.utils.toBN(contractTokenBalance).lt(window.web3.utils.toBN(amount))) {
                    const balFmt = window.web3.utils.fromWei(contractTokenBalance, 'ether');
                    const amtFmt = window.web3.utils.fromWei(amount, 'ether');
                    window.showMessage(`合约该代币余额不足：请求 ${amtFmt}，可提 ${balFmt}`, 'error');
                    return;
                }
            } catch (precheckErr) {
                console.warn('⚠️ 提取前余额检查失败（继续走API/原始方法）:', precheckErr);
            }

            // 2) 优先使用API方法
            if (window.adminWithdrawViaAPI) {
                try {
                    console.log('🌐 使用API提取代币');
                    await window.adminWithdrawViaAPI(tokenAddress, amount);

                    window.showMessage(`✅ 代币提取成功！`, 'success');
                    return;
                } catch (error) {
                    console.error('❌ API提取失败，尝试使用原始方法:', error);
                }
            }

            // 3) 原始方法（回退）
            window.showMessage('正在提取代币...', 'info');

            await executeAdminTransaction(
                'adminWithdraw',
                [tokenAddress, amount],
                '✅ 代币提取成功！'
            );

        } catch (error) {
            console.error('❌ 提取失败:', error);
            let userMsg = error && error.message ? error.message : '提取失败';
            if (userMsg.includes('execution reverted') || userMsg.includes('0x')) {
                userMsg = '提取被拒绝：可能是合约余额不足或不满足提取规则（请检查选择的代币与数量）';
            }
            window.showMessage(`❌ 提取失败: ${userMsg}`, 'error');
        }
    };

    // ==================== 系统管理 ====================

    /**
     * 紧急暂停
     */
    window.emergencyPause = async function() {
        console.log(`🔴 准备紧急暂停合约`);

        if (!window.isConnected || !window.userAccount) {
            window.showMessage('请先连接钱包', 'warning');
            return;
        }

        if (!window.isAdminUser()) {
            window.showMessage('❌ 只有管理员可以执行此操作', 'error');
            return;
        }

        try {
            const confirmed = confirm(
                `⚠️ 确认紧急暂停合约？\n\n` +
                `此操作将暂停所有合约功能\n` +
                `包括购买、转让、领取等\n\n` +
                `请谨慎操作！`
            );

            if (!confirmed) {
                window.showMessage('已取消操作', 'info');
                return;
            }

            // 二次确认
            const doubleConfirm = confirm('再次确认：您确定要紧急暂停合约吗？');
            if (!doubleConfirm) {
                window.showMessage('已取消操作', 'info');
                return;
            }

            // 优先使用API方法
            if (window.emergencyPauseViaAPI) {
                try {
                    console.log('🌐 使用API紧急暂停');
                    await window.emergencyPauseViaAPI();
                    
                    window.showMessage(`✅ 合约已紧急暂停！`, 'success');
                    return;
                } catch (error) {
                    console.error('❌ API暂停失败，尝试使用原始方法:', error);
                }
            }

            // 原始方法（回退）
            window.showMessage('正在紧急暂停合约...', 'info');

            await executeAdminTransaction(
                'emergencyPause',
                [],
                '✅ 合约已紧急暂停！'
            );

        } catch (error) {
            console.error('❌ 暂停失败:', error);
            window.showMessage(`❌ 暂停失败: ${error.message}`, 'error');
        }
    };

    /**
     * 更新过期矿机
     * @param {string} userAddress - 用户地址
     */
    window.updateExpiredMiners = async function(userAddress) {
        console.log(`🔄 准备更新过期矿机: ${userAddress}`);

        if (!window.isConnected || !window.userAccount) {
            window.showMessage('请先连接钱包', 'warning');
            return;
        }

        try {
            // 验证地址格式
            if (!window.web3.utils.isAddress(userAddress)) {
                throw new Error('无效的地址格式');
            }

            // 优先使用API方法
            if (window.updateExpiredMinersViaAPI) {
                try {
                    console.log('🌐 使用API更新过期矿机');
                    await window.updateExpiredMinersViaAPI(userAddress);
                    
                    window.showMessage(`✅ 过期矿机更新成功！`, 'success');
                    return;
                } catch (error) {
                    console.error('❌ API更新失败，尝试使用原始方法:', error);
                }
            }

            // 原始方法（回退）
            window.showMessage('正在更新过期矿机...', 'info');

            await executeAdminTransaction(
                'updateExpiredMiners',
                [userAddress],
                '✅ 过期矿机更新成功！'
            );

        } catch (error) {
            console.error('❌ 更新失败:', error);
            window.showMessage(`❌ 更新失败: ${error.message}`, 'error');
        }
    };

    // ==================== NFT Metadata 管理 ====================

    /**
     * 设置 NFT Metadata Base URI
     * @param {string} newBaseURI - 新的 base URI（例如: "https://www.dreamlewebai.com/api/metadata/"）
     */
    window.setNFTBaseURI = async function(newBaseURI) {
        console.log('🎨 设置 NFT Base URI...');
        console.log(`   新 Base URI: ${newBaseURI}`);

        if (!window.isConnected || !window.userAccount) {
            window.showMessage('请先连接钱包', 'warning');
            return;
        }

        // 检查当前连接的地址
        console.log(`   当前连接地址: ${window.userAccount}`);
        console.log(`   管理员地址: ${ADMIN_ADDRESS}`);
        console.log(`   地址匹配: ${window.userAccount.toLowerCase() === ADMIN_ADDRESS.toLowerCase()}`);

        // 注释掉管理员检查，允许任何连接的地址尝试（合约会自动检查权限）
        // if (!window.isAdminUser()) {
        //     window.showMessage('❌ 只有管理员可以执行此操作', 'error');
        //     return;
        // }

        if (!newBaseURI || typeof newBaseURI !== 'string') {
            throw new Error('请提供有效的 Base URI');
        }

        // 确保 URI 以 / 结尾
        if (!newBaseURI.endsWith('/')) {
            newBaseURI += '/';
            console.log(`   自动添加结尾斜杠: ${newBaseURI}`);
        }

        try {
            const confirmed = confirm(
                `确认设置 NFT Base URI？\n\n` +
                `新 URI: ${newBaseURI}\n\n` +
                `这将影响所有 NFT 的 metadata 显示`
            );

            if (!confirmed) {
                window.showMessage('已取消操作', 'info');
                return;
            }

            window.showMessage('正在设置 Base URI...', 'info');

            await executeAdminTransaction(
                'setBaseURI',
                [newBaseURI],
                `✅ Base URI 设置成功！`
            );

        } catch (error) {
            console.error('❌ 设置失败:', error);
            window.showMessage(`❌ 设置失败: ${error.message}`, 'error');
        }
    };

    /**
     * 获取当前 NFT Metadata Base URI
     */
    window.getNFTBaseURI = async function() {
        console.log('🔍 获取当前 NFT Base URI...');

        if (!window.unifiedContract) {
            throw new Error('合约未初始化');
        }

        try {
            // 尝试获取 tokenURI(1) 来推断 baseURI
            const tokenURI = await window.unifiedContract.methods.tokenURI(1).call();
            console.log(`✅ Token #1 URI: ${tokenURI}`);

            // 提取 baseURI（去掉最后的 "1.json"）
            const baseURI = tokenURI.replace(/\d+\.json$/, '');
            console.log(`✅ 推断的 Base URI: ${baseURI}`);

            return baseURI;
        } catch (error) {
            console.error('❌ 获取 Base URI 失败:', error);
            throw error;
        }
    };

    /**
     * 测试 NFT Metadata
     * @param {number} tokenId - Token ID
     */
    window.testNFTMetadata = async function(tokenId = 1) {
        console.log(`🧪 测试 NFT Metadata (Token #${tokenId})...`);

        if (!window.unifiedContract) {
            throw new Error('合约未初始化');
        }

        try {
            // 1. 获取 tokenURI
            const tokenURI = await window.unifiedContract.methods.tokenURI(tokenId).call();
            console.log(`✅ Token URI: ${tokenURI}`);

            // 2. 尝试获取 metadata JSON
            console.log(`🌐 正在获取 metadata JSON...`);
            const response = await fetch(tokenURI);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const metadata = await response.json();
            console.log(`✅ Metadata JSON:`, metadata);

            // 3. 验证必需字段
            const requiredFields = ['name', 'description', 'image', 'attributes'];
            const missingFields = requiredFields.filter(field => !metadata[field]);

            if (missingFields.length > 0) {
                console.warn(`⚠️ 缺少字段: ${missingFields.join(', ')}`);
            } else {
                console.log(`✅ 所有必需字段都存在`);
            }

            // 4. 测试图片 URL
            console.log(`🖼️ 图片 URL: ${metadata.image}`);

            return {
                tokenURI,
                metadata,
                valid: missingFields.length === 0
            };
        } catch (error) {
            console.error('❌ 测试失败:', error);
            throw error;
        }
    };

    console.log('✅ 管理员功能模块加载完成');
    console.log('   - addSpecialReferrer() - 添加特殊推荐人');
    console.log('   - removeSpecialReferrer() - 移除特殊推荐人');
    console.log('   - adminInjectLiquidity() - 注入流动性');
    console.log('   - adminWithdraw() - 管理员提取');
    console.log('   - emergencyPause() - 紧急暂停');
    console.log('   - updateExpiredMiners() - 更新过期矿机');
    console.log('   - setNFTBaseURI() - 设置 NFT Base URI');
    console.log('   - getNFTBaseURI() - 获取 NFT Base URI');
    console.log('   - testNFTMetadata() - 测试 NFT Metadata');

})();

