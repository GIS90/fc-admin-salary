/**
 * 工资 > 消息通知 > 钉钉通知
 */

// Sheet 名称选项
export interface DtalkSheetName {
    key: string;
    value: string;
}

// 按 Sheet 索引分组的人员名单
export type SheetUserMap = Record<string, string[]>;

// 按 Sheet 分组的重发人员项
export interface SheetUserGroup {
    sheet: string;
    sheetName?: string;
    users: string[];
}

// 列表数据
export interface DtalkListModel {
    id: number;
    md5: string;
    fileName: string;
    setSheetName: string;
    sheetNames: DtalkSheetName[];
    nsheet: number;
    count: number;
    number: number;
    setTitle: string;
    success: string;
    failure: string;
    successUsers: SheetUserMap;
    failureUsers: SheetUserMap;
    createRtx: string;
    createTime: string;
    url: string;
}

// 设置详情
export interface DtalkDetailModel {
    md5: string;
    fileName: string;
    sheetNames: DtalkSheetName[];
    setSheetIndex: string[];
    curSheet: string;
    setTitle: string;
    setColumns: DtalkSheetName[];
    setSelectColumn: string[];
    nsheet: number;
    url: string;
}

// 机器人配置
export interface DtalkRobotModel {
    id: number;
    md5: string;
    name: string;
    key: string;
    secret: string;
    select: boolean;
    description: string;
    createTime: string;
}

// 发送初始化
export interface DtalkSendInitModel {
    sheetIndex: string[];
    sheetNames: DtalkSheetName[];
    robotIndex: string;
    robotEnums: { key: string; value: string }[];
}

// 重发初始化
export interface DtalkResendInitModel {
    sheetIndex: string[];
    sheetNames: DtalkSheetName[];
    failureUsers: SheetUserMap;
    failureGroups: SheetUserGroup[];
    robotIndex: string;
    robotEnums: { key: string; value: string }[];
}

/**
 * 工资 > 消息通知 > 企业微信通知
 */

// Sheet 名称选项
export interface QywxSheetName {
    key: string;
    value: string;
}

// 列表数据
export interface QywxListModel {
    id: number;
    md5: string;
    fileName: string;
    setSheetName: string;
    sheetNames: QywxSheetName[];
    nsheet: number;
    count: number;
    number: number;
    setTitle: string;
    success: string;
    failure: string;
    successUsers: SheetUserMap;
    failureUsers: SheetUserMap;
    createRtx: string;
    createTime: string;
    url: string;
}

// 设置详情
export interface QywxDetailModel {
    md5: string;
    fileName: string;
    sheetNames: QywxSheetName[];
    setSheetIndex: string[];
    curSheet: string;
    setTitle: string;
    setColumns: QywxSheetName[];
    setSelectColumn: string[];
    nsheet: number;
    url: string;
}

// 机器人配置
export interface QywxRobotModel {
    id: number;
    md5: string;
    name: string;
    key: string;
    secret: string;
    agentId: string;
    select: boolean;
    description: string;
    createTime: string;
}

// 发送初始化
export interface QywxSendInitModel {
    sheetIndex: string[];
    sheetNames: QywxSheetName[];
    robotIndex: string;
    robotEnums: { key: string; value: string }[];
}

// 重发初始化
export interface QywxResendInitModel {
    sheetIndex: string[];
    sheetNames: QywxSheetName[];
    failureUsers: SheetUserMap;
    failureGroups: SheetUserGroup[];
    robotIndex: string;
    robotEnums: { key: string; value: string }[];
}

/**
 * 工资 > 消息通知 > 邮件通知
 */
export interface EmailSheetName {
    key: string;
    value: string;
}

export interface EmailListModel {
    id: number;
    md5: string;
    fileName: string;
    setSheetName: string;
    sheetNames: EmailSheetName[];
    nsheet: number;
    count: number;
    number: number;
    setTitle: string;
    success: string;
    failure: string;
    successUsers: SheetUserMap;
    failureUsers: SheetUserMap;
    createRtx: string;
    createTime: string;
    url: string;
}

export interface EmailDetailModel {
    md5: string;
    fileName: string;
    sheetNames: EmailSheetName[];
    setSheetIndex: string[];
    curSheet: string;
    setTitle: string;
    setColumns: EmailSheetName[];
    setSelectColumn: string[];
    nsheet: number;
    url: string;
}

export interface EmailRobotModel {
    id: number;
    md5: string;
    name: string;
    key: string;
    secret: string;
    agentId: string;
    select: boolean;
    description: string;
    createTime: string;
}

export interface EmailSendInitModel {
    sheetIndex: string[];
    sheetNames: EmailSheetName[];
    robotIndex: string;
    robotEnums: { key: string; value: string }[];
}

export interface EmailResendInitModel {
    sheetIndex: string[];
    sheetNames: EmailSheetName[];
    failureUsers: SheetUserMap;
    failureGroups: SheetUserGroup[];
    robotIndex: string;
    robotEnums: { key: string; value: string }[];
}
