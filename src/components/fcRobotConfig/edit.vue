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
      :draggable="dgField.draggable"
      :overflow="dgField.overflow"
      :center="dgField.center"
      :align-center="dgField.alignCenter"
      :append-to-body="true"
      :destroy-on-close="true"
      @open="openDialog"
      @close="closeDialog"
  >
    <!--header-->
    <template #header>
      <div class="my-dialog-header">
        <div class="my-dialog-header-title">{{ dialogTitle }}</div>
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
      <el-form :model="ruleForm" :label-width="formField.labelWidth" :label-position="formField.labelPosition"
               :size="formField.size" v-loading="loading" style="width: 100%">
        <el-form-item :label="`${entityName}名称`" required>
          <el-input v-model.trim="ruleForm.name" :maxlength="RobotLen.name" :placeholder="RobotPlace.name"
                    :size="inputField.size" :show-word-limit="inputField.showWordLimit" :clearable="inputField.clearable"
                    :disabled="btnDisabled" />
        </el-form-item>
        <el-form-item label="APP-KEY" required>
          <el-input v-model.trim="ruleForm.key" :maxlength="RobotLen.key" :placeholder="RobotPlace.key"
                    :size="inputField.size" :show-word-limit="inputField.showWordLimit" :clearable="inputField.clearable"
                    :disabled="btnDisabled" />
        </el-form-item>
        <el-form-item label="APP-SECRET" required>
          <el-input v-model.trim="ruleForm.secret" :maxlength="RobotLen.secret" :placeholder="RobotPlace.secret"
                    :size="inputField.size" :show-word-limit="inputField.showWordLimit" :clearable="inputField.clearable"
                    :disabled="btnDisabled" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model.trim="ruleForm.description" :maxlength="RobotLen.description" :placeholder="RobotPlace.description"
                    :size="inputField.size" :show-word-limit="inputField.showWordLimit" :clearable="inputField.clearable"
                    :disabled="btnDisabled" />
        </el-form-item>
        <el-form-item label="设为默认">
          <el-switch v-model="ruleForm.select" active-text="是" inactive-text="否" :disabled="btnDisabled" />
          <div class="el-form-item-msg">默认{{ entityName }}会在发送消息时自动选中</div>
        </el-form-item>
      </el-form>
    </div>

    <!--footer-->
    <template #footer>
      <div class="my-dialog-footer">
        <el-button :disabled="btnDisabled" @click="closeDialog">取 消</el-button>
        <el-button :disabled="btnDisabled" :loading="btnLoading" type="primary" @click="confirm">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang='ts'>
import { ref, reactive, computed, watch } from 'vue';
import { ElMessage, ElNotification } from 'element-plus';
import { dialogField, formField, inputField } from "@/utils/attrs/field";
import publicLength from "@/utils/attrs/length";
import publicPlaceHolder from "@/utils/attrs/place";
import type { RobotApiSet } from "./model";

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
    default: false
  },
  md5: {
    type: String,
    default: ''
  },
  // 新增时是否默认勾选「设为默认」（列表为空时首次新增）
  defaultSelect: {
    type: Boolean,
    default: false
  },
  // 渠道接口集合（钉钉、企业微信等）
  apiSet: {
    type: Object as () => RobotApiSet,
    required: true
  }
});
const emit = defineEmits(['update:visible', 'reFetchTableData']);

// 字段长度、占位提示
const RobotLen = publicLength.salaryDtalkRobotModel;
const RobotPlace = publicPlaceHolder.salaryDtalkRobotModel;

// 实体名称
const entityName = computed(() => props.apiSet.entityName || "机器人");

// Dialog属性
const dgConfigField = reactive({
  title: '机器人配置',
  width: '50%'
});
const dgField = { ...dialogField, ...dgConfigField }; // DIALOG属性
const fullView = ref(dgField.fullScreen); // 全屏控制
const fullViewText = ref('全屏');
const loading = ref(false); // 数据加载中
const btnDisabled = ref(false); // 禁用
const btnLoading = ref(false); // 加载中

// 标题
const dialogTitle = computed(() => props.md5 ? `编辑${entityName.value}` : `新增${entityName.value}`);

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
  resetForm();
  if (props.md5) {
    fetchApiData(props.md5);
  } else {
    ruleForm.select = props.defaultSelect;
  }
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//              ↑Dialog通用配置         ↓定制化方法
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// 响应式数据
const ruleForm = reactive({
  md5: "",
  name: "",
  key: "",
  secret: "",
  description: "",
  select: false
});

// 重置表单
const resetForm = () => {
  ruleForm.md5 = "";
  ruleForm.name = "";
  ruleForm.key = "";
  ruleForm.secret = "";
  ruleForm.description = "";
  ruleForm.select = false;
};

// 请求数据API
const fetchApiData = async (md5: string) => {
  loading.value = true;
  let response: any = null;
  try {
    response = await props.apiSet.detail({ md5 });
  } finally {
    loading.value = false;
  }
  const data = response?.data;
  if (!data) return;
  ruleForm.md5 = data.md5 || "";
  ruleForm.name = data.name || "";
  ruleForm.key = data.key || "";
  ruleForm.secret = data.secret || "";
  ruleForm.description = data.description || "";
  ruleForm.select = !!data.select;
};

// 表单校验
const validateForm = (): boolean => {
  if (!ruleForm.name) {
    ElMessage.warning(`请输入${entityName.value}名称`);
    return false;
  }
  if (!ruleForm.key) {
    ElMessage.warning("请输入APP-KEY");
    return false;
  }
  if (!ruleForm.secret) {
    ElMessage.warning("请输入APP-SECRET");
    return false;
  }
  return true;
};

// 确认
const confirm = () => {
  if (!validateForm()) return;
  const params = {
    name: ruleForm.name,
    key: ruleForm.key,
    secret: ruleForm.secret,
    description: ruleForm.description,
    select: ruleForm.select
  };
  btnDisabled.value = true;
  btnLoading.value = true;
  const request = props.md5
      ? props.apiSet.update({ md5: props.md5, ...params })
      : props.apiSet.add(params);
  request.then(() => {
    ElNotification.success({ title: "提示", message: "保存成功" });
    emit("reFetchTableData");
    closeDialog();
  }).finally(() => {
    btnDisabled.value = false;
    btnLoading.value = false;
  });
};
</script>

<style scoped>
</style>
