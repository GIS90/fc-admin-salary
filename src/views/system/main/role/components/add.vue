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
        <el-form-item label="角色ID" prop="engname">
          <el-input v-model.trim="ruleForm.engname"
                    :size="inputField.size"
                    :show-word-limit="inputField.showWordLimit"
                    :clearable="inputField.clearable"
                    :prefix-icon="inputField.prefixIcon"
                    :maxlength="ProfileLen.engname"
                    :placeholder="ProfilePlace.engname"
                    :disabled="btnDisabled"
          />
          <div class="el-form-item-msg">只允许包含大小写英文字母、数字、连字符(-)和点(.)（不能包含空格、标点等特殊字符），示例：tool-ALL</div>
        </el-form-item>
        <el-form-item label="名称" prop="chnname">
          <el-input v-model.trim="ruleForm.chnname"
                    :size="inputField.size"
                    :show-word-limit="inputField.showWordLimit"
                    :clearable="inputField.clearable"
                    :prefix-icon="inputField.prefixIcon"
                    :maxlength="ProfileLen.chnname"
                    :placeholder="ProfilePlace.chnname"
                    :disabled="btnDisabled"
          />
        </el-form-item>
        <el-form-item label="排序ID" prop="orderId">
          <el-input-number v-model="ruleForm.orderId" :min="1" controls-position="right" :disabled="btnDisabled" style="width: 100%;" />
          <div class="el-form-item-msg">数值越小排序越靠前，默认 1</div>
        </el-form-item>
        <el-form-item label="描述" prop="introduction">
          <el-input v-model="ruleForm.introduction"
                    :type="textAreaField.type"
                    :size="textAreaField.size"
                    :show-word-limit="textAreaField.showWordLimit"
                    :clearable="textAreaField.clearable"
                    :autosize="introductionSize"
                    :maxlength="ProfileLen.introduction"
                    :placeholder="ProfilePlace.introduction"
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
import { RoleModelDetail } from "@/models/systemModel";
import { SysMainRoleAddApi } from "@/api/modules/systemMain";
import { FormInstance, FormRules } from "element-plus";
import { ElNotification } from 'element-plus';
import { dialogField, inputField, textAreaField, formField } from "@/utils/attrs/field";
import publicLength from "@/utils/attrs/length";
import publicPlaceHolder from "@/utils/attrs/place";

// 数据组件属性值
const ProfileLen = publicLength.systemRoleModel;
const ProfilePlace = publicPlaceHolder.systemRoleModel;

const dgConfigField = reactive({
  title: '新增',
  width: '45%'
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
  engname: "",
  chnname: "",
  introduction: "",
  orderId: 1
}) as RoleModelDetail;
// from rule
const rules = reactive<FormRules<RoleModelDetail>>({
  engname: [
    { required: true, message: "角色ID不允许为空", trigger: 'blur' },
    { min: 1, max: ProfileLen.engname, message: '最大长度支持'+ProfileLen.engname+'位', trigger: 'blur' },
  ],
  chnname: [
    { required: true, message: "角色名称不允许为空", trigger: 'blur' },
    { min: 1, max: ProfileLen.chnname, message: '最大长度支持'+ProfileLen.chnname+'位', trigger: 'blur' },
  ],
  introduction: [
    { required: true, message: "角色描述不允许为空", trigger: 'blur' },
    { min: 1, max: ProfileLen.introduction, message: '最大长度支持'+ProfileLen.introduction+'位', trigger: 'blur' },
  ]
});

const resetForm = () => {
  ruleForm.engname = "";
  ruleForm.chnname = "";
  ruleForm.introduction = "";
};

// 确认
const confirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      btnDisabled.value = true;
      btnLoading.value = true;

      SysMainRoleAddApi(ruleForm).then(() => {
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
