import http from "@/api";
import { ResultPage } from "@/api/utils/models";
import { RequestMd5Model, RequestMd5Models } from "@/models/X";
import { DtalkListModel, DtalkDetailModel, DtalkRobotModel, DtalkSendInitModel, DtalkResendInitModel } from "@/models/salaryModel";
import { QywxListModel, QywxDetailModel, QywxRobotModel, QywxSendInitModel, QywxResendInitModel } from "@/models/salaryModel";


/* * * * * * * * * * * * * * * * * * * * * * [工资 > 消息通知 > 钉钉通知] * * * * * * * * * * * * * * * * * * * * * * * * * */
// [GET]列表
export const SalaryNotifyDtalkListApi = (params: any) => {
    return http.get<ResultPage<DtalkListModel>>('/salary/notify/dtalk.list', params);
};

// [GET]详情
export const SalaryNotifyDtalkApi = (params: RequestMd5Model) => {
    return http.get<DtalkDetailModel>('/salary/notify/dtalk', params);
};

// [PUT]更新设置
export const SalaryNotifyDtalkUpdateApi = (params: any) => {
    return http.put('/salary/notify/dtalk', params);
};

// [GET]切换Sheet
export const SalaryNotifyDtalkChangeSheetApi = (params: { md5: string; sheet: string }) => {
    return http.get('/salary/notify/dtalk.changeSheet', params);
};

// [DELETE]单条删除
export const SalaryNotifyDtalkDeleteApi = (params: RequestMd5Model) => {
    return http.delete('/salary/notify/dtalk.soft', params);
};

// [PUT]批量删除
export const SalaryNotifyDtalkBatchDeleteApi = (params: RequestMd5Models) => {
    return http.put('/salary/notify/dtalk.batch.soft', params);
};

// [GET]模板下载
export const SalaryNotifyDtalkTemplateApi = () => {
    return http.get('/salary/notify/dtalk.template');
};

// [GET]发送初始化
export const SalaryNotifyDtalkSendInitApi = (params: RequestMd5Model) => {
    return http.get<DtalkSendInitModel>('/salary/notify/dtalk.sendInit', params);
};

// [POST]发送
export const SalaryNotifyDtalkSendApi = (params: any) => {
    return http.post('/salary/notify/dtalk.send', params);
};

// [GET]重发初始化
export const SalaryNotifyDtalkResendInitApi = (params: RequestMd5Model) => {
    return http.get<DtalkResendInitModel>('/salary/notify/dtalk.resendInit', params);
};

// [POST]重发失败人员
export const SalaryNotifyDtalkResendApi = (params: any) => {
    return http.post('/salary/notify/dtalk.resend', params);
};

// [GET]机器人列表
export const SalaryNotifyDtalkRobotListApi = () => {
    return http.get('/salary/notify/dtalk/robot.list');
};

// [POST]新增机器人
export const SalaryNotifyDtalkRobotAddApi = (params: any) => {
    return http.post('/salary/notify/dtalk/robot', params);
};

// [GET]机器人详情
export const SalaryNotifyDtalkRobotApi = (params: RequestMd5Model) => {
    return http.get<DtalkRobotModel>('/salary/notify/dtalk/robot', params);
};

// [PUT]更新机器人
export const SalaryNotifyDtalkRobotUpdateApi = (params: any) => {
    return http.put('/salary/notify/dtalk/robot', params);
};

// [DELETE]删除机器人
export const SalaryNotifyDtalkRobotDeleteApi = (params: RequestMd5Model) => {
    return http.delete('/salary/notify/dtalk/robot.soft', params);
};

// [PUT]批量删除机器人
export const SalaryNotifyDtalkRobotBatchDeleteApi = (params: RequestMd5Models) => {
    return http.put('/salary/notify/dtalk/robot.batch.soft', params);
};

// [PUT]设置默认机器人
export const SalaryNotifyDtalkRobotSelectApi = (params: { md5: string; select: boolean }) => {
    return http.put('/salary/notify/dtalk/robot.select', params);
};

// [GET]机器人Ping
export const SalaryNotifyDtalkRobotPingApi = (params: RequestMd5Model) => {
    return http.get('/salary/notify/dtalk/robot.ping', params);
};


/* * * * * * * * * * * * * * * * * * * * * * [工资 > 消息通知 > 企业微信通知] * * * * * * * * * * * * * * * * * * * * * * * * * */
// [GET]列表
export const SalaryNotifyQywxListApi = (params: any) => {
    return http.get<ResultPage<QywxListModel>>('/salary/notify/qywx.list', params);
};

// [GET]详情
export const SalaryNotifyQywxApi = (params: RequestMd5Model) => {
    return http.get<QywxDetailModel>('/salary/notify/qywx', params);
};

// [PUT]更新设置
export const SalaryNotifyQywxUpdateApi = (params: any) => {
    return http.put('/salary/notify/qywx', params);
};

// [GET]切换Sheet
export const SalaryNotifyQywxChangeSheetApi = (params: { md5: string; sheet: string }) => {
    return http.get('/salary/notify/qywx.changeSheet', params);
};

// [DELETE]单条删除
export const SalaryNotifyQywxDeleteApi = (params: RequestMd5Model) => {
    return http.delete('/salary/notify/qywx.soft', params);
};

// [PUT]批量删除
export const SalaryNotifyQywxBatchDeleteApi = (params: RequestMd5Models) => {
    return http.put('/salary/notify/qywx.batch.soft', params);
};

// [GET]发送初始化
export const SalaryNotifyQywxSendInitApi = (params: RequestMd5Model) => {
    return http.get<QywxSendInitModel>('/salary/notify/qywx.sendInit', params);
};

// [POST]发送
export const SalaryNotifyQywxSendApi = (params: any) => {
    return http.post('/salary/notify/qywx.send', params);
};

// [GET]重发初始化
export const SalaryNotifyQywxResendInitApi = (params: RequestMd5Model) => {
    return http.get<QywxResendInitModel>('/salary/notify/qywx.resendInit', params);
};

// [POST]重发失败人员
export const SalaryNotifyQywxResendApi = (params: any) => {
    return http.post('/salary/notify/qywx.resend', params);
};

// [GET]机器人列表
export const SalaryNotifyQywxRobotListApi = () => {
    return http.get('/salary/notify/qywx/robot.list');
};

// [POST]新增机器人
export const SalaryNotifyQywxRobotAddApi = (params: any) => {
    return http.post('/salary/notify/qywx/robot', params);
};

// [GET]机器人详情
export const SalaryNotifyQywxRobotApi = (params: RequestMd5Model) => {
    return http.get<QywxRobotModel>('/salary/notify/qywx/robot', params);
};

// [PUT]更新机器人
export const SalaryNotifyQywxRobotUpdateApi = (params: any) => {
    return http.put('/salary/notify/qywx/robot', params);
};

// [DELETE]删除机器人
export const SalaryNotifyQywxRobotDeleteApi = (params: RequestMd5Model) => {
    return http.delete('/salary/notify/qywx/robot.soft', params);
};

// [PUT]批量删除机器人
export const SalaryNotifyQywxRobotBatchDeleteApi = (params: RequestMd5Models) => {
    return http.put('/salary/notify/qywx/robot.batch.soft', params);
};

// [PUT]设置默认机器人
export const SalaryNotifyQywxRobotSelectApi = (params: { md5: string; select: boolean }) => {
    return http.put('/salary/notify/qywx/robot.select', params);
};

// [GET]机器人Ping
export const SalaryNotifyQywxRobotPingApi = (params: RequestMd5Model) => {
    return http.get('/salary/notify/qywx/robot.ping', params);
};
