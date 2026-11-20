// 渠道字段展示配置
// 说明：钉钉与企业微信的机器人表字段一致（name / key / secret / agent_id），
// 差异仅在页面展示名称，因此统一用同一套字段，通过 schema 覆盖标签与必填规则。
export interface RobotFieldSchema {
  // key 字段展示名称，默认「AppKey」
  keyLabel?: string;
  // secret 字段展示名称，默认「AppSecret」
  secretLabel?: string;
  // agent_id 字段展示名称，默认「AgentId」
  agentLabel?: string;
  // agent_id 是否必填，默认 false
  agentRequired?: boolean;
  // 字段长度配置
  length?: any;
  // 字段占位提示配置
  placeholder?: any;
}

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
  // 渠道字段展示配置
  schema?: RobotFieldSchema;
  // 官网手册对应的系统参数 key，支持多个并按顺序取第一个有效值
  docKey?: string | string[];
  // 官网手册链接文案，默认「官网手册」
  docLabel?: string;
}
