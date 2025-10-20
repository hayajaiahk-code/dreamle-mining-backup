# 🚀 Vercel 部署指南

## 📋 项目说明

这是一个基于 Web3 的 DApp 项目 - **Dreamle Mining Platform**

### 🌐 网站结构

- **主页**: https://www.dreamle.vip/index.html
  - 项目介绍页面
  - 展示 Dreamle AI 挖矿平台的核心功能
  - 引导用户进入功能平台

- **功能平台**: https://www.dreamle.vip/platform.html
  - 核心功能页面
  - 包含钱包连接、代币兑换、挖矿、质押等功能
  - 管理员面板（Admin Panel）

---

## 📁 项目目录结构

```
original/
├── index.html              # 主页（首页）
├── platform.html           # 功能平台（核心页面）
├── script.js               # 主页 JavaScript
├── styles.css              # 主页样式
├── platform.css            # 平台样式
├── loading-screen.css      # 加载屏幕样式
├── loading-screen.js       # 加载屏幕逻辑
├── version.js              # 版本信息
├── favicon.svg             # 网站图标
│
├── js/                     # JavaScript 模块
│   ├── web3-config.js      # Web3 配置（RPC、合约地址）
│   ├── core-functions.js   # 核心功能（挖矿、质押、兑换）
│   ├── admin-functions.js  # 管理员功能
│   ├── wallet-detector.js  # 钱包检测
│   ├── network-helper.js   # 网络切换助手
│   ├── referral-system.js  # 邀请系统
│   └── ...                 # 其他模块
│
├── css/                    # 样式文件
│   ├── homepage-redesign.css
│   ├── mining-platform-redesign.css
│   ├── navbar-fix.css
│   └── device-experience.css
│
├── images/                 # 图片资源
│   ├── icon.svg
│   └── miners/             # 矿机图片
│
├── config/                 # 配置文件
│   └── contracts.js        # 合约配置（BSC 主网）
│
├── contract-info/          # 合约 ABI 和信息
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

## 🔧 部署到新的 Vercel 项目

### 方法 1: 通过 Vercel Dashboard（推荐）

#### 步骤 1: 准备 Git 仓库

1. **创建新的 Git 仓库**（如果还没有）

```bash
cd /home/jzy/桌面/vercel/original
git init
git add .
git commit -m "Initial commit: Dreamle Mining Platform"
```

2. **推送到 GitHub**

```bash
# 在 GitHub 上创建新仓库（例如：dreamle-mining-new）
git remote add origin https://github.com/你的用户名/dreamle-mining-new.git
git branch -M main
git push -u origin main
```

#### 步骤 2: 在 Vercel 创建新项目

1. 访问 https://vercel.com/dashboard
2. 点击 **"Add New..."** → **"Project"**
3. 选择 **"Import Git Repository"**
4. 选择你刚创建的仓库（`dreamle-mining-new`）
5. 配置项目：
   - **Project Name**: `dreamle-mining-new`（或其他名称）
   - **Framework Preset**: `Other`
   - **Root Directory**: `./`（保持默认）
   - **Build Command**: 留空（静态网站）
   - **Output Directory**: `./`（保持默认）
6. 点击 **"Deploy"**

#### 步骤 3: 配置自定义域名（可选）

1. 部署完成后，进入项目设置
2. 点击 **"Domains"**
3. 添加你的自定义域名
4. 按照提示配置 DNS 记录

---

### 方法 2: 通过 Vercel CLI

#### 步骤 1: 安装 Vercel CLI

```bash
npm install -g vercel
```

#### 步骤 2: 登录 Vercel

```bash
vercel login
```

#### 步骤 3: 部署项目

```bash
cd /home/jzy/桌面/vercel/original
vercel
```

按照提示操作：
- **Set up and deploy?** → `Y`
- **Which scope?** → 选择你的账户
- **Link to existing project?** → `N`
- **What's your project's name?** → `dreamle-mining-new`
- **In which directory is your code located?** → `./`

#### 步骤 4: 生产环境部署

```bash
vercel --prod
```

---

## 📝 Vercel 配置文件（可选）

创建 `vercel.json` 文件以优化部署配置：

```json
{
  "version": 2,
  "name": "dreamle-mining-platform",
  "builds": [
    {
      "src": "**/*",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/",
      "dest": "/index.html"
    },
    {
      "src": "/platform",
      "dest": "/platform.html"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    },
    {
      "source": "/js/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/css/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/images/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

## 🔑 重要配置说明

### 1. 合约地址（BSC 主网）

文件：`config/contracts.js`

```javascript
const CONTRACTS = {
    UNIFIED_SYSTEM: '0xf9462c7fE57Fc7Aff662204228cCdCd0a9d3398A',
    DREAMLE_TOKEN: '0x4440409e078D44A63c72696716b84A46814717e9',
    USDT_TOKEN: '0x55d398326f99059fF775485246999027B3197955'
};

const ADMIN_ADDRESS = '0xfC3b7735Dae4C7AB3Ab85Ffa9987661e795B74b7';
```

### 2. RPC 端点配置

文件：`js/web3-config.js`

```javascript
const BSC_RPC_ENDPOINTS = [
    'https://lb.drpc.org/ogrpc?network=bsc&dkey=Ak765...',
    'https://bsc-dataseed1.binance.org/',
    'https://bsc-dataseed2.binance.org/',
    'https://bsc.publicnode.com'
];
```

### 3. 网络配置

- **Chain ID**: 56 (BSC Mainnet)
- **Currency**: BNB
- **Block Explorer**: https://bscscan.com

---

## ✅ 部署后验证清单

部署完成后，请验证以下功能：

### 主页 (index.html)
- [ ] 页面正常加载
- [ ] 导航栏功能正常
- [ ] 链接跳转到 platform.html 正常
- [ ] 图片资源加载正常

### 功能平台 (platform.html)
- [ ] 页面正常加载
- [ ] 钱包连接功能正常（MetaMask、Binance Wallet、OKX Wallet）
- [ ] 网络自动切换到 BSC 主网
- [ ] Token Exchange 功能正常
- [ ] Mining 功能正常
- [ ] Staking 功能正常
- [ ] Referral System 功能正常
- [ ] Admin Panel 功能正常（管理员钱包）

### 控制台检查
打开浏览器控制台（F12），检查：
- [ ] 无 JavaScript 错误
- [ ] 版本信息正确显示
- [ ] Web3 连接成功
- [ ] 合约地址正确

---

## 🚨 常见问题

### 1. 钱包连接失败
**原因**: RPC 端点不可用
**解决**: 检查 `js/web3-config.js` 中的 RPC 端点

### 2. 合约调用失败
**原因**: 合约地址错误或网络不匹配
**解决**: 确认 `config/contracts.js` 中的地址正确，网络为 BSC 主网

### 3. 图片加载失败
**原因**: 路径错误
**解决**: 确保 `images/` 目录已正确部署

### 4. 流动性池显示 "No Liquidity"
**原因**: 流动性池余额为 0
**解决**: 使用管理员钱包注入流动性（参考 `如何注入流动性到合约.md`）

---

## 📊 当前部署状态

### 现有部署
- **域名**: https://www.dreamle.vip
- **项目**: `backup`
- **仓库**: `hayajaiahk-code/dreamle-mining-backup`
- **最新提交**: `🔧 CRITICAL FIX: Remove platform redirect + add connection gates`
- **部署日期**: Oct 8, 2025

### 版本信息
- **应用版本**: `20251009-FINAL-FIX`
- **构建时间**: `2025-10-09 18:30:00`
- **包含修复**: 
  - 邀请系统重构
  - 未登录门禁
  - 语法错误修复
  - Platform 重定向移除
  - 连接门禁添加

---

## 🔄 更新部署

### 方法 1: Git Push（自动部署）

```bash
cd /home/jzy/桌面/vercel/original
git add .
git commit -m "Update: 描述你的更改"
git push origin main
```

Vercel 会自动检测到推送并重新部署。

### 方法 2: Vercel CLI

```bash
cd /home/jzy/桌面/vercel/original
vercel --prod
```

---

## 📞 技术支持

### 合约信息
- **Unified System**: https://bscscan.com/address/0xf9462c7fE57Fc7Aff662204228cCdCd0a9d3398A
- **DRM Token**: https://bscscan.com/address/0x4440409e078D44A63c72696716b84A46814717e9
- **USDT Token**: https://bscscan.com/address/0x55d398326f99059fF775485246999027B3197955

### 管理员钱包
- **地址**: `0xfC3b7735Dae4C7AB3Ab85Ffa9987661e795B74b7`

### 相关文档
- `如何注入流动性到合约.md` - 流动性注入指南
- `流动性池问题诊断报告.md` - 流动性问题诊断
- `SECURITY_FIX_2025-10-08.md` - 安全修复说明
- `FIX_SUMMARY_2025-10-08.md` - 修复总结

---

## 🎯 快速部署命令

```bash
# 1. 进入项目目录
cd /home/jzy/桌面/vercel/original

# 2. 确保所有更改已提交
git status
git add .
git commit -m "Prepare for new deployment"

# 3. 推送到新仓库
git remote add new-origin https://github.com/你的用户名/新仓库名.git
git push new-origin main

# 4. 在 Vercel Dashboard 导入新仓库
# 访问: https://vercel.com/new

# 5. 或使用 Vercel CLI
vercel
vercel --prod
```

---

## ✅ 部署完成后

1. **测试所有功能**
2. **配置自定义域名**（如果需要）
3. **设置环境变量**（如果有）
4. **配置 Analytics**（可选）
5. **设置部署通知**（可选）

---

**祝部署顺利！** 🚀

如有问题，请参考 Vercel 官方文档：https://vercel.com/docs

