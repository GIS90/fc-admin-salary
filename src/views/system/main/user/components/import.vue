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
      :draggable = "dgField.draggable"
      :overflow = "dgField.overflow"
      :center="dgField.center"
      :align-center="dgField.alignCenter"
      @close="closeDialog"
  >
    <!--header-->
    <template #header>
      <div class="my-dialog-header">
        <div class="my-dialog-header-title">{{ dgField.title }}</div>
        <div class="my-dialog-header-icon">
          <el-tooltip effect="dark" :content="fullViewText" placement="top">
            <el-icon @click="fullScreen" class="margin-right-15px">
              <FullScreen />
            </el-icon>
          </el-tooltip>
          <el-tooltip effect="dark" content="关闭" placement="top">
            <el-icon @click="closeDialog">
              <Close />
            </el-icon>
          </el-tooltip>
        </div>
      </div>
    </template>

    <!--body-->
    <div class="my-dialog-body">
      <!-- 步骤条 -->
      <el-steps :active="currentStep" align-center finish-status="success" style="margin-bottom: 30px;">
        <el-step title="选择文件" description="上传 Excel 文件" />
        <el-step title="预览数据" description="核对导入数据" />
        <el-step title="确认导入" description="执行导入操作" />
      </el-steps>
    </div>

    <!-- 内容区域 -->
    <div class="step-content">
      <ImportStepUpload v-show="currentStep === 0" ref="uploadRef" @file-selected="handleFileSelected"/>
      <ImportStepPreview v-show="currentStep === 1" ref="previewRef" :preview-data="previewData" :loading="previewLoading"/>
      <ImportStepConfirm v-show="currentStep === 2" ref="confirmRef" :import-data="importData" :loading="importLoading" @confirm="handleConfirmImport"/>
    </div>

    <!--footer-->
    <template #footer>
      <div class="my-dialog-footer">
        <el-button :disabled="btnDisabled" @click="closeDialog">取 消</el-button>
        <el-button v-if="currentStep > 0" :disabled="btnDisabled" @click="prevStep">上一步</el-button>
        <el-button v-if="currentStep < 2" type="primary" :loading="btnLoading" :disabled="btnDisabled" @click="nextStep">
          {{ currentStep === 0 ? '下一步' : '预览数据' }}
        </el-button>
        <el-button v-if="currentStep === 2" type="primary" :loading="btnLoading" :disabled="btnDisabled" @click="handleConfirmImport">
          确认导入
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang='ts'>
import { ref, reactive, defineProps, defineEmits, watch, computed } from 'vue';
import { ElNotification} from 'element-plus';
import { dialogField } from "@/utils/attrs/field";
import ImportStepUpload from './importUpload.vue';
import ImportStepPreview from './importPreview.vue';
import ImportStepConfirm from './importConfirm.vue';
import {SysMainUserImportApi, SysMainUserImportPreviewApi} from "@/api/modules/systemMain";

const dgConfigField = reactive({
  title: '批量导入',
  top: '3%',
  width: '75%'
});
const dgField = {...dialogField, ...dgConfigField}; // DIALOG属性
const fullView = ref(dgField.fullScreen); // 全屏控制
const fullViewText = ref('全屏');
const emit = defineEmits(["update:visible", "reFetchTableData"]);
const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
    default: false
  }
});
// ===== 状态管理 =====
const currentStep = ref(0); // 当前状态
const previewData = ref<any[]>([]) // 预览数据
const importData = ref<any[]>([]) // 导入数据
const previewLoading = ref(false) // 预览加载中
const importLoading = ref(false) // 导入加载中
const btnDisabled = ref(false); // 按钮禁用
const btnLoading = ref(false); // 按钮加载
const uploadedFile = ref<File | null>(null) // 上传的文件
const uploadRef = ref();
const previewRef = ref();

// 全屏Text侦听器
watch(fullView, (value) => {
  fullViewText.value = value ? '取消全屏' : '全屏';
}, { immediate: true });

const initData = () => {
  previewData.value = [];
  importData.value = [];
  uploadedFile.value = null;
  if (uploadRef.value) {
    uploadRef.value.clearFiles()
  };
};

// 关闭
function closeDialog() {
  currentStep.value = 0;
  initData();
  emit('update:visible', false);
};

// 全屏
function fullScreen() {
  fullView.value = !fullView.value;
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//              ↑Dialog通用配置         ↓定制化方法
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// ************* 步骤控制 *************
const nextStep = async () => {
  if (currentStep.value === 0) {
    // 第一步 → 第二步：预览数据
    await handlePreview();
  } else if (currentStep.value === 1) {
    // 第二步 → 第三步：进入确认
    currentStep.value = 2;
    importData.value = previewData.value;
  }
};
const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
  if (currentStep.value === 0) {
    initData();
  }
};

// >>>>> 第一步：选择文件
const handleFileSelected = (file: File) => {
  uploadedFile.value = file
};
// >>>>> 第二步：预览数据
const handlePreview = async () => {
  if (!uploadedFile.value) {
    ElNotification({
      title: "提示",
      message: "请选择需要导入的文件",
      type: "warning",
    });
    return
  }

  previewLoading.value = true;
  btnLoading.value = true;
  btnDisabled.value = true;
  try {
    const formData = new FormData();
    formData.append('file', uploadedFile.value);  // 单文件上传
    const res = await SysMainUserImportPreviewApi(formData);
    if (res.code === 100) {
      previewData.value = res.data || [];
      if (previewData.value.length === 0) {
        ElNotification({
          title: "提示",
          message: "上传的文件中未识别到数据，请确认附件是否包含有效数据",
          type: "warning",
        });
        return
      }
      currentStep.value = 1;
    }
  } finally {
    previewLoading.value = false;
    btnLoading.value = false;
    btnDisabled.value = false;
  }
};
// >>>>> 第三步：确认导入
const handleConfirmImport = async () => {
  if (importData.value.length === 0) {
    ElNotification({
      title: "提示",
      message: "未查询到有效导入数据，请退回到第一步重新操作",
      type: "warning",
    });
    return
  }
  if (previewRef.value.invalidCount > 0) {
    ElNotification({
      title: "提示",
      message: "存在未校验通过人员数据，请处理后重新上传",
      type: "warning",
    });
    return
  }

  importLoading.value = true;
  btnLoading.value = true;
  btnDisabled.value = true;
  try {
    const res = await SysMainUserImportApi(importData.value)
    if (res.code === 100) {
      ElNotification({
        title: '提示',
        message: `成功导入 ${res.data?.success || 0} 条数据，失败 ${res.data?.failed || 0} 条`,
        type: 'success'
      });
      closeDialog();
      emit('reFetchTableData', true);
    }
  } finally {
    importLoading.value = false
    btnLoading.value = false;
    btnDisabled.value = false;
  }
};
</script>

<style scoped>
.step-content {
  min-height: 300px;
  padding: 20px 3% 20px 3%;
}
</style>
