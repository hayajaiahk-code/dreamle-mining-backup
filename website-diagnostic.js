#!/usr/bin/env node
/**
 * Dreamle Mining Platform - 全面网站诊断工具
 * 检测网站配置、JavaScript 加载、合约连接等问题
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Dreamle Mining Platform - 网站全面诊断');
console.log('='.repeat(80));

// 诊断结果
const diagnostics = {
    errors: [],
    warnings: [],
    info: [],
    success: []
};

// 添加诊断结果
function addResult(type, message) {
    diagnostics[type].push(message);
    const icons = { errors: '❌', warnings: '⚠️', info: 'ℹ️', success: '✅' };
    console.log(`${icons[type]} ${message}`);
}

// 1. 检查关键文件是否存在
console.log('\n📁 检查关键文件...');
const criticalFiles = [
    'index.html',
    'platform.html',
    'config/contracts.js',
    'js/web3-config.js',
    'js/network-helper.js',
    'js/core-functions.js',
    'js/unified-system-v18-abi.js',
    'js/dreamle-token-abi.js'
];

criticalFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        addResult('success', `文件存在: ${file}`);
    } else {
        addResult('errors', `文件缺失: ${file}`);
    }
});

// 2. 检查 network-helper.js 中的逻辑错误
console.log('\n🔍 检查 network-helper.js 逻辑...');
const networkHelperPath = path.join(__dirname, 'js/network-helper.js');
if (fs.existsSync(networkHelperPath)) {
    const content = fs.readFileSync(networkHelperPath, 'utf8');
    
    // 检查重复的条件判断
    const line190 = content.split('\n')[189]; // Line 190 (0-indexed)
    const line194 = content.split('\n')[193]; // Line 194 (0-indexed)
    
    if (line190 && line194) {
        if (line190.includes("'0x61'") && line194.includes("'0x61'")) {
            addResult('errors', 'network-helper.js 第190行和194行存在重复的网络检查逻辑 (都检查 0x61)');
            addResult('warnings', '这会导致网络切换逻辑失效，需要修复');
        }
    }
    
    // 检查函数名称不一致
    if (content.includes('switchToBSCMainnet') && content.includes('autoSwitchToBSCMainnet')) {
        const testnetCount = (content.match(/BSC测试网/g) || []).length;
        const mainnetCount = (content.match(/BSC主网/g) || []).length;
        
        if (testnetCount > 0 && mainnetCount > 0) {
            addResult('warnings', `network-helper.js 中同时存在"测试网"和"主网"的引用，可能导致混淆`);
            addResult('info', `测试网引用: ${testnetCount}次, 主网引用: ${mainnetCount}次`);
        }
    }
} else {
    addResult('errors', 'network-helper.js 文件不存在');
}

// 3. 检查合约地址配置
console.log('\n📋 检查合约地址配置...');
const contractsConfigPath = path.join(__dirname, 'config/contracts.js');
if (fs.existsSync(contractsConfigPath)) {
    const content = fs.readFileSync(contractsConfigPath, 'utf8');
    
    // 提取合约地址
    const unifiedSystemMatch = content.match(/UNIFIED_SYSTEM:\s*'(0x[a-fA-F0-9]{40})'/);
    const dreamleTokenMatch = content.match(/DREAMLE_TOKEN:\s*'(0x[a-fA-F0-9]{40})'/);
    const usdtTokenMatch = content.match(/USDT_TOKEN:\s*'(0x[a-fA-F0-9]{40})'/);
    
    if (unifiedSystemMatch) {
        addResult('success', `统一系统合约: ${unifiedSystemMatch[1]}`);
    } else {
        addResult('errors', '未找到统一系统合约地址');
    }
    
    if (dreamleTokenMatch) {
        addResult('success', `DRM代币合约: ${dreamleTokenMatch[1]}`);
    } else {
        addResult('errors', '未找到DRM代币合约地址');
    }
    
    if (usdtTokenMatch) {
        addResult('success', `USDT代币合约: ${usdtTokenMatch[1]}`);
    } else {
        addResult('errors', '未找到USDT代币合约地址');
    }
    
    // 检查网络配置
    if (content.includes("chainId: '0x61'")) {
        addResult('success', '网络配置: BSC 测试网 (Chain ID: 0x61)');
    } else if (content.includes("chainId: '0x38'")) {
        addResult('info', '网络配置: BSC 主网 (Chain ID: 0x38)');
    } else {
        addResult('warnings', '未找到明确的网络配置');
    }
} else {
    addResult('errors', 'config/contracts.js 文件不存在');
}

// 4. 检查 platform.html 中的脚本加载顺序
console.log('\n📜 检查 platform.html 脚本加载顺序...');
const platformHtmlPath = path.join(__dirname, 'platform.html');
if (fs.existsSync(platformHtmlPath)) {
    const content = fs.readFileSync(platformHtmlPath, 'utf8');
    
    // 检查关键脚本是否存在
    const scripts = [
        { name: 'Web3 库', pattern: /web3@.*\.min\.js/ },
        { name: 'contracts.js', pattern: /config\/contracts\.js/ },
        { name: 'unified-system-v18-abi.js', pattern: /js\/unified-system-v18-abi\.js/ },
        { name: 'web3-config.js', pattern: /js\/web3-config\.js/ },
        { name: 'network-helper.js', pattern: /js\/network-helper\.js/ },
        { name: 'core-functions.js', pattern: /js\/core-functions\.js/ }
    ];
    
    scripts.forEach(script => {
        if (script.pattern.test(content)) {
            addResult('success', `脚本已加载: ${script.name}`);
        } else {
            addResult('errors', `脚本未加载: ${script.name}`);
        }
    });
    
    // 检查是否有重复的 ABI 文件引用
    const v16AbiCount = (content.match(/unified-system-v16-abi\.js/g) || []).length;
    const v18AbiCount = (content.match(/unified-system-v18-abi\.js/g) || []).length;
    
    if (v16AbiCount > 0 && v18AbiCount > 0) {
        addResult('warnings', `同时引用了 V16 和 V18 ABI 文件，可能导致冲突`);
    }
    
    if (v16AbiCount > 1) {
        addResult('warnings', `V16 ABI 文件被引用了 ${v16AbiCount} 次`);
    }
    
    if (v18AbiCount > 1) {
        addResult('warnings', `V18 ABI 文件被引用了 ${v18AbiCount} 次`);
    }
} else {
    addResult('errors', 'platform.html 文件不存在');
}

// 5. 检查 ABI 文件
console.log('\n🔧 检查 ABI 文件...');
const abiFiles = [
    'js/unified-system-v16-abi.js',
    'js/unified-system-v18-abi.js',
    'js/dreamle-token-abi.js'
];

abiFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        const abiMatch = content.match(/window\.\w+\s*=\s*\[/);
        
        if (abiMatch) {
            addResult('success', `${file} - ABI 定义正确`);
        } else {
            addResult('warnings', `${file} - ABI 定义格式可能有问题`);
        }
    } else {
        addResult('warnings', `${file} - 文件不存在`);
    }
});

// 6. 生成诊断报告
console.log('\n' + '='.repeat(80));
console.log('📊 诊断报告汇总');
console.log('='.repeat(80));

console.log(`\n✅ 成功: ${diagnostics.success.length} 项`);
console.log(`ℹ️  信息: ${diagnostics.info.length} 项`);
console.log(`⚠️  警告: ${diagnostics.warnings.length} 项`);
console.log(`❌ 错误: ${diagnostics.errors.length} 项`);

if (diagnostics.errors.length > 0) {
    console.log('\n❌ 发现的错误:');
    diagnostics.errors.forEach((err, i) => {
        console.log(`  ${i + 1}. ${err}`);
    });
}

if (diagnostics.warnings.length > 0) {
    console.log('\n⚠️  发现的警告:');
    diagnostics.warnings.forEach((warn, i) => {
        console.log(`  ${i + 1}. ${warn}`);
    });
}

// 7. 提供修复建议
console.log('\n' + '='.repeat(80));
console.log('🔧 修复建议');
console.log('='.repeat(80));

if (diagnostics.errors.some(e => e.includes('network-helper.js'))) {
    console.log('\n1. 修复 network-helper.js 中的重复网络检查:');
    console.log('   - 第190行和194行都检查 0x61 (BSC测试网)');
    console.log('   - 建议将其中一个改为检查其他网络或移除重复逻辑');
}

if (diagnostics.warnings.some(w => w.includes('V16 和 V18 ABI'))) {
    console.log('\n2. 统一 ABI 版本:');
    console.log('   - 建议只使用一个版本的 ABI (推荐 V18)');
    console.log('   - 移除 platform.html 中对旧版本 ABI 的引用');
}

if (diagnostics.errors.some(e => e.includes('文件缺失'))) {
    console.log('\n3. 补充缺失的文件:');
    diagnostics.errors
        .filter(e => e.includes('文件缺失'))
        .forEach(e => console.log(`   - ${e}`));
}

console.log('\n' + '='.repeat(80));
console.log('✨ 诊断完成！');
console.log('='.repeat(80));

// 返回退出码
process.exit(diagnostics.errors.length > 0 ? 1 : 0);

