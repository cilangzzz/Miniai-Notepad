# 设计系统文档

## 文档信息

**产品名称：** KINETIC_NOTES（MiniAI记事本）
**设计风格：** Neo-Brutalist（新粗野主义）
**文档版本：** v1.0
**创建日期：** 2026-04-20

---

## 1. 设计风格概述

### 1.1 Neo-Brutalist 设计特征

**核心理念：**
- 高对比度、锐利边缘
- 粗边框、无圆角
- 倾斜元素设计
- 大胆配色
- 明确的视觉层次

**设计原则：**
- **真实性：** 不隐藏，不装饰，直接呈现
- **功能性：** 每个元素都有明确目的
- **独特性：** 差异化视觉风格，打破常规
- **一致性：** 统一的设计语言贯穿所有界面

---

## 2. 色彩系统

### 2.1 主色调

| 名称 | 色值 | 用途 |
|------|------|------|
| 主背景色 | #131313 | 深黑色，页面背景 |
| 主强调色 | #FFD700 | 金黄色，FAB、保存按钮、品牌标识 |
| 次强调色 | #007F7F | 青色，侧边栏阴影、激活状态 |
| 边框色 | #FFFFFF | 白色，所有边框 |

### 2.2 功能色

| 名称 | 色值 | 用途 |
|------|------|------|
| 收入色 | #007F7F | 青色，收入标识 |
| 支出色 | #F44336 | 煤红色，支出标识 |
| 成功色 | #4CAF50 | 绿色，成功提示 |
| 错误色 | #FF5252 | 红色，错误提示 |

### 2.3 标签色变体

| 名称 | 色值 | 用途 |
|------|------|------|
| 黄色标签 | #FFD700 | Work分类、高优先级 |
| 青色标签 | #007F7F | Personal分类、激活状态 |
| 白色标签 | #FFFFFF | Ideas分类、默认 |
| 深灰标签 | #333333 | Tasks分类、次要 |

---

## 3. 边框与阴影

### 3.1 边框规格

| 参数 | 值 | 应用场景 |
|------|-----|---------|
| 边框粗细 | 4px | 所有卡片、按钮、输入框 |
| 边框颜色 | #FFFFFF | 默认边框 |
| 圆角 | 0px | 所有元素（无圆角设计） |

### 3.2 阴影规格（Neo阴影）

| 参数 | 值 | 说明 |
|------|-----|------|
| 偏移量 | 8px | 水平和垂直方向 |
| 阴影色 | 当前背景色偏移 | 形成层次感 |
| 效果 | translate(-8px, -8px) | 偏移阴影层 |

**阴影实现示例：**
```css
.neo-shadow {
  box-shadow: 8px 8px 0 rgba(0, 0, 0, 0.5);
}

.neo-shadow-yellow {
  box-shadow: 8px 8px 0 #007F7F;
}
```

---

## 4. 字体系统

### 4.1 字体家族

| 类型 | 字体名称 | 特点 | 用途 |
|------|---------|------|------|
| 标题字体 | Space Grotesk | 几何无衬线 | 品牌标识、页面标题 |
| 正文字体 | Manrope | 人文无衬线 | 内容文本、描述 |
| 系统字体 | -apple-system, BlinkMacSystemFont | 回退字体 | 通用文本 |

### 4.2 字体规格

| 类型 | 字号 | 字重 | 行高 | 用途 |
|------|------|------|------|------|
| 品牌标识 | 24px | Bold(700) | 1.2 | 顶部Logo |
| 页面标题 | 32-48px | Bold(700) | 1.2 | 编辑页标题 |
| 卡片标题 | 16px | SemiBold(600) | 1.4 | 笔记卡片标题 |
| 正文 | 14px | Normal(400) | 1.6 | 内容文本 |
| 标签 | 12px | Bold(700) | 1.2 | 分类标签、芯片 |
| 小文本 | 10px | Normal(400) | 1.4 | 时间戳、备注 |

### 4.3 字体样式

| 样式 | 效果 | 应用场景 |
|------|------|---------|
| 倾斜 | transform: skewX(-10deg) | 品牌标识 |
| 大写 | text-transform: uppercase | 标签、按钮 |
| 粗体 | font-weight: 700 | 标题、强调 |

---

## 5. 组件样式

### 5.1 卡片组件

**基础卡片样式：**
```css
.neo-card {
  background: #131313;
  border: 4px solid #FFFFFF;
  border-radius: 0px;
  box-shadow: 8px 8px 0 rgba(255, 255, 255, 0.1);
}

.neo-card:hover {
  transform: translate(-4px, -4px);
  box-shadow: 12px 12px 0 rgba(255, 255, 255, 0.2);
}
```

