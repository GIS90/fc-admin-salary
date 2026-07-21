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
        <el-form-item label="字典分类标识" prop="name">
          <el-input v-model.trim="ruleForm.name"
                    :size="inputField.size"
                    disabled
          />
        </el-form-item>
        <el-form-item label="字典枚举标识" prop="key">
          <el-input v-model.trim="ruleForm.key"
                    :size="inputField.size"
                    :placeholder="ProfilePlace.key"
                    disabled
          />
          <div class="el-form-item-msg">数据字典枚举唯一标识，设定后不允许修改</div>
        </el-form-item>
        <el-form-item label="字典枚举名称" prop="value">
          <el-input v-model.trim="ruleForm.value"
                    :size="inputField.size"
                    :show-word-limit="inputField.showWordLimit"
                    :clearable="inputField.clearable"
                    :prefix-icon="inputField.prefixIcon"
                    :maxlength="ProfileLen.value"
                    :placeholder="ProfilePlace.value"
                    :disabled="btnDisabled"
          />
        </el-form-item>
        <el-form-item label="字典枚举描述" prop="remark">
          <el-input v-model="ruleForm.remark"
                    :type="textAreaField.type"
                    :size="textAreaField.size"
                    :show-word-limit="textAreaField.showWordLimit"
                    :clearable="textAreaField.clearable"
                    :autosize="introductionSize"
                    :maxlength="ProfileLen.remark"
                    :placeholder="ProfilePlace.remark"
                    :disabled="btnDisabled"
          />
        </el-form-item>
        <el-form-item label="顺序编号" prop="orderId">
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
import {DictEnumDetailModel, XtcsModelDetail} from "@/models/systemModel";
import {SysOpsDictEnumApi, SysOpsDictEnumUpdateApi} from "@/api/modules/systemConfig";
import { FormInstance, FormRules } from "element-plus";
import { ElNotification } from 'element-plus';
import { dialogField, inputField, formField, inputNumberField, selectSingleField, textAreaField } from "@/utils/attrs/field";
import publicLength from "@/utils/attrs/length";
import publicPlaceHolder from "@/utils/attrs/place";
import {OptionEnumModel} from "@/models/X";

// 数据组件属性值
const ProfileLen = publicLength.systemDictEnumModel;
const ProfilePlace = publicPlaceHolder.systemDictEnumModel;

const dgConfigField = reactive({
  title: '编辑',
  width: '55%'
});
const introductionSize = ref({minRows: 3, maxRows: 4});
const dgField = {...dialogField, ...dgConfigField}; // DIALOG属性
const fullView = ref(dgField.fullScreen); // 全屏控制
const fullViewText = ref('全屏');
const emit = defineEmits(['update:visible', 'reFetchTableData']);
const btnDisabled = ref(false); // 禁用
const btnLoading = ref(false); // 加载中

// 字典Key
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

// 响应式数据
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({}) as DictEnumDetailModel;

// from rule
const rules = reactive<FormRules<DictEnumDetailModel>>({
  // name: [
  //   { required: true, message: "数据字典分类不允许为空", trigger: 'change' },
  // ],
  // key: [
  //   { required: true, message: "数据字典枚举标识不允许为空", trigger: 'blur' },
  //   { min: 1, max: ProfileLen.key, message: '最大长度支持'+ProfileLen.key+'位', trigger: 'blur' },
  // ],
  value: [
    { required: true, message: "数据字典枚举名称不允许为空", trigger: 'blur' },
    { min: 1, max: ProfileLen.value, message: '最大长度支持'+ProfileLen.value+'位', trigger: 'blur' },
  ],
  orderId: [
    { required: true, message: "数据字典枚举排序编号不允许为空", trigger: 'blur' }
  ],
});


// 请求数据API
const fetchApiData = async (md5: string) => {
  const response = await SysOpsDictEnumApi({md5});
  if (response.data) {
    const res = response as { data: DictEnumDetailModel }; // declare
    Object.assign(ruleForm, res.data);
  }
};

// 确认
const confirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  // 赋值
  await formEl.validate((valid) => {
    if (valid) {
      btnDisabled.value = true;
      btnLoading.value = true;

      SysOpsDictEnumUpdateApi(ruleForm).then(() => {
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
</style>
