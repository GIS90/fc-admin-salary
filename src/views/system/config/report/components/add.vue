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
        <el-form-item label="报表名称" prop="name">
          <el-input v-model.trim="ruleForm.name"
                    :size="inputField.size"
                    :show-word-limit="inputField.showWordLimit"
                    :clearable="inputField.clearable"
                    :prefix-icon="inputField.prefixIcon"
                    :maxlength="35"
                    placeholder="请输入报表名称"
                    :disabled="btnDisabled"
          />
        </el-form-item>
        <el-form-item label="数据库表名" prop="table">
          <el-input v-model.trim="ruleForm.table"
                    :size="inputField.size"
                    :show-word-limit="inputField.showWordLimit"
                    :clearable="inputField.clearable"
                    :prefix-icon="inputField.prefixIcon"
                    :maxlength="35"
                    placeholder="请输入数据库表名"
                    :disabled="btnDisabled"
          />
        </el-form-item>
        <el-form-item label="报表说明" prop="remark">
          <el-input v-model="ruleForm.remark"
                    :type="textAreaField.type"
                    :size="textAreaField.size"
                    :show-word-limit="textAreaField.showWordLimit"
                    :clearable="textAreaField.clearable"
                    :autosize="introductionSize"
                    :maxlength="100"
                    placeholder="请输入报表说明"
                    :disabled="btnDisabled"
          />
        </el-form-item>
        <el-form-item label="宽度模式" prop="mode">
          <el-radio-group v-model="ruleForm.mode" :disabled="btnDisabled">
            <el-radio :value="false">固定数值</el-radio>
            <el-radio :value="true">百分比（合计100%）</el-radio>
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
import { ReportModelBase } from "@/models/systemModel";
import { SysConfigReportAddApi } from "@/api/modules/systemConfig";
import { FormInstance, FormRules } from "element-plus";
import { ElNotification } from 'element-plus';
import { dialogField, inputField, textAreaField, formField } from "@/utils/attrs/field";

const dgConfigField = reactive({
  title: '新增报表',
});
const introductionSize = ref({minRows: 3, maxRows: 4});
const dgField = {...dialogField, ...dgConfigField};
const fullView = ref(dgField.fullScreen);
const fullViewText = ref('全屏');
const emit = defineEmits(['update:visible', 'reFetchTableData']);
const btnDisabled = ref(false);
const btnLoading = ref(false);
const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
    default: false
  }
});

watch(fullView, (value) => {
  fullViewText.value = value ? '取消全屏' : '全屏';
}, { immediate: true });

function closeDialog() {
  emit('update:visible', false);
  resetForm();
};

function fullScreen() {
  fullView.value = !fullView.value;
};

function openDialog() {
  ruleFormRef.value?.clearValidate();
};

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  name: "",
  table: "",
  remark: "",
  mode: false
}) as ReportModelBase;

const rules = reactive<FormRules<ReportModelBase>>({
  name: [
    { required: true, message: "报表名称不允许为空", trigger: 'blur' },
    { min: 1, max: 35, message: '最大长度支持35位', trigger: 'blur' },
  ],
  table: [
    { required: true, message: "数据库表名不允许为空", trigger: 'blur' },
    { min: 1, max: 35, message: '最大长度支持35位', trigger: 'blur' },
  ],
  remark: [
    { min: 1, max: 100, message: '最大长度支持100位', trigger: 'blur' },
  ]
});

const resetForm = () => {
  ruleForm.name = "";
  ruleForm.table = "";
  ruleForm.remark = "";
  ruleForm.mode = false;
};

const confirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      btnDisabled.value = true;
      btnLoading.value = true;

      SysConfigReportAddApi(ruleForm).then(() => {
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
