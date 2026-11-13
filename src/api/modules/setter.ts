import http from "@/api";
import { ProfileModel, ProfilePassword, SetterProfileModel } from "@/models/setterModel";
import { ResultPage } from "@/api/utils/models";
import { AvatarMarketItem, AvatarMarketQuery, ProfileLogItem } from "@/models/setterModel";
import { PageableModel, RequestMd5Model, RequestStatusModel } from "@/models/X";


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

// [GET]个人中心>头像超市列表
export const SetProfileAvatarMarketApi = (params: AvatarMarketQuery) => {
    return http.get<ResultPage<AvatarMarketItem>>('/setter/profile.avatar.market', params);
};

// [PUT]个人中心>收藏或取消收藏头像
export const SetProfileAvatarFavoriteApi = (params: RequestStatusModel) => {
    return http.put<{ md5: string; favorite: boolean; favoriteCount: number }>('/setter/profile.avatar.favorite', params);
};

// [PUT]个人中心>设置头像超市头像
export const SetProfileAvatarSetApi = (params: RequestMd5Model) => {
    return http.put<{ url: string; count: number }>('/setter/profile.avatar.set', params);
};
