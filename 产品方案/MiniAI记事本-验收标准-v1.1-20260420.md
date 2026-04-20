# 验收标准文档

## 文档信息

**产品名称：** KINETIC_NOTES（MiniAI记事本）
**文档版本：** v1.1
**创建日期：** 2026-04-20
**格式：** Gherkin (Given-When-Then)

---

## 设计系统验收标准

### AC-DESIGN-001 Neo-Brutalist卡片样式

#### 场景1：卡片基础样式
```gherkin
Given 任何笔记卡片
Then 卡片圆角为0px（无圆角）
And 卡片边框为4px白色边框
And 卡片阴影为8px偏移阴影
And 卡片背景为#131313（深黑色）
```

#### 场景2：卡片Hover效果
```gherkin
Given 用户在笔记卡片上
When 用户Hover卡片
Then 卡片上移(-translate-y-1, -translate-x-1)
And 阴影效果增强
```

#### 场景3：卡片类型样式
```gherkin
Given 不同类型的笔记卡片
Then 文本笔记卡片显示标题+摘要+时间
And 图片笔记卡片显示图片预览
And 任务清单卡片显示任务进度
And 引用卡片显示引用内容+来源
```

---

### AC-DESIGN-002 标签芯片样式

#### 场景1：标签旋转角度
```gherkin
Given 任何标签芯片
Then 标签带有旋转角度(-rotate-3 ~ rotate-3)
And 标签字体为粗体、小号、大写
```

#### 场景2：标签颜色变体
```gherkin
Given 不同颜色的标签
Then 黄色标签背景为#FFD700
And 青色标签背景为#007F7F
And 白色标签背景为#FFFFFF
And 深灰标签背景为#333333
```

#### 场景3：标签Hover效果
```gherkin
Given 用户在旋转标签上
When 用户Hover标签
Then 标签旋转归位(rotate-0)
And 标签颜色变青色背景
```

---

### AC-DESIGN-003 FAB按钮样式

#### 场景1：FAB基础样式
```gherkin
Given 右下角FAB添加按钮
Then FAB背景为黄色(#FFD700)
And FAB边框为4px白色边框
And FAB阴影为8px偏移阴影(Neo阴影)
And FAB圆角为0px
```

---

### AC-DESIGN-004 导航栏样式

#### 场景1：顶部导航栏样式
```gherkin
Given TopAppBar组件
Then 顶部固定
And 底部4px白色边框
And 品牌Logo为倾斜字体、黄色、粗体
```

#### 场景2：底部导航栏样式
```gherkin
Given BottomNavBar组件（移动端）
Then 底部固定
And 顶部4px白色边框
And 4个导航项
And 当前页面高亮显示（上移+阴影）
```

#### 场景3：侧边栏导航样式
```gherkin
Given NavigationDrawer组件（桌面端）
Then 左侧固定
And 青色阴影
And 分类导航列表
And 存储/容量指示器
```

---

### AC-DESIGN-005 响应式布局

#### 场景1：Mobile端布局
```gherkin
Given 用户设备宽度 < 768px
Then 笔记网格为单列布局
And 侧边栏隐藏（通过menu按钮展开）
And 显示底部导航栏
And 编辑器底部工具栏显示
```

#### 场景2：Tablet/Desktop端布局
```gherkin
Given 用户设备宽度 ≥ 768px
Then 笔记网格为双列布局
And 显示固定左侧导航栏
And 编辑器侧边信息栏完整显示
```

#### 场景3：Large Desktop端布局
```gherkin
Given 用户设备宽度 ≥ 1024px
Then 笔记网格为三列布局
And 完整侧边栏导航显示
```

---

## 新闻模块验收标准

### AC-US-NEWS-001 新闻列表浏览

#### 场景1：成功加载新闻列表
```gherkin
Given 用户打开APP
When APP启动完成
Then 新闻列表自动加载
And 显示至少10条新闻条目
And 新闻卡片采用Bento Grid布局
And 每条新闻显示标题、摘要、来源、时间
And 加载时间不超过2秒
And 卡片符合Neo-Brutalist样式（4px边框、8px阴影）
```

