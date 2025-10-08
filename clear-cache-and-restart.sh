#!/bin/bash

# 🧹 清理缓存并重启服务器脚本
# 用于解决币安/欧意钱包缓存问题

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧹 开始清理缓存并重启服务..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 1. 更新版本号
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
echo "🔖 更新版本号: $TIMESTAMP"
cat > version.js << EOF
// 🔖 应用版本控制
window.APP_VERSION = '$TIMESTAMP';
window.APP_BUILD_TIME = '$(date '+%Y-%m-%d %H:%M:%S')';

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🔖 应用版本:', window.APP_VERSION);
console.log('🕐 构建时间:', window.APP_BUILD_TIME);
console.log('📱 修复内容: 币安刷新问题 + 欧意选择器 + USDT池偏移');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
EOF
echo "✅ 版本号已更新: $TIMESTAMP"
echo ""

# 2. 检测并清理 Nginx 缓存
if command -v nginx &> /dev/null; then
    echo "🔍 检测到 Nginx"
    
    if [ -d "/var/cache/nginx" ]; then
        echo "🧹 清理 Nginx 缓存..."
        sudo rm -rf /var/cache/nginx/*
        echo "✅ Nginx 缓存已清理"
    fi
    
    echo "🔄 重新加载 Nginx..."
    sudo nginx -s reload
    echo "✅ Nginx 已重新加载"
    echo ""
fi

# 3. 检测并清理 Apache 缓存
if command -v apache2 &> /dev/null || command -v httpd &> /dev/null; then
    echo "🔍 检测到 Apache"
    
    if [ -d "/var/cache/apache2" ]; then
        echo "🧹 清理 Apache 缓存..."
        sudo rm -rf /var/cache/apache2/*
        echo "✅ Apache 缓存已清理"
    fi
    
    echo "🔄 重启 Apache..."
    if command -v apache2 &> /dev/null; then
        sudo systemctl restart apache2
    else
        sudo systemctl restart httpd
    fi
    echo "✅ Apache 已重启"
    echo ""
fi

# 4. 验证修复
echo "🔍 验证修复内容:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if grep -q "刷新拦截器" platform.html; then
    echo "✅ 币安刷新拦截器: 已存在"
else
    echo "❌ 币安刷新拦截器: 未找到"
fi

if grep -q "handleMinerLevelChange" platform.html; then
    echo "✅ 欧意选择器修复: 已存在"
else
    echo "❌ 欧意选择器修复: 未找到"
fi

if grep -q "USDT_POOL_BASE_OFFSET" platform.html; then
    echo "✅ USDT池偏移量: 已存在"
else
    echo "❌ USDT池偏移量: 未找到"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 清理完成！"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🔗 访问链接（带缓存破坏参数）:"
echo "https://www.dreamlewebai.com/platform.html?v=$TIMESTAMP"
echo ""
echo "📱 请在币安/欧意钱包中访问上面的链接"
echo ""

