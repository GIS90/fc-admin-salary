<template>
  <div class="step-upload">
    <el-upload
        ref="uploadRef"
        :drag="uploadAttrs.drag"
        :multiple="uploadAttrs.multiple"
        :auto-upload="uploadAttrs.autoUpload"
        :limit="uploadAttrs.limit"
        :show-file-list="uploadAttrs.showFileList"
        :accept="uploadAttrs.accept"
        :on-change="uploadChange"
        :on-exceed="uploadExceed"
        :on-remove="uploadRemove"
    >
      <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
      <div class="el-upload__text">
        拖拽或 <em>点击上传</em> Excel 文件
      </div>
      <template #tip>
        <div class="step-upload-tip">
          <p>1、仅支持 <span class="info_red_weight">.xlsx</span> 文件格式，每次仅限导入一个文件</p>
          <p>2、单次导入最大 <span class="info_red_weight">200</span> 条数据</p>
          <el-button class="step-upload-tip-button" type="primary" link @click="downloadTemplate">
            <el-icon><Download /></el-icon> 下载导入模板
          </el-button>
        </div>
      </template>
    </el-upload>

    <!-- 已选文件信息 -->
    <div v-if="selectedFile">
      <el-alert type="success" :closable="false" show-icon>
        <template #title>
          <span class="step-upload-file-info">已选择文件：<strong>{{ selectedFile.name }}</strong></span>
          <span class="step-upload-file-info" style="margin-left: 20px; color: #909399;">
            大小：{{ formatFileSize(selectedFile.size) }}
          </span>
        </template>
      </el-alert>
    </div>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable */
// @ts-nocheck  // 禁用整个文件的TypeScript检查

import { ref, reactive, onMounted } from 'vue';
import { ElNotification } from 'element-plus';
import { UploadFilled, Download } from '@element-plus/icons-vue';
import { SysConfigXtcsKeyApi } from "@/api/modules/systemConfig";
import { XtcsModelDetail } from "@/models/systemModel";
const templateUrl = ref(""); // 模板下载地址

onMounted(() => {
  onMountedApi();
});

// 请求数据API
const onMountedApi = async () => {
  const response = await SysConfigXtcsKeyApi({ "key": "USER-IMPORT-URL" });
  if (response.data) {
    const res = response as { data: XtcsModelDetail }; // declare
    templateUrl.value = res.data.value;
  }
};

const emit = defineEmits(['file-selected']);
const uploadAttrs = reactive({
  drag: true, // 是否支持拖拽
  multiple: false, // 是否支持多选文件
  autoUpload: false, // 是否自动上传文件
  showFileList: true, // 是否显示文件列表
  limit: 1,
  accept: ".xls,.xlsx"
});

const uploadRef = ref();
const selectedFile = ref<File | null>(null);

const uploadChange = (file: any) => {
  selectedFile.value = file.raw;
  emit('file-selected', file.raw);
}

// 文件上传超过限制的hook
const uploadExceed = (files, UploadFiles) => {
  ElNotification({
    title: "提示",
    message: "只允许上传一个文件",
    type: "warning",
    duration: 2 * 1000
  });
};

// 文件移除列表成功的hook
const uploadRemove = (uploadFile, uploadFiles) => {
  selectedFile.value = null;
  emit('file-selected', null);
  ElNotification({
    title: "提示",
    message: uploadFile?.name ? uploadFile.name + '移除列表成功' : '文件移除列表成功',
    type: "success",
    duration: 2 * 1000
  });
};

const formatFileSize = (size: number) => {
  if (size < 1024) return size + ' B'
  if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB'
  return (size / (1024 * 1024)).toFixed(2) + ' MB'
};

const downloadTemplate = () => {
  if (!templateUrl.value) {
    ElNotification({
      title: '提示',
      message: '模板文件配置为空，请联系管理员',
      type: 'warning'
    });
    return;
  }
  // 下载模板逻辑
  window.open(templateUrl.value, '_blank')
};

defineExpose({
  clearFiles: () => {
    if (uploadRef.value) {
      uploadRef.value.clearFiles();
    }
    selectedFile.value = null;
  }
});
</script>

<style scoped>
.step-upload {
  width: 100%;
}

.step-upload-tip {
  font-size: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  line-height: 2;
}

.step-upload-tip-button {
  font-size: 24px;
  font-weight: 600;
}

.step-upload-file-info {
  font-size: 16px;
}
</style>
