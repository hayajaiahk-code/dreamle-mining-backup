/**
 * DreamleUnifiedSystemV19 ABI
 * 自动生成于: 2025-09-30T05:09:24.264Z
 * BSC Mainnet 部署
 * 合约地址: 0x27289124121755a1938725f7194e9E618dEc7861
 */

// DreamleUnifiedSystemV19 ABI
window.UNIFIED_SYSTEM_V19_ABI = [
  {
    "type": "constructor",
    "stateMutability": "undefined",
    "payable": false,
    "inputs": [
      {
        "type": "address",
        "name": "_dreamleToken"
      },
      {
        "type": "address",
        "name": "_usdtToken"
      }
    ]
  },
  {
    "type": "event",
    "anonymous": false,
    "name": "Approval",
    "inputs": [
      {
        "type": "address",
        "name": "owner",
        "indexed": true
      },
      {
        "type": "address",
        "name": "approved",
        "indexed": true
      },
      {
        "type": "uint256",
        "name": "tokenId",
        "indexed": true
      }
    ]
  },
  {
    "type": "event",
    "anonymous": false,
    "name": "ApprovalForAll",
    "inputs": [
      {
        "type": "address",
        "name": "owner",
        "indexed": true
      },
      {
        "type": "address",
        "name": "operator",
        "indexed": true
      },
      {
        "type": "bool",
        "name": "approved",
        "indexed": false
      }
    ]
  },
  {
    "type": "event",
    "anonymous": false,
    "name": "BaseURIUpdated",
    "inputs": [
      {
        "type": "string",
        "name": "newBaseURI",
        "indexed": false
      }
    ]
  },
  {
    "type": "event",
    "anonymous": false,
    "name": "HashPowerRewardPaid",
    "inputs": [
      {
        "type": "address",
        "name": "referrer",
        "indexed": true
      },
      {
        "type": "uint256",
        "name": "hashPower",
        "indexed": false
      },
      {
        "type": "address",
        "name": "buyer",
        "indexed": true
      }
    ]
  },
  {
    "type": "event",
    "anonymous": false,
    "name": "MinerExpired",
    "inputs": [
      {
        "type": "address",
        "name": "user",
        "indexed": true
      },
      {
        "type": "uint256",
        "name": "tokenId",
        "indexed": true
      },
      {
        "type": "uint8",
        "name": "level",
        "indexed": false
      }
    ]
  },
  {
    "type": "event",
    "anonymous": false,
    "name": "MinerPurchased",
    "inputs": [
      {
        "type": "address",
        "name": "buyer",
        "indexed": true
      },
      {
        "type": "uint8",
        "name": "level",
        "indexed": false
      },
      {
        "type": "uint256",
        "name": "tokenId",
        "indexed": false
      },
      {
        "type": "address",
        "name": "referrer",
        "indexed": false
      }
    ]
  },
  {
    "type": "event",
    "anonymous": false,
    "name": "MinerRenewed",
    "inputs": [
      {
        "type": "address",
        "name": "user",
        "indexed": true
      },
      {
        "type": "uint256",
        "name": "tokenId",
        "indexed": true
      },
      {
        "type": "uint256",
        "name": "newExpiryTime",
        "indexed": false
      }
    ]
  },
  {
    "type": "event",
    "anonymous": false,
    "name": "MinerTransferred",
    "inputs": [
      {
        "type": "address",
        "name": "from",
        "indexed": true
      },
      {
        "type": "address",
        "name": "to",
        "indexed": true
      },
      {
        "type": "uint256",
        "name": "tokenId",
        "indexed": true
      },
      {
        "type": "uint8",
        "name": "level",
        "indexed": false
      },
      {
        "type": "uint256",
        "name": "hashPower",
        "indexed": false
      }
    ]
  },
  {
    "type": "event",
    "anonymous": false,
    "name": "OwnershipTransferred",
    "inputs": [
      {
        "type": "address",
        "name": "previousOwner",
        "indexed": true
      },
      {
        "type": "address",
        "name": "newOwner",
        "indexed": true
      }
    ]
  },
  {
    "type": "event",
    "anonymous": false,
    "name": "RewardClaimed",
    "inputs": [
      {
        "type": "address",
        "name": "user",
        "indexed": true
      },
      {
        "type": "uint256",
        "name": "amount",
        "indexed": false
      }
    ]
  },
  {
    "type": "event",
    "anonymous": false,
    "name": "SpecialReferrerAdded",
    "inputs": [
      {
        "type": "address",
        "name": "referrer",
        "indexed": true
      }
    ]
  },
  {
    "type": "event",
    "anonymous": false,
    "name": "SpecialReferrerRemoved",
    "inputs": [
      {
        "type": "address",
        "name": "referrer",
        "indexed": true
      }
    ]
  },
  {
    "type": "event",
    "anonymous": false,
    "name": "TokensExchanged",
    "inputs": [
      {
        "type": "address",
        "name": "user",
        "indexed": true
      },
      {
        "type": "string",
        "name": "direction",
        "indexed": false
      },
      {
        "type": "uint256",
        "name": "inputAmount",
        "indexed": false
      },
      {
        "type": "uint256",
        "name": "outputAmount",
        "indexed": false
      }
    ]
  },
  {
    "type": "event",
    "anonymous": false,
    "name": "Transfer",
    "inputs": [
      {
        "type": "address",
        "name": "from",
        "indexed": true
      },
      {
        "type": "address",
        "name": "to",
        "indexed": true
      },
      {
        "type": "uint256",
        "name": "tokenId",
        "indexed": true
      }
    ]
  },
  {
    "type": "event",
    "anonymous": false,
    "name": "UsdtRewardPaid",
    "inputs": [
      {
        "type": "address",
        "name": "referrer",
        "indexed": true
      },
      {
        "type": "uint256",
        "name": "amount",
        "indexed": false
      },
      {
        "type": "bool",
        "name": "isSpecialReferrer",
        "indexed": false
      }
    ]
  },
  {
    "type": "function",
    "name": "ADMIN_ADDRESS",
    "constant": true,
    "stateMutability": "view",
    "payable": false,
    "inputs": [],
    "outputs": [
      {
        "type": "address",
        "name": ""
      }
    ]
  },
  {
    "type": "function",
    "name": "CLAIM_FEE_PERCENT",
    "constant": true,
    "stateMutability": "view",
    "payable": false,
    "inputs": [],
    "outputs": [
      {
        "type": "uint256",
        "name": ""
      }
    ]
  },
  {
    "type": "function",
    "name": "EXCHANGE_FEE_PERCENT",
    "constant": true,
    "stateMutability": "view",
    "payable": false,
    "inputs": [],
    "outputs": [
      {
        "type": "uint256",
        "name": ""
      }
    ]
  },
  {
    "type": "function",
    "name": "LOCK_DURATION",
    "constant": true,
    "stateMutability": "view",
    "payable": false,
    "inputs": [],
    "outputs": [
      {
        "type": "uint256",
        "name": ""
      }
    ]
  },
  {
    "type": "function",
    "name": "MINER_USAGE_DURATION",
    "constant": true,
    "stateMutability": "view",
    "payable": false,
    "inputs": [],
    "outputs": [
      {
        "type": "uint256",
        "name": ""
      }
    ]
  },
  {
    "type": "function",
    "name": "MIN_CLAIM_AMOUNT",
    "constant": true,
    "stateMutability": "view",
    "payable": false,
    "inputs": [],
    "outputs": [
      {
        "type": "uint256",
        "name": ""
      }
    ]
  },
  {
    "type": "function",
    "name": "REFERRER_HASHPOWER_PERCENT",
    "constant": true,
    "stateMutability": "view",
    "payable": false,
    "inputs": [],
    "outputs": [
      {
        "type": "uint256",
        "name": ""
      }
    ]
  },
  {
    "type": "function",
    "name": "TRANSFER_FEE_PERCENT",
    "constant": true,
    "stateMutability": "view",
    "payable": false,
    "inputs": [],
    "outputs": [
      {
        "type": "uint256",
        "name": ""
      }
    ]
  },
  {
    "type": "function",
    "name": "activeMinersCount",
    "constant": true,
    "stateMutability": "view",
    "payable": false,
    "inputs": [],
    "outputs": [
      {
        "type": "uint256",
        "name": ""
      }
    ]
  },
  {
    "type": "function",
    "name": "addSpecialReferrer",
    "constant": false,
    "payable": false,
    "inputs": [
      {
        "type": "address",
        "name": "referrer"
      }
    ],
    "outputs": []
  },
  {
    "type": "function",
    "name": "adminInjectLiquidity",
    "constant": false,
    "payable": false,
    "inputs": [
      {
        "type": "uint256",
        "name": "usdtAmount"
      },
      {
        "type": "uint256",
        "name": "drmAmount"
      }
    ],
    "outputs": []
  },
  {
    "type": "function",
    "name": "adminWithdraw",
    "constant": false,
    "payable": false,
    "inputs": [
      {
        "type": "address",
        "name": "token"
      },
      {
        "type": "uint256",
        "name": "amount"
      }
    ],
    "outputs": []
  },
  {
    "type": "function",
    "name": "approve",
    "constant": false,
    "payable": false,
    "inputs": [
      {
        "type": "address",
        "name": "to"
      },
      {
        "type": "uint256",
        "name": "tokenId"
      }
    ],
    "outputs": []
  },
  {
    "type": "function",
    "name": "balanceOf",
    "constant": true,
    "stateMutability": "view",
    "payable": false,
    "inputs": [
      {
        "type": "address",
        "name": "owner"
      }
    ],
    "outputs": [
      {
        "type": "uint256",
        "name": ""
      }
    ]
  },
  {
    "type": "function",
    "name": "claimRewards",
    "constant": false,
    "payable": false,
    "inputs": [],
    "outputs": []
  },
  {
    "type": "function",
    "name": "dreamleToken",
    "constant": true,
    "stateMutability": "view",
    "payable": false,
    "inputs": [],
    "outputs": [
      {
        "type": "address",
        "name": ""
      }
    ]
  },
  {
    "type": "function",
    "name": "emergencyPause",
    "constant": false,
    "payable": false,
    "inputs": [],
    "outputs": []
  },
  {
    "type": "function",
    "name": "exchangeDrmToUsdt",
    "constant": false,
    "payable": false,
    "inputs": [
      {
        "type": "uint256",
        "name": "drmAmount"
      }
    ],
    "outputs": []
  },
  {
    "type": "function",
    "name": "exchangeUsdtToDrm",
    "constant": false,
    "payable": false,
    "inputs": [
      {
        "type": "uint256",
        "name": "usdtAmount"
      }
    ],
    "outputs": []
  },
  {
    "type": "function",
    "name": "getApproved",
    "constant": true,
    "stateMutability": "view",
    "payable": false,
    "inputs": [
      {
        "type": "uint256",
        "name": "tokenId"
      }
    ],
    "outputs": [
      {
        "type": "address",
        "name": ""
      }
    ]
  },
  {
    "type": "function",
    "name": "getBatchRenewalPrice",
    "constant": true,
    "stateMutability": "view",
    "payable": false,
    "inputs": [
      {
        "type": "uint256[]",
        "name": "tokenIds"
      }
    ],
    "outputs": [
      {
        "type": "uint256",
        "name": ""
      }
    ]
  },
  {
    "type": "function",
    "name": "getContractInfo",
    "constant": true,
    "stateMutability": "view",
    "payable": false,
    "inputs": [],
    "outputs": [
      {
        "type": "string",
        "name": "version"
      },
      {
        "type": "uint256",
        "name": "totalMiners"
      },
      {
        "type": "uint256",
        "name": "totalNetworkHash"
      },
      {
        "type": "uint256",
        "name": "activeMiners"
      },
      {
        "type": "address",
        "name": "admin"
      }
    ]
  },
  {
    "type": "function",
    "name": "getNFTMetadata",
    "constant": true,
    "stateMutability": "view",
    "payable": false,
    "inputs": [
      {
        "type": "uint256",
        "name": "tokenId"
      }
    ],
    "outputs": [
      {
        "type": "uint256",
        "name": "level"
      },
      {
        "type": "uint256",
        "name": "hashPower"
      },
      {
        "type": "uint256",
        "name": "purchaseTime"
      },
      {
        "type": "uint256",
        "name": "expiryTime"
      }
    ]
  },
  {
    "type": "function",
    "name": "getNetworkStats",
    "constant": true,
    "stateMutability": "view",
    "payable": false,
    "inputs": [],
    "outputs": [
      {
        "type": "uint256",
        "name": "_totalNetworkHashPower"
      },
      {
        "type": "uint256",
        "name": "_activeMinersCount"
      },
      {
        "type": "uint256",
        "name": "_totalRewardsPaid"
      }
    ]
  },
  {
    "type": "function",
    "name": "getPoolBalances",
    "constant": true,
    "stateMutability": "view",
    "payable": false,
    "inputs": [],
    "outputs": [
      {
        "type": "uint256",
        "name": "usdtBalance"
      },
      {
        "type": "uint256",
        "name": "drmBalance"
      }
    ]
  },
  {
    "type": "function",
    "name": "getReferralInfo",
    "constant": true,
    "stateMutability": "view",
    "payable": false,
    "inputs": [
      {
        "type": "address",
        "name": "user"
      }
    ],
    "outputs": [
      {
        "type": "uint32",
        "name": "directReferralsCount"
      },
      {
        "type": "uint256",
        "name": "totalUsdtRewards"
      },
      {
        "type": "uint256",
        "name": "totalHashPowerRewards"
      },
      {
        "type": "address[]",
        "name": "userReferredList"
      }
    ]
  },
  {
    "type": "function",
    "name": "getRenewalPrice",
    "constant": true,
    "stateMutability": "view",
    "payable": false,
    "inputs": [
      {
        "type": "uint256",
        "name": "tokenId"
      }
    ],
    "outputs": [
      {
        "type": "uint256",
        "name": ""
      }
    ]
  },
  {
    "type": "function",
    "name": "getSpecialReferrers",
    "constant": true,
    "stateMutability": "view",
    "payable": false,
    "inputs": [],
    "outputs": [
      {
        "type": "address[]",
        "name": ""
      }
    ]
  },
  {
    "type": "function",
    "name": "getSwapPreview",
    "constant": true,
    "stateMutability": "view",
    "payable": false,
    "inputs": [
      {
        "type": "uint256",
        "name": "inputAmount"
      },
      {
        "type": "bool",
        "name": "usdtToDrm"
      }
    ],
    "outputs": [
      {
        "type": "uint256",
        "name": "outputAmount"
      },
      {
        "type": "uint256",
        "name": "fee"
      },
      {
        "type": "uint256",
        "name": "netOutput"
      }
    ]
  },
  {
    "type": "function",
    "name": "getUserMiners",
    "constant": true,
    "stateMutability": "view",
    "payable": false,
    "inputs": [
      {
        "type": "address",
        "name": "user"
      }
    ],
    "outputs": [
      {
        "type": "uint256[]",
        "name": ""
      }
    ]
  },
  {
    "type": "function",
    "name": "getUserMinersDetail",
    "constant": true,
    "stateMutability": "view",
    "payable": false,
    "inputs": [
      {
        "type": "address",
        "name": "user"
      }
    ],
    "outputs": [
      {
        "type": "uint256[]",
        "name": "tokenIds"
      },
      {
        "type": "uint8[]",
        "name": "levels"
      },
      {
        "type": "uint32[]",
        "name": "purchaseTimes"
      },
      {
        "type": "uint32[]",
        "name": "expiryTimes"
      },
      {
        "type": "bool[]",
        "name": "isExpiredList"
      },
      {
        "type": "uint256[]",
        "name": "remainingTimes"
      }
    ]
  },
  {
    "type": "function",
    "name": "getUserMiningData",
    "constant": true,
    "stateMutability": "view",
    "payable": false,
    "inputs": [
      {
        "type": "address",
        "name": "user"
      }
    ],
    "outputs": [
      {
        "type": "uint256",
        "name": "totalHashPower"
      },
      {
        "type": "uint256",
        "name": "ownHashPower"
      },
      {
        "type": "uint256",
        "name": "referralHashPower"
      },
      {
        "type": "uint256",
        "name": "totalClaimed"
      },
      {
        "type": "uint256",
        "name": "totalMined"
      },
      {
        "type": "uint16",
        "name": "minerCount"
      },
      {
        "type": "uint32",
        "name": "lastUpdateTime"
      },
      {
        "type": "bool",
        "name": "isActive"
      },
      {
        "type": "uint256",
        "name": "pendingRewards"
      },
      {
        "type": "uint32",
        "name": "lockEndTime"
      },
      {
        "type": "uint16",
        "name": "validMinerCount"
      },
      {
        "type": "uint256",
        "name": "validHashPower"
      }
    ]
  },
  {
    "type": "function",
    "name": "getVersion",
    "constant": true,
    "stateMutability": "pure",
    "payable": false,
    "inputs": [],
    "outputs": [
      {
        "type": "string",
        "name": ""
      }
    ]
  },
  {
    "type": "function",
    "name": "isApprovedForAll",
    "constant": true,
    "stateMutability": "view",
    "payable": false,
    "inputs": [
      {
        "type": "address",
        "name": "owner"
      },
      {
        "type": "address",
        "name": "operator"
      }
    ],
    "outputs": [
      {
        "type": "bool",
        "name": ""
      }
    ]
  },
  {
    "type": "function",
    "name": "liquidityPoolDrmBalance",
    "constant": true,
    "stateMutability": "view",
    "payable": false,
    "inputs": [],
    "outputs": [
      {
        "type": "uint256",
        "name": ""
      }
    ]
  },
  {
    "type": "function",
    "name": "liquidityPoolUsdtBalance",
    "constant": true,
    "stateMutability": "view",
    "payable": false,
    "inputs": [],
    "outputs": [
      {
        "type": "uint256",
        "name": ""
      }
    ]
  },
  {
    "type": "function",
    "name": "maxSpecialReferrers",
    "constant": true,
    "stateMutability": "view",
    "payable": false,
    "inputs": [],
    "outputs": [
      {
        "type": "uint256",
        "name": ""
      }
    ]
  },
  {
    "type": "function",
    "name": "minerLevels",
    "constant": true,
    "stateMutability": "view",
    "payable": false,
    "inputs": [
      {
        "type": "uint8",
        "name": ""
      }
    ],
    "outputs": [
      {
        "type": "uint256",
        "name": "price"
      },
      {
        "type": "uint16",
        "name": "hashPower"
      },
      {
        "type": "uint16",
        "name": "maxSupply"
      },
      {
        "type": "uint16",
        "name": "currentSupply"
      }
    ]
  },
  {
    "type": "function",
    "name": "miners",
    "constant": true,
    "stateMutability": "view",
    "payable": false,
    "inputs": [
      {
        "type": "uint256",
        "name": ""
      }
    ],
    "outputs": [
      {
        "type": "uint8",
        "name": "level"
      },
      {
        "type": "uint32",
        "name": "purchaseTime"
      },
      {
        "type": "uint32",
        "name": "expiryTime"
      },
      {
        "type": "address",
        "name": "referrer"
      },
      {
        "type": "bool",
        "name": "isTransferred"
      },
      {
        "type": "bool",
        "name": "isExpired"
      }
    ]
  },
  {
    "type": "function",
    "name": "name",
    "constant": true,
    "stateMutability": "view",
    "payable": false,
    "inputs": [],
    "outputs": [
      {
        "type": "string",
        "name": ""
      }
    ]
  },
  {
    "type": "function",
    "name": "owner",
    "constant": true,
    "stateMutability": "view",
    "payable": false,
    "inputs": [],
    "outputs": [
      {
        "type": "address",
        "name": ""
      }
    ]
  },
  {
    "type": "function",
    "name": "ownerOf",
    "constant": true,
    "stateMutability": "view",
    "payable": false,
    "inputs": [
      {
        "type": "uint256",
        "name": "tokenId"
      }
    ],
    "outputs": [
      {
        "type": "address",
        "name": ""
      }
    ]
  },
  {
    "type": "function",
    "name": "purchaseMinerWithDRM",
    "constant": false,
    "payable": false,
    "inputs": [
      {
        "type": "uint8",
        "name": "level"
      },
      {
        "type": "address",
        "name": "referrer"
      }
    ],
    "outputs": []
  },
  {
    "type": "function",
    "name": "purchaseMinerWithUSDT",
    "constant": false,
    "payable": false,
    "inputs": [
      {
        "type": "uint8",
        "name": "level"
      },
      {
        "type": "address",
        "name": "referrer"
      }
    ],
    "outputs": []
  },
  {
    "type": "function",
    "name": "referralInfo",
    "constant": true,
    "stateMutability": "view",
    "payable": false,
    "inputs": [
      {
        "type": "address",
        "name": ""
      }
    ],
    "outputs": [
      {
        "type": "uint32",
        "name": "directReferralsCount"
      },
      {
        "type": "uint256",
        "name": "totalUsdtRewards"
      },
      {
        "type": "uint256",
        "name": "totalHashPowerRewards"
      }
    ]
  },
  {
    "type": "function",
    "name": "referredCount",
    "constant": true,
    "stateMutability": "view",
    "payable": false,
    "inputs": [
      {
        "type": "address",
        "name": ""
      }
    ],
    "outputs": [
      {
        "type": "uint256",
        "name": ""
      }
    ]
  },
  {
    "type": "function",
    "name": "referredUsers",
    "constant": true,
    "stateMutability": "view",
    "payable": false,
    "inputs": [
      {
        "type": "address",
        "name": ""
      },
      {
        "type": "uint256",
        "name": ""
      }
    ],
    "outputs": [
      {
        "type": "address",
        "name": ""
      }
    ]
  },
  {
    "type": "function",
    "name": "referrers",
    "constant": true,
    "stateMutability": "view",
    "payable": false,
    "inputs": [
      {
        "type": "address",
        "name": ""
      }
    ],
    "outputs": [
      {
        "type": "address",
        "name": ""
      }
    ]
  },
  {
    "type": "function",
    "name": "removeSpecialReferrer",
    "constant": false,
    "payable": false,
    "inputs": [
      {
        "type": "address",
        "name": "referrer"
      }
    ],
    "outputs": []
  },
  {
    "type": "function",
    "name": "renewMiner",
    "constant": false,
    "payable": false,
    "inputs": [
      {
        "type": "uint256",
        "name": "tokenId"
      }
    ],
    "outputs": []
  },
  {
    "type": "function",
    "name": "renewMultipleMiners",
    "constant": false,
    "payable": false,
    "inputs": [
      {
        "type": "uint256[]",
        "name": "tokenIds"
      }
    ],
    "outputs": []
  },
  {
    "type": "function",
    "name": "renounceOwnership",
    "constant": false,
    "payable": false,
    "inputs": [],
    "outputs": []
  },
  {
    "type": "function",
    "name": "safeTransferFrom",
    "constant": false,
    "payable": false,
    "inputs": [
      {
        "type": "address",
        "name": "from"
      },
      {
        "type": "address",
        "name": "to"
      },
      {
        "type": "uint256",
        "name": "tokenId"
      }
    ],
    "outputs": []
  },
  {
    "type": "function",
    "name": "safeTransferFrom",
    "constant": false,
    "payable": false,
    "inputs": [
      {
        "type": "address",
        "name": "from"
      },
      {
        "type": "address",
        "name": "to"
      },
      {
        "type": "uint256",
        "name": "tokenId"
      },
      {
        "type": "bytes",
        "name": "data"
      }
    ],
    "outputs": []
  },
  {
    "type": "function",
    "name": "setApprovalForAll",
    "constant": false,
    "payable": false,
    "inputs": [
      {
        "type": "address",
        "name": "operator"
      },
      {
        "type": "bool",
        "name": "approved"
      }
    ],
    "outputs": []
  },
  {
    "type": "function",
    "name": "setBaseURI",
    "constant": false,
    "payable": false,
    "inputs": [
      {
        "type": "string",
        "name": "newBaseURI"
      }
    ],
    "outputs": []
  },
  {
    "type": "function",
    "name": "specialReferrers",
    "constant": true,
    "stateMutability": "view",
    "payable": false,
    "inputs": [
      {
        "type": "address",
        "name": ""
      }
    ],
    "outputs": [
      {
        "type": "bool",
        "name": ""
      }
    ]
  },
  {
    "type": "function",
    "name": "specialReferrersList",
    "constant": true,
    "stateMutability": "view",
    "payable": false,
    "inputs": [
      {
        "type": "uint256",
        "name": ""
      }
    ],
    "outputs": [
      {
        "type": "address",
        "name": ""
      }
    ]
  },
  {
    "type": "function",
    "name": "supportsInterface",
    "constant": true,
    "stateMutability": "view",
    "payable": false,
    "inputs": [
      {
        "type": "bytes4",
        "name": "interfaceId"
      }
    ],
    "outputs": [
      {
        "type": "bool",
        "name": ""
      }
    ]
  },
  {
    "type": "function",
    "name": "symbol",
    "constant": true,
    "stateMutability": "view",
    "payable": false,
    "inputs": [],
    "outputs": [
      {
        "type": "string",
        "name": ""
      }
    ]
  },
  {
    "type": "function",
    "name": "tokenURI",
    "constant": true,
    "stateMutability": "view",
    "payable": false,
    "inputs": [
      {
        "type": "uint256",
        "name": "tokenId"
      }
    ],
    "outputs": [
      {
        "type": "string",
        "name": ""
      }
    ]
  },
  {
    "type": "function",
    "name": "totalNetworkHashPower",
    "constant": true,
    "stateMutability": "view",
    "payable": false,
    "inputs": [],
    "outputs": [
      {
        "type": "uint256",
        "name": ""
      }
    ]
  },
  {
    "type": "function",
    "name": "totalRewardsPaid",
    "constant": true,
    "stateMutability": "view",
    "payable": false,
    "inputs": [],
    "outputs": [
      {
        "type": "uint256",
        "name": ""
      }
    ]
  },
  {
    "type": "function",
    "name": "transferFrom",
    "constant": false,
    "payable": false,
    "inputs": [
      {
        "type": "address",
        "name": "from"
      },
      {
        "type": "address",
        "name": "to"
      },
      {
        "type": "uint256",
        "name": "tokenId"
      }
    ],
    "outputs": []
  },
  {
    "type": "function",
    "name": "transferOwnership",
    "constant": false,
    "payable": false,
    "inputs": [
      {
        "type": "address",
        "name": "newOwner"
      }
    ],
    "outputs": []
  },
  {
    "type": "function",
    "name": "updateExpiredMiners",
    "constant": false,
    "payable": false,
    "inputs": [
      {
        "type": "address",
        "name": "user"
      }
    ],
    "outputs": []
  },
  {
    "type": "function",
    "name": "usdtToken",
    "constant": true,
    "stateMutability": "view",
    "payable": false,
    "inputs": [],
    "outputs": [
      {
        "type": "address",
        "name": ""
      }
    ]
  },
  {
    "type": "function",
    "name": "userLockEndTime",
    "constant": true,
    "stateMutability": "view",
    "payable": false,
    "inputs": [
      {
        "type": "address",
        "name": ""
      }
    ],
    "outputs": [
      {
        "type": "uint32",
        "name": ""
      }
    ]
  },
  {
    "type": "function",
    "name": "userMiners",
    "constant": true,
    "stateMutability": "view",
    "payable": false,
    "inputs": [
      {
        "type": "address",
        "name": ""
      },
      {
        "type": "uint256",
        "name": ""
      }
    ],
    "outputs": [
      {
        "type": "uint256",
        "name": ""
      }
    ]
  },
  {
    "type": "function",
    "name": "userMiningInfo",
    "constant": true,
    "stateMutability": "view",
    "payable": false,
    "inputs": [
      {
        "type": "address",
        "name": ""
      }
    ],
    "outputs": [
      {
        "type": "uint256",
        "name": "totalHashPower"
      },
      {
        "type": "uint256",
        "name": "ownHashPower"
      },
      {
        "type": "uint256",
        "name": "referralHashPower"
      },
      {
        "type": "uint256",
        "name": "totalClaimed"
      },
      {
        "type": "uint256",
        "name": "totalMined"
      },
      {
        "type": "uint16",
        "name": "minerCount"
      },
      {
        "type": "uint32",
        "name": "lastUpdateTime"
      },
      {
        "type": "bool",
        "name": "isActive"
      }
    ]
  }
];

// 向后兼容 - 也设置为V18变量名
window.UNIFIED_SYSTEM_V18_ABI = window.UNIFIED_SYSTEM_V19_ABI;

console.log('✅ V19 ABI loaded:', window.UNIFIED_SYSTEM_V19_ABI.length, 'functions/events');