**卡片类型：**
| 类型 | 特点 | 内容显示 |
|------|------|---------|
| 文本卡片 | 基础样式 | 标题+摘要+时间 |
| 图片卡片 | 图片预览区域 | 图片+标题+时间 |
| 任务卡片 | 进度条 | 任务列表+进度 |
| 引用卡片 | 引用格式 | 引用内容+来源 |
| 大卡片 | 横跨两列 | 突出展示 |

### 5.2 FAB按钮

**样式规格：**
```css
.neo-fab {
  background: #FFD700;
  border: 4px solid #FFFFFF;
  border-radius: 0px;
  box-shadow: 8px 8px 0 #007F7F;
  padding: 16px;
}

.neo-fab:hover {
  transform: translate(-4px, -4px);
  box-shadow: 12px 12px 0 #007F7F;
}
```

### 5.3 标签/芯片

**样式规格：**
```css
.neo-tag {
  background: #FFD700;
  border: 4px solid #FFFFFF;
  border-radius: 0px;
  font-weight: 700;
  font-size: 12px;
  text-transform: uppercase;
  transform: rotate(-3deg);
  padding: 4px 12px;
}

.neo-tag:hover {
  transform: rotate(0deg);
  background: #007F7F;
}
```

**旋转角度范围：**
- `-rotate-3`: -3度
- `-rotate-2`: -2度
- `-rotate-1`: -1度
- `rotate-0`: 0度（Hover状态）
- `rotate-1`: 1度
- `rotate-2`: 2度
- `rotate-3`: 3度

### 5.4 输入框

**样式规格：**
```css
.neo-input {
  background: #131313;
  border: 4px solid #FFFFFF;
  border-radius: 0px;
  font-family: Manrope;
  font-size: 14px;
  padding: 12px 16px;
}

.neo-input:focus {
  box-shadow: 8px 8px 0 #007F7F;
}
```

### 5.5 搜索框（归档搜索）

**双层结构：**
```css
.neo-search-wrapper {
  position: relative;
}

.neo-search-bg {
  background: #333333;
  border: 4px solid #FFFFFF;
  transform: translate(8px, 8px);
}

.neo-search-main {
  background: #131313;
  border: 4px solid #FFFFFF;
  position: relative;
}
```

---

## 6. 导航组件

### 6.1 TopAppBar（顶部导航栏）

**结构：**
```
┌────────────────────────────────────────────────────────────┐
│  [≡]  KINETIC_NOTES  [🔍]  [👤]                            │
└────────────────────────────────────────────────────────────┘
│  ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀  (4px白色底边框)  │
```

**样式规格：**
```css
.neo-topbar {
  background: #131313;
  border-bottom: 4px solid #FFFFFF;
  padding: 12px 24px;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;
}

.neo-brand {
  font-family: Space Grotesk;
  font-weight: 700;
  color: #FFD700;
  transform: skewX(-10deg);
  font-size: 24px;
}
```

### 6.2 BottomNavBar（底部导航栏 - Mobile）

**结构：**
```
│  ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀  (4px白色顶边框)  │
┌────────────────────────────────────────────────────────────┐
│    [📝]      [🏷️]      [📦]      [💰]      [⚙️]            │
│   Notes     Tags     Archive   Finance   Settings          │
└────────────────────────────────────────────────────────────┘
```

**样式规格：**
```css
.neo-bottombar {
  background: #131313;
  border-top: 4px solid #FFFFFF;
  padding: 8px 0;
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 100;
}

.neo-nav-item {
  color: #FFFFFF;
  padding: 8px 16px;
}

.neo-nav-item.active {
  transform: translateY(-4px);
  box-shadow: 8px 8px 0 #007F7F;
  color: #FFD700;
}
```

### 6.3 NavigationDrawer（侧边栏 - Desktop）

**结构：**
```
┌──────────────────────┐
│   Work    (📝 12)    │
│   Personal (📝 8)    │
│   Ideas   (📝 5)     │
│   Tasks   (📝 23)    │
│                      │
│                      │
│   ████████░░░░ 84%   │ ← 存储容量指示器
└──────────────────────┘
│                      │ ← 青色阴影
```

**样式规格：**
```css
.neo-drawer {
  background: #131313;
  border-right: 4px solid #FFFFFF;
  box-shadow: 8px 0 0 #007F7F;
  width: 200px;
  position: fixed;
  left: 0;
  top: 60px;
  bottom: 0;
}

.neo-drawer-item {
  padding: 12px 16px;
}

.neo-drawer-item.active {
  background: #007F7F;
  color: #FFFFFF;
}
```

---

## 7. 响应式设计

### 7.1 断点定义

| 断点名称 | 宽度范围 | 布局特征 |
|---------|---------|---------|
| Mobile | < 768px | 单列、底部导航、隐藏侧边栏 |
| Tablet | 768px - 1023px | 双列、侧边栏可选 |
| Desktop | ≥ 1024px | 三列、固定侧边栏 |

