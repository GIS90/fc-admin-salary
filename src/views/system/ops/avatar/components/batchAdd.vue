<template>
 <el-dialog
      :model-value="props.visible"
      :width="dgField.width"
      :fullscreen="fullView"
      :top="dgField.top"
      :modal="dgField.modal"
      :lock-scroll="dgField.lockScroll"
      :open-delay="dgField.openDelay"
      :close-delay="dgField.closeDelay"
      :close-on-click-modal="dgField.closeOnClickModal"
      :close-on-press-escape="dgField.closeOnPressEscape"
      :show-close="dgField.showClose"
      :draggable="dgField.draggable"
      :overflow="dgField.overflow"
      :center="dgField.center"
      :align-center="dgField.alignCenter"
      @open="openDialog"
      @close="closeDialog"
  >
    <!--header-->
    <template #header>
      <div class="my-dialog-header">
        <div class="my-dialog-header-title">{{ dgField.title }}</div>
        <div class="my-dialog-header-icon">
          <el-tooltip effect="dark" :content="fullViewText" placement="top">
            <el-icon @click="fullScreen">
              <FullScreen />
            </el-icon>
          </el-tooltip>
          <el-tooltip effect="dark" content="关闭" placement="top">
            <el-icon class="margin-left-10px" @click="closeDialog">
              <Close />
            </el-icon>
          </el-tooltip>
        </div>
      </div>
    </template>

    <!--body-->
    <div class="my-dialog-body">
      <!--公共属性（所有图片共用）-->
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="100px">
        <el-row :gutter="16">
          <el-col :xs="24" :md="12" :span="12">
            <el-form-item label="图片类型" prop="type">
              <el-select v-model="ruleForm.type" style="width: 100%;" placeholder="请选择图片类型">
                <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
                  <span>{{ item.label }}</span>
                  <span style="float: right; color: #999; font-size: 12px">{{ item.value }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12" :span="12">
            <el-form-item label="状态" prop="lock">
              <el-radio-group v-model="ruleForm.lock">
                <el-radio :value="false">启用</el-radio>
                <el-radio :value="true">停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="图片标签" prop="tag">
          <el-input v-model.trim="ruleForm.tag" v-bind="inputField" :maxlength="ProfileLen.tag" :placeholder="ProfilePlace.tag" />
        </el-form-item>
        <el-form-item label="备注说明" prop="summary">
          <el-input v-model="ruleForm.summary"
                    :type="textAreaField.type"
                    :size="textAreaField.size"
                    :show-word-limit="textAreaField.showWordLimit"
                    :clearable="textAreaField.clearable"
                    :autosize="summarySize"
                    :maxlength="ProfileLen.summary"
                    :placeholder="ProfilePlace.summary"
                    :disabled="btnDisabled"
          />
        </el-form-item>
      </el-form>

      <!--多图上传区域（picture-card）-->
      <el-divider content-position="left">图片列表（自动沿用上方公共属性）</el-divider>
      
      <el-upload
          ref="uploadRef"
          :accept="'.jpg,.jpeg,.png'"
          :file-list="fileList"
          list-type="picture-card"
          :auto-upload="false"
          :multiple="true"
          :limit="uploadLimit"
          :on-change="handleChange"
          :on-remove="handleRemove"
          :on-exceed="handleExceed"
          :on-preview="handlePreview"
      >
        <el-icon class="el-icon--upload"><Plus /></el-icon>
        <template #tip>
          <div class="upload-tip">
            <span class="upload-tip-item">
              <el-icon><Picture /></el-icon>
              仅支持 JPG / PNG
            </span>
            <span class="upload-tip-item">
              <el-icon><Files /></el-icon>
              单张 ≤ <b>{{ avatarSizeMax }}</b> MB
            </span>
            <span class="upload-tip-item" :class="{ 'is-full': fileList.length >= uploadLimit }">
              <el-icon><Checked /></el-icon>
              已选 <b>{{ fileList.length }}</b> / {{ uploadLimit }} 张
            </span>
          </div>
        </template>
      </el-upload>

      <!--上传进度-->
      <div v-if="btnLoading" class="upload-progress">
        <div class="upload-progress-head">
          <span>正在上传 {{ fileList.length }} 张图片…</span>
          <span class="upload-progress-percent">{{ uploadPercent }}%</span>
        </div>
        <el-progress :percentage="uploadPercent" :stroke-width="10" :show-text="false" striped striped-flow />
      </div>

      <!--图片查看（放大预览）-->
      <el-image-viewer v-if="previewVisible" :url-list="[previewUrl]" :teleported="true" @close="previewVisible = false" />
    </div>

    <!--footer-->
    <template #footer>
      <div class="my-dialog-footer">
        <el-button :disabled="btnDisabled" @click="handleClear">清空</el-button>
        <el-button :disabled="btnDisabled" @click="closeDialog">取 消</el-button>
        <el-button type="primary" :disabled="btnDisabled || fileList.length === 0" :loading="btnLoading" @click="submitUpload">
          确定上传（{{ fileList.length }}）
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang='ts'>
import { ref, reactive, defineProps, defineEmits, watch } from 'vue';
import { UploadFilesApi, DictEnumOptionApi, SysConfigXtcsKeysApi } from '@/api/modules/common';
import { ElNotification, ElMessage, ElImageViewer, type FormInstance, type FormRules } from 'element-plus';
import { textAreaField, dialogField, inputField } from "@/utils/attrs/field";
import publicLength from "@/utils/attrs/length";
import publicPlaceHolder from "@/utils/attrs/place";

const ProfileLen = publicLength.systemAvatarModel;
const ProfilePlace = publicPlaceHolder.systemAvatarModel;
const summarySize = ref({minRows: 3, maxRows: 4});

const dgConfigField = reactive({
  title: '批量上传',
  width: '65%',
  closeOnPressEscape: false
});
const dgField = {...dialogField, ...dgConfigField}; // DIALOG属性
const emit = defineEmits(['update:visible', 'reFetchTableData']);
const props = defineProps({
  visible: { type: Boolean, required: true, default: false }
});

// -------- Dialog --------
const fullView = ref(false);
const fullViewText = ref('全屏');
watch(fullView, (value) => { fullViewText.value = value ? '取消全屏' : '全屏'; }, { immediate: true });
function fullScreen() { fullView.value = !fullView.value; }

// -------- Form --------
const ruleFormRef = ref<FormInstance>();
const btnDisabled = ref(false);
const btnLoading = ref(false);
// 上传进度
const uploadPercent = ref(0);
// 图片放大预览
const previewVisible = ref(false);
const previewUrl = ref('');
const ruleForm = reactive({
  type: "",
  tag: "",
  summary: "",
  lock: false,
});
const rules: FormRules = {
  type: [
    { required: true, message: "请选择图片类型", trigger: 'change' },
  ],
};

// -------- 类型选项 --------
const typeOptions = ref<Array<{ label: string; value: string }>>([]);
const typeOptionsLoaded = ref(false);
const fetchTypeOptions = async () => {
  if (typeOptionsLoaded.value) return;
  typeOptionsLoaded.value = true;
  try {
    const response = await DictEnumOptionApi({ name: 'avatar-type' });
    if (response.data) {
      typeOptions.value = response.data as Array<{ label: string; value: string }>;
    }
  } catch (e: any) {
    typeOptionsLoaded.value = false;
    if (e?.code !== 'ERR_CANCELED') {
      ElMessage.warning('图片类型加载失败，请重新打开弹窗');
    }
  }
};

// -------- Upload --------
// 上传限制（系统参数：图片大小 UPLOAD-AVATAR-SIZE-MAX 单位MB；上传数量 UPLOAD-FILE-MAX）
const avatarSizeMax = ref(5);
const uploadLimit = ref(20);
const fetchUploadLimits = async () => {
  try {
    const response = await SysConfigXtcsKeysApi({ keys: ['UPLOAD-AVATAR-SIZE-MAX', 'UPLOAD-FILE-MAX'] });
    const data = (response as { data: Record<string, string> })?.data || {};
    const size = Number(data['UPLOAD-AVATAR-SIZE-MAX']);
    const count = Number(data['UPLOAD-FILE-MAX']);
    if (size > 0) avatarSizeMax.value = size;
    if (count > 0) uploadLimit.value = count;
  } catch (e) {
    // 参数未配置或请求失败时保持默认限制
  }
};
const uploadRef = ref();
const fileList = ref<any[]>([]);

function openDialog() {
  fetchTypeOptions();
  fetchUploadLimits();
  resetForm();
  fileList.value = [];
  uploadRef.value?.clearFiles?.();
}
function closeDialog() {
  previewVisible.value = false;
  emit('update:visible', false);
}
function resetForm() {
  ruleForm.type = "";
  ruleForm.tag = "";
  ruleForm.summary = "";
  ruleForm.lock = false;
  ruleFormRef.value?.clearValidate?.();
}
function handleClear() {
  fileList.value = [];
  uploadRef.value?.clearFiles?.();
}

// 选择文件时校验格式与大小（auto-upload 关闭时 before-upload 不会触发）
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png'];
const validateFile = (uploadFile: any): boolean => {
  const raw = uploadFile?.raw as File | undefined;
  if (!raw) return true;
  if (!ALLOWED_IMAGE_TYPES.includes(raw.type)) {
    ElMessage.warning('仅支持 JPG / PNG 格式');
    return false;
  }
  if (raw.size > avatarSizeMax.value * 1024 * 1024) {
    ElMessage.warning(`单张图片不能超过 ${avatarSizeMax.value}MB`);
    return false;
  }
  return true;
};
const handleChange = (uploadFile: any, uploadFiles: any[]) => {
  if (!validateFile(uploadFile)) {
    uploadRef.value?.handleRemove?.(uploadFile);
    return;
  }
  fileList.value = uploadFiles;
};
const handleRemove = (_uploadFile: any, uploadFiles: any[]) => {
  fileList.value = uploadFiles;
};
const handleExceed = () => {
  ElNotification({ title: '提示', message: `最多上传 ${uploadLimit.value} 张图片`, type: 'warning' });
};

// 点击列表图片的查看图标时放大预览
const handlePreview = (uploadFile: any) => {
  const url = uploadFile?.url || (uploadFile?.raw ? URL.createObjectURL(uploadFile.raw) : '');
  if (!url) return;
  previewUrl.value = url;
  previewVisible.value = true;
};

async function submitUpload() {
  if (fileList.value.length < 1) {
    ElNotification({ title: '提示', message: '请先选择图片', type: 'warning' });
    return;
  }
  try {
    await ruleFormRef.value?.validate();
  } catch { return; }

  btnDisabled.value = true;
  btnLoading.value = true;
  uploadPercent.value = 0;
  try {
    const formData = new FormData();
    formData.append('upload_type', '100');
    // 公共属性
    formData.append('avatar_type', ruleForm.type);
    formData.append('avatar_tag', ruleForm.tag);
    formData.append('avatar_summary', ruleForm.summary);
    formData.append('avatar_lock', String(ruleForm.lock));
    // 多文件
    fileList.value.forEach((file) => {
      if (file.raw) formData.append('files', file.raw);
    });

    const response = await UploadFilesApi(formData, {
      onUploadProgress: (e: any) => {
        if (!e?.total) return;
        uploadPercent.value = Math.min(99, Math.round((e.loaded / e.total) * 100));
      }
    });
    uploadPercent.value = 100;
    const respData = (response?.data as { total?: number; success?: number; failed?: number }) || {};
    ElNotification({
      title: '提示',
      message: `上传完成：成功 ${respData.success ?? respData.total ?? fileList.value.length} / 共 ${respData.total ?? fileList.value.length}`,
      type: 'success'
    });
    closeDialog();
    emit('reFetchTableData', true);
  } catch (e) {
    ElNotification({ title: '提示', message: '上传失败，请稍后重试', type: 'error' });
  } finally {
    btnDisabled.value = false;
    btnLoading.value = false;
  }
}
</script>

<style scoped>
/* 上传限制提示 */
.upload-tip {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.upload-tip-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 12px;
  background: var(--el-fill-color-light);
  line-height: 1;
}

.upload-tip-item .el-icon {
  font-size: 13px;
  color: var(--el-color-primary);
}

.upload-tip-item b {
  font-weight: 600;
  color: var(--el-color-primary);
}

/* 已达数量上限时高亮提醒 */
.upload-tip-item.is-full {
  background: var(--el-color-warning-light-9);
}

.upload-tip-item.is-full .el-icon,
.upload-tip-item.is-full b {
  color: var(--el-color-warning);
}

/* 上传进度 */
.upload-progress {
  margin-top: 16px;
  padding: 12px 14px;
  border-radius: 8px;
  background: var(--el-fill-color-lighter);
}

.upload-progress-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.upload-progress-percent {
  font-weight: 600;
  color: var(--el-color-primary);
}
</style>
