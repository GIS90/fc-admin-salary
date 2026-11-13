<template>
  <el-card shadow="never" class="avatar-market">
    <template #header>
      <div class="market-header">
        <div>
          <div class="market-title">头像超市</div>
          <div class="market-subtitle">挑选喜欢的头像，收藏后可在“我的收藏”中快速找到</div>
        </div>
        <div class="current-avatar">
          <el-avatar :size="42" :src="previewAvatar" />
          <div>
            <div class="current-label">预览头像</div>
            <div class="current-name">{{ authStore.userInfo.userName }}</div>
          </div>
        </div>
      </div>
    </template>

    <div class="filter-panel">
      <div class="filter-row">
        <div class="filter-main">
          <span class="filter-label">查询类别</span>
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
        </div>
        <div class="filter-actions">
          <el-button
            :type="favoriteOnly ? 'warning' : 'default'"
            :icon="Star"
            @click="toggleFavoriteOnly"
          >
            我的收藏
          </el-button>
          <el-button
            text
            :icon="queryExpanded ? ArrowUp : ArrowDown"
            @click="queryExpanded = !queryExpanded"
          >
            {{ queryExpanded ? '收起查询' : '展开查询' }}
          </el-button>
        </div>
      </div>

      <div v-show="queryExpanded" class="query-body">
        <div class="filter-row">
          <div class="filter-main">
            <span class="filter-label">排序方式</span>
            <el-radio-group v-model="sortBy" class="sort-group" @change="sortChange">
              <el-radio-button value="">默认</el-radio-button>
              <el-radio-button value="count">使用最多</el-radio-button>
              <el-radio-button value="favorite">收藏最多</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <div class="search-row">
          <span class="filter-label">关键字</span>
          <el-row :gutter="20" class="search-form">
            <el-col :span="12">
              <el-input
                v-model="searchInput"
                placeholder="输入头像名称、标签、描述进行模糊查询"
                :prefix-icon="Search"
                clearable
                @keyup.enter="searchHandle"
                @clear="searchHandle"
              />
            </el-col>
            <el-col :span="12">
              <div class="search-buttons">
                <el-button type="primary" :icon="Search" @click="searchHandle">查询</el-button>
                <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
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
          @mouseenter="hoverAvatar = row.url"
          @mouseleave="hoverAvatar = ''"
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
              <span>使用 {{ row.count || 0 }}</span>
              <span>收藏 {{ row.favoriteCount || 0 }}</span>
            </div>
            <div class="avatar-actions">
              <el-tooltip content="查看详情" placement="top">
                <el-button type="primary" plain :icon="View" circle @click.stop="viewHandle(row)" />
              </el-tooltip>
              <el-tooltip :content="isCurrent(row) ? '当前头像' : '设为头像'" placement="top">
                <el-button
                  :type="isCurrent(row) ? 'success' : 'primary'"
                  :plain="!isCurrent(row)"
                  :icon="Check"
                  :loading="settingLoading === row.md5"
                  :disabled="isCurrent(row)"
                  circle
                  @click.stop="setAvatarHandle(row)"
                />
              </el-tooltip>
            </div>
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

    <!-- 头像详情 -->
    <AvatarView v-model:visible="viewVisible" :md5="viewMd5" />
  </el-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { ArrowDown, ArrowUp, Check, Picture, Refresh, Search, Star, StarFilled, View } from '@element-plus/icons-vue';
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
import { tablePageSize } from '@/utils/variable';
import { useAuthStore } from '@/store/modules/auth';
import AvatarView from '@/views/system/ops/avatar/components/view.vue';

const authStore = useAuthStore();
const PAGE_SIZE_STORAGE_KEY = 'avatar_market_page_size';
// 每页展示的行数，每页条数 = 行数 × 每行列数，保证每页图片都是完整行
const PAGE_ROW_OPTIONS = [2, 3, 5, 10, 30,100];

// 每页条数：优先读取浏览器本地记录，非法值回退系统默认
const getStoredPageSize = () => {
  const stored = Number(localStorage.getItem(PAGE_SIZE_STORAGE_KEY));
  return Number.isInteger(stored) && stored > 0 ? stored : tablePageSize;
};

const savePageSize = (value: number) => {
  localStorage.setItem(PAGE_SIZE_STORAGE_KEY, String(value));
};

