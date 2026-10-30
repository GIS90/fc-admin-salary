<template>
    <div class="user-bar">
        <!--搜索-->
        <el-tooltip effect="dark" content="搜索" placement="bottom">
            <div class="panel-item hidden-sm-and-down" @click="searchClick">
                <el-icon>
                    <Search />
                </el-icon>
            </div>
        </el-tooltip>
        <!--黑白模式-->
        <el-tooltip effect="dark" :content="sysGlobalStore.sysDark ? '日间模式' : '黑夜模式'" placement="bottom">
            <div class="panel-item hidden-sm-and-down" @click="darkClick">
                <el-icon>
                    <Sunny v-if="sysGlobalStore.sysDark" />
                    <Moon v-else />
                </el-icon>
            </div>
        </el-tooltip>
        <!--全屏-->
        <el-tooltip effect="dark" :content="isFullScreen ? '退出全屏' : '全屏'" placement="bottom">
            <div class="screen panel-item hidden-sm-and-down" @click="fullScreenClick">
                <el-icon :class="{ 'is-fullscreen': isFullScreen }">
                    <FullScreen />
                </el-icon>
            </div>
        </el-tooltip>
        <!--任务中心-->
        <el-tooltip effect="dark" content="任务中心" placement="bottom">
            <div class="tasks panel-item" @click="tasksClick">
                <el-icon>
                    <Bell />
                </el-icon>
            </div>
        </el-tooltip>
        <!--用户-->
        <el-popover
            v-model:visible="userCardVisible"
            placement="bottom-end"
            :width="280"
            :offset="8"
            trigger="click"
            popper-class="user-card-popper"
            :show-arrow="false"
        >
            <template #reference>
                <div class="user panel-item">
                    <div class="user-avatar">
                        <el-avatar :size="30" :src="authStore.userInfo.avatar"
                                   :shape='authStore.userInfo.sex === "M" ? "square" : "circle"'
                        />
                        <label>{{ authStore.userInfo.userName }}</label>
                        <el-icon :class="{ 'is-open': userCardVisible }">
                            <ArrowDown />
                        </el-icon>
                    </div>
                </div>
            </template>

            <div class="user-card">
                <!--基本信息-->
                <div class="user-card-head">
                    <el-avatar :size="48" :src="authStore.userInfo.avatar"
                               :shape='authStore.userInfo.sex === "M" ? "square" : "circle"'
                               class="user-card-avatar" />
                    <div class="user-card-meta">
                        <div class="user-card-name">
                            <span class="name">{{ userNameText }}</span>
                            <!-- <span v-if="roleText" class="role-tag">{{ roleText }}</span> -->
                        </div>
                        <div v-if="subText" class="user-card-sub">{{ subText }}</div>
                    </div>
                </div>

                <div class="user-card-divider"></div>

                <!--菜单-->
                <div class="user-card-menu">
                    <div class="user-card-item" @click="userInfoClick()">
                        <el-icon><User /></el-icon>
                        <span class="item-text">{{ $t("header.personalData") }}</span>
                        <el-icon class="item-arrow"><ArrowRight /></el-icon>
                    </div>
                    <div class="user-card-item" @click="clearCache()">
                        <el-icon><RefreshLeft /></el-icon>
                        <span class="item-text">{{ $t("header.clearCache") }}</span>
                        <el-icon class="item-arrow"><ArrowRight /></el-icon>
                    </div>
                </div>

                <div class="user-card-divider"></div>

                <!--退出登录-->
                <div class="user-card-footer">
                    <div class="user-card-logout" @click="logoutClick()">
                        <el-icon><SwitchButton /></el-icon>
                        <span>{{ $t("header.logout") }}</span>
                    </div>
                </div>
            </div>
        </el-popover>
        <!--主题设置-->
        <el-tooltip effect="dark" content="主题设置" placement="bottom">
            <div class="tasks panel-item" @click="settingClick">
                <el-icon>
                    <Setting />
                </el-icon>
            </div>
        </el-tooltip>
    </div>

    <!--搜索工具-->
    <el-dialog v-model="searchVisible" width="55%" top="5vh" center :show-close="false" destroy-on-close>
        <search @selectMenu="searchVisible = false" />
    </el-dialog>

    <!--任务中心-->
    <Task v-model:visible="tasksVisible" />


  <!--主题设置-->
    <el-drawer title="主题设置" v-model="settingVisible" :size="320" append-to-body destroy-on-close>
        <setting />
    </el-drawer>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { ElMessageBox } from 'element-plus';
