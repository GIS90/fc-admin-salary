<template>
  <el-container class="page-user">
    <!--左边栏-->
    <el-aside style="width: 240px;">
      <el-container>
        <el-header style="height: auto;display: block;padding-top: 20px;">
          <div class="user-info-top">
            <el-avatar :size="160" :src="authStore.userInfo.avatar"></el-avatar>
            <h2>{{ authStore.userInfo.userName }}</h2>
            <p>
              <el-button class="upload-avatar-btn" type="primary" effect="dark" disable-transitions :icon="Upload" @click="openAvatar">
                上传头像
              </el-button>
            </p>
          </div>
        </el-header>
        <el-main class="nopadding">
          <el-menu class="menu" :default-active="selectTitle">
            <el-menu-item-group v-for="group in menu" :key="group.groupName" :title="group.groupName">
              <el-menu-item v-for="item in group.list" :key="item.title" :index="item.title"
                            @click="openPage(item)">
                <el-icon v-if="item.icon">
                  <component :is="item.icon" />
                </el-icon>
                <template #title>
                  <span>{{ item.title }}</span>
                </template>
              </el-menu-item>
            </el-menu-item-group>
          </el-menu>
        </el-main>
      </el-container>
    </el-aside>

    <!--右边栏-->
    <el-main class="el-main-container">
      <Suspense>
        <template #default>
          <component :is="selectComponent" />
        </template>
        <template #fallback>
          <el-skeleton :rows="3" />
        </template>
      </Suspense>
    </el-main>

    <!-- 头像上传 -->
    <avatarUpload v-model:visible="auVisible" />
  </el-container>
</template>

<script setup lang="ts">
import { Upload } from '@element-plus/icons-vue'
import { DefineComponent, defineAsyncComponent, ref, markRaw } from 'vue'
import { useAuthStore } from "@/store/modules/auth";
import avatarUpload from "./components/avatar.vue"

const authStore = useAuthStore();

const account = defineAsyncComponent(() => import('./components/account.vue'));
const setting = defineAsyncComponent(() => import('./components/setting.vue'));
const password = defineAsyncComponent(() => import('./components/password.vue'));
const logs = defineAsyncComponent(() => import('./components/logs.vue'));

const selectTitle = ref("账号信息");
const selectComponent = ref<DefineComponent>(markRaw(account) as DefineComponent);
const auVisible= ref(false); // 头像上传

interface MenuModel {
  groupName: string;
  list: ListModel[];
};

interface ListModel {
  icon: string;
  title: string;
  component: DefineComponent;
};

const menu = [
  {
    groupName: "基本设置",
    list: [
      {
        icon: "Postcard",
        title: "账号信息",
        component: account
      },
      {
        icon: "Lock",
        title: "密码",
        component: password
      },
      {
        icon: "Operation",
        title: "系统设置",
        component: setting
      }
    ]
  },
  {
    groupName: "数据管理",
    list: [
      {
        icon: "Clock",
        title: "操作日志",
        component: logs
      }
    ]
  }
] as MenuModel[];

const openPage = (item: ListModel) => {
  selectTitle.value = item.title
  selectComponent.value = markRaw(item.component)
};

const openAvatar = () => {
  auVisible.value = true;
};
</script>

<style scoped>
.el-main-container {
  padding: 15px;
}

.upload-avatar-btn {
  margin-bottom: 10px;
}
</style>
