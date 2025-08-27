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
        <el-form-item label="字典类别标识" prop="key">
          <el-input v-model.trim="ruleForm.key"
                    :size="inputField.size"
                    :show-word-limit="inputField.showWordLimit"
                    :clearable="inputField.clearable"
                    :prefix-icon="inputField.prefixIcon"
                    :maxlength="ProfileLen.key"
                    :placeholder="ProfilePlace.key"
                    :disabled="btnDisabled"
          />
          <div class="el-form-item-msg">字典类别唯一标识，设定后不允许修改</div>
        </el-form-item>
        <el-form-item label="字典类别名称" prop="remark">
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
        <el-form-item label="顺序编号" prop="order_id">
          <el-input-number v-model="ruleForm.order_id"
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
import { DictKeyBaseModel } from "@/models/systemModel";
import { SysOpsDictKeyAddApi } from "@/api/modules/system";
import { FormInstance, FormRules } from "element-plus";
import { ElNotification } from 'element-plus';
import { dialogField, inputField, formField, inputNumberField } from "@/utils/attrs/field";
import publicLength from "@/utils/attrs/length";
import publicPlaceHolder from "@/utils/attrs/place";

// 数据组件属性值
const ProfileLen = publicLength.systemDictKeyModel;
const ProfilePlace = publicPlaceHolder.systemDictKeyModel;

const dgConfigField = reactive({
  title: '新增',
  width: '45%'
});
const dgField = {...dialogField, ...dgConfigField}; // DIALOG属性
const fullView = ref(dgField.fullScreen); // 全屏控制
const fullViewText = ref('全屏');
const emit = defineEmits(['update:visible', 'reFetchTreeData']);
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
  order_id: 1
}) as DictKeyBaseModel;
// from rule
const rules = reactive<FormRules<DictKeyBaseModel>>({
  key: [
    { required: true, message: "字典分类标识不允许为空", trigger: 'blur' },
    { min: 1, max: ProfileLen.key, message: '最大长度支持'+ProfileLen.key+'位', trigger: 'blur' },
  ],
  remark: [
    { required: true, message: "字典分类名称不允许为空", trigger: 'blur' },
    { min: 1, max: ProfileLen.remark, message: '最大长度支持'+ProfileLen.remark+'位', trigger: 'blur' },
  ]
});

const resetForm = () => {
  ruleForm.key = "";
  ruleForm.remark = "";
  ruleForm.order_id = 1;
};

// 确认
const confirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      btnDisabled.value = true;
      btnLoading.value = true;

      SysOpsDictKeyAddApi(ruleForm).then(() => {
        ElNotification({
          title: '提示',
          message: '新增成功',
          type: 'success'
        });
        closeDialog();
        emit('reFetchTreeData', true);
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
