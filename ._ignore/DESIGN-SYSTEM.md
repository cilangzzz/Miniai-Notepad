# 设计系统规格：KINETIC_NOTES Neo-Brutalist

## 1. 视觉主题与氛围

**创意北极星："The Kinetic Editor"**

这套设计系统拒绝标准 Web 架构的"安全"约束，拥抱高能量、编辑式美学。建立在**刚性几何与有意的不稳定性**之间的摩擦之上。通过倾斜容器、粗重笔画和极高对比度配色，创造出触感强烈、紧迫感和高级感的数字体验。

不同于传统的"扁平"设计，"The Kinetic Editor"使用**有意的非对称性**和**重叠层叠**来吸引注意力。每个元素都设计成仿佛被物理剪切粘贴到屏幕上，打破数字网格的第四面墙。

**核心氛围关键词**:
- 高能量 Editorial
- 粗野主义 Brutalist
- 高对比度 High-Contrast
- 触感 tactile
- 紧迫 urgent
- 高级 premium

---

## 2. 色彩系统与表面架构

配色以坚定的黑色(`#131313`)为锚点，提供虚空般的画布，让主次信号以最大强度震动。

### 2.1 核心色彩令牌

| 名称 | 色值 | 用途 |
|------|------|------|
| **Void Black (背景)** | `#131313` | 主背景、画布基底 |
| **Kinetic Gold (主强调)** | `#FFD700` | Hero高亮、关键操作状态、FAB按钮、选中态 |
| **Teal Depth (次强调)** | `#007F7F` | 内容块、结构区分、分类标签、侧边栏阴影 |
| **Surface Dark** | `#1b1b1b` | 低层级表面 |
| **Surface Mid** | `#1f1f1f` | 中层级表面 |
| **Surface High** | `#2a2a2a` | 高层级表面、卡片背景 |
| **Surface Highest** | `#353535` | 最高层级表面 |
| **Surface Recessed** | `#0e0e0e` | 凹陷区域、输入框背景 |
| **Crisp White (边框)** | `#FFFFFF` | 所有组件边框、文本、分隔 |
| **Charcoal Text** | `#e2e2e2` | 主文本色 |
| **Cyan Accent** | `#00f1ff` | 第三强调色、特殊高亮 |
| **Error Crimson** | `#93000a` | 错误状态容器 |

### 2.2 色彩层级嵌套

不使用传统投影，而是使用"色调嵌套"创造深度：

| 层级 | 色值 | 用途 |
|------|------|------|
| **Layer 0 (基底)** | `#131313` | surface - 主背景 |
| **Layer 1 (凹陷)** | `#0e0e0e` | surface_container_lowest - 二级输入区域 |
| **Layer 2 (提升)** | `#2a2a2a` | surface_container_high - 交互卡片 |

### 2.3 "无细线"规则

系统使用 4px 粗边框定义组件，**永不使用 1px 发丝线分隔区块**。分区通过：
1. **背景对比**：`surface_container_low` 区块直接对接 `background`
2. **负空间**：激进的垂直边距让黑色虚空作为主要分隔器

---

## 3. 字体系统

字体系统是 **Space Grotesk** 的技术精度与 **Manrope** 的可读清晰之间的对话。

### 3.1 字体家族

| 用途 | 字体 | 特征 |
|------|------|------|
| **Display/标题** | Space Grotesk | 几何无衬线、技术感、海报式 |
| **Body/正文** | Manrope | 人文无衬线、现代、可读 |
| **Label/标签** | Space Grotesk | 与标题统一、小号粗体 |

### 3.2 层级与权重

| 层级 | 权重 | 字号 | 字间距 | 用途 |
|------|------|------|--------|------|
| **Display-lg** | Black (900) | 3.5rem-8rem | tight (-0.02em) | Hero标题、页面大标题 |
| **Headline** | Black/ExtraBold | 2rem-3rem | tighter | 区块标题、卡片标题 |
| **Body-lg** | Medium (500) | 1rem-1.25rem | normal | 正文内容、描述 |
| **Label-md** | Bold (700) | 0.75rem-1rem | widest (0.05em) | 标签、分类名、时间戳 |
| **CTA Button** | Black (900) | 1rem | normal | 按钮文本 |

### 3.3 编辑式节奏

传达品牌身份时，始终将 `display` 标题与 `label-md` 全大写配对。这种"大/小"配对创造高端印刷杂志的编辑节奏。

---

## 4. 几何与形状

### 4.1 圆角规则

**核心原则：零圆角**

| 令牌 | 值 | 描述 |
|------|-----|------|
| `DEFAULT` | `0px` | 所有默认元素 |
| `lg` | `0px` | 大元素 |
| `xl` | `0px` | 超大元素 |
| `full` | `9999px` | 仅用于药丸形特殊元素 |

锐利边缘是要求，不是建议。

### 4.2 倾斜变换

