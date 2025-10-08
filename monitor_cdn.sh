#!/bin/bash

# Cloudflare CDN 实时监控脚本
# 用途: 监控 DNS 传播和 CDN 生效状态

echo "╔═══════════════════════════════════════════════════════════════════════════╗"
echo "║              🔍 Cloudflare CDN 实时监控                                   ║"
echo "╚═══════════════════════════════════════════════════════════════════════════╝"
echo ""
echo "域名: dreamlewebai.com"
echo "按 Ctrl+C 停止监控"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 计数器
count=1

while true; do
    echo "【检查 #$count】 $(date '+%Y-%m-%d %H:%M:%S')"
    echo ""
    
    # 1. 检查 DNS 解析
    echo "1️⃣  DNS 解析:"
    dns_result=$(dig www.dreamlewebai.com +short | tail -1)
    echo "   www.dreamlewebai.com → $dns_result"
    
    # 判断是否是 Cloudflare IP
    if [[ $dns_result == 104.21.* ]] || [[ $dns_result == 172.67.* ]]; then
        echo "   ✅ 已解析到 Cloudflare IP！"
        dns_status="✅"
    elif [[ $dns_result == "82.29.72.9" ]]; then
        echo "   ⏳ 仍然是原服务器 IP，等待 DNS 传播..."
        dns_status="⏳"
    else
        echo "   ⚠️  未知 IP: $dns_result"
        dns_status="⚠️"
    fi
    echo ""
    
    # 2. 检查 HTTP 响应头
    echo "2️⃣  HTTP 响应头:"
    
    # 检查 Server 头
    server_header=$(curl -sI https://www.dreamlewebai.com/ | grep -i "^server:" | tr -d '\r')
    echo "   $server_header"
    
    if echo "$server_header" | grep -qi "cloudflare"; then
        echo "   ✅ 检测到 Cloudflare！"
        server_status="✅"
    else
        echo "   ⏳ 未检测到 Cloudflare"
        server_status="⏳"
    fi
    echo ""
    
    # 检查 CF-Ray 头
    cf_ray=$(curl -sI https://www.dreamlewebai.com/ | grep -i "^cf-ray:" | tr -d '\r')
    if [ -n "$cf_ray" ]; then
        echo "   $cf_ray"
        echo "   ✅ Cloudflare 标识存在！"
        cf_status="✅"
    else
        echo "   ⏳ 未检测到 CF-Ray"
        cf_status="⏳"
    fi
    echo ""
    
    # 检查缓存状态
    cf_cache=$(curl -sI https://www.dreamlewebai.com/ | grep -i "^cf-cache-status:" | tr -d '\r')
    if [ -n "$cf_cache" ]; then
        echo "   $cf_cache"
        if echo "$cf_cache" | grep -qi "HIT"; then
            echo "   ✅ 缓存命中！性能最佳！"
        elif echo "$cf_cache" | grep -qi "MISS"; then
            echo "   ⚠️  缓存未命中（首次访问正常）"
        fi
    fi
    echo ""
    
    # 3. 测试响应时间
    echo "3️⃣  响应时间:"
    response_time=$(curl -so /dev/null -w "%{time_total}" https://www.dreamlewebai.com/)
    response_ms=$(echo "$response_time * 1000" | bc)
    echo "   总时间: ${response_ms} ms"
    
    if (( $(echo "$response_time < 0.05" | bc -l) )); then
        echo "   ✅ 极快！"
    elif (( $(echo "$response_time < 0.1" | bc -l) )); then
        echo "   ✅ 很快"
    elif (( $(echo "$response_time < 0.2" | bc -l) )); then
        echo "   ⚠️  一般"
    else
        echo "   ❌ 较慢"
    fi
    echo ""
    
    # 4. 总体状态
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📊 总体状态:"
    echo "   DNS 解析: $dns_status"
    echo "   Server 头: $server_status"
    echo "   CF-Ray: $cf_status"
    echo ""
    
    # 判断是否完全生效
    if [[ $dns_status == "✅" ]] && [[ $server_status == "✅" ]] && [[ $cf_status == "✅" ]]; then
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "🎉🎉🎉 恭喜！Cloudflare CDN 已完全生效！🎉🎉🎉"
        echo ""
        echo "✅ DNS 已解析到 Cloudflare"
        echo "✅ 流量经过 Cloudflare"
        echo "✅ CDN 正常工作"
        echo ""
        echo "性能提升预期:"
        echo "  - 中国用户: 300ms → 30ms (90% ⬆️)"
        echo "  - 全球用户: 200ms → 20ms (90% ⬆️)"
        echo "  - 带宽消耗: 降低 90%"
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "监控将在 10 秒后停止..."
        sleep 10
        exit 0
    else
        echo "⏳ CDN 尚未完全生效，继续监控..."
        echo ""
        echo "可能的原因:"
        if [[ $dns_status != "✅" ]]; then
            echo "  - DNS 更改尚未传播（通常需要 10-30 分钟）"
        fi
        if [[ $server_status != "✅" ]] || [[ $cf_status != "✅" ]]; then
            echo "  - 橙色云朵未启用（请检查 Cloudflare Dashboard）"
            echo "  - Name Server 未更改（请检查域名注册商）"
        fi
        echo ""
        echo "下次检查: 60 秒后..."
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
    fi
    
    # 等待 60 秒
    sleep 60
    
    # 计数器加 1
    ((count++))
done

