# 合约函数映射表

**生成时间**: 2025-09-30T01:20:13.720Z  
**合约地址**: 0x73cbfAe7Dd2B1c4c9d8643081B9731dc0424c536

---

## 📊 统计

- **写操作函数**: 21个
- **读操作函数**: 49个
- **已实现API**: 8个
- **完成度**: 38%

---

## ✍️ 写操作函数（需要签名）

| 函数名 | 参数 | API支持 | 前端函数 | 状态 |
|--------|------|---------|---------|------|
| `addSpecialReferrer` | `referrer: address` | ❌ | `addSpecialReferrerViaAPI()` | ⏳ 待实现 |
| `adminInjectLiquidity` | `usdtAmount: uint256, drmAmount: uint256` | ❌ | `adminInjectLiquidityViaAPI()` | ⏳ 待实现 |
| `adminWithdraw` | `token: address, amount: uint256` | ❌ | `adminWithdrawViaAPI()` | ⏳ 待实现 |
| `approve` | `to: address, tokenId: uint256` | ❌ | `approveViaAPI()` | ⏳ 待实现 |
| `claimRewards` | `` | ✅ | `claimRewardsViaAPI()` | ✅ 已实现 |
| `emergencyPause` | `` | ❌ | `emergencyPauseViaAPI()` | ⏳ 待实现 |
| `exchangeDrmToUsdt` | `drmAmount: uint256` | ✅ | `exchangeDrmToUsdtViaAPI()` | ✅ 已实现 |
| `exchangeUsdtToDrm` | `usdtAmount: uint256` | ✅ | `exchangeUsdtToDrmViaAPI()` | ✅ 已实现 |
| `purchaseMinerWithDRM` | `level: uint8, referrer: address` | ✅ | `purchaseMinerWithDRMViaAPI()` | ✅ 已实现 |
| `purchaseMinerWithUSDT` | `level: uint8, referrer: address` | ✅ | `purchaseMinerWithUSDTViaAPI()` | ✅ 已实现 |
| `removeSpecialReferrer` | `referrer: address` | ❌ | `removeSpecialReferrerViaAPI()` | ⏳ 待实现 |
| `renewMiner` | `tokenId: uint256` | ✅ | `renewMinerViaAPI()` | ✅ 已实现 |
| `renewMultipleMiners` | `tokenIds: uint256[]` | ❌ | `renewMultipleMinersViaAPI()` | ⏳ 待实现 |
| `renounceOwnership` | `` | ❌ | `renounceOwnershipViaAPI()` | ⏳ 待实现 |
| `safeTransferFrom` | `from: address, to: address, tokenId: uint256` | ❌ | `safeTransferFromViaAPI()` | ⏳ 待实现 |
| `safeTransferFrom` | `from: address, to: address, tokenId: uint256, data: bytes` | ❌ | `safeTransferFromViaAPI()` | ⏳ 待实现 |
| `setApprovalForAll` | `operator: address, approved: bool` | ❌ | `setApprovalForAllViaAPI()` | ⏳ 待实现 |
| `setBaseURI` | `newBaseURI: string` | ❌ | `setBaseURIViaAPI()` | ⏳ 待实现 |
| `transferFrom` | `from: address, to: address, tokenId: uint256` | ✅ | `transferFromViaAPI()` | ✅ 已实现 |
| `transferOwnership` | `newOwner: address` | ❌ | `transferOwnershipViaAPI()` | ⏳ 待实现 |
| `updateExpiredMiners` | `user: address` | ❌ | `updateExpiredMinersViaAPI()` | ⏳ 待实现 |

---

## 📖 读操作函数（无需签名）

