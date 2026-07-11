import http from "@/api";
import { ResultPage } from "../utils/models";
import {
    UserModelList, UserModelDetail,
    RoleModelList, RoleModelDetail, RoleAuthUpdateModel,
    XtcsModelList, XtcsModelDetail, XtcsModelView,
    DictKeyListModel, DictEnumListModel,
    DictEnumBaseModel, DictEnumDetailModel,
    DictKeyDetailModel, DictKeyBaseModel, LogModelList,
    DepartmentNode, DepartmentDragNode
} from "@/models/systemModel";
import {RequestStatusModel, RequestMd5Model, RequestMd5Models} from "@/models/X";


/* * * * * * * * * * * * * * * * * * * * * * [权限管理->用户管理] * * * * * * * * * * * * * * * * * * * * * * * * * */
// [GET]用户管理>列表
export const SysMainUserListApi = (params: any) => {
    return http.get<ResultPage<UserModelList>>('/system/main/user.list', params);
};

// [DELETE]用户管理>启用/注销
export const SysMainUserStatusApi = (params: RequestStatusModel) => {
    return http.delete('/system/main/user.status', params);
};

// [PUT]用户管理>批量注销
export const SysMainUsersStatusApi = (params: RequestMd5Models) => {
    return http.put('/system/main/user.batch.soft', params);
};

// [PUT]用户管理>批量删除
export const SysMainUsersDeleteApi = (params: RequestMd5Models) => {
    return http.put('/system/main/user.batch.hard', params);
};

// [PUT]用户管理>获取初始密码
export const SysMainUserDefaultPwdApi = () => {
    return http.get('/system/main/user.defaultPwd');
};

// [PUT]用户管理>重置密码
export const SysMainUserResetPwdApi = (params: RequestMd5Model) => {
    return http.put('/system/main/user.resetPwd', params);
};

// [GET]用户管理>详情
export const SysMainUserApi = (params: RequestMd5Model) => {
    return http.get('/system/main/user', params);
};

// [PUT]用户管理>更新
export const SysMainUserUpdateApi = (params: UserModelDetail) => {
    return http.put('/system/main/user', params);
};

// [GET]用户管理>新增枚举
export const SysMainUserAddEnumApi = () => {
    return http.get('/system/main/user.addEnum');
};

// [PUT]用户管理>新增
export const SysMainUserAddApi = (params: UserModelDetail) => {
    return http.post('/system/main/user', params);
};

/* * * * * * * * * * * * * * * * * * * * * * [权限管理->角色管理] * * * * * * * * * * * * * * * * * * * * * * * * * */
// [GET]角色管理>列表
export const SysMainRoleListApi = (params: any) => {
    return http.get<ResultPage<RoleModelList>>('/system/main/role.list', params);
};

// [POST]角色管理>新增
export const SysMainRoleAddApi = (params: RoleModelDetail) => {
    return http.post('/system/main/role', params);
};

// [GET]角色管理>详情
export const SysMainRoleApi = (params: RequestMd5Model) => {
    return http.get('/system/main/role', params);
};

// [PUT]角色管理>更新
export const SysMainRoleUpdateApi = (params: RoleModelDetail) => {
    return http.put('/system/main/role', params);
};

// [DELETE]角色管理>单条删除
export const SysMainRoleDeleteApi = (params: RequestMd5Model) => {
    return http.delete('/system/main/role.soft', params);
};

// [PUT]角色管理>批量删除
export const SysMainRolesDeleteApi = (params: RequestMd5Models) => {
    return http.put('/system/main/role.batch.soft', params);
};

// [GET]角色管理>权限详情
export const SysMainRoleAuthApi = (params: RequestMd5Model) => {
    return http.get('/system/main/role.auth', params);
};

// [PUT]角色管理>权限更新
export const SysMainRoleAuthUpdateApi = (params: RoleAuthUpdateModel) => {
    return http.put('/system/main/role.auth', params);
};

/* * * * * * * * * * * * * * * * * * * * * * [权限管理->菜单管理] * * * * * * * * * * * * * * * * * * * * * * * * * */
// [GET]菜单管理>列表.不分页
export const SysMainMenuListApi = (params: any) => {
    return http.get<Menu.MenuOptions[]>('/system/main/menu.list', params);
};
// [GET]菜单管理>列表.分页
// export const SysMainMenuListApi = (params: any) => {
//     return http.get<ResultPage<Menu.MenuOptions>>('/main/menu/list', params);
// };

