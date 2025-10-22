/**
 * Buy DRM Functions
 * Handles DRM token purchase functionality
 */

// DRM Sale Contract Configuration - BSC Mainnet Only
const DRM_SALE_CONFIG = {
    chainId: 56,
    chainName: 'BSC Mainnet',
    // Multiple RPC endpoints for fallback (in order of preference)
    rpcUrls: [
        'https://bsc-dataseed.bnbchain.org/',
        'https://bsc-dataseed1.binance.org/',
        'https://bsc-dataseed.nariox.org/',
        'https://bsc-dataseed.defibit.io/',
        'https://bsc.nodereal.io'
    ],
    drmToken: "0x4440409e078D44A63c72696716b84A46814717e9", // DREAMLE Token
    usdtToken: "0x55d398326f99059fF775485246999027B3197955", // BSC Mainnet USDT
    saleContract: "0x1C8c3e823F98EFEc34FEf5673b4d63a23A251224", // Sale Contract (Deployed: 2025-01-22)
    drmPrice: 0.2, // Default price, actual price from contract
    minPurchase: 10,
    maxPurchase: 10000,
};

// Get current network config
function getCurrentDRMConfig() {
    console.log(`🌐 Using ${DRM_SALE_CONFIG.chainName} (Chain ID: ${DRM_SALE_CONFIG.chainId})`);
    return DRM_SALE_CONFIG;
}

// Global variable to store current DRM price from contract
let currentDrmPrice = 0.2; // Default value

// Calculate DRM amount from USDT using current contract price
function calculateDRM(usdtAmount) {
    return usdtAmount / currentDrmPrice;
}

// Calculate custom DRM amount
function calculateCustomDRM() {
    const input = document.getElementById('customUsdtAmount');
    const display = document.getElementById('customDrmAmount');

    if (!input || !display) return;

    const usdtAmount = parseFloat(input.value) || 0;
    const drmAmount = calculateDRM(usdtAmount);

    display.textContent = drmAmount.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
}

// Quick buy function
async function quickBuyDRM(usdtAmount) {
    console.log(`🛒 Quick buy: ${usdtAmount} USDT`);
    await buyDRM(usdtAmount);
}

// Custom buy function
async function buyDRMCustom() {
    const input = document.getElementById('customUsdtAmount');
    if (!input) {
        showMessage('Input element not found', 'error');
        return;
    }
    
    const usdtAmount = parseFloat(input.value);
    const config = getCurrentDRMConfig();
    
    if (!usdtAmount || usdtAmount < config.minPurchase || usdtAmount > config.maxPurchase) {
        showMessage(`Please enter amount between ${config.minPurchase} and ${config.maxPurchase} USDT`, 'warning');
        return;
    }
    
    await buyDRM(usdtAmount);
}

