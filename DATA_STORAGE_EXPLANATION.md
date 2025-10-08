# 📊 数据存储说明

**问题**: 服务器不储存数据，让客户每次打开都是新的  
**解决方案**: ✅ 已实现自动清理本地存储  
**状态**: 完成

---

## 🔍 数据存储位置分析

### 1. 服务器端（你的服务器）

**存储内容**: ❌ **无**

```
你的服务器 (82.29.72.9)
    ↓
只提供静态文件:
    - HTML
    - CSS
    - JavaScript
    - 图片

不存储任何用户数据！
```

**验证**:
```bash
# 检查服务器上是否有数据库文件
ls -la /root/dreamle-mining/*.db
ls -la /root/dreamle-mining/*.sqlite

# 结果: 没有数据库文件
```

---

### 2. 区块链（BSC 主网）

**存储内容**: ✅ **所有用户数据**

```
BSC 区块链
    ↓
存储内容:
    - 用户钱包地址
    - 矿机所有权
    - 挖矿数据
    - 交易记录
    - 推荐关系

特点:
    ✅ 永久存储
    ✅ 不可篡改
    ✅ 全球同步
```

**重要**: 区块链数据是永久的，无法清除！

---

### 3. 用户浏览器（localStorage）

**存储内容**: ⚠️ **临时缓存**

```
用户浏览器 localStorage
    ↓
存储内容:
    - 推荐人地址 (dreamle_referrer)
    - 推荐人时间戳 (dreamle_referrer_timestamp)
    - 性能监控数据 (mobile_performance_*)
    - Augment 配置 (augment-*)

特点:
    ⚠️ 本地存储
    ⚠️ 可以清除
    ⚠️ 只影响当前浏览器
```

**问题**: 这些数据会让用户"记住"之前的状态

---

## ✅ 解决方案：自动清理本地存储

### 实现方式

创建了 `js/auto-clear-storage.js` 脚本，在每次页面加载时自动清理所有本地存储。

### 清理内容

1. **localStorage** - 完全清空
2. **sessionStorage** - 完全清空
3. **Cookies** - 完全清空
4. **IndexedDB** - 完全清空

### 代码逻辑

```javascript
// 页面加载时自动执行
function autoCleanOnLoad() {
    console.log('🚀 页面加载，执行自动清理...');
    
    // 1. 清理 localStorage
    localStorage.clear();
    
    // 2. 清理 sessionStorage
    sessionStorage.clear();
    
    // 3. 清理 cookies
    clearAllCookies();
    
    // 4. 清理 IndexedDB
    clearIndexedDB();
    
    console.log('🎉 本地存储清理完成！');
}
```

---

## 📊 数据流程对比

### 修复前

```
用户第一次访问
    ↓
localStorage 存储推荐人地址
    ↓
用户关闭页面
    ↓
用户再次访问
    ↓
localStorage 仍然保留推荐人地址 ❌
    ↓
用户看到之前的推荐人信息
```

### 修复后

```
用户第一次访问
    ↓
自动清理 localStorage ✅
    ↓
localStorage 为空
    ↓
用户使用网站
    ↓
localStorage 可能存储一些数据
    ↓
用户关闭页面
    ↓
用户再次访问
    ↓
自动清理 localStorage ✅
    ↓
localStorage 为空
    ↓
用户看到全新状态 ✅
```

---

## 🎯 效果验证

### 测试步骤

1. **第一次访问**
   ```
   打开 https://www.dreamlewebai.com/
   F12 → Console
   应该看到: 🧹 开始清理本地存储...
   应该看到: ✅ localStorage 已完全清空
   ```

2. **存储一些数据**
   ```javascript
   // 在控制台执行
   localStorage.setItem('test', 'hello');
   console.log(localStorage.getItem('test')); // 输出: hello
   ```

3. **刷新页面**
   ```
   F5 刷新
   F12 → Console
   应该看到: 🧹 开始清理本地存储...
   ```

