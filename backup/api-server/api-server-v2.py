#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Dreamle Mining Platform API 服务器 V2
提供完整的合约数据查询和交易准备服务
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from web3 import Web3
import json
import time
import logging
from datetime import datetime
import os

app = Flask(__name__, static_folder='.')
CORS(app)

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ==================== 配置 ====================

# BSC 主网配置
BSC_RPC_URL = 'https://lb.drpc.org/bsc/AqlGpHrYB01Fo1dFtBRULdHcTuavm9wR8L7hwg8TMB_n'
CHAIN_ID = 56

# 合约地址（Mainnet - 2025-09-30 部署）
CONTRACT_ADDRESSES = {
    'UNIFIED_SYSTEM': '0xf9462c7fE57Fc7Aff662204228cCdCd0a9d3398A',
    'DREAMLE_TOKEN': '0x4440409e078D44A63c72696716b84A46814717e9',
    'USDT_TOKEN': '0x55d398326f99059fF775485246999027B3197955'
}

# 缓存配置
CACHE_DURATION = 30  # 秒
cache = {}

# Web3 实例
w3 = Web3(Web3.HTTPProvider(BSC_RPC_URL))

# 添加POA中间件（BSC是POA链）
try:
    from web3.middleware import ExtraDataToPOAMiddleware
    w3.middleware_onion.inject(ExtraDataToPOAMiddleware, layer=0)
except ImportError:
    # 旧版本web3.py
    try:
        from web3.middleware import geth_poa_middleware
        w3.middleware_onion.inject(geth_poa_middleware, layer=0)
    except:
        pass

# ==================== 加载合约ABI ====================

# 管理员地址
ADMIN_ADDRESS = '0xfC3b7735Dae4C7AB3Ab85Ffa9987661e795B74b7'

# 加载V18合约ABI
try:
    abi_path = os.path.join(os.path.dirname(__file__), 'contract-info', 'UnifiedSystemV19_ABI.json')
    with open(abi_path, 'r') as f:
        UNIFIED_SYSTEM_ABI = json.load(f)
    logger.info(f"✅ 成功加载V18合约ABI，共 {len(UNIFIED_SYSTEM_ABI)} 个函数/事件")
except Exception as e:
    logger.warning(f"⚠️ 无法加载ABI文件: {e}，使用内置ABI")
    UNIFIED_SYSTEM_ABI = [
    {
        "inputs": [{"name": "user", "type": "address"}],
        "name": "userMiningInfo",
        "outputs": [
            {"name": "totalHashPower", "type": "uint16"},
            {"name": "ownHashPower", "type": "uint16"},
            {"name": "teamHashPower", "type": "uint16"},
            {"name": "minerCount", "type": "uint32"},
            {"name": "lastUpdateTime", "type": "uint32"},
            {"name": "isActive", "type": "bool"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"name": "user", "type": "address"}],
        "name": "userMiners",
        "outputs": [{"name": "", "type": "uint256[]"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"name": "tokenId", "type": "uint256"}],
        "name": "getMinerInfo",
        "outputs": [
            {"name": "level", "type": "uint8"},
            {"name": "purchaseTime", "type": "uint32"},
            {"name": "expiryTime", "type": "uint32"},
            {"name": "isActive", "type": "bool"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"name": "level", "type": "uint8"},
            {"name": "referrer", "type": "address"}
        ],
        "name": "purchaseMinerWithUSDT",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "claimRewards",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"name": "usdtAmount", "type": "uint256"}],
        "name": "exchangeUsdtToDrm",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"name": "drmAmount", "type": "uint256"}],
        "name": "exchangeDrmToUsdt",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"name": "from", "type": "address"},
            {"name": "to", "type": "address"},
            {"name": "tokenId", "type": "uint256"}
        ],
        "name": "transferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"name": "tokenId", "type": "uint256"}],
        "name": "renewMiner",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"name": "tokenIds", "type": "uint256[]"}],
        "name": "renewMultipleMiners",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"name": "tokenId", "type": "uint256"}],
        "name": "getRenewalPrice",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"name": "tokenIds", "type": "uint256[]"}],
        "name": "getBatchRenewalPrice",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    # 管理员功能
    {
        "inputs": [{"name": "referrer", "type": "address"}],
        "name": "addSpecialReferrer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"name": "referrer", "type": "address"}],
        "name": "removeSpecialReferrer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"name": "usdtAmount", "type": "uint256"},
            {"name": "drmAmount", "type": "uint256"}
        ],
        "name": "adminInjectLiquidity",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"name": "token", "type": "address"},
            {"name": "amount", "type": "uint256"}
        ],
        "name": "adminWithdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "emergencyPause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"name": "user", "type": "address"}],
        "name": "updateExpiredMiners",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

