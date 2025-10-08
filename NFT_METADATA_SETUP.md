# 🎨 NFT Metadata 系统设置指南

## 📋 检查结果总结

### ✅ 好消息
您的合约**已经实现了 `tokenURI` 函数**！这意味着 NFT 可以在 DApp 和冷钱包中显示。

### ❌ 发现的问题

1. **所有 Token 返回相同的 URI**
   ```
   Token #1: https://dreamle.vip/api/metadata/1.json
   Token #2: https://dreamle.vip/api/metadata/1.json  ← 应该是 2.json
   Token #3: https://dreamle.vip/api/metadata/1.json  ← 应该是 3.json
   ```

2. **域名不存在**
   - 合约中的 `dreamle.vip` 域名无法解析
   - 需要修改为 `dreamlewebai.com`

---

## ✅ 已完成的工作

### 1. 创建了 8 个等级的 Metadata JSON 文件

文件位置：`/root/dreamle-mining/api/metadata/`

```
api/metadata/
├── 1.json  (Common - 40 Hash Power)
├── 2.json  (Uncommon - 130 Hash Power)
├── 3.json  (Rare - 370 Hash Power)
├── 4.json  (Epic - 780 Hash Power)
├── 5.json  (Legendary - 1450 Hash Power)
├── 6.json  (Mythic - 2600 Hash Power)
├── 7.json  (Divine - 4500 Hash Power)
└── 8.json  (Celestial - 6400 Hash Power)
```

**每个 JSON 文件包含**：
- ✅ NFT 名称（例如："Dreamle AI Miner #1 - Common"）
- ✅ 描述（英文）
- ✅ 图片 URL（使用您现有的 1-8 级矿机图片）
- ✅ 外部链接（指向 platform.html）
- ✅ 属性（Level, Hash Power, Rarity, Price, Max Supply, Mining Duration, Category）

**示例 JSON**：
```json
{
  "name": "Dreamle AI Miner #1 - Common",
  "description": "Level 1 AI Computing Power Miner...",
  "image": "https://www.dreamlewebai.com/images/miners/1.png",
  "external_url": "https://www.dreamlewebai.com/platform.html",
  "attributes": [
    {"trait_type": "Level", "value": 1},
    {"trait_type": "Hash Power", "value": 40},
    {"trait_type": "Rarity", "value": "Common"},
    ...
  ]
}
```

### 2. 创建了动态 Metadata API

文件：`/root/dreamle-mining/api/nft-metadata.php`

**功能**：
- ✅ 根据 tokenId 动态生成 metadata
- ✅ 自动计算矿机等级（基于 tokenId 范围）
- ✅ 支持 CORS（跨域访问）
- ✅ 符合 OpenSea/MetaMask 标准

**API 端点**：
```
https://www.dreamlewebai.com/api/metadata/1.json
https://www.dreamlewebai.com/api/metadata/2.json
https://www.dreamlewebai.com/api/metadata/123.json
...
```

### 3. 更新了 Nginx 配置

文件：`/root/dreamle-mining/nginx-optimized.conf`

**添加的路由**：
```nginx
# NFT Metadata API - 动态路由
location ~ ^/api/metadata/(\d+)\.json$ {
    # 优先返回静态 JSON 文件
    # 如果不存在，则使用 PHP 动态生成
}
```

### 4. 添加了管理员函数

文件：`/root/dreamle-mining/js/admin-functions.js`

**新增函数**：
- ✅ `window.setNFTBaseURI(newBaseURI)` - 设置 Base URI
- ✅ `window.getNFTBaseURI()` - 获取当前 Base URI
- ✅ `window.testNFTMetadata(tokenId)` - 测试 metadata

---

## 🚀 部署步骤

### 步骤 1：重启 Nginx

```bash
# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx

# 检查状态
sudo systemctl status nginx
```

### 步骤 2：测试 Metadata API

```bash
# 测试静态文件
curl https://www.dreamlewebai.com/api/metadata/1.json

# 测试动态 API
curl https://www.dreamlewebai.com/api/metadata/999.json
```

**预期结果**：
```json
{
  "name": "Dreamle AI Miner #999",
  "description": "Level X AI Computing Power Miner...",
  "image": "https://www.dreamlewebai.com/images/miners/X.png",
  ...
}
```

### 步骤 3：修改合约的 Base URI

**使用管理员账户连接钱包**，然后在浏览器控制台运行：

```javascript
// 1. 检查当前 Base URI
await getNFTBaseURI()
// 输出: "https://dreamle.vip/api/metadata/"

// 2. 设置新的 Base URI
await setNFTBaseURI("https://www.dreamlewebai.com/api/metadata/")

// 3. 确认修改
await getNFTBaseURI()
// 输出: "https://www.dreamlewebai.com/api/metadata/"
```

### 步骤 4：测试 NFT Metadata

```javascript
// 测试 Token #1
await testNFTMetadata(1)

// 输出:
// ✅ Token URI: https://www.dreamlewebai.com/api/metadata/1.json
// ✅ Metadata JSON: {...}
// ✅ 所有必需字段都存在
// 🖼️ 图片 URL: https://www.dreamlewebai.com/images/miners/1.png
```

---

