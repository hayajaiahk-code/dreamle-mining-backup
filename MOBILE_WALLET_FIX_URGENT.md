# 🚨 紧急修复：移动端钱包购买失败

**错误**: `the method eth_sendTransaction does not exist/is not available`  
**影响**: 所有移动端钱包（欧易、币安、TP、IM）  
**优先级**: 🔥🔥🔥 最高优先级

---

## 🔍 问题根源

### 错误信息

```
Returned error: the method eth_sendTransaction does not exist/is not available
```

### 根本原因

**Web3 实例使用了错误的 provider！**

1. **正确的方式**（支持交易）:
   ```javascript
   window.web3 = new Web3(window.ethereum); // 使用钱包的 provider ✅
   ```

2. **错误的方式**（不支持交易）:
   ```javascript
   window.web3 = new Web3('https://bsc-rpc.publicnode.com'); // 使用 RPC URL ❌
   ```

### 为什么会出现这个问题？

查看 `js/core-functions.js` 第 1138-1166 行：

```javascript
} catch (error) {
    console.error('❌ Web3初始化失败:', error);
    // 如果MetaMask初始化失败，尝试使用最佳RPC ❌ 这里是问题！
    try {
        if (typeof window.getBestRPC === 'function') {
            const bestRPC = await window.getBestRPC();
            window.web3 = new window.Web3(bestRPC); // ❌ 使用 RPC URL
            // ...
        }
    }
}
```

**问题**:
- 当 `window.ethereum` 初始化失败时
- 代码回退到使用 RPC URL
- RPC URL 只能用于查询，不能发送交易
- 导致 `.send()` 方法失败

---

## ✅ 解决方案

### 方案 1: 确保始终使用钱包 Provider（推荐）

**原则**:
- 交易必须使用 `window.ethereum`
- RPC URL 只用于查询
- 不要在交易时回退到 RPC

**修改 `js/core-functions.js`**:

```javascript
// 第 1138-1170 行
} catch (error) {
    console.error('❌ Web3初始化失败:', error);
    
    // ❌ 删除：不要回退到 RPC URL
    // ✅ 添加：必须使用钱包 provider
    if (!window.ethereum) {
        showMessage('请安装钱包（MetaMask、欧易、币安等）', 'error');
        return false;
    }
    
    // 重试使用钱包 provider
    try {
        window.web3 = new window.Web3(window.ethereum);
        console.log('✅ Web3 初始化完成 (重试成功)');
    } catch (retryError) {
        console.error('❌ Web3重试也失败:', retryError);
        showMessage('钱包连接失败，请刷新页面重试', 'error');
        return false;
    }
}
```

### 方案 2: 分离查询和交易的 Web3 实例

**原则**:
- `window.web3` - 用于交易（必须使用 `window.ethereum`）
- `window.web3Query` - 用于查询（可以使用 RPC URL）

**修改**:

```javascript
// 交易专用 Web3（必须使用钱包 provider）
if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    console.log('✅ 交易 Web3 初始化完成');
} else {
    throw new Error('未检测到钱包');
}

// 查询专用 Web3（可以使用 RPC URL）
const bestRPC = await getBestRPC();
window.web3Query = new Web3(bestRPC);
console.log('✅ 查询 Web3 初始化完成');
```

### 方案 3: 检测 Provider 类型

**原则**:
- 在发送交易前检查 provider 类型
- 如果不是钱包 provider，拒绝交易

**修改**:

```javascript
// 在购买函数开始时添加检查
async function purchaseMinerWithUSDT(level) {
    // 检查 Web3 provider 类型
    if (!window.web3 || !window.web3.currentProvider) {
        throw new Error('Web3 未初始化');
    }
    
    // 检查是否是钱包 provider
    const provider = window.web3.currentProvider;
    if (!provider.isMetaMask && !provider.isOkxWallet && !provider.isBinance && !provider.isTokenPocket) {
        // 如果不是钱包 provider，尝试重新初始化
        if (window.ethereum) {
            console.log('🔄 检测到非钱包 provider，重新初始化...');
            window.web3 = new Web3(window.ethereum);
        } else {
            throw new Error('请使用钱包连接');
        }
    }
    
    // 继续购买流程...
}
```

---

## 🔧 立即修复步骤

### 步骤 1: 修改 connectWallet 函数

**文件**: `js/core-functions.js`  
**位置**: 第 1138-1170 行

**修改前**:
```javascript
} catch (error) {
    console.error('❌ Web3初始化失败:', error);
    // 如果MetaMask初始化失败，尝试使用最佳RPC
    try {
        if (typeof window.getBestRPC === 'function') {
            const bestRPC = await window.getBestRPC();
            window.web3 = new window.Web3(bestRPC); // ❌ 问题在这里
            // ...
        }
    }
}
```

