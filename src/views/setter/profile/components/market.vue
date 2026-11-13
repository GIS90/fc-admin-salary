<template>
  <el-card shadow="never" class="avatar-market">
    <template #header>
      <div class="market-header">
        <div>
          <div class="market-title">头像超市</div>
          <div class="market-subtitle">挑选喜欢的头像，收藏后可在“我的收藏”中快速找到</div>
        </div>
        <div class="current-avatar">
          <el-avatar :size="42" :src="authStore.userInfo.avatar" />
          <div>
            <div class="current-label">当前头像</div>
            <div class="current-name">{{ authStore.userInfo.userName }}</div>
          </div>
        </div>
      </div>
    </template>

    <div class="category-bar">
      <div class="category-list">
        <el-radio-group v-model="activeType" class="category-group" @change="selectTypeChange">
          <el-radio-button value="">全部</el-radio-button>
          <el-radio-button
            v-for="item in typeOptions"
            :key="item.value"
            :value="item.value"
            :disabled="item.disabled"
          >
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </div>
      <el-button
        class="favorite-filter"
        :type="favoriteOnly ? 'warning' : 'default'"
        :icon="Star"
        @click="toggleFavoriteOnly"
      >
        我的收藏
      </el-button>
    </div>

    <div v-loading="loading" class="market-content">
      <div
        v-if="avatarList.length"
        class="avatar-grid"
        :style="{ gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))` }"
      >
        <article
          v-for="row in avatarList"
          :key="row.md5"
          class="avatar-card"
          :class="{ 'is-current': isCurrent(row) }"
        >
          <div class="avatar-image">
            <el-image :src="row.url" :preview-src-list="[row.url]" preview-teleported fit="cover">
              <template #error>
                <div class="image-error">
                  <el-icon><Picture /></el-icon>
                  <span>图片加载失败</span>
                </div>
              </template>
            </el-image>
            <div class="preview-tip">点击预览</div>
            <span v-if="isCurrent(row)" class="current-badge">当前</span>
            <el-button
              class="favorite-button"
              :class="{ 'is-favorite': row.favorite }"
              :icon="row.favorite ? StarFilled : Star"
              :loading="favoriteLoading === row.md5"
              circle
              @click.stop="favoriteHandle(row)"
            />
          </div>
          <div class="avatar-info">
            <div class="avatar-name" :title="row.summary || row.name">{{ row.name }}</div>
            <div class="avatar-meta">
              <span>{{ typeLabel(row.type) }}</span>
              <span>{{ row.count || 0 }} 次使用</span>
            </div>
            <el-button
              class="set-avatar-button"
              :type="isCurrent(row) ? 'success' : 'primary'"
              :plain="!isCurrent(row)"
              :icon="Check"
              :loading="settingLoading === row.md5"
              :disabled="isCurrent(row)"
              @click="setAvatarHandle(row)"
            >
              {{ isCurrent(row) ? '当前头像' : '设为头像' }}
            </el-button>
          </div>
        </article>
      </div>
      <el-empty
        v-else-if="!loading"
        :description="favoriteOnly ? '当前分类下还没有收藏头像' : '当前分类下暂无可用头像'"
      />
    </div>

    <div v-if="total > 0" class="market-pagination">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="pageSizes"
        :current-page="page"
        :page-size="pageSize"
        :total="total"
        @current-change="pageChange"
        @size-change="sizeChange"
      />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Check, Picture, Star, StarFilled } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { DictEnumOptionApi } from '@/api/modules/common';
import { SysConfigXtcsKeyApi } from '@/api/modules/systemConfig';
import {
  SetProfileAvatarFavoriteApi,
  SetProfileAvatarMarketApi,
  SetProfileAvatarSetApi,
} from '@/api/modules/setter';
import { AvatarMarketItem } from '@/models/setterModel';
import { OptionEnumModel } from '@/models/X';
import { tablePageSize, tablePageSizes } from '@/utils/variable';
import { useAuthStore } from '@/store/modules/auth';

