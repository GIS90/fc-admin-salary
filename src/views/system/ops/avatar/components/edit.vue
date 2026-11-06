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
        <el-form-item label="头像文件" prop="url">
          <el-upload
              class="avatar-uploader"
              drag
              :show-file-list="false"
              :before-upload="beforeUpload"
              :http-request="handleUpload"
              accept=".png,.jpg,.jpeg,.webp,.gif"
          >
            <div v-if="ruleForm.url" class="avatar-preview">
              <img :src="ruleForm.url" alt="头像预览" />
              <div class="avatar-preview-mask">{{ uploading ? '上传中...' : '点击重新上传' }}</div>
            </div>
            <div v-else class="avatar-upload-empty">
              <el-icon class="avatar-upload-icon"><UploadFilled /></el-icon>
              <div class="avatar-upload-text">{{ uploading ? '上传中...' : ProfilePlace.url }}</div>
              <div class="avatar-upload-tip">支持 PNG / JPG / WebP / GIF，大小不超过 5MB</div>
            </div>
          </el-upload>
          <div v-if="ruleForm.url" class="avatar-meta">
            尺寸：{{ ruleForm.width }} × {{ ruleForm.height }}
            <span class="avatar-meta-split">|</span>
            格式：{{ ruleForm.format || '-' }}
            <span class="avatar-meta-split">|</span>
            大小：{{ formatFileSize(ruleForm.size) }}
          </div>
        </el-form-item>
        <el-form-item label="头像名称" prop="name">
          <el-input v-model.trim="ruleForm.name" v-bind="inputField" :maxlength="ProfileLen.name" :placeholder="ProfilePlace.name" />
        </el-form-item>
        <el-form-item label="头像类型" prop="type">
          <el-select v-model="ruleForm.type" v-bind="selectSingleField" :placeholder="ProfilePlace.type" style="width: 100%;">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="头像标签" prop="tag">
          <el-input v-model.trim="ruleForm.tag" v-bind="inputField" :maxlength="ProfileLen.tag" :placeholder="ProfilePlace.tag" />
        </el-form-item>
        <el-form-item label="备注说明" prop="summary">
          <el-input v-model="ruleForm.summary" v-bind="textAreaField" :maxlength="ProfileLen.summary" :autosize="summarySize" :placeholder="ProfilePlace.summary" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="ruleForm.status">
            <el-radio :value="false">启用</el-radio>
            <el-radio :value="true">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>

    <!--footer-->
    <template #footer>
      <div class="my-dialog-footer">
        <el-button :disabled="btnDisabled" @click="closeDialog">取 消</el-button>
        <el-button :disabled="btnDisabled || uploading" :loading="btnLoading" type="primary" @click="confirm(ruleFormRef)">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang='ts'>
import { ref, reactive, defineProps, defineEmits, watch, onMounted } from 'vue';
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
const uploading = ref(false); // 图片上传中
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
  // 重置验证
  ruleFormRef.value?.clearValidate();
  // 请求数据
  fetchApiData(props.md5);
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//              ↑Dialog通用配置         ↓定制化方法
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// 头像类型选项
const typeOptions = ref<Array<{ label: string; value: string }>>([]);
onMounted(async () => {
  const response = await DictEnumOptionApi({ name: 'avatar-type' });
  if (response.data) {
    typeOptions.value = response.data as Array<{ label: string; value: string }>;
  }
});

// 响应式数据
const ruleFormRef = ref<FormInstance>();
const summarySize = ref({minRows: 3, maxRows: 5});
const ruleForm = reactive({}) as AvatarModelDetail;
// from rule
const rules = reactive<FormRules<AvatarModelDetail>>({
  url: [
    { required: true, message: "请上传头像图片", trigger: 'change' },
  ],
  name: [
    { required: true, message: "头像名称不允许为空", trigger: 'blur' },
    { min: 1, max: ProfileLen.name, message: '最大长度支持' + ProfileLen.name + '位', trigger: 'blur' },
  ],
  type: [
    { required: true, message: "请选择头像类型", trigger: 'change' },
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

// 上传前校验
const beforeUpload = (file: File) => {
  const allowTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
  if (!allowTypes.includes(file.type)) {
    ElMessage.error('仅支持 PNG / JPG / WebP / GIF 格式的图片');
    return false;
  }
  if (file.size > 5 * 1024 * 1024) {
    ElMessage.error('图片大小不能超过 5MB');
    return false;
  }
  return true;
};

// 读取图片尺寸
const getImageSize = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
      URL.revokeObjectURL(objectUrl);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('图片读取失败'));
    };
    image.src = objectUrl;
  });
};

// 文件格式
const getFileFormat = (fileName: string) => {
  const ext = fileName.split('.').pop();
  return ext ? ext.toUpperCase() : 'PNG';
};

// 文件大小
const formatFileSize = (bytes: number) => {
  if (!bytes || bytes <= 0) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
};

// 自定义上传
const handleUpload = async (options: any) => {
  const file: File = options.file;
  uploading.value = true;
  const sizePromise = getImageSize(file).catch(() => ({ width: 0, height: 0 }));
  try {
    const formData = new FormData();
    formData.append('upload_type', '100');
    formData.append('file', file);
    const response = await UploadFileApi(formData);
    const res = response as { data: { name: string; url: string } };
    const meta = await sizePromise;

    ruleForm.url = res.data.url;
    ruleForm.orUrl = res.data.url;
    if (!ruleForm.name) {
      ruleForm.name = file.name.replace(/\.[^.]+$/, '').slice(0, ProfileLen.name);
    }
    ruleForm.format = getFileFormat(file.name);
    ruleForm.size = file.size;
    ruleForm.width = meta.width;
    ruleForm.height = meta.height;
    ruleFormRef.value?.validateField('url');
    ElNotification({
      title: '提示',
      message: '图片上传成功',
      type: 'success'
    });
  } catch (e) {
    ElNotification({
      title: '提示',
      message: '图片上传失败',
      type: 'error'
    });
  } finally {
    uploading.value = false;
  }
};

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
.avatar-uploader {
  width: 100%;
}

.avatar-uploader :deep(.el-upload) {
  width: 100%;
}

.avatar-uploader :deep(.el-upload-dragger) {
  width: 100%;
  padding: 16px;
  border-radius: 8px;
}

.avatar-upload-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 110px;
  color: var(--el-text-color-secondary);
}

.avatar-upload-icon {
  font-size: 34px;
  color: var(--el-color-primary);
  margin-bottom: 8px;
}

.avatar-upload-text {
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.avatar-upload-tip {
  margin-top: 6px;
  font-size: 12px;
  color: var(--el-text-color-placeholder);
}

.avatar-preview {
  position: relative;
  display: inline-block;
  width: 110px;
  height: 110px;
  border-radius: 8px;
  overflow: hidden;
}

.avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.avatar-preview-mask {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 6px 0;
  font-size: 12px;
  color: #fff;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.55);
}

.avatar-meta {
  margin-top: 8px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.avatar-meta-split {
  margin: 0 8px;
  color: var(--el-border-color);
}
</style>
