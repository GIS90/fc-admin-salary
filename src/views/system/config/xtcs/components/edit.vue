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
      @open="openDialog"
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
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules"
               :label-position="formField.labelPosition" :label-width="formField.labelWidth"
               :size="formField.size" style="width: 100%" >
        <el-form-item label="参数名称" prop="key">
          <el-input v-model.trim="ruleForm.key" :size="inputField.size" disabled/>
          <div class="el-form-item-msg">系统参数唯一标识，不允许修改</div>
        </el-form-item>
        <el-form-item label="参数说明" prop="remark">
          <el-input v-model.trim="ruleForm.remark"
                    :size="inputField.size"
                    :show-word-limit="inputField.showWordLimit"
                    :clearable="inputField.clearable"
                    :prefix-icon="inputField.prefixIcon"
                    :maxlength="ProfileLen.remark"
                    :placeholder="ProfilePlace.remark"
                    :disabled="btnDisabled"
          />
        </el-form-item>
        <el-form-item label="参数类型" prop="type">
          <el-select v-model="ruleForm.type" :size="selectSingleField.size"
                     :placeholder="ProfilePlace.type" style="width: 100%;" :disabled="btnDisabled || uploading">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled" />
          </el-select>
          <div class="el-form-item-msg">参数类型为「文件」时，参数值需上传文件，保存云存储地址</div>
        </el-form-item>
        <el-form-item label="参数值" prop="value">
          <template v-if="ruleForm.type === 'FILE'">
            <el-upload :show-file-list="false" :http-request="uploadHandle" :disabled="btnDisabled || uploading">
              <el-button :size="buttonField.size" :loading="uploading" :disabled="btnDisabled">{{ ruleForm.value ? '重新上传' : '选择文件上传' }}</el-button>
            </el-upload>
            <div v-if="ruleForm.value" class="file-value">
              <a :href="ruleForm.value" target="_blank">{{ ruleForm.value }}</a>
              <el-button link type="danger" :disabled="btnDisabled || uploading" @click="ruleForm.value = ''">移除</el-button>
            </div>
            <div class="el-form-item-msg">上传成功后自动填充云存储文件地址</div>
          </template>
          <el-input v-else v-model="ruleForm.value"
                    :type="textAreaField.type"
                    :size="textAreaField.size"
                    :show-word-limit="textAreaField.showWordLimit"
                    :clearable="textAreaField.clearable"
                    :autosize="introductionSize"
                    :maxlength="ProfileLen.value"
                    :placeholder="ProfilePlace.value"
                    :disabled="btnDisabled"
          />
        </el-form-item>
        <el-form-item label="排序编号" prop="orderId">
          <el-input-number v-model="ruleForm.orderId"
                           style="width: 100%;"
                           :min="inputNumberField.min"
                           :max="inputNumberField.max"
                           :step="inputNumberField.step"
                           :step-strictly="inputNumberField.stepStrictly"
                           :precision="inputNumberField.precision"
                           :size="inputNumberField.size"
                           :controls="inputNumberField.controls"
                           :controls-position="inputNumberField.controlsPosition"
                           :disabled="btnDisabled"
          />
          <div class="el-form-item-msg">
            数值越小排序越靠前，默认 1，最大值为{{ inputNumberField.max.toLocaleString() }}
          </div>
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
import { XtcsModelDetail} from "@/models/systemModel";
import { SysConfigXtcsApi, SysConfigXtcsUpdateApi } from "@/api/modules/systemConfig";
import { FormInstance, FormRules } from "element-plus";
import { ElMessage, ElNotification } from 'element-plus';
import { dialogField, inputField, textAreaField, formField, inputNumberField, selectSingleField, buttonField } from "@/utils/attrs/field";
import { UploadFileApi, DictEnumOptionApi } from "@/api/modules/common";
import publicLength from "@/utils/attrs/length";
import publicPlaceHolder from "@/utils/attrs/place";

// 数据组件属性值
const ProfileLen = publicLength.systemXtcsModel;
const ProfilePlace = publicPlaceHolder.systemXtcsModel;

const dgConfigField = reactive({
  title: '编辑',
  // width: '45%'
});
const dgField = {...dialogField, ...dgConfigField}; // DIALOG属性
const introductionSize = ref({minRows: 3, maxRows: 4});
const fullView = ref(dgField.fullScreen); // 全屏控制
const fullViewText = ref('全屏');
const emit = defineEmits(['update:visible', 'reFetchTableData']);
const btnDisabled = ref(false); // 禁用
const btnLoading = ref(false); // 加载中
const uploading = ref(false); // 文件上传中
const typeOptions = ref<Array<{ label: string; value: string; disabled?: boolean }>>([]); // 参数类型枚举
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

// 参数类型枚举（xtcs-type）
const fetchTypeOptions = async () => {
  if (typeOptions.value.length > 0) return;
  const response = await DictEnumOptionApi({ name: 'xtcs-type' });
  if (response.data) {
    typeOptions.value = response.data as Array<{ label: string; value: string; disabled?: boolean }>;
  }
};

// 文件类型参数值：上传文件到云存储，回填云存储地址
const uploadHandle = async (options: any) => {
  const file = options?.file;
  if (!file) return;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_type', '6');
  uploading.value = true;
  try {
    const response = await UploadFileApi(formData);
    const url = (response as { data: { url: string } })?.data?.url || '';
    if (!url) {
      ElMessage.warning('文件上传失败，请重新上传');
      options.onError?.(new Error('upload failed'));
      return;
    }
    ruleForm.value = url;
    options.onSuccess?.({ url }, file);
  } catch (e) {
    options.onError?.(e);
  } finally {
    uploading.value = false;
  }
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//              ↑Dialog通用配置         ↓定制化方法
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// 响应式数据
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  key: "",
  type: "",
  remark: "",
  value: "",
  orderId: undefined
}) as XtcsModelDetail;
// from rule
const rules = reactive<FormRules<XtcsModelDetail>>({
  key: [
    { required: true, message: "系统参数名称不允许为空", trigger: 'blur' },
    { min: 1, max: ProfileLen.key, message: '最大长度支持'+ProfileLen.key+'位', trigger: 'blur' },
  ],
  type: [
    { required: true, message: "系统参数类型不允许为空", trigger: 'change' }
  ],
  remark: [
    { required: true, message: "系统参数说明不允许为空", trigger: 'blur' },
    { min: 1, max: ProfileLen.remark, message: '最大长度支持'+ProfileLen.remark+'位', trigger: 'blur' },
  ],
  value: [
    { required: true, message: "系统参数值不允许为空", trigger: 'blur' },
    { min: 1, max: ProfileLen.value, message: '最大长度支持'+ProfileLen.value+'位', trigger: 'blur' },
  ],
  orderId: [
    { required: true, message: "系统参数排序编号不允许为空", trigger: 'blur' }
  ],
});

// 请求数据API
const fetchApiData = async (md5: string) => {
  const response = await SysConfigXtcsApi({ md5 });
  if (response.data) {
    const res = response as { data: XtcsModelDetail }; // declare
    Object.assign(ruleForm, res.data);
    // 历史数据未设置参数类型时，默认按「值」处理
    if (!ruleForm.type) ruleForm.type = "VALUE";
  }
};

// 确认
const confirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      btnDisabled.value = true;
      btnLoading.value = true;

      SysConfigXtcsUpdateApi(ruleForm).then(() => {
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
.file-value {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  word-break: break-all;
}
</style>
