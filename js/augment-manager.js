/**
 * Augment 管理中心 JavaScript
 * 提供扩展管理、SSH服务器管理等功能
 */

class AugmentManager {
    constructor() {
        this.extensions = JSON.parse(localStorage.getItem('augment-extensions') || '[]');
        this.servers = JSON.parse(localStorage.getItem('ssh-servers') || '[]');
        this.settings = JSON.parse(localStorage.getItem('augment-settings') || '{}');
        this.aiConfig = JSON.parse(localStorage.getItem('ai-config') || '{}');
        this.chatHistory = JSON.parse(localStorage.getItem('chat-history') || '[]');
        this.logs = [];
        this.isConnected = false;
        this.isGenerating = false;
        this.messageCount = 0;
        this.tokenCount = 0;

        this.initializeDefaults();
        this.startStatusCheck();
        this.loadData();
        this.loadChatHistory();
    }

    initializeDefaults() {
        // 默认设置
        if (!this.settings.apiEndpoint) {
            this.settings.apiEndpoint = 'http://localhost:8080';
        }
        if (!this.settings.reconnectInterval) {
            this.settings.reconnectInterval = 30;
        }
        if (!this.settings.logLevel) {
            this.settings.logLevel = 'info';
        }

        // 默认AI配置
        if (!this.aiConfig.model) {
            this.aiConfig.model = 'claude-3-sonnet';
        }
        if (!this.aiConfig.systemPrompt) {
            this.aiConfig.systemPrompt = '你是一个专业的编程助手，擅长帮助用户解决代码问题、提供技术建议和优化方案。';
        }
        if (!this.aiConfig.apiEndpoint) {
            this.aiConfig.apiEndpoint = 'http://localhost:8083/api/chat';
        }

        // 示例扩展数据
        if (this.extensions.length === 0) {
            this.extensions = [
                {
                    id: 'augment-core',
                    name: 'Augment Core',
                    version: '1.0.0',
                    status: 'enabled',
                    description: 'Augment 核心扩展'
                },
                {
                    id: 'augment-vscode',
                    name: 'Augment VS Code Extension',
                    version: '0.9.5',
                    status: 'disabled',
                    description: 'VS Code 集成扩展'
                }
            ];
        }

        // 示例服务器数据
        if (this.servers.length === 0) {
            this.servers = [
                {
                    id: 'server-1',
                    name: '开发服务器',
                    host: '192.168.1.100',
                    port: 22,
                    user: 'root',
                    status: 'disconnected',
                    lastConnected: null
                }
            ];
        }
    }

    // 日志记录
    log(message, type = 'info') {
        const timestamp = new Date().toLocaleString();
        const logEntry = {
            timestamp,
            message,
            type
        };
        
        this.logs.unshift(logEntry);
        if (this.logs.length > 1000) {
            this.logs = this.logs.slice(0, 1000);
        }
        
        this.updateLogDisplay();
        console.log(`[${type.toUpperCase()}] ${message}`);
    }

    // 更新日志显示
    updateLogDisplay() {
        const logContainer = document.getElementById('logContainer');
        if (!logContainer) return;

        logContainer.innerHTML = this.logs.map(log => 
            `<div class="log-entry ${log.type}">
                [${log.timestamp}] ${log.message}
            </div>`
        ).join('');
        
        logContainer.scrollTop = 0;
    }

    // 状态检查
    async startStatusCheck() {
        setInterval(async () => {
            try {
                const response = await fetch(`${this.settings.apiEndpoint}/health`, {
                    method: 'GET',
                    timeout: 5000
                });
                
                this.isConnected = response.ok;
                this.updateStatusIndicator();
                
                if (this.isConnected && !this.wasConnected) {
                    this.log('Augment 服务连接成功', 'success');
                }
                this.wasConnected = this.isConnected;
                
            } catch (error) {
                this.isConnected = false;
                this.updateStatusIndicator();
                
                if (this.wasConnected) {
                    this.log('Augment 服务连接失败: ' + error.message, 'error');
                }
                this.wasConnected = this.isConnected;
            }
        }, this.settings.reconnectInterval * 1000);
    }