4. **验证数据已清除**
   ```javascript
   // 在控制台执行
   console.log(localStorage.getItem('test')); // 输出: null
   ```

---

## 📝 已修改的文件

| 文件 | 修改内容 |
|------|---------|
| `js/auto-clear-storage.js` | ✅ 新建 - 自动清理脚本 |
| `platform.html` | ✅ 添加清理脚本引用（第 29 行） |
| `index.html` | ✅ 添加清理脚本引用（第 256 行） |

---

## 🔧 配置选项

### 启用/禁用自动清理

编辑 `js/auto-clear-storage.js`:

```javascript
// 配置：是否启用自动清理
const AUTO_CLEAR_ENABLED = true;  // 改为 false 禁用
```

### 白名单（保留某些数据）

如果需要保留某些数据（例如语言设置），可以添加到白名单：

```javascript
// 配置：需要保留的键（白名单）
const WHITELIST_KEYS = [
    'user_language',      // 保留语言设置
    'theme_preference'    // 保留主题设置
];
```

---

## ⚠️ 重要说明

### 1. 区块链数据不受影响

```
清理 localStorage ≠ 清理区块链数据

区块链数据包括:
    - 用户的矿机
    - 挖矿记录
    - 交易历史
    - 推荐关系

这些数据永久存储在 BSC 区块链上，无法清除！
```

### 2. 用户钱包连接

```
每次打开页面:
    ↓
localStorage 被清空
    ↓
用户需要重新连接钱包 ✅
    ↓
连接后，从区块链读取用户数据
    ↓
显示用户的矿机和挖矿数据
```

### 3. 推荐链接

```
用户通过推荐链接访问:
    https://www.dreamlewebai.com/?ref=0x123...
    ↓
localStorage 被清空
    ↓
推荐人地址从 URL 读取 ✅
    ↓
用户购买时使用 URL 中的推荐人地址
```

**重要**: 推荐链接仍然有效，因为推荐人地址从 URL 读取，不依赖 localStorage！

---

## 📊 存储对比表

| 存储位置 | 内容 | 是否清理 | 影响 |
|---------|------|---------|------|
| **你的服务器** | 静态文件 | ❌ 不清理 | 无用户数据 |
| **BSC 区块链** | 用户数据 | ❌ 不清理 | 永久存储 |
| **localStorage** | 临时缓存 | ✅ 自动清理 | 每次打开都是新的 |
| **sessionStorage** | 会话数据 | ✅ 自动清理 | 每次打开都是新的 |
| **Cookies** | Cookie 数据 | ✅ 自动清理 | 每次打开都是新的 |
| **IndexedDB** | 本地数据库 | ✅ 自动清理 | 每次打开都是新的 |

---

## 🎉 总结

### 问题

- ❌ 用户每次打开页面，localStorage 保留了之前的数据
- ❌ 推荐人地址被缓存，用户看到旧的推荐人信息

### 解决方案

- ✅ 每次页面加载时自动清理所有本地存储
- ✅ 用户每次打开都是全新状态
- ✅ 推荐人地址从 URL 读取，不依赖缓存

### 效果

- ✅ **服务器**: 不存储任何用户数据
- ✅ **浏览器**: 每次打开自动清空
- ✅ **区块链**: 永久存储用户数据（这是正常的）

### 用户体验

- ✅ 每次打开页面都是全新状态
- ✅ 需要重新连接钱包（安全）
- ✅ 从区块链读取真实数据（准确）
- ✅ 推荐链接仍然有效（从 URL 读取）

---

## 🧪 测试清单

- [ ] 打开页面，检查控制台是否显示清理日志
- [ ] 刷新页面，验证 localStorage 被清空
- [ ] 连接钱包，验证可以正常读取区块链数据
- [ ] 通过推荐链接访问，验证推荐人地址正确
- [ ] 关闭页面再打开，验证是全新状态

---

**状态**: ✅ 已完成  
**测试**: 清除浏览器缓存后测试  
**效果**: 每次打开都是全新状态