const authStore = useAuthStore();
const PAGE_SIZE_STORAGE_KEY = 'avatar_market_page_size';

// 每页条数：优先读取浏览器本地记录，非法值回退系统默认
const getStoredPageSize = () => {
  const stored = Number(localStorage.getItem(PAGE_SIZE_STORAGE_KEY));
  return tablePageSizes.includes(stored) ? stored : tablePageSize;
};

const savePageSize = (value: number) => {
  localStorage.setItem(PAGE_SIZE_STORAGE_KEY, String(value));
};

const loading = ref(false);
const avatarList = ref<AvatarMarketItem[]>([]);
const typeOptions = ref<OptionEnumModel[]>([]);
const activeType = ref('');
const favoriteOnly = ref(false);
const gridColumns = ref(6);
const page = ref(1);
const pageSize = ref(getStoredPageSize());
const total = ref(0);
const pageSizes = tablePageSizes;
const favoriteLoading = ref('');
const settingLoading = ref('');

const fetchTypeOptions = async () => {
  try {
    const response = await DictEnumOptionApi({ name: 'avatar-type' });
    typeOptions.value = (response.data || []) as OptionEnumModel[];
  } catch (e) {
    typeOptions.value = [];
  }
};

const fetchGridColumns = async () => {
  try {
    const response = await SysConfigXtcsKeyApi({ key: 'AVATAR-ROW-COUNT' });
    const value = Number((response.data as { value: string } | undefined)?.value);
    if (Number.isInteger(value) && value > 0) gridColumns.value = value;
  } catch (e) {
    // 未配置系统参数时保持默认每行6张
  }
};

const fetchAvatarList = async () => {
  loading.value = true;
  try {
    const response = await SetProfileAvatarMarketApi({
      page: page.value,
      pageSize: pageSize.value,
      type: activeType.value || undefined,
      favorite: favoriteOnly.value,
    });
    avatarList.value = response.data?.list || [];
    total.value = response.data?.total || 0;
  } finally {
    loading.value = false;
  }
};

const selectTypeChange = () => {
  page.value = 1;
  fetchAvatarList();
};

const toggleFavoriteOnly = () => {
  favoriteOnly.value = !favoriteOnly.value;
  page.value = 1;
  fetchAvatarList();
};

const isCurrent = (row: AvatarMarketItem) => row.url === authStore.userInfo.avatar;

const typeLabel = (type: string) => {
  return typeOptions.value.find(item => item.value === type)?.label || '未分类';
};

const favoriteHandle = async (row: AvatarMarketItem) => {
  if (favoriteLoading.value) return;
  const value = !row.favorite;
  favoriteLoading.value = row.md5;
  try {
    await SetProfileAvatarFavoriteApi({ md5: row.md5, value });
    ElMessage.success(value ? '收藏成功' : '已取消收藏');
    if (favoriteOnly.value && !value) {
      if (avatarList.value.length === 1 && page.value > 1) page.value -= 1;
      await fetchAvatarList();
      return;
    }
    row.favorite = value;
  } finally {
    favoriteLoading.value = '';
  }
};

const setAvatarHandle = async (row: AvatarMarketItem) => {
  if (isCurrent(row) || settingLoading.value) return;
  settingLoading.value = row.md5;
  try {
    const response = await SetProfileAvatarSetApi({ md5: row.md5 });
    authStore.setUserInfoField('avatar', response.data?.url || row.url);
    row.count = response.data?.count ?? row.count;
    ElMessage.success('头像设置成功');
  } finally {
    settingLoading.value = '';
  }
};

const pageChange = (value: number) => {
  page.value = value;
  fetchAvatarList();
};

const sizeChange = (value: number) => {
  pageSize.value = value;
  page.value = 1;
  savePageSize(value);
  fetchAvatarList();
};