#### 场景2：新闻卡片Hover效果
```gherkin
Given 用户在新闻列表页面
When 用户Hover某条新闻卡片
Then 卡片上移(-translate-y-1, -translate-x-1)
And 阴影效果增强
```

---

### AC-US-NEWS-002 新闻详情阅读

#### 场景1：点击进入详情页
```gherkin
Given 用户在新闻列表页面
When 用户点击某条新闻卡片
Then 进入新闻详情页面
And 显示完整新闻标题（大号字体）
And 显示完整新闻内容
And 显示新闻来源和发布时间
And 显示返回按钮（黄色高亮）
And 页面背景为#131313
```

---

## 记事本模块验收标准

### AC-US-NOTE-001 笔记列表浏览

#### 场景1：Bento Grid布局显示
```gherkin
Given 用户进入笔记列表页面
Then 笔记以Bento Grid布局显示
And Mobile端为单列布局
And Tablet/Desktop端为双列/三列布局
And 每张卡片显示分类标签（带旋转角度）
And 每张卡片显示创建/更新时间
And 每张卡片显示标题和摘要
```

#### 场景2：卡片Hover预览
```gherkin
Given 用户在笔记列表页面
When 用户Hover某张笔记卡片
Then 卡片上移(-translate-y-1, -translate-x-1)
And 阴影效果增强
```

---

### AC-US-NOTE-002 创建笔记

#### 场景1：点击FAB创建笔记
```gherkin
Given 用户在笔记列表页面
When 用户点击右下角黄色FAB按钮
Then 进入笔记编辑页面
And 编辑页显示标题输入框（大号字体）
And 编辑页显示内容编辑区域（高度530px）
And 编辑页显示标签管理侧栏
And 编辑页显示提醒设置区块
And 编辑页显示外观控制区块
```

#### 场景2：成功创建笔记
```gherkin
Given 用户在笔记编辑页面
And 已输入标题"会议记录"
And 已输入内容"明天下午开会讨论项目进度"
And 已选择分类"Work"
And 已添加标签"project"
When 用户点击保存按钮（黄色高亮）
Then 笔记保存成功
And 返回笔记列表页面
And 新笔记出现在Bento Grid首位
And 显示Toast提示（黄色背景）
```

---

### AC-US-NOTE-003 编辑笔记

#### 场景1：进入编辑模式
```gherkin
Given 用户在笔记详情页面
When 用户点击编辑按钮
Then 进入笔记编辑页面
And 显示原有标题和内容
And 显示原有分类选中状态
And 显示原有标签（带关闭按钮）
And 显示外观控制区块（颜色选择器+字体粗细滑块）
```

#### 场景2：外观颜色设置
```gherkin
Given 用户在编辑页面外观控制区块
When 用户选择黄色颜色选项
Then 卡片颜色设置为黄色(#FFD700)
And 当前选中项显示ring高亮指示
```

---

### AC-US-NOTE-005 分类管理

#### 场景1：选择预设分类
```gherkin
Given 用户在笔记编辑页面
When 用户点击分类选择器
Then 显示预设分类列表：Work、Personal、Ideas、Tasks
And 用户可选择任一分类
And 选中分类显示高亮状态
```

#### 场景2：显示分类标签
```gherkin
Given 用户已保存带分类的笔记
When 笔记在Bento Grid中显示
Then 显示分类标签
And 标签带旋转角度(-rotate-3 ~ rotate-3)
And Work分类用青色标签
And Personal分类用黄色标签
And Ideas分类用白色标签
And Tasks分类用深灰标签
```

---

### AC-US-NOTE-007 标签管理

#### 场景1：添加标签
```gherkin
Given 用户在笔记编辑页面标签管理侧栏
When 用户点击"+ ADD TAG"虚线按钮
Then 显示标签输入框
And 用户输入标签名称后添加成功
And 新标签显示在标签列表中
And 标签带关闭按钮
```

