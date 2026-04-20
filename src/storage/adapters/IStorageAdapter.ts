/**
 * 存储适配器接口
 * 定义统一的存储操作接口，支持不同存储实现的切换
 */
export interface IStorageAdapter<T> {
  /**
   * 获取单个实体
   * @param storeName 存储名称（表名）
   * @param key 实体主键
   * @returns 实体对象或null
   */
  get(storeName: string, key: string): Promise<T | null>

  /**
   * 获取所有实体
   * @param storeName 存储名称
   * @returns 实体数组
   */
  getAll(storeName: string): Promise<T[]>

  /**
   * 设置（创建或更新）实体
   * @param storeName 存储名称
   * @param key 实体主键
   * @param value 实体值
   */
  set(storeName: string, key: string, value: T): Promise<void>

  /**
   * 删除实体
   * @param storeName 存储名称
   * @param key 实体主键
   */
  delete(storeName: string, key: string): Promise<void>

  /**
   * 清空存储
   * @param storeName 存储名称
   */
  clear(storeName: string): Promise<void>

  /**
   * 获取实体数量
   * @param storeName 存储名称
   * @returns 实体数量
   */
  count(storeName: string): Promise<number>
}