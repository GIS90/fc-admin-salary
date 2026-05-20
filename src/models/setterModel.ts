import { OptionEnumModel } from "@/models/X";


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
 * 用户日志
 */
export interface ProfileLogItem{
    id: number;
    ip: string;
    method: string;
    path: string;
    tag: string;
    cost: number;
    createTime: string;
}
