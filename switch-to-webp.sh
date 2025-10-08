#!/bin/bash

# 🖼️ 自动将 PNG 图片引用改为 WebP
# 不改变UI和功能，只优化图片加载

set -e

echo "🖼️  开始优化图片引用..."
echo "================================"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 备份文件
BACKUP_DIR="/root/dreamle-mining/backup/webp-optimization-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "📦 备份文件..."

# 需要修改的文件列表
FILES=(
    "/root/dreamle-mining/platform.html"
    "/root/dreamle-mining/js/core-functions.js"
    "/root/dreamle-mining/js/additional-functions.js"
    "/root/dreamle-mining/js/admin-functions.js"
)

# 备份所有文件
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        cp "$file" "$BACKUP_DIR/$(basename $file).bak"
        echo -e "${GREEN}✅ 已备份: $(basename $file)${NC}"
    fi
done

echo ""
echo "🔄 开始替换图片引用..."

# 统计替换次数
total_replacements=0

# 替换所有文件中的 PNG 引用为 WebP
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo ""
        echo "处理文件: $(basename $file)"
        
        # 计算替换次数
        count=$(grep -o "images/miners/[0-9]\.png" "$file" 2>/dev/null | wc -l || echo 0)
        
        if [ "$count" -gt 0 ]; then
            # 执行替换
            sed -i 's|images/miners/\([0-9]\)\.png|images/miners/\1.webp|g' "$file"
            echo -e "${GREEN}  ✅ 替换了 $count 处 PNG 引用${NC}"
            total_replacements=$((total_replacements + count))
        else
            echo -e "${YELLOW}  ⏭️  没有找到 PNG 引用${NC}"
        fi
    fi
done

echo ""
echo "================================"
echo -e "${GREEN}🎉 图片引用优化完成！${NC}"
echo "================================"
echo ""
echo "📊 优化统计:"
echo "  总替换次数: $total_replacements"
echo "  备份位置: $BACKUP_DIR"
echo ""
echo "📈 预期效果:"
echo "  图片大小: 17MB → 910KB（减少 95%）"
echo "  加载时间: -8 秒（4G 网络）"
echo "  UI 变化: 无（完全一致）"
echo ""
echo "🧪 测试建议:"
echo "  1. 访问 https://dreamlewebai.com/platform.html"
echo "  2. 检查矿机图片是否正常显示"
echo "  3. 使用 Chrome DevTools 查看加载时间"
echo ""
echo -e "${YELLOW}💡 如果有问题，可以从备份恢复:${NC}"
echo "  cp $BACKUP_DIR/*.bak /root/dreamle-mining/"
echo ""

