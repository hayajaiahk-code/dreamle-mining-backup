# 🚀 Dreamle Mining Platform - 项目结构指南

> **最后更新**: 2025-10-22 17:30
> **用途**: 帮助 Augment AI 快速理解项目结构和功能
> **项目**: Dreamle 挖矿平台 + DRM 代币购买系统
> **最新状态**: 法律免责声明已添加，警告横幅已隐藏

---

## 🆕 最新修改总结（2025-10-22）

### ✅ 今日完成的工作

1. **法律免责声明系统**
   - 创建 `legal-disclaimer.html` - 完整的中英文免责声明页面
   - 内容包括：教育目的声明、地区限制（禁止中国用户）、风险警告、开发者联系方式
   - 页脚添加 "Legal Disclaimer" 链接（红色高亮）

2. **警告横幅处理**
   - 最初添加了红色警告横幅（页脚和购买页面顶部）
   - **用户要求后已全部删除/隐藏**
   - 免责声明页面仍然保留，可通过页脚链接访问

3. **页脚链接优化**
   - 删除了 404 链接（Privacy Policy, Terms of Service, Contact Us）
   - 替换为：Legal Disclaimer, Developer Contact, Telegram
   - 开发者联系方式：hayajaiahk@gmail.com, @PandaBlock_Labs

4. **Bug 修复**
   - 删除了页面底部显示的 PWA 注释
   - 清理了多余的 Vercel 项目（dreamle-drm）

5. **部署和备份**
   - 所有修改已部署到 Vercel 生产环境
   - 所有代码已备份到 GitHub

### 📝 新增文件

| 文件 | 用途 | URL |
|------|------|-----|
| `legal-disclaimer.html` | 法律免责声明页面 | `/legal-disclaimer.html` |

### 🔄 修改的文件

| 文件 | 修改内容 |
|------|----------|
| `index.html` | 页脚链接更新，删除警告横幅，删除 PWA 注释 |
| `buy-drm-preview.html` | 删除顶部警告横幅 |

---

## 📋 项目概述

这是一个基于 BSC (Binance Smart Chain) 的 Web3 挖矿平台，包含：
1. **挖矿平台** - 用户购买矿机、质押、挖矿、推荐奖励
2. **DRM 代币购买** - 独立的代币购买页面
3. **管理后台** - 管理员功能（提现、数据查看等）
4. **法律免责声明** - 独立的免责声明页面（新增）

---

## 🌐 部署信息

### Vercel 部署
- **Pro 账户**: hayajaiahk-1711 (hayajaiahk@gmail.com)
- **项目名**: backup
- **生产域名**: https://www.dreamle.vip
- **部署命令**: `vercel deploy --prod`

### GitHub 备份
- **仓库**: https://github.com/hayajaiahk-code/dreamle-mining-backup
- **分支**: main
- **推送命令**: `git push backup main`

### 旧部署（已弃用）
- **Hobby 账户**: hyptqi-8090 (hyptqi@gmail.com)
- **域名**: https://www.dreamlewebai.com

---

## 📁 核心文件结构

### 🎯 主要页面

| 文件 | 用途 | URL |
|------|------|-----|
| `index.html` | 首页/登录页 | `/` |
| `platform.html` | 挖矿平台主界面 | `/platform` |
| `buy-drm-preview.html` | DRM 代币购买页面 | `/buy-drm-preview` |
| `legal-disclaimer.html` | 法律免责声明页面 | `/legal-disclaimer.html` |

### 💎 DRM 购买系统（重要！）

**核心文件**:
- `buy-drm-preview.html` - 独立的 DRM 购买页面
- `js/buy-drm-functions.js` - 购买逻辑（USDT 授权、购买、历史记录）
- `js/drm-sale-abi.js` - DRM Sale 合约 ABI
- `css/buy-drm-history.css` - 购买历史样式

**合约地址** (BSC Mainnet):
```javascript
Sale Contract: 0x1C8c3e823F98EFEc34FEf5673b4d63a23A251224
DRM Token:     0x4440409e078D44A63c72696716b84A46814717e9
USDT Token:    0x55d398326f99059fF775485246999027B3197955
```

**导航集成**:
- `platform.html` 第 3513 行有 "💎 Buy DRM" 按钮
- 点击跳转到 `buy-drm-preview.html`（新标签页）
- 需要重新连接钱包（独立页面）

### 🔧 JavaScript 核心模块