const loading = ref(false);
const avatarList = ref<AvatarMarketItem[]>([]);
const typeOptions = ref<OptionEnumModel[]>([]);
const activeType = ref('');
const favoriteOnly = ref(false);
const sortBy = ref<'' | 'count' | 'favorite'>('');
const queryExpanded = ref(false);
const searchInput = ref('');
const content = ref('');
const gridColumns = ref(6);
const page = ref(1);
const pageSizes = computed(() => PAGE_ROW_OPTIONS.map(rows => rows * gridColumns.value));
const pageSize = ref(getStoredPageSize());
const total = ref(0);
const favoriteLoading = ref('');
const settingLoading = ref('');
// 鼠标悬停的图片地址：为空时预览当前头像
const hoverAvatar = ref('');
const previewAvatar = computed(() => hoverAvatar.value || authStore.userInfo.avatar);
// 查看详情
const viewVisible = ref(false);
const viewMd5 = ref('');

// 每页条数必须是每行列数的倍数，否则回退为最接近的完整行条数
const normalizePageSize = () => {
  if (pageSizes.value.includes(pageSize.value)) return;
  pageSize.value = pageSizes.value.find(size => size >= tablePageSize) ?? pageSizes.value[0];
  savePageSize(pageSize.value);
};

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
  normalizePageSize();
};

const fetchAvatarList = async () => {
  loading.value = true;
  try {
    const response = await SetProfileAvatarMarketApi({
      page: page.value,
      pageSize: pageSize.value,
      type: activeType.value || undefined,
      favorite: favoriteOnly.value ? 1 : undefined,
      sort: sortBy.value || undefined,
      content: content.value || undefined,
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

const sortChange = () => {
  page.value = 1;
  fetchAvatarList();
};

const searchHandle = () => {
  content.value = searchInput.value.trim();
  page.value = 1;
  fetchAvatarList();
};

const resetSearch = () => {
  searchInput.value = '';
  content.value = '';
  activeType.value = '';
  sortBy.value = '';
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
    const response = await SetProfileAvatarFavoriteApi({ md5: row.md5, value });
    ElMessage.success(value ? '收藏成功' : '已取消收藏');
    if (favoriteOnly.value && !value) {
      if (avatarList.value.length === 1 && page.value > 1) page.value -= 1;
      await fetchAvatarList();
      return;
    }
    row.favorite = value;
    row.favoriteCount = response.data?.favoriteCount ?? row.favoriteCount;
  } finally {
    favoriteLoading.value = '';
  }
};

const viewHandle = (row: AvatarMarketItem) => {
  viewMd5.value = row.md5;
  viewVisible.value = true;
};

const setAvatarHandle = async (row: AvatarMarketItem) => {  if (isCurrent(row) || settingLoading.value) return;
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

onMounted(async () => {
  fetchTypeOptions();
  await fetchGridColumns();
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

.filter-panel {
  padding: 16px;
  background: var(--el-fill-color-lighter);
  border: 1px solid var(--el-border-color-extra-light);
  border-radius: 8px;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px 16px;
}

.filter-main {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.filter-label {
  flex-shrink: 0;
  width: 60px;
  font-size: 13px;
  color: var(--el-text-color-regular);
}

.category-list {
  flex: 1;
  min-width: 0;
}

.category-group,
.sort-group {
  display: flex;
  flex-wrap: wrap;
  row-gap: 8px;
}

.category-group :deep(.el-radio-button__inner),
.sort-group :deep(.el-radio-button__inner) {
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  border-left: 1px solid var(--el-border-color-lighter);
  transition: color 0.2s, background-color 0.2s, border-color 0.2s, box-shadow 0.2s;
}

.category-group :deep(.el-radio-button:not(:first-child)),
.sort-group :deep(.el-radio-button:not(:first-child)) {
  margin-left: -1px;
}

.category-group :deep(.el-radio-button__inner:hover),
.sort-group :deep(.el-radio-button__inner:hover) {
  color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
}

.category-group :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner),
.sort-group :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  font-weight: 600;
  box-shadow: -1px 0 0 0 var(--el-color-primary);
}

.filter-actions {
  display: flex;
  flex-shrink: 0;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.query-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed var(--el-border-color);
}

.search-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-form {
  flex: 1;
}

.search-buttons {
  display: flex;
  align-items: center;
  gap: 10px;
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
  flex-wrap: wrap;
  gap: 2px 10px;
  margin-top: 7px;
  font-size: 12px;
  line-height: 1.5;
  color: var(--el-text-color-secondary);
}

.avatar-meta span {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.avatar-actions {
  display: flex;
  justify-content: center;
  gap: 14px;
  margin-top: 12px;
}

.market-pagination {
  display: flex;
  justify-content: flex-end;
  padding-top: 22px;
}

@media (max-width: 900px) {
  .market-header,
  .filter-row {
    align-items: stretch;
    flex-direction: column;
  }

  .current-avatar {
    align-self: flex-start;
  }

  .filter-actions {
    align-self: flex-start;
  }

  .filter-main {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    gap: 8px;
  }

  .filter-label {
    width: auto;
  }
}
</style>
