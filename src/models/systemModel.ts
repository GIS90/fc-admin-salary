import { RequestIDModels } from "@/models/X";

// - - - - - - - - - - - - - - - - - - - - - [权限管理] - - - - - - - - - - - - - - - - - - - - - -
/**
 * 用户管理>列表
 */
export interface UserModelList {
    id: number;
    rtxId: string;
    md5: string;
    name: string;
    sex: string;
    email: string;
    phone: string;
    avatar: string;
    introduction: string;
    department: string;
    createTime: string;
    createRtx: string;
    status: string;
}

/**
 * 用户管理>详情
 */
export interface UserModelDetail {
    rtxId: string;
    md5: string;
    name: string;
    sex: string;
    email: string;
    phone: string;
    avatar: string;
    introduction: string;
    department: string;
    role: [];
}

/**
 * 角色管理>列表
 */
export interface RoleModelList {
    id: number;
    engname: string;
    chnname: string;
    md5: string;
    introduction: string;
    createTime: string;
    createTtx: string;
}

/**
 * 角色管理>详情
 */
export interface RoleModelDetail {
    id: number;
    engname: string;
    chnname: string;
    md5: string;
    introduction: string;
    authority: [];
    createTime: string;
    createTtx: string;
}

/**
 * 角色管理>菜单树模型
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

export interface RoleAuthUpdateModel extends RequestIDModels {
    md5: string;
}

// - - - - - - - - - - - - - - - - - - - - - [系统配置] - - - - - - - - - - - - - - - - - - - - - -
/**
 * 系统参数>列表
 */
export interface XtcsModelList {
    id: number;
    key: string;
    md5: string;
    remark: string;
    value: string;
    status: boolean;
    orderId: number;
}

/**
 * 系统参数>详情
 */
export interface XtcsModelDetail {
    key: string;
    md5: string;
    remark: string;
    value: string;
    orderId: number;
}


/**
 * 系统参数>试图数据
 */
export interface XtcsModelView {
    key: string;
    md5: string;
    remark: string;
    value: string;
    createTime: string;
    createTtx: string;
    updateTime: string;
    updateRtx: string;
    orderId: number;
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
 * 角色>角色模型.列表
 */
export interface LogModelList {
    id: number;
    md5: string;
    rtx_id: string;
    ip: string;
    blueprint: string;
    apiname: string;
    endpoint: string;
    method: string;
    path: string;
    url: string;
    params: string;
    host_url: string;
    cost: number;
    create_time: string;
    create_date: string;
}

/**
 * 角色>角色模型.列表
 */
export interface TaskModelList {
    id: number;
    md5: string;
    api: string;
    name: string;
    type: string;
    data: string;
    status: string;
    cost: number;
    create_time: string;
    create_rtx: string;
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
