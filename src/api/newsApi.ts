import type { NewsArticle, NewsCategory } from '@/types/entities/news'

export interface NewsListResponse {
  articles: NewsArticle[]
  total: number
  page: number
  page_size: number
  has_more: boolean
}

export interface NewsApiConfig {
  baseUrl: string
  apiKey?: string
  timeout: number
}

const defaultConfig: NewsApiConfig = {
  baseUrl: '/api/news',
  timeout: 10000,
}

class NewsApiService {
  private config: NewsApiConfig

  constructor(config: NewsApiConfig = defaultConfig) {
    this.config = config
  }

  /**
   * Get news list
   */
  async getNews(params: {
    page: number
    category?: NewsCategory | 'all'
    pageSize: number
  }): Promise<NewsListResponse> {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      pageSize: params.pageSize.toString(),
    })

    if (params.category && params.category !== 'all') {
      queryParams.set('category', params.category)
    }

    const response = await this.fetchWithTimeout(`${this.config.baseUrl}?${queryParams}`)

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    return response.json()
  }

  /**
   * Get news detail
   */
  async getNewsDetail(id: string): Promise<NewsArticle> {
    const response = await this.fetchWithTimeout(`${this.config.baseUrl}/${id}`)

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    return response.json()
  }

  /**
   * Fetch with timeout
   */
  private async fetchWithTimeout(url: string): Promise<Response> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout)

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: this.config.apiKey
          ? { 'Authorization': `Bearer ${this.config.apiKey}` }
          : {},
      })
      return response
    } finally {
      clearTimeout(timeoutId)
    }
  }

  /**
   * Set configuration
   */
  setConfig(config: Partial<NewsApiConfig>) {
    this.config = { ...this.config, ...config }
  }
}

export const newsApi = new NewsApiService()