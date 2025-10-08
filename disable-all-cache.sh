#!/bin/bash

# 🚫 完全禁用所有缓存脚本
# 用途: 确保用户总是获取最新的文件，不保存任何缓存

echo "╔═══════════════════════════════════════════════════════════════════════════╗"
echo "║                    🚫 完全禁用所有缓存                                      ║"
echo "╚═══════════════════════════════════════════════════════════════════════════╝"
echo ""

# 检查是否以 root 权限运行
if [ "$EUID" -ne 0 ]; then 
    echo "❌ 请使用 sudo 运行此脚本"
    echo "   sudo bash disable-all-cache.sh"
    exit 1
fi

# 步骤 1: 备份当前 Nginx 配置
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "步骤 1: 备份当前 Nginx 配置"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

BACKUP_DIR="/root/nginx-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

if [ -f /etc/nginx/sites-available/dreamle-mining ]; then
    cp /etc/nginx/sites-available/dreamle-mining "$BACKUP_DIR/dreamle-mining.bak"
    echo "✅ 已备份到: $BACKUP_DIR/dreamle-mining.bak"
else
    echo "⚠️  未找到现有配置文件"
fi
echo ""

# 步骤 2: 复制新配置到 Nginx
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "步骤 2: 应用无缓存配置"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f /root/dreamle-mining/nginx-optimized.conf ]; then
    cp /root/dreamle-mining/nginx-optimized.conf /etc/nginx/sites-available/dreamle-mining
    echo "✅ 配置文件已复制到 /etc/nginx/sites-available/dreamle-mining"
else
    echo "❌ 错误: 找不到 nginx-optimized.conf"
    exit 1
fi
echo ""

# 步骤 3: 测试 Nginx 配置
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "步骤 3: 测试 Nginx 配置"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

nginx -t
if [ $? -eq 0 ]; then
    echo "✅ Nginx 配置测试通过"
else
    echo "❌ Nginx 配置测试失败，正在恢复备份..."
    cp "$BACKUP_DIR/dreamle-mining.bak" /etc/nginx/sites-available/dreamle-mining
    echo "✅ 已恢复备份配置"
    exit 1
fi
echo ""

# 步骤 4: 重启 Nginx
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "步骤 4: 重启 Nginx"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

systemctl restart nginx
if [ $? -eq 0 ]; then
    echo "✅ Nginx 已成功重启"
else
    echo "❌ Nginx 重启失败"
    exit 1
fi
echo ""

# 步骤 5: 验证 Nginx 状态
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "步骤 5: 验证 Nginx 状态"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

systemctl status nginx --no-pager | head -n 10
echo ""

# 步骤 6: 测试缓存头部
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "步骤 6: 测试缓存头部"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "测试 HTML 文件缓存头部:"
curl -I https://dreamlewebai.com/ 2>/dev/null | grep -i "cache-control\|pragma\|expires" || echo "  (未找到缓存头部)"
echo ""

echo "测试 JS 文件缓存头部:"
curl -I https://dreamlewebai.com/js/core-functions.js 2>/dev/null | grep -i "cache-control\|pragma\|expires" || echo "  (未找到缓存头部)"
echo ""

echo "测试 CSS 文件缓存头部:"
curl -I https://dreamlewebai.com/styles.css 2>/dev/null | grep -i "cache-control\|pragma\|expires" || echo "  (未找到缓存头部)"
echo ""

# 完成
echo "╔═══════════════════════════════════════════════════════════════════════════╗"
echo "║                    ✅ 缓存已完全禁用                                        ║"
echo "╚═══════════════════════════════════════════════════════════════════════════╝"
echo ""
echo "📋 配置摘要:"
echo "   • 所有文件类型的缓存已完全禁用"
echo "   • Cache-Control: no-store, no-cache, must-revalidate"
echo "   • Pragma: no-cache"
echo "   • Expires: 0"
echo "   • ETag: 已禁用"
echo "   • If-Modified-Since: 已禁用"
echo ""
echo "⚠️  注意:"
echo "   • 用户每次访问都会重新下载所有文件"
echo "   • 这会增加服务器负载和用户流量消耗"
echo "   • 但确保用户总是看到最新版本"
echo ""
echo "🔄 如需恢复缓存，请运行:"
echo "   sudo cp $BACKUP_DIR/dreamle-mining.bak /etc/nginx/sites-available/dreamle-mining"
echo "   sudo nginx -t && sudo systemctl restart nginx"
echo ""

