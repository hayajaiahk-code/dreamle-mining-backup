/**
 * 高级加载界面管理器 - Dreamle Mining Platform
 * 负责显示加载动画、系统检查和平滑过渡
 */

class LoadingManager {
    constructor() {
        this.progress = 0;
        this.checks = [
            { id: 'web3', name: 'Web3 Library', status: 'pending' },
            { id: 'contracts', name: 'Smart Contracts', status: 'pending' },
            { id: 'network', name: 'BSC Network', status: 'pending' },
            { id: 'ui', name: 'User Interface', status: 'pending' },
            { id: 'data', name: 'Platform Data', status: 'pending' }
        ];
        this.isComplete = false;
        this.hasError = false;
    }

    // 初始化加载界面
    init() {
        console.log('🚀 Initializing advanced loading screen...');
        this.createLoadingHTML();
        this.createParticles();
        this.startSystemChecks();
    }

    // 创建加载界面HTML
    createLoadingHTML() {
        const loadingHTML = `
            <div id="loadingOverlay" class="loading-overlay">
                <div class="loading-particles" id="loadingParticles"></div>
                
                <div class="loading-container">
                    <div class="loading-logo">DREAMLE</div>
                    
                    <div class="loading-ring">
                        <div class="ring"></div>
                        <div class="ring"></div>
                        <div class="ring"></div>
                        <div class="loading-core"></div>
                    </div>
                    
                    <div class="loading-text" id="loadingText">Initializing Mining Platform...</div>
                    
                    <div class="loading-progress">
                        <div class="progress-bar" id="progressBar"></div>
                    </div>
                    
                    <div class="loading-status" id="loadingStatus">Starting system checks...</div>
                    
                    <div class="system-checks" id="systemChecks">
                        ${this.checks.map(check => `
                            <div class="check-item" id="check-${check.id}">
                                <div class="check-icon loading" id="icon-${check.id}">⟳</div>
                                <span>${check.name}</span>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="loading-error" id="loadingError" style="display: none;">
                        <div>System initialization failed</div>
                        <button class="retry-button" onclick="window.loadingManager.retry()">Retry</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('afterbegin', loadingHTML);
    }