创造"有意的不稳定性"：

| 变换 | 值 | 用途 |
|------|-----|------|
| `-skew-x-2` | -2度 | 品牌Logo、大标题 |
| `-skew-x-1` | -1度 | 卡片标题、次要标题 |
| `rotate-2` / `-rotate-2` | ±2度 | 标签芯片、装饰元素 |
| `rotate-3` / `-rotate-3` | ±3度 | 分类标签、状态标记 |

### 4.3 边框粗细

| 语境 | 粗细 | 用途 |
|------|------|------|
| **主要边框** | `4px` | 卡片、按钮、输入框、容器 |
| **次要边框** | `2px` | 标签、芯片、子元素 |
| **Ghost边框** | `1px` @ 20% opacity | 微妙定义元素 |

---

## 5. 深度与提升：Neo-Brutalist 层叠

远离 Material Design 的"阴影物理学"。深度是**物理位移**的问题。

### 5.1 偏移阴影系统

| 阴影类型 | 值 | 用途 |
|----------|-----|------|
| **Neo Shadow (黑)** | `8px 8px 0px 0px #000000` | 默认卡片阴影 |
| **Neo Shadow (白)** | `8px 8px 0px 0px #ffffff` | 高对比卡片 |
| **Neo Shadow (金)** | `8px 8px 0px 0px #FFD700` | 强调级卡片 |
| **Neo Shadow (青)** | `8px 8px 0px 0px #007F7F` | 侧边栏、结构性阴影 |
| **Hard-Stop Shadow** | `6px 6px 0px 0px #353535` | FAB浮动元素 |

### 5.2 偏移容器原理

深度通过偏移 `primary` 或 `secondary` 填充与白色容器边框实现：
- **倾斜**：头部和主卡片使用 -1 到 -2 度旋转/倾斜打破水平平面
- **禁止软阴影**：标准投影被禁止。如需浮动元素，使用**硬边阴影**

### 5.3 Glassmorphism

浮动导航或覆盖层使用：
- `surface` 颜色 @ 80% opacity
- `20px` backdrop-blur
- 确保金/青高亮"渗透"暗色UI，保持色调深度

---

## 6. 组件规格

### 6.1 按钮 Buttons

| 类型 | 填充 | 边框 | 文本 | Hover效果 |
|------|------|------|------|-----------|
| **Primary CTA** | `#FFD700` | 4px solid white | Black | 额外倾斜1度 + 上移 |
| **Secondary** | Transparent | 4px solid white | White | 倾斜变换 |
| **Tertiary** | 无填充 | 无边框 | White + 4px underline | underline变金色 |
| **Ghost** | Transparent | 2px dashed white/20 | White/50 | 实线边框 |

**尺寸规格**：
- 小按钮: `px-6 py-2`
- 大按钮/FAB: `w-20 h-20` 或 `px-8 py-4`

### 6.2 卡片 Cards ("Stamp" 风格)

| 属性 | 值 | 描述 |
|------|-----|------|
| **圆角** | `0px` | 无圆角 |
| **边框** | `4px solid white` | 粗白边框 |
| **阴影** | Neo Shadow | 8px偏移阴影 |
| **Hover** | `-translate-y-1 -translate-x-1` | 上移左移 |
| **内边距** | `p-6` 到 `p-8` | 舒适内距 |

**卡片变体**：
| 变体 | 填充色 | 边框色 | 用途 |
|------|--------|--------|------|
| **Primary Card** | `#007F7F` | White | 主要笔记卡片 |
| **Secondary Card** | `#2a2a2a` | White | 次级笔记 |
| **Accent Card** | `#FFD700` | White | 引用/高亮卡片 |
| **Dark Card** | `#131313` 或 `#0e0e0e` | White | 暗色卡片 |

### 6.3 输入框 Input Fields

| 状态 | 填充 | 边框 | 效果 |
|------|------|------|------|
| **Default** | `#0e0e0e` | 4px solid white | 无 |
| **Focus** | `#0e0e0e` | 4px solid `#FFD700` | 2px ghost白边框偏移 |
| **Placeholder** | `#353535` | - | 低可见度文本 |

**尺寸**：
- 大输入框: `p-6` 到 `p-8`
- 标签偏移: `-top-3 -left-2`

### 6.4 标签芯片 Chips/Tags

| 属性 | 值 | 描述 |
|------|-----|------|
| **圆角** | `0px` | 无圆角 |
| **边框** | `2px solid white` | 次级边框 |
| **内边距** | `px-3 py-1` 或 `px-6 py-2` | 激进横向内距 |
| **字体** | Bold, uppercase, 10px-12px | 标签风格 |
| **旋转** | `-rotate-3` 到 `rotate-3` | 有意歪斜 |
| **Hover** | `rotate-0` | 归位 |

