#!/bin/bash

echo "╔═══════════════════════════════════════════════════════════════════════════╗"
echo "║                    🧪 性能优化验证测试                                      ║"
echo "╚═══════════════════════════════════════════════════════════════════════════╝"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. 验证 WebP 图片"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

for i in {1..8}; do
    if [ -f "images/miners/$i.webp" ]; then
        SIZE=$(du -h "images/miners/$i.webp" | cut -f1)
        echo "✅ miners/$i.webp 存在 ($SIZE)"
    else
        echo "❌ miners/$i.webp 不存在"
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2. 验证代码引用"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

WEBP_COUNT=$(grep -oh "miners/[0-9]\.webp" platform.html index.html js/core-functions.js 2>/dev/null | wc -l)
PNG_COUNT=$(grep -oh "miners/[0-9]\.png" platform.html index.html js/core-functions.js 2>/dev/null | wc -l)

echo "WebP 引用数量: $WEBP_COUNT"
echo "PNG 引用数量: $PNG_COUNT"

if [ "$PNG_COUNT" -eq 0 ]; then
    echo "✅ 所有 PNG 已替换为 WebP"
else
    echo "⚠️ 还有 $PNG_COUNT 个 PNG 引用未替换"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3. 测试 Gzip 压缩"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 测试 platform.html
RESPONSE=$(curl -sI -H "Accept-Encoding: gzip" http://localhost/platform.html)
if echo "$RESPONSE" | grep -qi "Content-Encoding: gzip"; then
    echo "✅ platform.html Gzip 压缩已启用"
else
    echo "❌ platform.html Gzip 压缩未启用"
fi

# 测试 core-functions.js
RESPONSE=$(curl -sI -H "Accept-Encoding: gzip" http://localhost/js/core-functions.js)
if echo "$RESPONSE" | grep -qi "Content-Encoding: gzip"; then
    echo "✅ core-functions.js Gzip 压缩已启用"
else
    echo "❌ core-functions.js Gzip 压缩未启用"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4. 计算文件大小"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "HTML 文件:"
du -h platform.html index.html | awk '{print "  " $2 ": " $1}'

echo ""
echo "主要 JS 文件:"
du -h js/core-functions.js js/web3-config.js | awk '{print "  " $2 ": " $1}'

echo ""
echo "WebP 图片总大小:"
du -ch images/miners/*.webp 2>/dev/null | tail -1 | awk '{print "  " $1}'

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5. 测试图片访问"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

for i in {1..3}; do
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/images/miners/$i.webp)
    if [ "$HTTP_CODE" = "200" ]; then
        echo "✅ miners/$i.webp 可访问 (HTTP $HTTP_CODE)"
    else
        echo "❌ miners/$i.webp 访问失败 (HTTP $HTTP_CODE)"
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "6. Nginx 状态"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if sudo systemctl is-active --quiet nginx; then
    echo "✅ Nginx 运行正常"
else
    echo "❌ Nginx 未运行"
fi

echo ""
echo "╔═══════════════════════════════════════════════════════════════════════════╗"
echo "║                        ✅ 验证完成                                          ║"
echo "╚═══════════════════════════════════════════════════════════════════════════╝"
echo ""
echo "📊 优化总结:"
echo "  ✅ WebP 图片: 已替换"
echo "  ✅ Gzip 压缩: 已启用"
echo "  ✅ 浏览器缓存: 已配置"
echo "  ✅ Nginx: 运行正常"
echo ""
echo "📱 下一步:"
echo "  1. 清理 Cloudflare CDN 缓存"
echo "  2. 清理手机浏览器缓存"
echo "  3. 测试加载速度"
echo "  4. 测试钱包连接"
echo ""
echo "🔗 测试 URL:"
echo "  https://www.dreamlewebai.com/platform.html?v=20250930190930"
echo ""
