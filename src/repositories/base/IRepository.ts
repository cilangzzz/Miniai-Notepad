import type { SyncableEntity, SyncStatus } from '../../types/entities'

/**
 * 查询条件
 */
export interface FilterCondition {
  field: string
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains'
  value: unknown
}

/**
 * 排序规格
 */
export interface SortSpec {
  field: string
  direction: 'asc' | 'desc'
}

/**
 * 查询规格
 */
export interface QuerySpec {
  filters?: FilterCondition[]
  sort?: SortSpec
  limit?: number
  offset?: number
}

/**
 * 冲突解决策略
 */
export type ConflictResolution = 'keep_local' | 'keep_cloud' | 'merge'

/**
 * Repository通用接口
 * 定义所有实体仓库的基础操作
 */
export interface IRepository<T extends SyncableEntity, CreateDTO, UpdateDTO> {
  // 基础CRUD
  findById(id: string): Promise<T | null>
  findAll(): Promise<T[]>
  create(data: CreateDTO): Promise<T>
  update(id: string, data: UpdateDTO): Promise<T>
  delete(id: string): Promise<void>  // 软删除
  count(): Promise<number>

  // 批量操作
  bulkCreate(entities: CreateDTO[]): Promise<T[]>
  bulkUpdate(ids: string[], data: UpdateDTO): Promise<T[]>
  bulkDelete(ids: string[]): Promise<void>

  // 查询接口
  query(spec: QuerySpec): Promise<T[]>

  // 同步预留接口
  getPendingSync(): Promise<T[]>
  markSynced(id: string, cloudId: string): Promise<void>
  resolveConflict(id: string, resolution: ConflictResolution): Promise<T>
}