**颜色变体**：
| 变体 | 填充 | 文本 | 边框 |
|------|------|------|------|
| **Selected** | `#FFD700` | Black | White |
| **Active** | `#007F7F` | White | White |
| **Neutral** | `#353535` | White | White |
| **Inverse** | `#FFFFFF` | Black | Black |

### 6.5 导航栏 Navigation

**TopAppBar**：
| 属性 | 值 |
|------|-----|
| 定位 | `fixed top-0` |
| 背景 | `#131313` |
| 边框 | `border-b-4 border-white` |
| 内边距 | `px-6 py-4` |
| Logo倾斜 | `-skew-x-2` |

**BottomNavBar (Mobile)**：
| 属性 | 值 |
|------|-----|
| 定位 | `fixed bottom-0` |
| 背景 | `#131313` |
| 边框 | `border-t-4 border-white` |
| 导航项 | 4个 (Notes, Tags, Archive, Settings) |
| 激活态 | 上移 `-translate-y-2` + 阴影 |

**NavigationDrawer (Desktop)**：
| 属性 | 值 |
|------|-----|
| 定位 | `fixed left-0` |
| 宽度 | `w-72` 或 `w-80` |
| 边框 | `border-r-4 border-white` |
| 阴影 | `8px 0px 0px 0px #007F7F` (青色侧阴影) |

### 6.6 FAB (Floating Action Button)

| 属性 | 值 |
|------|-----|
| 尺寸 | `w-20 h-20` |
| 填充 | `#FFD700` |
| 边框 | `4px solid white` |
| 阴影 | Neo Shadow (黑) |
| Hover | `scale-105` + 阴影增强 |
| Active | `translate-y-2` + shadow消失 |

---

## 7. 布局原则

### 7.1 网格系统

| 屏幕 | 列数 | 间距 |
|------|------|------|
| Mobile (<768px) | 1列 | `gap-8` |
| Tablet (768-1024px) | 2列 | `gap-8` |
| Desktop (>1024px) | 3列 | `gap-8` |
| Large Grid | 12列 | `gap-12` |

### 7.2 边距策略

| 语境 | 值 | 描述 |
|------|-----|------|
| **卡片间距** | `gap-8` | 32px间距 |
| **区块间距** | `mb-12` 到 `mb-16` | 48-64px |
| **Hero间距** | `mb-16` | 64px大间距 |
| **边缘内距 (Mobile)** | `px-6` | 24px |
| **边缘内距 (Desktop)** | `px-12` | 48px |

### 7.3 最大宽度

| 内容类型 | 最大宽度 |
|----------|----------|
| 主内容区 | `max-w-7xl` (1280px) |
| 编辑器区 | `max-w-6xl` (1152px) |
| 搜索结果 | `max-w-6xl` |

---

## 8. 动效与交互

### 8.1 过渡时长

| 类型 | 时长 | 用途 |
|------|------|------|
| **快速** | `150ms` | 按钮点击反馈 |
| **标准** | `200ms` | 导航项hover |
| **中速** | `250ms` | 卡片hover提升 |
| **慢速** | `300ms` | 倾斜变换归位 |

### 8.2 过渡曲线

| 曲线 | 用途 |
|------|------|
| `transition-transform` | 位移变换 |
| `transition-colors` | 颜色变换 |
| `transition-all` | 全属性变换 |

### 8.3 交互模式

| 交互 | 效果 |
|------|------|
| **Hover** | `-translate-y-1 -translate-x-1` + 阴影增强 |
| **Active/Pressed** | `translate-y-2` (向下按压) |
| **Focus** | 边框变金色 + ghost边框偏移 |

---

## 9. Do's 与 Don'ts

### Do ✓
- **重叠元素**：让按钮"突破"卡片边框
- **使用 0px 圆角**：锐利边缘是要求
- **高对比字号**：标题大就让它*巨大*
- **用青色平衡**：`#007F7F` 作为"镇静"结构元素平衡激进黄色

### Don't ✗
- **禁止软渐变**：所有过渡必须是阶梯式或硬边
- **禁止 1px 线**：使用垂直空间或色块分隔
- **禁止长文居中**：保持左对齐维持"网格打破"编辑感
- **禁止标准投影**：稀释黑色背景的高对比冲击

---

## 10. Stitch 提示词参考

生成新屏幕时的语言建议：

### 氛围描述
> "High-energy editorial Neo-Brutalist aesthetic with intentional asymmetry and overlapping layers, void-black background (#131313) with kinetic gold (#FFD700) and teal depth (#007F7F) accent colors"

### 组件描述
> "Cards with 4px white borders, 0px border-radius, 8px offset neo-brutalist shadows, hover translates up-left by 4px"
> "Buttons with gold (#FFD700) fill, 4px white border, no rounded corners, bold uppercase text with intentional skew"

### 标签描述
> "Tags with bold uppercase text, 2px white borders, random rotation (-3° to +3°), hover rotates to 0°"