import { RequestIDModels } from "@/models/X";

// - - - - - - - - - - - - - - - - - - - - - [权限管理] - - - - - - - - - - - - - - - - - - - - - -
/**
 * 用户管理>基础模型
 */
export interface __UserModelBase {
    rtxId: string;
    md5: string;
    name: string;
    sex: string;
    email: string;
    phone: string;
    avatar: string;
    introduction: string;
    department: string;
}

/**
 * 用户管理>列表
 */
export interface UserModelList extends __UserModelBase{
    id: number;
    createTime: string;
    createRtx: string;
    status: boolean;
}

/**
 * 用户管理>编辑
 */
export interface UserModelDetail extends __UserModelBase{
    role: [];
}

/**
 * 角色管理>基础模型
 */
export interface __RoleModelBase {
    engname: string;
    chnname: string;
    md5: string;
    introduction: string;
    createTime: string;
    createTtx: string;
}

/**
 * 角色管理>列表
 */
export interface RoleModelList extends __RoleModelBase {
    id: number;
}

/**
 * 角色管理>编辑
 */
export interface RoleModelDetail extends __RoleModelBase {
    authority: [];
}

/**
 * 角色管理>菜单树
 */
export interface RoleAuthTreeModel {
    id: number;
    pid: number;
    disabled: boolean;
    label: string;
    name: string;
    md5: string;
    path: string;
    children: [];
}

/**
 * 角色管理>菜单权限更新
 */
export interface RoleAuthUpdateModel extends RequestIDModels {
    md5: string;
}

// - - - - - - - - - - - - - - - - - - - - - [系统配置] - - - - - - - - - - - - - - - - - - - - - -
/**
 * 系统参数>基础模型
 */
export interface XtcsModelBase {
    key: string;
    remark: string;
    value: string;
    orderId?: number;
}

/**
 * 系统参数>编辑
 */
export interface XtcsModelDetail extends XtcsModelBase {
    md5: string;
}

/**
 * 系统参数>列表
 */
export interface XtcsModelList extends XtcsModelBase {
    id: number;
    md5: string;
    lock: boolean;
}

/**
 * 系统参数>查看
 */
export interface XtcsModelView extends XtcsModelBase {
    md5: string;
    createTime: string;
    createRtx: string;
    updateTime: string;
    updateRtx: string;
}



// - - - - - - - - - - - - - - - - - - - - - [系统维护] - - - - - - - - - - - - - - - - - - - - - -
/**
 * 任务中心>基础模型
 */
export interface __TaskModelBase {
    rtxId: string;
    api: string;
    name: string;
    data: string;
    task: string;
    cost: number;
    createTime: string;
}

/**
 * 任务中心>列表
 */
export interface TaskModelList extends __TaskModelBase{
    id: number;
    md5: string;
    dataText: string;
    taskText: string;
}

/**
 * 任务中心>查看
 */
export interface TaskModelDetail extends __TaskModelBase{
    md5: string;
}


/**
 * 系统日志>基础模型
 */
export interface __LogModelBase {
    rtxId: string;
    ip: string;
    blueprint: string;
    apiName: string;
    endPoint: string;
    method: string;
    path: string;
    url: string;
    params: string;
    hostUrl: string;
    cost: number;
    createTime: string;
    createDate: string;
}

/**
 * 系统日志>列表
 */
export interface LogModelList extends __LogModelBase{
    id: number;
    md5: string;
    tag: string;
}

/**
 * 系统日志>查看
 */
export interface LogModelDetail extends __LogModelBase{
    md5: string;
}














/**
 * 字典>分类模型.基础
 */
export interface DictKeyBaseModel {
    key: string;
    remark: string;
    order_id: number;
}

/**
 * 字典>分类模型.详情
 */
export interface DictKeyDetailModel extends DictKeyBaseModel {
    md5: string;
}

/**
 * 字典>分类模型.列表
 */
export interface DictKeyListModel extends DictKeyBaseModel {
    id: number;
    md5: string;
    status: boolean;
}

/**
 * 字典>枚举模型.基础
 */
export interface DictEnumBaseModel {
    name: string;
    key: string;
    value: string;
    description: string;
    order_id: number;
}

/**
 * 字典>枚举模型.详情
 */
export interface DictEnumDetailModel extends DictEnumBaseModel {
    md5: string;
}

/**
 * 字典>枚举模型.列表
 */
export interface DictEnumListModel extends DictEnumBaseModel{
    id: number;
    md5: string;
    status: boolean;
}



/**
 * 系统>系统维护>部门架构>部门树
 */
export interface DepartmentNode {
    id: number;
    label: string;
    md5: string;
    description: string;
    pid: number;
    leaf: boolean;
    disabled: boolean;
    dept_path: boolean;
    manage_rtx: string[];
    create_rtx: string;
    create_time: string;
    update_rtx: string;
    update_time: string;
    order_id: number;
    children: DepartmentNode[];
}

export interface DepartmentDragNode {
    md5: string;
    pid: number;
}