    // 更新状态指示器
    updateStatusIndicator() {
        const indicator = document.getElementById('statusIndicator');
        if (indicator) {
            indicator.className = `status-indicator ${this.isConnected ? 'online' : 'offline'}`;
        }
    }

    // 加载数据到界面
    loadData() {
        this.updateExtensionsList();
        this.updateServersList();
        this.updateServerSelect();
        this.updateExtensionStats();
        this.loadSettings();
    }

    // 更新扩展列表
    updateExtensionsList() {
        const container = document.getElementById('extensionsList');
        if (!container) return;

        if (this.extensions.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #7f8c8d;">暂无已安装的扩展</p>';
            return;
        }

        container.innerHTML = this.extensions.map(ext => `
            <div class="extension-item">
                <div class="extension-info">
                    <div class="extension-name">${ext.name}</div>
                    <div style="font-size: 12px; color: #7f8c8d;">
                        版本: ${ext.version} | ID: ${ext.id}
                    </div>
                    <div style="font-size: 12px; color: #7f8c8d; margin-top: 5px;">
                        ${ext.description || '无描述'}
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span class="extension-status status-${ext.status}">
                        ${ext.status === 'enabled' ? '已启用' : '已禁用'}
                    </span>
                    <button class="btn ${ext.status === 'enabled' ? 'danger' : 'success'}" 
                            onclick="manager.toggleExtension('${ext.id}')">
                        ${ext.status === 'enabled' ? '禁用' : '启用'}
                    </button>
                    <button class="btn danger" onclick="manager.uninstallExtension('${ext.id}')">
                        卸载
                    </button>
                </div>
            </div>
        `).join('');
    }

    // 更新服务器列表
    updateServersList() {
        const container = document.getElementById('serversList');
        if (!container) return;

        if (this.servers.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #7f8c8d;">暂无配置的服务器</p>';
            return;
        }

        container.innerHTML = this.servers.map(server => `
            <div class="server-item">
                <div class="server-info">
                    <div class="server-name">${server.name}</div>
                    <div style="font-size: 12px; color: #7f8c8d;">
                        ${server.user}@${server.host}:${server.port}
                    </div>
                    <div style="font-size: 12px; color: #7f8c8d; margin-top: 5px;">
                        最后连接: ${server.lastConnected || '从未连接'}
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span class="server-status status-${server.status}">
                        ${server.status === 'connected' ? '已连接' : '未连接'}
                    </span>
                    <button class="btn" onclick="manager.connectServer('${server.id}')">
                        连接
                    </button>
                    <button class="btn" onclick="manager.testServerConnection('${server.id}')">
                        测试
                    </button>
                    <button class="btn danger" onclick="manager.removeServer('${server.id}')">
                        删除
                    </button>
                </div>
            </div>
        `).join('');
    }

    // 更新服务器选择下拉框
    updateServerSelect() {
        const select = document.getElementById('serverSelect');
        if (!select) return;

        select.innerHTML = '<option value="">选择一个服务器...</option>' +
            this.servers.map(server => 
                `<option value="${server.id}">${server.name} (${server.host})</option>`
            ).join('');
    }

    // 更新扩展统计
    updateExtensionStats() {
        const enabledCount = this.extensions.filter(ext => ext.status === 'enabled').length;
        const disabledCount = this.extensions.filter(ext => ext.status === 'disabled').length;

        const enabledEl = document.getElementById('enabledCount');
        const disabledEl = document.getElementById('disabledCount');

        if (enabledEl) enabledEl.textContent = enabledCount;
        if (disabledEl) disabledEl.textContent = disabledCount;
    }

