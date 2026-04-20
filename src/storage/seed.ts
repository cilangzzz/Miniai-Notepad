import type { Note, NewsArticle } from '../types/entities'
import { getDB } from './db'

/**
 * 生成假数据
 * 用于开发和测试
 */

// 归档笔记假数据
const archivedNotes: Partial<Note>[] = [
  {
    id: 'arch-note-1',
    title: '2023年度工作总结',
    content: '今年完成了多个重要项目，包括用户管理系统重构、性能优化和新功能开发。团队协作效率提升明显，代码质量也有所改善。',
    category_id: 'cat-work',
    tags: ['tag-summary', 'tag-work'],
    card_type: 'text',
    card_color: 'cyan',
    font_weight: 'bold',
    is_archived: true,
    archived_at: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30天前归档
    is_pinned: false,
    created_at: Date.now() - 365 * 24 * 60 * 60 * 1000,
    updated_at: Date.now() - 30 * 24 * 60 * 60 * 1000,
    sync_status: 'local',
    local_version: 1,
    is_deleted: false,
  },
  {
    id: 'arch-note-2',
    title: '旧项目需求文档',
    content: '项目名称：智能客服系统\n主要功能：\n1. 自动回复常见问题\n2. 多轮对话支持\n3. 用户情绪分析\n4. 知识库管理',
    category_id: 'cat-ideas',
    tags: ['tag-doc', 'tag-project'],
    card_type: 'task',
    card_color: 'yellow',
    font_weight: 'normal',
    is_archived: true,
    archived_at: Date.now() - 60 * 24 * 60 * 60 * 1000, // 60天前归档
    is_pinned: false,
    created_at: Date.now() - 180 * 24 * 60 * 60 * 1000,
    updated_at: Date.now() - 60 * 24 * 60 * 60 * 1000,
    sync_status: 'local',
    local_version: 1,
    is_deleted: false,
  },
  {
    id: 'arch-note-3',
    title: '读书笔记：《深度工作》',
    content: '核心观点：\n- 专注力是稀缺资源\n- 深度工作需要无干扰环境\n- 浮浅工作应尽量减少\n- 建立仪式感有助于进入深度状态',
    category_id: 'cat-personal',
    tags: ['tag-book', 'tag-learning'],
    card_type: 'quote',
    card_color: 'white',
    font_weight: 'medium',
    is_archived: true,
    archived_at: Date.now() - 90 * 24 * 60 * 60 * 1000, // 90天前归档
    is_pinned: false,
    created_at: Date.now() - 120 * 24 * 60 * 60 * 1000,
    updated_at: Date.now() - 90 * 24 * 60 * 60 * 1000,
    sync_status: 'local',
    local_version: 1,
    is_deleted: false,
  },
  {
    id: 'arch-note-4',
    title: '已完成的购物清单',
    content: '购物清单（2024春节）：\n✅ 牛奶 2箱\n✅ 水果若干\n✅ 新年装饰品\n✅ 礼盒套装',
    category_id: 'cat-tasks',
    tags: ['tag-shopping'],
    card_type: 'task',
    card_color: 'gray',
    font_weight: 'normal',
    is_archived: true,
    archived_at: Date.now() - 15 * 24 * 60 * 60 * 1000, // 15天前归档
    is_pinned: false,
    created_at: Date.now() - 45 * 24 * 60 * 60 * 1000,
    updated_at: Date.now() - 15 * 24 * 60 * 60 * 1000,
    sync_status: 'local',
    local_version: 1,
    is_deleted: false,
  },
  {
    id: 'arch-note-5',
    title: '出差行程记录',
    content: '日期：2023年11月15-17日\n地点：上海\n目的：客户会议\n行程：\n- Day1: 技术交流\n- Day2: 方案讨论\n- Day3: 合同签署',
    category_id: 'cat-work',
    tags: ['tag-travel', 'tag-work'],
    card_type: 'text',
    card_color: 'cyan',
    font_weight: 'bold',
    is_archived: true,
    archived_at: Date.now() - 120 * 24 * 60 * 60 * 1000, // 120天前归档
    is_pinned: false,
    created_at: Date.now() - 150 * 24 * 60 * 60 * 1000,
    updated_at: Date.now() - 120 * 24 * 60 * 60 * 1000,
    sync_status: 'local',
    local_version: 1,
    is_deleted: false,
  },
]

