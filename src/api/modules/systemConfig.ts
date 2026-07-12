import http from "@/api";
import {ResultPage} from "@/api/utils/models";
import {DictEnumBaseModel, DictEnumDetailModel, DictEnumListModel, DictKeyBaseModel, DictKeyDetailModel, DictKeyListModel, XtcsModelBase, XtcsModelList} from "@/models/systemModel";
import {RequestMd5Model, RequestMd5Models, RequestStatusModel} from "@/models/X";

/* * * * * * * * * * * * * * * * * * * * * * [参数配置] * * * * * * * * * * * * * * * * * * * * * * * * * */
// [GET]列表
export const SysConfigXtcsListApi = (params: any) => {
    return http.get<ResultPage<XtcsModelList>>('/system/config/xtcs.list', params);
};

// [DELETE]单条删除
export const SysConfigXtcsDeleteApi = (params: RequestMd5Model) => {
    return http.delete('/system/config/xtcs.delete', params);
};

// [PUT]启用/注销
export const SysConfigXtcsStatusApi = (params: RequestStatusModel) => {
    return http.put('/system/config/xtcs.status', params);
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
// [GET]数据字典>字典分类列表
export const SysOpsDictKeyListApi = () => {
    return http.get<DictKeyListModel[]>('/ops/dict/key/list');
};

// [DELETE]数据字典>单条删除
export const SysOpsDictKeyDeleteApi = (params: RequestMd5Model) => {
    return http.delete('/ops/dict/key/delete', params);
};

// [DELETE]数据字典>锁定/解锁
export const SysOpsDictKeyStatusApi = (params: RequestStatusModel) => {
    return http.delete('/ops/dict/key/status', params);
};

// [POST]数据字典>新增
export const SysOpsDictKeyAddApi = (params: DictKeyBaseModel) => {
    return http.post('/ops/dict/key', params);
};

// [GET]数据字典>详情
export const SysOpsDictKeyApi = (params: RequestMd5Model) => {
    return http.get('/ops/dict/key', params);
};

// [PUT]数据字典>更新
export const SysOpsDictKeyUpdateApi = (params: DictKeyDetailModel) => {
    return http.put('/ops/dict/key', params);
};

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -*/

// [GET]数据字典>字典枚举列表
export const SysOpsDictEnumListApi = (params: any) => {
    return http.get<ResultPage<DictEnumListModel>>('/ops/dict/enum/list', params);
};

// [DELETE]数据字典>单条删除
export const SysOpsDictEnumDeleteApi = (params: RequestMd5Model) => {
    return http.delete('/ops/dict/enum/delete', params);
};

// [PUT]数据字典>批量删除
export const SysOpsDictEnumsDeleteApi = (params: RequestMd5Models) => {
    return http.put('/ops/dict/enum/delete', params);
};

// [DELETE]数据字典>启用/注销
export const SysOpsDictEnumStatusApi = (params: RequestStatusModel) => {
    return http.delete('/ops/dict/enum/status', params);
};

// [POST]数据字典>新增
export const SysOpsDictEnumAddApi = (params: DictEnumBaseModel) => {
    return http.post('/ops/dict/enum', params);
};

// [GET]数据字典>新增枚举
export const SysOpsDictEnumAddInitApi = () => {
    return http.get('/ops/dict/enum/init');
};


// [GET]数据字典>详情
export const SysOpsDictEnumApi = (params: RequestMd5Model) => {
    return http.get('/ops/dict/enum', params);
};

// [PUT]数据字典>更新
export const SysOpsDictEnumUpdateApi = (params: DictEnumDetailModel) => {
    return http.put('/ops/dict/enum', params);
};