    // 加载设置到界面
    loadSettings() {
        const apiEndpoint = document.getElementById('apiEndpoint');
        const reconnectInterval = document.getElementById('reconnectInterval');
        const logLevel = document.getElementById('logLevel');

        if (apiEndpoint) apiEndpoint.value = this.settings.apiEndpoint;
        if (reconnectInterval) reconnectInterval.value = this.settings.reconnectInterval;
        if (logLevel) logLevel.value = this.settings.logLevel;

        // 加载AI配置
        const aiModelSelect = document.getElementById('aiModelSelect');
        const apiKey = document.getElementById('apiKey');
        const systemPrompt = document.getElementById('systemPrompt');

        if (aiModelSelect) aiModelSelect.value = this.aiConfig.model || 'claude-3-sonnet';
        if (apiKey) apiKey.value = this.aiConfig.apiKey || '';
        if (systemPrompt) systemPrompt.value = this.aiConfig.systemPrompt || '你是一个专业的编程助手，擅长帮助用户解决代码问题、提供技术建议和优化方案。';
    }

    // 保存数据到本地存储
    saveData() {
        localStorage.setItem('augment-extensions', JSON.stringify(this.extensions));
        localStorage.setItem('ssh-servers', JSON.stringify(this.servers));
        localStorage.setItem('augment-settings', JSON.stringify(this.settings));
        localStorage.setItem('ai-config', JSON.stringify(this.aiConfig));
    }

    // 安装扩展
    async installExtension() {
        const input = document.getElementById('extensionInput');
        const extensionName = input.value.trim();
        
        if (!extensionName) {
            alert('请输入扩展名称或URL');
            return;
        }

        this.log(`开始安装扩展: ${extensionName}`, 'info');

        try {
            // 模拟安装过程
            const newExtension = {
                id: `ext-${Date.now()}`,
                name: extensionName,
                version: '1.0.0',
                status: 'installing',
                description: '正在安装...'
            };

            this.extensions.push(newExtension);
            this.updateExtensionsList();
            this.updateExtensionStats();

            // 模拟安装延迟
            setTimeout(() => {
                const ext = this.extensions.find(e => e.id === newExtension.id);
                if (ext) {
                    ext.status = 'enabled';
                    ext.description = '安装成功';
                    this.updateExtensionsList();
                    this.updateExtensionStats();
                    this.saveData();
                    this.log(`扩展安装成功: ${extensionName}`, 'success');
                }
            }, 2000);

            input.value = '';

        } catch (error) {
            this.log(`扩展安装失败: ${error.message}`, 'error');
        }
    }

    // 切换扩展状态
    toggleExtension(extensionId) {
        const extension = this.extensions.find(ext => ext.id === extensionId);
        if (!extension) return;

        extension.status = extension.status === 'enabled' ? 'disabled' : 'enabled';
        this.updateExtensionsList();
        this.updateExtensionStats();
        this.saveData();
        
        this.log(`扩展 ${extension.name} 已${extension.status === 'enabled' ? '启用' : '禁用'}`, 'info');
    }

    // 卸载扩展
    uninstallExtension(extensionId) {
        const extension = this.extensions.find(ext => ext.id === extensionId);
        if (!extension) return;

        if (confirm(`确定要卸载扩展 "${extension.name}" 吗？`)) {
            this.extensions = this.extensions.filter(ext => ext.id !== extensionId);
            this.updateExtensionsList();
            this.updateExtensionStats();
            this.saveData();
            
            this.log(`扩展 ${extension.name} 已卸载`, 'warning');
        }
    }

    // 添加服务器
    addServer() {
        const name = document.getElementById('serverName').value.trim();
        const host = document.getElementById('serverHost').value.trim();
        const port = document.getElementById('serverPort').value.trim();
        const user = document.getElementById('serverUser').value.trim();

        if (!name || !host || !port || !user) {
            alert('请填写所有服务器信息');
            return;
        }

        const newServer = {
            id: `server-${Date.now()}`,
            name,
            host,
            port: parseInt(port),
            user,
            status: 'disconnected',
            lastConnected: null
        };

        this.servers.push(newServer);
        this.updateServersList();
        this.updateServerSelect();
        this.saveData();

        // 清空表单
        document.getElementById('serverName').value = '';
        document.getElementById('serverHost').value = '';
        document.getElementById('serverPort').value = '22';
        document.getElementById('serverUser').value = '';

        this.log(`服务器 ${name} 已添加`, 'success');
    }