// [DELETE]菜单管理>单条删除
export const SysMainMenuDeleteApi = (params: RequestMd5Model) => {
    return http.delete('/system/main/menu.delete', params);
};

// [DELETE]菜单管理>启用/隐藏
export const SysMainMenuStatusApi = (params: RequestStatusModel) => {
    return http.delete('/system/main/menu.status', params);
};

// [GET]菜单管理>详情
export const SysMainMenuApi = (params: RequestMd5Model) => {
    return http.get('/system/main/menu', params);
};

// [PUT]菜单管理>更新
export const SysMainMenuUpdateApi = (params: Menu.MenuFlat) => {
    return http.put('/system/main/menu', params);
};


// [POST]菜单管理>新增
export const SysMainMenuAddApi = (params: Menu.MenuBaseFlat) => {
    return http.post('/system/main/menu', params);
};

// [GET]菜单管理>新增枚举
export const SysMainMenuAddEnumApi = () => {
    return http.get('/system/main/menu.addEnum');
};


/* * * * * * * * * * * * * * * * * * * * * * [系统配置->参数配置] * * * * * * * * * * * * * * * * * * * * * * * * * */
// [GET]参数配置>列表
export const SysConfigXtcsListApi = (params: any) => {
    return http.get<ResultPage<XtcsModelList>>('/system/config/xtcs.list', params);
};

// [DELETE]参数配置>单条删除
export const SysConfigXtcsDeleteApi = (params: RequestMd5Model) => {
    return http.delete('/system/config/xtcs.delete', params);
};

// [PUT]用户管理>启用/注销
export const SysConfigXtcsStatusApi = (params: RequestStatusModel) => {
    return http.put('/system/config/xtcs.status', params);
};

// [PUT]角色管理>批量删除
export const SysConfigXtcsDeleteApis = (params: RequestMd5Models) => {
    return http.put('/system/config/xtcs.batch.delete', params);
};

// [GET]参数配置>详情
export const SysConfigXtcsApi = (params: RequestMd5Model) => {
    return http.get('/system/config/xtcs', params);
};

// [PUT]角色管理>更新
export const SysConfigXtcsUpdateApi = (params: XtcsModelDetail) => {
    return http.put('/system/config/xtcs', params);
};

// [POST]角色管理>新增
export const SysConfigXtcsAddApi = (params: XtcsModelDetail) => {
    return http.post('/system/config/xtcs', params);
};

// [GET]参数配置>详情
export const SysConfigXtcsViewApi = (params: RequestMd5Model) => {
    return http.get('/system/config/xtcs.view', params);
};

/* * * * * * * * * * * * * * * * * * * * * * [系统维护->数据字典] * * * * * * * * * * * * * * * * * * * * * * * * * */
// [GET]数据字典>字典分类列表
export const SysOpsDictKeyListApi = () => {
    return http.get<DictKeyListModel[]>('/ops/dict/key/list');
};

// [DELETE]数据字典>单条删除
export const SysOpsDictKeyDeleteApi = (params: RequestMd5Model) => {
    return http.delete('/ops/dict/key/delete', params);
};

// [DELETE]数据字典>锁定/解锁
export const SysOpsDictKeyStatusApi = (params: RequestStatusModel) => {
    return http.delete('/ops/dict/key/status', params);
};

// [POST]数据字典>新增
export const SysOpsDictKeyAddApi = (params: DictKeyBaseModel) => {
    return http.post('/ops/dict/key', params);
};

// [GET]数据字典>详情
export const SysOpsDictKeyApi = (params: RequestMd5Model) => {
    return http.get('/ops/dict/key', params);
};

// [PUT]数据字典>更新
export const SysOpsDictKeyUpdateApi = (params: DictKeyDetailModel) => {
    return http.put('/ops/dict/key', params);
};

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -*/

// [GET]数据字典>字典枚举列表
export const SysOpsDictEnumListApi = (params: any) => {
    return http.get<ResultPage<DictEnumListModel>>('/ops/dict/enum/list', params);
};

// [DELETE]数据字典>单条删除
export const SysOpsDictEnumDeleteApi = (params: RequestMd5Model) => {
    return http.delete('/ops/dict/enum/delete', params);
};

