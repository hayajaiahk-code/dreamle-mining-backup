# 🚀 服务器性能优化指南

**目标**: 最大化服务器性能，加速币安钱包等 DApp 浏览器的访问速度

---

## 📊 当前服务器配置

- **CPU**: 4 核心 ✅
- **内存**: 15GB（可用 12GB）✅
- **磁盘**: 197GB（可用 181GB）✅
- **网络**: 待测试

**结论**: 硬件配置充足，可以进行深度优化！

---

## 🎯 优化目标

### 当前性能
- 页面加载时间: ~5-10 秒（币安钱包）
- 首屏渲染: ~3-5 秒
- 资源加载: 20+ 个 JS 文件

### 优化后目标
- 页面加载时间: **< 2 秒** ⚡
- 首屏渲染: **< 1 秒** ⚡
- 资源加载: 优化合并，减少请求数

---

## 🔧 优化步骤

### 第一步：应用 Nginx 优化配置

```bash
# 1. 给脚本执行权限
chmod +x optimize-server.sh

# 2. 运行优化脚本（自动备份 + 优化）
sudo bash optimize-server.sh
```

**优化内容**:
- ✅ 启用 HTTP/2（多路复用，减少连接数）
- ✅ Gzip 压缩级别提升到 9（最大压缩）
- ✅ SSL 会话缓存（减少握手时间）
- ✅ 文件缓存优化（减少磁盘 I/O）
- ✅ TCP 参数优化（减少延迟）
- ✅ 连接池优化（提升并发）

---

### 第二步：系统参数优化

优化脚本会自动配置以下参数：

```bash
# 网络优化
net.core.somaxconn = 65535  # 增加连接队列
net.ipv4.tcp_max_syn_backlog = 65535  # 增加 SYN 队列

# TCP 优化
net.ipv4.tcp_fin_timeout = 30  # 减少 TIME_WAIT 时间
net.ipv4.tcp_tw_reuse = 1  # 重用 TIME_WAIT 连接

# 文件描述符
fs.file-max = 2097152  # 增加最大文件数
```

---

### 第三步：清理 Cloudflare CDN 缓存

```bash
# 登录 Cloudflare 控制台
# 1. 进入 dreamlewebai.com 域名
# 2. 点击 "Caching" → "Configuration"
# 3. 点击 "Purge Everything"（清除所有缓存）
# 4. 等待 30 秒让 CDN 重新缓存
```

**为什么要清理 CDN 缓存？**
- CDN 可能缓存了旧版本的文件
- 清理后会重新缓存优化后的文件（Gzip 压缩）
- 确保用户获取最新、最优化的资源

---

### 第四步：前端资源优化

#### 4.1 禁用移动端 3D 效果

3D 背景效果（Three.js）在移动端非常耗性能，建议禁用：

```javascript
// 检测移动端 DApp 浏览器
const isMobileDApp = /Android|iPhone|iPad/i.test(navigator.userAgent) && 
                     (window.BinanceChain || window.okxwallet);

if (!isMobileDApp) {
    // 只在桌面端加载 3D 效果
    loadThreeJS();
}
```

**性能提升**: 减少 ~500KB 加载，节省 ~1 秒

#### 4.2 延迟加载非关键 JS

```html
<!-- 关键 JS：立即加载 -->
<script src="js/web3-config.js"></script>
<script src="js/core-functions.js"></script>

<!-- 非关键 JS：延迟加载 -->
<script defer src="js/admin-functions.js"></script>
<script defer src="js/referral-system.js"></script>
```

**性能提升**: 首屏渲染提前 ~2 秒

#### 4.3 使用 WebP 图片

```bash
# 已有 WebP 图片，只需修改引用
# images/miners/1.png → images/miners/1.webp
```

**性能提升**: 图片大小减少 95%（2MB → 100KB）

---

## 📈 性能对比

### 优化前
```
页面大小: ~5MB
加载时间: ~10 秒（4G 网络）
请求数: 25+
首屏渲染: ~5 秒
```

### 优化后（预期）
```
页面大小: ~1MB（减少 80%）
加载时间: ~2 秒（减少 80%）
请求数: 15-（减少 40%）
首屏渲染: ~1 秒（减少 80%）
```

---

## 🧪 测试方法

### 方法 1: Chrome DevTools