| 文件 | 功能 |
|------|------|
| `js/web3-config.js` | Web3 配置、RPC 端点、网络设置 |
| `js/core-functions.js` | 核心功能（购买矿机、质押、提现等） |
| `js/admin-functions.js` | 管理员功能 |
| `js/wallet-detector.js` | 钱包检测（MetaMask、OKX、Trust Wallet 等） |
| `js/auto-network-switch.js` | 自动切换到 BSC 主网 |
| `js/referral-system.js` | 推荐系统 |
| `js/buy-drm-functions.js` | **DRM 购买功能** ⭐ |

### 🎨 CSS 样式

| 文件 | 功能 |
|------|------|
| `platform.css` | 平台主样式 |
| `styles.css` | 全局样式 |
| `css/buy-drm-history.css` | DRM 购买历史样式 |
| `loading-screen.css` | 加载动画 |

### 📜 智能合约 ABI

| 文件 | 合约 |
|------|------|
| `js/unified-system-v19-abi.js` | 主合约 ABI (挖矿系统) |
| `js/drm-sale-abi.js` | DRM Sale 合约 ABI ⭐ |
| `js/dreamle-token-abi.js` | Dreamle Token ABI |

### 📦 配置文件

| 文件 | 用途 |
|------|------|
| `vercel.json` | Vercel 部署配置 |
| `config/contracts.js` | 合约地址配置 |

---

## 🔑 关键功能说明

### 1️⃣ 挖矿平台 (`platform.html`)

**功能模块**:
- 📊 Dashboard - 资产概览、收益统计
- 🛒 Buy Miners - 购买矿机（6 个等级）
- 🤖 Miner Management - 矿机管理、质押
- 🔄 Token Exchange - 代币兑换
- 💎 Buy DRM - 跳转到 DRM 购买页面 ⭐

**导航栏代码位置**: `platform.html` 第 3500-3520 行

**Tab 切换逻辑**: 第 5509-5533 行
- 使用 `tab-link-external` class 标识外部链接
- 外部链接不触发 tab 切换

### 2️⃣ DRM 购买系统 (`buy-drm-preview.html`)

**购买流程**:
1. 连接钱包（MetaMask、OKX、Trust Wallet）
2. 输入购买数量（USDT）
3. 授权 USDT（如果未授权）
4. 执行购买
5. 查看购买历史

**关键函数** (`js/buy-drm-functions.js`):
```javascript
buyDRMCustom(usdtAmount)  // 购买 DRM
checkUSDTAllowance()      // 检查 USDT 授权
approveUSDT(amount)       // 授权 USDT
loadPurchaseHistory()     // 加载购买历史
```

**样式特点**:
- 渐变背景（青色到紫色）
- 悬停动画效果
- 响应式设计

### 3️⃣ 钱包连接

**支持的钱包**:
- MetaMask
- OKX Wallet
- Trust Wallet
- Binance Chain Wallet
- TokenPocket

**自动网络切换**:
- 自动检测并切换到 BSC Mainnet (Chain ID: 56)
- 代码位置: `js/auto-network-switch.js`

---

## 🛠️ 常见修改场景

### 场景 1: 修改合约地址

**文件**: `buy-drm-preview.html` (第 1100-1103 行)
```javascript
const SALE_CONTRACT_ADDRESS = '0x1C8c3e823F98EFEc34FEf5673b4d63a23A251224';
const DRM_TOKEN_ADDRESS = '0x4440409e078D44A63c72696716b84A46814717e9';
const USDT_TOKEN_ADDRESS = '0x55d398326f99059fF775485246999027B3197955';
```

**注意**: 同时检查 `js/buy-drm-functions.js` 中的配置是否一致！

### 场景 2: 修改按钮样式

**文件**: `buy-drm-preview.html` (第 733-812 行)
```css
.buy-btn-large {
    background: linear-gradient(135deg, #00ffff, #ff00ff);
    /* ... */
}
```

### 场景 3: 添加新导航按钮

**文件**: `platform.html` (第 3513 行附近)
```html
<a href="new-page.html" class="tab-btn tab-link-external" 
   target="_blank" onclick="event.stopPropagation();">
   🆕 新功能
</a>
```

**重要**: 添加 `tab-link-external` class 避免触发 tab 切换错误！

### 场景 4: 修复白色背景问题

**常见原因**:
1. CSS 中有 `background: white` 或 `background: rgba(255,255,255,0.x)`
2. 缺少深色主题样式
3. 内联样式覆盖了 CSS

