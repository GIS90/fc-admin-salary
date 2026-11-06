<template>
  <el-dialog
      :model-value="props.visible"
      :width="dgField.width"
      :top="dgField.top"
      :modal="dgField.modal"
      :lock-scroll="dgField.lockScroll"
      :open-delay="dgField.openDelay"
      :close-delay="dgField.closeDelay"
      :close-on-click-modal="dgField.closeOnClickModal"
      :close-on-press-escape="dgField.closeOnPressEscape"
      :show-close="dgField.showClose"
      :draggable="dgField.draggable"
      :center="dgField.center"
      :align-center="dgField.alignCenter"
      @open="openDialog"
      @close="closeDialog"
  >
    <!--header-->
    <template #header>
      <div class="my-dialog-header">
        <div class="my-dialog-header-title">{{ dgField.title }}</div>
        <div class="my-dialog-header-icon">
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
      <div class="avatar-view">
        <div class="avatar-view-image">
          <el-image v-if="detail.url" :src="detail.url" :preview-src-list="[detail.url]" preview-teleported fit="contain" />
        </div>
        <el-descriptions :column="1" border class="avatar-view-desc">
          <el-descriptions-item label="头像名称">{{ detail.name || '-' }}</el-descriptions-item>
          <el-descriptions-item label="头像类型">{{ typeLabel(detail.type) }}</el-descriptions-item>
          <el-descriptions-item label="头像标签">
            <el-tag v-for="item in tagList(detail.tag)" :key="item" size="small" class="avatar-tag">{{ item }}</el-tag>
            <span v-if="!detail.tag">-</span>
          </el-descriptions-item>
          <el-descriptions-item label="尺寸 / 格式">{{ dimensionText }}</el-descriptions-item>
          <el-descriptions-item label="文件大小">{{ formatFileSize(detail.size) }}</el-descriptions-item>
          <el-descriptions-item label="映射数量">{{ detail.count || 0 }}</el-descriptions-item>
          <el-descriptions-item label="备注说明">{{ detail.summary || '-' }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="detail.status ? 'info' : 'success'" size="small">
              {{ detail.status ? '已停用' : '已启用' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="上传时间">{{ detail.createTime || '-' }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </div>

    <!--footer-->
    <template #footer>
      <div class="my-dialog-footer">
        <el-button type="primary" @click="closeDialog">关 闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang='ts'>
import { ref, reactive, computed, defineProps, defineEmits, onMounted } from 'vue';
import { AvatarModelDetail } from "@/models/systemModel";
import { SysOpsAvatarApi } from "@/api/modules/systemOps";
import { DictEnumOptionApi } from "@/api/modules/common";
import { dialogField } from "@/utils/attrs/field";

const dgConfigField = reactive({
  title: '查看头像',
  width: '42%'
});
const dgField = {...dialogField, ...dgConfigField}; // DIALOG属性
const emit = defineEmits(['update:visible']);
const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
    default: false
  },
  md5: {
    type: String,
    required: true,
    default: ''
  }
});

// 关闭
function closeDialog() {
  emit('update:visible', false);
};

// 打开
function openDialog() {
  detail.value = {} as AvatarModelDetail;
  fetchApiData(props.md5);
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//              ↑Dialog通用配置         ↓定制化方法
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// 头像类型选项
const typeOptions = ref<Array<{ label: string; value: string }>>([]);
onMounted(async () => {
  const response = await DictEnumOptionApi({ name: 'avatar-type' });
  if (response.data) {
    typeOptions.value = response.data as Array<{ label: string; value: string }>;
  }
});

// 详情数据
const detail = ref<AvatarModelDetail>({} as AvatarModelDetail);

// 请求数据API
const fetchApiData = async (md5: string) => {
  const response = await SysOpsAvatarApi({ md5 });
  if (response.data) {
    const res = response as { data: AvatarModelDetail };
    detail.value = res.data;
  }
};

// 类型名称
const typeLabel = (value: string) => {
  return typeOptions.value.find(item => item.value === value)?.label || value || '-';
};

// 标签
const tagList = (tag: string) => {
  return tag ? tag.split(',').map(item => item.trim()).filter(Boolean) : [];
};

// 尺寸 / 格式
const dimensionText = computed(() => {
  const dimension = detail.value.width && detail.value.height
      ? `${detail.value.width} × ${detail.value.height}` : '-';
  return `${dimension} / ${detail.value.format || '-'}`;
});

// 文件大小
const formatFileSize = (bytes: number) => {
  if (!bytes || bytes <= 0) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
};
</script>

<style scoped>
.avatar-view {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.avatar-view-image {
  flex: 0 0 200px;
  width: 200px;
  height: 200px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  overflow: hidden;
  background-color: var(--el-fill-color-lighter);
}

.avatar-view-image .el-image {
  width: 100%;
  height: 100%;
}

.avatar-view-desc {
  flex: 1;
  min-width: 0;
}

.avatar-tag {
  margin-right: 4px;
}
</style>