## 🧪 验证 NFT 显示

### 在 MetaMask 中查看

1. 打开 MetaMask
2. 点击 "NFTs" 标签
3. 应该能看到您的 Dreamle AI Miner NFT
4. 点击 NFT 查看详细信息

### 在 BSCScan 中查看

1. 访问合约地址：
   ```
   https://bscscan.com/address/0xf9462c7fE57Fc7Aff662204228cCdCd0a9d3398A
   ```

2. 点击 "Inventory" 标签
3. 查看 NFT 列表

### 在 OpenSea 中查看（可选）

1. 访问 OpenSea BSC 版本
2. 搜索合约地址：`0xf9462c7fE57Fc7Aff662204228cCdCd0a9d3398A`
3. 查看 NFT 集合

---

## 📊 Metadata 映射逻辑

### Token ID 到等级的映射

```
Token ID 范围          等级    稀有度
─────────────────────────────────────
1 - 10,000            LV.1    Common
10,001 - 18,000       LV.2    Uncommon
18,001 - 24,000       LV.3    Rare
24,001 - 48,000       LV.4    Epic
48,001 - 50,000       LV.5    Legendary
50,001 - 51,000       LV.6    Mythic
51,001 - 51,500       LV.7    Divine
51,501 - 51,600       LV.8    Celestial
```

**示例**：
- Token #1 → Level 1 (Common)
- Token #10,000 → Level 1 (Common)
- Token #10,001 → Level 2 (Uncommon)
- Token #51,600 → Level 8 (Celestial)

---

## 🎨 NFT 属性说明

### 标准属性

每个 NFT 包含以下属性：

| 属性 | 说明 | 示例 |
|------|------|------|
| **Level** | 矿机等级 | 1-8 |
| **Hash Power** | 算力值 | 40, 130, 370, ... |
| **Rarity** | 稀有度 | Common, Rare, Legendary, ... |
| **Price** | 价格 | "100 USDT", "300 USDT", ... |
| **Max Supply** | 最大供应量 | 10000, 8000, 6000, ... |
| **Mining Duration** | 挖矿时长 | "365 Days" |
| **Category** | 类别 | "AI Computing Miner" |
| **Token ID** | Token ID | 1, 2, 3, ... |

### 在 OpenSea 中的显示

这些属性会在 OpenSea 中显示为：
- **Properties**（属性）
- **Stats**（统计）
- **Levels**（等级）

---

## 🔧 故障排除

### 问题 1：Nginx 配置错误

```bash
# 检查配置
sudo nginx -t

# 查看错误日志
sudo tail -f /var/log/nginx/error.log
```

### 问题 2：PHP 未安装

```bash
# 安装 PHP-FPM
sudo apt update
sudo apt install php8.1-fpm

# 启动 PHP-FPM
sudo systemctl start php8.1-fpm
sudo systemctl enable php8.1-fpm
```

### 问题 3：CORS 错误

确保 Nginx 配置中有：
```nginx
add_header Access-Control-Allow-Origin * always;
```

### 问题 4：图片无法显示

检查图片路径：
```bash
ls -la /root/dreamle-mining/images/miners/
```

确保文件存在：
```
1.png, 2.png, 3.png, ..., 8.png
```

---

## 📝 管理员操作清单

### ✅ 必须完成的操作

- [ ] 重启 Nginx
- [ ] 测试 metadata API
- [ ] 使用管理员账户设置 Base URI
- [ ] 测试 NFT metadata
- [ ] 在 MetaMask 中验证 NFT 显示

### ⏰ 预计时间

- Nginx 重启：1 分钟
- API 测试：2 分钟
- 设置 Base URI：5 分钟（包括 Gas 费确认）
- 验证显示：3 分钟

**总计：约 10-15 分钟**

---

## 🎉 完成后的效果

### 用户购买矿机后

1. ✅ NFT 自动出现在 MetaMask 的 "NFTs" 标签
2. ✅ 显示矿机图片（1-8 级对应的图片）
3. ✅ 显示 NFT 名称（例如："Dreamle AI Miner #123"）
4. ✅ 点击可查看详细属性（Level, Hash Power, Rarity 等）

### 在冷钱包中

1. ✅ 支持 Trust Wallet
2. ✅ 支持 SafePal
3. ✅ 支持 Ledger（通过 MetaMask）
4. ✅ 支持所有符合 ERC721 标准的钱包

### 在 NFT 市场中

1. ✅ OpenSea（如果支持 BSC）
2. ✅ BSCScan Inventory
3. ✅ 其他 BSC NFT 市场

---

## 🔗 相关链接

- **合约地址**：`0xf9462c7fE57Fc7Aff662204228cCdCd0a9d3398A`
- **BSCScan**：https://bscscan.com/address/0xf9462c7fE57Fc7Aff662204228cCdCd0a9d3398A
- **Metadata API**：https://www.dreamlewebai.com/api/metadata/
- **矿机图片**：https://www.dreamlewebai.com/images/miners/

---

## 📞 需要帮助？

如果遇到任何问题，请提供：
1. 错误信息截图
2. 浏览器控制台日志
3. Nginx 错误日志
4. 具体的操作步骤

我会立即帮您解决！🚀

