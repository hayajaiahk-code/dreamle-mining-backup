/**
 * 移动端性能监控系统
 * 实时监控DApp在移动端钱包中的性能指标
 */

class MobilePerformanceMonitor {
    constructor() {
        this.metrics = {
            pageLoad: {},
            web3Load: {},
            transactions: [],
            errors: [],
            userInteractions: [],
            networkStats: {},
            walletConnections: []
        };
        
        this.config = {
            enableLocalStorage: true,
            enableRemoteLogging: false, // 设置为true启用远程日志
            remoteEndpoint: '/api/mobile-metrics',
            batchSize: 10,
            flushInterval: 30000, // 30秒
            maxStorageSize: 1000 // 最大存储条目数
        };
        
        this.deviceInfo = this.getDeviceInfo();
        this.sessionId = this.generateSessionId();
        
        this.init();
    }
    
    init() {
        console.log('📊 移动端性能监控系统启动...');
        
        // 监控页面加载性能
        this.monitorPageLoad();
        
        // 监控Web3加载性能
        this.monitorWeb3Load();
        
        // 监控网络性能
        this.monitorNetworkPerformance();
        
        // 监控用户交互
        this.monitorUserInteractions();
        
        // 监控错误
        this.monitorErrors();
        
        // 定期上传数据
        this.startPeriodicUpload();
        
        // 页面卸载时保存数据
        this.setupUnloadHandler();
        
        console.log('✅ 移动端性能监控系统初始化完成');
    }
    
