# 📝 更新日志 - Dreamle Mining Platform

> **用途**: 记录所有重要修改，帮助 Augment AI 快速了解项目历史  
> **格式**: 最新的修改在最上面

---

## 2025-10-22 17:30 - 法律免责声明 + 警告横幅处理

### ✅ 新增功能
- 创建 `legal-disclaimer.html` - 完整的法律免责声明页面
  - 中英文双语
  - 教育目的声明
  - 地区限制（明确禁止中国用户）
  - 风险警告
  - 开发者联系方式（hayajaiahk@gmail.com, @PandaBlock_Labs）

### 🔄 修改内容
- `index.html`:
  - 页脚添加 "Legal Disclaimer" 链接（红色高亮）
  - 更新开发者联系方式
  - **删除了页脚上方的红色警告横幅**（用户要求）
  - 删除了页面底部显示的 PWA 注释

- `buy-drm-preview.html`:
  - **删除了顶部的法律警告横幅**（用户要求）

### 🗑️ 删除内容
- 删除了所有 404 链接（Privacy Policy, Terms of Service）
- 删除了页面上的警告横幅（保留免责声明页面）
- 删除了 PWA 相关注释

### 📦 部署
- ✅ 部署到 Vercel 生产环境：www.dreamle.vip
- ✅ 备份到 GitHub：hayajaiahk-code/dreamle-mining-backup

### 💡 重要说明
- 免责声明页面仍然存在，可通过页脚链接访问
- 警告横幅已按用户要求全部删除
- 如需恢复警告横幅，查看 Git 历史：`git log --oneline | grep "法律警告"`

---

## 2025-10-22 早些时候 - Vercel 账户切换 + 项目清理

### 🔄 部署变更
- 从 Hobby 账户（hyptqi-8090）切换到 Pro 账户（hayajaiahk-1711）
- 删除了误创建的 `dreamle-drm` 项目
- 保留 `backup` 项目作为唯一生产项目

### 📝 文档创建
- 创建 `PROJECT_STRUCTURE_GUIDE.md` - 完整项目结构指南
- 创建 `QUICK_REFERENCE.md` - 快速参考卡片

### 🐛 Bug 修复
- 修复了页面底部显示 PWA 注释的问题
- 修复了页脚 404 链接问题

---

## 之前的修改（详见其他文档）

### DRM 购买系统修复
- 合约地址配置修复
- USDT 合约引用错误修复
- 白色背景样式修复
- 导航按钮集成

### 深色主题优化
- 删除所有白色半透明背景
- 统一使用渐变或透明背景
- 详见：`深色主题修复总结.md`

### 钱包集成
- OKX Wallet 支持
- Binance Wallet 测试
- MetaMask 优化
- 详见：`OKX_WALLET_FIX_SUMMARY.md`, `BINANCE_WALLET_TEST_GUIDE.md`

---

## 📋 快速查找

### 查看特定修改
```bash
# 查看法律免责声明相关提交
git log --oneline | grep "法律\|免责\|Legal"

# 查看最近 10 次提交
git log --oneline -10

# 查看某个文件的修改历史
git log --oneline -- index.html
```

### 回滚到之前的版本
```bash
# 查看提交历史
git log --oneline

# 回滚到特定提交（不删除历史）
git revert <commit-hash>

# 或者硬回滚（危险！会删除历史）
git reset --hard <commit-hash>
git push backup main --force
```

---

## 🎯 下次修改建议

### 如果需要恢复警告横幅
1. 查看 Git 历史找到添加警告横幅的提交
2. 使用 `git show <commit-hash>` 查看代码
3. 复制相关代码到当前文件
4. 部署并测试

### 如果需要修改免责声明内容
1. 编辑 `legal-disclaimer.html`
2. 修改中英文内容
3. 测试链接和样式
4. 部署到 Vercel

### 如果需要添加新的法律页面
1. 参考 `legal-disclaimer.html` 的结构
2. 保持深色主题和渐变样式
3. 在页脚添加链接
4. 更新本文档

---

## 📞 联系信息

**开发者**:
- 📧 Email: hayajaiahk@gmail.com
- 💬 Telegram: @PandaBlock_Labs

**项目仓库**:
- 🔗 GitHub: https://github.com/hayajaiahk-code/dreamle-mining-backup
- 🌐 生产环境: https://www.dreamle.vip

---

**最后更新**: 2025-10-22 17:30

