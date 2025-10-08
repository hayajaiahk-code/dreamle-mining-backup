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
                
                // 如果当前在platform页面，跳转到主页
                if (window.location.pathname.includes('platform.html')) {
                    console.log('🔄 检测到邀请链接，跳转到主页...');
                    window.location.href = '/index.html';
                    return;
                }
                
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
        
        // 多次尝试设置，确保页面元素已加载
        setTimeout(setupReferral, 1000);
        setTimeout(setupReferral, 3000);
        setTimeout(setupReferral, 5000);
        
        // 监听DOM变化，确保动态加载的元素也能被处理
        const observer = new MutationObserver(() => {
            setupReferral();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // 填入邀请人地址到相关输入框
    fillReferralAddress(address) {
        // 可能的邀请人地址输入框ID
        const possibleIds = [
            'referrerInput',      // 购买矿机页面的邀请人输入框
            'referralAddress',
            'inviterAddress',
            'referrer',
            'inviter',
            'referralInput',
            'inviterInput'
        ];
        
        // 查找并填入地址
        possibleIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.value = address;
                element.setAttribute('data-referral-locked', 'true');
                console.log(`✅ 已填入邀请人地址到 ${id}:`, address);
                
                // 触发change事件
                element.dispatchEvent(new Event('change', { bubbles: true }));
                element.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });
        
        // 查找包含"邀请"、"推荐"等关键词的输入框
        const allInputs = document.querySelectorAll('input[type="text"], input[type="email"], input');
        allInputs.forEach(input => {
            const label = input.previousElementSibling?.textContent || 
                         input.nextElementSibling?.textContent || 
                         input.placeholder || 
                         input.getAttribute('aria-label') || '';
            
            if (label.includes('邀请') || label.includes('推荐') || label.includes('referral') || 
                label.includes('inviter') || label.includes('ref') || label.includes('sponsor')) {
                input.value = address;
                input.setAttribute('data-referral-locked', 'true');
                console.log('✅ 已填入邀请人地址到相关输入框:', address);
                
                // 触发事件
                input.dispatchEvent(new Event('change', { bubbles: true }));
                input.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });
    }
    
    // 锁定邀请人地址字段，使其不可更改
    lockReferralField() {
        const lockedInputs = document.querySelectorAll('input[data-referral-locked="true"]');
        
        lockedInputs.forEach(input => {
            // 设置为只读
            input.readOnly = true;
            input.disabled = false; // 保持enabled状态以便提交表单
            
            // 添加样式表示已锁定
            input.style.backgroundColor = '#f8f9fa';
            input.style.border = '2px solid #28a745';
            input.style.color = '#28a745';
            input.style.fontWeight = 'bold';
            
            // 添加锁定图标或提示
            if (!input.nextElementSibling?.classList.contains('referral-lock-indicator')) {
                const lockIndicator = document.createElement('span');
                lockIndicator.className = 'referral-lock-indicator';
                lockIndicator.innerHTML = ' 🔒 已锁定';
                lockIndicator.style.color = '#28a745';
                lockIndicator.style.fontSize = '12px';
                lockIndicator.style.marginLeft = '5px';
                
                input.parentNode.insertBefore(lockIndicator, input.nextSibling);
            }
            
            // 防止用户修改
            input.addEventListener('keydown', (e) => {
                e.preventDefault();
                console.log('🔒 邀请人地址已锁定，无法修改');
            });
            
            input.addEventListener('paste', (e) => {
                e.preventDefault();
                console.log('🔒 邀请人地址已锁定，无法粘贴');
            });
            
            input.addEventListener('input', (e) => {
                e.preventDefault();
                console.log('🔒 邀请人地址已锁定，无法输入');
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
