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
        <el-divider content-position="left">上级部门信息</el-divider>
        <el-form-item label="上级ID">
          <el-input v-model.trim="pNode.id" :size="inputField.size" disabled />
        </el-form-item>
        <el-form-item label="上级路径">
          <el-input v-model.trim="pNode.dept_path" :size="inputField.size" disabled/>
        </el-form-item>

        <el-divider content-position="left">新部门信息</el-divider>
        <el-form-item label="部门名称" prop="label">
          <el-input v-model.trim="ruleForm.label"
                    :size="inputField.size"
                    :show-word-limit="inputField.showWordLimit"
                    :clearable="inputField.clearable"
                    :prefix-icon="inputField.prefixIcon"
                    :maxlength="lmodelLen.label"
                    :placeholder="lmodelPlace.label"
                    :disabled="btnDisabled"
          />
        </el-form-item>
        <el-form-item label="部门描述" prop="description">
          <el-input v-model="ruleForm.description"
                    :type="textAreaField.type"
                    :size="textAreaField.size"
                    :show-word-limit="textAreaField.showWordLimit"
                    :clearable="textAreaField.clearable"
                    :autosize="introductionSize"
                    :maxlength="lmodelLen.description"
                    :placeholder="lmodelPlace.description"
                    :disabled="btnDisabled"
          />
        </el-form-item>
        <el-form-item label="管理员" prop="manage_rtx">
          <el-select v-model="ruleForm.manage_rtx" style="width: 100%;" :size="selectMultiField.size" :clearable="selectMultiField.clearable"
                     :filterable="selectMultiField.filterable" :allow-create="selectMultiField.allowCreate"
                     :no-match-text="selectMultiField.noMatchText" :no-data-text="selectMultiField.noDataText"
                     :multiple="selectMultiField.multiple" :multiple-limit="selectMultiField.limit" :collapse-tags="selectMultiField.collapseTags"
                     :max-collapse-tags="selectMultiField.maxCollapseTags" :collapse-tags-tooltip="selectMultiField.collapseTagsTooltip"
                     :placeholder="lmodelPlace.manage_rtx" :disabled="btnDisabled">
            <el-option v-for="item in userOption" :key="item.value" :label="item.label" :value="item.value">
              <span class="el-select-key">{{ item.label }}</span>
              <span class="el-select-value">{{ item.value }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="ruleForm.disabled" :disabled="btnDisabled">
            <el-radio :value="false">启用</el-radio>
            <el-radio :value="true">禁用</el-radio>
          </el-radio-group>
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
import {DepartmentNode} from "@/models/systemModel";
import {SysOpsDepartAddApi, SysOpsDepartAddInitApi} from "@/api/modules/systemOps";
import { FormInstance, FormRules } from "element-plus";
import { ElNotification } from 'element-plus';
import { dialogField, inputField, textAreaField, formField,
  selectMultiField, inputNumberField } from "@/utils/attrs/field";
import publicLength from "@/utils/attrs/length";
import publicPlaceHolder from "@/utils/attrs/place";
import { OptionEnumModelList } from "@/models/X";

// 数据组件属性值
const lmodelLen = publicLength.systemDepartModel;
const lmodelPlace = publicPlaceHolder.systemDepartModel;

const dgConfigField = reactive({
  title: '新增',
  width: '65%'
});
const dgField = {...dialogField, ...dgConfigField}; // DIALOG属性
const introductionSize = ref({minRows: 3, maxRows: 4});
const fullView = ref(dgField.fullScreen); // 全屏控制
const fullViewText = ref('全屏');
const emit = defineEmits(['update:visible', 'nodeAppendTree']);
const btnDisabled = ref(false); // 禁用
const btnLoading = ref(false); // 加载中
const userOption = ref<OptionEnumModelList>([]);
const pNode = reactive({}) as DepartmentNode;

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
  resetForm();
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
const ruleForm = reactive({}) as DepartmentNode;
ruleForm.order_id = 1; // 默认为1
ruleForm.disabled = false;
// from rule
const rules = reactive({
  label: [
    { required: true, message: "部门名称不允许为空", trigger: 'blur' },
    { min: 1, max: lmodelLen.label, message: '最大长度支持'+lmodelLen.label+'位', trigger: 'blur' },
  ],
  description: [
    { required: true, message: "部门描述不允许为空", trigger: 'blur' },
    { min: 1, max: lmodelLen.description, message: '最大长度支持'+lmodelLen.description+'位', trigger: 'blur' },
  ],
} as FormRules);

const resetForm = () => {
  ruleForm.label = "";
  ruleForm.description = "";
  ruleForm.manage_rtx = [];
  ruleForm.order_id = 1;
  ruleForm.disabled = false;
};

// 请求数据API
const fetchApiData = async (md5: string) => {
  const response = await SysOpsDepartAddInitApi({ md5 });
  if (response.data) {
    const res = response.data as { data: DepartmentNode, user: OptionEnumModelList }; // declare
    Object.assign(pNode, res.data); // 父级部门
    userOption.value = res.user; // 用户枚举
  }
};

// 确认
const confirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  ruleForm.pid = pNode.id; // 上父节点ID
  await formEl.validate((valid) => {
    if (valid) {
      btnDisabled.value = true;
      btnLoading.value = true;

      SysOpsDepartAddApi(ruleForm).then((response) => {
        ElNotification({
          title: '提示',
          message: '新增成功',
          type: 'success'
        });
        closeDialog();
        emit('nodeAppendTree', response.data);
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
