// 邀请系统处理脚本
console.log('🔗 邀请系统加载中...');

class ReferralSystem {
    constructor() {
        this.REFERRAL_KEY = 'dreamle_referral_address';
        this.REFERRAL_EXPIRY_KEY = 'dreamle_referral_expiry';
        this.REFERRAL_EXPIRY_DAYS = 30; // 邀请链接30天有效期
        
        this.init();
    }
    
    init() {
        console.log('🚀 初始化邀请系统...');
        
        // 检查当前页面是否有邀请参数
        this.checkReferralParams();
        
        // 如果在platform页面，设置邀请人地址
        if (window.location.pathname.includes('platform.html')) {
            this.setupReferralInPlatform();
        }
    }
    
    // 检查URL中的邀请参数
    checkReferralParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const refAddress = urlParams.get('ref');

        if (refAddress) {
            console.log('🔍 检测到邀请链接:', refAddress);

            // 验证地址格式
            if (this.isValidAddress(refAddress)) {
                // 保存邀请人地址到localStorage
                this.saveReferralAddress(refAddress);

                // 🔧 FIX: 移除跳转逻辑，允许在 platform.html 直接填充
                // 移动端钱包需要在当前页面完成自动填充，不能跳转
                console.log('✅ 邀请人地址已保存:', refAddress);
            } else {
                console.warn('⚠️ 无效的邀请地址格式:', refAddress);
            }
        }
    }
    
    // 验证以太坊地址格式
    isValidAddress(address) {
        return /^0x[a-fA-F0-9]{40}$/.test(address);
    }
    
    // 保存邀请人地址
    saveReferralAddress(address) {
        const expiryTime = Date.now() + (this.REFERRAL_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
        
        localStorage.setItem(this.REFERRAL_KEY, address.toLowerCase());
        localStorage.setItem(this.REFERRAL_EXPIRY_KEY, expiryTime.toString());
        
        console.log('💾 邀请人地址已保存到本地存储');
        console.log('📅 有效期至:', new Date(expiryTime).toLocaleString());
    }
    
    // 获取保存的邀请人地址
    getReferralAddress() {
        const address = localStorage.getItem(this.REFERRAL_KEY);
        const expiry = localStorage.getItem(this.REFERRAL_EXPIRY_KEY);
        
        if (!address || !expiry) {
            return null;
        }
        
        // 检查是否过期
        if (Date.now() > parseInt(expiry)) {
            console.log('⏰ 邀请链接已过期，清除数据');
            this.clearReferralData();
            return null;
        }
        
        return address;
    }
    
    // 清除邀请数据
    clearReferralData() {
        localStorage.removeItem(this.REFERRAL_KEY);
        localStorage.removeItem(this.REFERRAL_EXPIRY_KEY);
    }
    
    // 在platform页面设置邀请人地址
    setupReferralInPlatform() {
        console.log('🔧 在平台页面设置邀请系统...');

        // 等待页面加载完成
        const setupReferral = () => {
            const referralAddress = this.getReferralAddress();

            if (referralAddress) {
                console.log('🎯 找到邀请人地址:', referralAddress);
                this.fillReferralAddress(referralAddress);
                this.lockReferralField();
            } else {
                console.log('ℹ️ 没有找到邀请人地址');
            }
        };

        // 增强的多次尝试设置，特别针对移动端钱包（币安、欧意、TP、imToken）
        // 这些钱包的 DApp 浏览器可能需要更长的加载时间
        const retryIntervals = [500, 1000, 2000, 3000, 5000, 7000, 10000];
        retryIntervals.forEach(interval => {
            setTimeout(setupReferral, interval);
        });

        // 监听DOM变化，确保动态加载的元素也能被处理
        // 特别针对移动端钱包的延迟渲染
        const observer = new MutationObserver((mutations) => {
            // 检查是否有新的输入框被添加
            let hasNewInputs = false;
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        if (node.tagName === 'INPUT' || node.querySelector('input')) {
                            hasNewInputs = true;
                        }
                    }
                });
            });

            if (hasNewInputs) {
                console.log('🔄 检测到新的输入框，重新设置邀请地址...');
                setTimeout(setupReferral, 100);
                setTimeout(setupReferral, 500);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 监听页面可见性变化（移动端钱包切换时）
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                console.log('📱 页面重新可见，重新设置邀请地址...');
                setTimeout(setupReferral, 500);
            }
        });

        // 监听页面焦点变化（移动端钱包返回时）
        window.addEventListener('focus', () => {
            console.log('🔍 页面获得焦点，重新设置邀请地址...');
            setTimeout(setupReferral, 500);
        });
    }
    
    // 填入邀请人地址到相关输入框
    fillReferralAddress(address) {
        let filledCount = 0;

        // 可能的邀请人地址输入框ID（扩展列表）
        const possibleIds = [
            'referrerInput',      // 购买矿机页面的邀请人输入框
            'referralAddress',
            'inviterAddress',
            'referrer',
            'inviter',
            'referralInput',
            'inviterInput',
            'referrerAddress',
            'sponsorAddress',
            'refAddress'
        ];

        // 查找并填入地址（通过ID）
        possibleIds.forEach(id => {
            const element = document.getElementById(id);
            if (element && element.tagName === 'INPUT') {
                if (!element.value || element.value === '' || element.getAttribute('data-referral-locked') !== 'true') {
                    element.value = address;
                    element.setAttribute('data-referral-locked', 'true');
                    console.log(`✅ 已填入邀请人地址到 #${id}:`, address);
                    filledCount++;

                    // 触发多种事件，确保兼容性
                    this.triggerInputEvents(element);
                }
            }
        });

        // 查找包含"邀请"、"推荐"、"Referrer"等关键词的输入框
        const allInputs = document.querySelectorAll('input[type="text"], input[type="email"], input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]):not([type="button"])');

        allInputs.forEach(input => {
            // 跳过已经填写的输入框
            if (input.getAttribute('data-referral-locked') === 'true') {
                return;
            }

            // 收集所有可能的标签文本
            const labelTexts = [];

            // 1. 检查 label 标签
            const labelElement = input.closest('label') || document.querySelector(`label[for="${input.id}"]`);
            if (labelElement) {
                labelTexts.push(labelElement.textContent.toLowerCase());
            }

            // 2. 检查前后兄弟元素
            if (input.previousElementSibling) {
                labelTexts.push(input.previousElementSibling.textContent.toLowerCase());
            }
            if (input.nextElementSibling) {
                labelTexts.push(input.nextElementSibling.textContent.toLowerCase());
            }

            // 3. 检查父元素
            if (input.parentElement) {
                labelTexts.push(input.parentElement.textContent.toLowerCase());
            }

            // 4. 检查 placeholder 和其他属性
            labelTexts.push((input.placeholder || '').toLowerCase());
            labelTexts.push((input.getAttribute('aria-label') || '').toLowerCase());
            labelTexts.push((input.getAttribute('name') || '').toLowerCase());
            labelTexts.push((input.id || '').toLowerCase());
            labelTexts.push((input.className || '').toLowerCase());

            // 合并所有文本
            const combinedText = labelTexts.join(' ');

            // 扩展的关键词列表（中英文）
            const keywords = [
                '邀请', '推荐', '引荐', '介绍人',
                'referr', 'invit', 'sponsor', 'ref',
                'introducer', 'recommender',
                'referrer address', 'inviter address',
                'required' // 有些表单标记为 "Referrer Address (Required)"
            ];

            // 检查是否匹配关键词
            const isReferralField = keywords.some(keyword => combinedText.includes(keyword));

            // 额外检查：如果输入框要求以太坊地址格式
            const isAddressField = combinedText.includes('address') ||
                                  combinedText.includes('地址') ||
                                  (input.placeholder && input.placeholder.includes('0x'));

            if (isReferralField && isAddressField) {
                if (!input.value || input.value === '') {
                    input.value = address;
                    input.setAttribute('data-referral-locked', 'true');
                    console.log('✅ 已填入邀请人地址到匹配的输入框:', {
                        id: input.id,
                        name: input.name,
                        placeholder: input.placeholder,
                        matchedText: combinedText.substring(0, 100)
                    });
                    filledCount++;

                    // 触发事件
                    this.triggerInputEvents(input);
                }
            }
        });

        console.log(`📊 邀请地址填写统计: 成功填写 ${filledCount} 个输入框`);

        // 如果没有找到任何输入框，记录警告
        if (filledCount === 0) {
            console.warn('⚠️ 未找到邀请人地址输入框，可能页面还未完全加载');
        }
    }

    // 触发输入框的各种事件，确保兼容性
    triggerInputEvents(element) {
        const events = ['input', 'change', 'blur', 'keyup'];
        events.forEach(eventType => {
            const event = new Event(eventType, { bubbles: true, cancelable: true });
            element.dispatchEvent(event);
        });

        // 对于某些框架（如 React），可能需要触发原生事件
        try {
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            nativeInputValueSetter.call(element, element.value);
            const inputEvent = new Event('input', { bubbles: true });
            element.dispatchEvent(inputEvent);
        } catch (e) {
            // 忽略错误
        }
    }
    
    // 锁定邀请人地址字段，使其不可更改
    lockReferralField() {
        const lockedInputs = document.querySelectorAll('input[data-referral-locked="true"]');

        lockedInputs.forEach(input => {
            // 如果已经处理过，跳过
            if (input.getAttribute('data-referral-lock-processed') === 'true') {
                return;
            }

            // 标记为已处理
            input.setAttribute('data-referral-lock-processed', 'true');

            // 保存原始值
            const lockedValue = input.value;

            // 设置为只读
            input.readOnly = true;
            input.disabled = false; // 保持enabled状态以便提交表单

            // 添加样式表示已锁定（兼容移动端）
            input.style.backgroundColor = '#e8f5e9';
            input.style.border = '2px solid #28a745';
            input.style.color = '#1b5e20';
            input.style.fontWeight = 'bold';
            input.style.cursor = 'not-allowed';
            input.style.opacity = '0.9';

            // 添加锁定图标或提示（检查是否已存在）
            if (!input.nextElementSibling?.classList.contains('referral-lock-indicator')) {
                const lockIndicator = document.createElement('span');
                lockIndicator.className = 'referral-lock-indicator';
                lockIndicator.innerHTML = ' 🔒 已锁定';
                lockIndicator.style.color = '#28a745';
                lockIndicator.style.fontSize = '12px';
                lockIndicator.style.marginLeft = '5px';
                lockIndicator.style.fontWeight = 'bold';

                // 尝试插入到合适的位置
                if (input.parentNode) {
                    input.parentNode.insertBefore(lockIndicator, input.nextSibling);
                }
            }

            // 防止用户修改 - 使用更强的事件监听
            const preventModification = (e) => {
                e.preventDefault();
                e.stopPropagation();
                // 恢复原始值
                if (input.value !== lockedValue) {
                    input.value = lockedValue;
                }
                console.log('🔒 邀请人地址已锁定，无法修改');
                return false;
            };

            // 监听多种事件
            ['keydown', 'keypress', 'keyup', 'paste', 'cut', 'drop', 'input', 'change'].forEach(eventType => {
                input.addEventListener(eventType, preventModification, true);
            });

            // 定期检查值是否被修改（防止通过 JavaScript 修改）
            setInterval(() => {
                if (input.value !== lockedValue && input.getAttribute('data-referral-locked') === 'true') {
                    console.warn('⚠️ 检测到邀请地址被修改，恢复原值');
                    input.value = lockedValue;
                }
            }, 1000);

            // 添加点击提示
            input.addEventListener('click', () => {
                console.log('💡 提示：邀请人地址已自动填写并锁定');
            });
        });

        console.log(`🔒 已锁定 ${lockedInputs.length} 个邀请人地址字段`);
    }
    
    // 获取当前邀请人信息（供其他脚本调用）
    getCurrentReferralInfo() {
        const address = this.getReferralAddress();
        const expiry = localStorage.getItem(this.REFERRAL_EXPIRY_KEY);
        
        return {
            address: address,
            isValid: !!address,
            expiryTime: expiry ? new Date(parseInt(expiry)) : null,
            daysRemaining: expiry ? Math.ceil((parseInt(expiry) - Date.now()) / (24 * 60 * 60 * 1000)) : 0
        };
    }
    
    // 生成邀请链接（供邀请人使用）
    generateReferralLink(referrerAddress, targetPage = 'platform.html') {
        const baseUrl = window.location.origin;
        return `${baseUrl}/${targetPage}?ref=${referrerAddress}`;
    }
}

// 创建全局邀请系统实例
window.referralSystem = new ReferralSystem();

// 导出常用函数
window.getReferralAddress = () => window.referralSystem.getReferralAddress();
window.getCurrentReferralInfo = () => window.referralSystem.getCurrentReferralInfo();
window.generateReferralLink = (address, page) => window.referralSystem.generateReferralLink(address, page);

console.log('✅ 邀请系统加载完成');
