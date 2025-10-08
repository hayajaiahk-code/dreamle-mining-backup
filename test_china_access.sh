#!/bin/bash

echo "╔═══════════════════════════════════════════════════════════════════════════╗"
echo "║              🇨🇳 中国区用户访问诊断报告                                      ║"
echo "╚═══════════════════════════════════════════════════════════════════════════╝"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. RPC 节点连接测试（从服务器测试）"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# RPC 节点列表
declare -a RPC_NODES=(
    "https://lb.drpc.org/bsc/AqlGpHrYB01Fo1dFtBRULdHcTuavm9wR8L7hwg8TMB_n|drpc.org"
    "https://bsc-rpc.publicnode.com|PublicNode"
    "https://1rpc.io/bnb|1RPC"
    "https://bsc-dataseed1.binance.org|Binance Official 1"
    "https://bsc-dataseed2.binance.org|Binance Official 2"
    "https://bsc-mainnet.nodereal.io/v1/1659dfb40aa24bbb8153a677b98064d7|NodeReal"
)

# 测试每个 RPC 节点
for node in "${RPC_NODES[@]}"; do
    IFS='|' read -r url name <<< "$node"
    echo "测试: $name"
    echo "URL: $url"
    
    # 测试连接和延迟
    START_TIME=$(date +%s%3N)
    RESPONSE=$(curl -s -X POST "$url" \
        -H "Content-Type: application/json" \
        -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' \
        --max-time 5 2>&1)
    END_TIME=$(date +%s%3N)
    LATENCY=$((END_TIME - START_TIME))
    
    # 检查响应
    if echo "$RESPONSE" | grep -q '"result":"0x38"'; then
        echo "  ✅ 连接成功"
        echo "  ⏱️  延迟: ${LATENCY}ms"
        echo "  📊 Chain ID: 0x38 (BSC Mainnet)"
    elif echo "$RESPONSE" | grep -q "error"; then
        echo "  ❌ 连接失败 - RPC 错误"
        echo "  📝 错误: $(echo "$RESPONSE" | grep -o '"message":"[^"]*"' | head -1)"
    else
        echo "  ❌ 连接失败 - 超时或网络错误"
        echo "  📝 响应: ${RESPONSE:0:100}"
    fi
    echo ""
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2. Cloudflare DNS 解析测试"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "本地 DNS 解析:"
dig www.dreamlewebai.com +short | head -3
echo ""

echo "Google DNS (8.8.8.8) 解析:"
dig @8.8.8.8 www.dreamlewebai.com +short | head -3
echo ""

echo "Cloudflare DNS (1.1.1.1) 解析:"
dig @1.1.1.1 www.dreamlewebai.com +short | head -3
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3. Cloudflare CDN 响应头检查"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "检查 Cloudflare 响应头:"
curl -sI https://www.dreamlewebai.com/platform.html | grep -iE "server|cf-ray|cf-cache|content-encoding|content-length"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4. 网站访问速度测试"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "测试 platform.html 加载时间:"
time curl -so /dev/null -w "HTTP状态: %{http_code}\n总时间: %{time_total}s\nDNS解析: %{time_namelookup}s\n连接时间: %{time_connect}s\n下载速度: %{speed_download} bytes/s\n" https://www.dreamlewebai.com/platform.html
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5. 检查 Web3 相关文件"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "检查 core-functions.js:"
curl -sI https://www.dreamlewebai.com/js/core-functions.js | grep -iE "content-length|content-encoding|cache-control"
echo ""

echo "检查 web3-config.js:"
curl -sI https://www.dreamlewebai.com/js/web3-config.js | grep -iE "content-length|content-encoding|cache-control"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "6. 服务器位置和网络信息"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "服务器公网 IP:"
curl -s ifconfig.me
echo ""
echo ""

echo "服务器位置信息:"
curl -s ipinfo.io | grep -E "city|region|country|org"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "╔═══════════════════════════════════════════════════════════════════════════╗"
echo "║                        ✅ 诊断完成                                          ║"
echo "╚═══════════════════════════════════════════════════════════════════════════╝"
