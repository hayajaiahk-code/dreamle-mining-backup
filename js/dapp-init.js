/**
 * DApp浏览器专用初始化脚本
 * 针对币安、欧意、TP、IM等移动端DApp优化
 * 专为中国用户访问美国服务器优化
 */

(function() {
    'use strict';

    console.log('🚀 DApp初始化开始...');
    console.log('🌍 优化版本：中国DApp用户专用');

    // 检测DApp环境（改进版 - 优先检查专有对象）
    const DAPP_ENV = {
        // 优先检查专有对象（最可靠的方式）
        isOKX: !!(window.okxwallet || window.okex),
        isBinance: !!(window.BinanceChain),
        isTP: !!(window.ethereum && window.ethereum.isTokenPocket),
        isIM: !!(window.ethereum && window.ethereum.isImToken),
        isTrust: !!(window.ethereum && window.ethereum.isTrust),
        isMobile: /Android|iPhone|iPad/i.test(navigator.userAgent)
    };

    // 获取当前DApp类型（改进版 - 三层检测）
    function getCurrentDApp() {
        console.log('🔍 开始检测钱包类型...');

        // 第一层：检查专有对象（最可靠）
        console.log('📱 第一层检测：专有对象');
        console.log('  - window.okxwallet:', !!window.okxwallet);
        console.log('  - window.okex:', !!window.okex);
        console.log('  - window.BinanceChain:', !!window.BinanceChain);

        if (window.okxwallet || window.okex) {
            console.log('✅ 检测到：欧意钱包（通过专有对象）');
            return 'OKX';
        }
        if (window.BinanceChain) {
            console.log('✅ 检测到：币安钱包（通过专有对象）');
            return 'Binance';
        }

        // 第二层：检查 User Agent
        console.log('📱 第二层检测：User Agent');
        const ua = navigator.userAgent.toLowerCase();
        console.log('  - User Agent:', ua);

        if (ua.includes('okx') || ua.includes('okex')) {
            console.log('✅ 检测到：欧意钱包（通过UA）');
            return 'OKX';
        }
        if (ua.includes('binance')) {
            console.log('✅ 检测到：币安钱包（通过UA）');
            return 'Binance';
        }
        if (ua.includes('tokenpocket')) {
            console.log('✅ 检测到：TokenPocket（通过UA）');
            return 'TokenPocket';
        }
        if (ua.includes('imtoken')) {
            console.log('✅ 检测到：imToken（通过UA）');
            return 'imToken';
        }
        if (ua.includes('trust')) {
            console.log('✅ 检测到：Trust钱包（通过UA）');
            return 'Trust';
        }

        // 第三层：检查 ethereum 对象的属性（最不可靠，放在最后）
        console.log('📱 第三层检测：ethereum对象属性');
        if (window.ethereum) {
            console.log('  - isTokenPocket:', !!window.ethereum.isTokenPocket);
            console.log('  - isImToken:', !!window.ethereum.isImToken);
            console.log('  - isTrust:', !!window.ethereum.isTrust);
            console.log('  - isMetaMask:', !!window.ethereum.isMetaMask);
            console.log('  - isOkxWallet:', !!window.ethereum.isOkxWallet);

            if (window.ethereum.isTokenPocket) {
                console.log('✅ 检测到：TokenPocket（通过ethereum属性）');
                return 'TokenPocket';
            }
            if (window.ethereum.isImToken) {
                console.log('✅ 检测到：imToken（通过ethereum属性）');
                return 'imToken';
            }
            if (window.ethereum.isTrust) {
                console.log('✅ 检测到：Trust钱包（通过ethereum属性）');
                return 'Trust';
            }
            // MetaMask 放在最后检查（因为很多钱包都会设置 isMetaMask=true）
            if (window.ethereum.isMetaMask) {
                console.log('⚠️  检测到：MetaMask标记（可能是兼容模式）');
                return 'MetaMask';
            }

            console.log('✅ 检测到：通用Web3钱包');
            return 'Web3';
        }

        console.log('❌ 未检测到任何钱包');
        return 'Unknown';
    }

    const currentDApp = getCurrentDApp();
    console.log('📱 检测到DApp:', currentDApp);
    console.log('📱 User Agent:', navigator.userAgent);

    // 设置正确的Provider（改进版 - 强制标记）
    function setupProvider() {
        let provider = null;

        console.log('🔧 开始设置Provider...');
        console.log('📱 当前检测到的钱包:', currentDApp);

        // 根据DApp类型选择正确的Provider
        if (currentDApp === 'OKX') {
            // 欧意钱包：优先级 okxwallet > okex.ethereum > ethereum
            provider = window.okxwallet || window.okex?.ethereum || window.ethereum;
            console.log('✅ 使用欧意钱包Provider');
            console.log('  - 来源:', window.okxwallet ? 'window.okxwallet' :
                                    window.okex?.ethereum ? 'window.okex.ethereum' :
                                    'window.ethereum');

            // 强制标记（关键！防止误识别）
            if (provider) {
                console.log('🔧 强制设置欧意钱包标记...');
                provider.isOkxWallet = true;
                provider.isMetaMask = false;  // 强制覆盖（很多钱包会设置这个）
                provider.isBinanceChain = false;
                provider.isTokenPocket = false;
                provider.isImToken = false;
                provider.isTrust = false;
                console.log('✅ 已设置: isOkxWallet=true, isMetaMask=false');
            }

        } else if (currentDApp === 'Binance') {
            // 币安钱包
            provider = window.BinanceChain || window.ethereum;
            console.log('✅ 使用币安钱包Provider');
            console.log('  - 来源:', window.BinanceChain ? 'window.BinanceChain' : 'window.ethereum');

            if (provider) {
                console.log('🔧 强制设置币安钱包标记...');
                provider.isBinanceChain = true;
                provider.isMetaMask = false;
                provider.isOkxWallet = false;
                console.log('✅ 已设置: isBinanceChain=true, isMetaMask=false');
            }

        } else if (currentDApp === 'TokenPocket') {
            provider = window.ethereum;
            console.log('✅ 使用TokenPocket Provider');

            if (provider) {
                console.log('🔧 强制设置TokenPocket标记...');
                provider.isTokenPocket = true;
                provider.isMetaMask = false;
                console.log('✅ 已设置: isTokenPocket=true');
            }

        } else if (currentDApp === 'imToken') {
            provider = window.ethereum;
            console.log('✅ 使用imToken Provider');

            if (provider) {
                console.log('🔧 强制设置imToken标记...');
                provider.isImToken = true;
                provider.isMetaMask = false;
                console.log('✅ 已设置: isImToken=true');
            }

        } else if (window.ethereum) {
            provider = window.ethereum;
            console.log('✅ 使用通用Provider');
        }

        if (!provider) {
            console.error('❌ 未找到钱包Provider');
            console.error('❌ 请在DApp浏览器中打开此页面');
            return false;
        }

        // 统一设置为window.ethereum
        window.ethereum = provider;
        console.log('✅ Provider已设置到window.ethereum');

        // 打印最终的Provider标记（用于调试）
        console.log('📋 最终Provider标记:');
        console.log('  - isOkxWallet:', !!provider.isOkxWallet);
        console.log('  - isBinanceChain:', !!provider.isBinanceChain);
        console.log('  - isTokenPocket:', !!provider.isTokenPocket);
        console.log('  - isImToken:', !!provider.isImToken);
        console.log('  - isTrust:', !!provider.isTrust);
        console.log('  - isMetaMask:', !!provider.isMetaMask);

        return true;
    }

	    // 延迟辅助函数
	    function delay(ms) { return new Promise(res => setTimeout(res, ms)); }

	    // Provider 就绪标志，避免重复初始化
	    let providerReady = false;

	    // 监听钱包注入事件（部分钱包会派发）
	    window.addEventListener('ethereum#initialized', () => {
	        if (!providerReady) {
	            console.log('🔔 捕获到 ethereum#initialized 事件，尝试初始化...');
	            if (setupProvider()) {
	                providerReady = true;
	                showWelcomeMessage();
	            }
	        }
	    }, { once: true });

	    // 尝试监听币安钱包可能的事件（兼容性处理）
	    window.addEventListener('BinanceChain#initialized', () => {
	        if (!providerReady) {
	            console.log('🔔 捕获到 BinanceChain#initialized 事件，尝试初始化...');
	            if (setupProvider()) {
	                providerReady = true;
	                showWelcomeMessage();
	            }
	        }
	    }, { once: true });

	    // 轮询等待钱包延迟注入（移动端常见）
	    function watchForLateInjection(timeoutMs = 15000, intervalMs = 200) {
	        const start = Date.now();
	        const ua = navigator.userAgent.toLowerCase();
	        const expectBinance = (typeof currentDApp === 'string' && currentDApp === 'Binance') || ua.includes('binance');
	        const timer = setInterval(() => {
	            if (providerReady) { clearInterval(timer); return; }
	            const hasOKX = !!(window.okxwallet || (window.okex && window.okex.ethereum));
	            const hasBinance = !!window.BinanceChain;
	            const hasEth = !!window.ethereum;
	            if ((expectBinance && hasBinance) || hasOKX || hasEth) {
	                console.log('✅ 检测到钱包对象延迟注入，执行二次初始化...');
	                if (setupProvider()) {
	                    providerReady = true;
	                    showWelcomeMessage();
	                    clearInterval(timer);
	                }
	            }
	            if (Date.now() - start >= timeoutMs) {
	                clearInterval(timer);
	                console.warn('⏳ 等待钱包注入超时（15s）');
	            }
	        }, intervalMs);
	    }


    // 移动端专用Gas配置（针对中国网络优化）
    const MOBILE_GAS_CONFIG = {
        'OKX': {
            gas: 350000,
            gasPrice: '5000000000', // 5 Gwei
            timeout: 180000, // 3分钟（考虑网络延迟）
            confirmations: 1
        },
        'Binance': {
            gas: 350000,
            gasPrice: '5000000000',
            timeout: 180000,
            confirmations: 1
        },
        'TokenPocket': {
            gas: 400000,
            gasPrice: '7000000000', // 7 Gwei
            timeout: 180000,
            confirmations: 1
        },
        'imToken': {
            gas: 400000,
            gasPrice: '7000000000',
            timeout: 180000,
            confirmations: 1
        },
        'Trust': {
            gas: 380000,
            gasPrice: '6000000000',
            timeout: 180000,
            confirmations: 1
        },
        'MetaMask': {
            gas: 300000,
            gasPrice: '5000000000',
            timeout: 120000,
            confirmations: 1
        },
        'Web3': {
            gas: 350000,
            gasPrice: '6000000000',
            timeout: 180000,
            confirmations: 1
        },
        'Unknown': {
            gas: 400000,
            gasPrice: '7000000000',
            timeout: 180000,
            confirmations: 1
        }
    };

    // 获取Gas配置
    function getGasConfig() {
        const config = MOBILE_GAS_CONFIG[currentDApp] || MOBILE_GAS_CONFIG['Unknown'];
        console.log('⛽ Gas配置:', config);
        return config;
    }

    // 智能交易发送（DApp专用）
    async function smartSendTransaction(contract, method, params, txParams) {
        const gasConfig = getGasConfig();

        console.log(`🚀 ${currentDApp} 发送交易:`, method);
        console.log('📝 交易参数:', params);

        try {
            const contractMethod = contract.methods[method](...params);

            // 构建最终交易参数
            const finalParams = {
                from: txParams.from,
                gas: gasConfig.gas,
                gasPrice: gasConfig.gasPrice,
                value: txParams.value || '0'
            };

            console.log('📤 最终交易参数:', finalParams);
            console.log('⏱️  超时设置:', gasConfig.timeout, 'ms');

            // 使用合约send方法（所有DApp都支持）
            const result = await contractMethod.send(finalParams);

            console.log('✅ 交易成功!');
            console.log('📋 交易哈希:', result.transactionHash);
            console.log('📦 区块号:', result.blockNumber);

            return result;

        } catch (error) {
            console.error('❌ 交易失败:', error);
            console.error('❌ 错误详情:', error.message);

            // 友好的中文错误提示
            let errorMsg = error.message || error.toString();

            if (errorMsg.includes('user rejected') ||
                errorMsg.includes('User denied') ||
                errorMsg.includes('用户拒绝')) {
                errorMsg = '❌ 您取消了交易';

            } else if (errorMsg.includes('insufficient funds') ||
                       errorMsg.includes('余额不足')) {
                errorMsg = '❌ BNB余额不足，无法支付Gas费用\n\n' +
                          '请确保钱包中有足够的BNB（建议至少0.01 BNB）';

            } else if (errorMsg.includes('insufficient allowance') ||
                       errorMsg.includes('授权不足')) {
                errorMsg = '❌ USDT授权额度不足\n\n' +
                          '请先点击"授权USDT"按钮进行授权';

            } else if (errorMsg.includes('execution reverted') ||
                       errorMsg.includes('交易被拒绝')) {
                errorMsg = '❌ 交易被智能合约拒绝\n\n' +
                          '可能原因：\n' +
                          '1. 矿工已售罄\n' +
                          '2. USDT余额不足\n' +
                          '3. 未授权USDT\n' +
                          '4. 网络拥堵，请稍后重试';

            } else if (errorMsg.includes('timeout') ||
                       errorMsg.includes('超时')) {
                errorMsg = '❌ 交易超时\n\n' +
                          '网络连接较慢，请：\n' +
                          '1. 检查网络连接\n' +
                          '2. 稍后重试\n' +
                          '3. 如果交易已提交，请在区块链浏览器查看';

            } else if (errorMsg.includes('nonce') ||
                       errorMsg.includes('replacement')) {
                errorMsg = '❌ 交易冲突\n\n' +
                          '请刷新页面后重试';

            } else if (errorMsg.includes('gas')) {
                errorMsg = '❌ Gas费用问题\n\n' +
                          '请确保：\n' +
                          '1. BNB余额充足\n' +
                          '2. Gas价格合理\n' +
                          '3. 网络未拥堵';
            }

            throw new Error(errorMsg);
        }
    }

    // 获取钱包中文名称
    function getWalletNameCN() {
        const names = {
            'OKX': '欧意钱包',
            'Binance': '币安钱包',
            'TokenPocket': 'TokenPocket钱包',
            'imToken': 'imToken钱包',
            'Trust': 'Trust钱包',
            'MetaMask': 'MetaMask钱包',
            'Web3': 'Web3钱包',
            'Unknown': '未知钱包'
        };

        return names[currentDApp] || '未知钱包';
    }

    // 显示欢迎信息
    function showWelcomeMessage() {
        const walletName = getWalletNameCN();
        console.log('');
        console.log('═══════════════════════════════════════');
        console.log('🎉 欢迎使用 Dreamle Mining 平台');
        console.log('═══════════════════════════════════════');
        console.log('📱 当前钱包:', walletName);
        console.log('🌐 网络环境: 已优化（中国用户专用）');
        console.log('⚡ 资源加载: 本地化（更快更稳定）');
        console.log('═══════════════════════════════════════');
        console.log('');
    }

    // 初始化（带重试机制）
    let retryCount = 0;
    // 🚀 优化：DApp 浏览器中减少重试次数（钱包已注入，无需多次重试）
    const uaForInit = navigator.userAgent.toLowerCase();
    const isDAppBrowser = !!(window.BinanceChain || window.okxwallet || window.okex || window.trustwallet || /binance|okx|okex|tokenpocket|imtoken|trust/.test(uaForInit));
    const maxRetries = isDAppBrowser ? 15 : 7;  // DApp 浏览器：更长等待（15次）
    const retryDelay = isDAppBrowser ? 300 : 500; // DApp 浏览器：300ms，桌面浏览器：500ms

    console.log(`🔧 初始化配置: maxRetries=${maxRetries}, retryDelay=${retryDelay}ms (DApp浏览器: ${isDAppBrowser})`);


    function tryInitialize() {
        console.log(`🔧 尝试初始化 (${retryCount + 1}/${maxRetries})...`);
        const initSuccess = setupProvider();

        if (initSuccess) {
            console.log('✅ DApp初始化成功!');
            providerReady = true;
            showWelcomeMessage();
            return true;
        } else {
            retryCount++;

            if (retryCount < maxRetries) {
                console.log(`⏳ 初始化失败，${retryDelay}ms 后重试...`);
                setTimeout(tryInitialize, retryDelay);
                return false;
            } else {
                console.error('❌ DApp初始化失败（已重试 ' + maxRetries + ' 次）');

                // 最后检查一次是否真的没有钱包
                const hasWallet = !!(window.ethereum || window.BinanceChain || window.okxwallet || window.okex);

                if (hasWallet) {
                    console.log('⚠️ 检测到钱包对象，但初始化失败，尝试强制设置...');
                    // 强制设置 ethereum
                    if (!window.ethereum) {
                        window.ethereum = window.BinanceChain || window.okxwallet || window.okex?.ethereum;
                        console.log('✅ 已强制设置 window.ethereum');
                        showWelcomeMessage();
                        return true;
                    }
                }

                // 真的没有钱包，只记录日志，不弹出错误（避免干扰用户）
                console.error('❌ 未检测到钱包对象');
                console.error('   - window.ethereum:', !!window.ethereum);
                console.error('   - window.BinanceChain:', !!window.BinanceChain);
                console.error('   - window.okxwallet:', !!window.okxwallet);
                console.error('   - window.okex:', !!window.okex);
                console.error('💡 提示：请在DApp浏览器中打开（OKX、Binance、TokenPocket、imToken）');

                // 🔧 修复：删除错误弹窗，避免干扰TP钱包等正常使用
                // 只在控制台记录，不弹出 alert
                setTimeout(() => {
                    // 再次检查，避免误报
                    if (!window.ethereum && !window.BinanceChain && !window.okxwallet && !window.okex) {
                        console.warn('⚠️ 延迟检查仍未检测到钱包，但不弹出错误提示');
                    } else {
                        console.log('✅ 延迟检查发现钱包已注入');
                    }
                }, 3000); // 延迟3秒，给钱包足够的注入时间

                return false;
            }
        }
    }

    // 开始初始化
    tryInitialize();

    //
    //
    if (!providerReady) {
        console.log('

');
        watchForLateInjection(15000, 200);
    }

    // 导出到全局
    window.dappInit = {
        env: DAPP_ENV,
        currentDApp: currentDApp,
        walletNameCN: getWalletNameCN(),
        getGasConfig: getGasConfig,
        smartSendTransaction: smartSendTransaction,
        isInitialized: () => !!(window.ethereum || window.BinanceChain || window.okxwallet),
        retryInitialize: tryInitialize
    };

    console.log('✅ DApp初始化模块加载完成');
    console.log('📦 全局对象: window.dappInit');
    console.log('💡 如果初始化失败，可以调用: window.dappInit.retryInitialize()');

})();

