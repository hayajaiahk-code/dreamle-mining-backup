# 🎨 如何使用 Augment 修改深色主题

## 📋 问题背景

在 OKX DApp 浏览器中，网站显示白色背景，而不是预期的深色主题。

---

## 🎯 解决方案

### 1️⃣ 需要修改的文件

**主文件**: `vercel/original/index.html`

这是网站的主 HTML 文件，所有的深色主题设置都在这里。

---

### 2️⃣ 关键修改位置

#### A. HTML 标签（第 2 行）
```html
<html lang="en" style="background-color: #0a0a0f !important; background: #0a0a0f !important;">
```

#### B. Head 部分的 Meta 标签（第 8-9 行）
```html
<meta name="color-scheme" content="dark">
<meta name="theme-color" content="#0a0a0f">
```

#### C. Head 部分的内联样式（第 10-23 行）
```html
<style>
    /* 强制深色模式 - 最高优先级 */
    :root {
        color-scheme: dark;
    }
    html {
        background-color: #0a0a0f !important;
        color-scheme: dark;
    }
    body {
        background-color: #0a0a0f !important;
        color-scheme: dark;
    }
</style>
```

#### D. Body 标签（第 282 行）
```html
<body style="background-color: #0a0a0f !important; background: #0a0a0f !important; color: #ffffff !important;">
```

---

## 🛠️ 使用 Augment 修改步骤

### 步骤 1: 打开文件
```
请帮我打开 vercel/original/index.html 文件
```

### 步骤 2: 修改颜色
如果要改变深色主题的颜色，告诉 Augment：

```
请将深色主题的背景色从 #0a0a0f 改为 #000000（纯黑色）
```

或者：

```
请将深色主题的背景色改为深蓝色 #0a0a1f
```

### 步骤 3: 部署到 Vercel

修改完成后，需要部署：

```
请帮我部署到 Vercel 生产环境
```

Augment 会自动执行：
1. Git commit（使用正确的用户 hyptqi@gmail.com）
2. 部署到 Vercel
3. 验证部署结果

---

## 🎨 常用颜色方案

### 深黑色主题（当前）
```css
background-color: #0a0a0f
```

### 纯黑色主题
```css
background-color: #000000
```

### 深蓝色主题
```css
background-color: #0a0a1f
```

### 深灰色主题
```css
background-color: #1a1a1a
```

---

## 📝 完整修改示例

### 示例 1: 改为纯黑色
```
请帮我修改 vercel/original/index.html：
1. 将所有 #0a0a0f 改为 #000000
2. 部署到 Vercel
```

### 示例 2: 改为深蓝色
```
请帮我修改 vercel/original/index.html：
1. 将所有 #0a0a0f 改为 #0a0a1f
2. 部署到 Vercel
```

### 示例 3: 添加渐变背景
```
请帮我修改 vercel/original/index.html 的 body 样式：
将 background 改为渐变：
background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%) !important;
然后部署到 Vercel
```

---

## ⚙️ 部署配置

### Git 配置（已设置）
- **用户邮箱**: hyptqi@gmail.com
- **用户名**: hyptqi-8090

### Vercel 配置（已设置）
- **项目**: drm
- **团队**: hyptqi's projects
- **域名**: www.dreamlewebai.com

---

## 🚨 重要提示

### 1. 必须使用内联样式
OKX DApp 浏览器可能会忽略外部 CSS，所以：
- ✅ 在 `<html>` 和 `<body>` 标签上使用 `style="..."` 内联样式
- ✅ 在 `<head>` 中使用 `<style>` 标签
- ✅ 使用 `!important` 确保优先级

### 2. 必须设置 Meta 标签
```html
<meta name="color-scheme" content="dark">
<meta name="theme-color" content="#0a0a0f">
```

### 3. 部署后清除缓存
部署完成后，在 OKX App 中：
1. 完全关闭 OKX App
2. 重新打开
3. 访问网站

---

## 🔍 验证部署

部署完成后，Augment 会自动验证：

```bash
curl -s "https://www.dreamlewebai.com/" | grep "color-scheme"
```

应该看到：
```html
<meta name="color-scheme" content="dark">
```

---

## 📞 常见问题

### Q1: 修改后还是白色背景？
**A**: 清除 OKX App 缓存：
1. 完全关闭 OKX App
2. 清除应用数据（如果可能）
3. 重新打开

### Q2: 如何改变文字颜色？
**A**: 修改 body 标签的 color 属性：
```html
<body style="... color: #ffffff !important;">
```

### Q3: 如何添加渐变背景？
**A**: 修改 body 标签的 background 属性：
```html
<body style="background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%) !important;">
```

---

## 🎯 快速命令

### 查看当前颜色
```
请显示 vercel/original/index.html 中的 body 标签
```

### 修改并部署
```
请将 vercel/original/index.html 的背景色改为 #000000 并部署
```

### 验证部署
```
请验证 www.dreamlewebai.com 的深色主题是否生效
```

---

## 📚 相关文件

- **主 HTML**: `vercel/original/index.html`
- **主 CSS**: `vercel/original/styles.css`
- **设备体验 CSS**: `vercel/original/css/device-experience.css`

---

## ✅ 检查清单

修改深色主题时，确保：

- [ ] `<html>` 标签有内联样式
- [ ] `<body>` 标签有内联样式
- [ ] `<head>` 中有 `color-scheme` meta 标签
- [ ] `<head>` 中有 `theme-color` meta 标签
- [ ] `<head>` 中有内联 `<style>` 设置深色模式
- [ ] 所有颜色值一致
- [ ] 使用 `!important` 确保优先级
- [ ] Git commit 使用正确的用户（hyptqi@gmail.com）
- [ ] 部署到 Vercel 成功
- [ ] 验证网站显示正确

---

**最后更新**: 2025-10-20
**维护者**: hyptqi@gmail.com

