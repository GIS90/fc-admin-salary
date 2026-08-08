<template>
  <div class="step-preview">

    <div class="preview-header">
      <span>共 <strong>{{ totalCount }}</strong> 条数据</span>
      <div v-if="invalidCount > 0">
        <el-tag type="danger">存在校验未通过人员，请检查</el-tag>
      </div>
      <div v-else>
        <el-tag type="success">数据通过校验，允许导入</el-tag>
      </div>
    </div>

    <!-- table -->
    <el-table ref="previewRef"
        style="width: 100%"
        :data="props.previewData"
        :border="tableAttrs.border"
        :max-height="tableAttrs.maxHeight"
        :stripe="tableAttrs.stripe"
        :header-cell-style="headerCellStyle"
        v-loading="props.loading"
    >
      <el-table-column prop="id" label="序号" :width="tableWidth.id" align="center" />
      <el-table-column prop="rtxId" label="账号" align="center" />
      <el-table-column prop="name" label="昵称" align="center" />
      <el-table-column prop="sex" label="性别" align="center">
        <template #default="{ row }">
          {{ sexMap[row.sex] || '未知' }}
        </template>
      </el-table-column>
      <el-table-column prop="email" label="邮箱" align="center" />
      <el-table-column prop="phone" label="手机号" align="center" />
      <el-table-column prop="introduction" label="个性签名" align="center" />
      <el-table-column prop="role" label="权限" align="center" />
      <el-table-column prop="introduction" label="数据状态" align="center">
        <template #default="{ row }">
          <div v-if="row.status === false">有效</div>
          <el-button v-else type="danger" dashed>{{ row.message }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 数据统计 -->
    <div v-if="totalCount > 0" class="preview-stats">
      <el-descriptions :column="3" border>
        <el-descriptions-item label="总数据" align="center">{{ totalCount }}</el-descriptions-item>
        <el-descriptions-item label="有效数据" align="center">{{ validCount }}</el-descriptions-item>
        <el-descriptions-item label="无效数据" align="center">{{ invalidCount }}</el-descriptions-item>
      </el-descriptions>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import { tableWidth } from "@/utils/attrs/table";

const props = defineProps<{
  previewData: any,
  loading: Boolean
}>();

const tableAttrs = reactive({
  stripe: false,
  border: true,
  maxHeight: "550",
});

const sexMap: Record<string, string> = {
  'M': '男',
  'F': '女',
  'NO': '保密'
};

const headerCellStyle = {
  background: '#f5f7fa',
  color: '#303133',
  fontWeight: 700
};
// 总数
const totalCount = computed(() => {
  return props.previewData.length
});
// 有效数据
const validCount = computed(() => {
  return props.previewData.filter((item: { status: boolean }) => !item.status).length
});
// 无效数据
const invalidCount = computed(() => {
  return props.previewData.length - validCount.value
});

// 暴露给父组件
defineExpose({
  totalCount,
  validCount,
  invalidCount
})
</script>

<style scoped>
.step-preview {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-stats {
  margin-top: 10px;
}
</style>
