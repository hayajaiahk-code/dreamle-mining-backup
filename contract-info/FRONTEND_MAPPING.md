# 前端按钮与合约函数映射报告

**生成时间**: 2025-09-30T01:34:16.617Z

---

## 📊 统计

| 项目 | 数量 |
|------|------|
| 前端按钮总数 | 8 |
| 已实现功能 | 11 |
| 待实现功能 | 6 |
| 合约事件 | 15 |
| 完成度 | 65% |

---

## ✅ 已实现的功能（11个）

| # | 按钮 | 合约函数 | API动作 | 状态 |
|---|------|---------|---------|------|
| 1 | 💰 Buy with USDT | `purchaseMinerWithUSDT` | `purchaseMiner` | ✅ 已实现 |
| 2 | 💎 Buy with DRM | `purchaseMinerWithDRM` | `purchaseMiner` | ✅ 已实现 |
| 3 | 🔓 Authorize USDT | `approve (USDT)` | `authorizeUSDT` | ✅ 已实现 |
| 4 | 🔓 Authorize DRM | `approve (DRM)` | `authorizeDRM` | ✅ 已实现 |
| 5 | 🚀 One-Click Purchase | `approve + purchaseMinerWithUSDT` | `oneClickPurchase` | ✅ 已实现 |
| 6 | 💰 Claim Rewards | `claimRewards` | `claimRewards` | ✅ 已实现 |
| 7 | 🔄 Exchange USDT → DRM | `exchangeUsdtToDrm` | `exchangeUsdtToDrm` | ✅ 已实现 |
| 8 | 🔄 Exchange DRM → USDT | `exchangeDrmToUsdt` | `exchangeDrmToUsdt` | ✅ 已实现 |
| 9 | 📤 Transfer Miner | `transferFrom` | `transferMiner` | ✅ 已实现 |
| 10 | ⏰ Renew Miner | `renewMiner` | `renewMiner` | ✅ 已实现 |
| 11 | ⏰ Batch Renew Miners | `renewMultipleMiners` | `renewMultipleMiners` | ✅ 已实现 |

---

## ⏳ 待实现的功能（6个）

| # | 按钮 | 合约函数 | API动作 | 优先级 | 状态 |
|---|------|---------|---------|--------|------|
| 1 | ➕ Add Special Referrer | `addSpecialReferrer` | `addSpecialReferrer` | 🟡 中 | ⏳ 待实现 |
| 2 | ➖ Remove Special Referrer | `removeSpecialReferrer` | `removeSpecialReferrer` | 🟡 中 | ⏳ 待实现 |
| 3 | 💧 Inject Liquidity | `adminInjectLiquidity` | `adminInjectLiquidity` | 🟡 中 | ⏳ 待实现 |
| 4 | 💸 Admin Withdraw | `adminWithdraw` | `adminWithdraw` | 🟡 中 | ⏳ 待实现 |
| 5 | 🔴 Emergency Pause | `emergencyPause` | `emergencyPause` | 🟢 低 | ⏳ 待实现 |
| 6 | 🔄 Update Expired Miners | `updateExpiredMiners` | `updateExpiredMiners` | 🟢 低 | ⏳ 待实现 |

---

## 📡 重要合约事件

| 事件名 | 参数 |
|--------|------|
| `MinerPurchased` | `buyer: address indexed, level: uint8, tokenId: uint256, referrer: address` |
| `MinerRenewed` | `user: address indexed, tokenId: uint256 indexed, newExpiryTime: uint256` |
| `MinerTransferred` | `from: address indexed, to: address indexed, tokenId: uint256 indexed, level: uint8, hashPower: uint256` |
| `RewardClaimed` | `user: address indexed, amount: uint256` |
| `TokensExchanged` | `user: address indexed, direction: string, inputAmount: uint256, outputAmount: uint256` |
| `SpecialReferrerAdded` | `referrer: address indexed` |
| `SpecialReferrerRemoved` | `referrer: address indexed` |

---

**注意**: 此报告由脚本自动生成。
