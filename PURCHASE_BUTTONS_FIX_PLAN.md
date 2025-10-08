# 🔧 购买按钮修复方案

**问题**: 购买按钮功能混乱，中文文本，事件绑定不清晰  
**优先级**: 🔥🔥 高优先级

---

## 📋 问题总结

### 问题 1: 中文文本
- ❌ 当前: `(合约配置：USDT→DRM)`
- ✅ 需要: `(Contract: USDT→DRM)` 或 `(Token: USDT→DRM)`

### 问题 2: 按钮功能混乱

**当前按钮**:
1. `authorizeUsdtBtn` - 🔐 Authorize USDT
2. `purchaseUsdtBtn` - 💰 Buy with USDT (已弃用，但仍存在)
3. `oneClickPurchaseBtn` - ⚡ One-Click Authorize & Buy
4. `purchaseDrmBtn` - 💎 Buy with DRM

**问题**:
- `purchaseUsdtBtn` 和 `oneClickPurchaseBtn` 功能重复
- 没有明确的管理员购买按钮
- 事件绑定分散，难以维护

### 问题 3: 管理员购买逻辑

**当前逻辑**:
- 管理员购买逻辑在 `purchaseMiner()` 函数内部
- 通过 `isAdmin()` 检查自动切换
- 没有独立的管理员购买按钮

**问题**:
- 用户不知道自己是否会使用管理员购买
- 没有视觉反馈
- 管理员和普通用户使用相同按钮

---

## ✅ 修复方案

### 方案 1: 简化按钮结构（推荐）

**保留的按钮**:
1. `authorizeUsdtBtn` - 🔐 Authorize USDT（仅普通用户）
2. `oneClickPurchaseBtn` - ⚡ One-Click Authorize & Buy（普通用户）或 🎉 Admin Free Purchase（管理员）
3. `purchaseDrmBtn` - 💎 Buy with DRM

**移除的按钮**:
- `purchaseUsdtBtn` - 功能被 `oneClickPurchaseBtn` 替代

**动态按钮文本**:
```javascript
// 根据用户身份动态更新按钮文本
if (isAdmin) {
    oneClickPurchaseBtn.innerHTML = '🎉 Admin Free Purchase';
    oneClickPurchaseBtn.classList.add('admin-purchase-btn');
    authorizeUsdtBtn.style.display = 'none'; // 管理员不需要授权
} else {
    oneClickPurchaseBtn.innerHTML = '⚡ One-Click Authorize & Buy';
    oneClickPurchaseBtn.classList.remove('admin-purchase-btn');
    authorizeUsdtBtn.style.display = 'block';
}
```

### 方案 2: 分离管理员和普通用户按钮

**普通用户按钮**:
1. `authorizeUsdtBtn` - 🔐 Authorize USDT
2. `oneClickPurchaseBtn` - ⚡ One-Click Authorize & Buy
3. `purchaseDrmBtn` - 💎 Buy with DRM

**管理员按钮**:
1. `adminPurchaseBtn` - 🎉 Admin Free Purchase（新增）
2. `purchaseDrmBtn` - 💎 Buy with DRM

**显示逻辑**:
```javascript
if (isAdmin) {
    // 隐藏普通用户按钮
    authorizeUsdtBtn.style.display = 'none';
    oneClickPurchaseBtn.style.display = 'none';
    // 显示管理员按钮
    adminPurchaseBtn.style.display = 'block';
} else {
    // 显示普通用户按钮
    authorizeUsdtBtn.style.display = 'block';
    oneClickPurchaseBtn.style.display = 'block';
    // 隐藏管理员按钮
    adminPurchaseBtn.style.display = 'none';
}
```

---

## 🔧 实施步骤

### 步骤 1: 修改 HTML 结构（方案 1）

**文件**: `platform.html`  
**位置**: 第 3100-3117 行

**修改前**:
```html
<div class="card">
    <h3 class="card-title">💳 USDT Purchase</h3>
    <div class="stat-card" style="margin-bottom: 15px;">
        <div class="stat-value" id="usdtPrice">100 USDT</div>
        <div class="stat-label">Purchase Price</div>
    </div>
    <button class="btn secondary" id="authorizeUsdtBtn" style="width: 100%; margin-bottom: 8px; background: #17a2b8; color: white;">
        🔐 Authorize USDT
    </button>

    <button class="btn" id="purchaseUsdtBtn" style="width: 100%; margin-bottom: 8px;" title="Buy miner with USDT">
        <span id="usdtBtnText">💰 Buy with USDT</span>
        <small style="display: block; font-size: 10px; opacity: 0.7; margin-top: 2px;">(Recommended)</small>
    </button>
    <button class="btn primary" id="oneClickPurchaseBtn" style="width: 100%;">
        ⚡ One-Click Authorize & Buy
    </button>
</div>
```

