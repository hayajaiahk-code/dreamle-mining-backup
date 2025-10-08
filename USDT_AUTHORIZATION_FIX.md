# USDT 授权按钮修复报告

## 问题描述
**日期**: 2025-09-30  
**报告人**: 用户  
**问题**: "AUTHORIZE 100 USDT" 按钮点击后授权的是 DRM 代币，而不是 USDT

## 问题分析

### 根本原因
在 `js/core-functions.js` 的 `authorizeUSDT()` 函数中（第 3018 行），错误地使用了 `dreamleContract`（DRM代币合约）来进行授权，而不是 `usdtContract`（USDT代币合约）。

### 错误代码
```javascript
// ❌ 错误：使用了 DRM 合约来授权
const tx = await dreamleContract.methods.approve(
    window.CONTRACT_ADDRESSES.UNIFIED_SYSTEM,
    authorizeAmount
).send({
    from: userAccount,
    gas: 100000
});
```

### 合约地址说明
根据 `config/contracts.js` 配置：
- **USDT 合约地址**: `0x55d398326f99059fF775485246999027B3197955` (BSC 主网真实 USDT)
- **DRM 代币地址**: `0x4440409e078D44A63c72696716b84A46814717e9` (Dreamle 项目代币)
- **统一系统合约**: `0xf9462c7fE57Fc7Aff662204228cCdCd0a9d3398A`

### 合约初始化
在 `connectWallet()` 函数中正确初始化了两个合约：
- `usdtContract` - 使用 `CONTRACT_ADDRESSES.USDT_TOKEN` 初始化
- `dreamleContract` - 使用 `CONTRACT_ADDRESSES.DREAMLE_TOKEN` 初始化

## 修复方案

### 修复内容
将 `authorizeUSDT()` 函数中的授权操作从 `dreamleContract` 改为 `usdtContract`。

### 修复后代码
```javascript
// 🔧 修复：使用正确的 USDT 合约进行授权
if (!usdtContract) {
    throw new Error('USDT contract not initialized');
}

const tx = await usdtContract.methods.approve(
    window.CONTRACT_ADDRESSES.UNIFIED_SYSTEM,
    authorizeAmount
).send({
    from: userAccount,
    gas: 100000
});
```

### 修改文件
- **文件**: `js/core-functions.js`
- **函数**: `authorizeUSDT()`
- **行号**: 3017-3028

## 修复验证

### 测试步骤
1. 刷新网页，清除缓存
2. 连接钱包
3. 选择矿机等级（例如 LV.1 - 100 USDT）
4. 点击 "🔐 Authorize 100 USDT" 按钮
5. 在钱包中确认授权交易
6. 检查授权的代币是否为 USDT（而不是 DRM）

### 预期结果
- ✅ 钱包弹出的授权请求应该显示 USDT 代币
- ✅ 授权金额应该与选择的矿机价格一致
- ✅ 授权成功后可以正常购买矿机

### 验证方法
在浏览器控制台查看日志：
```
🔐 开始授权USDT...
   选择的矿机等级: LV.1
   矿机价格: 100 USDT
   授权金额: 100 USDT
✅ USDT authorization successful: 0x...
```

## 影响范围

### 受影响功能
- ✅ **普通用户 USDT 授权** - 已修复
- ✅ **一键授权购买功能** - 间接受益（内部调用 `authorizeUSDT`）

### 不受影响功能
- ✅ 管理员免费购买（不需要授权）
- ✅ DRM 代币购买（使用不同的授权流程）
- ✅ 已授权用户的购买功能

## 相关代码位置

### 授权相关函数
1. **`authorizeUSDT()`** - 第 2969-3060 行
   - 普通用户授权 USDT 的主要函数
   - 已修复：使用 `usdtContract` 而不是 `dreamleContract`

2. **`oneClickPurchase()`** - 第 3063-3290 行
   - 一键授权购买功能
   - 内部调用 `authorizeUSDT()`，间接受益于此修复

3. **按钮事件绑定** - `platform.html` 第 4375-4393 行
   - 绑定 "Authorize USDT" 按钮点击事件
   - 调用 `window.authorizeUSDT()`

## 后续建议

### 代码审查
建议审查其他可能混淆 USDT 和 DRM 合约的地方：
- ✅ 检查所有涉及 USDT 授权的代码
- ✅ 确保变量命名清晰（`usdtContract` vs `dreamleContract`）
- ✅ 添加更多的合约类型检查

### 测试建议
1. **单元测试**: 为授权功能添加自动化测试
2. **集成测试**: 测试完整的授权-购买流程
3. **用户测试**: 让真实用户测试授权功能

### 文档更新
- ✅ 更新代码注释，明确说明使用的是 USDT 合约
- ✅ 在开发文档中记录合约地址和用途

## 总结

### 问题
普通用户点击 "AUTHORIZE USDT" 按钮时，实际授权的是 DRM 代币而不是 USDT。

### 原因
代码错误地使用了 `dreamleContract`（DRM 合约）来执行 USDT 授权操作。

### 解决方案
将授权操作改为使用正确的 `usdtContract`（USDT 合约）。

### 状态
✅ **已修复** - 2025-09-30

---

**修复人员**: AI Assistant  
**审核状态**: 待用户测试验证  
**优先级**: 🔴 高（影响普通用户购买功能）

