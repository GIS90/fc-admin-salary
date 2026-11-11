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
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" v-bind="formField">
        <el-form-item label="图片文件" prop="url">
          <fc-upload-img
              v-model:imageUrl="ruleForm.url"
              :requestApi="uploadAvatarImg"
              width="110px"
              height="110px"
              :fileSize="5"
              :fileType="['image/png','image/jpeg','image/webp','image/gif']">
            <template #tip>支持 PNG / JPG / WebP / GIF，大小不超过 5MB</template>
          </fc-upload-img>
          <div v-if="ruleForm.url" class="avatar-meta">
            尺寸：{{ ruleForm.width }} × {{ ruleForm.height }}
            <span class="avatar-meta-split">|</span>
            格式：{{ ruleForm.format || '-' }}
            <span class="avatar-meta-split">|</span>
            大小：{{ formatFileSize(ruleForm.size) }}
          </div>
        </el-form-item>
        <el-form-item label="图片名称" prop="name">
          <el-input v-model.trim="ruleForm.name" v-bind="inputField" :maxlength="ProfileLen.name" :placeholder="ProfilePlace.name" />
        </el-form-item>
        <el-form-item label="图片类型" prop="type">
          <el-select v-model="ruleForm.type" v-bind="selectSingleField" :placeholder="ProfilePlace.type" style="width: 100%;">
           <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
              <span class="el-select-key">{{ item.label }}</span>
              <span class="el-select-value">{{ item.value }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图片标签" prop="tag">
          <el-input v-model.trim="ruleForm.tag" v-bind="inputField" :maxlength="ProfileLen.tag" :placeholder="ProfilePlace.tag" />
        </el-form-item>
        <el-form-item label="备注说明" prop="summary">
          <el-input v-model="ruleForm.summary" v-bind="textAreaField" :maxlength="ProfileLen.summary" :autosize="summarySize" :placeholder="ProfilePlace.summary" />
        </el-form-item>
        <el-form-item label="状态" prop="lock">
          <el-radio-group v-model="ruleForm.lock">
            <el-radio :value="false">启用</el-radio>
            <el-radio :value="true">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>

    <!--footer-->
    <template #footer>
      <div class="my-dialog-footer">
        <el-button :disabled="btnDisabled" @click="closeDialog">取 消</el-button>
        <el-button :disabled="btnDisabled" :loading="btnLoading" type="primary" @click="confirm(ruleFormRef)">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang='ts'>
import { ref, reactive, defineProps, defineEmits, watch } from 'vue';
import { AvatarModelDetail } from "@/models/systemModel";
import { SysOpsAvatarApi, SysOpsAvatarUpdateApi } from "@/api/modules/systemOps";
import { UploadFileApi, DictEnumOptionApi } from "@/api/modules/common";
import { FormInstance, FormRules } from "element-plus";
import { ElNotification, ElMessage } from 'element-plus';
import { dialogField, inputField, textAreaField, formField, selectSingleField } from "@/utils/attrs/field";
import publicLength from "@/utils/attrs/length";
import publicPlaceHolder from "@/utils/attrs/place";

// 数据组件属性值
const ProfileLen = publicLength.systemAvatarModel;
const ProfilePlace = publicPlaceHolder.systemAvatarModel;

const dgConfigField = reactive({
  title: '编辑',
  width: '45%'
});
const dgField = {...dialogField, ...dgConfigField}; // DIALOG属性
const fullView = ref(dgField.fullScreen); // 全屏控制
const fullViewText = ref('全屏');
const emit = defineEmits(['update:visible', 'reFetchTableData']);
const btnDisabled = ref(false); // 禁用
const btnLoading = ref(false); // 加载中
const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
    default: false
  },
  md5: {
    type: String,
    required: true,
    default: ''
  }
});

// 全屏Text侦听器
watch(fullView, (value) => {
  fullViewText.value = value ? '取消全屏' : '全屏';
}, { immediate: true });

// 关闭
function closeDialog() {
  emit('update:visible', false);
};

// 全屏
function fullScreen() {
  fullView.value = !fullView.value;
};

