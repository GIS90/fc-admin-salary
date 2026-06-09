<template>
  <el-drawer :model-value="props.visible"
             :size="dwField.size"
             :modal="dwField.modal"
             :direction="dwField.direction"
             :lock-scroll="dwField.lockScroll"
             :show-close="dwField.showClose"
             :close-on-click-modal="dwField.closeOnClickModal"
             :close-on-press-escape="dwField.closeOnPressEscape"
             :open-delay="dwField.openDelay"
             :with-header="dwField.withHeader"
             :destroy-on-close="dwField.destroyOnClose"
             @open="openDrawer"
             @close="closeDrawer">
    <el-container v-loading="loading">
      <el-header class="d-header">
        <div class="left-panel">
          <h2>任务中心</h2>
        </div>
        <div class="right-panel">
          <el-button circle icon="Refresh" @click="refresh" />
          <el-button circle icon="Plus" @click="addTask" />
        </div>
      </el-header>
      <el-main>
        <el-empty v-if="tasksData.length === 0" :image-size="120">
          <template #description>
            <h2>没有正在执行的任务</h2>
          </template>
          <p style="font-size: 14px;color: #999;line-height: 1.5;margin: 0 40px;">
            在处理耗时过久的任务时为了不阻碍正在处理的工作，可在任务中心进行异步执行。
          </p>
        </el-empty>
        <transition-group name="tg-task-card" tag="div">
          <el-card v-for="task in tasksData" :key="task.id" shadow="hover" class="user-bar-tasks-item">
            <div class="user-bar-tasks-item-body">
              <div class="taskIcon">
                <el-icon v-if="task.data == 'ALL'" :size="20">
                  <Paperclip />
                </el-icon>
                <el-icon v-else :size="20">
                  <DataAnalysis />
                </el-icon>
              </div>
              <div class="taskMain">
                <div class="title">
                  <h2>
                    <span style="font-size: 20px;">
                      [ {{ task.id }} ]
                    </span> {{ task.name }}
                  </h2>
                  <div class="text">
                    <p class="text-time">创建时间：{{task.createTime}}</p>
                    <div class="text-status">
                      <el-tag type="success" effect="dark" v-if="task.task === 'SUCCESS'">成功</el-tag>
                      <el-tag type="danger" effect="dark" v-else-if="task.task === 'FAILURE'">失败</el-tag>
                      <el-tag type="info" effect="dark" v-else>执行中</el-tag>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </transition-group>
      </el-main>
      <el-footer class="footer-pagination" v-if="tasksData.length > 0">
        <el-pagination v-model:current-page="pagField.page" v-model:page-size="pagField.pageSize" :background="pagField.background"
                       :small="true" :total="pagField.total" :page-sizes="pagField.pageSizes"
                       :layout="pagField.layout" :pager-count="pagField.pagerCount"
                       @current-change="changePage"
                       @size-change="changeSize"
        />

      </el-footer>
    </el-container>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, defineProps, reactive, defineEmits } from 'vue';
import { AuthTaskModel } from '@/models/authModel';
import { drawerField } from "@/utils/attrs/field";
import { AuthTaskApi } from "@/api/modules/auth";
import {ElNotification} from "element-plus";

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
    default: false
  }
});
// Drawer属性
const dwConfigField = reactive({
  title: '任务中心',
  size: '35%'
});
const dwField = {...drawerField, ...dwConfigField};
const pagField = reactive({
  page: 1,
  pageSize: 5,
  total: 0,
  pagerCount: 5,
  layout: 'total, sizes, prev, pager, next',
  pageSizes: [5, 10, 20, 50],
  background: "background",
});
const loading = ref(false)
const tasksData = ref<AuthTaskModel[]>([]);
const emit = defineEmits(['update:visible']);

// 打开
function openDrawer() {
  fetchApiData();
};

// 关闭
function closeDrawer() {
  emit('update:visible', false);
};

// 刷新
const refresh = () => {
  fetchApiData();
};

// 页码/页大小改变
const changePage = () => {
  fetchApiData();
};
const changeSize = () => {
  pagField.page = 1; // 重置页码
  fetchApiData();
};

const fetchApiData = async () => {
  loading.value = true;
  const params  = {
    page: pagField.page,
    pageSize: pagField.pageSize
  };
  const response = await AuthTaskApi(params);
  if (response.data) {
    const res = response as { data: { list: AuthTaskModel[], total: number } }; // declare
    tasksData.value = res.data.list;
    pagField.total = res.data.total;
  };
  loading.value = false;
};

const addTask = () => {
  ElNotification({
    title: '提示',
    message: '暂不可用，开发中。。。。。。',
    type: 'error'
  });
};
</script>

<style scoped>
.user-bar-tasks-item {
  margin-bottom: 10px;
}

.user-bar-tasks-item:hover {
  border-color: var(--el-color-primary);
}

.user-bar-tasks-item-body {
  display: flex;
}

.user-bar-tasks-item-body .taskIcon {
  width: 45px;
  height: 45px;
  background: var(--el-color-primary-light-9);
  margin-right: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--el-color-primary);
  border-radius: 20px;
}

.user-bar-tasks-item-body .taskMain {
  flex: 1;
}

.user-bar-tasks-item-body .title h2 {
  font-size: 16px;
}

.user-bar-tasks-item-body .title p {
  font-size: 13px;
  color: #999;
  margin-top: 5px;
}

.user-bar-tasks-item-body .taskMain .text {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>
