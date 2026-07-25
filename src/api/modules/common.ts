import http from "@/api";
import { RequestDownloadModel } from "@/models/X";


/* * * * * * * * * * * * * * * * * * * * * * [下载] * * * * * * * * * * * * * * * * * * * * * * * * * */
// [GET]下载>枚举
export const DownloadEnumApi = () => {
    return http.get('/api/download.enum');
};

// [POST]下载
export const DownloadTableApi = (params: RequestDownloadModel) => {
    return http.post('/api/download', params);
};

/* * * * * * * * * * * * * * * * * * * * * * [上传] * * * * * * * * * * * * * * * * * * * * * * * * * */
// [POST]上传>文件
export const UploadFileApi = (params: RequestDownloadModel) => {
    return http.post('/api/upload', params);
};