### 7.2 Mobile端差异

| 特征 | 说明 |
|------|------|
| 侧边栏 | 隐藏，通过menu按钮展开 |
| 导航栏 | 显示底部导航栏(BottomNavBar) |
| 笔记网格 | 单列布局 |
| 编辑器 | 底部工具栏显示 |
| 卡片信息 | 简化显示 |

### 7.3 Desktop端差异

| 特征 | 说明 |
|------|------|
| 侧边栏 | 固定左侧显示(NavigationDrawer) |
| 导航栏 | 隐藏底部导航栏 |
| 笔记网格 | 三列Bento Grid布局 |
| 编辑器 | 侧边信息栏完整显示 |

---

## 8. 交互效果

### 8.1 Hover效果

| 元素 | Hover效果 |
|------|---------|
| 卡片 | 上移(-4px, -4px) + 阴影增强 |
| 标签 | 旋转归位(0度) + 青色背景 |
| FAB | 上移(-4px, -4px) + 阴影增强 |
| 归档卡片 | 灰度取消 + 透明度100% |
| 导航项 | 上移(-4px) + 阴影 |

### 8.2 点击效果

| 元素 | 点击效果 |
|------|---------|
| 按钮 | 背景变化 + 阴影减少 |
| 筛选芯片 | 青色背景激活 |
| 标签 | 激活状态高亮 |

### 8.3 过渡动画

| 动画类型 | 时长 | 缓动函数 |
|---------|------|---------|
| Hover移动 | 200ms | ease-out |
| 阴影变化 | 200ms | ease-out |
| 标签旋转 | 150ms | ease-in-out |
| 页面切换 | 300ms | ease-in-out |

---

## 9. 图标系统

### 9.1 导航图标

| 图标 | 名称 | 用途 |
|------|------|------|
| 📝 | notes | 笔记列表 |
| 🏷️ | tags | 分类标签 |
| 📦 | archive | 归档搜索 |
| 💰 | finance | 财务概览 |
| ⚙️ | settings | 设置 |

### 9.2 功能图标

| 图标 | 名称 | 用途 |
|------|------|------|
| + | add | 创建笔记 |
| 🔍 | search | 搜索 |
| ✎ | edit | 编辑 |
| ✗ | close | 关闭/删除 |
| ↩ | unarchive | 恢复归档 |
| ⏰ | reminder | 提醒设置 |
| 🔗 | link | 链接 |
| 🖼 | image | 图片 |

### 9.3 图标样式

```css
.neo-icon {
  width: 24px;
  height: 24px;
  stroke: #FFFFFF;
  stroke-width: 2px;
  fill: none;
}

.neo-icon.active {
  stroke: #FFD700;
}
```

---

## 10. 滚动条样式

### 10.1 自定义滚动条

```css
.neo-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.neo-scrollbar::-webkit-scrollbar-track {
  background: #131313;
}

.neo-scrollbar::-webkit-scrollbar-thumb {
  background: #FFD700;
  border: 4px solid #FFFFFF;
}

.neo-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #007F7F;
}
```

---

## 11. Toast提示样式

### 11.1 Toast规格

| 类型 | 背景色 | 边框 | 用途 |
|------|--------|------|------|
| 成功 | #4CAF50 | 4px白色 | 保存成功、删除成功 |
| 错误 | #FF5252 | 4px白色 | 操作失败 |
| 信息 | #FFD700 | 4px白色 | 一般提示 |

**样式规格：**
```css
.neo-toast {
  border: 4px solid #FFFFFF;
  border-radius: 0px;
  box-shadow: 8px 8px 0 rgba(0, 0, 0, 0.5);
  padding: 12px 24px;
  font-weight: 600;
  text-transform: uppercase;
}
```

---

## 12. CSS变量汇总

```css
:root {
  /* 颜色 */
  --neo-bg: #131313;
  --neo-primary: #FFD700;
  --neo-secondary: #007F7F;
  --neo-border: #FFFFFF;
  --neo-income: #007F7F;
  --neo-expense: #F44336;
  
  /* 边框 */
  --neo-border-width: 4px;
  --neo-radius: 0px;
  
  /* 阴影 */
  --neo-shadow-offset: 8px;
  
  /* 字体 */
  --neo-font-heading: 'Space Grotesk', sans-serif;
  --neo-font-body: 'Manrope', sans-serif;
  
  /* 动画 */
  --neo-transition: 200ms ease-out;
}
```

---

## 变更历史

| 版本 | 日期 | 变更内容 | 变更人 |
|-----|------|---------|--------|
| v1.0 | 2026-04-20 | 初始版本 | Claude AI |