    // 连接服务器
    async connectServer(serverId) {
        const server = this.servers.find(s => s.id === serverId);
        if (!server) return;

        this.log(`正在连接服务器: ${server.name}`, 'info');

        try {
            // 模拟连接过程
            server.status = 'connecting';
            this.updateServersList();

            // 这里应该实现真实的SSH连接逻辑
            setTimeout(() => {
                server.status = 'connected';
                server.lastConnected = new Date().toLocaleString();
                this.updateServersList();
                this.saveData();
                this.log(`服务器 ${server.name} 连接成功`, 'success');
            }, 2000);

        } catch (error) {
            server.status = 'disconnected';
            this.updateServersList();
            this.log(`服务器连接失败: ${error.message}`, 'error');
        }
    }

    // 测试服务器连接
    async testServerConnection(serverId) {
        const server = this.servers.find(s => s.id === serverId);
        if (!server) return;

        this.log(`测试服务器连接: ${server.name}`, 'info');

        try {
            // 模拟连接测试
            const success = Math.random() > 0.3; // 70% 成功率
            
            setTimeout(() => {
                if (success) {
                    this.log(`服务器 ${server.name} 连接测试成功`, 'success');
                } else {
                    this.log(`服务器 ${server.name} 连接测试失败`, 'error');
                }
            }, 1000);

        } catch (error) {
            this.log(`连接测试失败: ${error.message}`, 'error');
        }
    }

    // 删除服务器
    removeServer(serverId) {
        const server = this.servers.find(s => s.id === serverId);
        if (!server) return;

        if (confirm(`确定要删除服务器 "${server.name}" 吗？`)) {
            this.servers = this.servers.filter(s => s.id !== serverId);
            this.updateServersList();
            this.updateServerSelect();
            this.saveData();
            
            this.log(`服务器 ${server.name} 已删除`, 'warning');
        }
    }

    // 保存设置
    saveSettings() {
        const apiEndpoint = document.getElementById('apiEndpoint').value;
        const reconnectInterval = document.getElementById('reconnectInterval').value;
        const logLevel = document.getElementById('logLevel').value;

        this.settings.apiEndpoint = apiEndpoint;
        this.settings.reconnectInterval = parseInt(reconnectInterval);
        this.settings.logLevel = logLevel;

        this.saveData();
        this.log('设置已保存', 'success');
    }

    // 重启 Augment
    async restartAugment() {
        this.log('正在重启 Augment 服务...', 'info');
        
        try {
            // 这里应该实现真实的重启逻辑
            setTimeout(() => {
                this.log('Augment 服务重启成功', 'success');
            }, 3000);
        } catch (error) {
            this.log(`重启失败: ${error.message}`, 'error');
        }
    }

    // 清除缓存
    clearCache() {
        if (confirm('确定要清除所有缓存吗？这将删除所有本地数据。')) {
            localStorage.clear();
            this.log('缓存已清除', 'warning');
            location.reload();
        }
    }

