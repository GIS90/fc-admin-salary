import http from "@/api";
import { ResultPage } from "../utils/models";
import {
    Pdf2WordModelList, Pdf2WordModelDetail
} from "@/models/toolModel";
import { RequestMd5Model, RequestMd5Models } from "@/models/X";


/* * * * * * * * * * * * * * * * * * * * * * [文档工具>PDF2WORD] * * * * * * * * * * * * * * * * * * * * * * * * * */
// [GET]列表
export const ToolOfficeP2WListApi = (params: any) => {
    return http.get<ResultPage<Pdf2WordModelList>>('/tool/office/pdf2word.list', params);
};

// [POST]新增
export const ToolOfficeP2WAddApi = (params: Pdf2WordModelDetail) => {
    return http.post('/tool/office/pdf2word', params);
};

// [GET]详情
export const ToolOfficeP2WApi = (params: RequestMd5Model) => {
    return http.get('/tool/office/pdf2word', params);
};

// [PUT]更新
export const ToolOfficeP2WUpdateApi = (params: Pdf2WordModelDetail) => {
    return http.put('/tool/office/pdf2word', params);
};

// [DELETE]单条删除
export const ToolOfficeP2WDeleteApi = (params: RequestMd5Model) => {
    return http.delete('/tool/office/pdf2word.soft', params);
};

// [PUT]批量删除
export const ToolOfficeP2WsDeleteApi = (params: RequestMd5Models) => {
    return http.put('/tool/office/pdf2word.batch.soft', params);
};