ERC20_ABI = [
    {
        "inputs": [{"name": "account", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"name": "owner", "type": "address"},
            {"name": "spender", "type": "address"}
        ],
        "name": "allowance",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"name": "spender", "type": "address"},
            {"name": "amount", "type": "uint256"}
        ],
        "name": "approve",
        "outputs": [{"name": "", "type": "bool"}],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

# 创建合约实例
unified_contract = w3.eth.contract(
    address=Web3.to_checksum_address(CONTRACT_ADDRESSES['UNIFIED_SYSTEM']),
    abi=UNIFIED_SYSTEM_ABI
)

usdt_contract = w3.eth.contract(
    address=Web3.to_checksum_address(CONTRACT_ADDRESSES['USDT_TOKEN']),
    abi=ERC20_ABI
)

drm_contract = w3.eth.contract(
    address=Web3.to_checksum_address(CONTRACT_ADDRESSES['DREAMLE_TOKEN']),
    abi=ERC20_ABI
)

# ==================== 缓存函数 ====================

def get_cache(key):
    """获取缓存"""
    if key in cache:
        data, timestamp = cache[key]
        if time.time() - timestamp < CACHE_DURATION:
            return data
    return None

def set_cache(key, data):
    """设置缓存"""
    cache[key] = (data, time.time())

# ==================== 静态文件服务 ====================

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    try:
        return send_from_directory('.', path)
    except:
        return "File not found", 404

# ==================== API 端点 ====================

@app.route('/api/config', methods=['GET'])
def get_config():
    """获取配置信息"""
    return jsonify({
        'success': True,
        'data': {
            'contracts': CONTRACT_ADDRESSES,
            'network': {
                'chainId': CHAIN_ID,
                'chainName': 'BSC Testnet',
                'rpcUrl': BSC_RPC_URL,
                'explorer': 'https://testnet.bscscan.com'
            },
            'cache_duration': CACHE_DURATION
        }
    })