```bash
1. 打开 Chrome 浏览器
2. 按 F12 打开开发者工具
3. 切换到 "Network" 标签
4. 选择 "Fast 3G" 或 "Slow 3G"
5. 刷新页面（Ctrl+Shift+R）
6. 查看加载时间和资源大小
```

### 方法 2: 币安钱包实测

```bash
1. 打开币安钱包 DApp 浏览器
2. 清除缓存（设置 → 清除缓存）
3. 访问 https://dreamlewebai.com/platform.html
4. 计时页面加载时间
5. 检查是否流畅
```

### 方法 3: 在线测试工具

- **GTmetrix**: https://gtmetrix.com
- **PageSpeed Insights**: https://pagespeed.web.dev
- **WebPageTest**: https://www.webpagetest.org

---

## 🔍 监控和调试

### 查看 Nginx 状态

```bash
# 查看 Nginx 运行状态
sudo systemctl status nginx

# 查看 Nginx 错误日志
sudo tail -f /var/log/nginx/dreamle-error.log

# 查看 Nginx 访问日志
sudo tail -f /var/log/nginx/dreamle-access.log
```

### 查看系统性能

```bash
# CPU 使用率
top

# 内存使用
free -h

# 磁盘 I/O
iostat -x 1

# 网络连接
ss -s
```

### 查看 Nginx 连接数

```bash
# 当前连接数
ss -s | grep tcp

# Nginx 工作进程
ps aux | grep nginx
```

---

## 🚨 故障恢复

如果优化后出现问题，可以快速恢复：

```bash
# 1. 找到备份目录
ls -la /root/nginx-backup-*

# 2. 恢复配置
BACKUP_DIR="/root/nginx-backup-YYYYMMDD-HHMMSS"  # 替换为实际目录
sudo cp $BACKUP_DIR/dreamle-mining.bak /etc/nginx/sites-available/dreamle-mining

# 3. 测试配置
sudo nginx -t

# 4. 重启 Nginx
sudo systemctl restart nginx
```

---

## 📋 优化检查清单

### 服务器端
- [ ] 运行 `optimize-server.sh` 脚本
- [ ] 验证 Nginx 配置正确
- [ ] 检查 Nginx 成功重启
- [ ] 验证 HTTP/2 已启用
- [ ] 验证 Gzip 压缩工作正常

### CDN 端
- [ ] 清理 Cloudflare CDN 缓存
- [ ] 验证 CDN 缓存已更新
- [ ] 检查 CDN 响应头

### 前端
- [ ] 禁用移动端 3D 效果
- [ ] 延迟加载非关键 JS
- [ ] 使用 WebP 图片
- [ ] 添加图片懒加载

### 测试
- [ ] Chrome DevTools 测试
- [ ] 币安钱包实测
- [ ] 在线性能测试
- [ ] 多地区访问测试

---

## 💡 进阶优化建议

### 1. 启用 Brotli 压缩

Brotli 比 Gzip 压缩率更高（~20% 更好）：

```bash
# 安装 Brotli 模块
sudo apt install nginx-module-brotli

# 在 Nginx 配置中启用
brotli on;
brotli_comp_level 6;
```

### 2. 使用 Redis 缓存

缓存频繁访问的数据：

```bash
# 安装 Redis
sudo apt install redis-server

# 配置 Nginx 使用 Redis 缓存
```

### 3. 启用 HTTP/3（QUIC）

下一代 HTTP 协议，更快：

```bash
# 需要编译支持 QUIC 的 Nginx
# 或使用 Cloudflare 的 HTTP/3
```

---

## 🎯 预期效果

### 币安钱包访问速度
- **优化前**: 5-10 秒加载，卡顿
- **优化后**: 1-2 秒加载，流畅 ✅

### 用户体验
- **优化前**: 白屏时间长，用户等待
- **优化后**: 快速显示，无感知加载 ✅

### 服务器负载
- **优化前**: CPU 使用率 30-40%
- **优化后**: CPU 使用率 10-20% ✅

---

## 📞 支持

如果遇到问题：
1. 检查 Nginx 错误日志
2. 验证配置文件语法
3. 从备份恢复配置
4. 联系技术支持

---

**准备好了吗？运行优化脚本开始加速！** 🚀

```bash
sudo bash optimize-server.sh
```

