import { OptionEnumModel, PageableModel } from "@/models/X";


/**
 * set > profileInfo
 */
export interface SetterProfileModel {
    user: ProfileModel;
    sexEnum: OptionEnumModel[];
}

/**
 * 用户信息模型
 */
export interface ProfileModel {
    userId: string;
    userName: string;
    sex: string;
    email: string;
    phone: string;
    introduction: string
}

/**
 * 用户密码
 */
export interface ProfilePassword {
    userPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

/**
 * 用户密码
 */
export interface ProfileLogItem {
    id: string;
    ip: string;
    method: string;
    url: string;
    cost: number;
    createTime: string;
}

/**
 * 头像超市查询参数
 */
export interface AvatarMarketQuery extends PageableModel {
    type?: string;
    favorite?: 0 | 1;
    sort?: 'count' | 'favorite';
    content?: string;
}

/**
 * 头像超市列表项
 */
export interface AvatarMarketItem {
    md5: string;
    name: string;
    url: string;
    type: string;
    summary: string;
    tag: string;
    count: number;
    favorite: boolean;
    favoriteCount: number;
}