    // 创建粒子效果
    createParticles() {
        const particlesContainer = document.getElementById('loadingParticles');
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    // 开始系统检查
    async startSystemChecks() {
        console.log('🔍 Starting system checks...');
        
        // 显示检查项目
        setTimeout(() => {
            this.checks.forEach((check, index) => {
                setTimeout(() => {
                    const element = document.getElementById(`check-${check.id}`);
                    if (element) element.classList.add('show');
                }, index * 200);
            });
        }, 500);

        // 执行检查
        await this.performChecks();
    }

    // 执行系统检查
    async performChecks() {
        for (let i = 0; i < this.checks.length; i++) {
            const check = this.checks[i];
            await this.performSingleCheck(check);
            
            if (this.hasError) {
                this.showError();
                return;
            }
            
            this.updateProgress((i + 1) / this.checks.length * 100);
            await this.delay(300);
        }

        await this.delay(1000);
        this.completeLoading();
    }

    // 执行单个检查
    async performSingleCheck(check) {
        console.log(`🔍 Checking ${check.name}...`);
        this.updateStatus(`Checking ${check.name}...`);

        try {
            let success = false;

            switch (check.id) {
                case 'web3':
                    success = await this.checkWeb3();
                    break;
                case 'contracts':
                    success = await this.checkContracts();
                    break;
                case 'network':
                    success = await this.checkNetwork();
                    break;
                case 'ui':
                    success = await this.checkUI();
                    break;
                case 'data':
                    success = await this.checkData();
                    break;
            }

            if (success) {
                this.markCheckSuccess(check.id);
                check.status = 'success';
            } else {
                this.markCheckError(check.id);
                check.status = 'error';
                this.hasError = true;
            }

        } catch (error) {
            console.error(`❌ Check failed for ${check.name}:`, error);
            this.markCheckError(check.id);
            check.status = 'error';
            this.hasError = true;
        }
    }

    // Web3检查
    async checkWeb3() {
        await this.delay(500);
        if (typeof Web3 === 'undefined') {
            console.error('❌ Web3 library not found');
            return false;
        }
        
        // 初始化基本Web3实例
        if (!window.web3) {
            try {
                window.web3 = new Web3('https://bsc-dataseed.binance.org/');
                console.log('✅ Web3 initialized successfully');
            } catch (error) {
                console.error('❌ Web3 initialization failed:', error);
                return false;
            }
        }
        
        return true;
    }

    // 合约检查
    async checkContracts() {
        await this.delay(800);
        
        if (!window.CONTRACT_ADDRESSES) {
            console.error('❌ Contract addresses not loaded');
            return false;
        }

        const requiredAddresses = ['UNIFIED_SYSTEM', 'USDT_TOKEN', 'DREAMLE_TOKEN'];
        for (const addr of requiredAddresses) {
            if (!window.CONTRACT_ADDRESSES[addr]) {
                console.error(`❌ Missing contract address: ${addr}`);
                return false;
            }
        }

        console.log('✅ Contract addresses verified');
        return true;
    }

    // 网络检查
    async checkNetwork() {
        await this.delay(1000);
        
        if (!window.web3) {
            return false;
        }

        try {
            const chainId = await window.web3.eth.getChainId();
            if (Number(chainId) !== 56) {
                console.warn('⚠️ Not connected to BSC mainnet');
                // 不阻止加载，只是警告
            }
            console.log('✅ Network connection verified');
            return true;
        } catch (error) {
            console.error('❌ Network check failed:', error);
            return false;
        }
    }

    // UI检查
    async checkUI() {
        await this.delay(600);
        
        const requiredElements = [
            'bnbBalance', 'usdtBalance', 'drmBalance',
            'networkHashpower', 'activeMiners', 'totalRewardsPaid'
        ];

        for (const elementId of requiredElements) {
            if (!document.getElementById(elementId)) {
                console.error(`❌ Missing UI element: ${elementId}`);
                return false;
            }
        }

        console.log('✅ UI elements verified');
        return true;
    }

    // 数据检查
    async checkData() {
        await this.delay(700);
        
        try {
            // 初始化基本显示数据
            if (typeof window.initializeBasicDisplay === 'function') {
                await window.initializeBasicDisplay();
                console.log('✅ Basic data initialized');
            }
            
            return true;
        } catch (error) {
            console.error('❌ Data initialization failed:', error);
            return false;
        }
    }

    // 标记检查成功
    markCheckSuccess(checkId) {
        const icon = document.getElementById(`icon-${checkId}`);
        if (icon) {
            icon.className = 'check-icon success';
            icon.textContent = '✓';
        }
    }

    // 标记检查失败
    markCheckError(checkId) {
        const icon = document.getElementById(`icon-${checkId}`);
        if (icon) {
            icon.className = 'check-icon error';
            icon.textContent = '✗';
        }
    }

    // 更新进度
    updateProgress(percent) {
        this.progress = percent;
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.style.width = percent + '%';
        }
    }

    // 更新状态文本
    updateStatus(text) {
        const statusElement = document.getElementById('loadingStatus');
        if (statusElement) {
            statusElement.textContent = text;
        }
    }

    // 显示错误
    showError() {
        this.updateStatus('System initialization failed');
        const errorElement = document.getElementById('loadingError');
        if (errorElement) {
            errorElement.style.display = 'block';
        }
    }

    // 完成加载
    completeLoading() {
        console.log('✅ Loading completed successfully');
        this.isComplete = true;
        this.updateStatus('Platform ready! Welcome to Dreamle Mining.');
        
        setTimeout(() => {
            this.fadeOut();
        }, 1500);
    }

    // 淡出加载界面
    fadeOut() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.add('fade-out');
            setTimeout(() => {
                overlay.remove();
                console.log('🎉 Loading screen removed - Platform ready!');
            }, 800);
        }
    }

    // 重试
    retry() {
        console.log('🔄 Retrying system initialization...');
        this.progress = 0;
        this.hasError = false;
        this.checks.forEach(check => check.status = 'pending');
        
        // 重置UI
        const errorElement = document.getElementById('loadingError');
        if (errorElement) errorElement.style.display = 'none';
        
        this.updateProgress(0);
        this.updateStatus('Retrying system checks...');
        
        // 重置检查图标
        this.checks.forEach(check => {
            const icon = document.getElementById(`icon-${check.id}`);
            if (icon) {
                icon.className = 'check-icon loading';
                icon.textContent = '⟳';
            }
        });
        
        setTimeout(() => {
            this.performChecks();
        }, 500);
    }

    // 延迟函数
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// 全局加载管理器实例
window.loadingManager = new LoadingManager();
