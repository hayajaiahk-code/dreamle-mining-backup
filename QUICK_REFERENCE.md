# ⚡ 快速参考卡片 - Dreamle Platform

> **用途**: Augment AI 快速查找关键信息
> **最后更新**: 2025-10-22 17:30
> **最新修改**: 移除法律警告横幅，保留免责声明页面

---

## 🆕 最新修改记录（2025-10-22）

### ✅ 已完成的修改

1. **法律免责声明系统**
   - ✅ 创建了 `legal-disclaimer.html` 完整免责声明页面
   - ✅ 页脚添加了 "Legal Disclaimer" 链接（红色高亮）
   - ✅ **已隐藏**页面顶部和页脚的红色警告横幅（用户要求）
   - 📍 位置：`index.html` 页脚、`buy-drm-preview.html` 顶部（已删除）

2. **页脚链接更新**
   - ✅ 删除了 404 链接（Privacy Policy, Terms of Service）
   - ✅ 更新为：Legal Disclaimer, Developer Contact, Telegram
   - 📧 开发者邮箱：hayajaiahk@gmail.com
   - 💬 Telegram：@PandaBlock_Labs

3. **PWA 注释清理**
   - ✅ 删除了页面底部显示的 PWA 注释
   - 📍 位置：`index.html` 之前的 2835-2837 行

4. **Vercel 项目清理**
   - ✅ 删除了多余的 `dreamle-drm` 项目
   - ✅ 只保留 `backup` 项目

### 📝 重要文件

| 文件 | 状态 | 说明 |
|------|------|------|
| `legal-disclaimer.html` | ✅ 新建 | 完整的法律免责声明页面（中英文） |
| `index.html` | ✅ 修改 | 页脚更新，警告横幅已删除 |
| `buy-drm-preview.html` | ✅ 修改 | 顶部警告横幅已删除 |

---

## 🎯 最常用的文件

```
platform.html           - 主平台页面（挖矿、质押、管理）
buy-drm-preview.html    - DRM 购买页面（独立）
js/buy-drm-functions.js - DRM 购买逻辑
js/core-functions.js    - 核心挖矿功能
js/web3-config.js       - Web3 配置
platform.css            - 主样式文件
```

---

## 🔗 关键代码位置

### DRM 购买按钮（platform.html）
- **位置**: 第 3513 行
- **代码**:
```html
<a href="buy-drm-preview.html?v=28" class="tab-btn tab-link-external" 
   target="_blank" onclick="event.stopPropagation();">💎 Buy DRM</a>
```

### 合约地址配置（buy-drm-preview.html）
- **位置**: 第 1100-1103 行
- **代码**:
```javascript
const SALE_CONTRACT_ADDRESS = '0x1C8c3e823F98EFEc34FEf5673b4d63a23A251224';
const DRM_TOKEN_ADDRESS = '0x4440409e078D44A63c72696716b84A46814717e9';
const USDT_TOKEN_ADDRESS = '0x55d398326f99059fF775485246999027B3197955';
```

### Tab 切换逻辑（platform.html）
- **位置**: 第 5509-5533 行
- **关键**: 检查 `tab-link-external` class 跳过外部链接

### Buy Now 按钮样式（buy-drm-preview.html）
- **位置**: 第 733-812 行
- **样式**: 渐变背景 `linear-gradient(135deg, #00ffff, #ff00ff)`

---

## 🌐 部署命令

### Vercel 部署
```bash
# 1. 确认账户
vercel whoami
# 应显示: hayajaiahk-1711

# 2. 部署到生产环境
cd vercel/original
vercel deploy --prod

# 3. 查看部署列表
vercel ls
```

### GitHub 备份
```bash
# 1. 查看状态
cd vercel/original
git status

# 2. 提交更改
git add .
git commit -m "描述修改内容"

# 3. 推送到备份仓库
git push backup main
```

---

## 🔧 常见修改任务

### 任务 1: 修改合约地址
1. 打开 `buy-drm-preview.html`
2. 找到第 1100-1103 行
3. 修改合约地址
4. 同时检查 `js/buy-drm-functions.js` 第 132 行

