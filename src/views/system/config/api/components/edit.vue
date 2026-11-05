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
        <el-form-item label="Blueprint" prop="blueprint">
          <el-input v-model.trim="ruleForm.blueprint"
                    :size="inputField.size"
                    :show-word-limit="inputField.showWordLimit"
                    :clearable="inputField.clearable"
                    :maxlength="ProfileLen.blueprint"
                    :placeholder="ProfilePlace.blueprint"
                    :disabled="btnDisabled"
          />
        </el-form-item>
        <el-form-item label="方法名称" prop="apiname">
          <el-input v-model.trim="ruleForm.apiname"
                    :size="inputField.size"
                    :show-word-limit="inputField.showWordLimit"
                    :clearable="inputField.clearable"
                    :maxlength="ProfileLen.apiname"
                    :placeholder="ProfilePlace.apiname"
                    :disabled="btnDisabled"
          />
        </el-form-item>
        <el-form-item label="Endpoint" prop="endpoint">
          <el-input v-model.trim="ruleForm.endpoint"
                    :size="inputField.size"
                    disabled
          />
          <div class="el-form-item-msg">endpoint为接口唯一标识，不允许修改</div>
        </el-form-item>
        <el-form-item label="Path" prop="path">
          <el-input v-model.trim="ruleForm.path"
                    :size="inputField.size"
                    :show-word-limit="inputField.showWordLimit"
                    :clearable="inputField.clearable"
                    :maxlength="ProfileLen.path"
                    :placeholder="ProfilePlace.path"
                    :disabled="btnDisabled"
          />
        </el-form-item>
        <el-form-item label="请求方式" prop="method">
          <el-select v-model="ruleForm.method"
                     :size="selectSingleField.size"
                     :clearable="selectSingleField.clearable"
                     :filterable="selectSingleField.filterable"
                     :placeholder="ProfilePlace.method"
                     style="width: 100%;"
                     :disabled="btnDisabled">
            <el-option v-for="item in methodOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="简述" prop="short">
          <el-input v-model.trim="ruleForm.short"
                    :size="inputField.size"
                    :show-word-limit="inputField.showWordLimit"
                    :clearable="inputField.clearable"
                    :maxlength="ProfileLen.short"
                    :placeholder="ProfilePlace.short"
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
        <el-form-item label="详细描述" prop="long">
          <el-input v-model="ruleForm.long"
                    :type="textAreaField.type"
                    :size="textAreaField.size"
                    :show-word-limit="textAreaField.showWordLimit"
                    :clearable="textAreaField.clearable"
                    :autosize="longSize"
                    :maxlength="ProfileLen.long"
                    :placeholder="ProfilePlace.long"
                    :disabled="btnDisabled"
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
import { ApiModelDetail } from "@/models/systemModel";
import { SysConfigApiApi, SysConfigApiUpdateApi } from "@/api/modules/systemConfig";
import { FormInstance, FormRules } from "element-plus";
import { ElNotification } from 'element-plus';
import { dialogField, inputField, textAreaField, formField, inputNumberField, selectSingleField } from "@/utils/attrs/field";
import publicLength from "@/utils/attrs/length";
import publicPlaceHolder from "@/utils/attrs/place";

const methodOptions = [
  { label: "GET", value: "GET" },
  { label: "POST", value: "POST" },
  { label: "PUT", value: "PUT" },
  { label: "PATCH", value: "PATCH" },
  { label: "DELETE", value: "DELETE" },
];

const ProfileLen = publicLength.systemApiModel;
const ProfilePlace = publicPlaceHolder.systemApiModel;

const dgConfigField = reactive({
  title: '编辑',
  width: '50%'
});
const longSize = ref({minRows: 3, maxRows: 4});
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
const ruleForm = reactive({}) as ApiModelDetail;
// from rule
const rules = reactive<FormRules<ApiModelDetail>>({
  blueprint: [
    { required: true, message: "Blueprint不允许为空", trigger: 'blur' },
    { min: 1, max: ProfileLen.blueprint, message: '最大长度支持'+ProfileLen.blueprint+'位', trigger: 'blur' },
  ],
  apiname: [
    { required: true, message: "方法名称不允许为空", trigger: 'blur' },
    { min: 1, max: ProfileLen.apiname, message: '最大长度支持'+ProfileLen.apiname+'位', trigger: 'blur' },
  ],
  endpoint: [
    { required: true, message: "Endpoint不允许为空", trigger: 'blur' },
    { min: 1, max: ProfileLen.endpoint, message: '最大长度支持'+ProfileLen.endpoint+'位', trigger: 'blur' },
  ],
  path: [
    { required: true, message: "Path不允许为空", trigger: 'blur' },
    { min: 1, max: ProfileLen.path, message: '最大长度支持'+ProfileLen.path+'位', trigger: 'blur' },
  ],
  method: [
    { required: true, message: "请求方式不允许为空", trigger: 'change' },
  ]
});

// 请求数据API
const fetchApiData = async (md5: string) => {
  const response = await SysConfigApiApi({ md5 });
  if (response.data) {
    const res = response as { data: ApiModelDetail }; // declare
    Object.assign(ruleForm, res.data);
  }
};

// 确认
const confirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      btnDisabled.value = true;
      btnLoading.value = true;

      SysConfigApiUpdateApi(ruleForm).then(() => {
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
