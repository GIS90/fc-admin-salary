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
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" :size="formField.size"
             label-position="top" style="width: 100%">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="规则名称" prop="name">
            <el-input v-model.trim="ruleForm.name" :maxlength="55" clearable placeholder="请输入规则名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Redis配置" prop="redisMd5">
            <el-select v-model="ruleForm.redisMd5" style="width: 100%;" :size="selectSingleField.size" filterable clearable
                       placeholder="请选择Redis连接配置">
              <el-option v-for="item in props.configOption" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="匹配方式" prop="match">
            <el-select v-model="ruleForm.match" style="width: 100%;" :size="selectSingleField.size" clearable>
              <el-option v-for="item in props.matchOption" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单次最大键数" prop="maxKeys">
            <el-input-number v-model="ruleForm.maxKeys" :min="1" :max="100000" controls-position="right" class="full-width" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="键匹配内容" prop="pattern">
        <el-input v-model.trim="ruleForm.pattern" :maxlength="255" clearable
                  placeholder="前缀匹配填写前缀；通配符支持*和?；正则填写表达式" />
        <div class="form-tip">清理内容与匹配表达式由后台解析执行，前端不直接传递 key pattern。</div>
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="排序编码" prop="orderId">
            <el-input-number v-model="ruleForm.orderId" :min="0" :max="99999" controls-position="right" class="full-width" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态">
            <el-switch v-model="ruleForm.lock" :active-value="false" :inactive-value="true" active-text="启用" inactive-text="停用" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="规则说明">
        <el-input v-model="ruleForm.summary" type="textarea" :rows="3" maxlength="255" show-word-limit
                  placeholder="请输入规则说明" />
      </el-form-item>
    </el-form>
    </div>

    <template #footer>
      <div class="my-dialog-footer">
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
import { OptionEnumModelList } from '@/models/X';
import { RedisRuleForm } from '@/models/systemModel';
import {
  SysOpsRedisRuleApi, SysOpsRedisRuleAddApi, SysOpsRedisRuleUpdateApi
} from '@/api/modules/systemOps';
import { dialogField, formField, selectSingleField } from '@/utils/attrs/field';

const props = defineProps({
  visible: { type: Boolean, default: false },
  md5: { type: String, default: '' },
  configOption: { type: Array as () => OptionEnumModelList, default: () => [] },
  matchOption: { type: Array as () => OptionEnumModelList, default: () => [] }
});
const emit = defineEmits(['update:visible', 'success']);

const dgField = { ...dialogField, ...{ title: '清理规则', width: '60%' } };
const fullView = ref(dgField.fullScreen);
const fullViewText = ref('全屏');
const ruleFormRef = ref<FormInstance>();
const submitLoading = ref(false);

const initForm = (): RedisRuleForm => ({
  name: '', redisMd5: '', match: 'prefix', pattern: '', maxKeys: 1000,
  orderId: 1, summary: '', lock: false
});
const ruleForm = reactive<RedisRuleForm>(initForm());

const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
  redisMd5: [{ required: true, message: '请选择Redis连接配置', trigger: 'change' }],
  match: [{ required: true, message: '请选择匹配方式', trigger: 'change' }],
  pattern: [{ required: true, message: '请输入键匹配内容', trigger: 'blur' }]
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
  Object.assign(ruleForm, initForm());
  if (props.md5) {
    const response = await SysOpsRedisRuleApi({ md5: props.md5 });
    if (response.data) Object.assign(ruleForm, response.data);
  }
};

const closeDialog = () => {
  emit('update:visible', false);
};

const submit = async () => {
  if (!ruleFormRef.value) return;
  await ruleFormRef.value.validate(async (valid) => {
    if (!valid) return;
    submitLoading.value = true;
    try {
      const api = props.md5 ? SysOpsRedisRuleUpdateApi : SysOpsRedisRuleAddApi;
      await api({ ...ruleForm });
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
.form-tip { font-size: 12px; color: #909399; line-height: 1.5; }
:deep(.el-form-item) { margin-bottom: 14px; }
:deep(.el-form-item__label) { padding-bottom: 4px; line-height: 1.4; }
</style>
