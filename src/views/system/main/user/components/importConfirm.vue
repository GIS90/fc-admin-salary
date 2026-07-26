<template>
  <div class="step-confirm">
    <el-result v-if="invalidCount === 0" icon="success" title="校验通过">
      <template #extra>
        <div class="confirm-info">
          <p>即将导入 <strong>{{ importData.length }}</strong> 条用户数据</p>
          <p class="warning-text">⚠️ 导入后数据不可撤销，请确认数据无误后再操作</p>
        </div>
      </template>
    </el-result>
    <el-result v-else icon="error" title="校验未通过">
      <template #extra>
        <div class="confirm-info">
          <p class="info_red_weight">⚠️ 存在未通过校验人员（{{ invalidCount }} 人），请先对表格进行修改，再进行导入</p>
        </div>
      </template>
    </el-result>

    <!-- 数据汇总 -->
    <el-descriptions :column="4" border size="default" style="margin-top: 20px;">
      <el-descriptions-item label="总数据">{{ importData.length }}</el-descriptions-item>
      <el-descriptions-item label="账号数">
        <el-tag type="primary">{{ uniqueRtxId }} 个</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="邮箱数">
        <el-tag type="success">{{ uniqueEmail }} 个</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="手机号数">
        <el-tag type="success">{{ uniquePhone }} 个</el-tag>
      </el-descriptions-item>
    </el-descriptions>

    <!-- 加载状态 -->
    <div v-if="loading" class="import-loading">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>正在导入数据，请稍候...</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Loading } from '@element-plus/icons-vue';

const props = defineProps<{
  importData: any[]
  loading: boolean
}>();

const uniqueRtxId = computed(() => {
  return new Set(props.importData.map(item => item.rtxId).filter(v => v !== null && v !== undefined && v !== '')).size
});

const uniqueEmail = computed(() => {
  return new Set(props.importData.map(item => item.email).filter(v => v !== null && v !== undefined && v !== '')).size
});

const uniquePhone = computed(() => {
  return new Set(props.importData.map(item => item.phone).filter(v => v !== null && v !== undefined && v !== '')).size
});

// 无效数据
const invalidCount = computed(() => {
  return props.importData.filter(item => item.status === true).length
});
</script>

<style scoped>
.step-confirm {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
}

.confirm-info {
  text-align: center;
  font-size: 18px;
}

.warning-text {
  color: #e6a23c;
  font-size: 16px;
  margin-top: 10px;
}

.import-loading {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  color: #409eff;
  font-size: 24px;
}
</style>