import search from '../views/search.vue'
import Task from '../views/task.vue'
import setting from '../views/setting.vue';
import router from '@/router';
import { useAuthStore } from "@/store/modules/auth";
import { useSysGlobalStore } from '@/store/system/global';
import { AuthLogoutApi } from "@/api/modules/auth"

const authStore = useAuthStore()
const sysGlobalStore = useSysGlobalStore()
const searchVisible = ref(false)
const tasksVisible = ref(false)
const settingVisible = ref(false)
const userCardVisible = ref(false)

// 用户卡片信息（登录接口下发的字段）
const userInfoRaw = computed(() => authStore.userInfo as any);
const userNameText = computed(() => userInfoRaw.value.userName || userInfoRaw.value.name || '未登录');
const subText = computed(() => userInfoRaw.value.email || userInfoRaw.value.rtxId || userInfoRaw.value.userId || '');
const roleText = computed(() => {
    const role = userInfoRaw.value.role ?? userInfoRaw.value.roles;
    if (Array.isArray(role)) return role.filter((item: string) => !!item).join(' / ');
    return role || '';
});

// 关闭用户卡片
const closeUserCard = () => {
    userCardVisible.value = false;
};

// 全屏状态
const isFullScreen = ref(false);

const syncFullScreen = () => {
    isFullScreen.value = !!(
        document.fullscreenElement ||
        (document as any).mozFullScreen ||
        (document as any).webkitIsFullScreen ||
        (document as any).msFullscreenElement // 强制类型断言来处理msFullscreenElement可能不存在的情况
    );
};

onMounted(() => {
    syncFullScreen();
    document.addEventListener('fullscreenchange', syncFullScreen);
    document.addEventListener('webkitfullscreenchange', syncFullScreen);
    document.addEventListener('mozfullscreenchange', syncFullScreen);
    document.addEventListener('MSFullscreenChange', syncFullScreen);
});

//全屏
const fullScreenClick = () => {
    const element = document.documentElement as HTMLElement;

    if (isFullScreen.value) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if ((document as any).msExitFullscreen) { // 强制类型断言来处理msExitFullscreen可能不存在的情况
            (document as any).msExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
            (document as any).mozCancelFullScreen();
        } else if ((document as any).webkitExitFullscreen) {
            (document as any).webkitExitFullscreen();
        }
    } else {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if ((element as any).msRequestFullscreen) {
            (element as any).msRequestFullscreen();
        } else if ((element as any).mozRequestFullScreen) {
            // 注意: mozRequestFullScreen 通常是带 'S' 的
            // 但这里保持与原始代码一致
            (element as any).mozRequestFullScreen();
        } else if ((element as any).webkitRequestFullscreen) {
            (element as any).webkitRequestFullscreen();
        }
    }
}

// 搜索
const searchClick = () => {
    searchVisible.value = true
};

// 任务中心
const tasksClick = () => {
    tasksVisible.value = true
};

// 主题设置
const settingClick = () => {
  settingVisible.value = true
};

// 黑夜/日间模式切换
const darkClick = () => {
    sysGlobalStore.sysDark = !sysGlobalStore.sysDark;
};

//进入个人信息页面
const userInfoClick = () => {
    closeUserCard();
    router.push({ path: '/setter/profile' });
};

//清除缓存
const clearCache = () => {
    closeUserCard();
    ElMessageBox.confirm('清除缓存会将系统初始化，包括主题、语言设置等，是否继续？', '提示', {
        type: 'info',
    }).then(() => {
        sysGlobalStore.$reset()
        window.location.reload()
    }).catch(() => {
        //取消
    })
};

//退出登录
const logoutClick = () => {
    closeUserCard();
    ElMessageBox.confirm('确认是否退出当前用户？', '提示', {
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
    }).then(() => {
        AuthLogoutApi().then(() => {
            // 清空本地缓存
            authStore.$reset();
            router.replace({
                path: '/login'
            })
        }).catch(() => {
            ElMessageBox.close()
        })
    }).catch(() => {
        //取消退出
    })
};
</script>


