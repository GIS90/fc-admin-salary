import http from "@/api";
import { ResultPage } from "../utils/models";
import {
    UserModelList, UserModelDetail,
    RoleModelList, RoleModelDetail, RoleAuthUpdateModel,
    XtcsModelList, XtcsModelBase,
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

// [PUT]用户管理>启用/注销
export const SysMainUserStatusApi = (params: RequestStatusModel) => {
    return http.put('/system/main/user.status', params);
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