// Main buy DRM function
async function buyDRM(usdtAmount) {
    try {
        console.log(`💰 Starting DRM purchase: ${usdtAmount} USDT`);
        
        // Check if wallet is connected
        if (!window.ethereum) {
            showMessage('Please install MetaMask or OKX Wallet', 'error');
            return;
        }
        
        // Check if user is connected
        if (!window.userAccount) {
            showMessage('Please connect your wallet first', 'warning');
            if (typeof window.connectWallet === 'function') {
                await window.connectWallet();
            }
            return;
        }
        
        const config = getCurrentDRMConfig();

        // Support both ethers v5 and v6
        let provider, signer, network;
        if (ethers.providers) {
            // Ethers v5
            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            network = await provider.getNetwork();
        } else {
            // Ethers v6
            provider = new ethers.BrowserProvider(window.ethereum);
            signer = await provider.getSigner();
            network = await provider.getNetwork();
        }

        // Check network
        const chainId = network.chainId ? Number(network.chainId) : network;
        if (chainId !== config.chainId) {
            showMessage(`Please switch to ${config.chainId === 97 ? 'BSC Testnet' : 'BSC Mainnet'}`, 'error');
            return;
        }
        
        // Create contract instances
        const saleContract = new ethers.Contract(
            config.saleContract,
            DRM_SALE_ABI,
            signer
        );
        
        const usdtContract = new ethers.Contract(
            config.usdtToken,
            ERC20_ABI,
            signer
        );

        // Helper function for parsing (compatible with both v5 and v6)
        const parseEther = (value) => {
            if (ethers.parseEther) {
                return ethers.parseEther(value); // v6
            } else {
                return ethers.utils.parseEther(value); // v5
            }
        };

        const amount = parseEther(usdtAmount.toString());
        const drmAmount = calculateDRM(usdtAmount);
        
        showMessage(`Preparing to buy ${drmAmount.toFixed(2)} DRM...`, 'info');
        
        // Step 1: Check USDT balance
        console.log('📊 Checking USDT balance...');
        const usdtBalance = await usdtContract.balanceOf(window.userAccount);
        if (usdtBalance < amount) {
            showMessage('Insufficient USDT balance', 'error');
            return;
        }
        
        // Step 2: Check allowance
        console.log('🔍 Checking USDT allowance...');
        const allowance = await usdtContract.allowance(window.userAccount, config.saleContract);
        
        if (allowance < amount) {
            // Need to approve
            console.log('📝 Approving USDT...');
            showMessage('Please approve USDT in your wallet...', 'info');
            
            const approveTx = await usdtContract.approve(config.saleContract, amount);
            showMessage('Waiting for approval confirmation...', 'info');
            
            await approveTx.wait();
            showMessage('USDT approved successfully!', 'success');
        }
        
        // Step 3: Buy DRM
        console.log('💎 Buying DRM...');
        showMessage('Please confirm the purchase in your wallet...', 'info');
        
        const buyTx = await saleContract.buyDRM(amount);
        showMessage('Waiting for transaction confirmation...', 'info');
        
        const receipt = await buyTx.wait();
        
        console.log('✅ Purchase successful!', receipt);
        showMessage(`✅ Successfully purchased ${drmAmount.toFixed(2)} DRM!`, 'success');
        
        // Clear input
        const input = document.getElementById('customUsdtAmount');
        if (input) input.value = '';
        
        // Refresh data
        await refreshDRMSaleData();
        await loadPurchaseHistory();

        // Update user balance if function exists
        if (typeof window.refreshUserBalance === 'function') {
            await window.refreshUserBalance();
        }
        
    } catch (error) {
        console.error('❌ Purchase failed:', error);
        
        let errorMessage = 'Purchase failed';
        if (error.message) {
            if (error.message.includes('user rejected')) {
                errorMessage = 'Transaction cancelled by user';
            } else if (error.message.includes('insufficient funds')) {
                errorMessage = 'Insufficient funds for gas fee';
            } else {
                errorMessage = error.message;
            }
        }
        
        showMessage(errorMessage, 'error');
    }
}

