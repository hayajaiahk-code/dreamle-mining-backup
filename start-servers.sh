#!/bin/bash

# Dreamle Mining Platform 服务器启动脚本
# 启动 RPC 代理服务器和 API 服务器

echo "🚀 启动 Dreamle Mining Platform 服务器..."
echo ""

# 检查 Python 是否安装
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 未安装，请先安装 Python3"
    exit 1
fi

# 检查并安装依赖
echo "📦 检查 Python 依赖..."
pip3 install flask flask-cors requests 2>&1 | grep -v "Requirement already satisfied" || true
echo ""

# 创建日志目录
mkdir -p logs

# 启动 RPC 代理服务器
echo "🌐 启动 RPC 代理服务器 (端口 8546)..."
nohup python3 rpc-proxy-server.py > logs/rpc-proxy.log 2>&1 &
RPC_PID=$!
echo "✅ RPC 代理服务器已启动 (PID: $RPC_PID)"
echo $RPC_PID > logs/rpc-proxy.pid
echo ""

# 等待 RPC 代理服务器启动
sleep 2

# 启动 API 服务器 (使用 V2 版本)
echo "🔧 启动 API 服务器 V2 (端口 3000)..."
nohup python3 api-server-v2.py > logs/api-server.log 2>&1 &
API_PID=$!
echo "✅ API 服务器已启动 (PID: $API_PID)"
echo $API_PID > logs/api-server.pid
echo ""

# 等待服务器启动
sleep 2

# 检查服务器状态
echo "🔍 检查服务器状态..."
echo ""

# 检查 RPC 代理
if curl -s http://localhost:8546/health > /dev/null 2>&1; then
    echo "✅ RPC 代理服务器运行正常"
else
    echo "⚠️ RPC 代理服务器可能未正常启动"
fi

# 检查 API 服务器
if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ API 服务器运行正常"
else
    echo "⚠️ API 服务器可能未正常启动"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 所有服务器已启动！"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📡 RPC 代理服务器: http://localhost:8546"
echo "🔧 API 服务器 V2: http://localhost:3000"
echo "🌐 前端页面: http://localhost:3000 (打开 index.html)"
echo ""
echo "📊 查看日志:"
echo "  - RPC 代理: tail -f logs/rpc-proxy.log"
echo "  - API 服务器: tail -f logs/api-server.log"
echo ""
echo "🛑 停止服务器: ./stop-servers.sh"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

