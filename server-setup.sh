#!/bin/bash

# Dreamle Mining 服务器快速配置脚本
# 在服务器上运行此脚本以快速配置环境

set -e  # 遇到错误立即退出

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Dreamle Mining - 服务器快速配置"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then 
    echo "❌ 请使用 root 用户运行此脚本"
    echo "   使用: sudo bash server-setup.sh"
    exit 1
fi

echo "✅ Root 权限检查通过"
echo ""

# 1. 更新系统
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 步骤 1/7: 更新系统"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
apt update && apt upgrade -y
echo "✅ 系统更新完成"
echo ""

# 2. 安装 Python 和依赖
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🐍 步骤 2/7: 安装 Python 环境"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
apt install -y python3 python3-pip
pip3 install web3 flask flask-cors requests
echo "✅ Python 环境安装完成"
echo ""

# 3. 安装 Nginx
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 步骤 3/7: 安装 Nginx"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
apt install -y nginx
systemctl enable nginx
echo "✅ Nginx 安装完成"
echo ""

# 4. 安装 Certbot (SSL)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔒 步骤 4/7: 安装 Certbot (SSL)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
apt install -y certbot python3-certbot-nginx
echo "✅ Certbot 安装完成"
echo ""

# 5. 配置防火墙
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔥 步骤 5/7: 配置防火墙"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
apt install -y ufw
ufw --force enable
ufw allow 22
ufw allow 80
ufw allow 443
ufw allow 3000
echo "✅ 防火墙配置完成"
echo ""

# 6. 创建项目目录
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📁 步骤 6/7: 创建项目目录"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
mkdir -p /root/dreamle-mining/logs
cd /root/dreamle-mining
echo "✅ 项目目录创建完成"
echo ""

# 7. 创建 systemd 服务
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚙️  步骤 7/7: 创建 systemd 服务"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cat > /etc/systemd/system/dreamle-api.service << 'EOF'
[Unit]
Description=Dreamle Mining API Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/dreamle-mining
ExecStart=/usr/bin/python3 /root/dreamle-mining/api-server-v2.py
Restart=always
RestartSec=10
StandardOutput=append:/root/dreamle-mining/logs/api-server.log
StandardError=append:/root/dreamle-mining/logs/api-server.log

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
echo "✅ systemd 服务创建完成"
echo ""

# 完成
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 服务器环境配置完成！"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 下一步操作："
echo ""
echo "1️⃣ 上传项目文件到 /root/dreamle-mining/"
echo "   scp dreamle-mining-production.tar.gz root@服务器IP:/root/"
echo "   tar -xzf /root/dreamle-mining-production.tar.gz -C /root/dreamle-mining/"
echo ""
echo "2️⃣ 配置 Nginx"
echo "   nano /etc/nginx/sites-available/dreamle-mining"
echo "   # 复制配置文件内容（参考部署指南）"
echo "   ln -s /etc/nginx/sites-available/dreamle-mining /etc/nginx/sites-enabled/"
echo "   nginx -t"
echo "   systemctl restart nginx"
echo ""
echo "3️⃣ 配置 SSL 证书"
echo "   certbot --nginx -d yourdomain.com -d www.yourdomain.com"
echo ""
echo "4️⃣ 启动 API 服务器"
echo "   systemctl start dreamle-api"
echo "   systemctl enable dreamle-api"
echo "   systemctl status dreamle-api"
echo ""
echo "5️⃣ 查看日志"
echo "   tail -f /root/dreamle-mining/logs/api-server.log"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📚 详细说明请参考: 服务器部署完整指南.md"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

