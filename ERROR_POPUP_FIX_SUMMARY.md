# 🔧 购买错误弹窗重复问题修复

**问题**: 购买出错时会弹出 4-5 次错误提示  
**原因**: 多层错误处理都调用了 alert  
**状态**: ✅ 已修复

---

## 🐛 问题分析

### 原因

购买失败时，错误会经过多层处理，每层都显示弹窗：

```javascript
// 第 1 次弹窗
window.mobileWalletFix.showWalletError(error, '购买矿机');
  ↓ 调用 showMessage(message, 'error')
  ↓ 调用 alert('Error: ' + message)

// 第 2 次弹窗
showMessage(errorMessage, 'error');
  ↓ 调用 alert('Error: ' + errorMessage)

// 第 3 次弹窗（如果有管理员购买）
window.mobileWalletFix.showWalletError(adminError, '管理员购买');
  ↓ 又调用 alert

// 第 4-5 次弹窗（如果有重试逻辑）
每次重试失败都会再次调用 showMessage
```

---

## ✅ 修复方案

### 1. 添加防抖机制到 `showMessage`

**文件**: `js/core-functions.js` (第 2490-2529 行)

```javascript
// 防止重复弹窗的缓存
let lastMessageCache = {
    message: '',
    type: '',
    timestamp: 0
};

// 显示消息（带防抖机制）
function showMessage(message, type = 'info') {
    console.log(`${type.toUpperCase()}: ${message}`);
    
    // 防抖：如果相同消息在 2 秒内已显示过，则跳过
    const now = Date.now();
    const cacheKey = `${type}:${message}`;
    const lastKey = `${lastMessageCache.type}:${lastMessageCache.message}`;
    
    if (cacheKey === lastKey && (now - lastMessageCache.timestamp) < 2000) {
        console.log('⏭️ 跳过重复消息:', message);
        return;
    }
    
    // 更新缓存
    lastMessageCache = {
        message: message,
        type: type,
        timestamp: now
    };
    
    // 优先使用通知系统
    if (typeof showNotification === 'function') {
        showNotification(message, type);
    } else {
        // 降级到 alert
        if (type === 'error') {
            alert('Error: ' + message);
        } else if (type === 'success') {
            alert('Success: ' + message);
        }
    }
}
```

**效果**:
- ✅ 相同消息在 2 秒内只显示一次
- ✅ 优先使用通知系统（不阻塞页面）
- ✅ 降级到 alert（兼容性）

---

### 2. 移除 `purchaseMiner` 中的重复调用

**文件**: `js/core-functions.js` (第 1452-1478 行)

**修改前**:
```javascript
} catch (error) {
    console.error('❌ 购买失败:', error);

    // 第 1 次弹窗
    if (window.mobileWalletFix) {
        window.mobileWalletFix.showWalletError(error, '购买矿机');
    }

    // 第 2 次弹窗
    showMessage(errorMessage, 'error');
    throw error;
}
```

**修改后**:
```javascript
} catch (error) {
    console.error('❌ 购买失败:', error);

    // 提供更好的错误信息
    let errorMessage = 'Purchase failed';
    // ... 错误信息处理 ...

    // 只显示一次错误消息（showMessage 内部有防抖机制）
    showMessage(errorMessage, 'error');
    throw error;
}
```

**效果**:
- ✅ 移除了 `mobileWalletFix.showWalletError` 的调用
- ✅ 只调用一次 `showMessage`

---

### 3. 修改 `showWalletError` 为只返回消息

**文件**: `js/mobile-wallet-fix.js` (第 171-181 行)

**修改前**:
```javascript
function showWalletError(error, context = '') {
    const currentWallet = WALLET_DETECTION.getCurrentWallet();
    const optimizedMessage = getOptimizedErrorMessage(error, currentWallet);
    
    console.error(`❌ 钱包错误 [${currentWallet}] ${context}:`, error);
    
    // 自动显示弹窗
    if (typeof window.showMessage === 'function') {
        window.showMessage(optimizedMessage, 'error');
    } else {
        alert(optimizedMessage);
    }
}
```

**修改后**:
```javascript
function showWalletError(error, context = '') {
    const currentWallet = WALLET_DETECTION.getCurrentWallet();
    const optimizedMessage = getOptimizedErrorMessage(error, currentWallet);
    
    console.error(`❌ 钱包错误 [${currentWallet}] ${context}:`, error);
    
    // 只记录日志，不显示弹窗（由调用方决定是否显示）
    // 这样可以避免重复弹窗
    return optimizedMessage;
}
```

