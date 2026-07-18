import http from "@/api";
import {ResultPage} from "@/api/utils/models";
import {DepartmentDragNode, DepartmentNode, TaskModelList, LogModelList} from "@/models/systemModel";
import {RequestMd5Model, RequestMd5Models} from "@/models/X";

/* * * * * * * * * * * * * * * * * * * * * * [任务中心] * * * * * * * * * * * * * * * * * * * * * * * * * */
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

/* * * * * * * * * * * * * * * * * * * * * * [系统日志] * * * * * * * * * * * * * * * * * * * * * * * * * */
// [POST]系统日志>列表
export const SysOpsLogListApi = (params: any) => {
    return http.post<ResultPage<LogModelList>>('/system/ops/log.list', params);
};

// [DELETE]系统日志>单条删除
export const SysOpsLogDeleteApi = (params: RequestMd5Model) => {
    return http.delete('/system/ops/log.delete', params);
};

// [PUT]系统日志>批量删除
export const SysOpsLogsDeleteApi = (params: RequestMd5Models) => {
    return http.put('/system/ops/log.batch.delete', params);
};

// [GET]系统日志>详情
export const SysOpsLogApi = (params: RequestMd5Model) => {
    return http.get('/system/ops/log', params);
};

// [GET]系统日志>过滤条件
export const SysOpsLogFilterApi = () => {
    return http.get('/system/ops/log.filter');
};

/* * * * * * * * * * * * * * * * * * * * * * [系统维护->部门架构] * * * * * * * * * * * * * * * * * * * * * * * * * */
// [GET]部门架构>树结构
export const SysOpsDepartTreeApi = () => {
    return http.get('/system/ops/depart.tree');
};

// [GET]部门架构>新增枚举
export const SysOpsDepartAddInitApi = (params: RequestMd5Model) => {
    return http.get('/system/ops/depart.addEnum', params);
};

// [POST]部门架构>新增
export const SysOpsDepartAddApi = (params: DepartmentNode) => {
    return http.post('/system/ops/depart', params);
};

// [GET]部门架构>详情
export const SysOpsDepartApi = (params: RequestMd5Model) => {
    return http.get('/system/ops/depart', params);
};

// [PUT]部门架构>更新
export const SysOpsDepartUpdateApi = (params: DepartmentNode) => {
    return http.put('/system/ops/depart', params);
};

// [DELETE]部门架构>单条删除
export const SysOpsDepartDeleteApi = (params: RequestMd5Model) => {
    return http.delete('/system/ops/depart.delete', params);
};

// [PUT]部门架构>批量删除
export const SysOpsDepartsDeleteApi = (params: RequestMd5Models) => {
    return http.put('/system/ops/depart.batch.delete', params);
};

// [PUT]部门架构>拖拽
export const SysOpsDepartDragApi = (params: DepartmentDragNode) => {
    return http.put('/system/ops/depart.drag', params);
};
