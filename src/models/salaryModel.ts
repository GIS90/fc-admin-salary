/**
 * 工资 > 消息通知 > 钉钉通知
 */

// Sheet 名称选项
export interface DtalkSheetName {
    key: string;
    value: string;
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
