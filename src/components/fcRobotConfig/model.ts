// Robot 配置通用接口集合（钉钉通知、企业微信通知等按渠道传入各自的接口）
export interface RobotApiSet {
  // 列表
  list: (params?: any) => Promise<any>;
  // 详情
  detail: (params: { md5: string }) => Promise<any>;
  // 新增
  add: (params: any) => Promise<any>;
  // 更新
  update: (params: any) => Promise<any>;
  // 单条删除
  remove: (params: { md5: string }) => Promise<any>;
  // 批量删除
  batchRemove: (params: { md5: string[] }) => Promise<any>;
  // 设为默认
  select: (params: { md5: string; select: boolean }) => Promise<any>;
  // 连接测试
  ping: (params: { md5: string }) => Promise<any>;
  // 实体名称（用于标题、提示文案），默认「机器人」
  entityName?: string;
}