#### 场景2：移除标签
```gherkin
Given 用户在编辑页面已有标签列表
When 用户点击某标签的关闭按钮
Then 该标签从列表中移除
```

---

### AC-US-NOTE-008 卡片外观设置

#### 场景1：颜色选择
```gherkin
Given 用户在编辑页面Card Chromatic区块
Then 显示4个颜色选项：黄色、青色、白色、深灰
When 用户选择某颜色
Then 卡片颜色设置为对应颜色
And 当前选中项显示ring高亮指示
```

#### 场景2：字体粗细设置
```gherkin
Given 用户在编辑页面Card Chromatic区块
When 用户拖动字体粗细滑块
Then 卡片字体粗细相应调整
```

---

### AC-US-NOTE-010 笔记归档

#### 场景1：归档笔记
```gherkin
Given 用户在笔记详情页面
When 用户点击归档按钮
Then 笔记移入归档列表
And 笔记从主列表中移除
And 显示Toast提示"已归档"
```

---

### AC-US-NOTE-011 笔记恢复

#### 场景1：从归档恢复
```gherkin
Given 用户在归档搜索页面
And 某笔记处于归档状态（灰度+透明度70%）
When 用户点击恢复按钮（unarchive图标）
Then 笔记恢复到主列表
And 笔记恢复正常显示（灰度取消+透明度100%）
```

---

## 分类标签模块验收标准

### AC-US-CAT-001 分类列表管理

#### 场景1：分类列表显示
```gherkin
Given 用户进入分类标签页面
Then 显示分类列表：Work、Personal、Ideas、Tasks
And 每个分类显示笔记数量
And Hover时显示编辑/删除按钮
```

#### 场景2：编辑分类
```gherkin
Given 用户在分类列表
When 用户Hover某分类并点击编辑按钮
Then 显示分类编辑表单
And 用户可修改分类名称和颜色
```

---

### AC-US-CAT-004 标签云浏览

#### 场景1：标签云显示
```gherkin
Given 用户进入分类标签页面
Then 显示标签云区域
And 标签以多彩按钮形式显示
And 标签带旋转角度(-rotate-3 ~ rotate-3)
And 标签颜色包括：黄色、青色、白色、深灰
```

#### 场景2：标签Hover效果
```gherkin
Given 用户在标签云区域
When 用户Hover某标签
Then 标签旋转归位(rotate-0)
And 标签背景变青色
```

#### 场景3：标签点击筛选
```gherkin
Given 用户在标签云区域
When 用户点击某标签
Then 该标签激活（高亮显示）
And 笔记列表筛选显示带该标签的笔记
```

---

### AC-US-CAT-006 统计面板查看

#### 场景1：统计信息显示
```gherkin
Given 用户在分类标签页面
Then 显示"Total Tags"统计（标签总数）
And 显示"Tagged Notes"统计（已标记笔记数）
And 统计数字为大号粗体字体
```

---

## 归档搜索模块验收标准

### AC-US-ARCH-001 搜索查询

#### 场景1：搜索框显示
```gherkin
Given 用户进入归档搜索页面
Then 显示大号搜索输入框
And 占位提示为"QUERY THE ARCHIVE..."
And 搜索框有背景偏移层 + 主输入层（Neo风格）
And 显示"Execute"按钮
```

#### 场景2：执行搜索
```gherkin
Given 用户在归档搜索页面
And 已输入关键词"会议"
When 用户点击Execute按钮
Then 显示匹配的归档结果
And 结果卡片默认灰度+透明度70%
```

---

### AC-US-ARCH-002 时间筛选

#### 场景1：时间筛选芯片
```gherkin
Given 用户在归档搜索页面
Then 显示时间筛选芯片：All Time、Last 30 Days
When 用户点击某时间芯片
Then 该芯片激活（青色背景）
And 搜索结果按时间范围筛选
```

---

### AC-US-ARCH-003 分类筛选