**修改后**:
```html
<div class="card">
    <h3 class="card-title">💳 USDT Purchase</h3>
    <div class="stat-card" style="margin-bottom: 15px;">
        <div class="stat-value" id="usdtPrice">100 USDT</div>
        <div class="stat-label">Purchase Price</div>
    </div>
    
    <!-- 授权按钮（仅普通用户） -->
    <button class="btn secondary" id="authorizeUsdtBtn" style="width: 100%; margin-bottom: 8px; background: #17a2b8; color: white; display: none;">
        🔐 Authorize USDT
    </button>

    <!-- 主购买按钮（动态文本：普通用户/管理员） -->
    <button class="btn primary" id="oneClickPurchaseBtn" style="width: 100%;">
        ⚡ One-Click Authorize & Buy
    </button>
    
    <small style="display: block; font-size: 10px; opacity: 0.7; margin-top: 8px; text-align: center;">
        (Recommended for all users)
    </small>
</div>
```

### 步骤 2: 移除 purchaseUsdtBtn 事件绑定

**文件**: `platform.html`  
**位置**: 第 4297-4318 行

**删除这段代码**:
```javascript
// Purchase button event - with retry mechanism
const purchaseUsdtBtn = document.getElementById('purchaseUsdtBtn');
if (purchaseUsdtBtn) {
    purchaseUsdtBtn.addEventListener('click', async function() {
        console.log('🔘 USDT purchase button clicked');

        // Function call with retry
        async function tryPurchase(retries = 3) {
            if (typeof window.purchaseMiner === 'function') {
                const level = window.selectedLevel || 1;
                await window.purchaseMiner(level, 'USDT');
            } else if (retries > 0) {
                console.log(`⏳ purchaseMiner function not ready, retrying in ${retries} seconds...`);
                setTimeout(() => tryPurchase(retries - 1), 1000);
            } else {
                console.error('❌ purchaseMiner function not found');
                alert('Purchase function not ready, please refresh and try again');
            }
        }

        await tryPurchase();
    });
}
```

### 步骤 3: 添加动态按钮更新函数

**文件**: `platform.html`  
**位置**: 在 `<script>` 标签内添加

```javascript
/**
 * 根据用户身份更新购买按钮
 */
async function updatePurchaseButtons() {
    const authorizeUsdtBtn = document.getElementById('authorizeUsdtBtn');
    const oneClickPurchaseBtn = document.getElementById('oneClickPurchaseBtn');
    
    if (!authorizeUsdtBtn || !oneClickPurchaseBtn) {
        console.warn('⚠️ 购买按钮未找到');
        return;
    }
    
    // 检查是否是管理员
    let isAdminUser = false;
    if (window.isConnected && window.userAccount) {
        try {
            if (typeof window.isAdmin === 'function') {
                isAdminUser = await window.isAdmin(window.userAccount);
            }
        } catch (error) {
            console.warn('⚠️ 管理员检查失败:', error);
        }
    }
    
    console.log('🔍 用户身份检查:', { isAdmin: isAdminUser, account: window.userAccount });
    
    if (isAdminUser) {
        // 管理员模式
        console.log('🎉 管理员模式：显示免费购买按钮');
        
        // 隐藏授权按钮
        authorizeUsdtBtn.style.display = 'none';
        
        // 更新主按钮为管理员购买
        oneClickPurchaseBtn.innerHTML = '🎉 Admin Free Purchase';
        oneClickPurchaseBtn.classList.add('admin-purchase-btn');
        oneClickPurchaseBtn.title = 'Admin can purchase miners for free';
    } else {
        // 普通用户模式
        console.log('👤 普通用户模式：显示一键购买按钮');
        
        // 显示授权按钮
        authorizeUsdtBtn.style.display = 'block';
        
        // 更新主按钮为一键购买
        oneClickPurchaseBtn.innerHTML = '⚡ One-Click Authorize & Buy';
        oneClickPurchaseBtn.classList.remove('admin-purchase-btn');
        oneClickPurchaseBtn.title = 'Automatically authorize and purchase in one click';
    }
}

// 在钱包连接后调用
window.updatePurchaseButtons = updatePurchaseButtons;
```

### 步骤 4: 在钱包连接后调用更新函数

**文件**: `platform.html`  
**位置**: 在 `connectWallet` 成功后添加

```javascript
// 在钱包连接成功后
if (window.isConnected) {
    // 更新购买按钮
    if (typeof window.updatePurchaseButtons === 'function') {
        await window.updatePurchaseButtons();
    }
}
```

### 步骤 5: 修改 oneClickPurchase 函数调用

**文件**: `platform.html`  
**位置**: 第 4392-4414 行

**修改前**:
```javascript
// 一键授权购买按钮事件 - 带重试机制
const oneClickPurchaseBtn = document.getElementById('oneClickPurchaseBtn');
if (oneClickPurchaseBtn) {
    oneClickPurchaseBtn.addEventListener('click', async function() {
        console.log('🔘 一键授权购买按钮点击');

        // 带重试的函数调用
        async function tryOneClickPurchase(retries = 3) {
            if (typeof window.oneClickPurchase === 'function') {
                const level = window.selectedLevel || 1;
                await window.oneClickPurchase(level);
            } else if (retries > 0) {
                console.log(`⏳ oneClickPurchase 函数未就绪，${retries}秒后重试...`);
                setTimeout(() => tryOneClickPurchase(retries - 1), 1000);
            } else {
                console.error('❌ oneClickPurchase 函数未找到');
                alert('One-click purchase not ready, please refresh and try again');
            }
        }

        await tryOneClickPurchase();
    });
}
```

