import http from "@/api";
import { ProfileModel, ProfilePassword, SetterProfileModel } from "@/models/setterModel";
import { ResultPage } from "@/api/utils/models";
import { ProfileLogItem } from "@/models/setterModel";
import { PageableModel } from "@/models/X";


/* * * * * * * * * * * * * * * * * * * * * * [设置->个人中心] * * * * * * * * * * * * * * * * * * * * * * * * * */
// [GET]个人中心>详情
export const SetProfileApi = () => {
    return http.get<SetterProfileModel>('/setter/profile');
};

// [PUT]个人中心>更新
export const SetProfileUpdateApi = (params: ProfileModel) => {
    return http.put('/setter/profile', params);
};

// [PUT]个人中心>密码修改
export const SetProfilePasswordApi = (params: ProfilePassword) => {
    return http.put('/setter/profile.password', params);
};

// [GET]个人中心>日志
export const SetProfileLogApi = (params: PageableModel) => {
    return http.get<ResultPage<ProfileLogItem>>('/setter/profile.log', params);
};

// [POST]个人中心>头像上传
export const SetProfileAvatarApi = (params: FormData) => {
    return http.post('/setter/profile.avatar', params);
};
