# 🌟 Dreamle Mining Platform

一个基于 BSC（Binance Smart Chain）的 Web3 DApp 挖矿平台

---

## 📋 项目概述

**Dreamle Mining Platform** 是一个去中心化的 AI 算力挖矿平台，用户可以通过质押代币、购买矿机、参与挖矿等方式获得收益。

### 🌐 网站结构

| 页面 | URL | 说明 |
|------|-----|------|
| **主页** | https://www.dreamle.vip/index.html | 项目介绍、功能展示 |
| **功能平台** | https://www.dreamle.vip/platform.html | 核心功能：钱包连接、挖矿、质押、兑换 |

---

## ✨ 核心功能

### 1. 💰 Token Exchange（代币兑换）
- **USDT ⇄ DRM** 双向兑换
- 基于流动性池的自动做市商（AMM）机制
- 0.3% 交易手续费
- 实时价格计算和滑点显示

### 2. ⛏️ Mining（挖矿）
- 购买不同等级的矿机（Basic、Advanced、Pro、Elite、Ultimate）
- 每日自动产出 DRM 代币
- 支持一键领取挖矿收益
- 实时显示矿机状态和收益

### 3. 🔒 Staking（质押）
- 质押 DRM 代币获得收益
- 灵活的质押和解除质押机制
- 实时显示质押收益和 APY

### 4. 👥 Referral System（邀请系统）
- 生成专属邀请链接
- 邀请好友获得奖励
- 多级邀请奖励机制

### 5. 🔐 Admin Panel（管理员面板）
- 流动性池管理（注入/提取流动性）
- 用户数据查询
- 系统参数配置
- 仅管理员钱包可访问

---

## 🔧 技术栈

### 前端
- **HTML5 / CSS3 / JavaScript (ES6+)**
- **Web3.js** - 与区块链交互
- **Ethers.js** - 备用 Web3 库
- **Three.js** - 3D 动画效果

### 区块链
- **网络**: BSC Mainnet (Chain ID: 56)
- **智能合约**: Solidity
- **代币标准**: ERC-20 (BEP-20)

### 部署
- **平台**: Vercel
- **版本控制**: Git / GitHub
- **CI/CD**: Vercel 自动部署

---

## 📁 项目结构

```
original/
├── index.html              # 主页
├── platform.html           # 功能平台
├── script.js               # 主页脚本
├── styles.css              # 主页样式
├── platform.css            # 平台样式
├── version.js              # 版本信息
│
├── js/                     # JavaScript 模块
│   ├── web3-config.js      # Web3 配置
│   ├── core-functions.js   # 核心功能
│   ├── admin-functions.js  # 管理员功能
│   ├── wallet-detector.js  # 钱包检测
│   └── ...
│
├── css/                    # 样式文件
│   ├── homepage-redesign.css
│   ├── mining-platform-redesign.css
│   └── ...
│
├── images/                 # 图片资源
│   └── miners/             # 矿机图片
│
├── config/                 # 配置文件
│   └── contracts.js        # 合约配置
│
├── contract-info/          # 合约 ABI
│   ├── read-functions.json
│   ├── write-functions.json
│   └── full-abi.json
│
└── libs/                   # 第三方库
    ├── web3.min.js
    ├── ethers.min.js
    └── three.min.js
```

---

## 🚀 快速开始

### 本地开发

1. **克隆项目**
```bash
git clone https://github.com/你的用户名/dreamle-mining-platform.git
cd dreamle-mining-platform
```

2. **启动本地服务器**
```bash
# 使用 Python
python3 -m http.server 8000

# 或使用 Node.js
npx http-server -p 8000
```

3. **访问网站**
```
http://localhost:8000/index.html
http://localhost:8000/platform.html
```

### 部署到 Vercel

详细步骤请参考：[VERCEL部署指南.md](./VERCEL部署指南.md)

**快速部署**:
```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署
vercel

# 生产环境部署
vercel --prod
```

---

## 🔑 配置说明

### 1. 合约地址

文件：`config/contracts.js`

```javascript
const CONTRACTS = {
    UNIFIED_SYSTEM: '0xf9462c7fE57Fc7Aff662204228cCdCd0a9d3398A',
    DREAMLE_TOKEN: '0x4440409e078D44A63c72696716b84A46814717e9',
    USDT_TOKEN: '0x55d398326f99059fF775485246999027B3197955'
};

const ADMIN_ADDRESS = '0xfC3b7735Dae4C7AB3Ab85Ffa9987661e795B74b7';
```

### 2. RPC 端点

文件：`js/web3-config.js`

