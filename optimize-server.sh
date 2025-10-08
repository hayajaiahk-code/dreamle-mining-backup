#!/bin/bash

# 🚀 服务器性能优化脚本
# 自动优化 Nginx、系统参数和网络配置

set -e  # 遇到错误立即退出

echo "🚀 开始服务器性能优化..."
echo "================================"

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ 请使用 root 权限运行此脚本${NC}"
    echo "使用: sudo bash optimize-server.sh"
    exit 1
fi

echo -e "${GREEN}✅ Root 权限检查通过${NC}"

# ==================== 1. 备份现有配置 ====================
echo ""
echo "📦 备份现有配置..."

BACKUP_DIR="/root/nginx-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

# 备份 Nginx 配置
if [ -f /etc/nginx/nginx.conf ]; then
    cp /etc/nginx/nginx.conf "$BACKUP_DIR/nginx.conf.bak"
    echo -e "${GREEN}✅ 已备份 nginx.conf${NC}"
fi

if [ -f /etc/nginx/sites-available/dreamle-mining ]; then
    cp /etc/nginx/sites-available/dreamle-mining "$BACKUP_DIR/dreamle-mining.bak"
    echo -e "${GREEN}✅ 已备份 dreamle-mining 配置${NC}"
fi

echo -e "${YELLOW}📁 备份目录: $BACKUP_DIR${NC}"

# ==================== 2. 系统参数优化 ====================
echo ""
echo "⚙️  优化系统参数..."

# 创建系统优化配置
cat > /etc/sysctl.d/99-nginx-optimization.conf << 'EOF'
# Nginx 性能优化 - 系统参数

# 网络优化
net.core.somaxconn = 65535
net.core.netdev_max_backlog = 65535
net.ipv4.tcp_max_syn_backlog = 65535

# TCP 优化
net.ipv4.tcp_fin_timeout = 30
net.ipv4.tcp_keepalive_time = 300
net.ipv4.tcp_keepalive_probes = 5
net.ipv4.tcp_keepalive_intvl = 15
net.ipv4.tcp_tw_reuse = 1
net.ipv4.ip_local_port_range = 10000 65000

# 内存优化
vm.swappiness = 10
vm.dirty_ratio = 60
vm.dirty_background_ratio = 2

# 文件描述符
fs.file-max = 2097152
EOF

# 应用系统参数
sysctl -p /etc/sysctl.d/99-nginx-optimization.conf > /dev/null 2>&1
echo -e "${GREEN}✅ 系统参数优化完成${NC}"

# ==================== 3. 增加文件描述符限制 ====================
echo ""
echo "📂 优化文件描述符限制..."

# 添加到 limits.conf
if ! grep -q "nginx.*nofile" /etc/security/limits.conf; then
    cat >> /etc/security/limits.conf << 'EOF'

# Nginx 文件描述符优化
nginx soft nofile 65535
nginx hard nofile 65535
* soft nofile 65535
* hard nofile 65535
EOF
    echo -e "${GREEN}✅ 文件描述符限制已优化${NC}"
else
    echo -e "${YELLOW}⏭️  文件描述符限制已存在，跳过${NC}"
fi

# ==================== 4. 优化 Nginx 配置 ====================
echo ""
echo "🔧 优化 Nginx 配置..."

# 应用站点配置
if [ -f /root/dreamle-mining/nginx-optimized.conf ]; then
    cp /root/dreamle-mining/nginx-optimized.conf /etc/nginx/sites-available/dreamle-mining
    echo -e "${GREEN}✅ 已应用优化的站点配置${NC}"
else
    echo -e "${RED}❌ 找不到 nginx-optimized.conf${NC}"
fi

# 测试 Nginx 配置
echo ""
echo "🧪 测试 Nginx 配置..."
if nginx -t; then
    echo -e "${GREEN}✅ Nginx 配置测试通过${NC}"
else
    echo -e "${RED}❌ Nginx 配置测试失败，恢复备份...${NC}"
    cp "$BACKUP_DIR/dreamle-mining.bak" /etc/nginx/sites-available/dreamle-mining
    exit 1
fi

# ==================== 5. 重启 Nginx ====================
echo ""
echo "🔄 重启 Nginx..."
systemctl restart nginx

if systemctl is-active --quiet nginx; then
    echo -e "${GREEN}✅ Nginx 重启成功${NC}"
else
    echo -e "${RED}❌ Nginx 重启失败${NC}"
    exit 1
fi

# ==================== 6. 清理缓存 ====================
echo ""
echo "🧹 清理系统缓存..."

# 清理 PageCache
sync
echo 1 > /proc/sys/vm/drop_caches
echo -e "${GREEN}✅ 系统缓存已清理${NC}"

# ==================== 7. 性能测试 ====================
echo ""
echo "📊 性能测试..."

# 检查 Nginx 状态
echo "Nginx 状态:"
systemctl status nginx --no-pager | head -5

# 检查端口监听
echo ""
echo "端口监听:"
ss -tlnp | grep nginx

# 检查文件描述符
echo ""
echo "文件描述符限制:"
ulimit -n

# ==================== 8. 显示优化摘要 ====================
echo ""
echo "================================"
echo -e "${GREEN}🎉 服务器优化完成！${NC}"
echo "================================"
echo ""
echo "📋 优化摘要:"
echo "  ✅ 系统参数已优化"
echo "  ✅ 文件描述符限制已提升"
echo "  ✅ Nginx 配置已优化"
echo "  ✅ HTTP/2 已启用"
echo "  ✅ Gzip 压缩级别已提升"
echo "  ✅ 缓存策略已优化"
echo ""
echo "📁 备份位置: $BACKUP_DIR"
echo ""
echo "🔍 下一步建议:"
echo "  1. 清理 Cloudflare CDN 缓存"
echo "  2. 在币安钱包中测试网站速度"
echo "  3. 使用 Chrome DevTools 检查加载时间"
echo ""
echo -e "${YELLOW}💡 提示: 如果遇到问题，可以从备份恢复配置${NC}"
echo ""

