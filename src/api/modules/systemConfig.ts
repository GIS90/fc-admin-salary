import http from "@/api";
import { ResultPage } from "@/api/utils/models";
import {
    DictEnumBaseModel, DictEnumDetailModel, DictEnumListModel,
    DictKeyBaseModel, DictKeyDetailModel, DictKeyListModel,
    XtcsModelBase, XtcsModelList
} from "@/models/systemModel";
import { RequestMd5Model, RequestMd5Models, RequestStatusModel } from "@/models/X";

/* * * * * * * * * * * * * * * * * * * * * * [系统配置>参数配置] * * * * * * * * * * * * * * * * * * * * * * * * * */
// [GET]列表
export const SysConfigXtcsListApi = (params: any) => {
    return http.get<ResultPage<XtcsModelList>>('/system/config/xtcs.list', params);
};

// [PUT]启用/注销
export const SysConfigXtcsStatusApi = (params: RequestStatusModel) => {
    return http.put('/system/config/xtcs.status', params);
};

// [DELETE]单条删除
export const SysConfigXtcsDeleteApi = (params: RequestMd5Model) => {
    return http.delete('/system/config/xtcs.delete', params);
};

// [PUT]批量删除
export const SysConfigXtcsDeleteApis = (params: RequestMd5Models) => {
    return http.put('/system/config/xtcs.batch.delete', params);
};

// [GET]详情
export const SysConfigXtcsApi = (params: RequestMd5Model) => {
    return http.get('/system/config/xtcs', params);
};

// [PUT]更新
export const SysConfigXtcsUpdateApi = (params: XtcsModelBase) => {
    return http.put('/system/config/xtcs', params);
};

// [POST]新增
export const SysConfigXtcsAddApi = (params: XtcsModelBase) => {
    return http.post('/system/config/xtcs', params);
};

// [GET]详情
export const SysConfigXtcsViewApi = (params: RequestMd5Model) => {
    return http.get('/system/config/xtcs.view', params);
};

/* * * * * * * * * * * * * * * * * * * * * * [系统维护->数据字典] * * * * * * * * * * * * * * * * * * * * * * * * * */
// [GET]EK>列表
export const SysOpsDictKeyListApi = () => {
    return http.get<DictKeyListModel[]>('/system/config/dict/dk.list');
};

// [PUT]EK>锁定/解锁
export const SysOpsDictKeyStatusApi = (params: RequestStatusModel) => {
    return http.put('/system/config/dict/dk.status', params);
};

// [DELETE]EK>单条删除
export const SysOpsDictKeyDeleteApi = (params: RequestMd5Model) => {
    return http.delete('/system/config/dict/dk.delete', params);
};

// [POST]EK>新增
export const SysOpsDictKeyAddApi = (params: DictKeyBaseModel) => {
    return http.post('/system/config/dict/dk', params);
};

// [GET]EK>详情
export const SysOpsDictKeyApi = (params: RequestMd5Model) => {
    return http.get('/system/config/dict/dk', params);
};

// [PUT]EK>更新
export const SysOpsDictKeyUpdateApi = (params: DictKeyDetailModel) => {
    return http.put('/system/config/dict/dk', params);
};

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -*/

// [GET]EV>列表
export const SysOpsDictEnumListApi = (params: any) => {
    return http.get<ResultPage<DictEnumListModel>>('/system/config/dict/de.list', params);
};

// [PUT]EV>批量删除
export const SysOpsDictEnumsDeleteApi = (params: RequestMd5Models) => {
    return http.put('/system/config/dict/de.batch.delete', params);
};

// [DELETE]EV>启用/注销
export const SysOpsDictEnumStatusApi = (params: RequestStatusModel) => {
    return http.delete('/system/config/dict/de.status', params);
};

// [POST]EV>新增
export const SysOpsDictEnumAddApi = (params: DictEnumBaseModel) => {
    return http.post('/system/config/dict/de', params);
};

// [GET]EV>新增枚举
export const SysOpsDictEnumAddInitApi = () => {
    return http.get('/system/config/dict/de.addInit');
};

// [DELETE]EV>单条删除
export const SysOpsDictEnumDeleteApi = (params: RequestMd5Model) => {
    return http.delete('/system/config/dict/de.delete', params);
};

// [GET]EV>详情
export const SysOpsDictEnumApi = (params: RequestMd5Model) => {
    return http.get('/system/config/dict/de', params);
};

// [PUT]EV>更新
export const SysOpsDictEnumUpdateApi = (params: DictEnumDetailModel) => {
    return http.put('/system/config/dict/de', params);
};
