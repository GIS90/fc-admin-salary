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
      append-to-body
      destroy-on-close
      class="fc-send-result-dialog"
      @update:model-value="closeHandle"
  >
    <template #header>
      <div class="my-dialog-header">
        <div class="result-header">
          <div class="result-header-icon" :class="hasFailure ? 'is-warning' : 'is-success'">
            <el-icon><component :is="hasFailure ? WarningFilled : CircleCheckFilled" /></el-icon>
          </div>
          <div class="result-header-text">
            <div class="result-title">{{ hasFailure ? '发送完成（存在失败）' : '发送完成' }}</div>
            <div class="result-subtitle">以下是本次各 Sheet 的消息推送统计</div>
          </div>
        </div>
        <div class="my-dialog-header-icon">
          <el-tooltip effect="dark" :content="fullViewText" placement="top">
            <el-icon @click="fullScreen" class="margin-right-15px">
              <FullScreen />
            </el-icon>
          </el-tooltip>
          <el-tooltip effect="dark" content="关闭" placement="top">
            <el-icon @click="closeHandle">
              <Close />
            </el-icon>
          </el-tooltip>
        </div>
      </div>
    </template>

    <div class="result-body">
      <!-- 汇总统计 -->
      <div class="result-summary">
        <div class="summary-item">
          <div class="summary-icon is-info"><el-icon><Files /></el-icon></div>
          <div class="summary-content">
            <div class="summary-label">发送 Sheet 数量</div>
            <div class="summary-value">{{ resultItems.length }}</div>
          </div>
        </div>
        <div class="summary-item is-success">
          <div class="summary-icon"><el-icon><CircleCheckFilled /></el-icon></div>
          <div class="summary-content">
            <div class="summary-label">成功条数</div>
            <div class="summary-value">{{ totalSuccess }}</div>
          </div>
        </div>
        <div class="summary-item" :class="totalFailure > 0 ? 'is-warning' : ''">
          <div class="summary-icon"><el-icon><CircleCloseFilled /></el-icon></div>
          <div class="summary-content">
            <div class="summary-label">失败条数</div>
            <div class="summary-value">{{ totalFailure }}</div>
          </div>
        </div>
        <div class="summary-item is-total">
          <div class="summary-icon"><el-icon><DataAnalysis /></el-icon></div>
          <div class="summary-content">
            <div class="summary-label">累计发送条数</div>
            <div class="summary-value">{{ totalCount }}</div>
          </div>
        </div>
      </div>

      <!-- 明细表格 -->
      <div class="section-title">
        <span class="section-title-bar" />
        <span>发送明细</span>
        <span class="section-title-tip">点击行展开查看成功 / 失败名单</span>
      </div>
      <el-table :data="resultItems" border stripe class="result-table" row-key="sheet">
        <el-table-column type="expand">
          <template #default="scope">
            <div class="expand-detail">
              <div v-if="scope.row.data?.successList?.length" class="detail-block">
                <div class="detail-label is-success">成功名单（{{ scope.row.data.successList.length }}）</div>
                <div class="detail-tags">
                  <el-tag v-for="(uid, i) in scope.row.data.successList" :key="`s-${i}`"
                          type="success" effect="light" size="small" class="user-tag">
                    {{ uid }}
                  </el-tag>
                </div>
              </div>
              <div v-if="scope.row.data?.failureList?.length" class="detail-block">
                <div class="detail-label is-danger">失败名单（{{ scope.row.data.failureList.length }}）</div>
                <div class="detail-tags">
                  <el-tag v-for="(uid, i) in scope.row.data.failureList" :key="`f-${i}`"
                          type="danger" effect="light" size="small" class="user-tag">
                    {{ uid }}
                  </el-tag>
                </div>
              </div>
              <div v-if="!scope.row.data?.successList?.length && !scope.row.data?.failureList?.length"
                   class="detail-empty">
                该 Sheet 无发送明细{{ scope.row.message ? `（${scope.row.message}）` : '' }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="sheet" label="Sheet名称" align="center" min-width="110">
          <template #default="scope">
            <span class="sheet-cell">{{ scope.row.sheetName || `表 ${scope.row.sheet}` }}</span>
          </template>
        </el-table-column>
        <el-table-column label="成功" align="center" min-width="80">
          <template #default="scope">
            <span class="num-success">{{ scope.row.data?.success ?? 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="失败" align="center" min-width="80">
          <template #default="scope">
            <span :class="(scope.row.data?.failure ?? 0) > 0 ? 'num-danger' : 'num-muted'">
              {{ scope.row.data?.failure ?? 0 }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="合计" align="center" min-width="80">
          <template #default="scope">
            <span class="num-total">{{ (scope.row.data?.success ?? 0) + (scope.row.data?.failure ?? 0) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="结果" align="center" min-width="110">
          <template #default="scope">
            <el-tag :type="resultTagType(scope.row)" effect="light" size="small">
              {{ resultTagText(scope.row) }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>

      <!-- 失败名单汇总 -->
      <div v-if="failureGroups.length" class="failure-panel">
        <div class="failure-panel-header">
          <el-icon class="failure-panel-icon"><WarningFilled /></el-icon>
          <span>失败名单汇总</span>
          <el-tag type="danger" effect="dark" size="small" class="failure-panel-count">
            {{ totalFailure }} 人
          </el-tag>
        </div>
        <div class="failure-panel-body">
          <div v-for="group in failureGroups" :key="group.sheet" class="failure-group">
            <div class="failure-group-title">
              <el-icon><Document /></el-icon>
              {{ group.sheetName || `表 ${group.sheet}` }}
              <span class="failure-group-count">{{ group.users.length }} 人失败</span>
            </div>
            <div class="failure-tags">
              <el-tag v-for="(uid, i) in group.users" :key="i" type="danger" effect="plain" size="small" class="user-tag">
                {{ uid }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="my-dialog-footer">
        <el-button type="primary" @click="closeHandle">知道了</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import {
  CircleCheckFilled, CircleCloseFilled, DataAnalysis,
  Document, Files, WarningFilled
} from "@element-plus/icons-vue";
import { dialogField } from "@/utils/attrs/field";

// Dialog 通用配置
const dgConfigField = reactive({
  title: "发送完成",
  width: "65%",
  top: "8vh"
});
const dgField = { ...dialogField, ...dgConfigField };
const fullView = ref(dgField.fullScreen); // 全屏控制
const fullViewText = ref("全屏");

// 全屏Text侦听器
watch(fullView, (value) => {
  fullViewText.value = value ? "取消全屏" : "全屏";
}, { immediate: true });

// 全屏
const fullScreen = () => {
  fullView.value = !fullView.value;
};

interface SendResultData {
  success: number;
  failure: number;
  total?: number;
  successList?: string[];
  failureList?: string[];
}

interface SendResultItem {
  sheet: string;
  sheetName?: string;
  ok: boolean;
  message?: string;
  data?: SendResultData;
}

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
    default: false
  },
  // 后端新格式：data 为结果数组 [{ sheet, ok, message, data: {...} }]
  results: {
    type: Array as () => SendResultItem[],
    default: () => []
  },
  // 兼容旧格式：【Sheet】：成功：N，失败：M；...
  message: {
    type: String,
    default: ""
  }
});
const emit = defineEmits(["update:visible"]);

// 兼容旧 message 文本 → 新结构
const parseLegacyMessage = (message: string): SendResultItem[] => {
  const text = message || "";
  const items: SendResultItem[] = [];
  const reg = /【([^】]+)】：\s*成功：\s*(\d+)\s*，\s*失败：\s*(\d+)/g;
  let match: RegExpExecArray | null;
  while ((match = reg.exec(text)) !== null) {
    const success = Number(match[2]);
    const failure = Number(match[3]);
    items.push({
      sheet: match[1],
      ok: failure === 0,
      message: `成功：${success}，失败：${failure}`,
      data: { success, failure, total: success + failure }
    });
  }
  if (items.length) return items;
  return text.split("；").filter((part) => part.trim()).map((part) => {
    const sheetMatch = part.match(/【([^】]+)】/);
    return {
      sheet: sheetMatch ? sheetMatch[1] : "发送结果",
      ok: false,
      message: part.replace(/^【[^】]+】：?\s*/, ""),
      data: { success: 0, failure: 0 }
    };
  });
};

// sheet 索引 → sheet 名称（新格式 sheet 为索引）
const normalizeItems = (list: SendResultItem[]): SendResultItem[] =>
  list.map((item) => ({
    ...item,
    sheet: item.sheet ?? "-",
    data: item.data || { success: 0, failure: 0 }
  }));

const resultItems = computed<SendResultItem[]>(() =>
  normalizeItems(props.results && props.results.length ? props.results : parseLegacyMessage(props.message || ""))
);
const totalSuccess = computed(() =>
  resultItems.value.reduce((sum, item) => sum + (item.data?.success ?? 0), 0)
);
const totalFailure = computed(() =>
  resultItems.value.reduce((sum, item) => sum + (item.data?.failure ?? 0), 0)
);
const totalCount = computed(() =>
  resultItems.value.reduce((sum, item) => sum + (item.data?.total ?? 0), 0) || totalSuccess.value + totalFailure.value
);
const hasFailure = computed(() => totalFailure.value > 0 || resultItems.value.some((item) => !item.ok));

// 按 Sheet 聚合失败名单
const failureGroups = computed<{ sheet: string; sheetName?: string; users: string[] }[]>(() =>
  resultItems.value
    .map((item) => ({ sheet: item.sheet, sheetName: item.sheetName, users: item.data?.failureList || [] }))
    .filter((group) => group.users.length > 0)
);

const resultTagType = (item: SendResultItem): "success" | "warning" | "danger" => {
  if (!item.ok) return "danger";
  if ((item.data?.failure ?? 0) > 0) return "warning";
  return "success";
};

const resultTagText = (item: SendResultItem): string => {
  if (!item.ok) return item.message || "发送失败";
  if ((item.data?.failure ?? 0) > 0) return "部分失败";
  return "全部成功";
};

const closeHandle = () => {
  emit("update:visible", false);
};
</script>

<style scoped lang="scss">
// 覆盖全局弹窗头部样式，保持结果弹窗简洁风格
.my-dialog-header {
  align-items: center;
  justify-content: space-between;
  padding: 14px 22px;
  background: transparent;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.my-dialog-footer {
  border-top: none;
}

.result-header {
  display: flex;
  align-items: center;
  gap: 14px;
}

.result-header-icon {
  flex: 0 0 42px;
  width: 42px;
  height: 42px;
  line-height: 42px;
  text-align: center;
  border-radius: 50%;
  font-size: 24px;

  .el-icon {
    vertical-align: middle;
  }

  &.is-success {
    color: var(--el-color-success);
    background: var(--el-color-success-light-9);
  }

  &.is-warning {
    color: var(--el-color-warning);
    background: var(--el-color-warning-light-9);
  }
}

.result-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.result-subtitle {
  margin-top: 3px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.result-summary {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 10px;
  background: var(--el-fill-color-lighter);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  }

  &.is-success {
    border-color: var(--el-color-success-light-5);
    background: var(--el-color-success-light-9);

    .summary-value { color: var(--el-color-success); }
    .summary-icon { color: var(--el-color-success); background: var(--el-color-success-light-7); }
  }

  &.is-warning {
    border-color: var(--el-color-warning-light-5);
    background: var(--el-color-danger-light-9);

    .summary-value { color: var(--el-color-warning); }
    .summary-icon { color: var(--el-color-warning); background: var(--el-color-warning-light-7); }
  }

  &.is-total {
    border-color: var(--el-color-primary-light-5);
    background: var(--el-color-primary-light-9);

    .summary-value { color: var(--el-color-primary); }
    .summary-icon { color: var(--el-color-primary); background: var(--el-color-primary-light-7); }
  }
}

.summary-icon {
  flex: 0 0 38px;
  width: 38px;
  height: 38px;
  line-height: 38px;
  text-align: center;
  border-radius: 10px;
  font-size: 20px;
  color: var(--el-text-color-secondary);
  background: var(--el-fill-color);

  .el-icon { vertical-align: middle; }

  &.is-info {
    color: var(--el-color-info);
    background: var(--el-color-info-light-9);
  }
}

.summary-content {
  min-width: 0;
}

.summary-label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  white-space: nowrap;
}

.summary-value {
  margin-top: 4px;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.1;
  color: var(--el-text-color-primary);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.section-title-bar {
  width: 3px;
  height: 14px;
  border-radius: 2px;
  background: var(--el-color-primary);
}

.section-title-tip {
  margin-left: auto;
  font-size: 12px;
  font-weight: 400;
  color: var(--el-text-color-placeholder);
}

.result-table {
  font-size: 13px;

  :deep(th.el-table__cell) {
    background: var(--el-fill-color-light);
  }
}

.sheet-cell {
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.expand-detail {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  padding: 12px 16px;
  background: var(--el-fill-color-lighter);
}

.detail-block {
  flex: 1 1 260px;
  min-width: 0;
}

.detail-label {
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 600;

  &.is-success { color: var(--el-color-success); }
  &.is-danger { color: var(--el-color-danger); }
}

.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  max-height: 120px;
  overflow-y: auto;
}

.user-tag {
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail-empty {
  flex: 1;
  font-size: 12px;
  color: var(--el-text-color-placeholder);
}

.failure-panel {
  margin-top: 18px;
  border: 1px solid var(--el-color-danger-light-5);
  border-radius: 10px;
  overflow: hidden;
  background: var(--el-color-danger-light-9);
}

.failure-panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  font-size: 14px;
  font-weight: 600;
  color: var(--el-color-danger);
  border-bottom: 1px solid var(--el-color-danger-light-5);
  background: var(--el-color-danger-light-8);
}

.failure-panel-count {
  margin-left: auto;
}

.failure-panel-body {
  padding: 12px 14px;
  max-height: 220px;
  overflow-y: auto;
}

.failure-group {
  & + .failure-group {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px dashed var(--el-color-danger-light-5);
  }
}

.failure-group-title {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.failure-group-count {
  margin-left: 6px;
  font-size: 12px;
  font-weight: 400;
  color: var(--el-color-danger);
}

.num-success {
  color: var(--el-color-success);
  font-weight: 600;
}

.num-danger {
  color: var(--el-color-danger);
  font-weight: 600;
}

.num-muted {
  color: var(--el-text-color-placeholder);
}

.num-total {
  color: var(--el-color-primary);
  font-weight: 600;
}
</style>

<!-- 弹层被 teleport 到 body，使用类名限定作用域 -->
<style lang="scss">
.fc-send-result-dialog {
  border: 1px solid var(--el-border-color-light);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.14);

  .el-dialog__header {
    margin-right: 0;
    padding: 0;
    background: linear-gradient(135deg, var(--el-fill-color-lighter) 0%, var(--el-bg-color) 100%);
  }

  .el-dialog__body {
    padding: 20px 22px 12px;
  }

  .el-dialog__footer {
    padding: 12px 22px 18px;
  }
}
</style>
