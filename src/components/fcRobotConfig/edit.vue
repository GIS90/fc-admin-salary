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
        <div class="my-dialog-header-title">
          <span>{{ dialogTitle }}</span>
          <el-link v-if="docUrl" :href="docUrl" target="_blank" type="primary" :underline="false"
                   class="header-doc-link" :title="docRemark || docLabel">
            <el-icon class="header-doc-icon"><Link /></el-icon>
            {{ docLabel }}
          </el-link>
        </div>
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
      <el-alert v-if="docUrl" class="doc-alert" type="info" show-icon :closable="false">
        <template #title>
          <span class="doc-alert-text">{{ docRemark || `请参考官网手册完成${entityName}配置` }}</span>
          <el-link :href="docUrl" target="_blank" type="primary" :underline="false" class="doc-alert-link">
            查看配置手册
          </el-link>
        </template>
      </el-alert>
      <el-form :model="ruleForm" :label-width="formField.labelWidth" :label-position="formField.labelPosition"
               :size="formField.size" v-loading="loading" style="width: 100%">
        <el-form-item :label="`${entityName}名称`" required>
          <el-input v-model.trim="ruleForm.name" :maxlength="RobotLen.name" :placeholder="RobotPlace.name"
                    :size="inputField.size" :show-word-limit="inputField.showWordLimit" :clearable="inputField.clearable"
                    :disabled="btnDisabled" />
        </el-form-item>
        <el-form-item :label="agentLabel" :required="agentRequired">
          <el-input v-model.trim="ruleForm.agentId" :maxlength="RobotLen.agentId" :placeholder="RobotPlace.agentId"
                    :size="inputField.size" :show-word-limit="inputField.showWordLimit" :clearable="inputField.clearable"
                    :disabled="btnDisabled" />
        </el-form-item>
        <el-form-item :label="keyLabel" required>
          <el-input v-model.trim="ruleForm.key" :maxlength="RobotLen.key" :placeholder="RobotPlace.key"
                    :size="inputField.size" :show-word-limit="inputField.showWordLimit" :clearable="inputField.clearable"
                    :disabled="btnDisabled" />
        </el-form-item>
        <el-form-item :label="secretLabel" required>
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
import { SysConfigXtcsKeyApi } from "@/api/modules/common";
import type { RobotApiSet, RobotFieldSchema } from "./model";

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

// 渠道字段配置（默认钉钉）
const schema = computed<RobotFieldSchema>(() => props.apiSet.schema || {});
const RobotLen = computed(() => schema.value.length || publicLength.salaryDtalkRobotModel);
const RobotPlace = computed(() => schema.value.placeholder || publicPlaceHolder.salaryDtalkRobotModel);
const keyLabel = computed(() => schema.value.keyLabel || "AppKey");
const secretLabel = computed(() => schema.value.secretLabel || "AppSecret");
const agentLabel = computed(() => schema.value.agentLabel || "AgentId");
const agentRequired = computed(() => !!schema.value.agentRequired);

// 实体名称
const entityName = computed(() => props.apiSet.entityName || "机器人");

// 官网手册（系统参数）
const docUrl = ref("");
const docRemark = ref("");
const docLabel = computed(() => props.apiSet.docLabel || "官网手册");

// 依次尝试渠道配置的参数 key，取第一个有效地址；参数缺失不影响表单使用
const fetchDocInfo = async () => {
  docUrl.value = "";
  docRemark.value = "";
  const raw = props.apiSet.docKey;
  const keys: string[] = Array.isArray(raw) ? raw : raw ? [raw] : [];
  for (const key of keys) {
    if (!key) continue;
    try {
      const response: any = await SysConfigXtcsKeyApi({ key });
      const data: any = response?.data;
      const url: string = typeof data === "string" ? data : data?.value || "";
      if (url) {
        docUrl.value = url;
        docRemark.value = data?.remark || "";
        break;
      }
    } catch {
      // 忽略单个参数获取失败，继续尝试下一个
    }
  }
};

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
  fetchDocInfo();
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
  agentId: "",
  description: "",
  select: false
});

// 重置表单
const resetForm = () => {
  ruleForm.md5 = "";
  ruleForm.name = "";
  ruleForm.key = "";
  ruleForm.secret = "";
  ruleForm.agentId = "";
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
  ruleForm.agentId = data.agentId || "";
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
    ElMessage.warning(`请输入${keyLabel.value}`);
    return false;
  }
  if (!ruleForm.secret) {
    ElMessage.warning(`请输入${secretLabel.value}`);
    return false;
  }
  if (agentRequired.value && !ruleForm.agentId) {
    ElMessage.warning(`请输入${agentLabel.value}`);
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
    agentId: ruleForm.agentId,
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

<style scoped lang="scss">
.my-dialog-header-title {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

.header-doc-link {
  font-size: 13px;
  font-weight: 400;

  .header-doc-icon {
    margin-right: 4px;
    vertical-align: -2px;
  }
}

.my-dialog-body {
  max-height: 66vh;
  overflow-y: auto;
  padding-right: 6px;
}

.doc-alert {
  margin-bottom: 18px;

  :deep(.el-alert__title) {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px 10px;
    line-height: 1.6;
  }
}

.doc-alert-link {
  font-size: 13px;
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}
</style>
