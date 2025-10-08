# 🔍 推荐人验证机制实施方案

**需求**: 填写的推荐人地址必须是已购买过矿机的用户  
**优先级**: 🔥🔥 高优先级

---

## 📋 当前问题

### 问题 1: 没有推荐人验证
- ❌ 当前只检查地址格式是否正确
- ❌ 不检查推荐人是否购买过矿机
- ❌ 任何地址都可以作为推荐人

### 问题 2: 管理员地址作为默认推荐人
- ✅ 管理员地址: `0xfC3b7735Dae4C7AB3Ab85Ffa9987661e795B74b7`
- ✅ 管理员已有 5 台矿机
- ✅ 可以作为有效推荐人

### 问题 3: 钱包连接问题
- ⚠️ 悬浮钱包（FAB）可能需要优化
- ⚠️ 需要确保钱包连接后正确初始化

---

## ✅ 解决方案

### 方案 1: 添加推荐人矿机数量验证（推荐）

**原理**: 在购买前检查推荐人是否拥有至少 1 台矿机

**实施步骤**:

#### A. 添加验证函数

```javascript
/**
 * 验证推荐人是否有效（是否购买过矿机）
 * @param {string} referrerAddress - 推荐人地址
 * @returns {Promise<{valid: boolean, minerCount: number, reason: string}>}
 */
async function validateReferrer(referrerAddress) {
    try {
        // 零地址始终有效（管理员可以使用）
        if (referrerAddress === '0x0000000000000000000000000000000000000000') {
            return {
                valid: true,
                minerCount: 0,
                reason: 'Zero address (admin only)'
            };
        }
        
        // 检查地址格式
        if (!window.web3.utils.isAddress(referrerAddress)) {
            return {
                valid: false,
                minerCount: 0,
                reason: 'Invalid address format'
            };
        }
        
        // 检查推荐人是否是管理员
        const isReferrerAdmin = await isAdmin(referrerAddress);
        if (isReferrerAdmin) {
            console.log('✅ 推荐人是管理员，自动通过验证');
            return {
                valid: true,
                minerCount: -1, // 管理员不需要检查矿机数量
                reason: 'Referrer is admin'
            };
        }
        
        // 获取推荐人的矿机数量
        console.log('🔍 检查推荐人矿机数量:', referrerAddress);
        
        // 方法 1: 通过 getMiningData 获取矿机数量
        let minerCount = 0;
        try {
            const miningData = await unifiedContract.methods.getMiningData(referrerAddress).call();
            if (miningData && miningData.length > 5) {
                minerCount = parseInt(miningData[5]); // minerCount 在索引 5
                console.log(`📊 推荐人矿机数量（getMiningData）: ${minerCount}`);
            }
        } catch (error) {
            console.warn('⚠️ getMiningData 失败，尝试其他方法:', error);
        }
        
        // 方法 2: 如果方法 1 失败，尝试遍历获取
        if (minerCount === 0) {
            try {
                const userMiners = await getUserMinersFixed(referrerAddress);
                minerCount = userMiners.length;
                console.log(`📊 推荐人矿机数量（遍历）: ${minerCount}`);
            } catch (error) {
                console.warn('⚠️ 遍历获取矿机失败:', error);
            }
        }
        
        // 验证结果
        if (minerCount > 0) {
            console.log(`✅ 推荐人验证通过: ${referrerAddress} 拥有 ${minerCount} 台矿机`);
            return {
                valid: true,
                minerCount: minerCount,
                reason: `Referrer has ${minerCount} miner(s)`
            };
        } else {
            console.warn(`❌ 推荐人验证失败: ${referrerAddress} 没有矿机`);
            return {
                valid: false,
                minerCount: 0,
                reason: 'Referrer has no miners'
            };
        }
        
    } catch (error) {
        console.error('❌ 推荐人验证出错:', error);
        return {
            valid: false,
            minerCount: 0,
            reason: `Validation error: ${error.message}`
        };
    }
}
```

#### B. 在购买函数中调用验证

**位置**: `purchaseWithUSDT()` 和 `oneClickPurchase()` 函数中

```javascript
// 在确定推荐人地址后，购买前添加验证
console.log(`🔗 最终使用推荐人: ${referrerAddress}`);

// 🚨 新增：验证推荐人是否有效
console.log('🔍 验证推荐人是否购买过矿机...');
const validation = await validateReferrer(referrerAddress);

if (!validation.valid) {
    const errorMsg = `Invalid referrer: ${validation.reason}. The referrer must have purchased at least one miner.`;
    console.error('❌', errorMsg);
    showMessage(errorMsg, 'error');
    throw new Error(errorMsg);
}

console.log(`✅ 推荐人验证通过: ${validation.reason}`);

// 继续购买流程...
```

---

## 🔧 实施细节

### 修改文件清单

1. **js/core-functions.js**
   - 添加 `validateReferrer()` 函数
   - 在 `purchaseWithUSDT()` 中添加验证（第 1750 行后）
   - 在 `purchaseWithDRM()` 中添加验证（第 1961 行后）
   - 在 `oneClickPurchase()` 中添加验证（第 3180 行后）

### 特殊情况处理

#### 1. 管理员作为推荐人
```javascript
// 管理员地址始终有效
if (isReferrerAdmin) {
    return { valid: true, minerCount: -1, reason: 'Referrer is admin' };
}
```