**解决方案**:
- 搜索 `background.*white` 或 `background.*rgba\(255`
- 替换为深色背景：`background: rgba(0, 0, 0, 0.3)` 或透明
- 参考文档: `深色主题修复总结.md`

---

## 🚨 已知问题和修复

### ✅ 已修复的问题

1. **合约地址不匹配** - 已统一所有合约地址
2. **USDT 合约引用错误** - 已修复 `config.testUsdt` → `config.usdtToken`
3. **Buy Now 按钮白色背景** - 已添加渐变样式
4. **点击 Buy DRM 报错** - 已添加 `tab-link-external` class
5. **白色半透明背景** - 已全局修复深色主题

### ⚠️ 注意事项

1. **缓存问题**: 修改后需要清除浏览器缓存或使用版本号 `?v=xx`
2. **钱包权限**: 某些钱包需要用户手动授权网络切换
3. **Gas 费用**: BSC 主网交易需要 BNB 作为 Gas
4. **RPC 限制**: 公共 RPC 可能有速率限制

---

## 📝 部署流程

### 1. 本地测试
```bash
# 启动本地服务器
python3 -m http.server 8888
# 访问 http://localhost:8888/vercel/original/platform.html
```

### 2. 部署到 Vercel
```bash
cd vercel/original
vercel deploy --prod
```

### 3. 备份到 GitHub
```bash
cd vercel/original
git add .
git commit -m "描述修改内容"
git push backup main
```

---

## 🔍 调试技巧

### 查看控制台日志
- 打开浏览器开发者工具 (F12)
- 查看 Console 标签
- 关键日志前缀：
  - `🌐` - 网络相关
  - `💰` - 交易相关
  - `✅` - 成功操作
  - `❌` - 错误信息

### 常见错误

| 错误信息 | 原因 | 解决方案 |
|---------|------|---------|
| `invalid contract address` | 合约地址未定义或错误 | 检查合约地址配置 |
| `user rejected transaction` | 用户拒绝交易 | 提示用户确认 |
| `insufficient funds` | 余额不足 | 检查钱包余额 |
| `Tab content not found` | Tab 切换错误 | 添加 `tab-link-external` class |

---

## 📚 相关文档

### DRM 购买系统
- `BUY_DRM_INTEGRATION_GUIDE.md` - 集成指南
- `BUY_DRM_SUMMARY.md` - 功能总结
- `BUY_DRM_TEST_GUIDE.md` - 测试指南

### 部署和优化
- `VERCEL部署指南.md` - Vercel 部署详细说明
- `DEPLOYMENT_README.md` - 部署说明
- `PERFORMANCE_OPTIMIZATION_REPORT.md` - 性能优化报告

### 钱包和网络
- `BINANCE_WALLET_TEST_GUIDE.md` - Binance 钱包测试
- `OKX_WALLET_FIX_SUMMARY.md` - OKX 钱包修复
- `WALLET_CONNECTION_FIX_FINAL.md` - 钱包连接修复

### 主题和样式
- `深色主题修复总结.md` - 深色主题修复
- `如何使用Augment修改深色主题.md` - Augment 使用指南

---

## 🎯 快速命令参考

```bash
# 查看当前 Vercel 账户
vercel whoami

# 查看项目列表
vercel ls

# 部署到生产环境
vercel deploy --prod

# 查看 Git 状态
git status

# 推送到备份仓库
git push backup main

# 查看最近提交
git log --oneline -5

# 启动本地服务器
python3 -m http.server 8888
```

---

## 👥 账户信息

### Vercel Pro 账户
- **用户名**: hayajaiahk-1711
- **邮箱**: hayajaiahk@gmail.com
- **项目**: backup
- **域名**: www.dreamle.vip

### GitHub 账户
- **用户名**: hayajaiahk-code
- **邮箱**: hayajaiahk@gmail.com
- **仓库**: dreamle-mining-backup

### 旧账户（已弃用）
- **Vercel**: hyptqi-8090 (hyptqi@gmail.com)
- **GitHub**: hyptqi-crypto

---

## 🔐 安全提示

1. **不要提交敏感信息**: Token、私钥等
2. **使用环境变量**: 敏感配置使用 Vercel 环境变量
3. **定期备份**: 重要修改后立即备份到 GitHub
4. **测试后部署**: 本地测试通过后再部署到生产环境

---

## 📞 联系方式

如有问题，请查看相关文档或联系开发团队。

**最后更新**: 2025-10-22  
**维护者**: Augment AI + 开发团队

