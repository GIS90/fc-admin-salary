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

    <div class="my-dialog-body" v-loading="btnLoading">
      <template v-if="checkResult">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="数据库表">{{ checkResult.table }}</el-descriptions-item>
          <el-descriptions-item label="表字段总数">{{ checkResult.db_columns.length }}</el-descriptions-item>
          <el-descriptions-item label="配置字段数">{{ checkResult.check_fields.length }}</el-descriptions-item>
          <el-descriptions-item label="校验结果">
            <el-tag v-if="checkResult.all_exist" type="success" size="small">全部通过</el-tag>
            <el-tag v-else type="danger" size="small">存在 {{ checkResult.not_exist.length }} 个缺失</el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <div v-if="checkResult.not_exist.length" class="check-result-block">
          <div class="check-result-title text-danger">⚠ 以下字段在数据库表中不存在：</div>
          <div class="check-tag-wrap">
            <el-tag v-for="f in checkResult.not_exist" :key="f" type="danger" class="check-tag">{{ f }}</el-tag>
          </div>
        </div>

        <div v-if="checkResult.exist.length" class="check-result-block">
          <div class="check-result-title text-success">✓ 以下字段已存在（{{ checkResult.exist.length }} 个）：</div>
          <div class="check-tag-wrap">
            <el-tag v-for="f in checkResult.exist" :key="f" type="success" class="check-tag">{{ f }}</el-tag>
          </div>
        </div>
      </template>
      <el-empty v-else description="暂无校验数据" />
    </div>

    <template #footer>
      <div class="my-dialog-footer">
        <el-button :disabled="btnDisabled" @click="closeDialog">关 闭</el-button>
        <el-button :disabled="btnDisabled" :loading="btnLoading" type="primary" icon="Refresh" @click="confirm">重新校验</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang='ts'>
import { ref, reactive, watch } from 'vue';
import { ElMessage, ElNotification } from 'element-plus';
import { dialogField } from "@/utils/attrs/field";
import { SysConfigReportFieldCheckApi } from '@/api/modules/systemConfig';

interface CheckResult {
  table: string;
  db_columns: string[];
  check_fields: string[];
  exist: string[];
  not_exist: string[];
  all_exist: boolean;
}

const dgConfigField = reactive({
  title: '字段校验结果',
  width: '55%'
});
const dgField = {...dialogField, ...dgConfigField};
const fullView = ref(dgField.fullScreen);
const fullViewText = ref('全屏');

const props = defineProps({
  visible: { type: Boolean, required: true, default: false },
  reportTable: { type: String, default: '' },
  fieldList: { type: Array<string>, default: () => [] }
});
const emit = defineEmits(['update:visible']);

const btnDisabled = ref(false);
const btnLoading = ref(false);
const checkResult = ref<CheckResult | null>(null);

watch(fullView, (value) => {
  fullViewText.value = value ? '取消全屏' : '全屏';
}, { immediate: true });

function closeDialog() {
  emit('update:visible', false);
}
function fullScreen() {
  fullView.value = !fullView.value;
}

async function openDialog() {
  await doCheck();
}

async function doCheck() {
  if (!props.reportTable) {
    ElMessage.warning('未指定数据库表名');
    return;
  }
  const fields = props.fieldList.filter(Boolean);
  if (!fields.length) {
    ElMessage.warning('暂无字段可校验');
    return;
  }
  btnLoading.value = true;
  try {
    const res = await SysConfigReportFieldCheckApi({ table: props.reportTable, fields });
    if (res?.code === 100 && res.data) {
      checkResult.value = res.data as CheckResult;
    } else {
      ElNotification({ title: '提示', message: (res as any)?.msg || '校验失败', type: 'error' });
    }
  } catch (e) {}
  btnLoading.value = false;
}

const confirm = () => {
  doCheck();
};
</script>

<style scoped>
.check-result-block { margin-top: 16px; margin-bottom: 12px; }
.check-result-title { font-weight: 600; margin-bottom: 6px; }
.check-tag-wrap { display: flex; flex-wrap: wrap; gap: 6px; }
.check-tag { margin: 0; }
.text-success { color: #67c23a; }
.text-danger { color: #f56c6c; }
</style>
