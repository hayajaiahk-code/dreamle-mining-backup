#!/bin/bash

# Dreamle Mining Platform 服务器停止脚本

echo "🛑 停止 Dreamle Mining Platform 服务器..."
echo ""

# 停止 RPC 代理服务器
if [ -f logs/rpc-proxy.pid ]; then
    RPC_PID=$(cat logs/rpc-proxy.pid)
    if ps -p $RPC_PID > /dev/null 2>&1; then
        kill $RPC_PID
        echo "✅ RPC 代理服务器已停止 (PID: $RPC_PID)"
    else
        echo "⚠️ RPC 代理服务器未运行"
    fi
    rm logs/rpc-proxy.pid
else
    echo "⚠️ 未找到 RPC 代理服务器 PID 文件"
fi

# 停止 API 服务器
if [ -f logs/api-server.pid ]; then
    API_PID=$(cat logs/api-server.pid)
    if ps -p $API_PID > /dev/null 2>&1; then
        kill $API_PID
        echo "✅ API 服务器已停止 (PID: $API_PID)"
    else
        echo "⚠️ API 服务器未运行"
    fi
    rm logs/api-server.pid
else
    echo "⚠️ 未找到 API 服务器 PID 文件"
fi

echo ""
echo "🎉 所有服务器已停止"