#### 2. 零地址（仅管理员可用）
```javascript
// 零地址只有管理员可以使用
if (referrerAddress === '0x0000000000000000000000000000000000000000') {
    // 检查当前用户是否是管理员
    const isUserAdmin = await isAdmin(userAccount);
    if (isUserAdmin) {
        return { valid: true, minerCount: 0, reason: 'Zero address (admin only)' };
    } else {
        return { valid: false, minerCount: 0, reason: 'Zero address only for admin' };
    }
}
```

#### 3. 默认管理员地址
```javascript
// 默认管理员地址: 0xfC3b7735Dae4C7AB3Ab85Ffa9987661e795B74b7
// 已有 5 台矿机，始终有效
```

---

## 📱 悬浮钱包（FAB）优化

### 当前 FAB 功能

**位置**: `platform.html` 第 4756-4776 行

```javascript
connectWalletAction.addEventListener('click', async function() {
    if (window.connectWallet && typeof window.connectWallet === 'function') {
        try {
            const result = await window.connectWallet();
            console.log('✅ Wallet connected via FAB:', result);

            // Update FAB icon to show connected state
            if (result) {
                connectWalletAction.innerHTML = `...`;
                
                // 更新购买按钮（根据用户身份）
                if (typeof window.updatePurchaseButtons === 'function') {
                    setTimeout(() => {
                        window.updatePurchaseButtons();
                    }, 500);
                }
            }
        } catch (error) {
            console.error('❌ FAB wallet connection failed:', error);
        }
    }
});
```

### 需要优化的地方

#### 1. 添加连接状态检查

```javascript
// 在 FAB 点击前检查是否已连接
if (window.isConnected && window.userAccount) {
    console.log('✅ 钱包已连接:', window.userAccount);
    // 显示已连接状态
    return;
}
```

#### 2. 添加错误处理

```javascript
catch (error) {
    console.error('❌ FAB wallet connection failed:', error);
    
    // 显示友好的错误消息
    if (error.message.includes('User rejected')) {
        showMessage('Wallet connection cancelled', 'warning');
    } else {
        showMessage('Wallet connection failed, please try again', 'error');
    }
}
```

#### 3. 添加加载状态

```javascript
// 连接前显示加载状态
connectWalletAction.innerHTML = `
    <svg class="fab-action-icon spinning" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
    </svg>
    <span>Connecting...</span>
`;
```

---

## 🎯 用户体验优化

### 1. 推荐人输入框提示

**位置**: `platform.html` 推荐人输入框

**添加提示**:
```html
<input 
    type="text" 
    id="referrerInput" 
    placeholder="Enter referrer address (must have purchased miners)"
    title="The referrer must have purchased at least one miner"
/>
<small style="color: #888; font-size: 11px;">
    ⚠️ Referrer must have purchased at least one miner
</small>
```

### 2. 实时验证反馈

```javascript
// 在输入框失去焦点时验证
referrerInput.addEventListener('blur', async function() {
    const address = this.value.trim();
    if (address && window.web3.utils.isAddress(address)) {
        console.log('🔍 验证推荐人地址:', address);
        
        // 显示验证中状态
        showMessage('Validating referrer...', 'info');
        
        const validation = await validateReferrer(address);
        
        if (validation.valid) {
            showMessage(`✅ Valid referrer (${validation.minerCount} miners)`, 'success');
            this.style.borderColor = '#00ff88';
        } else {
            showMessage(`❌ Invalid referrer: ${validation.reason}`, 'error');
            this.style.borderColor = '#ff4444';
        }
    }
});
```

### 3. 管理员地址自动验证

```javascript
// 如果使用默认管理员地址，自动显示验证通过
if (referrerAddress === '0xfC3b7735Dae4C7AB3Ab85Ffa9987661e795B74b7') {
    console.log('✅ 使用默认管理员地址（已有 5 台矿机）');
    showMessage('Using default admin referrer (verified)', 'success');
}
```

---

## 📊 测试清单

### 推荐人验证测试

- [ ] 使用有矿机的地址作为推荐人 → 购买成功
- [ ] 使用没有矿机的地址作为推荐人 → 显示错误
- [ ] 使用管理员地址作为推荐人 → 购买成功
- [ ] 使用零地址（管理员） → 购买成功
- [ ] 使用零地址（普通用户） → 显示错误
- [ ] 使用无效地址格式 → 显示错误

### FAB 钱包连接测试

- [ ] 点击 FAB 连接钱包 → 成功连接
- [ ] 连接后显示已连接状态
- [ ] 连接后自动更新购买按钮
- [ ] 连接失败显示错误消息
- [ ] 用户取消连接显示提示

### 用户体验测试

- [ ] 输入推荐人地址后自动验证
- [ ] 验证通过显示绿色边框
- [ ] 验证失败显示红色边框
- [ ] 显示推荐人矿机数量
- [ ] 错误消息清晰易懂

---

## 🎉 预期效果

### 修复前

```
❌ 任何地址都可以作为推荐人
❌ 没有验证推荐人是否购买过矿机
❌ 可能导致推荐系统被滥用
```

### 修复后

```
✅ 只有购买过矿机的用户才能作为推荐人
✅ 管理员地址始终有效
✅ 实时验证反馈
✅ 清晰的错误提示
✅ 防止推荐系统被滥用
```

---

**状态**: 📝 待实施  
**预计时间**: 45-60 分钟  
**优先级**: 🔥🔥 高优先级

