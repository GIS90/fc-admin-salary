import http from "@/api";
import {AuthRequestModel, AuthModel, MenuPermissionsModel} from "@/models/authModel";
import { ECOption } from '@/components/fcEcharts/config';



/* * * * * * * * * * * * * * * * * * * * * * [登录、退出] * * * * * * * * * * * * * * * * * * * * * * * * * */
// [POST]系统>登录
export const AuthLoginApi = (params: AuthRequestModel) => {
    return http.post<AuthModel>('/access/login', params);
};

// [GET]系统>退出
export const AuthLogoutApi = () => {
    return http.get('/access/logout');
};

/* * * * * * * * * * * * * * * * * * * * * * [全局PAI] * * * * * * * * * * * * * * * * * * * * * * * * * */
// [GET]系统>菜单列表及权限
export const AuthMenuApi = () => {
    return http.get<MenuPermissionsModel>('/api/auth');
};

// [GET]首页>Dashboard
export const AuthDashboardApi = () => {
    return http.get<ECOption>('/api/dashboard');
};

// [GET]个人中心>任务中心
export const AuthTaskApi = (params: any) => {
    return http.get('/api/task', params);
};














// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// 获取字符验证码
export const charVerifyApi = () => {
    return http.get<string>('/v1/charVerify');
};

// 获取字符验证码图片类型
export const charVerifyImgApi = () => {
    return http.get<string>('/v1/charVerifyImg');
};

// 图片上传(多图上传必须传{ cancel: false })
export const uploadImg = (params: FormData) => {
    return http.post<string>('/v1/upload', params, { cancel: false });
};

// 视频上传
export const uploadVideo = (params: FormData) => {
    return http.post<string>('/v1/upload', params, { cancel: false });
};

