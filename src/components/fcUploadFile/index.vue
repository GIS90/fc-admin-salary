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
      @open="handleOpen"
      @close="handleClose"
  >
    <!--dialog header-->
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
            <el-icon @click="handleClose">
              <Close />
            </el-icon>
          </el-tooltip>
        </div>
      </div>
    </template>

    <!--dialog body-->
    <div class="my-dialog-body"
         :class="[props.uploadType !== '100' ? 'dialog-content-center' : 'dialog-content-left']"
    >
      <el-upload
          ref="uploadRef"
          :accept="uploadAccept()"
          :file-list="fileList"
          :list-type="uploadListType()"
          :auto-upload="uploadAttrs.autoUpload"
          :limit="uploadAttrs.limit"
          :drag="uploadDrag()"
          :multiple="uploadAttrs.multiple"
          :disabled="uploadAttrs.disabled"
          :on-remove="uploadRemove"
          :on-change="uploadChange"
          :on-exceed="uploadExceed"
          :on-preview="handlePictureCardPreview"
      >
        <el-icon class="el-upload-icon"><UploadFilled /></el-icon>

        <template #tip>
          <!-- 文件类型 -->
          <div v-if="['1', '2', '3', '4'].includes(props.uploadType)" class="upload-remark">
            <div><em>拖拽或者点击上传</em></div>
            <!-- 提示说明 支持html显示-->
            <p v-html="getUploadTip()" />
            <p>上传文件数量： <strong style="color: red">{{ fileList.length }}</strong>（{{ uploadAttrs.limit>0 ? "单次上传限制" + uploadAttrs.limit : "无限制" }}）</p >
            <el-divider v-show="fileList.length > 0">
              <div style="display: flex; align-items: center; gap: 4px;">
                <el-icon><Menu /></el-icon>
                <span>文件列表</span>
              </div>
            </el-divider>
          </div>

          <!-- 图片类型 -->
          <div v-if="props.uploadType === '100'" class="upload-remark">
            <div>上传文件数量： <strong style="color: red">{{ fileList.length }}</strong></div>
            <el-alert type="warning" show-icon class="upload-remark-avatar-alert">
              <ol class="upload-remark-avatar-alert-ul">
                <li>仅支持<span class="info_red_weight">jpg/jpeg/png</span>格式文件上传，且每张图片大小建议不超过<span class="info_red_weight">2M</span>（2048KB）。</li>
                <li>单次上传最大限制数量<span class="info_red_weight">{{ uploadAttrs.limit }}</span>个。</li>
              </ol>
            </el-alert>
            <!-- 图片预览 -->
            <el-dialog v-model="dialogVisible" :z-index="1000">
              <img width="100%" :src="dialogImageUrl" alt="预览" />
            </el-dialog>
          </div>
        </template>
      </el-upload>
    </div>

    <!-- dialog footer -->
    <template #footer>
      <div class="my-dialog-footer">
        <el-checkbox v-model="uploadSuccessAutoClose" class="dialog-footer-auto-close" @change="changeAutoClose">是否上传成功后关闭</el-checkbox>
        <el-button v-show="fileList.length>0" :disabled="btnDisabled" @click="handleClear">
          清空
        </el-button>
        <el-button :disabled="btnDisabled" @click.prevent.stop="handleClose">
          取消
        </el-button>
        <el-button type="primary" :disabled="btnDisabled" :loading="btnLoading" @click="submitUpload">
          上传
        </el-button>
      </div>
    </template>

  </el-dialog>
</template>

<script setup lang='ts'>
import { ref, reactive, defineProps, defineEmits, watch, onMounted } from 'vue';
import { ElNotification } from 'element-plus';
import { dialogField } from "@/utils/attrs/field";
import { useAuthStore } from "@/store/modules/auth";
import { SysConfigXtcsKeyApi } from "@/api/modules/systemConfig";
import { XtcsModelDetail } from "@/models/systemModel";
import { UploadFilesApi} from "@/api/modules/common";
const store = useAuthStore();

