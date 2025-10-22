# 💰 Buy DRM 界面集成指南

## 📋 概述

这是一个完全符合 Dreamle 网站风格的 DRM 代币购买界面，包含：
- ✨ 深色科技风格设计
- 🎨 渐变色彩和动画效果
- 📱 完全响应式设计
- 🔄 实时数据更新
- 📜 购买历史记录

---

## 🎯 功能特性

### 1. 价格信息展示
- 当前 DRM 价格（0.5 USDT/DRM）
- 可用 DRM 数量
- 销售状态（活跃/暂停）

### 2. 快捷购买选项
- 100 USDT → 200 DRM
- 500 USDT → 1,000 DRM
- 1,000 USDT → 2,000 DRM
- 5,000 USDT → 10,000 DRM
- 10,000 USDT → 20,000 DRM（最大）

### 3. 自定义金额购买
- 输入任意金额（10-10,000 USDT）
- 实时计算可获得的 DRM
- 智能输入验证

### 4. 购买统计
- 总售出 DRM
- 总收入 USDT
- 总购买次数

### 5. 购买历史
- 显示用户所有购买记录
- 包含时间、金额、获得的 DRM

---

## 📦 文件清单

已创建的文件：

```
vercel/original/
├── buy-drm-section.html          # 主界面 HTML
├── js/
│   ├── buy-drm-functions.js      # 购买功能 JavaScript
│   └── drm-sale-abi.js           # 合约 ABI
└── css/
    └── buy-drm-history.css       # 购买历史样式
```

---

## 🔧 集成步骤

### 步骤 1: 在 platform.html 中添加标签按钮

在 `<div class="tab-nav">` 中添加新的标签按钮：

```html
<div class="tab-nav">
    <button class="tab-btn active" onclick="switchTab('dashboard')">📊 Dashboard</button>
    <button class="tab-btn" onclick="switchTab('buy-miners')">🛒 Buy Miners</button>
    <button class="tab-btn" onclick="switchTab('miner-management')">🤖 Miner Management</button>
    <button class="tab-btn" onclick="switchTab('token-exchange')">🔄 Token Exchange</button>
    <button class="tab-btn" onclick="switchTab('referral-system')">👥 Referral System</button>
    
    <!-- 新增：Buy DRM 标签 -->
    <button class="tab-btn" onclick="switchTab('buy-drm')">💰 Buy DRM</button>
</div>
```

### 步骤 2: 引入 CSS 文件

在 `<head>` 部分添加：

```html
<!-- Buy DRM Styles -->
<link rel="stylesheet" href="css/buy-drm-history.css">
```

### 步骤 3: 引入 JavaScript 文件

在 `</body>` 之前添加（确保在 ethers.js 之后）：

```html
<!-- Buy DRM Scripts -->
<script src="js/drm-sale-abi.js"></script>
<script src="js/buy-drm-functions.js"></script>
```

### 步骤 4: 插入界面 HTML

将 `buy-drm-section.html` 的内容插入到其他 tab-content 区域之后：

```html
<!-- 在其他 tab-content 之后添加 -->
<!-- 💰 Buy DRM Section -->
<!-- 这里粘贴 buy-drm-section.html 的完整内容 -->
```

### 步骤 5: 初始化功能

在页面加载完成后初始化 Buy DRM 功能。在现有的初始化代码中添加：

```javascript
// 在 DOMContentLoaded 或 window.load 事件中添加
document.addEventListener('DOMContentLoaded', function() {
    // ... 其他初始化代码 ...
    
    // 初始化 Buy DRM 功能
    if (typeof window.initializeDRMSale === 'function') {
        window.initializeDRMSale();
        console.log('✅ Buy DRM initialized');
    }
});
```

### 步骤 6: 添加标签切换监听

确保切换到 Buy DRM 标签时刷新数据：

```javascript
// 在 switchTab 函数中添加
function switchTab(tabName) {
    // ... 现有的标签切换代码 ...
    
    // 如果切换到 Buy DRM 标签，刷新数据
    if (tabName === 'buy-drm') {
        if (typeof window.refreshDRMSaleData === 'function') {
            window.refreshDRMSaleData();
        }
        if (typeof window.loadPurchaseHistory === 'function') {
            window.loadPurchaseHistory();
        }
    }
}
```

