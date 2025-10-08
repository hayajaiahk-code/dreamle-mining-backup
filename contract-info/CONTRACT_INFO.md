# 合约信息文档

**合约名称**: DreamleUnifiedSystemV18_Optimized
**生成时间**: 2025-09-30T01:32:06.912Z
**合约地址**: 0x73cbfAe7Dd2B1c4c9d8643081B9731dc0424c536 (BSC Testnet)

---

## 📊 统计信息

| 类型 | 数量 |
|------|------|
| 总条目 | 86 |
| 总函数 | 70 |
| 读函数 (view/pure) | 49 |
| 写函数 (nonpayable/payable) | 21 |
| 事件 | 15 |

---

## ✍️ 写操作函数（需要签名）

共 21 个函数需要用户签名确认：

| # | 函数名 | 参数 | 状态 |
|---|--------|------|------|
| 1 | `addSpecialReferrer` | `referrer: address` |  |
| 2 | `adminInjectLiquidity` | `usdtAmount: uint256, drmAmount: uint256` |  |
| 3 | `adminWithdraw` | `token: address, amount: uint256` |  |
| 4 | `approve` | `to: address, tokenId: uint256` |  |
| 5 | `claimRewards` | `` |  |
| 6 | `emergencyPause` | `` |  |
| 7 | `exchangeDrmToUsdt` | `drmAmount: uint256` |  |
| 8 | `exchangeUsdtToDrm` | `usdtAmount: uint256` |  |
| 9 | `purchaseMinerWithDRM` | `level: uint8, referrer: address` |  |
| 10 | `purchaseMinerWithUSDT` | `level: uint8, referrer: address` |  |
| 11 | `removeSpecialReferrer` | `referrer: address` |  |
| 12 | `renewMiner` | `tokenId: uint256` |  |
| 13 | `renewMultipleMiners` | `tokenIds: uint256[]` |  |
| 14 | `renounceOwnership` | `` |  |
| 15 | `safeTransferFrom` | `from: address, to: address, tokenId: uint256` |  |
| 16 | `safeTransferFrom` | `from: address, to: address, tokenId: uint256, data: bytes` |  |
| 17 | `setApprovalForAll` | `operator: address, approved: bool` |  |
| 18 | `setBaseURI` | `newBaseURI: string` |  |
| 19 | `transferFrom` | `from: address, to: address, tokenId: uint256` |  |
| 20 | `transferOwnership` | `newOwner: address` |  |
| 21 | `updateExpiredMiners` | `user: address` |  |

---

## 📖 读操作函数（无需签名）

共 49 个只读函数：