// 新闻假数据
const newsArticles: Partial<NewsArticle>[] = [
  {
    id: 'news-1',
    title: '人工智能新突破：GPT-5即将发布',
    content: '据悉，OpenAI正在开发下一代语言模型GPT-5，预计将在今年第四季度发布。新模型将具备更强的推理能力和多模态理解功能，有望在医疗、教育等领域带来革命性变化。',
    summary: 'OpenAI下一代语言模型即将发布，推理能力大幅提升',
    source: '科技日报',
    author: '张明',
    url: 'https://tech-news.example.com/articles/gpt5-announcement',
    image_url: 'https://picsum.photos/seed/tech1/400/200',
    published_at: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2天前
    category: 'tech',
    is_saved: false,
    is_read: false,
    sync_status: 'local',
    local_version: 1,
    is_deleted: false,
  },
  {
    id: 'news-2',
    title: '全球股市迎来新高，科技股领涨',
    content: '本周全球主要股市指数均创下历史新高，其中科技板块表现尤为亮眼。分析师认为，这与AI技术的快速发展密切相关，投资者对科技公司的未来充满信心。',
    summary: '科技股推动全球股市创新高',
    source: '财经周刊',
    author: '李华',
    url: 'https://finance-weekly.example.com/articles/stock-high',
    image_url: 'https://picsum.photos/seed/finance1/400/200',
    published_at: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5天前
    category: 'finance',
    is_saved: true,
    saved_at: Date.now() - 4 * 24 * 60 * 60 * 1000,
    is_read: true,
    sync_status: 'local',
    local_version: 1,
    is_deleted: false,
  },
  {
    id: 'news-3',
    title: '新型环保材料研发成功，可替代塑料',
    content: '科研团队成功研发出一种新型生物降解材料，可在自然环境中完全分解，不产生有害物质。这项技术有望彻底解决塑料污染问题，为环保事业带来重大突破。',
    summary: '新型生物降解材料问世，塑料污染有望解决',
    source: '环保时报',
    author: '王芳',
    url: 'https://eco-news.example.com/articles/new-material',
    image_url: 'https://picsum.photos/seed/eco1/400/200',
    published_at: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7天前
    category: 'life',
    is_saved: false,
    is_read: true,
    sync_status: 'local',
    local_version: 1,
    is_deleted: false,
  },
  {
    id: 'news-4',
    title: '国际空间站迎来新成员，中国宇航员首次进入',
    content: '中国宇航员首次成功进入国际空间站，标志着中国航天事业迈入新阶段。此次任务将持续六个月，期间将开展多项科学实验和技术验证。',
    summary: '中国宇航员首次进入国际空间站',
    source: '环球航天',
    author: '陈伟',
    url: 'https://space-news.example.com/articles/china-iss',
    image_url: 'https://picsum.photos/seed/space1/400/200',
    published_at: Date.now() - 10 * 24 * 60 * 60 * 1000, // 10天前
    category: 'world',
    is_saved: false,
    is_read: false,
    sync_status: 'local',
    local_version: 1,
    is_deleted: false,
  },
  {
    id: 'news-5',
    title: '量子计算商用化取得重大进展',
    content: '多家科技公司宣布量子计算商用化计划，预计在未来三年内推出面向企业的量子计算服务。这将极大地加速药物研发、金融建模等领域的发展。',
    summary: '量子计算即将进入商用时代',
    source: '科技前沿',
    author: '刘强',
    url: 'https://tech-frontier.example.com/articles/quantum-commercial',
    image_url: 'https://picsum.photos/seed/quantum1/400/200',
    published_at: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3天前
    category: 'tech',
    is_saved: false,
    is_read: false,
    sync_status: 'local',
    local_version: 1,
    is_deleted: false,
  },
  {
    id: 'news-6',
    title: '新能源汽车销量突破千万，行业迎来拐点',
    content: '今年新能源汽车全球销量首次突破一千万辆，市场份额达到15%。专家预测，未来五年内新能源汽车将成为主流，传统燃油车将逐渐退出市场。',
    summary: '新能源汽车销量破千万，行业格局加速变革',
    source: '汽车产业报',
    author: '周涛',
    url: 'https://auto-news.example.com/articles/ev-million',
    image_url: 'https://picsum.photos/seed/auto1/400/200',
    published_at: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1天前
    category: 'finance',
    is_saved: false,
    is_read: false,
    sync_status: 'local',
    local_version: 1,
    is_deleted: false,
  },
  {
    id: 'news-7',
    title: '健康生活方式：科学饮食指南',
    content: '最新研究表明，科学的饮食方式可以显著改善健康状况。建议每天摄入五种不同颜色的蔬菜水果，控制糖分和油脂摄入，保持规律饮食时间。',
    summary: '科学饮食有助于改善整体健康',
    source: '健康生活',
    author: '赵琳',
    url: 'https://health-life.example.com/articles/diet-guide',
    image_url: 'https://picsum.photos/seed/health1/400/200',
    published_at: Date.now() - 14 * 24 * 60 * 60 * 1000, // 14天前
    category: 'life',
    is_saved: true,
    saved_at: Date.now() - 13 * 24 * 60 * 60 * 1000,
    is_read: true,
    sync_status: 'local',
    local_version: 1,
    is_deleted: false,
  },
  {
    id: 'news-8',
    title: '全球气候峰会达成新协议',
    content: '在最新一轮全球气候峰会上，各国代表就碳排放目标达成新协议。协议规定到2030年全球碳排放量将减少50%，并设立专项基金支持发展中国家绿色转型。',
    summary: '各国就减排目标达成共识',
    source: '环球时报',
    author: '杨帆',
    url: 'https://world-news.example.com/articles/climate-summit',
    image_url: 'https://picsum.photos/seed/climate1/400/200',
    published_at: Date.now() - 8 * 24 * 60 * 60 * 1000, // 8天前
    category: 'world',
    is_saved: false,
    is_read: false,
    sync_status: 'local',
    local_version: 1,
    is_deleted: false,
  },
]