const uploadRef = ref(null);
const emit = defineEmits(['update:visible', 'reFetchTableData']);
const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
    default: false
  },
  uploadDialogTitle: {
    type: String,
    required: false,
    default: "文件上传"
  },
  // --------------------------------------------------- //
  // 上传文件类型[依据功能定制化]：                           //
  //     1：工具->文档工具->表格合并                         //
  //     2：工具->文档工具->表格拆分                         //
  //     3：工具->文档工具->PDF转WORD                       //
  //     4：工资->消息通知->钉钉绩效                         //
  //     100：系统维护->头像管理                            //
  // --------------------------------------------------- //
  uploadType: {
    type: String,
    required: true,
    default: "1"
  }
})

const dgConfigField = reactive({
  title: props.uploadDialogTitle,
  width: props.uploadType === "100" ? "75%" : "55%"
});
const dgField = {...dialogField, ...dgConfigField}; // DIALOG属性
const fullView = ref(dgField.fullScreen); // 全屏控制
const fullViewText = ref('全屏');
const btnDisabled = ref(false); // 禁用
const btnLoading = ref(false); // 加载中
const fileList = ref([]);  // 文件列表
const uploadSuccessAutoClose = ref(true);  // 上传成功后是否自动关闭
const dialogImageUrl = ref(''); // 当前选择的图片URL
const dialogVisible = ref(false); // 是否显示当前选择图片

// 全屏Text侦听器
watch(fullView, (value) => {
  fullViewText.value = value ? "取消全屏" : "全屏";
}, { immediate: true });

