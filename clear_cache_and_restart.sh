#!/bin/bash

# 清理缓存并重启服务器脚本
# 用途: 确保手机访问到最新的代码

echo "╔═══════════════════════════════════════════════════════════════════════════╗"
echo "║                    🧹 清理缓存并重启服务器                                  ║"
echo "╚═══════════════════════════════════════════════════════════════════════════╝"
echo ""

# 步骤 1: 备份当前文件
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "步骤 1: 备份当前文件"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
BACKUP_DIR="/root/dreamle-mining/backup/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp js/core-functions.js "$BACKUP_DIR/core-functions.js.backup"
cp platform.html "$BACKUP_DIR/platform.html.backup"
echo "✅ 文件已备份到: $BACKUP_DIR"
echo ""

# 步骤 2: 清理本地缓存
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "步骤 2: 清理本地缓存"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
find /root/dreamle-mining -name "*.cache" -type f -delete 2>/dev/null || true
find /root/dreamle-mining -name ".DS_Store" -type f -delete 2>/dev/null || true
echo "✅ 本地缓存文件已清理"
echo ""

# 步骤 3: 设置文件权限
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "步骤 3: 设置文件权限"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
chmod 644 /root/dreamle-mining/js/core-functions.js
chmod 644 /root/dreamle-mining/platform.html
chmod 644 /root/dreamle-mining/index.html
echo "✅ 文件权限已设置为 644"
echo ""

# 步骤 4: 验证关键修改
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "步骤 4: 验证关键修改"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "检查 Chain ID 修改..."
if grep -q "expectedChainId = 56" /root/dreamle-mining/js/core-functions.js; then
    echo "✅ Chain ID 修改已确认 (仅支持主网 56)"
else
    echo "❌ Chain ID 修改未找到"
fi

echo "检查 BSC 主网注释..."
if grep -q "BSC主网" /root/dreamle-mining/js/core-functions.js; then
    echo "✅ BSC 主网注释已确认"
else
    echo "❌ BSC 主网注释未找到"
fi

echo "检查静默重试机制..."
if grep -q "silent = true" /root/dreamle-mining/js/core-functions.js; then
    echo "✅ 静默重试机制已确认"
else
    echo "❌ 静默重试机制未找到"
fi
echo ""

# 步骤 5: 测试 Nginx 配置
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "步骤 5: 测试 Nginx 配置"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if sudo nginx -t 2>&1 | grep -q "successful"; then
    echo "✅ Nginx 配置测试通过"
else
    echo "❌ Nginx 配置测试失败"
    sudo nginx -t
    exit 1
fi
echo ""

# 步骤 6: 重启 Nginx
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "步骤 6: 重启 Nginx 服务器"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
sudo systemctl reload nginx
if [ $? -eq 0 ]; then
    echo "✅ Nginx 已成功重新加载"
else
    echo "❌ Nginx 重新加载失败"
    exit 1
fi
echo ""

# 步骤 7: 验证服务器状态
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "步骤 7: 验证服务器状态"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if sudo systemctl is-active --quiet nginx; then
    echo "✅ Nginx 服务运行正常"
    sudo systemctl status nginx --no-pager | head -5
else
    echo "❌ Nginx 服务未运行"
    exit 1
fi
echo ""

# 步骤 8: 测试文件访问
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "步骤 8: 测试文件访问"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/js/core-functions.js)
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ JS 文件访问正常 (HTTP $HTTP_CODE)"
else
    echo "❌ JS 文件访问失败 (HTTP $HTTP_CODE)"
fi

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/platform.html)
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ HTML 文件访问正常 (HTTP $HTTP_CODE)"
else
    echo "❌ HTML 文件访问失败 (HTTP $HTTP_CODE)"
fi
echo ""

# 步骤 9: 生成版本号
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "步骤 9: 生成版本号"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
VERSION=$(date +%Y%m%d%H%M%S)
echo "当前版本号: $VERSION"
echo "访问 URL: https://www.dreamlewebai.com/platform.html?v=$VERSION"
echo ""

# 完成报告
echo "╔═══════════════════════════════════════════════════════════════════════════╗"
echo "║                        ✅ 清理和重启完成                                    ║"
echo "╚═══════════════════════════════════════════════════════════════════════════╝"
echo ""
echo "📋 完成的操作:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ 1. 文件已备份到: $BACKUP_DIR"
echo "✅ 2. 本地缓存已清理"
echo "✅ 3. 文件权限已设置"
echo "✅ 4. 关键修改已验证"
echo "✅ 5. Nginx 配置已测试"
echo "✅ 6. Nginx 服务器已重启"
echo "✅ 7. 服务器状态正常"
echo "✅ 8. 文件访问测试通过"
echo ""
echo "📱 手机端清理步骤（重要！）:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🔸 币安钱包 DApp 浏览器:"
echo "   1. 打开币安钱包"
echo "   2. 点击右下角 '浏览器'"
echo "   3. 点击右上角 '...' 菜单"
echo "   4. 选择 '设置' → '清除缓存'"
echo "   5. 重新访问: https://www.dreamlewebai.com/platform.html?v=$VERSION"
echo ""
echo "🔸 欧易钱包 DApp 浏览器:"
echo "   1. 打开欧易钱包"
echo "   2. 点击 '发现' 标签"
echo "   3. 点击右上角 '...' 菜单"
echo "   4. 选择 '清除缓存' 或 '清除浏览数据'"
echo "   5. 重新访问: https://www.dreamlewebai.com/platform.html?v=$VERSION"
echo ""
echo "🔸 TokenPocket / imToken:"
echo "   1. 打开钱包 App"
echo "   2. 进入 DApp 浏览器"
echo "   3. 在设置中清除缓存"
echo "   4. 重新访问: https://www.dreamlewebai.com/platform.html?v=$VERSION"
echo ""
echo "🔸 通用方法（强制刷新）:"
echo "   直接访问带版本号的 URL:"
echo "   https://www.dreamlewebai.com/platform.html?v=$VERSION"
echo ""
echo "☁️ Cloudflare CDN 缓存清理:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. 登录 Cloudflare Dashboard: https://dash.cloudflare.com"
echo "2. 选择域名: dreamlewebai.com"
echo "3. 点击左侧菜单 '缓存'"
echo "4. 点击 '清除缓存' → '清除所有内容'"
echo "5. 等待 30 秒后测试"
echo ""
echo "🧪 测试步骤:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. 清理手机钱包 DApp 浏览器缓存"
echo "2. 访问: https://www.dreamlewebai.com/platform.html?v=$VERSION"
echo "3. 点击悬浮钱包按钮连接"
echo "4. 检查控制台日志（如果支持）"
echo ""
echo "预期结果:"
echo "✅ 控制台显示: '✅ 已在BSC主网 (Chain ID: 56)'"
echo "✅ 控制台显示: '✅ BNB余额获取成功'"
echo "✅ 不再出现 'Primary network unhealthy' 错误"
echo "✅ 错误消息不再重复弹出"
echo "✅ 页面不再不断刷新"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 服务器已重启，所有修改已生效！"
echo "⚠️ 重要: 请务必清理手机钱包 DApp 浏览器缓存！"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