onMounted(() => {
  fetchTypeOptions();
  fetchGridColumns();
  fetchAvatarList();
});
</script>

<style scoped>
.avatar-market {
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 10px;
}

.market-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.market-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.market-subtitle {
  margin-top: 6px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.current-avatar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px;
  background: var(--el-fill-color-light);
  border-radius: 8px;
}

.current-label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.current-name {
  max-width: 140px;
  margin-top: 2px;
  overflow: hidden;
  font-size: 13px;
  color: var(--el-text-color-primary);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.category-bar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--el-border-color-extra-light);
}

.category-list {
  flex: 1;
  min-width: 0;
}

.category-group {
  display: flex;
  flex-wrap: wrap;
  row-gap: 8px;
}

.category-group :deep(.el-radio-button__inner) {
  padding: 9px 18px;
  font-weight: 500;
  border-left: 1px solid var(--el-border-color-lighter);
  transition: color 0.2s, background-color 0.2s, border-color 0.2s, box-shadow 0.2s;
}

.category-group :deep(.el-radio-button:not(:first-child)) {
  margin-left: -1px;
}

.category-group :deep(.el-radio-button__inner:hover) {
  color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
}

.category-group :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  font-weight: 600;
  box-shadow: -1px 0 0 0 var(--el-color-primary);
}

.favorite-filter {
  flex-shrink: 0;
}

.market-content {
  min-height: 360px;
  padding-top: 20px;
}

.avatar-grid {
  display: grid;
  gap: 18px;
}

.avatar-card {
  min-width: 0;
  overflow: hidden;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 10px;
  transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s;
}

.avatar-card:hover {
  border-color: var(--el-color-primary);
  box-shadow: 0 8px 20px rgb(0 0 0 / 10%);
  transform: translateY(-3px);
}

.avatar-card.is-current {
  border-color: var(--el-color-success);
  box-shadow: 0 0 0 1px var(--el-color-success-light-5);
}

.avatar-image {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  background: var(--el-fill-color-light);
}

.avatar-image :deep(.el-image) {
  display: block;
  width: 100%;
  height: 100%;
  cursor: zoom-in;
  transition: transform 0.3s;
}

.avatar-card:hover .avatar-image :deep(.el-image) {
  transform: scale(1.04);
}

.preview-tip {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 7px 0;
  font-size: 12px;
  color: #fff;
  text-align: center;
  pointer-events: none;
  background: rgb(0 0 0 / 45%);
  opacity: 0;
  transition: opacity 0.2s;
}

.avatar-card:hover .preview-tip {
  opacity: 1;
}

.current-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 3px 8px;
  font-size: 12px;
  line-height: 18px;
  color: #fff;
  background: var(--el-color-success);
  border-radius: 10px;
  box-shadow: 0 2px 6px rgb(0 0 0 / 15%);
}

.favorite-button {
  position: absolute;
  top: 8px;
  right: 8px;
  color: var(--el-text-color-secondary);
  background: rgb(255 255 255 / 92%);
  border: none;
  box-shadow: 0 2px 8px rgb(0 0 0 / 12%);
}

.favorite-button:hover,
.favorite-button.is-favorite {
  color: var(--el-color-warning);
  background: #fff;
}

.image-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 8px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.image-error .el-icon {
  font-size: 28px;
}

.avatar-info {
  padding: 12px;
}

.avatar-name {
  overflow: hidden;
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.avatar-meta {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-top: 7px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.avatar-meta span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.set-avatar-button {
  width: 100%;
  margin-top: 12px;
}

.market-pagination {
  display: flex;
  justify-content: flex-end;
  padding-top: 22px;
}

@media (max-width: 900px) {
  .market-header,
  .category-bar {
    align-items: stretch;
    flex-direction: column;
  }

  .current-avatar {
    align-self: flex-start;
  }

  .favorite-filter {
    align-self: flex-start;
  }
}
</style>
