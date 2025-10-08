/**
 * 自动清理本地存储
 * 确保每次打开页面都是全新状态
 */

(function() {
    'use strict';
    
    console.log('🧹 自动清理本地存储模块加载...');
    
    // 配置：是否启用自动清理
    const AUTO_CLEAR_ENABLED = true;
    
    // 配置：需要保留的键（白名单）
    const WHITELIST_KEYS = [
        // 如果需要保留某些数据，在这里添加
        // 例如: 'user_language', 'theme_preference'
    ];
    
    /**
     * 清理所有本地存储
     */
    function clearAllStorage() {
        try {
            console.log('🧹 开始清理本地存储...');
            
            // 1. 清理 localStorage
            if (WHITELIST_KEYS.length > 0) {
                // 保存白名单数据
                const savedData = {};
                WHITELIST_KEYS.forEach(key => {
                    const value = localStorage.getItem(key);
                    if (value !== null) {
                        savedData[key] = value;
                    }
                });
                
                // 清空所有数据
                localStorage.clear();
                
                // 恢复白名单数据
                Object.keys(savedData).forEach(key => {
                    localStorage.setItem(key, savedData[key]);
                });
                
                console.log('✅ localStorage 已清理（保留白名单）');
            } else {
                // 完全清空
                localStorage.clear();
                console.log('✅ localStorage 已完全清空');
            }
            
            // 2. 清理 sessionStorage
            sessionStorage.clear();
            console.log('✅ sessionStorage 已清空');
            
            // 3. 清理 cookies（可选）
            clearAllCookies();
            
            // 4. 清理 IndexedDB（可选）
            clearIndexedDB();
            
            console.log('🎉 本地存储清理完成！');
            
        } catch (error) {
            console.error('❌ 清理本地存储失败:', error);
        }
    }
    
    /**
     * 清理所有 cookies
     */
    function clearAllCookies() {
        try {
            const cookies = document.cookie.split(";");
            
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i];
                const eqPos = cookie.indexOf("=");
                const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
            }
            
            console.log('✅ Cookies 已清空');
        } catch (error) {
            console.warn('⚠️ 清理 cookies 失败:', error);
        }
    }
    
    /**
     * 清理 IndexedDB
     */
    function clearIndexedDB() {
        try {
            if (window.indexedDB) {
                indexedDB.databases().then(databases => {
                    databases.forEach(db => {
                        indexedDB.deleteDatabase(db.name);
                        console.log(`🗑️ 删除 IndexedDB: ${db.name}`);
                    });
                }).catch(error => {
                    console.warn('⚠️ 清理 IndexedDB 失败:', error);
                });
            }
        } catch (error) {
            console.warn('⚠️ 清理 IndexedDB 失败:', error);
        }
    }
    
    /**
     * 显示清理状态
     */
    function showClearStatus() {
        const storageInfo = {
            localStorage: localStorage.length,
            sessionStorage: sessionStorage.length,
            cookies: document.cookie.split(';').filter(c => c.trim()).length
        };
        
        console.log('📊 当前存储状态:', storageInfo);
        
        if (storageInfo.localStorage === 0 && 
            storageInfo.sessionStorage === 0 && 
            storageInfo.cookies === 0) {
            console.log('✅ 存储已完全清空');
        } else {
            console.log('⚠️ 存储未完全清空');
        }
    }
    
    /**
     * 页面加载时自动清理
     */
    function autoCleanOnLoad() {
        // 🔧 修复：DApp 浏览器中禁用自动清理（防止触发刷新）
        const isDAppBrowser = !!(window.BinanceChain || window.okxwallet || window.okex || window.trustwallet);

        if (isDAppBrowser) {
            console.log('📱 DApp 浏览器检测到，跳过自动清理存储（防止触发问题）');
            return;
        }

        if (!AUTO_CLEAR_ENABLED) {
            console.log('ℹ️ 自动清理已禁用');
            return;
        }

        console.log('🚀 页面加载，执行自动清理...');

        // 清理存储
        clearAllStorage();

        // 显示状态
        setTimeout(() => {
            showClearStatus();
        }, 100);
    }
    
    /**
     * 页面卸载时清理（可选）
     */
    function cleanOnUnload() {
        console.log('👋 页面卸载，清理存储...');
        clearAllStorage();
    }
    
    // 导出到全局
    window.autoClearStorage = {
        clearAllStorage,
        clearAllCookies,
        clearIndexedDB,
        showClearStatus,
        enabled: AUTO_CLEAR_ENABLED
    };
    
    // 页面加载时自动清理
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', autoCleanOnLoad);
    } else {
        autoCleanOnLoad();
    }
    
    // 页面卸载时清理（可选，可能影响用户体验）
    // window.addEventListener('beforeunload', cleanOnUnload);
    
    console.log('✅ 自动清理本地存储模块加载完成');
    
})();

