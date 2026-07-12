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
          <el-input v-model.trim="ruleForm.key"
                    :size="inputField.size"
                    :show-word-limit="inputField.showWordLimit"
                    :clearable="inputField.clearable"
                    :prefix-icon="inputField.prefixIcon"
                    :maxlength="ProfileLen.key"
                    :placeholder="ProfilePlace.key"
                    :disabled="btnDisabled"
          />
          <div class="el-form-item-msg">只允许包含大写字母、数字和连字符(-)，请依据规则进行填写，示例：PARAMETER-NAME</div>
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
        <el-form-item label="参数值" prop="value">
          <el-input v-model="ruleForm.value"
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
          />
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
import { XtcsModelBase } from "@/models/systemModel";
import { SysConfigXtcsAddApi } from "@/api/modules/systemConfig";
import { FormInstance, FormRules } from "element-plus";
import { ElNotification } from 'element-plus';
import { dialogField, inputField, textAreaField, formField, inputNumberField } from "@/utils/attrs/field";
import publicLength from "@/utils/attrs/length";
import publicPlaceHolder from "@/utils/attrs/place";

// 数据组件属性值
const ProfileLen = publicLength.systemXtcsModel;
const ProfilePlace = publicPlaceHolder.systemXtcsModel;

const dgConfigField = reactive({
  title: '新增',
  // width: '45%'
});
const introductionSize = ref({minRows: 3, maxRows: 4});
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
  }
});

// 全屏Text侦听器
watch(fullView, (value) => {
  fullViewText.value = value ? '取消全屏' : '全屏';
}, { immediate: true });

// 关闭
function closeDialog() {
  emit('update:visible', false);
  resetForm(); // 对话框关闭时重置表单数据
};

// 全屏
function fullScreen() {
  fullView.value = !fullView.value;
};

// 打开
function openDialog() {
  // 重置验证
  ruleFormRef.value?.clearValidate();
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//              ↑Dialog通用配置         ↓定制化方法
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// 响应式数据
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  key: "",
  remark: "",
  value: "",
  orderId: undefined
}) as XtcsModelBase;
// from rule
const rules = reactive<FormRules<XtcsModelBase>>({
  key: [
    { required: true, message: "系统参数名称不允许为空", trigger: 'blur' },
    { min: 1, max: ProfileLen.key, message: '最大长度支持'+ProfileLen.key+'位', trigger: 'blur' },
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

const resetForm = () => {
  ruleForm.key = "";
  ruleForm.remark = "";
  ruleForm.value = "";
  ruleForm.orderId = undefined;
};

// 确认
const confirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      btnDisabled.value = true;
      btnLoading.value = true;

      SysConfigXtcsAddApi(ruleForm).then(() => {
        ElNotification({
          title: '提示',
          message: '新增成功',
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
</style>