// 全屏
function fullScreen() {
  fullView.value = !fullView.value;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//              ↑Dialog通用配置         ↓定制化方法
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const uploadAttrs = reactive({
  multiple: true, // 是否支持多选文件
  autoUpload: false, // 是否自动上传文件
  limit: parseInt(import.meta.env.VITE_VUE_APP_UPLOAD_FILES_LIMIT ?? 20), // 允许上传文件的最大数量, 0无限制
  disabled: false
});

// upload tip内容，支持html
const getUploadTip = () => {
  if (["1", "2", "4"].includes(props.uploadType)) {
    return '<strong>提示</strong>：支持<span class="info_red_weight">.xls</span>、<span class="info_red_weight">.xlsx</span>格式文件上传，.xls格式文件条数最大支持为<strong>65535</strong>行，超出请上传.xlxs格式数据。'
  } else if (props.uploadType === "3") {
    return '<strong>提示</strong>：仅支持<span class="info_red_weight">.pdf</span>格式文件上传。'
  }  else {
    return '<strong>暂无其他说明</strong>'
  }
};

// 上传文件的类型
const uploadAccept = () => {
  if (['1', '2', '4'].includes(props.uploadType)) {
    return '.xls,.xlsx'
  }  else if (props.uploadType === '3') {
    return '.pdf'
  } else if (props.uploadType === '100') {
    return '.jpg,.jpeg,.png'
  } else {
    return ''
  }
};

// 是否启用拖拽上传
const uploadDrag = () => {
  return props.uploadType !== "100";
};

// 文件列表的类型 "text" | "picture" | "picture-card"
const uploadListType = () => {
  if (["1", "2", "3", "4"].includes(props.uploadType)) {
    return "text"
  } else if (props.uploadType === "100") {
    return "picture-card"
  } else {
    return "text"
  }
};

// 手动清空文件
const handleClose = () => {
  fileList.value = [];
  uploadRef.value?.clearFiles();
  emit('update:visible', false);
};

const handleOpen = () => {
  // 文件列表
  fileList.value = [];
  // localStore读取设置是否上传成功后自动关闭
  uploadSuccessAutoClose.value = localStorage.getItem('uploadSuccessAutoClose') === "true";
};

onMounted(() => {
  fetchApiData();
});

// 请求数据API
const fetchApiData = async () => {
  const response = await SysConfigXtcsKeyApi({ "key": "UPLOAD-FILE-MAX" });
  if (response.data) {
    const res = response as { data: XtcsModelDetail }; // declare
    uploadAttrs.limit = Number(res.data.value);
  }
};

// 手动清空上传文件
const handleClear = () => {
  fileList.value = []
  uploadRef.value?.clearFiles();
};

// 取消上传
const cancelUpload = () => {
  uploadRef.value?.abort()
};

// 文件上传超过限制的hook
const uploadExceed = (files, UploadFiles) => {
  ElNotification({
    title: "提示",
    message: "文件数量超过上传最大限制",
    type: "warning",
    duration: 2 * 1000
  });
};

// 文件移除列表成功的hook
const uploadRemove = (uploadFile, uploadFiles) => {
  fileList.value = uploadFiles;
  ElNotification({
    title: "提示",
    message: uploadFile?.name ? uploadFile.name + '移除列表成功' : '文件移除列表成功',
    type: "success",
    duration: 2 * 1000
  });
};

// 文件上个数发生改变的hook
const uploadChange = (uploadFile, uploadFiles) => {
  fileList.value = uploadFiles
};

// 只有图片类型支持预览
const handlePictureCardPreview= (file) => {
  if (props.uploadType === "100") {
    dialogImageUrl.value = file.url;
    dialogVisible.value = true;
  }
};

// 手动上传的hook
const submitUpload = () => {
  // 无上传文件
  if (fileList.value.length < 1) {
    ElNotification({
      title: "提示",
      message: "请选择需要上传的文件",
      type: "warning",
      duration: 2 * 1000
    });
    return false
  }
  // 超过文件上传限制
  if (uploadAttrs.limit > 0 && fileList.value.length > uploadAttrs.limit) {
    ElNotification({
      title: "提示",
      message: "文件数量超过上传最大限制",
      type: "warning",
      duration: 2 * 1000
    });
    return false
  }

  // 更改状态
  uploadAttrs.disabled = true;
  btnDisabled.value = true;
  btnLoading.value = true;

  // data form parameters
  const uploadForm = new FormData();
  uploadForm.append("upload_type", props.uploadType)
  fileList.value.forEach(file => {
    uploadForm.append("files", file.raw)
    // uploadForm.append(file.name, file.raw)
  });
  return new Promise((resolve, reject) => {
    UploadFilesApi(uploadForm).then(response => {
      const { code, message } = response;
      if (code === 100) {
        ElNotification({
          title: "提示",
          message: '文件上传成功' || message,
          type: "success"
        });
        handleClear();
      }
      resolve(response);

      // 成功上传后设置自动关闭
      if (code === 100 && uploadSuccessAutoClose.value) {
        // 延迟
        setTimeout(() => {
          emit("update:visible", false); // 关闭
          emit("reFetchTableData", true); // 刷新数据
        }, 2000)
      }
    }).catch(error => {
      reject(error)
    }).finally(() => {
      uploadAttrs.disabled = false;
      btnDisabled.value = false;
      btnLoading.value = false;
    })
  })
};

const changeAutoClose= (value: boolean) => {
  uploadSuccessAutoClose.value = value;
  localStorage.setItem('uploadSuccessAutoClose', String(value));
};
</script>

<style scoped>
.dialog-footer-auto-close {
  margin-right: 20px;
}

.dialog-content-center{
  text-align: center;
}

.dialog-content-left{
  text-align: left;
}

.upload-remark {
  font-size: 16px !important;
  margin-top: 25px;
}

.upload-remark-avatar-alert{
  margin-top: 25px;
}

.upload-remark-avatar-alert-ul {
  padding-left: 32px;
  list-style-type: upper-roman;

  li {
    margin-top: 10px;
    font-size: 15px;
    color: black;
    line-height: 1.5;
  }
}

.el-upload-icon {
  font-size: 70px;
}
</style>