#### 场景1：分类筛选芯片
```gherkin
Given 用户在归档搜索页面
Then 显示分类筛选芯片：Work、Ideas等
When 用户点击某分类芯片
Then 该芯片激活（青色背景）
And 搜索结果按分类筛选
```

---

### AC-US-ARCH-004 归档结果浏览

#### 场景1：归档结果显示
```gherkin
Given 用户在归档搜索页面有搜索结果
Then 结果卡片默认灰度+透明度70%
And 显示归档日期时间戳
And 显示恢复按钮（unarchive图标）
```

#### 场景2：归档结果Hover效果
```gherkin
Given 用户在归档搜索结果区域
When 用户Hover某归档卡片
Then 卡片灰度取消+透明度100%
And 卡片恢复正常预览状态
```

---

## 导航模块验收标准

### AC-US-NAV-001 底部导航切换

#### 场景1：底部导航显示
```gherkin
Given 用户在Mobile端（< 768px）
Then 显示底部导航栏
And 导航栏顶部4px白色边框
And 显示5个Tab：Notes、Tags、Archive、Finance、Settings
And 当前激活Tab高亮显示（上移+阴影）
```

#### 场景2：切换Tab
```gherkin
Given 用户当前在Notes Tab
When 用户点击Tags Tab
Then 切换到分类标签页面
And Tags Tab图标变为高亮状态（上移+阴影）
And Notes Tab图标变为默认状态
```

---

### AC-US-NAV-002 侧边栏导航

#### 场景1：桌面端侧边栏显示
```gherkin
Given 用户在Desktop端（≥ 768px）
Then 显示左侧固定侧边栏
And 侧边栏有青色阴影
And 显示分类导航列表
And 显示存储容量指示器
```

#### 场景2：分类导航切换
```gherkin
Given 用户在Desktop端侧边栏
When 用户点击某分类
Then 该分类高亮显示
And 笔记列表筛选为该分类
```

---

### AC-US-NAV-003 顶部导航栏

#### 场景1：顶部导航显示
```gherkin
Given 用户打开APP
Then 显示TopAppBar
And 顶部固定
And 底部4px白色边框
And 品牌Logo为"KINETIC_NOTES"（倾斜、黄色、粗体）
And 显示菜单按钮
And 显示搜索按钮
And 显示用户头像
```

---

## 财务模块验收标准

### AC-US-INCOME-001 添加收入记录

#### 场景1：收入添加表单
```gherkin
Given 用户点击添加收入按钮
Then 显示收入添加表单（Neo风格）
And 表单有4px边框、8px阴影偏移
And 表单包含金额输入框、来源选择器、日期选择器、备注输入框
```

#### 场景2：成功添加收入
```gherkin
Given 用户在收入添加表单
And 已输入金额"5000"
And 已选择来源"工资"
When 用户点击保存按钮
Then 收入记录保存成功
And 显示Toast提示（青色背景）
And 收入列表更新显示新记录
```

---

### AC-US-FINANCE-001 收支概览

#### 场景1：概览页面显示
```gherkin
Given 用户进入收支概览页面
Then 显示本月收入卡片（青色标识、4px边框、8px阴影）
And 显示本月支出卡片（红色标识）
And 显示本月余额卡片（正数绿色/负数红色）
And 余额 = 收入 - 支出
```

---

## 验收标准统计

| 模块 | 验收标准数量 | 场景数量 |
|------|-------------|---------|
| 设计系统 | 5 | 13 |
| 新闻模块 | 2 | 3 |
| 记事本模块 | 11 | 14 |
| 分类标签模块 | 4 | 6 |
| 归档搜索模块 | 4 | 6 |
| 导航模块 | 3 | 5 |
| 财务模块 | 2 | 3 |
| **总计** | **32** | **50** |

---

## 变更历史

| 版本 | 日期 | 变更内容 | 变更人 |
|-----|------|---------|--------|
| v1.0 | 2026-04-20 | 初始版本 | Claude AI |
| v1.1 | 2026-04-20 | 融入初版原型UI规格，新增设计系统、分类标签、归档搜索、导航验收标准 | Claude AI |