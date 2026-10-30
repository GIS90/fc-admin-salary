import http from "@/api";
import { RequestDownloadModel } from "@/models/X";

/* * * * * * * * * * * * * * * * * * * * * * [系统] * * * * * * * * * * * * * * * * * * * * * * * * * */
// [GET]基础信息
export const SystemInfoApi = (params: any) => {
    return http.get('/api/open/system.info', params);
};
/* * * * * * * * * * * * * * * * * * * * * * [下载] * * * * * * * * * * * * * * * * * * * * * * * * * */
// [GET]文件下载.参数枚举
export const DownloadEnumApi = () => {
    return http.get('/api/download.enum');
};

// [POST]文件下载
export const DownloadTableApi = (params: RequestDownloadModel) => {
    return http.post('/api/download', params);
};
/* * * * * * * * * * * * * * * * * * * * * * [上传] * * * * * * * * * * * * * * * * * * * * * * * * * */
// [POST]上传
export const UploadFilesApi = (data: any) => {
    return http.post('/api/uploads', data);
};
/* * * * * * * * * * * * * * * * * * * * * * [Table] * * * * * * * * * * * * * * * * * * * * * * * * * */
// [GET]报表Column
export const TableFieldColumnApi = (params: { xtbb: string }) => {
    return http.get('/system/config/report.field.column', params);
};

// [GET]EV>通过Key获取枚举值(option格式)
export const DictEnumOptionApi = (params: { name: string }) => {
    return http.get('/system/config/dict/de.option', params);
};

// [GET]EV>通过Key列表获取枚举值
// names 为数组，需序列化为 names=a&names=b（后端 FastAPI 为 List[str]），不能带 []
export const DictEnumOptionsApi = (params: any) => {
    return http.get('/system/config/dict/de.options', params, { paramsSerializer: { indexes: null } });
};