@app.route('/api/user/<address>/mining-info', methods=['GET'])
def get_user_mining_info(address):
    """获取用户挖矿信息"""
    cache_key = f'mining_info_{address}'
    cached_data = get_cache(cache_key)
    
    if cached_data:
        return jsonify({
            'success': True,
            'data': cached_data,
            'cached': True
        })
    
    try:
        checksum_address = Web3.to_checksum_address(address)
        mining_info = unified_contract.functions.getUserMiningData(checksum_address).call()

        # V19返回值: [totalHashPower, ownHashPower, referralHashPower, totalClaimed,
        #             totalMined, minerCount, lastUpdateTime, isActive, pendingRewards,
        #             lockEndTime, validMinerCount, validHashPower]
        data = {
            'address': address,
            'totalHashPower': str(mining_info[0]),
            'ownHashPower': str(mining_info[1]),
            'referralHashPower': str(mining_info[2]),
            'totalClaimed': str(Web3.from_wei(mining_info[3], 'ether')),
            'totalMined': str(Web3.from_wei(mining_info[4], 'ether')),
            'minerCount': mining_info[5],
            'lastUpdateTime': mining_info[6],
            'isActive': mining_info[7],
            'pendingRewards': str(Web3.from_wei(mining_info[8], 'ether')),
            'lockEndTime': mining_info[9],
            'validMinerCount': mining_info[10],
            'validHashPower': str(mining_info[11]),
            'timestamp': int(time.time())
        }
        
        set_cache(cache_key, data)
        
        return jsonify({
            'success': True,
            'data': data,
            'cached': False
        })
        
    except Exception as e:
        logger.error(f"获取挖矿信息错误: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/user/<address>/miners', methods=['GET'])
def get_user_miners(address):
    """获取用户矿机列表"""
    cache_key = f'miners_{address}'
    cached_data = get_cache(cache_key)
    
    if cached_data:
        return jsonify({
            'success': True,
            'data': cached_data,
            'cached': True
        })
    
    try:
        checksum_address = Web3.to_checksum_address(address)
        miner_ids = unified_contract.functions.getUserMiners(checksum_address).call()

        miners = []
        # 使用区块链时间而非系统时间
        latest_block = w3.eth.get_block('latest')
        current_time = latest_block['timestamp']

        for miner_id in miner_ids:
            # 使用getNFTMetadata获取矿机信息
            miner_info = unified_contract.functions.getNFTMetadata(miner_id).call()
            # 返回值: [level, hashPower, purchaseTime, expiryTime]
            purchase_time = miner_info[2]
            expiry_time = miner_info[3]
            is_expired = current_time >= expiry_time
            remaining_time = max(0, expiry_time - current_time)
            remaining_days = remaining_time / 86400

            miners.append({
                'tokenId': int(miner_id),
                'level': miner_info[0],
                'hashPower': str(miner_info[1]),
                'purchaseTime': purchase_time,
                'expiryTime': expiry_time,
                'isExpired': is_expired,
                'remainingTime': remaining_time,
                'remainingDays': round(remaining_days, 2)
            })
        
        data = {
            'address': address,
            'miners': miners,
            'total_count': len(miners),
            'timestamp': int(time.time())
        }
        
        set_cache(cache_key, data)
        
        return jsonify({
            'success': True,
            'data': data,
            'cached': False
        })
        
    except Exception as e:
        logger.error(f"获取矿机列表错误: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/user/<address>/balances', methods=['GET'])
def get_user_balances(address):
    """获取用户所有代币余额"""
    cache_key = f'balances_{address}'
    cached_data = get_cache(cache_key)
    
    if cached_data:
        return jsonify({
            'success': True,
            'data': cached_data,
            'cached': True
        })
    
    try:
        checksum_address = Web3.to_checksum_address(address)
        
        # 获取BNB余额
        bnb_balance = w3.eth.get_balance(checksum_address)
        
        # 获取USDT余额
        usdt_balance = usdt_contract.functions.balanceOf(checksum_address).call()
        
        # 获取DRM余额
        drm_balance = drm_contract.functions.balanceOf(checksum_address).call()
        
        data = {
            'address': address,
            'bnb': str(Web3.from_wei(bnb_balance, 'ether')),
            'bnb_wei': str(bnb_balance),
            'usdt': str(Web3.from_wei(usdt_balance, 'ether')),
            'usdt_wei': str(usdt_balance),
            'drm': str(Web3.from_wei(drm_balance, 'ether')),
            'drm_wei': str(drm_balance),
            'timestamp': int(time.time())
        }
        
        set_cache(cache_key, data)
        
        return jsonify({
            'success': True,
            'data': data,
            'cached': False
        })
        
    except Exception as e:
        logger.error(f"获取余额错误: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/transaction/prepare', methods=['POST'])
def prepare_transaction():
    """准备交易数据"""
    try:
        data = request.get_json()
        action = data.get('action')
        params = data.get('params', {})
        from_address = data.get('from')

        if not from_address:
            return jsonify({
                'success': False,
                'error': 'Missing from address'
            }), 400

        checksum_address = Web3.to_checksum_address(from_address)

        # 购买矿机
        if action == 'purchaseMiner':
            level = params.get('level')
            # 使用管理员作为默认推荐人，而不是零地址
            referrer = params.get('referrer', '0xfC3b7735Dae4C7AB3Ab85Ffa9987661e795B74b7')

            # 估算Gas
            gas_estimate = unified_contract.functions.purchaseMinerWithUSDT(
                level, Web3.to_checksum_address(referrer)
            ).estimate_gas({'from': checksum_address})

            # 获取Gas价格
            gas_price = w3.eth.gas_price

            # 构造交易数据
            purchase_data = unified_contract.functions.purchaseMinerWithUSDT(level, Web3.to_checksum_address(referrer))._encode_transaction_data()

            # 构造交易参数
            tx_data = {
                'from': from_address,
                'to': CONTRACT_ADDRESSES['UNIFIED_SYSTEM'],
                'data': purchase_data,
                'gas': hex(int(gas_estimate * 1.2)),
                'gasPrice': hex(gas_price),
                'nonce': hex(w3.eth.get_transaction_count(checksum_address)),
                'chainId': CHAIN_ID,
                'value': '0x0'
            }

            return jsonify({
                'success': True,
                'data': tx_data
            })

        # 授权USDT
        elif action == 'authorizeUSDT':
            amount = params.get('amount', '1000000000000000000000000')  # 默认1,000,000 USDT

            # USDT合约的approve方法
            approve_data = usdt_contract.functions.approve(
                Web3.to_checksum_address(CONTRACT_ADDRESSES['UNIFIED_SYSTEM']),
                int(amount)
            )._encode_transaction_data()

            # 估算Gas
            gas_estimate = 100000  # approve通常需要约50k-70k gas
            gas_price = w3.eth.gas_price

            tx_data = {
                'from': from_address,
                'to': CONTRACT_ADDRESSES['USDT_TOKEN'],
                'data': approve_data,
                'gas': hex(gas_estimate),
                'gasPrice': hex(gas_price),
                'nonce': hex(w3.eth.get_transaction_count(checksum_address)),
                'chainId': CHAIN_ID,
                'value': '0x0'
            }

            return jsonify({
                'success': True,
                'data': tx_data
            })

        # 领取奖励
        elif action == 'claimRewards':
            # 估算Gas
            try:
                gas_estimate = unified_contract.functions.claimRewards().estimate_gas({'from': checksum_address})
            except:
                gas_estimate = 200000  # 默认值

            gas_price = w3.eth.gas_price

            tx_data = {
                'from': from_address,
                'to': CONTRACT_ADDRESSES['UNIFIED_SYSTEM'],
                'data': unified_contract.functions.claimRewards()._encode_transaction_data(),
                'gas': hex(int(gas_estimate * 1.2)),
                'gasPrice': hex(gas_price),
                'nonce': hex(w3.eth.get_transaction_count(checksum_address)),
                'chainId': CHAIN_ID,
                'value': '0x0'
            }

            return jsonify({
                'success': True,
                'data': tx_data
            })

        # 授权DRM
        elif action == 'authorizeDRM':
            amount = params.get('amount', '1000000000000000000000000')  # 默认1,000,000 DRM

            # DRM合约的approve方法
            approve_data = drm_contract.functions.approve(
                Web3.to_checksum_address(CONTRACT_ADDRESSES['UNIFIED_SYSTEM']),
                int(amount)
            )._encode_transaction_data()

            # 估算Gas
            gas_estimate = 100000  # approve通常需要约50k-70k gas
            gas_price = w3.eth.gas_price

            tx_data = {
                'from': from_address,
                'to': CONTRACT_ADDRESSES['DREAMLE_TOKEN'],
                'data': approve_data,
                'gas': hex(gas_estimate),
                'gasPrice': hex(gas_price),
                'nonce': hex(w3.eth.get_transaction_count(checksum_address)),
                'chainId': CHAIN_ID,
                'value': '0x0'
            }

            return jsonify({
                'success': True,
                'data': tx_data
            })

        # USDT兑换DRM
        elif action == 'exchangeUsdtToDrm':
            usdt_amount = params.get('usdtAmount')
            if not usdt_amount:
                return jsonify({
                    'success': False,
                    'error': 'Missing usdtAmount parameter'
                }), 400

            # 估算Gas
            try:
                gas_estimate = unified_contract.functions.exchangeUsdtToDrm(
                    int(usdt_amount)
                ).estimate_gas({'from': checksum_address})
            except:
                gas_estimate = 300000  # 默认值

            gas_price = w3.eth.gas_price

            tx_data = {
                'from': from_address,
                'to': CONTRACT_ADDRESSES['UNIFIED_SYSTEM'],
                'data': unified_contract.functions.exchangeUsdtToDrm(int(usdt_amount))._encode_transaction_data(),
                'gas': hex(int(gas_estimate * 1.2)),
                'gasPrice': hex(gas_price),
                'nonce': hex(w3.eth.get_transaction_count(checksum_address)),
                'chainId': CHAIN_ID,
                'value': '0x0'
            }

            return jsonify({
                'success': True,
                'data': tx_data
            })

        # DRM兑换USDT
        elif action == 'exchangeDrmToUsdt':
            drm_amount = params.get('drmAmount')
            if not drm_amount:
                return jsonify({
                    'success': False,
                    'error': 'Missing drmAmount parameter'
                }), 400

            # 估算Gas
            try:
                gas_estimate = unified_contract.functions.exchangeDrmToUsdt(
                    int(drm_amount)
                ).estimate_gas({'from': checksum_address})
            except:
                gas_estimate = 300000  # 默认值

            gas_price = w3.eth.gas_price

            tx_data = {
                'from': from_address,
                'to': CONTRACT_ADDRESSES['UNIFIED_SYSTEM'],
                'data': unified_contract.functions.exchangeDrmToUsdt(int(drm_amount))._encode_transaction_data(),
                'gas': hex(int(gas_estimate * 1.2)),
                'gasPrice': hex(gas_price),
                'nonce': hex(w3.eth.get_transaction_count(checksum_address)),
                'chainId': CHAIN_ID,
                'value': '0x0'
            }

            return jsonify({
                'success': True,
                'data': tx_data
            })

        # 转让矿机
        elif action == 'transferMiner':
            token_id = params.get('tokenId')
            to_address = params.get('toAddress')

            if not token_id or not to_address:
                return jsonify({
                    'success': False,
                    'error': 'Missing tokenId or toAddress parameter'
                }), 400

            # 验证接收地址
            try:
                to_checksum = Web3.to_checksum_address(to_address)
            except:
                return jsonify({
                    'success': False,
                    'error': 'Invalid toAddress'
                }), 400

            # 使用ERC721的transferFrom函数
            # transferFrom(address from, address to, uint256 tokenId)
            transfer_data = unified_contract.functions.transferFrom(
                checksum_address,  # from
                to_checksum,       # to
                int(token_id)      # tokenId
            )._encode_transaction_data()

            # 估算Gas
            try:
                gas_estimate = unified_contract.functions.transferFrom(
                    checksum_address,
                    to_checksum,
                    int(token_id)
                ).estimate_gas({'from': checksum_address})
            except Exception as e:
                logger.error(f'Gas估算失败: {str(e)}')
                gas_estimate = 150000  # 默认值

            gas_price = w3.eth.gas_price

            tx_data = {
                'from': from_address,
                'to': CONTRACT_ADDRESSES['UNIFIED_SYSTEM'],
                'data': transfer_data,
                'gas': hex(int(gas_estimate * 1.2)),
                'gasPrice': hex(gas_price),
                'nonce': hex(w3.eth.get_transaction_count(checksum_address)),
                'chainId': CHAIN_ID,
                'value': '0x0'
            }

            return jsonify({
                'success': True,
                'data': tx_data
            })

        # 续费矿机
        elif action == 'renewMiner':
            token_id = params.get('tokenId')

            if not token_id:
                return jsonify({
                    'success': False,
                    'error': 'Missing tokenId parameter'
                }), 400

            # 估算Gas
            gas_estimate = unified_contract.functions.renewMiner(
                int(token_id)
            ).estimate_gas({'from': checksum_address})

            # 获取Gas价格
            gas_price = w3.eth.gas_price

            # 构造交易数据
            renew_data = unified_contract.functions.renewMiner(int(token_id))._encode_transaction_data()

            # 构造交易参数
            tx_data = {
                'from': from_address,
                'to': CONTRACT_ADDRESSES['UNIFIED_SYSTEM'],
                'data': renew_data,
                'gas': hex(int(gas_estimate * 1.2)),
                'gasPrice': hex(gas_price),
                'nonce': hex(w3.eth.get_transaction_count(checksum_address)),
                'chainId': CHAIN_ID,
                'value': '0x0'
            }

            logger.info(f"✅ 续费矿机交易已准备: tokenId={token_id}")

            return jsonify({
                'success': True,
                'data': tx_data
            })

        # 批量续费矿机
        elif action == 'renewMultipleMiners':
            token_ids = params.get('tokenIds')

            if not token_ids or not isinstance(token_ids, list):
                return jsonify({
                    'success': False,
                    'error': 'Missing or invalid tokenIds parameter (must be array)'
                }), 400

            # 转换为整数数组
            token_ids_int = [int(tid) for tid in token_ids]

            # 估算Gas
            gas_estimate = unified_contract.functions.renewMultipleMiners(
                token_ids_int
            ).estimate_gas({'from': checksum_address})

            # 获取Gas价格
            gas_price = w3.eth.gas_price

            # 构造交易数据
            batch_renew_data = unified_contract.functions.renewMultipleMiners(token_ids_int)._encode_transaction_data()

            # 构造交易参数
            tx_data = {
                'from': from_address,
                'to': CONTRACT_ADDRESSES['UNIFIED_SYSTEM'],
                'data': batch_renew_data,
                'gas': hex(int(gas_estimate * 1.2)),
                'gasPrice': hex(gas_price),
                'nonce': hex(w3.eth.get_transaction_count(checksum_address)),
                'chainId': CHAIN_ID,
                'value': '0x0'
            }

            logger.info(f"✅ 批量续费矿机交易已准备: tokenIds={token_ids_int}")

            return jsonify({
                'success': True,
                'data': tx_data
            })

        # ==================== 管理员功能 ====================

        # 添加特殊推荐人
        elif action == 'addSpecialReferrer':
            referrer_address = params.get('referrerAddress')

            if not referrer_address:
                return jsonify({
                    'success': False,
                    'error': 'Missing referrerAddress parameter'
                }), 400

            # 验证是否为管理员
            if checksum_address.lower() != ADMIN_ADDRESS.lower():
                return jsonify({
                    'success': False,
                    'error': 'Only admin can perform this action'
                }), 403

            # 验证推荐人地址
            try:
                referrer_checksum = Web3.to_checksum_address(referrer_address)
            except:
                return jsonify({
                    'success': False,
                    'error': 'Invalid referrerAddress'
                }), 400

            # 估算Gas
            gas_estimate = unified_contract.functions.addSpecialReferrer(
                referrer_checksum
            ).estimate_gas({'from': checksum_address})

            gas_price = w3.eth.gas_price

            # 构造交易数据
            add_referrer_data = unified_contract.functions.addSpecialReferrer(referrer_checksum)._encode_transaction_data()

            tx_data = {
                'from': from_address,
                'to': CONTRACT_ADDRESSES['UNIFIED_SYSTEM'],
                'data': add_referrer_data,
                'gas': hex(int(gas_estimate * 1.2)),
                'gasPrice': hex(gas_price),
                'nonce': hex(w3.eth.get_transaction_count(checksum_address)),
                'chainId': CHAIN_ID,
                'value': '0x0'
            }

            logger.info(f"✅ 添加特殊推荐人交易已准备: referrer={referrer_checksum}")

            return jsonify({
                'success': True,
                'data': tx_data
            })

        # 移除特殊推荐人
        elif action == 'removeSpecialReferrer':
            referrer_address = params.get('referrerAddress')

            if not referrer_address:
                return jsonify({
                    'success': False,
                    'error': 'Missing referrerAddress parameter'
                }), 400

            # 验证是否为管理员
            if checksum_address.lower() != ADMIN_ADDRESS.lower():
                return jsonify({
                    'success': False,
                    'error': 'Only admin can perform this action'
                }), 403

            # 验证推荐人地址
            try:
                referrer_checksum = Web3.to_checksum_address(referrer_address)
            except:
                return jsonify({
                    'success': False,
                    'error': 'Invalid referrerAddress'
                }), 400

            # 估算Gas
            gas_estimate = unified_contract.functions.removeSpecialReferrer(
                referrer_checksum
            ).estimate_gas({'from': checksum_address})

            gas_price = w3.eth.gas_price

            # 构造交易数据
            remove_referrer_data = unified_contract.functions.removeSpecialReferrer(referrer_checksum)._encode_transaction_data()

            tx_data = {
                'from': from_address,
                'to': CONTRACT_ADDRESSES['UNIFIED_SYSTEM'],
                'data': remove_referrer_data,
                'gas': hex(int(gas_estimate * 1.2)),
                'gasPrice': hex(gas_price),
                'nonce': hex(w3.eth.get_transaction_count(checksum_address)),
                'chainId': CHAIN_ID,
                'value': '0x0'
            }

            logger.info(f"✅ 移除特殊推荐人交易已准备: referrer={referrer_checksum}")

            return jsonify({
                'success': True,
                'data': tx_data
            })

        # 注入流动性
        elif action == 'adminInjectLiquidity':
            usdt_amount = params.get('usdtAmount')
            drm_amount = params.get('drmAmount')

            if not usdt_amount or not drm_amount:
                return jsonify({
                    'success': False,
                    'error': 'Missing usdtAmount or drmAmount parameter'
                }), 400

            # 验证是否为管理员
            if checksum_address.lower() != ADMIN_ADDRESS.lower():
                return jsonify({
                    'success': False,
                    'error': 'Only admin can perform this action'
                }), 403

            # 估算Gas
            gas_estimate = unified_contract.functions.adminInjectLiquidity(
                int(usdt_amount),
                int(drm_amount)
            ).estimate_gas({'from': checksum_address})

            gas_price = w3.eth.gas_price

            # 构造交易数据
            inject_data = unified_contract.functions.adminInjectLiquidity(int(usdt_amount), int(drm_amount))._encode_transaction_data()

            tx_data = {
                'from': from_address,
                'to': CONTRACT_ADDRESSES['UNIFIED_SYSTEM'],
                'data': inject_data,
                'gas': hex(int(gas_estimate * 1.2)),
                'gasPrice': hex(gas_price),
                'nonce': hex(w3.eth.get_transaction_count(checksum_address)),
                'chainId': CHAIN_ID,
                'value': '0x0'
            }

            logger.info(f"✅ 注入流动性交易已准备: USDT={usdt_amount}, DRM={drm_amount}")

            return jsonify({
                'success': True,
                'data': tx_data
            })

        # 管理员提取
        elif action == 'adminWithdraw':
            token_address = params.get('tokenAddress')
            amount = params.get('amount')

            if not token_address or not amount:
                return jsonify({
                    'success': False,
                    'error': 'Missing tokenAddress or amount parameter'
                }), 400

            # 验证是否为管理员
            if checksum_address.lower() != ADMIN_ADDRESS.lower():
                return jsonify({
                    'success': False,
                    'error': 'Only admin can perform this action'
                }), 403

            # 验证代币地址
            try:
                token_checksum = Web3.to_checksum_address(token_address)
            except:
                return jsonify({
                    'success': False,
                    'error': 'Invalid tokenAddress'
                }), 400

            # 估算Gas
            gas_estimate = unified_contract.functions.adminWithdraw(
                token_checksum,
                int(amount)
            ).estimate_gas({'from': checksum_address})

            gas_price = w3.eth.gas_price

            # 构造交易数据
            withdraw_data = unified_contract.functions.adminWithdraw(token_checksum, int(amount))._encode_transaction_data()

            tx_data = {
                'from': from_address,
                'to': CONTRACT_ADDRESSES['UNIFIED_SYSTEM'],
                'data': withdraw_data,
                'gas': hex(int(gas_estimate * 1.2)),
                'gasPrice': hex(gas_price),
                'nonce': hex(w3.eth.get_transaction_count(checksum_address)),
                'chainId': CHAIN_ID,
                'value': '0x0'
            }

            logger.info(f"✅ 管理员提取交易已准备: token={token_checksum}, amount={amount}")

            return jsonify({
                'success': True,
                'data': tx_data
            })

        # 紧急暂停
        elif action == 'emergencyPause':
            # 验证是否为管理员
            if checksum_address.lower() != ADMIN_ADDRESS.lower():
                return jsonify({
                    'success': False,
                    'error': 'Only admin can perform this action'
                }), 403

            # 估算Gas
            gas_estimate = unified_contract.functions.emergencyPause().estimate_gas({
                'from': checksum_address
            })

            gas_price = w3.eth.gas_price

            # 构造交易数据
            pause_data = unified_contract.functions.emergencyPause()._encode_transaction_data()

            tx_data = {
                'from': from_address,
                'to': CONTRACT_ADDRESSES['UNIFIED_SYSTEM'],
                'data': pause_data,
                'gas': hex(int(gas_estimate * 1.2)),
                'gasPrice': hex(gas_price),
                'nonce': hex(w3.eth.get_transaction_count(checksum_address)),
                'chainId': CHAIN_ID,
                'value': '0x0'
            }

            logger.info(f"✅ 紧急暂停交易已准备")

            return jsonify({
                'success': True,
                'data': tx_data
            })

        # 更新过期矿机
        elif action == 'updateExpiredMiners':
            user_address = params.get('userAddress')

            if not user_address:
                return jsonify({
                    'success': False,
                    'error': 'Missing userAddress parameter'
                }), 400

            # 验证用户地址
            try:
                user_checksum = Web3.to_checksum_address(user_address)
            except:
                return jsonify({
                    'success': False,
                    'error': 'Invalid userAddress'
                }), 400

            # 估算Gas
            gas_estimate = unified_contract.functions.updateExpiredMiners(
                user_checksum
            ).estimate_gas({'from': checksum_address})

            gas_price = w3.eth.gas_price

            # 构造交易数据
            update_data = unified_contract.functions.updateExpiredMiners(user_checksum)._encode_transaction_data()

            tx_data = {
                'from': from_address,
                'to': CONTRACT_ADDRESSES['UNIFIED_SYSTEM'],
                'data': update_data,
                'gas': hex(int(gas_estimate * 1.2)),
                'gasPrice': hex(gas_price),
                'nonce': hex(w3.eth.get_transaction_count(checksum_address)),
                'chainId': CHAIN_ID,
                'value': '0x0'
            }

            logger.info(f"✅ 更新过期矿机交易已准备: user={user_checksum}")

            return jsonify({
                'success': True,
                'data': tx_data
            })

        else:
            return jsonify({
                'success': False,
                'error': f'Unknown action: {action}'
            }), 400

    except Exception as e:
        logger.error(f"准备交易错误: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/health', methods=['GET'])
def health():
    """健康检查"""
    try:
        # 检查RPC连接
        block_number = w3.eth.block_number
        rpc_status = 'connected'
    except:
        block_number = 0
        rpc_status = 'disconnected'
    
    return jsonify({
        'status': 'healthy',
        'service': 'Dreamle API Server V2',
        'timestamp': int(time.time()),
        'cache_size': len(cache),
        'rpc_status': rpc_status,
        'block_number': block_number,
        'contracts': CONTRACT_ADDRESSES
    })

@app.route('/api/cache/clear', methods=['POST'])
def clear_cache():
    """清除缓存"""
    global cache
    cache.clear()
    logger.info("🧹 缓存已清除")
    return jsonify({
        'success': True,
        'message': '缓存已清除'
    })

@app.route('/api/network/stats', methods=['GET'])
def get_network_stats():
    """获取网络统计数据"""
    cache_key = 'network_stats'
    cached_data = get_cache(cache_key)

    if cached_data:
        return jsonify({
            'success': True,
            'data': cached_data,
            'cached': True
        })

    try:
        # 从合约获取网络统计
        network_stats = unified_contract.functions.getNetworkStats().call()
        # 返回值: [totalNetworkHashPower, activeMinersCount, totalRewardsPaid]

        contract_info = unified_contract.functions.getContractInfo().call()
        # 返回值: [version, totalMiners, totalNetworkHash, activeMiners, admin]

        pool_balances = unified_contract.functions.getPoolBalances().call()
        # 返回值: [usdtBalance, drmBalance]

        data = {
            'totalNetworkHashPower': str(network_stats[0]),
            'activeMinersCount': network_stats[1],
            'totalRewardsPaid': str(Web3.from_wei(network_stats[2], 'ether')),
            'totalMiners': int(contract_info[1]),
            'version': contract_info[0],
            'admin': contract_info[4],
            'poolUSDT': str(Web3.from_wei(pool_balances[0], 'ether')),
            'poolDRM': str(Web3.from_wei(pool_balances[1], 'ether')),
            'timestamp': int(time.time())
        }

        set_cache(cache_key, data)

        return jsonify({
            'success': True,
            'data': data,
            'cached': False
        })
    except Exception as e:
        logger.error(f"获取网络统计失败: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# ==================== 错误处理 ====================

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'error': 'Not found'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500

if __name__ == '__main__':
    logger.info("🚀 启动 Dreamle API 服务器 V2...")
    logger.info(f"📡 BSC RPC: {BSC_RPC_URL}")
    logger.info(f"🔗 统一系统合约: {CONTRACT_ADDRESSES['UNIFIED_SYSTEM']}")
    logger.info(f"💾 缓存时间: {CACHE_DURATION}秒")
    
    # 测试RPC连接（添加超时）
    try:
        import signal
        def timeout_handler(signum, frame):
            raise TimeoutError("RPC连接超时")

        signal.signal(signal.SIGALRM, timeout_handler)
        signal.alarm(5)  # 5秒超时

        block_number = w3.eth.block_number
        signal.alarm(0)  # 取消超时
        logger.info(f"✅ RPC连接成功，当前区块: {block_number}")
    except Exception as e:
        signal.alarm(0)  # 取消超时
        logger.warning(f"⚠️ RPC连接测试失败: {str(e)}，但服务器将继续启动")
    
    # 启动服务器
    app.run(
        host='0.0.0.0',
        port=3000,
        debug=False,
        threaded=True
    )

