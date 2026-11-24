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

    <div class="my-dialog-body">
    <el-form ref="configFormRef" :model="configForm" :rules="rules" :size="formField.size"
             label-position="top" style="width: 100%">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="配置名称" prop="name">
            <el-input v-model.trim="configForm.name" :maxlength="55" clearable placeholder="请输入配置名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="主机地址" prop="host">
            <el-input v-model.trim="configForm.host" :maxlength="120" clearable placeholder="127.0.0.1" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="端口" prop="port">
            <el-input-number v-model="configForm.port" :min="1" :max="65535" controls-position="right" class="full-width" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="数据库" prop="db">
            <el-input-number v-model="configForm.db" :min="0" :max="15" controls-position="right" class="full-width" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="排序编码" prop="orderId">
            <el-input-number v-model="configForm.orderId" :min="0" :max="99999" controls-position="right" class="full-width" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="密码">
        <el-input v-model="configForm.password" type="password" show-password :maxlength="120" clearable
                  placeholder="无密码请留空" />
      </el-form-item>
      <el-form-item label="配置说明">
        <el-input v-model="configForm.summary" type="textarea" :rows="3" maxlength="255" show-word-limit
                  placeholder="请输入配置说明" />
      </el-form-item>
      <el-form-item label="状态">
        <el-switch v-model="configForm.lock" :active-value="false" :inactive-value="true" active-text="启用" inactive-text="停用" />
      </el-form-item>
    </el-form>
    </div>

    <template #footer>
      <div class="my-dialog-footer">
        <el-button :loading="testLoading" @click="testConnect">测试连接</el-button>
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submit">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElNotification } from 'element-plus';
import { RedisConfigForm } from '@/models/systemModel';
import {
  SysOpsRedisConfigApi, SysOpsRedisConfigAddApi, SysOpsRedisConfigUpdateApi, SysOpsRedisConfigTestApi
} from '@/api/modules/systemOps';
import { dialogField, formField } from '@/utils/attrs/field';

const props = defineProps({
  visible: { type: Boolean, default: false },
  md5: { type: String, default: '' }
});
const emit = defineEmits(['update:visible', 'success']);

const dgField = { ...dialogField, ...{ title: 'Redis连接配置', width: '55%' } };
const fullView = ref(dgField.fullScreen);
const fullViewText = ref('全屏');
const configFormRef = ref<FormInstance>();
const submitLoading = ref(false);
const testLoading = ref(false);

const initForm = (): RedisConfigForm => ({
  name: '', host: '127.0.0.1', port: 6379, db: 0, password: '',
  orderId: 1, summary: '', lock: false
});
const configForm = reactive<RedisConfigForm>(initForm());

const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入配置名称', trigger: 'blur' }],
  host: [{ required: true, message: '请输入主机地址', trigger: 'blur' }],
  port: [{ required: true, message: '请输入端口', trigger: 'blur' }]
});

watch(fullView, (value) => {
  fullViewText.value = value ? '取消全屏' : '全屏';
}, { immediate: true });

watch(() => props.visible, (val) => {
  if (val) openDialog();
});

const fullScreen = () => {
  fullView.value = !fullView.value;
};

const openDialog = async () => {
  Object.assign(configForm, initForm());
  if (props.md5) {
    const response = await SysOpsRedisConfigApi({ md5: props.md5 });
    if (response.data) Object.assign(configForm, response.data);
  }
};

const closeDialog = () => {
  emit('update:visible', false);
};

const testConnect = async () => {
  testLoading.value = true;
  try {
    const response = await SysOpsRedisConfigTestApi({ ...configForm });
    ElNotification({
      title: '连接成功',
      message: `当前库共有 ${response.data?.dbsize ?? 0} 个键`,
      type: 'success'
    });
  } finally {
    testLoading.value = false;
  }
};

const submit = async () => {
  if (!configFormRef.value) return;
  await configFormRef.value.validate(async (valid) => {
    if (!valid) return;
    submitLoading.value = true;
    try {
      const api = props.md5 ? SysOpsRedisConfigUpdateApi : SysOpsRedisConfigAddApi;
      await api({ ...configForm });
      ElNotification({ title: '提示', message: props.md5 ? '更新成功' : '新增成功', type: 'success' });
      emit('success');
      closeDialog();
    } finally {
      submitLoading.value = false;
    }
  });
};
</script>

<style scoped>
.my-dialog-body { padding: 16px 20px; }
.full-width { width: 100%; min-width: 0; }
:deep(.el-form-item) { margin-bottom: 14px; }
:deep(.el-form-item__label) { padding-bottom: 4px; line-height: 1.4; }
</style>