```javascript
const BSC_RPC_ENDPOINTS = [
    'https://lb.drpc.org/ogrpc?network=bsc&dkey=...',
    'https://bsc-dataseed1.binance.org/',
    'https://bsc-dataseed2.binance.org/',
    'https://bsc.publicnode.com'
];
```

### 3. 网络参数

- **Chain ID**: 56
- **Network Name**: BSC Mainnet
- **Currency**: BNB
- **Block Explorer**: https://bscscan.com

---

## 💼 支持的钱包

- ✅ **MetaMask** - 浏览器扩展钱包
- ✅ **Binance Chain Wallet** - 币安官方钱包
- ✅ **OKX Wallet** - 欧易钱包
- ✅ **Trust Wallet** - 移动端钱包
- ✅ **TokenPocket** - 多链钱包
- ✅ **WalletConnect** - 移动端连接协议

---

## 📊 智能合约信息

### Unified System Contract
- **地址**: `0xf9462c7fE57Fc7Aff662204228cCdCd0a9d3398A`
- **功能**: 核心系统合约，包含挖矿、质押、兑换等功能
- **查看**: [BSCScan](https://bscscan.com/address/0xf9462c7fE57Fc7Aff662204228cCdCd0a9d3398A)

### DRM Token
- **地址**: `0x4440409e078D44A63c72696716b84A46814717e9`
- **名称**: Dreamle Token
- **符号**: DRM
- **精度**: 18
- **查看**: [BSCScan](https://bscscan.com/token/0x4440409e078D44A63c72696716b84A46814717e9)

### USDT Token (BUSD-T)
- **地址**: `0x55d398326f99059fF775485246999027B3197955`
- **名称**: Tether USD
- **符号**: USDT
- **精度**: 18
- **查看**: [BSCScan](https://bscscan.com/token/0x55d398326f99059fF775485246999027B3197955)

---

## 🔒 安全性

### 已实施的安全措施

1. ✅ **未登录门禁** - 未连接钱包时隐藏敏感数据
2. ✅ **管理员权限控制** - Admin Panel 仅管理员可访问
3. ✅ **交易确认** - 所有交易需用户确认
4. ✅ **输入验证** - 前端验证用户输入
5. ✅ **错误处理** - 完善的错误捕获和提示
6. ✅ **RPC 容错** - 多个 RPC 端点自动切换

### 安全建议

- ⚠️ 不要分享私钥或助记词
- ⚠️ 确认交易前仔细检查金额和地址
- ⚠️ 使用硬件钱包存储大额资产
- ⚠️ 定期备份钱包

---

## 📚 相关文档

| 文档 | 说明 |
|------|------|
| [VERCEL部署指南.md](./VERCEL部署指南.md) | Vercel 部署详细步骤 |
| [如何注入流动性到合约.md](./如何注入流动性到合约.md) | 流动性注入操作指南 |
| [流动性池问题诊断报告.md](./流动性池问题诊断报告.md) | 流动性问题诊断 |
| [SECURITY_FIX_2025-10-08.md](./SECURITY_FIX_2025-10-08.md) | 安全修复说明 |
| [FIX_SUMMARY_2025-10-08.md](./FIX_SUMMARY_2025-10-08.md) | 修复总结 |

---

## 🐛 已知问题

### 流动性池问题
- **问题**: Token Exchange 显示 "No Liquidity"
- **原因**: 流动性池余额为 0
- **解决**: 管理员需要注入初始流动性
- **参考**: [如何注入流动性到合约.md](./如何注入流动性到合约.md)

### CSS 警告
- **问题**: 浏览器控制台显示 CSS 警告
- **影响**: 不影响功能，仅为样式兼容性警告
- **状态**: 可忽略

---

## 🔄 版本历史

### v20251009-FINAL-FIX (2025-10-09)
- ✅ 邀请系统重构
- ✅ 未登录门禁
- ✅ 语法错误修复

### v20251008-CRITICAL-FIX (2025-10-08)
- ✅ 移除 platform 重定向
- ✅ 添加连接门禁
- ✅ 修复钱包连接问题

---

## 📞 联系方式

- **项目**: Dreamle Mining Platform
- **网站**: https://www.dreamle.vip
- **邮箱**: hayajaiahk@gmail.com
- **GitHub**: https://github.com/hayajaiahk-code

---

## 📄 许可证

本项目仅供学习和研究使用。

---

## 🙏 致谢

感谢以下开源项目：
- [Web3.js](https://web3js.readthedocs.io/)
- [Ethers.js](https://docs.ethers.io/)
- [Three.js](https://threejs.org/)
- [Vercel](https://vercel.com/)

---

**Built with ❤️ by Dreamle Team**