// Refresh DRM sale data
async function refreshDRMSaleData() {
    try {
        console.log('🔄 Refreshing DRM sale data...');

        const config = getCurrentDRMConfig();

        // ALWAYS use wallet provider if available for better performance
        // Wallet providers (MetaMask, OKX, Trust Wallet, etc.) automatically select the fastest RPC node
        let provider;
        if (ethers.providers) {
            // Ethers v5
            if (window.ethereum) {
                provider = new ethers.providers.Web3Provider(window.ethereum);
                console.log('✅ Using wallet provider (MetaMask/OKX/Trust Wallet)');

                // Check if wallet is on correct network
                const network = await provider.getNetwork();
                console.log(`📡 Wallet network: Chain ID ${network.chainId}`);

                if (network.chainId !== config.chainId) {
                    console.error(`❌ Wrong network! Wallet is on Chain ID ${network.chainId}, but need Chain ID ${config.chainId} (BSC Mainnet)`);
                    console.error('🚫 Disconnecting wallet and clearing testnet data...');

                    // Disconnect wallet immediately
                    window.userAccount = null;

                    // Clear all wallet-related UI
                    const connectBtn = document.getElementById('connectWalletBtn');
                    if (connectBtn) {
                        connectBtn.textContent = 'Connect Wallet';
                        connectBtn.style.display = 'block';
                    }

                    const walletInfo = document.getElementById('walletInfo');
                    if (walletInfo) {
                        walletInfo.style.display = 'none';
                    }

                    // Show prominent error message
                    const errorMsg = `⚠️ TESTNET DETECTED! This DApp only works on BSC MAINNET (Chain ID: 56).\n\nYour wallet is on Chain ID ${network.chainId}.\n\nPlease:\n1. Switch your OKX wallet to "BNB Smart Chain Mainnet"\n2. Make sure it shows "BNB" (not "tBNB")\n3. Click "Connect Wallet" again`;

                    if (document.getElementById('errorMessage')) {
                        document.getElementById('errorMessage').innerHTML = errorMsg.replace(/\n/g, '<br>');
                        document.getElementById('errorMessage').style.display = 'block';
                        document.getElementById('errorMessage').style.backgroundColor = '#ff4444';
                        document.getElementById('errorMessage').style.color = 'white';
                        document.getElementById('errorMessage').style.padding = '20px';
                        document.getElementById('errorMessage').style.borderRadius = '10px';
                        document.getElementById('errorMessage').style.fontSize = '16px';
                        document.getElementById('errorMessage').style.fontWeight = 'bold';
                        document.getElementById('errorMessage').style.textAlign = 'center';
                        document.getElementById('errorMessage').style.margin = '20px auto';
                        document.getElementById('errorMessage').style.maxWidth = '600px';
                    }

                    // Also show alert
                    alert(`⚠️ WRONG NETWORK!\n\nThis DApp only works on BSC MAINNET.\n\nYour wallet is on Chain ID ${network.chainId} (Testnet).\n\nPlease switch to BSC Mainnet (Chain ID: 56) in your OKX wallet and reconnect.`);

                    return;
                }
            } else {
                // Fallback to public RPC (may be slow)
                console.warn('⚠️ Wallet not detected, using public RPC (may be slow)');
                provider = new ethers.providers.JsonRpcProvider(config.rpcUrls[0]);
            }
        } else {
            // Ethers v6
            if (window.ethereum) {
                provider = new ethers.BrowserProvider(window.ethereum);
                console.log('✅ Using wallet provider (MetaMask/OKX/Trust Wallet)');

                // Check if wallet is on correct network
                const network = await provider.getNetwork();
                console.log(`📡 Wallet network: Chain ID ${network.chainId}`);

                if (network.chainId !== BigInt(config.chainId)) {
                    console.error(`❌ Wrong network! Wallet is on Chain ID ${network.chainId}, but need Chain ID ${config.chainId} (BSC Mainnet)`);
                    console.error('⚠️ Please switch your wallet to BSC Mainnet (Chain ID: 56)');

                    // Show error to user
                    const errorMsg = `Wrong network! Please switch your wallet to BSC Mainnet (Chain ID: 56). Current: Chain ID ${network.chainId}`;
                    if (document.getElementById('errorMessage')) {
                        document.getElementById('errorMessage').textContent = errorMsg;
                        document.getElementById('errorMessage').style.display = 'block';
                    }
                    return;
                }
            } else {
                console.warn('⚠️ Wallet not detected, using public RPC (may be slow)');
                provider = new ethers.JsonRpcProvider(config.rpcUrls[0]);
            }
        }

        const saleContract = new ethers.Contract(
            config.saleContract,
            DRM_SALE_ABI,
            provider
        );

        const drmToken = new ethers.Contract(
            config.drmToken,
            ERC20_ABI,
            provider
        );
        
        // Get contract data
        const [
            drmPrice,
            isPaused,
            contractDrmBalance,
            totalUsdtReceived,
            totalDrmSold,
            totalPurchases,
            minPurchase,
            maxPurchase
        ] = await Promise.all([
            saleContract.drmPriceInUsdt(),
            saleContract.isPaused(),
            drmToken.balanceOf(config.saleContract),
            saleContract.totalUsdtReceived(),
            saleContract.totalDrmSold(),
            saleContract.getTotalPurchases(),
            saleContract.minPurchaseAmount(),
            saleContract.maxPurchaseAmount()
        ]);

        // Helper function for formatting (compatible with both v5 and v6)
        const formatEther = (value) => {
            if (ethers.formatEther) {
                return ethers.formatEther(value); // v6
            } else {
                return ethers.utils.formatEther(value); // v5
            }
        };

        // Update global price variable for calculations
        currentDrmPrice = parseFloat(formatEther(drmPrice));
        console.log('💰 Current DRM Price:', currentDrmPrice, 'USDT/DRM');

        // Update price display
        const priceDisplay = document.getElementById('drmPriceDisplay');
        if (priceDisplay) {
            priceDisplay.textContent = currentDrmPrice;
        }

        // Update available DRM
        const availableDisplay = document.getElementById('drmAvailableDisplay');
        if (availableDisplay) {
            const available = parseFloat(formatEther(contractDrmBalance));
            availableDisplay.textContent = available.toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });
        }

        // Update sale status
        const statusDisplay = document.getElementById('saleStatusDisplay');
        if (statusDisplay) {
            statusDisplay.textContent = isPaused ? '❌ Paused' : '✅ Active';
        }

        // Update statistics
        const totalSoldDisplay = document.getElementById('totalSoldDRM');
        if (totalSoldDisplay) {
            const sold = parseFloat(formatEther(totalDrmSold));
            totalSoldDisplay.textContent = sold.toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }) + ' DRM';
        }

        const totalRevenueDisplay = document.getElementById('totalRevenue');
        if (totalRevenueDisplay) {
            const revenue = parseFloat(formatEther(totalUsdtReceived));
            totalRevenueDisplay.textContent = revenue.toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }) + ' USDT';
        }

        const totalPurchasesDisplay = document.getElementById('totalPurchases');
        if (totalPurchasesDisplay) {
            totalPurchasesDisplay.textContent = totalPurchases.toString();
        }

        // Update Important Information section
        const noticePrice = document.getElementById('noticePrice');
        if (noticePrice) {
            const priceValue = parseFloat(formatEther(drmPrice));
            noticePrice.textContent = `${priceValue} USDT per DRM`;
        }

        const noticeMinPurchase = document.getElementById('noticeMinPurchase');
        if (noticeMinPurchase) {
            const minValue = parseFloat(formatEther(minPurchase));
            noticeMinPurchase.textContent = `${minValue.toLocaleString('en-US', {maximumFractionDigits: 0})} USDT`;
        }

        const noticeMaxPurchase = document.getElementById('noticeMaxPurchase');
        if (noticeMaxPurchase) {
            const maxValue = parseFloat(formatEther(maxPurchase));
            noticeMaxPurchase.textContent = `${maxValue.toLocaleString('en-US', {maximumFractionDigits: 0})} USDT`;
        }

        // Update quick buy buttons with correct DRM amounts
        const priceValue = parseFloat(formatEther(drmPrice));
        const buyReceiveElements = document.querySelectorAll('.buy-receive[data-usdt]');
        buyReceiveElements.forEach(element => {
            const usdtAmount = parseFloat(element.getAttribute('data-usdt'));
            const drmAmount = usdtAmount / priceValue;
            element.textContent = drmAmount.toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }) + ' DRM';
        });

        console.log('✅ DRM sale data refreshed');
        
    } catch (error) {
        console.error('❌ Failed to refresh DRM sale data:', error);
    }
}

