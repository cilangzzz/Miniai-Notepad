import type { Table } from 'dexie'
import type { SyncableEntity, SyncStatus } from '../../types/entities'
import type { IRepository, QuerySpec, FilterCondition, ConflictResolution } from './IRepository'

/**
 * 生成UUID
 */
function generateUUID(): string {
  return crypto.randomUUID()
}

/**
 * 深度克隆对象，去除 Proxy 和不可序列化的属性
 * 使对象可以被 IndexedDB 存储
 */
function toPlainObject<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj
  }

  if (typeof obj !== 'object') {
    return obj
  }

  // 处理数组
  if (Array.isArray(obj)) {
    return obj.map(item => toPlainObject(item)) as T
  }

  // 处理 Date 对象
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T
  }

  // 处理普通对象 - 去除 Proxy
  const plain: Record<string, unknown> = {}
  for (const key of Object.keys(obj)) {
    const value = (obj as Record<string, unknown>)[key]
    // 跳过函数和 undefined
    if (typeof value !== 'function') {
      plain[key] = toPlainObject(value)
    }
  }
  return plain as T
}

/**
 * Repository基类实现
 * 提供通用的CRUD操作和同步预留方法
 */
export abstract class BaseRepository<T extends SyncableEntity, CreateDTO, UpdateDTO>
  implements IRepository<T, CreateDTO, UpdateDTO> {

  protected table: Table<T, string>

  constructor(table: Table<T, string>) {
    this.table = table
  }

  async findById(id: string): Promise<T | null> {
    const entity = await this.table.get(id)
    return entity ?? null
  }

  async findAll(): Promise<T[]> {
    return this.table.toArray()
  }

  async create(data: CreateDTO): Promise<T> {
    const now = Date.now()
    const newEntity = toPlainObject({
      ...data,
      id: generateUUID(),
      created_at: now,
      updated_at: now,
      local_version: 1,
      sync_status: 'local' as SyncStatus,
      is_deleted: false,
    }) as unknown as T

    await this.table.add(newEntity)
    return newEntity
  }

  async update(id: string, data: UpdateDTO): Promise<T> {
    const existing = await this.findById(id)
    if (!existing) {
      throw new Error(`Entity ${id} not found`)
    }

    const now = Date.now()
    const updated = toPlainObject({
      ...existing,
      ...data,
      updated_at: now,
      local_version: existing.local_version + 1,
      sync_status: existing.sync_status === 'synced' ? 'pending' : existing.sync_status,
    }) as T

    await this.table.put(updated)
    return updated
  }

  async delete(id: string): Promise<void> {
    // 软删除：设置 is_deleted = true
    const existing = await this.findById(id)
    if (!existing) {
      throw new Error(`Entity ${id} not found`)
    }

    await this.update(id, {
      is_deleted: true,
      deleted_at: Date.now(),
    } as unknown as UpdateDTO)
  }

  async count(): Promise<number> {
    return this.table.count()
  }

  async bulkCreate(entities: CreateDTO[]): Promise<T[]> {
    const now = Date.now()
    const newEntities = entities.map(data => toPlainObject({
      ...data,
      id: generateUUID(),
      created_at: now,
      updated_at: now,
      local_version: 1,
      sync_status: 'local' as SyncStatus,
      is_deleted: false,
    }) as unknown as T)

    await this.table.bulkAdd(newEntities)
    return newEntities
  }

  async bulkUpdate(ids: string[], data: UpdateDTO): Promise<T[]> {
    const now = Date.now()
    const results: T[] = []

    for (const id of ids) {
      const existing = await this.findById(id)
      if (existing) {
        const updated = toPlainObject({
          ...existing,
          ...data,
          updated_at: now,
          local_version: existing.local_version + 1,
          sync_status: existing.sync_status === 'synced' ? 'pending' : existing.sync_status,
        }) as T
        await this.table.put(updated)
        results.push(updated)
      }
    }

    return results
  }

  async bulkDelete(ids: string[]): Promise<void> {
    for (const id of ids) {
      await this.delete(id)
    }
  }

  async query(spec: QuerySpec): Promise<T[]> {
    let collection = this.table.toCollection()

    // 应用筛选条件
    if (spec.filters && spec.filters.length > 0) {
      for (const filter of spec.filters) {
        collection = this.applyFilter(collection, filter)
      }
    }

    // 获取结果数组
    let results = await collection.toArray()

    // 排除已删除的实体
    results = results.filter(entity => !entity.is_deleted)

    // 应用排序
    if (spec.sort) {
      results.sort((a, b) => {
        const aVal = a[spec.sort.field as keyof T]
        const bVal = b[spec.sort.field as keyof T]
        if (aVal === bVal) return 0
        if (aVal === undefined || aVal === null) return 1
        if (bVal === undefined || bVal === null) return -1
        const cmp = aVal < bVal ? -1 : 1
        return spec.sort.direction === 'asc' ? cmp : -cmp
      })
    }

    // 应用分页
    if (spec.offset) {
      results = results.slice(spec.offset)
    }
    if (spec.limit) {
      results = results.slice(0, spec.limit)
    }

    return results
  }

  /**
   * 应用筛选条件
   * 子类可重写以实现特定筛选逻辑
   */
  protected applyFilter(collection: Dexie.Collection<T, string>, filter: FilterCondition): Dexie.Collection<T, string> {
    return collection.and(entity => {
      const value = entity[filter.field as keyof T]

      switch (filter.operator) {
        case 'eq':
          return value === filter.value
        case 'neq':
          return value !== filter.value
        case 'gt':
          return value > filter.value
        case 'gte':
          return value >= filter.value
        case 'lt':
          return value < filter.value
        case 'lte':
          return value <= filter.value
        case 'in':
          return Array.isArray(filter.value) && filter.value.includes(value)
        case 'contains':
          return typeof value === 'string' && value.includes(filter.value as string)
        default:
          return true
      }
    })
  }

  // ========== 同步预留方法 ==========

  async getPendingSync(): Promise<T[]> {
    return this.table
      .filter(entity => entity.sync_status === 'pending' && !entity.is_deleted)
      .toArray()
  }

  async markSynced(id: string, cloudId: string): Promise<void> {
    await this.table.update(id, {
      cloud_id: cloudId,
      sync_status: 'synced',
      last_sync_at: Date.now(),
    } as Partial<T>)
  }

  async resolveConflict(id: string, resolution: ConflictResolution): Promise<T> {
    const entity = await this.findById(id)
    if (!entity) {
      throw new Error(`Entity ${id} not found`)
    }

    let resolved: T

    switch (resolution) {
      case 'keep_local':
        resolved = toPlainObject({
          ...entity,
          sync_status: 'pending',
          updated_at: Date.now(),
        }) as T
        break
      case 'keep_cloud':
        // 实际实现需要传入云端数据
        resolved = toPlainObject(entity) as T
        break
      case 'merge':
        // 实际实现需要合并策略
        resolved = toPlainObject(entity) as T
        break
      default:
        resolved = toPlainObject(entity) as T
    }

    await this.table.put(resolved)
    return resolved
  }

  /**
   * 查找所有未删除的实体
   * 使用 filter() 而不是 where() 以避免索引问题
   */
  async findAllActive(): Promise<T[]> {
    return this.table
      .filter(entity => entity.is_deleted === false)
      .toArray()
  }

  /**
   * 根据云端ID查找
   */
  async findByCloudId(cloudId: string): Promise<T | null> {
    const entity = await this.table
      .where('cloud_id')
      .equals(cloudId)
      .first()
    return entity ?? null
  }
}