| 函数名 | 参数 | 返回值 | 说明 |
|--------|------|--------|------|
| `ADMIN_ADDRESS` | `` | `address` | - |
| `CLAIM_FEE_PERCENT` | `` | `uint256` | - |
| `EXCHANGE_FEE_PERCENT` | `` | `uint256` | - |
| `LOCK_DURATION` | `` | `uint256` | - |
| `MINER_USAGE_DURATION` | `` | `uint256` | - |
| `MIN_CLAIM_AMOUNT` | `` | `uint256` | - |
| `REFERRER_HASHPOWER_PERCENT` | `` | `uint256` | - |
| `TRANSFER_FEE_PERCENT` | `` | `uint256` | - |
| `activeMinersCount` | `` | `uint256` | - |
| `balanceOf` | `owner: address` | `uint256` | - |
| `dreamleToken` | `` | `address` | - |
| `getApproved` | `tokenId: uint256` | `address` | - |
| `getBatchRenewalPrice` | `tokenIds: uint256[]` | `uint256` | - |
| `getContractInfo` | `` | `string, uint256, uint256, uint256, address` | - |
| `getNFTMetadata` | `tokenId: uint256` | `uint256, uint256, uint256, uint256` | - |
| `getNetworkStats` | `` | `uint256, uint256, uint256` | - |
| `getPoolBalances` | `` | `uint256, uint256` | - |
| `getReferralInfo` | `user: address` | `uint32, uint256, uint256, address[]` | - |
| `getRenewalPrice` | `tokenId: uint256` | `uint256` | - |
| `getSpecialReferrers` | `` | `address[]` | - |
| `getSwapPreview` | `inputAmount: uint256, usdtToDrm: bool` | `uint256, uint256, uint256` | - |
| `getUserMiners` | `user: address` | `uint256[]` | - |
| `getUserMinersDetail` | `user: address` | `uint256[], uint8[], uint32[], uint32[], bool[], uint256[]` | - |
| `getUserMiningData` | `user: address` | `uint256, uint256, uint256, uint256, uint256, uint16, uint32, bool, uint256, uint32, uint16, uint256` | - |
| `getVersion` | `` | `string` | - |
| `isApprovedForAll` | `owner: address, operator: address` | `bool` | - |
| `liquidityPoolDrmBalance` | `` | `uint256` | - |
| `liquidityPoolUsdtBalance` | `` | `uint256` | - |
| `maxSpecialReferrers` | `` | `uint256` | - |
| `minerLevels` | `: uint8` | `uint256, uint16, uint16, uint16` | - |
| `miners` | `: uint256` | `uint8, uint32, uint32, address, bool, bool` | - |
| `name` | `` | `string` | - |
| `owner` | `` | `address` | - |
| `ownerOf` | `tokenId: uint256` | `address` | - |
| `referralInfo` | `: address` | `uint32, uint256, uint256` | - |
| `referredCount` | `: address` | `uint256` | - |
| `referredUsers` | `: address, : uint256` | `address` | - |
| `referrers` | `: address` | `address` | - |
| `specialReferrers` | `: address` | `bool` | - |
| `specialReferrersList` | `: uint256` | `address` | - |
| `supportsInterface` | `interfaceId: bytes4` | `bool` | - |
| `symbol` | `` | `string` | - |
| `tokenURI` | `tokenId: uint256` | `string` | - |
| `totalNetworkHashPower` | `` | `uint256` | - |
| `totalRewardsPaid` | `` | `uint256` | - |
| `usdtToken` | `` | `address` | - |
| `userLockEndTime` | `: address` | `uint32` | - |
| `userMiners` | `: address, : uint256` | `uint256` | - |
| `userMiningInfo` | `: address` | `uint256, uint256, uint256, uint256, uint256, uint16, uint32, bool` | - |

---

## 🔧 使用方法

### 1. 在HTML中引入自动生成的适配器

```html
<script src="generated/auto-generated-adapter.js"></script>
```

### 2. 调用API函数

```javascript
// 购买矿机
await purchaseMinerWithUSDTViaAPI(1, '0x0000000000000000000000000000000000000000');

// 授权USDT
await authorizeUSDTViaAPI();

// 领取奖励
await claimRewardsViaAPI();
```

---

**注意**: 此文档由脚本自动生成，请勿手动编辑。