// 打开
function openDialog() {
  fetchTypeOptions();
  // 重置验证
  ruleFormRef.value?.clearValidate();
  // 请求数据
  fetchApiData(props.md5);
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//              ↑Dialog通用配置         ↓定制化方法
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// 图片类型选项（打开弹窗时才加载，避免多个弹窗同时发起相同请求被 axios 取消）
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
    // 请求被取消或失败时允许下次打开重试
    typeOptionsLoaded.value = false;
    if (e?.code !== 'ERR_CANCELED') {
      ElMessage.warning('图片类型加载失败，请重新打开弹窗');
    }
  }
};

// 响应式数据
const ruleFormRef = ref<FormInstance>();
const summarySize = ref({minRows: 3, maxRows: 5});
const ruleForm = reactive({}) as AvatarModelDetail;
// from rule
const rules = reactive<FormRules<AvatarModelDetail>>({
  url: [
    { required: true, message: "请上传图片图片", trigger: 'change' },
  ],
  name: [
    { required: true, message: "图片名称不允许为空", trigger: 'blur' },
    { min: 1, max: ProfileLen.name, message: '最大长度支持' + ProfileLen.name + '位', trigger: 'blur' },
  ],
  type: [
    { required: true, message: "请选择图片类型", trigger: 'change' },
    { max: ProfileLen.type, message: '最大长度支持' + ProfileLen.type + '位', trigger: 'change' },
  ],
  tag: [
    { max: ProfileLen.tag, message: '最大长度支持' + ProfileLen.tag + '位', trigger: 'blur' },
  ],
  summary: [
    { max: ProfileLen.summary, message: '最大长度支持' + ProfileLen.summary + '位', trigger: 'blur' },
  ]
});

// 请求数据API
const fetchApiData = async (md5: string) => {
  const response = await SysOpsAvatarApi({ md5 });
  if (response.data) {
    const res = response as { data: AvatarModelDetail }; // declare
    Object.assign(ruleForm, res.data);
  }
};

// 读取图片尺寸（按URL）
const getImageSizeByUrl = (url: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
    image.onerror = () => reject(new Error('图片读取失败'));
    image.src = url;
  });
};

// 文件格式
const getFileFormat = (fileName: string) => {
  const ext = fileName.split('?')[0].split('.').pop();
  return ext ? ext.toUpperCase() : 'PNG';
};

// 文件大小
const formatFileSize = (bytes: number) => {
  if (!bytes || bytes <= 0) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
};

// 单张图片上传（fc-upload-img 要求 requestApi 返回 { data: url } 结构）
const uploadAvatarImg = async (formData: FormData) => {
  formData.append('upload_type', '100');
  const response = await UploadFileApi(formData);
  const res = response as { data: { name: string; url: string } };
  return { data: res.data?.url || '' };
};

// 图片地址变化后回填图片元数据
watch(() => ruleForm.url, async (url) => {
  if (!url) return;
  ruleForm.orUrl = url;
  ruleForm.format = getFileFormat(url);
  const meta = await getImageSizeByUrl(url).catch(() => ({ width: 0, height: 0 }));
  ruleForm.width = meta.width;
  ruleForm.height = meta.height;
  try {
    const blob = await fetch(url).then(r => r.blob());
    ruleForm.size = blob.size;
  } catch {
    ruleForm.size = 0;
  }
});

// 确认
const confirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      btnDisabled.value = true;
      btnLoading.value = true;

      SysOpsAvatarUpdateApi(ruleForm).then(() => {
        ElNotification({
          title: '提示',
          message: '编辑成功',
          type: 'success'
        });
        closeDialog();
        emit('reFetchTableData', true);
      }).finally(() => {
        btnDisabled.value = false;
        btnLoading.value = false;
      })
    }
  })
};
</script>

<style scoped>
.avatar-meta {
  margin-top: 8px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.avatar-meta-split {
  margin: 0 8px;
  color: var(--el-border-color);
}

/* 修复 fc-upload-img 鼠标悬停时边框消失问题 */
:deep(.el-upload) {
  &:hover {
    border: 1px dashed var(--el-color-primary) !important;
  }
  &:hover .el-upload-dragger {
    border: 1px dashed var(--el-color-primary) !important;
  }
}
:deep(.el-upload-dragger) {
  &:hover {
    border: 1px dashed var(--el-color-primary) !important;
  }
}
</style>
