import { defineStore } from "pinia";
import { SelfStorage } from '../securels'
import { UserInfoModel } from "@/models/authModel";

export const useAuthStore = defineStore('authStore', {
    state: () => ({
        token: "",
        userInfo: {
            userId: "",
            userName: "",
            phone: "",
            email: "",
            dashboard: "",
            avatar: "",
            sex: "",
            roles: [],
        } as UserInfoModel
    }),
    getters: {
        getToken: (state) => state.token,
        getUserInfo: (state) => state.userInfo,
        getUserInfoId: (state) => state.userInfo.userId,
        getUserInfoName: (state) => state.userInfo.userName,
        getUserInfoPhone: (state) => state.userInfo.phone,
        getUserInfoEmail: (state) => state.userInfo.email,
        getUserInfoDashboard: (state) => state.userInfo.dashboard,
        getUserInfoAvatar: (state) => state.userInfo.avatar,
        getUserInfoSex: (state) => state.userInfo.sex,
        getUserInfoRoles: (state) => state.userInfo.roles,
    },
    actions: {
        setToken(token: string) {
            this.token = token;
        },
        setUserInfo(userInfo: UserInfoModel) {
            this.userInfo = userInfo;
        },
        setUserInfoField(key: keyof UserInfoModel, value: any) {
            this.userInfo[key] = value;
        },
        reset() {
            this.$reset();
        }
    },
    persist: {
        key: 'AUTH',
        storage: SelfStorage,
    }
})
