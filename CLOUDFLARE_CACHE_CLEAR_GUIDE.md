# 🧹 Cloudflare CDN 缓存清理指南

**重要性**: 🔥🔥🔥 必须执行  
**原因**: 确保用户加载最新修复的代码

---

## 📋 为什么必须清理 CDN 缓存？

### 当前问题

1. **旧代码被缓存**
   - Cloudflare CDN 缓存了旧版本的 JS 文件
   - 用户访问时加载的是旧代码
   - 导致修复无法生效

2. **修改的文件**
   - `config/contracts.js` - RPC 节点配置
   - `js/core-functions.js` - 网络健康检查
   - 这些文件被 CDN 缓存了 30 天

3. **影响**
   - 欧易钱包用户仍然无法购买
   - 修复无法立即生效
   - 需要等待 30 天缓存过期

---

## 方法 1: 通过 Cloudflare Dashboard 清理（推荐）

### 步骤 1: 登录 Cloudflare

1. 访问: https://dash.cloudflare.com
2. 使用你的 Cloudflare 账号登录

### 步骤 2: 选择域名

1. 在域名列表中找到 `dreamlewebai.com`
2. 点击进入域名管理页面

### 步骤 3: 清除所有缓存

#### 选项 A: 清除所有内容（推荐）

```
1. 点击左侧菜单 "缓存" (Caching)
2. 找到 "清除缓存" (Purge Cache) 部分
3. 点击 "清除所有内容" (Purge Everything) 按钮
4. 确认清除
```

**优点**:
- ✅ 简单快速
- ✅ 确保所有文件都更新
- ✅ 不会遗漏任何文件

**缺点**:
- ⚠️ 会清除所有缓存
- ⚠️ 短期内 CDN 命中率降低

#### 选项 B: 清除特定文件（精确控制）

```
1. 点击左侧菜单 "缓存" (Caching)
2. 找到 "清除缓存" (Purge Cache) 部分
3. 选择 "自定义清除" (Custom Purge)
4. 选择 "按 URL" (By URL)
5. 输入以下 URL（每行一个）:
```

**需要清除的 URL**:
```
https://www.dreamlewebai.com/config/contracts.js
https://www.dreamlewebai.com/js/core-functions.js
https://www.dreamlewebai.com/js/web3-config.js
https://www.dreamlewebai.com/platform.html
https://www.dreamlewebai.com/index.html
```

```
6. 点击 "清除" (Purge) 按钮
7. 确认清除
```

**优点**:
- ✅ 只清除修改的文件
- ✅ 保留其他文件的缓存
- ✅ CDN 命中率影响小

**缺点**:
- ⚠️ 需要手动输入 URL
- ⚠️ 可能遗漏某些文件

### 步骤 4: 等待生效

```
清除缓存后，等待 30-60 秒
CDN 缓存清理需要一些时间传播到全球节点
```

### 步骤 5: 验证缓存已清理

**方法 A: 使用浏览器**
```
1. 打开浏览器（无痕模式）
2. 访问: https://www.dreamlewebai.com/platform.html
3. 按 F12 打开开发者工具
4. 切换到 "Network" 标签
5. 刷新页面 (Ctrl + Shift + R)
6. 查看 contracts.js 和 core-functions.js 的响应头
7. 应该看到 cf-cache-status: MISS（第一次）
8. 再次刷新，应该看到 cf-cache-status: HIT（第二次）
```

**方法 B: 使用命令行**
```bash
# 检查 contracts.js
curl -I https://www.dreamlewebai.com/config/contracts.js | grep cf-cache-status

# 检查 core-functions.js
curl -I https://www.dreamlewebai.com/js/core-functions.js | grep cf-cache-status

# 第一次应该显示: cf-cache-status: MISS
# 第二次应该显示: cf-cache-status: HIT
```

---

## 方法 2: 使用 Cloudflare API（自动化）

### 前提条件

1. 需要 Cloudflare API Token
2. 需要 Zone ID

### 获取 API Token

```
1. 登录 Cloudflare Dashboard
2. 点击右上角头像 → "我的个人资料" (My Profile)
3. 点击 "API 令牌" (API Tokens)
4. 点击 "创建令牌" (Create Token)
5. 选择 "编辑区域 DNS" (Edit zone DNS) 模板
6. 或者使用 "自定义令牌" 并添加权限:
   - Zone - Cache Purge - Purge
7. 复制生成的 API Token
```

### 获取 Zone ID

```
1. 登录 Cloudflare Dashboard
2. 选择域名: dreamlewebai.com
3. 在右侧 "API" 部分找到 "Zone ID"
4. 复制 Zone ID
```