### 任务 2: 修改按钮样式
1. 打开 `buy-drm-preview.html`
2. 找到第 733-812 行（`.buy-btn-large` 样式）
3. 修改 `background`、`color`、`padding` 等属性

### 任务 3: 添加新导航按钮
1. 打开 `platform.html`
2. 找到第 3513 行附近
3. 复制现有按钮代码
4. **重要**: 添加 `class="tab-btn tab-link-external"`
5. 添加 `onclick="event.stopPropagation();"`

### 任务 4: 修复白色背景
1. 搜索文件中的 `background.*white` 或 `background.*rgba\(255`
2. 替换为深色背景：
   - `background: rgba(0, 0, 0, 0.3)` - 半透明黑色
   - `background: transparent` - 透明
   - `background: linear-gradient(...)` - 渐变

---

## 🚨 故障排查

### 问题: 点击按钮没反应
**检查**:
1. 浏览器控制台是否有错误？
2. 是否清除了缓存？（Ctrl + Shift + R）
3. URL 是否添加了版本号？（`?v=xx`）

### 问题: 合约调用失败
**检查**:
1. 合约地址是否正确？
2. 网络是否为 BSC Mainnet (Chain ID: 56)？
3. 钱包是否有足够的 BNB（Gas 费）？
4. 控制台日志显示什么错误？

### 问题: 样式不生效
**检查**:
1. CSS 选择器是否正确？
2. 是否有内联样式覆盖？
3. 是否清除了浏览器缓存？
4. 是否有更高优先级的样式？

### 问题: Tab 切换错误
**检查**:
1. 外部链接是否添加了 `tab-link-external` class？
2. 是否添加了 `onclick="event.stopPropagation();"`？
3. 查看 `platform.html` 第 5509-5533 行的逻辑

---

## 📊 合约信息（BSC Mainnet）

### DRM 购买系统
```
Sale Contract:  0x1C8c3e823F98EFEc34FEf5673b4d63a23A251224
DRM Token:      0x4440409e078D44A63c72696716b84A46814717e9
USDT Token:     0x55d398326f99059fF775485246999027B3197955
```

### 挖矿系统
```
Main Contract:  (查看 js/web3-config.js)
Dreamle Token:  (查看 js/web3-config.js)
```

---

## 🔑 账户信息

### Vercel Pro
```
用户名: hayajaiahk-1711
邮箱:   hayajaiahk@gmail.com
项目:   backup
域名:   www.dreamle.vip
```

### GitHub
```
用户名: hayajaiahk-code
邮箱:   hayajaiahk@gmail.com
仓库:   dreamle-mining-backup
分支:   main
```

---

## 📝 Git 工作流

### 标准流程
```bash
# 1. 查看状态
git status

# 2. 添加文件
git add .

# 3. 提交（使用有意义的消息）
git commit -m "✨ 添加新功能: XXX"
# 或
git commit -m "🐛 修复: XXX 问题"
# 或
git commit -m "🎨 优化: XXX 样式"

# 4. 推送到备份仓库
git push backup main
```

### Commit 消息规范
```
✨ 新功能
🐛 Bug 修复
🎨 样式优化
🔧 配置修改
📝 文档更新
🚀 性能优化
♻️  代码重构
🔥 删除代码/文件
```

---

## 🛠️ 开发工具

### 本地测试服务器
```bash
# Python 3
python3 -m http.server 8888

# 访问
http://localhost:8888/vercel/original/platform.html
http://localhost:8888/vercel/original/buy-drm-preview.html
```

### 浏览器开发者工具
```
F12              - 打开开发者工具
Ctrl + Shift + R - 强制刷新（清除缓存）
Ctrl + Shift + C - 元素选择器
Ctrl + Shift + I - 检查元素
```

---

## 🔍 搜索技巧

### 查找合约地址
```bash
grep -r "0x1C8c3e823F98EFEc34FEf5673b4d63a23A251224" .
```

### 查找函数定义
```bash
grep -r "function buyDRM" js/
```

### 查找样式类
```bash
grep -r "\.buy-btn-large" .
```