<style scoped>
.user-bar {
    display: flex;
    align-items: center;
    height: 100%;
}

.user-bar .panel-item {
    padding: 0 10px;
    cursor: pointer;
    height: 100%;
    display: flex;
    align-items: center;
}

.user-bar .panel-item i {
    font-size: 16px;
}

/* 全屏状态：图标四角向内折 */
.user-bar .panel-item .el-icon {
    transition: transform 0.3s;
}

.user-bar .panel-item .el-icon.is-fullscreen {
    transform: rotate(180deg);
}

.user-bar .panel-item:hover {
    background: rgba(0, 0, 0, 0.1);
}

.user-bar .user-avatar {
    height: 49px;
    display: flex;
    align-items: center;
}

.user-bar .user-avatar label {
    display: inline-block;
    margin-left: 5px;
    font-size: 13px;
    cursor: pointer;
}

.msg-list li {
    border-top: 1px solid #eee;
}

.msg-list li a {
    display: flex;
    padding: 20px;
}

.msg-list li a:hover {
    background: #ecf5ff;
}

.msg-list__icon {
    width: 40px;
    margin-right: 15px;
}

.msg-list__main {
    flex: 1;
}

.msg-list__main h2 {
    font-size: 15px;
    font-weight: normal;
    color: #333;
}

.msg-list__main p {
    font-size: 13px;
    color: #999;
    line-height: 1.8;
    margin-top: 5px;
}

.msg-list__time {
    width: 100px;
    text-align: right;
    color: #999;
}

.dark .msg-list__main h2 {
    color: #d0d0d0;
}

.dark .msg-list li {
    border-top: 1px solid #363636;
}

.dark .msg-list li a:hover {
    background: #383838;
}

.badge {
    margin-top: 4px;
}

/* 用户卡片（触发器） */
.user-bar .user-avatar .el-icon {
    margin-left: 2px;
    font-size: 12px;
    color: #909399;
    transition: transform 0.3s;
}

.user-bar .user-avatar .el-icon.is-open {
    transform: rotate(180deg);
}

/* 用户卡片（内容） */
.user-card {
    font-size: 14px;
    color: #303133;
}

.user-card-head {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 16px 12px;
}

.user-card-avatar {
    flex: none;
    background: #f2f3f5;
    box-shadow: 0 0 0 1px #ebeef5 inset;
}

.user-card-meta {
    flex: 1;
    min-width: 0;
}

.user-card-name {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
}

.user-card-name .name {
    overflow: hidden;
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
    color: #303133;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.user-card-name .role-tag {
    flex: none;
    padding: 0 8px;
    font-size: 12px;
    line-height: 20px;
    color: #18a058;
    background: #e7f6ec;
    border-radius: 10px;
}

.user-card-sub {
    margin-top: 2px;
    overflow: hidden;
    font-size: 13px;
    line-height: 20px;
    color: #909399;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.user-card-divider {
    margin: 4px 0;
    border-top: 1px dashed #ebeef5;
}

.user-card-menu {
    padding: 4px 8px;
}

.user-card-item {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 42px;
    padding: 0 10px;
    cursor: pointer;
    border-radius: 8px;
    transition: background-color 0.2s;
}

.user-card-item:hover {
    background: #f5f7fa;
}

.user-card-item .el-icon {
    font-size: 16px;
    color: #606266;
}

.user-card-item .item-text {
    flex: 1;
    font-size: 14px;
    color: #303133;
}

.user-card-item .item-arrow {
    font-size: 12px;
    color: #c0c4cc;
}

.user-card-footer {
    padding: 8px 12px 12px;
}

.user-card-logout {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    height: 36px;
    font-size: 14px;
    color: #606266;
    cursor: pointer;
    background: #f5f7fa;
    border-radius: 8px;
    transition: background-color 0.2s;
}

.user-card-logout:hover {
    background: #ebeef5;
}

.user-card-logout .el-icon {
    font-size: 15px;
}
</style>

<style>
/* 用户卡片弹层（teleport 到 body，需全局样式） */
.user-card-popper.el-popover.el-popper {
    padding: 0;
    border: 1px solid #ebeef5;
    border-radius: 10px;
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
}
</style>