### 使用 API 清除缓存

**清除所有缓存**:
```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/YOUR_ZONE_ID/purge_cache" \
     -H "Authorization: Bearer YOUR_API_TOKEN" \
     -H "Content-Type: application/json" \
     --data '{"purge_everything":true}'
```

**清除特定文件**:
```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/YOUR_ZONE_ID/purge_cache" \
     -H "Authorization: Bearer YOUR_API_TOKEN" \
     -H "Content-Type: application/json" \
     --data '{
       "files": [
         "https://www.dreamlewebai.com/config/contracts.js",
         "https://www.dreamlewebai.com/js/core-functions.js",
         "https://www.dreamlewebai.com/js/web3-config.js",
         "https://www.dreamlewebai.com/platform.html",
         "https://www.dreamlewebai.com/index.html"
       ]
     }'
```

---

## 方法 3: 使用自动化脚本

我已经为你创建了一个自动化脚本（需要 API Token）。

### 使用脚本

```bash
# 1. 编辑脚本，填入你的 API Token 和 Zone ID
nano /root/dreamle-mining/clear_cloudflare_cache.sh

# 2. 运行脚本
cd /root/dreamle-mining
./clear_cloudflare_cache.sh
```

---

## 📊 验证清理效果

### 检查清单

- [ ] Cloudflare 缓存已清理
- [ ] 等待 30-60 秒传播
- [ ] 验证 cf-cache-status: MISS（第一次）
- [ ] 验证 cf-cache-status: HIT（第二次）
- [ ] 测试网站访问正常
- [ ] 测试 JS 文件加载正常

### 验证命令

```bash
# 运行验证脚本
cd /root/dreamle-mining
./verify_cache_cleared.sh
```

---

## ⚠️ 注意事项

### 清除缓存后的影响

1. **短期影响**
   - CDN 命中率降低
   - 回源请求增加
   - 服务器负载略微增加

2. **持续时间**
   - 影响持续 1-2 小时
   - 之后 CDN 会重新缓存
   - 恢复正常性能

3. **用户体验**
   - 第一次访问可能稍慢（回源）
   - 后续访问恢复正常
   - 整体影响很小

### 最佳实践

1. **清除时机**
   - 选择低流量时段
   - 避免高峰期清除
   - 建议：凌晨或早上

2. **清除频率**
   - 不要频繁清除
   - 只在必要时清除
   - 建议：每次重大更新后

3. **验证**
   - 清除后必须验证
   - 确保缓存已清理
   - 测试用户访问

---

## 🎯 清除后的下一步

### 立即执行

1. **通知用户**
   - 发送通知给欧易钱包用户
   - 说明清理缓存步骤
   - 提供新 URL: `?v=20250930192000`

2. **监控效果**
   - 观察用户反馈
   - 监控错误日志
   - 统计购买成功率

3. **收集数据**
   - 记录 CDN 命中率
   - 记录回源请求数
   - 记录用户访问速度

### 本周完成

1. **配置缓存规则**
   - 设置 HTML 缓存策略
   - 设置 JS/CSS 缓存策略
   - 优化缓存时间

2. **添加性能监控**
   - 监控 RPC 节点
   - 监控钱包连接
   - 监控购买成功率

---

## 📞 需要帮助？

如果清除缓存遇到问题：

1. **无法登录 Cloudflare**
   - 检查账号密码
   - 尝试重置密码
   - 联系 Cloudflare 支持

2. **找不到清除缓存选项**
   - 确认账号权限
   - 确认域名已添加
   - 检查 Cloudflare 计划

3. **清除后仍然加载旧代码**
   - 等待更长时间（5-10 分钟）
   - 清理浏览器缓存
   - 使用无痕模式测试

---

## 📋 清理清单

### 准备工作

- [ ] 登录 Cloudflare Dashboard
- [ ] 找到 dreamlewebai.com 域名
- [ ] 确认有清除缓存权限

### 执行清理

- [ ] 点击 "缓存" 菜单
- [ ] 选择 "清除所有内容"
- [ ] 确认清除
- [ ] 等待 30-60 秒

### 验证清理

- [ ] 检查 cf-cache-status: MISS
- [ ] 测试网站访问
- [ ] 测试 JS 文件加载
- [ ] 确认修复生效

### 后续工作

- [ ] 通知用户
- [ ] 监控效果
- [ ] 收集反馈
- [ ] 优化缓存策略

---

**重要性**: 🔥🔥🔥 必须执行  
**预计时间**: 5-10 分钟  
**影响**: 确保修复立即生效

