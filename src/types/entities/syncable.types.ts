/**
 * 同步状态枚举
 */
export type SyncStatus =
  | 'local'     // 仅本地存在，未同步
  | 'pending'   // 待同步（本地变更未推送）
  | 'synced'    // 已同步（本地与云端一致）
  | 'conflict'  // 冲突（需要用户决定）

/**
 * 同步实体基类 - 所有需要云同步的实体都继承此接口
 */
export interface SyncableEntity {
  // 本地标识
  id: string              // UUID，本地生成的主键

  // 云同步预留字段
  cloud_id?: string       // 云端唯一标识（同步后填充）
  sync_status: SyncStatus // 同步状态
  local_version: number   // 本地数据版本（乐观锁）
  cloud_version?: number  // 云端数据版本（冲突检测）

  // 时间戳
  created_at: number      // 创建时间戳 (milliseconds)
  updated_at: number      // 最后更新时间戳
  last_sync_at?: number   // 最后同步时间戳

  // 删除标记
  is_deleted: boolean     // 软删除标记
  deleted_at?: number     // 删除时间戳
}