import http from "@/api";
import {ResultPage} from "@/api/utils/models";
import {
    DepartmentDragNode,
    DepartmentNode,
    TaskModelList,
    LogModelList,
    AvatarModelList,
    AvatarModelDetail,
    RedisRuleModelList,
    RedisRuleForm,
    RedisConfigModelList,
    RedisConfigForm
} from "@/models/systemModel";
import {RequestMd5Model, RequestMd5Models, OptionEnumModelList} from "@/models/X";

/* * * * * * * * * * * * * * * * * * * * * * [系统维护>任务中心] * * * * * * * * * * * * * * * * * * * * * * * * * */
// [POST]列表
export const SysOpsTaskListApi = (params: any) => {
    return http.post<ResultPage<TaskModelList>>('/system/ops/task.list', params);
};

// [GET]过滤条件
export const SysOpsTaskFilterApi = () => {
    return http.get('/system/ops/task.filter');
};

// [DELETE]单条删除
export const SysOpsTaskDeleteApi = (params: RequestMd5Model) => {
    return http.delete('/system/ops/task.delete', params);
};

// [PUT]批量删除
export const SysOpsTasksDeleteApi = (params: RequestMd5Models) => {
    return http.put('/system/ops/task.batch.delete', params);
};

// [GET]详情
export const SysOpsTaskApi = (params: RequestMd5Model) => {
    return http.get('/system/ops/task', params);
};

/* * * * * * * * * * * * * * * * * * * * * * [系统维护>系统日志] * * * * * * * * * * * * * * * * * * * * * * * * * */
// [POST]列表
export const SysOpsLogListApi = (params: any) => {
    return http.post<ResultPage<LogModelList>>('/system/ops/log.list', params);
};

// [DELETE]单条删除
export const SysOpsLogDeleteApi = (params: RequestMd5Model) => {
    return http.delete('/system/ops/log.delete', params);
};

// [PUT]批量删除
export const SysOpsLogsDeleteApi = (params: RequestMd5Models) => {
    return http.put('/system/ops/log.batch.delete', params);
};

// [GET]详情
export const SysOpsLogApi = (params: RequestMd5Model) => {
    return http.get('/system/ops/log', params);
};

// [GET]过滤条件
export const SysOpsLogFilterApi = () => {
    return http.get('/system/ops/log.filter');
};

/* * * * * * * * * * * * * * * * * * * * * * [系统维护>部门架构] * * * * * * * * * * * * * * * * * * * * * * * * * */
// [GET]树结构
export const SysOpsDepartTreeApi = () => {
    return http.get('/system/ops/depart.tree');
};

// [GET]新增枚举
export const SysOpsDepartAddInitApi = (params: RequestMd5Model) => {
    return http.get('/system/ops/depart.addEnum', params);
};

// [POST]新增
export const SysOpsDepartAddApi = (params: DepartmentNode) => {
    return http.post('/system/ops/depart', params);
};

// [GET]详情
export const SysOpsDepartApi = (params: RequestMd5Model) => {
    return http.get('/system/ops/depart', params);
};

// [PUT]更新
export const SysOpsDepartUpdateApi = (params: DepartmentNode) => {
    return http.put('/system/ops/depart', params);
};

// [DELETE]单条删除
export const SysOpsDepartDeleteApi = (params: RequestMd5Model) => {
    return http.delete('/system/ops/depart.delete', params);
};

// [PUT]批量删除
export const SysOpsDepartsDeleteApi = (params: RequestMd5Models) => {
    return http.put('/system/ops/depart.batch.delete', params);
};

// [PUT]拖拽
export const SysOpsDepartDragApi = (params: DepartmentDragNode) => {
    return http.put('/system/ops/depart.drag', params);
};

/* * * * * * * * * * * * * * * * * * * * * * [系统维护>头像管理] * * * * * * * * * * * * * * * * * * * * * * * * * */
// [GET]列表
export const SysOpsAvatarListApi = (params: any) => {
    return http.get<ResultPage<AvatarModelList>>('/system/ops/avatar.list', params);
};

// [GET]详情
export const SysOpsAvatarApi = (params: RequestMd5Model) => {
    return http.get('/system/ops/avatar', params);
};

// [POST]新增
export const SysOpsAvatarAddApi = (params: AvatarModelDetail) => {
    return http.post('/system/ops/avatar', params);
};

// [PUT]更新
export const SysOpsAvatarUpdateApi = (params: AvatarModelDetail) => {
    return http.put('/system/ops/avatar', params);
};

