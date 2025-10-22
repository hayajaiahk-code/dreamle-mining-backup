# 切换到 BSC 主网

## 🎯 快速切换指南

当你准备好在 BSC 主网上线时，只需要修改一个文件！

---

## 📝 步骤 1: 部署主网合约

在 `drm-sale-contract` 目录下运行：

```bash
cd drm-sale-contract
npx hardhat run scripts/deploy-mainnet.js --network bscMainnet
```

记录输出的合约地址，例如：
```
✅ DRMSaleSimple deployed to: 0xABCDEF1234567890...
```

---

## 📝 步骤 2: 存入 DRM 代币

```bash
npx hardhat run scripts/deposit-drm-mainnet.js --network bscMainnet
```

或者手动转账 DRM 到销售合约地址。

---

## 📝 步骤 3: 修改前端配置

**只需要修改一个文件**: `vercel/original/js/buy-drm-functions.js`

### 找到这两行：

```javascript
// 环境切换：设置为 'testnet' 或 'mainnet'
// 生产环境请改为 'mainnet'
const CURRENT_ENVIRONMENT = 'testnet';  // ← 修改这里
```

### 改为：

```javascript
// 环境切换：设置为 'testnet' 或 'mainnet'
// 生产环境请改为 'mainnet'
const CURRENT_ENVIRONMENT = 'mainnet';  // ← 改成 mainnet
```

### 然后找到主网配置：

```javascript
mainnet: {
    chainId: 56,
    chainName: 'BSC Mainnet',
    rpcUrl: 'https://bsc-dataseed1.binance.org/',
    drmToken: "0x4440409e078D44A63c72696716b84A46814717e9",
    usdtToken: "0x55d398326f99059fF775485246999027B3197955",
    saleContract: "",  // ← 填入步骤1中的合约地址
    drmPrice: 0.2,
    minPurchase: 10,
    maxPurchase: 10000,
}
```

### 更新为：

```javascript
mainnet: {
    chainId: 56,
    chainName: 'BSC Mainnet',
    rpcUrl: 'https://bsc-dataseed1.binance.org/',
    drmToken: "0x4440409e078D44A63c72696716b84A46814717e9",
    usdtToken: "0x55d398326f99059fF775485246999027B3197955",
    saleContract: "0xABCDEF1234567890...",  // ← 填入你的合约地址
    drmPrice: 0.2,
    minPurchase: 10,
    maxPurchase: 10000,
}
```

---

## ✅ 完成！

保存文件后，你的网站就会自动切换到 BSC 主网！

---

## 🧪 测试

1. 刷新网站
2. 连接钱包（确保切换到 BSC 主网）
3. 检查显示的价格和可用 DRM
4. 尝试小额购买（10 USDT）
5. 确认交易成功

---

## 🔄 切换回测试网

如果需要切回测试网，只需要：

```javascript
const CURRENT_ENVIRONMENT = 'testnet';  // 改回 testnet
```

---

## 📊 对比

### 测试网 (Testnet)
- **Network**: BSC Testnet (Chain ID: 97)
- **DRM Token**: 测试代币
- **USDT**: 测试 USDT
- **用途**: 开发和测试

### 主网 (Mainnet)
- **Network**: BSC Mainnet (Chain ID: 56)
- **DRM Token**: 真实 DREAMLE Token (`0x4440409e078D44A63c72696716b84A46814717e9`)
- **USDT**: 真实 USDT (`0x55d398326f99059fF775485246999027B3197955`)
- **用途**: 生产环境

---

## ⚠️ 重要提醒

### 部署前
- ✅ 确保在测试网充分测试
- ✅ 准备足够的 BNB（gas 费）
- ✅ 准备足够的 DRM（销售库存）
- ✅ 备份私钥

### 部署后
- ✅ 验证合约地址正确
- ✅ 确认 DRM 已存入
- ✅ 测试小额购买
- ✅ 监控交易

### 安全
- ⚠️ 永远不要分享私钥
- ⚠️ 定期提取 USDT 收入
- ⚠️ 监控异常交易
- ⚠️ 保持管理员钱包安全

---

## 🆘 常见问题

### Q: 用户看到的还是测试网？
**A**: 检查 `CURRENT_ENVIRONMENT` 是否改为 `'mainnet'`

### Q: 合约地址在哪里找？
**A**: 运行部署脚本后会显示，或查看 `deployment-mainnet.json`

### Q: 如何验证切换成功？
**A**: 
1. 打开浏览器控制台
2. 应该看到：`🌐 Using BSC Mainnet (Chain ID: 56)`
3. 连接钱包时会提示切换到 BSC 主网

### Q: 可以同时运行测试网和主网吗？
**A**: 不可以，一次只能使用一个环境。建议：
- 开发/测试：使用测试网
- 生产：使用主网

---

## 📞 需要帮助？

如果遇到问题：
1. 检查浏览器控制台的错误信息
2. 确认钱包连接到正确的网络
3. 验证合约地址是否正确
4. 查看 BSCScan 上的交易记录

---

**祝你上线顺利！** 🚀