| # | 函数名 | 参数 | 返回值 |
|---|--------|------|--------|
| 1 | `ADMIN_ADDRESS` | `` | `address` |
| 2 | `CLAIM_FEE_PERCENT` | `` | `uint256` |
| 3 | `EXCHANGE_FEE_PERCENT` | `` | `uint256` |
| 4 | `LOCK_DURATION` | `` | `uint256` |
| 5 | `MINER_USAGE_DURATION` | `` | `uint256` |
| 6 | `MIN_CLAIM_AMOUNT` | `` | `uint256` |
| 7 | `REFERRER_HASHPOWER_PERCENT` | `` | `uint256` |
| 8 | `TRANSFER_FEE_PERCENT` | `` | `uint256` |
| 9 | `activeMinersCount` | `` | `uint256` |
| 10 | `balanceOf` | `owner: address` | `uint256` |
| 11 | `dreamleToken` | `` | `address` |
| 12 | `getApproved` | `tokenId: uint256` | `address` |
| 13 | `getBatchRenewalPrice` | `tokenIds: uint256[]` | `uint256` |
| 14 | `getContractInfo` | `` | `string, uint256, uint256, uint256, address` |
| 15 | `getNFTMetadata` | `tokenId: uint256` | `uint256, uint256, uint256, uint256` |
| 16 | `getNetworkStats` | `` | `uint256, uint256, uint256` |
| 17 | `getPoolBalances` | `` | `uint256, uint256` |
| 18 | `getReferralInfo` | `user: address` | `uint32, uint256, uint256, address[]` |
| 19 | `getRenewalPrice` | `tokenId: uint256` | `uint256` |
| 20 | `getSpecialReferrers` | `` | `address[]` |
| 21 | `getSwapPreview` | `inputAmount: uint256, usdtToDrm: bool` | `uint256, uint256, uint256` |
| 22 | `getUserMiners` | `user: address` | `uint256[]` |
| 23 | `getUserMinersDetail` | `user: address` | `uint256[], uint8[], uint32[], uint32[], bool[], uint256[]` |
| 24 | `getUserMiningData` | `user: address` | `uint256, uint256, uint256, uint256, uint256, uint16, uint32, bool, uint256, uint32, uint16, uint256` |
| 25 | `getVersion` | `` | `string` |
| 26 | `isApprovedForAll` | `owner: address, operator: address` | `bool` |
| 27 | `liquidityPoolDrmBalance` | `` | `uint256` |
| 28 | `liquidityPoolUsdtBalance` | `` | `uint256` |
| 29 | `maxSpecialReferrers` | `` | `uint256` |
| 30 | `minerLevels` | `: uint8` | `uint256, uint16, uint16, uint16` |
| 31 | `miners` | `: uint256` | `uint8, uint32, uint32, address, bool, bool` |
| 32 | `name` | `` | `string` |
| 33 | `owner` | `` | `address` |
| 34 | `ownerOf` | `tokenId: uint256` | `address` |
| 35 | `referralInfo` | `: address` | `uint32, uint256, uint256` |
| 36 | `referredCount` | `: address` | `uint256` |
| 37 | `referredUsers` | `: address, : uint256` | `address` |
| 38 | `referrers` | `: address` | `address` |
| 39 | `specialReferrers` | `: address` | `bool` |
| 40 | `specialReferrersList` | `: uint256` | `address` |
| 41 | `supportsInterface` | `interfaceId: bytes4` | `bool` |
| 42 | `symbol` | `` | `string` |
| 43 | `tokenURI` | `tokenId: uint256` | `string` |
| 44 | `totalNetworkHashPower` | `` | `uint256` |
| 45 | `totalRewardsPaid` | `` | `uint256` |
| 46 | `usdtToken` | `` | `address` |
| 47 | `userLockEndTime` | `: address` | `uint32` |
| 48 | `userMiners` | `: address, : uint256` | `uint256` |
| 49 | `userMiningInfo` | `: address` | `uint256, uint256, uint256, uint256, uint256, uint16, uint32, bool` |

---

## 📡 合约事件

共 15 个事件：

| # | 事件名 | 参数 |
|---|--------|------|
| 1 | `Approval` | `owner: address indexed, approved: address indexed, tokenId: uint256 indexed` |
| 2 | `ApprovalForAll` | `owner: address indexed, operator: address indexed, approved: bool` |
| 3 | `BaseURIUpdated` | `newBaseURI: string` |
| 4 | `HashPowerRewardPaid` | `referrer: address indexed, hashPower: uint256, buyer: address indexed` |
| 5 | `MinerExpired` | `user: address indexed, tokenId: uint256 indexed, level: uint8` |
| 6 | `MinerPurchased` | `buyer: address indexed, level: uint8, tokenId: uint256, referrer: address` |
| 7 | `MinerRenewed` | `user: address indexed, tokenId: uint256 indexed, newExpiryTime: uint256` |
| 8 | `MinerTransferred` | `from: address indexed, to: address indexed, tokenId: uint256 indexed, level: uint8, hashPower: uint256` |
| 9 | `OwnershipTransferred` | `previousOwner: address indexed, newOwner: address indexed` |
| 10 | `RewardClaimed` | `user: address indexed, amount: uint256` |
| 11 | `SpecialReferrerAdded` | `referrer: address indexed` |
| 12 | `SpecialReferrerRemoved` | `referrer: address indexed` |
| 13 | `TokensExchanged` | `user: address indexed, direction: string, inputAmount: uint256, outputAmount: uint256` |
| 14 | `Transfer` | `from: address indexed, to: address indexed, tokenId: uint256 indexed` |
| 15 | `UsdtRewardPaid` | `referrer: address indexed, amount: uint256, isSpecialReferrer: bool` |

---

## 📝 使用说明

### 文件说明

- `full-abi.json` - 完整的合约ABI
- `functions.json` - 所有函数列表
- `read-functions.json` - 只读函数列表
- `write-functions.json` - 写操作函数列表
- `events.json` - 事件列表
- `contract-summary.json` - 合约摘要信息

### 在前端使用

```javascript
// 加载完整ABI
const abi = require('./contract-info/full-abi.json');

// 加载写函数列表
const writeFunctions = require('./contract-info/write-functions.json');

// 创建合约实例
const contract = new web3.eth.Contract(abi, contractAddress);
```

---

**注意**: 此文档由脚本自动生成，请勿手动编辑。
