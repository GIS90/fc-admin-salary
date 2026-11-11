import http from "@/api";
import {ResultPage} from "@/api/utils/models";
import {
    DepartmentDragNode,
    DepartmentNode,
    TaskModelList,
    LogModelList,
    AvatarModelList,
    AvatarModelDetail
} from "@/models/systemModel";
import {RequestMd5Model, RequestMd5Models} from "@/models/X";

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
