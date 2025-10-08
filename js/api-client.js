/**
 * API 客户端
 * 用于与后端 API 服务器通信
 */

class APIClient {
    constructor(baseURL = '') {
        // 如果没有指定 baseURL，使用当前域名
        this.baseURL = baseURL || window.location.origin;
        this.cache = new Map();
        this.cacheDuration = 30000; // 30秒缓存
    }

    /**
     * 发送 HTTP 请求
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return data;

        } catch (error) {
            console.error(`❌ API 请求失败 [${endpoint}]:`, error);
            throw error;
        }
    }

    /**
     * GET 请求（带缓存）
     */
    async get(endpoint, useCache = true) {
        // 检查缓存
        if (useCache) {
            const cached = this.getCache(endpoint);
            if (cached) {
                console.log(`✅ 使用缓存: ${endpoint}`);
                return cached;
            }
        }

        const data = await this.request(endpoint, { method: 'GET' });
        
        // 设置缓存
        if (useCache && data.success) {
            this.setCache(endpoint, data);
        }

        return data;
    }

    /**
     * POST 请求
     */
    async post(endpoint, body) {
        return await this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    }

    /**
     * 获取缓存
     */
    getCache(key) {
        if (this.cache.has(key)) {
            const { data, timestamp } = this.cache.get(key);
            if (Date.now() - timestamp < this.cacheDuration) {
                return data;
            }
            this.cache.delete(key);
        }
        return null;
    }

    /**
     * 设置缓存
     */
    setCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    /**
     * 清除缓存
     */
    clearCache() {
        this.cache.clear();
        console.log('🧹 本地缓存已清除');
    }

    // ==================== API 方法 ====================

    /**
     * 获取配置信息
     */
    async getConfig() {
        return await this.get('/api/config');
    }

    /**
     * 获取网络统计
     */
    async getNetworkStats() {
        return await this.get('/api/network/stats');
    }

    /**
     * 获取用户余额
     */
    async getUserBalance(address) {
        return await this.get(`/api/user/${address}/balance`);
    }

    /**
     * 获取用户矿机列表
     */
    async getUserMiners(address) {
        return await this.get(`/api/user/${address}/miners`);
    }

    /**
     * 清除服务器缓存
     */
    async clearServerCache() {
        return await this.post('/api/cache/clear', {});
    }

    /**
     * 获取缓存统计
     */
    async getCacheStats() {
        return await this.get('/api/cache/stats', false);
    }

    /**
     * RPC 代理请求
     */
    async rpcCall(method, params = []) {
        return await this.post('/api/rpc/proxy', {
            jsonrpc: '2.0',
            method: method,
            params: params,
            id: Date.now()
        });
    }

    /**
     * 健康检查
     */
    async healthCheck() {
        return await this.get('/api/health', false);
    }
}

// 创建全局实例
window.apiClient = new APIClient();

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APIClient;
}

console.log('✅ API 客户端已加载');