---

## 🎨 样式说明

### 颜色方案
- 主色调：青色 (#00ffff) 和紫色 (#ff00ff)
- 背景：深色半透明 (rgba(10, 10, 15, 0.95))
- 边框：青色半透明 (rgba(0, 255, 255, 0.3))
- 文字：白色 (#ffffff) 和灰色 (#888)

### 动画效果
- 卡片悬停：上移 + 阴影
- 按钮悬停：缩放 + 发光
- 输入框聚焦：边框发光
- 加载动画：旋转效果

### 响应式设计
- 桌面：多列网格布局
- 平板：2列布局
- 手机：单列布局

---

## 🔌 合约配置

### BSC 测试网配置

```javascript
const DRM_SALE_CONFIG = {
    testnet: {
        chainId: 97,
        drmToken: "0x1C8c3e823F98EFEc34FEf5673b4d63a23A251224",
        testUsdt: "0x86d075bA497457C624Fe2003E7704C2Bd3F864d8",
        saleContract: "0x90f3BcB39eC97c98384Eb6056dfa65Fd2dd9A0bd",
        drmPrice: 0.5,
        minPurchase: 10,
        maxPurchase: 10000,
    }
};
```

### BSC 主网配置（待部署）

部署到主网后，更新以下配置：

```javascript
mainnet: {
    chainId: 56,
    drmToken: "YOUR_DRM_TOKEN_ADDRESS",
    usdt: "0x55d398326f99059fF775485246999027B3197955",
    saleContract: "YOUR_SALE_CONTRACT_ADDRESS",
    drmPrice: 0.5,
    minPurchase: 10,
    maxPurchase: 10000,
}
```

---

## 🧪 测试清单

### 功能测试
- [ ] 连接钱包
- [ ] 查看价格和可用数量
- [ ] 快捷购买按钮
- [ ] 自定义金额输入
- [ ] USDT 授权
- [ ] 购买 DRM
- [ ] 查看购买历史
- [ ] 查看统计数据

### 界面测试
- [ ] 桌面浏览器显示
- [ ] 平板显示
- [ ] 手机显示
- [ ] 深色模式
- [ ] 动画效果
- [ ] 响应式布局

### 错误处理测试
- [ ] 未连接钱包
- [ ] 网络错误
- [ ] 余额不足
- [ ] 授权失败
- [ ] 购买失败
- [ ] 超出限制

---

## 📱 移动端优化

### 触摸优化
- 按钮大小：最小 44x44px
- 间距：至少 8px
- 触摸反馈：active 状态

### 性能优化
- 懒加载：仅在切换到标签时加载数据
- 防抖：输入框计算延迟
- 节流：滚动事件优化

---

## 🔒 安全注意事项

### 前端验证
- ✅ 金额范围检查（10-10,000 USDT）
- ✅ 网络检查（BSC Testnet/Mainnet）
- ✅ 余额检查
- ✅ 授权检查

### 用户提示
- ⚠️ 确保有足够的 BNB 支付 gas
- ⚠️ 检查网络是否正确
- ⚠️ 确认交易前仔细检查金额

---

## 🐛 常见问题

### Q: 为什么看不到购买历史？
A: 确保已连接钱包，且该地址有购买记录。

### Q: 为什么无法购买？
A: 检查：
1. 钱包是否连接
2. 网络是否正确（BSC Testnet）
3. USDT 余额是否足够
4. BNB 余额是否足够支付 gas

### Q: 如何切换到主网？
A: 修改 `buy-drm-functions.js` 中的 `getCurrentDRMConfig()` 函数，返回 `mainnet` 配置。

---

## 📞 技术支持

如有问题，请查看：
- 浏览器控制台日志
- 网络请求
- 合约交互记录

---

## 🎉 完成！

按照以上步骤集成后，你的 Dreamle 平台将拥有一个功能完整、美观的 DRM 购买界面！

**祝你使用愉快！** 🚀

