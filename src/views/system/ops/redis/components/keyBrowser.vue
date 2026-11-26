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
      @close="closeDialog"
  >
    <template #header>
      <div class="my-dialog-header">
        <div class="my-dialog-header-title">Redis Key / Value 浏览</div>
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

    <div class="my-dialog-body key-browser">
      <div class="browser-summary">
        <div class="summary-card">
          <span class="summary-label">Redis配置</span>
          <span class="summary-value">{{ configText }}</span>
        </div>
        <div class="summary-card">
          <span class="summary-label">当前筛选</span>
          <span class="summary-value mono">{{ activePattern }}</span>
        </div>
        <div class="summary-card">
          <span class="summary-label">返回数量</span>
          <span class="summary-value">{{ total }} / {{ activeLimit }}</span>
        </div>
      </div>

      <div class="browser-toolbar">
        <el-input v-model="pattern" class="pattern-input" clearable placeholder="输入 key 表达式，例如 app:cache:*"
                  @keyup.enter="loadKeys" @clear="loadKeys">
          <template #prepend>KEY筛选</template>
        </el-input>
        <el-select v-model="limit" class="limit-select" aria-label="返回数量">
          <el-option :value="100" label="最多100条" />
          <el-option :value="200" label="最多200条" />
          <el-option :value="500" label="最多500条" />
          <el-option :value="5000" label="最多5000条" />
          <el-option :value="10000" label="最多10000条" />
        </el-select>
        <el-button type="primary" icon="Search" :loading="loading" @click="loadKeys">查询</el-button>
        <el-button icon="RefreshLeft" @click="resetHandle">重置</el-button>
        <el-tooltip effect="dark" content="刷新当前筛选" placement="top">
          <el-button icon="Refresh" :loading="loading" @click="loadKeys" />
        </el-tooltip>
      </div>

      <el-alert v-if="truncated" class="truncate-alert" type="warning" :closable="false" show-icon
                title="已达到本次读取上限，展示结果可能不完整，请细化 key 筛选条件或调大上限。" />

      <el-table :data="list" v-loading="loading" border stripe size="default" max-height="420" style="width: 100%">
        <el-table-column type="index" label="序号" width="70" align="center" />
        <el-table-column prop="key" label="缓存键" min-width="240" show-overflow-tooltip>
          <template #default="scope">
            <span class="mono">{{ scope.row.key }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" width="100" align="center">
          <template #default="scope">
            <el-tag :type="typeTag(scope.row.type)" effect="plain" size="small">{{ scope.row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="过期时间" width="120" align="center">
          <template #default="scope">
            <el-tag :type="ttlTag(scope.row.ttl)" effect="plain" size="small">{{ scope.row.ttlText }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="值" min-width="320">
          <template #default="scope">
            <div class="value-cell">
              <span class="value-text" :title="scope.row.value">{{ scope.row.value || '-' }}</span>
              <el-tooltip effect="dark" content="复制值" placement="top">
                <el-button link type="primary" icon="CopyDocument" @click="copyText(scope.row.value)" />
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <template #empty><el-empty description="没有匹配的缓存键" :image-size="70" /></template>
      </el-table>
    </div>

    <template #footer>
      <div class="my-dialog-footer">
        <el-button v-bind="buttonField" @click="closeDialog">关 闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { SysOpsRedisKeysApi } from '@/api/modules/systemOps';
import type { RedisKeyValueModel } from '@/models/systemModel';
import { dialogField, buttonField } from '@/utils/attrs/field';

const props = defineProps({
  visible: { type: Boolean, required: true, default: false },
  md5: { type: String, default: '' },
  configName: { type: String, default: '' }
});
const emit = defineEmits(['update:visible']);

const dgConfigField = reactive({ width: '72%', top: '2%' });
const dgField = { ...dialogField, ...dgConfigField };
const fullView = ref(dgField.fullScreen);
const fullViewText = ref('全屏');

const pattern = ref('*');
const limit = ref(200);
const list = ref<RedisKeyValueModel[]>([]);
const total = ref(0);
const truncated = ref(false);
const loading = ref(false);
const responseConfig = ref('');
const activePattern = ref('*');
const activeLimit = ref(200);

const configText = computed(() => responseConfig.value || props.configName || '-');

const TYPE_TAGS: Record<string, string> = {
  string: 'primary',
  hash: 'success',
  list: 'warning',
  set: 'info',
  zset: 'danger',
  stream: 'info'
};
const typeTag = (type: string) => TYPE_TAGS[type] || 'info';
const ttlTag = (ttl: number) => ttl === -1 ? 'info' : (ttl > 0 ? (ttl <= 3600 ? 'warning' : 'success') : 'danger');

const loadKeys = async () => {
  if (!props.md5) {
    ElMessage.warning('缺少Redis配置标识');
    return;
  }
  loading.value = true;
  try {
    const finalPattern = (pattern.value || '').trim() || '*';
    const response = await SysOpsRedisKeysApi({ md5: props.md5, pattern: finalPattern, limit: limit.value });
    if (response.code === 100 && response.data) {
      list.value = response.data.list || [];
      total.value = response.data.total ?? list.value.length;
      truncated.value = Boolean(response.data.truncated);
      responseConfig.value = response.data.config || '';
      activePattern.value = response.data.pattern || finalPattern;
      activeLimit.value = response.data.limit || limit.value;
    } else {
      list.value = [];
      total.value = 0;
      truncated.value = false;
    }
  } finally {
    loading.value = false;
  }
};

const resetHandle = () => {
  pattern.value = '*';
  limit.value = 200;
  loadKeys();
};

const copyText = async (text?: string) => {
  if (!navigator.clipboard) {
    ElMessage.warning('当前浏览器不支持自动复制');
    return;
  }
  try {
    await navigator.clipboard.writeText(text || '');
    ElMessage.success('已复制到剪贴板');
  } catch {
    ElMessage.warning('复制失败，请手动选择复制');
  }
};

watch(fullView, (value) => {
  fullViewText.value = value ? '取消全屏' : '全屏';
}, { immediate: true });

watch(() => props.visible, (visible) => {
  if (!visible) return;
  pattern.value = '*';
  limit.value = 200;
  loadKeys();
});

function closeDialog() {
  emit('update:visible', false);
}

function fullScreen() {
  fullView.value = !fullView.value;
}
</script>

<style scoped>
.browser-summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 14px;
}
.summary-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 6px;
  background: var(--el-fill-color-blank);
}
.summary-label { font-size: 12px; color: var(--el-text-color-secondary); }
.summary-value { font-size: 14px; font-weight: 600; color: var(--el-text-color-primary); word-break: break-all; }
.browser-toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}
.pattern-input { width: 360px; }
.limit-select { width: 130px; }
.truncate-alert { margin-bottom: 12px; }
.mono { font-family: Consolas, Monaco, monospace; }
.value-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}
.value-text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-family: Consolas, Monaco, monospace;
  font-size: 12px;
}
</style>