// [PUT]锁定（启用/停用）
export const SysOpsAvatarLockApi = (params: any) => {
    return http.put('/system/ops/avatar.lock', params);
};

// [DELETE]单条删除
export const SysOpsAvatarDeleteApi = (params: RequestMd5Model) => {
    return http.delete('/system/ops/avatar.soft', params);
};

// [PUT]批量删除
export const SysOpsAvatarsDeleteApi = (params: RequestMd5Models) => {
    return http.put('/system/ops/avatar.batch.soft', params);
};

/* * * * * * * * * * * * * * * * * * * * * * [系统维护>Redis缓存管理] * * * * * * * * * * * * * * * * * * * * * */
// [GET]Redis连接配置列表
export const SysOpsRedisConfigListApi = (params?: any) => {
    return http.get<{ list: RedisConfigModelList[]; total: number }>('/system/ops/redis.config.list', params);
};

// [GET]Redis连接配置下拉选项
export const SysOpsRedisConfigOptionsApi = () => {
    return http.get<OptionEnumModelList>('/system/ops/redis.config.options');
};

// [GET]Redis连接配置详情
export const SysOpsRedisConfigApi = (params: RequestMd5Model) => {
    return http.get<RedisConfigModelList>('/system/ops/redis.config', params);
};

// [POST]新增Redis连接配置
export const SysOpsRedisConfigAddApi = (params: RedisConfigForm) => {
    return http.post('/system/ops/redis.config', params);
};

// [PUT]更新Redis连接配置
export const SysOpsRedisConfigUpdateApi = (params: RedisConfigForm) => {
    return http.put('/system/ops/redis.config', params);
};

// [DELETE]删除Redis连接配置
export const SysOpsRedisConfigDeleteApi = (params: RequestMd5Model) => {
    return http.delete('/system/ops/redis.config.delete', params);
};

// [POST]测试Redis连接
export const SysOpsRedisConfigTestApi = (params: RedisConfigForm) => {
    return http.post<{ dbsize: number; host: string; port: number; db: number }>('/system/ops/redis.config.test', params);
};

// [GET]Redis PING连通性检测（不传md5时检测全部启用配置）
export const SysOpsRedisPingApi = (params?: { md5?: string }) => {
    return http.get<{
        list: { md5: string; name: string; host: string; port: number; db: number; ok: boolean; dbsize: number; message: string }[];
        total: number;
        success: number;
        failed: number;
    }>('/system/ops/redis.ping', params);
};

// [GET]规则过滤条件
export const SysOpsRedisRuleFilterApi = () => {
    return http.get<{
        config: OptionEnumModelList;
        match: OptionEnumModelList;
    }>('/system/ops/redis.rule.filter');
};

// [POST]规则列表
export const SysOpsRedisRuleListApi = (params: any) => {
    return http.post<ResultPage<RedisRuleModelList>>('/system/ops/redis.rule.list', params);
};

// [GET]规则详情
export const SysOpsRedisRuleApi = (params: RequestMd5Model) => {
    return http.get<RedisRuleModelList>('/system/ops/redis.rule', params);
};

// [POST]新增清理规则
export const SysOpsRedisRuleAddApi = (params: RedisRuleForm) => {
    return http.post('/system/ops/redis.rule', params);
};

// [PUT]更新清理规则
export const SysOpsRedisRuleUpdateApi = (params: RedisRuleForm) => {
    return http.put('/system/ops/redis.rule', params);
};

// [PUT]启用/停用规则
export const SysOpsRedisRuleLockApi = (params: any) => {
    return http.put('/system/ops/redis.rule.lock', params);
};

// [DELETE]删除规则
export const SysOpsRedisRuleDeleteApi = (params: RequestMd5Model) => {
    return http.delete('/system/ops/redis.rule.delete', params);
};

// [PUT]批量删除规则
export const SysOpsRedisRulesDeleteApi = (params: RequestMd5Models) => {
    return http.put('/system/ops/redis.rule.batch.delete', params);
};

// [POST]预览规则匹配的缓存键（规则由后台读取）
export const SysOpsRedisRulePreviewApi = (params: RequestMd5Model) => {
    return http.post<{ rule: string; config: string; count: number; match: string; sample: string[]; maxKeys: number }>('/system/ops/redis.rule.preview', params);
};

// [POST]按后台规则执行清理（规则由后台读取）
export const SysOpsRedisRuleCleanApi = (params: RequestMd5Model) => {
    return http.post<{ rule: string; config: string; count: number; sample: string[] }>('/system/ops/redis.rule.clean', params);
};