// [PUT]数据字典>批量删除
export const SysOpsDictEnumsDeleteApi = (params: RequestMd5Models) => {
    return http.put('/ops/dict/enum/delete', params);
};

// [DELETE]数据字典>启用/注销
export const SysOpsDictEnumStatusApi = (params: RequestStatusModel) => {
    return http.delete('/ops/dict/enum/status', params);
};

// [POST]数据字典>新增
export const SysOpsDictEnumAddApi = (params: DictEnumBaseModel) => {
    return http.post('/ops/dict/enum', params);
};

// [GET]数据字典>新增枚举
export const SysOpsDictEnumAddInitApi = () => {
    return http.get('/ops/dict/enum/init');
};


// [GET]数据字典>详情
export const SysOpsDictEnumApi = (params: RequestMd5Model) => {
    return http.get('/ops/dict/enum', params);
};

// [PUT]数据字典>更新
export const SysOpsDictEnumUpdateApi = (params: DictEnumDetailModel) => {
    return http.put('/ops/dict/enum', params);
};

/* * * * * * * * * * * * * * * * * * * * * * [系统维护->系统日志] * * * * * * * * * * * * * * * * * * * * * * * * * */
// [GET]系统日志>列表
export const SysOpsLogListApi = (params: any) => {
    return http.post<ResultPage<LogModelList>>('/ops/log/list', params);
};

// [DELETE]系统日志>单条删除
export const SysOpsLogDeleteApi = (params: RequestMd5Model) => {
    return http.delete('/ops/log/delete', params);
};

// [PUT]系统日志>批量删除
export const SysOpsLogsDeleteApi = (params: RequestMd5Models) => {
    return http.put('/ops/log/delete', params);
};

// [GET]系统日志>详情
export const SysOpsLogApi = (params: RequestMd5Model) => {
    return http.get('/ops/log', params);
};

// [GET]系统日志>过滤条件
export const SysOpsLogFilterApi = () => {
    return http.get('/ops/log/filter');
};

/* * * * * * * * * * * * * * * * * * * * * * [系统维护->任务中心] * * * * * * * * * * * * * * * * * * * * * * * * * */
// [POST]任务中心>列表
export const SysOpsTaskListApi = (params: any) => {
    return http.post<ResultPage<LogModelList>>('/ops/task/list', params);
};

// [DELETE]任务中心>单条删除
export const SysOpsTaskDeleteApi = (params: RequestMd5Model) => {
    return http.delete('/ops/task/delete', params);
};

// [PUT]任务中心>批量删除
export const SysOpsTasksDeleteApi = (params: RequestMd5Models) => {
    return http.put('/ops/task/delete', params);
};

// [GET]任务中心>详情
export const SysOpsTaskApi = (params: RequestMd5Model) => {
    return http.get('/ops/task', params);
};

// [GET]任务中心>过滤条件
export const SysOpsTaskFilterApi = () => {
    return http.get('/ops/task/filter');
};

/* * * * * * * * * * * * * * * * * * * * * * [系统维护->部门架构] * * * * * * * * * * * * * * * * * * * * * * * * * */
// [GET]部门架构>TREE
export const SysOpsDepartTreeApi = () => {
    return http.get('/ops/depart/tree');
};

// [GET]部门架构>新增枚举
export const SysOpsDepartAddInitApi = (params: RequestMd5Model) => {
    return http.get('/ops/depart/init', params);
};

// [POST]部门架构>新增
export const SysOpsDepartAddApi = (params: DepartmentNode) => {
    return http.post('/ops/depart', params);
};

// [GET]部门架构>详情
export const SysOpsDepartApi = (params: RequestMd5Model) => {
    return http.get('/ops/depart', params);
};

// [PUT]部门架构>更新
export const SysOpsDepartUpdateApi = (params: DepartmentNode) => {
    return http.put('/ops/depart', params);
};

// [DELETE]部门架构>单条删除
export const SysOpsDepartDeleteApi = (params: RequestMd5Model) => {
    return http.delete('/ops/depart/delete', params);
};

// [PUT]部门架构>批量删除
export const SysOpsDepartsDeleteApi = (params: RequestMd5Models) => {
    return http.put('/ops/depart/delete', params);
};

// [PUT]部门架构>拖拽
export const SysOpsDepartDragApi = (params: DepartmentDragNode) => {
    return http.put('/ops/depart/drag', params);
};
