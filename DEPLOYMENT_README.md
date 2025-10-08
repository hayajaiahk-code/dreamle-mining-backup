# Dreamle Mining 项目部署指南（完整打包）

本指南说明如何将当前前端项目部署到另一台服务器（支持 Nginx 或 Apache）。

## 1. 系统要求
- 操作系统：Linux 推荐（任意发行版均可）
- Web 服务器：
  - Nginx（推荐），或
  - Apache（需启用 mod_headers 以支持 .htaccess 的缓存控制）
- 可选：PHP（仅当需要使用 `api/` 目录下的 PHP 接口，如 `api/nft-metadata.php`）
- 依赖：本项目为纯前端静态站点（+可选 API），无需 Node/Java/数据库

## 2. 包含内容（建议部署路径）
- 根目录文件：
  - index.html（首页）
  - platform.html（挖矿平台主页面）
  - version.js（版本号与构建时间，仅输出到控制台）
  - .htaccess（Apache 缓存控制与 Gzip，Nginx 请使用等效配置）
  - favicon.svg / 样式与脚本（platform.css/styles.css/loading-screen.css/miner-cards.css/loading-screen.js/script.js 等）
- 目录：
  - js/（核心脚本、ABI 与钱包适配）
  - config/（链上合约地址等：contracts.js）
  - css/（样式）
  - images/（图片与 miners 素材）
  - libs/（第三方库：web3.min.js/ethers.min.js 等）
  - api/（如需 PHP 接口）

## 3. 不需要部署的内容（可排除）
- 任何 `backup/`、`logs/`、`generated/` 目录
- 测试/诊断页面，例如：`test-*.html`、`binance-dapp-diagnostic.html`、`dapp-test.html` 等
- 说明文档（.md）非必须，可保留 `DEPLOYMENT_README.md` 方便二次部署
- 版本控制目录（.git）与编辑器缓存/临时文件

## 4. 部署步骤（以 Nginx 为例）
1) 上传打包文件（.tar.gz 或 .zip）到目标服务器，例如：`/var/www/dreamle`。
2) 解压：
   - tar.gz：`tar -xzf dreamle-mining-<版本>.tar.gz -C /var/www/dreamle`
   - zip：`unzip dreamle-mining-<版本>.zip -d /var/www/dreamle`
3) 目录权限（仅静态站点）：
   - `chown -R www-data:www-data /var/www/dreamle`（Debian/Ubuntu）
   - 或根据你的 Nginx/Apache 运行用户调整
4) Nginx 站点配置（示例片段）：
```
server {
    listen 80;
    server_name your.domain.com;
    root /var/www/dreamle;

    index index.html platform.html;

    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate, max-age=0";
    }

    location ~* \.(js|css)$ {
        add_header Cache-Control "no-cache, no-store, must-revalidate, max-age=0";
    }

    location ~* \.(jpg|jpeg|png|gif|webp|svg|ico)$ {
        add_header Cache-Control "public, max-age=86400";
    }
}
```
5) 重新加载服务：`nginx -t && systemctl reload nginx`（或相应命令）。

### Apache 部署要点
- 将网站根目录指向解压后的目录
- 确保启用 `mod_headers`（`a2enmod headers && systemctl reload apache2`）
- `.htaccess` 已内置禁用 HTML/JS/CSS 缓存与开启 Gzip（若服务器支持）

## 5. 必须核对的配置项
- `config/contracts.js`：确认为目标网络（BSC Mainnet）地址：
  - UNIFIED_SYSTEM
  - DREAMLE_TOKEN（DRM）
  - USDT_TOKEN
- CDN/缓存：若使用 Cloudflare/Nginx 反向代理，部署后需要清理缓存
- 如果你有自定义 API，请在 `api/` 路由上放行，或配置 PHP 解析器（Apache 可直接使用，Nginx 需 fastcgi 配置）

## 6. 部署后验证清单
- 打开 `https://your.domain.com/platform.html`
  - 控制台看到：
    - DApp 刷新拦截器日志（在钱包 DApp 浏览器中）
    - 版本号与构建时间（来自 version.js，只输出到 console）
  - OKX 钱包中：矿机等级可以完整选择 1~8（已采用自定义覆盖弹层）
  - USDT Pool Balance 显示 = 实际值 + 273211（默认实际为 0 时显示 273211.00）
  - 管理员：
    - 注入流动性：先自动校验余额与授权，不足自动引导授权
    - 提取代币：先校验合约可提余额，超过则给出“可提最大值”提示
- 如使用 Nginx：确保 JS/CSS 不被缓存（或版本更新后刷新即可）

## 7. 常见问题
- 钱包内报错 `eth_sendTransaction does not exist`：
  - 需确保交易通过钱包 provider 发送而非公共 RPC（本项目已强制使用钱包 provider 发送交易）
- `execution reverted: 0x`：
  - 多为余额不足/授权不足/合约内部规则限制。现在已在“注入/提取”前进行预检查并给出明确提示
- OKX 下拉只显示 1~4：
  - 已改为“全屏底部弹层”选择，避免父容器裁剪，确保 1~8 可见

## 8. 变更记录（与线上一致性）
- 币安钱包刷新拦截器（DApp 浏览器保护）
- 欧意钱包等级选择器（全屏弹层 + 禁用原生 select 拦截）
- USDT Pool Balance 加偏移量（+273211）
- 管理员注入/提取（交易前预检查 + 自动授权 + 余额上限提示）

---
如需“**一键提取全部**”或“**自动版本化静态资源**”等增强功能，请告知，我可以在打包前加入相应实现。