    getDeviceInfo() {
        const ua = navigator.userAgent;
        return {
            userAgent: ua,
            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua),
            isTPWallet: /TokenPocket/i.test(ua),
            isIMWallet: /imToken/i.test(ua),
            isBinanceWallet: /BinanceChain/i.test(ua),
            isOKXWallet: /OKApp/i.test(ua),
            screenWidth: screen.width,
            screenHeight: screen.height,
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight,
            pixelRatio: window.devicePixelRatio || 1,
            connection: this.getConnectionInfo(),
            timestamp: Date.now()
        };
    }
    
    getConnectionInfo() {
        if ('connection' in navigator) {
            const conn = navigator.connection;
            return {
                effectiveType: conn.effectiveType,
                downlink: conn.downlink,
                rtt: conn.rtt,
                saveData: conn.saveData
            };
        }
        return null;
    }
    
    generateSessionId() {
        return 'mobile_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    monitorPageLoad() {
        // 监控页面加载时间
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            
            this.metrics.pageLoad = {
                sessionId: this.sessionId,
                timestamp: Date.now(),
                loadTime: perfData.loadEventEnd - perfData.navigationStart,
                domContentLoaded: perfData.domContentLoadedEventEnd - perfData.navigationStart,
                firstPaint: this.getFirstPaint(),
                firstContentfulPaint: this.getFirstContentfulPaint(),
                largestContentfulPaint: this.getLargestContentfulPaint(),
                deviceInfo: this.deviceInfo
            };
            
            this.logMetric('pageLoad', this.metrics.pageLoad);
        });
    }
    
    getFirstPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const fpEntry = paintEntries.find(entry => entry.name === 'first-paint');
        return fpEntry ? fpEntry.startTime : null;
    }
    
    getFirstContentfulPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        return fcpEntry ? fcpEntry.startTime : null;
    }
    
    getLargestContentfulPaint() {
        return new Promise((resolve) => {
            if ('PerformanceObserver' in window) {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    resolve(lastEntry ? lastEntry.startTime : null);
                });
                observer.observe({ entryTypes: ['largest-contentful-paint'] });
                
                // 超时处理
                setTimeout(() => resolve(null), 5000);
            } else {
                resolve(null);
            }
        });
    }
    
    monitorWeb3Load() {
        const startTime = Date.now();
        
        // 监控Web3加载
        const checkWeb3 = () => {
            if (typeof window.Web3 !== 'undefined') {
                const loadTime = Date.now() - startTime;
                
                this.metrics.web3Load = {
                    sessionId: this.sessionId,
                    timestamp: Date.now(),
                    loadTime: loadTime,
                    success: true,
                    version: window.Web3.version || 'unknown',
                    deviceInfo: this.deviceInfo
                };
                
                this.logMetric('web3Load', this.metrics.web3Load);
            } else if (Date.now() - startTime > 15000) {
                // 15秒后仍未加载
                this.metrics.web3Load = {
                    sessionId: this.sessionId,
                    timestamp: Date.now(),
                    loadTime: Date.now() - startTime,
                    success: false,
                    error: 'Web3 load timeout',
                    deviceInfo: this.deviceInfo
                };
                
                this.logMetric('web3Load', this.metrics.web3Load);
            } else {
                setTimeout(checkWeb3, 500);
            }
        };
        
        checkWeb3();
    }
    
    monitorNetworkPerformance() {
        // 监控RPC请求性能
        if (window.web3 && window.web3.eth) {
            const originalRequest = window.web3.currentProvider.send;
            
            window.web3.currentProvider.send = (payload, callback) => {
                const startTime = Date.now();
                
                return originalRequest.call(window.web3.currentProvider, payload, (error, result) => {
                    const endTime = Date.now();
                    
                    this.metrics.networkStats = {
                        sessionId: this.sessionId,
                        timestamp: Date.now(),
                        method: payload.method,
                        responseTime: endTime - startTime,
                        success: !error,
                        error: error ? error.message : null,
                        deviceInfo: this.deviceInfo
                    };
                    
                    this.logMetric('networkStats', this.metrics.networkStats);
                    
                    if (callback) callback(error, result);
                });
            };
        }
    }
    
    monitorUserInteractions() {
        // 监控关键用户交互
        const interactions = ['click', 'touchstart', 'touchend'];
        
        interactions.forEach(eventType => {
            document.addEventListener(eventType, (event) => {
                // 只记录重要元素的交互
                const target = event.target;
                if (target.matches('button, .btn, [onclick], .clickable')) {
                    this.logUserInteraction({
                        sessionId: this.sessionId,
                        timestamp: Date.now(),
                        type: eventType,
                        element: target.tagName,
                        className: target.className,
                        id: target.id,
                        text: target.textContent?.substring(0, 50),
                        deviceInfo: this.deviceInfo
                    });
                }
            });
        });
    }
    
    monitorErrors() {
        // 监控JavaScript错误
        window.addEventListener('error', (event) => {
            this.logError({
                sessionId: this.sessionId,
                timestamp: Date.now(),
                type: 'javascript',
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error ? event.error.stack : null,
                deviceInfo: this.deviceInfo
            });
        });
        
        // 监控Promise拒绝
        window.addEventListener('unhandledrejection', (event) => {
            this.logError({
                sessionId: this.sessionId,
                timestamp: Date.now(),
                type: 'promise',
                message: event.reason?.message || event.reason,
                stack: event.reason?.stack,
                deviceInfo: this.deviceInfo
            });
        });
    }
    
    // 记录交易性能
    logTransaction(txData) {
        const transactionMetric = {
            sessionId: this.sessionId,
            timestamp: Date.now(),
            txHash: txData.hash,
            gasUsed: txData.gasUsed,
            gasPrice: txData.gasPrice,
            status: txData.status,
            confirmationTime: txData.confirmationTime,
            retryCount: txData.retryCount || 0,
            walletType: this.getWalletType(),
            deviceInfo: this.deviceInfo
        };
        
        this.metrics.transactions.push(transactionMetric);
        this.logMetric('transaction', transactionMetric);
    }
    
    // 记录钱包连接性能
    logWalletConnection(connectionData) {
        const connectionMetric = {
            sessionId: this.sessionId,
            timestamp: Date.now(),
            walletType: connectionData.walletType,
            connectionTime: connectionData.connectionTime,
            success: connectionData.success,
            error: connectionData.error,
            deviceInfo: this.deviceInfo
        };
        
        this.metrics.walletConnections.push(connectionMetric);
        this.logMetric('walletConnection', connectionMetric);
    }
    
    getWalletType() {
        if (this.deviceInfo.isTPWallet) return 'TokenPocket';
        if (this.deviceInfo.isIMWallet) return 'imToken';
        if (this.deviceInfo.isBinanceWallet) return 'BinanceWallet';
        if (this.deviceInfo.isOKXWallet) return 'OKXWallet';
        return 'Unknown';
    }
    
    logMetric(type, data) {
        console.log(`📊 [${type}]`, data);
        
        if (this.config.enableLocalStorage) {
            this.saveToLocalStorage(type, data);
        }
        
        if (this.config.enableRemoteLogging) {
            this.sendToRemote(type, data);
        }
    }
    
    logUserInteraction(data) {
        this.metrics.userInteractions.push(data);
        this.logMetric('userInteraction', data);
    }
    
    logError(data) {
        this.metrics.errors.push(data);
        this.logMetric('error', data);
    }
    
    saveToLocalStorage(type, data) {
        try {
            const key = `mobile_metrics_${type}`;
            let stored = JSON.parse(localStorage.getItem(key) || '[]');
            
            stored.push(data);
            
            // 限制存储大小
            if (stored.length > this.config.maxStorageSize) {
                stored = stored.slice(-this.config.maxStorageSize);
            }
            
            localStorage.setItem(key, JSON.stringify(stored));
        } catch (error) {
            console.warn('📊 本地存储失败:', error);
        }
    }
    
    sendToRemote(type, data) {
        // 批量发送到远程服务器
        if (!this.pendingBatch) {
            this.pendingBatch = [];
        }
        
        this.pendingBatch.push({ type, data });
        
        if (this.pendingBatch.length >= this.config.batchSize) {
            this.flushBatch();
        }
    }
    
    flushBatch() {
        if (!this.pendingBatch || this.pendingBatch.length === 0) return;
        
        const batch = [...this.pendingBatch];
        this.pendingBatch = [];
        
        fetch(this.config.remoteEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sessionId: this.sessionId,
                deviceInfo: this.deviceInfo,
                metrics: batch,
                timestamp: Date.now()
            })
        }).catch(error => {
            console.warn('📊 远程日志发送失败:', error);
            // 失败的数据重新加入队列
            this.pendingBatch.unshift(...batch);
        });
    }
    
    startPeriodicUpload() {
        setInterval(() => {
            this.flushBatch();
        }, this.config.flushInterval);
    }
    
    setupUnloadHandler() {
        window.addEventListener('beforeunload', () => {
            this.flushBatch();
        });
    }
    
    // 获取性能报告
    getPerformanceReport() {
        return {
            sessionId: this.sessionId,
            deviceInfo: this.deviceInfo,
            metrics: this.metrics,
            summary: this.generateSummary()
        };
    }
    
    generateSummary() {
        return {
            pageLoadTime: this.metrics.pageLoad.loadTime,
            web3LoadTime: this.metrics.web3Load.loadTime,
            web3LoadSuccess: this.metrics.web3Load.success,
            transactionCount: this.metrics.transactions.length,
            errorCount: this.metrics.errors.length,
            interactionCount: this.metrics.userInteractions.length,
            walletType: this.getWalletType()
        };
    }
}

// 全局实例
window.mobilePerformanceMonitor = new MobilePerformanceMonitor();

// 导出监控函数供其他脚本使用
window.logTransaction = (txData) => window.mobilePerformanceMonitor.logTransaction(txData);
window.logWalletConnection = (connectionData) => window.mobilePerformanceMonitor.logWalletConnection(connectionData);
window.getPerformanceReport = () => window.mobilePerformanceMonitor.getPerformanceReport();

console.log('📊 移动端性能监控系统已加载');
