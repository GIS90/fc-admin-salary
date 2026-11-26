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
      @close="closeDialog"
  >
    <!--header-->
    <template #header>
      <div class="my-dialog-header">
        <div class="my-dialog-header-title">Redis PING 检测结果</div>
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
      <div class="ping-summary">
        <div class="summary-card">
          <span class="summary-label">检测连接</span>
          <span class="summary-value">{{ props.total }}</span>
        </div>
        <div class="summary-card success">
          <span class="summary-label">成功</span>
          <span class="summary-value">{{ props.success }}</span>
        </div>
        <div class="summary-card danger">
          <span class="summary-label">失败</span>
          <span class="summary-value">{{ props.failed }}</span>
        </div>
      </div>

      <el-table :data="props.list" border stripe size="default" style="width: 100%">
        <el-table-column prop="name" label="配置名称" show-overflow-tooltip align="center" />
        <el-table-column label="连接地址" align="center">
          <template #default="scope">
            <span class="address">{{ scope.row.host }}:{{ scope.row.port }}/{{ scope.row.db }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.ok ? 'success' : 'danger'" effect="dark" size="small">
              {{ scope.row.ok ? 'PONG' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Keys" align="center">
          <template #default="scope">{{ scope.row.ok ? scope.row.dbsize : '-' }}</template>
        </el-table-column>
        <el-table-column prop="message" label="说明" show-overflow-tooltip align="center" />
        <template #empty><el-empty description="暂无启用的Redis配置" :image-size="70" /></template>
      </el-table>
    </div>

    <!--footer-->
    <template #footer>
      <div class="my-dialog-footer">
        <el-button v-bind="buttonField" @click="closeDialog">关 闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { dialogField, buttonField } from '@/utils/attrs/field';

interface PingResultItem {
  md5: string;
  name: string;
  host: string;
  port: number;
  db: number;
  ok: boolean;
  dbsize: number;
  message: string;
}

const props = defineProps({
  visible: { type: Boolean, required: true, default: false },
  list: { type: Array as () => PingResultItem[], default: () => [] },
  total: { type: Number, default: 0 },
  success: { type: Number, default: 0 },
  failed: { type: Number, default: 0 }
});
const emit = defineEmits(['update:visible']);

const dgConfigField = reactive({ title: 'Redis PING', width: '60%' });
const dgField = { ...dialogField, ...dgConfigField }; // DIALOG属性
const fullView = ref(dgField.fullScreen); // 全屏控制
const fullViewText = ref('全屏');

// 全屏Text侦听器
watch(fullView, (value) => {
  fullViewText.value = value ? '取消全屏' : '全屏';
}, { immediate: true });

// 关闭
function closeDialog() {
  emit('update:visible', false);
}

// 全屏
function fullScreen() {
  fullView.value = !fullView.value;
}
</script>

<style scoped>
.ping-summary {
  display: flex;
  gap: 12px;
  margin-bottom: 14px;
}
.summary-card {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 6px;
  background: var(--el-fill-color-blank);
}
.summary-card.success { border-color: var(--el-color-success-light-5); background: var(--el-color-success-light-9); }
.summary-card.danger { border-color: var(--el-color-danger-light-5); background: var(--el-color-danger-light-9); }
.summary-label { font-size: 13px; color: var(--el-text-color-regular); }
.summary-value { font-size: 22px; font-weight: 600; color: var(--el-text-color-primary); }
.summary-card.success .summary-value { color: var(--el-color-success); }
.summary-card.danger .summary-value { color: var(--el-color-danger); }
.address { font-family: Consolas, Monaco, monospace; }
</style>