    // 导出配置
    exportConfig() {
        const config = {
            extensions: this.extensions,
            servers: this.servers,
            settings: this.settings,
            exportTime: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `augment-config-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.log('配置已导出', 'success');
    }

    // 导入配置
    importConfig() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const config = JSON.parse(e.target.result);
                    
                    if (config.extensions) this.extensions = config.extensions;
                    if (config.servers) this.servers = config.servers;
                    if (config.settings) this.settings = config.settings;

                    this.saveData();
                    this.loadData();
                    this.log('配置导入成功', 'success');
                } catch (error) {
                    this.log(`配置导入失败: ${error.message}`, 'error');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    // 清除日志
    clearLogs() {
        this.logs = [];
        this.updateLogDisplay();
        this.log('日志已清除', 'info');
    }

    // 下载日志
    downloadLogs() {
        const logText = this.logs.map(log => 
            `[${log.timestamp}] [${log.type.toUpperCase()}] ${log.message}`
        ).join('\n');

        const blob = new Blob([logText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `augment-logs-${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        URL.revokeObjectURL(url);

        this.log('日志已下载', 'success');
    }

    // 刷新日志
    refreshLogs() {
        this.updateLogDisplay();
        this.log('日志已刷新', 'info');
    }

    // ==================== AI对话功能 ====================

    // 加载聊天历史
    loadChatHistory() {
        const chatContainer = document.getElementById('chatContainer');
        if (!chatContainer) return;

        // 清空容器
        chatContainer.innerHTML = '';

        // 添加系统欢迎消息
        if (this.chatHistory.length === 0) {
            this.addSystemMessage('你好！我是你的AI编程助手。我可以帮助你解决代码问题、提供技术建议和优化方案。请告诉我你需要什么帮助！');
        } else {
            // 加载历史消息
            this.chatHistory.forEach(message => {
                this.displayMessage(message.role, message.content, message.timestamp);
            });
        }

        this.updateChatStats();
        this.scrollToBottom();
    }

    // 显示消息
    displayMessage(role, content, timestamp = null) {
        const chatContainer = document.getElementById('chatContainer');
        if (!chatContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${role}`;

        const time = timestamp || new Date().toLocaleTimeString();
        const sender = role === 'user' ? '👤 用户' :
                      role === 'assistant' ? '🤖 AI助手' :
                      '🔧 系统';

        messageDiv.innerHTML = `
            <div class="message-header">
                <span class="sender">${sender}</span>
                <span class="timestamp">${time}</span>
            </div>
            <div class="message-content">${this.formatMessage(content)}</div>
        `;

        chatContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    // 格式化消息内容
    formatMessage(content) {
        // 处理代码块
        content = content.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');

        // 处理行内代码
        content = content.replace(/`([^`]+)`/g, '<code>$1</code>');

        // 处理换行
        content = content.replace(/\n/g, '<br>');

        return content;
    }

    // 添加系统消息
    addSystemMessage(content) {
        this.displayMessage('system', content);
    }

    // 滚动到底部
    scrollToBottom() {
        const chatContainer = document.getElementById('chatContainer');
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }

    // 更新聊天统计
    updateChatStats() {
        const messageCountEl = document.getElementById('messageCount');
        const tokenCountEl = document.getElementById('tokenCount');

        if (messageCountEl) messageCountEl.textContent = this.chatHistory.length;
        if (tokenCountEl) tokenCountEl.textContent = this.tokenCount;
    }

    // 保存AI配置
    saveAIConfig() {
        const model = document.getElementById('aiModelSelect').value;
        const apiKey = document.getElementById('apiKey').value;
        const systemPrompt = document.getElementById('systemPrompt').value;

        this.aiConfig.model = model;
        this.aiConfig.apiKey = apiKey;
        this.aiConfig.systemPrompt = systemPrompt;

        localStorage.setItem('ai-config', JSON.stringify(this.aiConfig));
        this.log('AI配置已保存', 'success');
    }

    // 测试AI连接
    async testAIConnection() {
        this.log('测试AI连接...', 'info');

        try {
            const response = await fetch(`${this.aiConfig.apiEndpoint}/test`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: this.aiConfig.model,
                    apiKey: this.aiConfig.apiKey
                })
            });

            if (response.ok) {
                this.log('AI连接测试成功', 'success');
                this.addSystemMessage('AI连接测试成功！可以开始对话了。');
            } else {
                this.log('AI连接测试失败', 'error');
                this.addSystemMessage('AI连接测试失败，请检查配置。');
            }
        } catch (error) {
            this.log(`AI连接测试失败: ${error.message}`, 'error');
            this.addSystemMessage('AI连接测试失败，请检查网络和配置。');
        }
    }

    // 发送消息
    async sendMessage() {
        const chatInput = document.getElementById('chatInput');
        const message = chatInput.value.trim();

        if (!message || this.isGenerating) return;

        // 显示用户消息
        this.displayMessage('user', message);

        // 添加到历史记录
        this.chatHistory.push({
            role: 'user',
            content: message,
            timestamp: new Date().toLocaleTimeString()
        });

        // 清空输入框
        chatInput.value = '';

        // 显示正在输入指示器
        this.showTypingIndicator();

        try {
            this.isGenerating = true;

            // 发送到AI API
            const response = await this.callAI(message);

            // 隐藏输入指示器
            this.hideTypingIndicator();

            // 显示AI回复
            this.displayMessage('assistant', response);

            // 添加到历史记录
            this.chatHistory.push({
                role: 'assistant',
                content: response,
                timestamp: new Date().toLocaleTimeString()
            });

            // 更新统计
            this.messageCount = this.chatHistory.length;
            this.updateChatStats();

            // 保存历史记录
            localStorage.setItem('chat-history', JSON.stringify(this.chatHistory));

        } catch (error) {
            this.hideTypingIndicator();
            this.log(`AI对话失败: ${error.message}`, 'error');
            this.addSystemMessage(`对话失败: ${error.message}`);
        } finally {
            this.isGenerating = false;
        }
    }

    // 调用AI API
    async callAI(message) {
        // 构建对话上下文
        const messages = [
            { role: 'system', content: this.aiConfig.systemPrompt },
            ...this.chatHistory.slice(-10), // 只取最近10条消息作为上下文
            { role: 'user', content: message }
        ];

        const response = await fetch(`${this.aiConfig.apiEndpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.aiConfig.apiKey}`
            },
            body: JSON.stringify({
                model: this.aiConfig.model,
                messages: messages,
                max_tokens: 2000,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status}`);
        }

        const data = await response.json();

        // 更新token计数
        if (data.usage) {
            this.tokenCount += data.usage.total_tokens || 0;
        }

        return data.choices[0].message.content;
    }

    // 显示输入指示器
    showTypingIndicator() {
        const chatContainer = document.getElementById('chatContainer');
        if (!chatContainer) return;

        const typingDiv = document.createElement('div');
        typingDiv.id = 'typingIndicator';
        typingDiv.className = 'chat-message assistant';
        typingDiv.innerHTML = `
            <div class="message-header">
                <span class="sender">🤖 AI助手</span>
                <span class="timestamp">${new Date().toLocaleTimeString()}</span>
            </div>
            <div class="message-content">
                <div class="typing-indicator">
                    正在思考
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;

        chatContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }

    // 隐藏输入指示器
    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // 停止生成
    stopGeneration() {
        this.isGenerating = false;
        this.hideTypingIndicator();
        this.addSystemMessage('已停止生成');
        this.log('已停止AI生成', 'info');
    }

    // 清空对话
    clearChat() {
        if (confirm('确定要清空所有对话记录吗？')) {
            this.chatHistory = [];
            this.messageCount = 0;
            this.tokenCount = 0;

            localStorage.removeItem('chat-history');
            this.loadChatHistory();
            this.updateChatStats();

            this.log('对话记录已清空', 'warning');
        }
    }
}

// 全局函数
function switchTab(tabName) {
    // 移除所有活动状态
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    // 激活选中的标签
    event.target.classList.add('active');
    document.getElementById(tabName).classList.add('active');
}

// 全局管理器实例
let manager;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    manager = new AugmentManager();
    manager.log('Augment 管理中心已启动', 'success');

    // 添加键盘事件监听
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                manager.sendMessage();
            }
        });
    }
});

// AI对话相关的全局函数
function saveAIConfig() {
    if (manager) manager.saveAIConfig();
}

function testAIConnection() {
    if (manager) manager.testAIConnection();
}

function sendMessage() {
    if (manager) manager.sendMessage();
}

function stopGeneration() {
    if (manager) manager.stopGeneration();
}

function clearChat() {
    if (manager) manager.clearChat();
}

function addServer() {
    if (manager) manager.addServer();
}

function connectToServer() {
    const select = document.getElementById('serverSelect');
    const serverId = select.value;
    if (serverId && manager) {
        manager.connectServer(serverId);
    }
}

function testConnection() {
    const select = document.getElementById('serverSelect');
    const serverId = select.value;
    if (serverId && manager) {
        manager.testServerConnection(serverId);
    }
}

// 导出函数供HTML调用
window.manager = manager;
window.switchTab = switchTab;
window.saveAIConfig = saveAIConfig;
window.testAIConnection = testAIConnection;
window.sendMessage = sendMessage;
window.stopGeneration = stopGeneration;
window.clearChat = clearChat;
window.addServer = addServer;
window.connectToServer = connectToServer;
window.testConnection = testConnection;