**效果**:
- ✅ 不再自动显示弹窗
- ✅ 只返回优化后的错误消息
- ✅ 由调用方决定是否显示

---

### 4. 修复管理员购买的错误处理

**文件**: `js/core-functions.js` (第 1362-1375 行)

**修改前**:
```javascript
} catch (adminError) {
    console.error('❌ 管理员购买失败:', adminError);

    // 又一次弹窗
    if (window.mobileWalletFix) {
        window.mobileWalletFix.showWalletError(adminError, '管理员购买');
    }

    throw new Error(`Admin purchase failed: ${adminError.message || adminError}`);
}
```

**修改后**:
```javascript
} catch (adminError) {
    console.error('❌ 管理员购买失败:', adminError);

    // 获取优化后的错误消息（不显示弹窗）
    let errorMsg = `Admin purchase failed: ${adminError.message || adminError}`;
    if (window.mobileWalletFix) {
        const optimizedMsg = window.mobileWalletFix.showWalletError(adminError, '管理员购买');
        if (optimizedMsg) {
            errorMsg = optimizedMsg;
        }
    }

    throw new Error(errorMsg);
}
```

**效果**:
- ✅ 不再自动弹窗
- ✅ 只获取优化后的错误消息
- ✅ 错误会被外层的 catch 捕获并显示一次

---

## 📊 修复效果对比

### 修复前

```
用户点击购买 → 出错
  ↓
弹窗 1: mobileWalletFix.showWalletError() → alert
  ↓
弹窗 2: showMessage() → alert
  ↓
弹窗 3: 管理员购买错误 → alert
  ↓
弹窗 4: 重试失败 → alert
  ↓
弹窗 5: 最终错误 → alert

结果: 用户需要点击 4-5 次才能关闭所有弹窗 ❌
```

### 修复后

```
用户点击购买 → 出错
  ↓
showMessage() 检查缓存
  ↓
如果 2 秒内未显示过相同消息
  ↓
显示通知（不阻塞）或 alert（一次）
  ↓
其他重复调用被防抖机制拦截

结果: 用户只看到 1 次错误提示 ✅
```

---

## 🧪 测试方法

### 1. 测试购买失败（余额不足）

```javascript
// 在控制台测试
await purchaseMiner(1, 'USDT');
```

**预期结果**:
- ✅ 只弹出 1 次错误提示
- ✅ 控制台显示完整错误日志
- ✅ 2 秒内不会重复弹窗

---

### 2. 测试用户取消交易

```javascript
// 点击购买按钮，然后在钱包中点击"拒绝"
```

**预期结果**:
- ✅ 只显示 1 次 "用户取消了交易"
- ✅ 不会重复弹窗

---

### 3. 测试网络错误

```javascript
// 断开网络后点击购买
```

**预期结果**:
- ✅ 只显示 1 次网络错误
- ✅ 不会重复弹窗

---

## 📝 修改的文件

| 文件 | 修改内容 | 行数 |
|------|---------|------|
| `js/core-functions.js` | 添加防抖机制到 `showMessage` | 2490-2529 |
| `js/core-functions.js` | 移除 `purchaseMiner` 中的重复调用 | 1452-1478 |
| `js/core-functions.js` | 修复管理员购买错误处理 | 1362-1375 |
| `js/mobile-wallet-fix.js` | 修改 `showWalletError` 为只返回消息 | 171-181 |

---

## ✅ 修复完成

### 改进总结

1. ✅ **防抖机制** - 相同消息 2 秒内只显示一次
2. ✅ **移除重复调用** - 每个错误只处理一次
3. ✅ **优化通知系统** - 优先使用非阻塞通知
4. ✅ **保留日志** - 控制台仍显示完整错误信息

### 用户体验提升

- **修复前**: 点击 4-5 次关闭弹窗 ❌
- **修复后**: 只看到 1 次错误提示 ✅

---

## 🎯 建议

### 进一步优化（可选）

1. **使用 Toast 通知**
   - 替换 alert 为非阻塞的 Toast
   - 自动消失，不需要用户点击

2. **错误分类**
   - 用户取消：不显示错误（只记录日志）
   - 余额不足：显示友好提示
   - 网络错误：显示重试按钮

3. **添加错误恢复**
   - 自动重试机制
   - 提供解决方案链接

---

**修复状态**: ✅ 已完成  
**测试建议**: 清除浏览器缓存后测试购买功能  
**预期效果**: 错误只弹出 1 次，不再重复