### 查找白色背景
```bash
grep -r "background.*white" . --include="*.html" --include="*.css"
```

---

## 📚 重要文档

### 必读文档
1. `PROJECT_STRUCTURE_GUIDE.md` - 完整项目结构指南
2. `BUY_DRM_INTEGRATION_GUIDE.md` - DRM 购买集成指南
3. `VERCEL部署指南.md` - Vercel 部署详细说明

### 问题修复文档
1. `深色主题修复总结.md` - 白色背景修复
2. `OKX_WALLET_FIX_SUMMARY.md` - OKX 钱包问题
3. `BINANCE_WALLET_TEST_GUIDE.md` - Binance 钱包测试

---

## 🎯 常见修改任务（快速指南）

### 1️⃣ 修改页脚链接
**文件**: `index.html`, `buy-drm-preview.html`, `platform.html`
**位置**: 搜索 `footer-legal` 或 `footer-bottom`
**示例**:
```html
<div class="footer-legal">
    <a href="legal-disclaimer.html">⚖️ Legal Disclaimer</a>
    <a href="mailto:hayajaiahk@gmail.com">📧 Developer Contact</a>
    <a href="https://t.me/PandaBlock_Labs">💬 Telegram</a>
</div>
```

### 2️⃣ 添加/删除警告横幅
**文件**: `index.html` (页脚上方), `buy-drm-preview.html` (顶部)
**当前状态**: 已删除所有警告横幅
**如需恢复**: 查看 Git 历史 `git log --oneline | grep "法律警告"`

### 3️⃣ 修改合约地址
**文件**: `buy-drm-preview.html` (行 1100-1103)
**重要**: 同时检查 `js/buy-drm-functions.js` 确保一致
```javascript
const SALE_CONTRACT_ADDRESS = '0x1C8c3e823F98EFEc34FEf5673b4d63a23A251224';
const DRM_TOKEN_ADDRESS = '0x4440409e078D44A63c72696716b84A46814717e9';
const USDT_TOKEN_ADDRESS = '0x55d398326f99059fF775485246999027B3197955';
```

### 4️⃣ 修改按钮样式（避免白色背景）
**原则**: 使用渐变或透明背景，避免 `#fff` 或 `rgba(255,255,255,x)`
**推荐样式**:
```css
background: linear-gradient(135deg, #00ffff, #ff00ff);  /* 青紫渐变 */
background: rgba(0, 0, 0, 0.3);  /* 半透明黑色 */
background: transparent;  /* 完全透明 */
```

### 5️⃣ 添加新页面到导航
**文件**: `platform.html` (搜索 `tab-buttons`)
**注意**: 外部链接需要添加 `tab-link-external` class
```html
<a href="new-page.html" class="tab-btn tab-link-external"
   target="_blank" onclick="event.stopPropagation();">🆕 New Page</a>
```

---

## ⚡ 紧急修复流程

### 生产环境出现问题
```bash
# 1. 立即回滚到上一个版本
vercel rollback

# 2. 在本地修复问题
# ... 修改代码 ...

# 3. 本地测试
python3 -m http.server 8888

# 4. 确认修复后重新部署
vercel deploy --prod

# 5. 备份到 GitHub
git add .
git commit -m "🐛 紧急修复: XXX"
git push backup main
```

---

## 🎓 学习资源

### Web3 相关
- Ethers.js 文档: https://docs.ethers.org/v5/
- BSC 文档: https://docs.bnbchain.org/

### Vercel 相关
- Vercel 文档: https://vercel.com/docs
- Vercel CLI: https://vercel.com/docs/cli

### Git 相关
- Git 基础: https://git-scm.com/book/zh/v2

---

## 💡 最佳实践

1. **修改前备份**: 重要文件修改前先备份
2. **本地测试**: 部署前在本地测试
3. **小步提交**: 每次只修改一个功能
4. **清晰注释**: 添加清晰的代码注释
5. **版本控制**: 使用版本号避免缓存问题
6. **文档更新**: 修改后更新相关文档

---

**最后更新**: 2025-10-22  
**维护者**: Augment AI

