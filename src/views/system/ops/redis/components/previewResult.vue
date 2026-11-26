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
        <div class="my-dialog-header-title">预览结果</div>
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
      <div class="preview-meta">
        <div class="meta-item">
          <span class="meta-label">规则名称</span>
          <span class="meta-value">{{ props.rule || '-' }}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Redis配置</span>
          <span class="meta-value">{{ props.config || '-' }}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">匹配键数</span>
          <span class="meta-value highlight">{{ props.count ?? 0 }}</span>
          <span class="meta-tip">单次上限 {{ props.maxKeys ?? 0 }}</span>
        </div>
        <div class="meta-item expression">
          <span class="meta-label">匹配表达式</span>
          <el-tag type="info" effect="light" class="expression-tag">{{ props.match || '-' }}</el-tag>
        </div>
      </div>

      <div class="preview-section-title">
        <span>示例键名</span>
        <span class="preview-section-tip">最多展示 20 条</span>
      </div>
      <el-table :data="sampleRows" border stripe size="default" max-height="320" style="width: 100%">
        <el-table-column label="序号" width="120" align="center" type="index" />
        <el-table-column label="缓存键" min-width="260" show-overflow-tooltip>
          <template #default="scope">
            <span class="key-text">{{ scope.row.key }}</span>
          </template>
        </el-table-column>
        <template #empty><el-empty description="没有匹配到缓存键" :image-size="70" /></template>
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
import { reactive, ref, watch, computed } from 'vue';
import { dialogField, buttonField } from '@/utils/attrs/field';

const props = defineProps({
  visible: { type: Boolean, required: true, default: false },
  rule: { type: String, default: '' },
  config: { type: String, default: '' },
  match: { type: String, default: '' },
  count: { type: Number, default: 0 },
  maxKeys: { type: Number, default: 0 },
  sample: { type: Array as () => string[], default: () => [] }
});
const emit = defineEmits(['update:visible']);

const dgConfigField = reactive({ title: '预览结果', width: '60%', top: '2%' });
const dgField = { ...dialogField, ...dgConfigField }; // DIALOG属性
const fullView = ref(dgField.fullScreen); // 全屏控制
const fullViewText = ref('全屏');
const sampleRows = computed(() => (props.sample || []).map(key => ({ key })));

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
.preview-meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}
.meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 6px;
  background: var(--el-fill-color-blank);
}
.meta-label { font-size: 12px; color: var(--el-text-color-secondary); }
.meta-value { font-size: 14px; font-weight: 600; color: var(--el-text-color-primary); word-break: break-all; }
.meta-value.highlight { font-size: 20px; color: var(--el-color-primary); }
.meta-tip { font-size: 12px; color: var(--el-text-color-secondary); }
.expression-tag { align-self: flex-start; font-family: Consolas, Monaco, monospace; font-size: 13px; }
.preview-section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}
.preview-section-tip { font-size: 12px; font-weight: 400; color: var(--el-text-color-secondary); }
.key-text { font-family: Consolas, Monaco, monospace; }
</style>