**修改后**:
```javascript
// 一键授权购买/管理员购买按钮事件 - 带重试机制
const oneClickPurchaseBtn = document.getElementById('oneClickPurchaseBtn');
if (oneClickPurchaseBtn) {
    oneClickPurchaseBtn.addEventListener('click', async function() {
        console.log('🔘 购买按钮点击');

        // 带重试的函数调用
        async function tryPurchase(retries = 3) {
            if (typeof window.oneClickPurchase === 'function') {
                const level = window.selectedLevel || 1;
                
                // 检查是否是管理员
                let isAdminUser = false;
                if (window.isConnected && window.userAccount && typeof window.isAdmin === 'function') {
                    try {
                        isAdminUser = await window.isAdmin(window.userAccount);
                    } catch (error) {
                        console.warn('⚠️ 管理员检查失败:', error);
                    }
                }
                
                if (isAdminUser) {
                    console.log('🎉 执行管理员免费购买');
                } else {
                    console.log('⚡ 执行一键授权购买');
                }
                
                // 调用统一的购买函数（内部会自动判断管理员）
                await window.oneClickPurchase(level);
            } else if (retries > 0) {
                console.log(`⏳ oneClickPurchase 函数未就绪，${retries}秒后重试...`);
                setTimeout(() => tryPurchase(retries - 1), 1000);
            } else {
                console.error('❌ oneClickPurchase 函数未找到');
                alert('Purchase function not ready, please refresh and try again');
            }
        }

        await tryPurchase();
    });
}
```

### 步骤 6: 修改 oneClickPurchase 函数（core-functions.js）

**文件**: `js/core-functions.js`  
**位置**: 第 3021-3045 行

**在函数开头添加管理员检测**:
```javascript
// 一键授权购买函数
async function oneClickPurchase(level) {
    try {
        // 🚨 重要：确保使用钱包 provider（修复移动端钱包购买失败）
        try {
            ensureWalletProvider();
        } catch (providerError) {
            console.error('❌ Provider 检查失败:', providerError);
            showMessage(providerError.message, 'error');
            throw providerError;
        }
        
        if (!isConnected || !userAccount) {
            await connectWallet();
            if (!isConnected) {
                throw new Error('请先连接钱包');
            }
        }

        if (!usdtContract || !unifiedContract) {
            throw new Error('合约未初始化，请刷新页面');
        }

        // 检查是否是管理员
        const isAdminUser = await isAdmin(userAccount);
        
        if (isAdminUser) {
            console.log('🎉 管理员模式：执行免费购买');
            showMessage('Admin free purchase...', 'info');
            
            // 管理员直接调用 purchaseMiner（内部会自动处理）
            return await purchaseMiner(level, 'USDT');
        } else {
            console.log('⚡ 普通用户模式：执行一键授权购买');
            showMessage('One-click authorize and purchase...', 'info');
            
            // 普通用户继续原有逻辑...
        }
        
        // ... 原有代码
    }
}
```

---

## 📊 修改文件清单

### 需要修改的文件

1. **platform.html**
   - 第 3100-3117 行：修改 HTML 结构，移除 `purchaseUsdtBtn`
   - 第 4297-4318 行：删除 `purchaseUsdtBtn` 事件绑定
   - 第 4392-4414 行：修改 `oneClickPurchaseBtn` 事件绑定
   - 添加 `updatePurchaseButtons()` 函数

2. **js/core-functions.js**
   - 第 3021-3045 行：修改 `oneClickPurchase()` 函数，添加管理员检测

---

## ✅ 预期效果

### 普通用户看到的按钮

```
💳 USDT Purchase
┌─────────────────────────────┐
│ 100 USDT                    │
│ Purchase Price              │
└─────────────────────────────┘

🔐 Authorize USDT

⚡ One-Click Authorize & Buy

(Recommended for all users)
```

### 管理员看到的按钮

```
💳 USDT Purchase
┌─────────────────────────────┐
│ 100 USDT                    │
│ Purchase Price              │
└─────────────────────────────┘

🎉 Admin Free Purchase
(带绿色渐变背景和脉冲动画)

(Recommended for all users)
```

---

## 🎯 测试清单

### 普通用户测试

- [ ] 连接钱包后，显示"🔐 Authorize USDT"按钮
- [ ] 显示"⚡ One-Click Authorize & Buy"按钮
- [ ] 点击一键购买，自动检查授权并购买
- [ ] 不再出现 `eth_sendTransaction` 错误
- [ ] 所有 DApp 钱包都能正常购买

### 管理员测试

- [ ] 连接钱包后，隐藏"🔐 Authorize USDT"按钮
- [ ] 显示"🎉 Admin Free Purchase"按钮（绿色渐变）
- [ ] 点击管理员购买，直接免费购买
- [ ] 不需要授权 USDT
- [ ] 购买成功

---

**状态**: 📝 待实施  
**预计时间**: 30-45 分钟  
**优先级**: 🔥🔥 高优先级

