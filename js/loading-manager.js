/**
 * AI Computing Loading Manager
 * 管理平台加载状态和进度显示
 */

(function() {
    'use strict';

    console.log('🎬 Loading Manager initializing...');

    // 加载状态管理器
    window.LoadingManager = {
        // 加载步骤配置
        steps: {
            config: { name: 'Loading Configuration', weight: 15, completed: false },
            web3: { name: 'Initializing Web3', weight: 20, completed: false },
            contracts: { name: 'Loading Smart Contracts', weight: 25, completed: false },
            network: { name: 'Connecting to BSC Network', weight: 25, completed: false },
            ui: { name: 'Preparing Interface', weight: 15, completed: false }
        },

        // 当前进度
        currentProgress: 0,

        // 是否已完成
        isCompleted: false,

        // DOM 元素
        elements: {
            screen: null,
            progressFill: null,
            percentage: null,
            statusIcon: null,
            statusText: null
        },

        /**
         * 初始化加载管理器
         */
        init: function() {
            console.log('🚀 Loading Manager: Initializing...');
            
            // 获取 DOM 元素
            this.elements.screen = document.getElementById('aiLoadingScreen');
            this.elements.progressFill = document.getElementById('loadingProgressFill');
            this.elements.percentage = document.getElementById('loadingPercentage');
            this.elements.statusIcon = document.querySelector('.status-icon');
            this.elements.statusText = document.querySelector('.status-text');

            if (!this.elements.screen) {
                console.error('❌ Loading screen not found!');
                return;
            }

            console.log('✅ Loading Manager initialized');
            
            // 开始加载流程
            this.startLoading();
        },

        /**
         * 开始加载流程
         */
        startLoading: function() {
            console.log('🎬 Starting loading sequence...');
            
            // 监听配置加载
            this.monitorConfigLoading();
            
            // 监听 Web3 初始化
            this.monitorWeb3Loading();
            
            // 监听合约加载
            this.monitorContractLoading();
            
            // 监听网络连接
            this.monitorNetworkLoading();
            
            // 监听 UI 准备
            this.monitorUILoading();
        },

        /**
         * 更新步骤状态
         */
        updateStep: function(stepId, status) {
            const step = this.steps[stepId];
            if (!step) {
                console.warn(`⚠️ Unknown step: ${stepId}`);
                return;
            }

            const stepElement = document.getElementById(`step-${stepId}`);
            if (!stepElement) {
                console.warn(`⚠️ Step element not found: step-${stepId}`);
                return;
            }

            const statusElement = stepElement.querySelector('.step-status');

            if (status === 'active') {
                stepElement.classList.add('active');
                stepElement.classList.remove('completed');
                statusElement.textContent = '⏳';
                console.log(`🔄 Step active: ${step.name}`);
                
                // 更新状态文本
                this.updateStatus(step.name);
            } else if (status === 'completed') {
                stepElement.classList.remove('active');
                stepElement.classList.add('completed');
                statusElement.textContent = '✅';
                step.completed = true;
                console.log(`✅ Step completed: ${step.name}`);
                
                // 更新进度
                this.updateProgress();
            } else if (status === 'error') {
                stepElement.classList.remove('active');
                stepElement.classList.add('error');
                statusElement.textContent = '❌';
                console.error(`❌ Step failed: ${step.name}`);
            }
        },

        /**
         * 更新进度条
         */
        updateProgress: function() {
            let totalWeight = 0;
            let completedWeight = 0;

            for (const key in this.steps) {
                const step = this.steps[key];
                totalWeight += step.weight;
                if (step.completed) {
                    completedWeight += step.weight;
                }
            }

            const progress = Math.round((completedWeight / totalWeight) * 100);
            this.currentProgress = progress;

            if (this.elements.progressFill) {
                this.elements.progressFill.style.width = `${progress}%`;
            }

            if (this.elements.percentage) {
                this.elements.percentage.textContent = `${progress}%`;
            }

            console.log(`📊 Progress: ${progress}%`);

            // 检查是否全部完成
            if (progress >= 100) {
                this.complete();
            }
        },

        /**
         * 更新状态文本
         */
        updateStatus: function(text, icon = '⚡') {
            if (this.elements.statusText) {
                this.elements.statusText.textContent = text;
            }
            if (this.elements.statusIcon) {
                this.elements.statusIcon.textContent = icon;
            }
        },

        /**
         * 监听配置加载
         */
        monitorConfigLoading: function() {
            this.updateStep('config', 'active');
            
            // 检查配置是否已加载
            const checkConfig = () => {
                if (window.CONTRACT_ADDRESSES && window.UNIFIED_SYSTEM_V16_ABI) {
                    this.updateStep('config', 'completed');
                    return true;
                }
                return false;
            };

            if (!checkConfig()) {
                // 每 100ms 检查一次
                const interval = setInterval(() => {
                    if (checkConfig()) {
                        clearInterval(interval);
                    }
                }, 100);

                // 5 秒超时
                setTimeout(() => {
                    clearInterval(interval);
                    if (!this.steps.config.completed) {
                        console.warn('⚠️ Config loading timeout, marking as completed anyway');
                        this.updateStep('config', 'completed');
                    }
                }, 5000);
            }
        },

        /**
         * 监听 Web3 初始化
         */
        monitorWeb3Loading: function() {
            // 等待配置完成
            const waitForConfig = setInterval(() => {
                if (this.steps.config.completed) {
                    clearInterval(waitForConfig);
                    this.updateStep('web3', 'active');
                    
                    // 检查 Web3 是否已初始化
                    const checkWeb3 = () => {
                        if (window.Web3 && typeof window.Web3 === 'function') {
                            this.updateStep('web3', 'completed');
                            return true;
                        }
                        return false;
                    };

                    if (!checkWeb3()) {
                        const interval = setInterval(() => {
                            if (checkWeb3()) {
                                clearInterval(interval);
                            }
                        }, 100);

                        setTimeout(() => {
                            clearInterval(interval);
                            if (!this.steps.web3.completed) {
                                console.warn('⚠️ Web3 loading timeout, marking as completed anyway');
                                this.updateStep('web3', 'completed');
                            }
                        }, 5000);
                    }
                }
            }, 100);
        },

        /**
         * 监听合约加载
         */
        monitorContractLoading: function() {
            const waitForWeb3 = setInterval(() => {
                if (this.steps.web3.completed) {
                    clearInterval(waitForWeb3);
                    this.updateStep('contracts', 'active');
                    
                    // 检查合约是否已初始化
                    const checkContracts = () => {
                        if (window.unifiedContract || window.CONTRACT_ADDRESSES) {
                            this.updateStep('contracts', 'completed');
                            return true;
                        }
                        return false;
                    };

                    if (!checkContracts()) {
                        const interval = setInterval(() => {
                            if (checkContracts()) {
                                clearInterval(interval);
                            }
                        }, 100);

                        setTimeout(() => {
                            clearInterval(interval);
                            if (!this.steps.contracts.completed) {
                                console.warn('⚠️ Contracts loading timeout, marking as completed anyway');
                                this.updateStep('contracts', 'completed');
                            }
                        }, 5000);
                    }
                }
            }, 100);
        },

        /**
         * 监听网络连接
         */
        monitorNetworkLoading: function() {
            const waitForContracts = setInterval(() => {
                if (this.steps.contracts.completed) {
                    clearInterval(waitForContracts);
                    this.updateStep('network', 'active');
                    
                    // 网络检查（简化版，直接标记完成）
                    setTimeout(() => {
                        this.updateStep('network', 'completed');
                    }, 800);
                }
            }, 100);
        },

        /**
         * 监听 UI 准备
         */
        monitorUILoading: function() {
            const waitForNetwork = setInterval(() => {
                if (this.steps.network.completed) {
                    clearInterval(waitForNetwork);
                    this.updateStep('ui', 'active');
                    
                    // 等待 DOM 完全加载
                    if (document.readyState === 'complete') {
                        setTimeout(() => {
                            this.updateStep('ui', 'completed');
                        }, 500);
                    } else {
                        window.addEventListener('load', () => {
                            setTimeout(() => {
                                this.updateStep('ui', 'completed');
                            }, 500);
                        });
                    }
                }
            }, 100);
        },

        /**
         * 完成加载
         */
        complete: function() {
            if (this.isCompleted) return;
            
            this.isCompleted = true;
            console.log('🎉 Loading complete!');
            
            this.updateStatus('Loading Complete!', '🎉');
            
            // 延迟 800ms 后隐藏加载屏幕
            setTimeout(() => {
                if (this.elements.screen) {
                    this.elements.screen.classList.add('loaded');
                    console.log('✅ Loading screen hidden');
                }
            }, 800);
        }
    };

    // 页面加载时初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.LoadingManager.init();
        });
    } else {
        window.LoadingManager.init();
    }

    console.log('✅ Loading Manager module loaded');

})();

