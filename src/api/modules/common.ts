import http from "@/api";
import { RequestDownloadModel, RequestKeysModel, RequestKeyModel } from "@/models/X";

/* * * * * * * * * * * * * * * * * * * * * * [系统] * * * * * * * * * * * * * * * * * * * * * * * * * */
// [GET]基础信息
export const SystemInfoApi = (params: any) => {
    return http.get('/api/open/system.info', params);
};
/* * * * * * * * * * * * * * * * * * * * * * [文件下载] * * * * * * * * * * * * * * * * * * * * * * * * * */
// [GET]文件下载.参数枚举
export const DownloadEnumApi = () => {
    return http.get('/api/download.enum');
};

// [POST]文件下载
export const DownloadTableApi = (params: RequestDownloadModel) => {
    return http.post('/api/download', params);
};
/* * * * * * * * * * * * * * * * * * * * * * [文件上传] * * * * * * * * * * * * * * * * * * * * * * * * * */
// [POST]多文件上传
export const UploadFilesApi = (data: any) => {
    return http.post('/api/uploads', data);
};

// [POST]单文件上传
export const UploadFileApi = (data: any) => {
    return http.post('/api/upload', data);
};
/* * * * * * * * * * * * * * * * * * * * * * [报表Column] * * * * * * * * * * * * * * * * * * * * * * * * * */
// [GET]报表Column
export const TableFieldColumnApi = (params: { xtbb: string }) => {
    return http.get('/system/config/report.field.column', params);
};
/* * * * * * * * * * * * * * * * * * * * * * [枚举值] * * * * * * * * * * * * * * * * * * * * * * * * * */
// [GET]EV>通过Key获取枚举值(option格式)
export const DictEnumOptionApi = (params: { name: string }) => {
    return http.get('/system/config/dict/de.option', params);
};

// [GET]EV>通过Key列表获取枚举值
// names 为数组，需序列化为 names=a&names=b（后端 FastAPI 为 List[str]），不能带 []
export const DictEnumOptionsApi = (params: any) => {
    return http.get('/system/config/dict/de.options', params, { paramsSerializer: { indexes: null } });
};
/* * * * * * * * * * * * * * * * * * * * * * [系统配置] * * * * * * * * * * * * * * * * * * * * * * * * * */
// [GET]单条系统参数
export const SysConfigXtcsKeyApi = (params: RequestKeyModel) => {
    return http.get('/system/config/xtcs.key', params);
};

// [GET]多条系统参数
export const SysConfigXtcsKeysApi = (params: RequestKeysModel) => {
    return http.get('/system/config/xtcs.keys', params, { paramsSerializer: { indexes: null } });
};


