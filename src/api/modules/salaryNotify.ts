import http from "@/api";
import { ElNotification } from "element-plus";
import { ResultPage } from "@/api/utils/models";
import { RequestMd5Model, RequestMd5Models } from "@/models/X";
import { DtalkListModel, DtalkDetailModel, DtalkRobotModel, DtalkSendInitModel, DtalkResendInitModel } from "@/models/salaryModel";
import { QywxListModel, QywxDetailModel, QywxRobotModel, QywxSendInitModel, QywxResendInitModel } from "@/models/salaryModel";
import { EmailListModel, EmailDetailModel, EmailRobotModel, EmailSendInitModel, EmailResendInitModel } from "@/models/salaryModel";


interface NotifyTaskParams {
    taskId: string;
}

interface NotifyTaskResult {
    status: string;
    code?: number;
    message?: string;
    result?: any;
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * 后端发送/重发已改为异步任务，这里统一轮询任务结果。
 * 对调用方仍返回原有结果结构，避免改动发送和重发组件。
 */
const waitNotifyTask = async (
    taskApi: (params: NotifyTaskParams) => Promise<any>,
    submitted: any,
    timeoutMs: number = 10 * 60 * 1000
) => {
    const taskId: string | undefined = submitted?.data?.taskId;
    if (!taskId) return submitted;

    const startedAt = Date.now();
    while (Date.now() - startedAt < timeoutMs) {
        await sleep(1000);
        const response: any = await taskApi({ taskId });
        const task: NotifyTaskResult = response?.data || {};
        if (task.status === "SUCCESS") {
            return { ...response, data: task.result || [] };
        }
        if (task.status === "FAILURE") {
            const message = task.message || "任务处理失败";
            ElNotification.error({ title: "请求错误提示", message });
            return Promise.reject({ code: task.code || 900, message });
        }
    }

    const message = "任务处理时间较长，请稍后刷新列表查看结果";
    ElNotification.error({ title: "请求错误提示", message });
    return Promise.reject({ code: 900, message });
};


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

// [GET]发送/重发任务状态
export const SalaryNotifyDtalkTaskApi = (params: NotifyTaskParams) => {
    return http.get('/salary/notify/dtalk.task', params);
};

// [POST]提交发送请求
export const SalaryNotifyDtalkSendApi = async (params: any) => {
    const response = await http.post('/salary/notify/dtalk.send', params);
    return await waitNotifyTask(SalaryNotifyDtalkTaskApi, response);
};

// [GET]重发初始化
export const SalaryNotifyDtalkResendInitApi = (params: RequestMd5Model) => {
    return http.get<DtalkResendInitModel>('/salary/notify/dtalk.resendInit', params);
};

// [POST]提交重发请求
export const SalaryNotifyDtalkResendApi = async (params: any) => {
    const response = await http.post('/salary/notify/dtalk.resend', params);
    return await waitNotifyTask(SalaryNotifyDtalkTaskApi, response);
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

// [GET]发送/重发任务状态
export const SalaryNotifyQywxTaskApi = (params: NotifyTaskParams) => {
    return http.get('/salary/notify/qywx.task', params);
};

// [POST]提交发送请求
export const SalaryNotifyQywxSendApi = async (params: any) => {
    const response = await http.post('/salary/notify/qywx.send', params);
    return await waitNotifyTask(SalaryNotifyQywxTaskApi, response);
};

// [GET]重发初始化
export const SalaryNotifyQywxResendInitApi = (params: RequestMd5Model) => {
    return http.get<QywxResendInitModel>('/salary/notify/qywx.resendInit', params);
};

// [POST]提交重发请求
export const SalaryNotifyQywxResendApi = async (params: any) => {
    const response = await http.post('/salary/notify/qywx.resend', params);
    return await waitNotifyTask(SalaryNotifyQywxTaskApi, response);
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


/* * * * * * * * * * * * * * * * * * * * * * [工资 > 消息通知 > 邮件通知] * * * * * * * * * * * * * * * * * * * * * * * * * */
// [GET]列表
export const SalaryNotifyEmailListApi = (params: any) => {
    return http.get<ResultPage<EmailListModel>>('/salary/notify/email.list', params);
};

// [GET]详情
export const SalaryNotifyEmailApi = (params: RequestMd5Model) => {
    return http.get<EmailDetailModel>('/salary/notify/email', params);
};

// [PUT]更新设置
export const SalaryNotifyEmailUpdateApi = (params: any) => {
    return http.put('/salary/notify/email', params);
};

// [GET]切换Sheet
export const SalaryNotifyEmailChangeSheetApi = (params: { md5: string; sheet: string }) => {
    return http.get('/salary/notify/email.changeSheet', params);
};

// [DELETE]单条删除
export const SalaryNotifyEmailDeleteApi = (params: RequestMd5Model) => {
    return http.delete('/salary/notify/email.soft', params);
};

// [PUT]批量删除
export const SalaryNotifyEmailBatchDeleteApi = (params: RequestMd5Models) => {
    return http.put('/salary/notify/email.batch.soft', params);
};

// [GET]发送初始化
export const SalaryNotifyEmailSendInitApi = (params: RequestMd5Model) => {
    return http.get<EmailSendInitModel>('/salary/notify/email.sendInit', params);
};

// [GET]发送/重发任务状态
export const SalaryNotifyEmailTaskApi = (params: NotifyTaskParams) => {
    return http.get('/salary/notify/email.task', params);
};

// [POST]提交发送请求
export const SalaryNotifyEmailSendApi = async (params: any) => {
    const response = await http.post('/salary/notify/email.send', params);
    return await waitNotifyTask(SalaryNotifyEmailTaskApi, response);
};

// [GET]重发初始化
export const SalaryNotifyEmailResendInitApi = (params: RequestMd5Model) => {
    return http.get<EmailResendInitModel>('/salary/notify/email.resendInit', params);
};

// [POST]提交重发请求
export const SalaryNotifyEmailResendApi = async (params: any) => {
    const response = await http.post('/salary/notify/email.resend', params);
    return await waitNotifyTask(SalaryNotifyEmailTaskApi, response);
};

// [GET]邮件服务列表
export const SalaryNotifyEmailRobotListApi = () => {
    return http.get('/salary/notify/email/robot.list');
};

// [POST]新增邮件服务
export const SalaryNotifyEmailRobotAddApi = (params: any) => {
    return http.post('/salary/notify/email/robot', params);
};

// [GET]邮件服务详情
export const SalaryNotifyEmailRobotApi = (params: RequestMd5Model) => {
    return http.get<EmailRobotModel>('/salary/notify/email/robot', params);
};

// [PUT]更新邮件服务
export const SalaryNotifyEmailRobotUpdateApi = (params: any) => {
    return http.put('/salary/notify/email/robot', params);
};

// [DELETE]删除邮件服务
export const SalaryNotifyEmailRobotDeleteApi = (params: RequestMd5Model) => {
    return http.delete('/salary/notify/email/robot.soft', params);
};

// [PUT]批量删除邮件服务
export const SalaryNotifyEmailRobotBatchDeleteApi = (params: RequestMd5Models) => {
    return http.put('/salary/notify/email/robot.batch.soft', params);
};

// [PUT]设置默认邮件服务
export const SalaryNotifyEmailRobotSelectApi = (params: { md5: string; select: boolean }) => {
    return http.put('/salary/notify/email/robot.select', params);
};

// [GET]邮件服务连接测试
export const SalaryNotifyEmailRobotPingApi = (params: RequestMd5Model) => {
    return http.get('/salary/notify/email/robot.ping', params);
};