// Load purchase history
async function loadPurchaseHistory() {
    try {
        if (!window.userAccount) {
            console.log('ℹ️ No user account, skipping purchase history');
            return;
        }
        
        console.log('📜 Loading purchase history...');

        const config = getCurrentDRMConfig();

        // Use MetaMask if available
        let provider;
        if (ethers.providers) {
            // Ethers v5
            if (window.ethereum) {
                provider = new ethers.providers.Web3Provider(window.ethereum);
            } else {
                provider = new ethers.providers.JsonRpcProvider(config.rpcUrls[0]);
            }
        } else {
            // Ethers v6
            if (window.ethereum) {
                provider = new ethers.BrowserProvider(window.ethereum);
            } else {
                provider = new ethers.JsonRpcProvider(config.rpcUrls[0]);
            }
        }

        const saleContract = new ethers.Contract(
            config.saleContract,
            DRM_SALE_ABI,
            provider
        );

        // Helper function for formatting (compatible with both v5 and v6)
        const formatEther = (value) => {
            if (ethers.formatEther) {
                return ethers.formatEther(value); // v6
            } else {
                return ethers.utils.formatEther(value); // v5
            }
        };

        // Get user purchases
        const purchases = await saleContract.getUserPurchases(window.userAccount);

        const container = document.getElementById('purchaseHistoryContainer');
        if (!container) return;

        if (purchases.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📭</div>
                    <div class="empty-text">No purchase history yet</div>
                    <div class="empty-hint">Start buying DRM tokens to see your history here</div>
                </div>
            `;
            return;
        }

        // Display purchases
        let html = '<div class="history-list">';

        for (let i = purchases.length - 1; i >= 0; i--) {
            const purchase = purchases[i];
            const usdtAmount = parseFloat(formatEther(purchase.usdtAmount));
            const drmAmount = parseFloat(formatEther(purchase.drmAmount));
            const timestamp = new Date(Number(purchase.timestamp) * 1000);
            
            html += `
                <div class="history-item">
                    <div class="history-header">
                        <span class="history-number">#${i + 1}</span>
                        <span class="history-date">${timestamp.toLocaleString()}</span>
                    </div>
                    <div class="history-details">
                        <div class="history-amount">
                            <span class="amount-label">Paid:</span>
                            <span class="amount-value">${usdtAmount.toFixed(2)} USDT</span>
                        </div>
                        <div class="history-arrow">→</div>
                        <div class="history-amount">
                            <span class="amount-label">Received:</span>
                            <span class="amount-value">${drmAmount.toFixed(2)} DRM</span>
                        </div>
                    </div>
                </div>
            `;
        }
        
        html += '</div>';
        container.innerHTML = html;
        
        console.log(`✅ Loaded ${purchases.length} purchase records`);
        
    } catch (error) {
        console.error('❌ Failed to load purchase history:', error);
    }
}

// Initialize DRM sale section
async function initializeDRMSale() {
    console.log('🚀 Initializing DRM sale section...');
    
    try {
        await refreshDRMSaleData();
        await loadPurchaseHistory();
        
        console.log('✅ DRM sale section initialized');
    } catch (error) {
        console.error('❌ Failed to initialize DRM sale section:', error);
    }
}

// Auto-refresh data every 30 seconds
setInterval(async () => {
    if (document.getElementById('buy-drm')?.classList.contains('active')) {
        await refreshDRMSaleData();
    }
}, 30000);

// Export functions
window.quickBuyDRM = quickBuyDRM;
window.buyDRMCustom = buyDRMCustom;
window.buyDRM = buyDRM;
window.calculateCustomDRM = calculateCustomDRM;
window.refreshDRMSaleData = refreshDRMSaleData;
window.loadPurchaseHistory = loadPurchaseHistory;
window.initializeDRMSale = initializeDRMSale;

console.log('✅ Buy DRM functions loaded');