/**
 * 检查是否需要添加假数据
 */
async function shouldSeed(): Promise<boolean> {
  const db = getDB()
  const archivedCount = await db.notes.filter(n => n.is_archived && !n.is_deleted).count()
  const newsCount = await db.newsCache.filter(n => !n.is_deleted).count()
  return archivedCount === 0 || newsCount === 0
}

/**
 * 添加归档笔记假数据
 */
async function seedArchivedNotes(): Promise<void> {
  const db = getDB()
  const existingArchived = await db.notes.filter(n => n.is_archived && !n.is_deleted).count()

  if (existingArchived === 0) {
    const notesToAdd = archivedNotes.map(note => ({
      ...note,
      id: note.id || `arch-${crypto.randomUUID()}`,
      cloud_id: undefined,
      sync_status: 'local',
      local_version: 1,
      cloud_version: undefined,
      last_sync_at: undefined,
      reminder_status: undefined,
      attachments: undefined,
      pinned_at: undefined,
      deleted_at: undefined,
    })) as Note[]

    await db.notes.bulkAdd(notesToAdd)
    console.log('Seeded archived notes:', notesToAdd.length)
  }
}

/**
 * 添加新闻假数据
 */
async function seedNews(): Promise<void> {
  const db = getDB()
  const existingNews = await db.newsCache.filter(n => !n.is_deleted).count()

  if (existingNews === 0) {
    const newsToAdd = newsArticles.map(article => ({
      ...article,
      id: article.id || `news-${crypto.randomUUID()}`,
      cloud_id: undefined,
      sync_status: 'local',
      local_version: 1,
      cloud_version: undefined,
      last_sync_at: undefined,
      deleted_at: undefined,
    })) as NewsArticle[]

    await db.newsCache.bulkAdd(newsToAdd)
    console.log('Seeded news articles:', newsToAdd.length)
  }
}

/**
 * 执行所有假数据添加
 */
export async function seedFakeData(): Promise<void> {
  try {
    if (await shouldSeed()) {
      console.log('Starting to seed fake data...')
      await seedArchivedNotes()
      await seedNews()
      console.log('Fake data seeding completed')
    }
  } catch (err) {
    console.warn('Failed to seed fake data:', err)
  }
}