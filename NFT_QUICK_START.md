# 🚀 NFT Metadata 快速启动指南

## ✅ 系统已就绪！

所有 NFT metadata 文件和 API 已经创建完成，Nginx 已重启。

---

## 📋 现在只需 3 步

### 步骤 1：连接管理员钱包

1. 打开 https://www.dreamlewebai.com/platform.html
2. 使用管理员地址连接钱包：`0xfC3b7735Dae4C7AB3Ab85Ffa9987661e795B74b7`

### 步骤 2：设置 Base URI

在浏览器控制台（F12）运行：

```javascript
// 设置新的 Base URI
await setNFTBaseURI("https://www.dreamlewebai.com/api/metadata/")
```

**预期输出**：
```
🎨 设置 NFT Base URI...
   新 Base URI: https://www.dreamlewebai.com/api/metadata/
📝 准备执行: setBaseURI
Gas估算: XXXXX -> 限制: XXXXX
📤 发送交易...
✅ 交易成功
✅ Base URI 设置成功！
```

### 步骤 3：验证设置

```javascript
// 测试 NFT metadata
await testNFTMetadata(1)
```

**预期输出**：
```
🧪 测试 NFT Metadata (Token #1)...
✅ Token URI: https://www.dreamlewebai.com/api/metadata/1.json
🌐 正在获取 metadata JSON...
✅ Metadata JSON: {name: "Dreamle AI Miner #1 - Common", ...}
✅ 所有必需字段都存在
🖼️ 图片 URL: https://www.dreamlewebai.com/images/miners/1.png
```

---

## 🎉 完成！

设置完成后，所有 NFT 将：

✅ 在 MetaMask 中显示图片和名称
✅ 在 BSCScan 中显示完整信息
✅ 在冷钱包中正常显示
✅ 支持所有 ERC721 标准的 NFT 平台

---

## 🧪 测试 API（可选）

### 测试静态文件

```bash
curl https://www.dreamlewebai.com/api/metadata/1.json
curl https://www.dreamlewebai.com/api/metadata/2.json
curl https://www.dreamlewebai.com/api/metadata/8.json
```

### 测试动态 API

```bash
# 测试任意 tokenId
curl https://www.dreamlewebai.com/api/metadata/999.json
curl https://www.dreamlewebai.com/api/metadata/12345.json
```

---

## 📊 Metadata 示例

### Level 1 (Common)
```json
{
  "name": "Dreamle AI Miner #1 - Common",
  "image": "https://www.dreamlewebai.com/images/miners/1.png",
  "attributes": [
    {"trait_type": "Level", "value": 1},
    {"trait_type": "Hash Power", "value": 40},
    {"trait_type": "Rarity", "value": "Common"}
  ]
}
```

### Level 8 (Celestial)
```json
{
  "name": "Dreamle AI Miner #8 - Celestial",
  "image": "https://www.dreamlewebai.com/images/miners/8.png",
  "attributes": [
    {"trait_type": "Level", "value": 8},
    {"trait_type": "Hash Power", "value": 6400},
    {"trait_type": "Rarity", "value": "Celestial"}
  ]
}
```

---

## ⚠️ 注意事项

1. **Gas 费用**：设置 Base URI 需要支付 Gas 费（约 0.001 BNB）
2. **一次性操作**：Base URI 只需设置一次
3. **立即生效**：设置后所有 NFT 的 metadata 立即更新

---

## 🔗 相关链接

- **Metadata API**：https://www.dreamlewebai.com/api/metadata/
- **合约地址**：0xf9462c7fE57Fc7Aff662204228cCdCd0a9d3398A
- **BSCScan**：https://bscscan.com/address/0xf9462c7fE57Fc7Aff662204228cCdCd0a9d3398A

---

## 📞 遇到问题？

### 问题 1：交易失败

**原因**：Gas 不足或网络拥堵
**解决**：增加 Gas limit 或稍后重试

### 问题 2：Metadata 无法加载

**检查**：
```javascript
// 检查当前 Base URI
await getNFTBaseURI()
```

**应该返回**：
```
"https://www.dreamlewebai.com/api/metadata/"
```

### 问题 3：图片无法显示

**检查图片路径**：
```bash
ls -la /root/dreamle-mining/images/miners/
```

**确保文件存在**：
```
1.png, 2.png, 3.png, 4.png, 5.png, 6.png, 7.png, 8.png
```

---

## 🎯 下一步

设置完成后，建议：

1. ✅ 在 MetaMask 中查看 NFT
2. ✅ 在 BSCScan 上验证 metadata
3. ✅ 测试购买新矿机后的显示效果
4. ✅ 分享给用户，让他们查看自己的 NFT

---

**祝您使用愉快！** 🚀

