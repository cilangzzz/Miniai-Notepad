export type {
  IFinanceRepository,
  MonthlySummary,
  CategorySummary,
  SourceSummary,
  TrendData
} from './IFinanceRepository'

export { FinanceRepository } from './FinanceRepository'

// 创建默认实例
import { FinanceRepository } from './FinanceRepository'
export const financeRepo = new FinanceRepository()