**修改后**:
```javascript
} catch (error) {
    console.error('❌ Web3初始化失败:', error);
    
    // 必须使用钱包 provider，不能回退到 RPC
    if (!window.ethereum) {
        console.error('❌ 未检测到钱包');
        showMessage('请安装钱包（MetaMask、欧易、币安等）', 'error');
        return false;
    }
    
    // 重试使用钱包 provider
    try {
        console.log('🔄 重试使用钱包 provider...');
        window.web3 = new window.Web3(window.ethereum);
        
        // 配置Web3超时设置
        if (window.web3.eth) {
            window.web3.eth.transactionConfirmationBlocks = 200;
            window.web3.eth.transactionPollingTimeout = 1800;
            window.web3.eth.transactionPollingInterval = 4000;
        }
        
        console.log('✅ Web3 初始化完成 (重试成功)');
    } catch (retryError) {
        console.error('❌ Web3重试也失败:', retryError);
        showMessage('钱包连接失败，请刷新页面重试', 'error');
        return false;
    }
}
```

### 步骤 2: 添加 Provider 检查函数

**文件**: `js/core-functions.js`  
**位置**: 在文件开头添加

```javascript
// 检查是否使用钱包 provider
function isWalletProvider() {
    if (!window.web3 || !window.web3.currentProvider) {
        return false;
    }
    
    const provider = window.web3.currentProvider;
    
    // 检查是否是钱包 provider
    return provider.isMetaMask || 
           provider.isOkxWallet || 
           provider.isBinance || 
           provider.isTokenPocket || 
           provider.isImToken ||
           (window.ethereum && provider === window.ethereum);
}

// 确保使用钱包 provider
function ensureWalletProvider() {
    if (!isWalletProvider()) {
        console.warn('⚠️ 当前不是钱包 provider，尝试重新初始化...');
        
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            console.log('✅ 已切换到钱包 provider');
            return true;
        } else {
            throw new Error('未检测到钱包，请安装钱包扩展');
        }
    }
    return true;
}
```

### 步骤 3: 在购买函数中添加检查

**文件**: `js/core-functions.js`  
**位置**: 每个购买函数开头

```javascript
async function purchaseMinerWithUSDT(level) {
    // 添加这个检查 ⭐
    ensureWalletProvider();
    
    // 原有代码...
    if (!isConnected || !userAccount) {
        throw new Error('Please connect wallet first');
    }
    // ...
}
```

---

## 📱 测试步骤

### 1. 清理缓存

```
欧易钱包 → 发现 → ... → 清除缓存
```

### 2. 使用新 URL

```
https://www.dreamlewebai.com/platform.html?v=20250930200000
```

### 3. 测试流程

```
1. 连接钱包
2. 查看控制台日志
3. 确认显示: "✅ Web3 初始化完成 (使用MetaMask provider)"
4. 不应该显示: "使用最佳RPC" 或 "使用默认RPC"
5. 尝试购买矿机
6. 应该成功，不再显示 eth_sendTransaction 错误
```

---

## 🎯 预期效果

### 修复前

```
❌ 错误: the method eth_sendTransaction does not exist/is not available
❌ 原因: Web3 使用了 RPC URL 而不是钱包 provider
❌ 影响: 所有移动端钱包无法购买
```

### 修复后

```
✅ Web3 始终使用钱包 provider
✅ 交易通过钱包发送
✅ 所有移动端钱包可以正常购买
✅ 不再出现 eth_sendTransaction 错误
```

---

## ⚠️ 重要提醒

### 关键原则

1. **交易必须使用钱包 provider**
   - `window.web3 = new Web3(window.ethereum)` ✅
   - `window.web3 = new Web3(rpcUrl)` ❌

2. **RPC URL 只用于查询**
   - 查询余额 ✅
   - 查询合约状态 ✅
   - 发送交易 ❌

3. **不要在交易时回退到 RPC**
   - 如果钱包 provider 失败，应该报错
   - 不应该回退到 RPC URL
   - 让用户重新连接钱包

### 调试技巧

**检查当前 provider**:
```javascript
console.log('Provider:', window.web3.currentProvider);
console.log('Is MetaMask:', window.web3.currentProvider.isMetaMask);
console.log('Is OKX:', window.web3.currentProvider.isOkxWallet);
console.log('Is Binance:', window.web3.currentProvider.isBinance);
```

**检查是否可以发送交易**:
```javascript
console.log('Can send transaction:', 
    typeof window.web3.eth.sendTransaction === 'function');
```

---

## 📊 影响范围

### 受影响的钱包

- ✅ 欧易钱包（OKX）
- ✅ 币安钱包（Binance）
- ✅ TokenPocket（TP）
- ✅ imToken（IM）
- ✅ 所有移动端 DApp 浏览器

### 受影响的功能

- ❌ USDT 购买矿机
- ❌ DRM 购买矿机
- ❌ USDT 授权
- ❌ DRM 授权
- ❌ 一键购买
- ❌ 所有需要发送交易的功能

---

**状态**: 🔥 紧急待修复  
**优先级**: 最高  
**预计修复时间**: 30 分钟

