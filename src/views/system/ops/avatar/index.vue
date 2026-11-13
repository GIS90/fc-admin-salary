<template>
  <el-container>
    <!--操作区-->
    <el-header>
      <div class="left-panel">
        <el-button id="btn-add" class="table-handle-button" :type="buttonField.type" :plain="buttonField.plain" :size="buttonField.size" icon="Plus" @click="addHandle">
          单张新增
        </el-button>
        <el-button id="btn-batch-upload" class="table-handle-button" :type="buttonField.type" :plain="buttonField.plain" :size="buttonField.size" icon="Upload" @click="batchUploadHandle">
          批量上传
        </el-button>
        <el-button id="btn-batch-delete" type="danger" icon="Delete" :plain="buttonField.plain" :size="buttonField.size" @click="batchDeleteHandle" :disabled="!fcTableRef?.isSelected">
          批量删除
        </el-button>
      </div>
      <div class="right-panel">
        <el-button
          text
          :icon="queryExpanded ? 'ArrowUp' : 'ArrowDown'"
          @click="queryExpanded = !queryExpanded"
        >
          {{ queryExpanded ? '收起查询' : '展开查询' }}
        </el-button>
        <el-tooltip effect="dark" :content="viewMode === 'table' ? '切换到图片浏览' : '切换到数据列表'" placement="top">
          <el-button id="btn-view-mode" :type="buttonField.type" :plain="buttonField.plain" :size="buttonField.size"
                     :icon="viewMode === 'table' ? 'Grid' : 'List'" @click="toggleViewMode" />
        </el-tooltip>
      </div>
    </el-header>

    <!--数据区-->
    <el-main class="nopadding avatar-main">
      <!--查询条件（头像超市同款筛选）-->
      <div class="avatar-filter">
        <div class="filter-row">
          <div class="filter-main">
            <span class="filter-label">查询类别</span>
            <div class="category-list">
              <el-radio-group v-model="requestParam.type" class="category-group" @change="filterChange">
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
        </div>
        <div v-show="queryExpanded" class="query-body">
          <div class="filter-row">
            <div class="filter-main">
              <span class="filter-label">是否收藏</span>
              <el-radio-group v-model="requestParam.favorite" @change="filterChange">
                <el-radio-button value="">全部</el-radio-button>
                <el-radio-button value="1">已收藏</el-radio-button>
                <el-radio-button value="0">未收藏</el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div class="filter-row">
            <div class="filter-main">
              <span class="filter-label">排序方式</span>
              <el-radio-group v-model="requestParam.sort" @change="filterChange">
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
                  placeholder="支持按名称/标签/描述模糊查询，输入后点击查询"
                  clearable
                  @keyup.enter="searchHandle"
                  @clear="searchHandle"
                />
              </el-col>
              <el-col :span="12">
                <div class="search-buttons">
                  <el-button type="primary" icon="Search" @click="searchHandle">查询</el-button>
                  <el-button icon="Refresh" @click="resetSearch">重置</el-button>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>

      <!--数据模式：表格列表-->
      <div v-show="viewMode === 'table'" class="avatar-table-box">
      <fc-filter-table ref="fcTableRef" :tableName="apiName" :requestApi="fetchTableData" :initParam="requestParam" :columns="columns"
                :rowKey="ftField.rowKey" :stripe="ftField.stripe" :border="ftField.border" :pagination="ftField.pagination"
                :showBottomView="ftField.showBottomView" :showRefreshBtn="ftField.showRefreshBtn"
                :showColumnBtn="ftField.showColumnBtn" :showDownloadBtn="ftField.showDownloadBtn">
        <!-- 头像 -->
        <template #url="scope">
          <el-image class="avatar-thumb" :src="scope.row.url" :preview-src-list="[scope.row.url]" preview-teleported fit="cover" />
        </template>
        <!-- 标签 -->
        <template #tag="scope">
          <el-tag v-for="item in scope.row.tag" :key="item" :type="avatarTagColor(item)" size="small" class="avatar-tag">{{ item }}</el-tag>
          <span v-if="!scope.row.tag || !scope.row.tag.length">-</span>
        </template>
        <!-- 尺寸 / 格式 -->
        <template #dimension="scope">
          {{ dimensionText(scope.row) }}
        </template>
        <!-- 文件大小 -->
        <template #size="scope">
          {{ formatFileSize(scope.row.size) }}
        </template>
        <!-- 表格操作 -->
        <template #options="scope">
          <el-tooltip effect="dark" content="查看" placement="top">
            <el-icon class="table-handle-icon" @click="viewHandle(scope.row)">
              <View />
            </el-icon>
          </el-tooltip>
          <el-tooltip effect="dark" content="编辑" placement="top">
            <el-icon class="table-handle-icon margin-left-30px" @click="editHandle(scope.row)">
              <EditPen />
            </el-icon>
          </el-tooltip>
          <el-tooltip effect="dark" content="裁剪" placement="top">
            <el-icon class="table-handle-icon margin-left-30px" @click="cropHandle(scope.row)">
              <Crop />
            </el-icon>
          </el-tooltip>
          <el-popconfirm :title="pcField.title" :confirm-button-text="pcField.confirmText" :cancel-button-text="pcField.cancelText"
                         :confirm-button-type="pcField.confirmType" :cancel-button-type="pcField.cancelType"
                         :icon="pcField.icon" :icon-color="pcField.iconColor" :width="pcField.width"
                         @confirm="deleteHandle(scope.row.md5)">
            <template #reference>
              <el-icon class="table-handle-icon margin-left-30px">
                <Delete />
              </el-icon>
            </template>
          </el-popconfirm>
        </template>
        <!-- 状态管理（lock：启用/禁用） -->
        <template #lock="scope">
          <el-switch v-model="scope.row.lock"
                     active-text="禁用"
                     inactive-text="启用"
                     style="--el-switch-on-color: #ff4949; --el-switch-off-color: #13ce66;"
                     @change="lockHandle(scope.row.md5, $event)" />
        </template>
      </fc-filter-table>
      </div>

      <!--图片浏览模式：卡片网格-->
      <div v-show="viewMode === 'grid'" v-loading="gridLoading" class="avatar-grid-box">
        <div class="avatar-grid" :style="{ gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))` }">
          <div v-for="row in gridList" :key="row.md5" class="avatar-card">
            <div class="avatar-card-image">
              <el-image :src="row.url" :preview-src-list="[row.url]" preview-teleported fit="cover" />
              <div class="avatar-card-mask">
                <el-icon><ZoomIn /></el-icon>
              </div>
              <div v-if="row.lock" class="avatar-card-lock">已禁用</div>
            </div>
            <div class="avatar-card-name" :title="row.name">{{ row.name }}</div>
            <div class="avatar-card-meta">
              <el-tooltip effect="dark" content="设置次数" placement="top">
                <span class="stat-cell is-count">
                  <el-icon><TrendCharts /></el-icon>
                  <span>{{ row.count ?? 0 }}</span>
                </span>
              </el-tooltip>
              <el-tooltip effect="dark" content="收藏数" placement="top">
                <span class="stat-cell is-favorite">
                  <el-icon><Star /></el-icon>
                  <span>{{ row.favorite ?? 0 }}</span>
                </span>
              </el-tooltip>
            </div>
            <div class="avatar-card-actions">
              <el-tooltip effect="dark" content="查看" placement="top">
                <el-icon @click="viewHandle(row)">
                  <View />
                </el-icon>
              </el-tooltip>
              <el-tooltip effect="dark" content="编辑" placement="top">
                <el-icon @click="editHandle(row)">
                  <EditPen />
                </el-icon>
              </el-tooltip>
              <el-tooltip effect="dark" content="裁剪" placement="top">
                <el-icon @click="cropHandle(row)">
                  <Crop />
                </el-icon>
              </el-tooltip>
              <el-popconfirm :title="pcField.title" :confirm-button-text="pcField.confirmText" :cancel-button-text="pcField.cancelText"
                             :confirm-button-type="pcField.confirmType" :cancel-button-type="pcField.cancelType"
                             :icon="pcField.icon" :icon-color="pcField.iconColor" :width="pcField.width"
                             @confirm="deleteHandle(row.md5)">
                <template #reference>
                  <el-icon class="avatar-card-delete">
                    <Delete />
                  </el-icon>
                </template>
              </el-popconfirm>
            </div>
          </div>
        </div>
        <el-empty v-if="!gridLoading && gridList.length === 0" description="暂无数据" />
        <div v-if="gridTotal > 0" class="avatar-grid-pagination">
          <el-pagination background layout="total, sizes, prev, pager, next, jumper"
                         :page-sizes="pageSizes" :current-page="gridPage" :page-size="gridPageSize" :total="gridTotal"
                         @current-change="gridPageChange" @size-change="gridSizeChange" />
        </div>
      </div>
    </el-main>

    <!--新增-->
    <Add v-model:visible="addVisible" @reFetchTableData="reFetchTableData" />

    <!--编辑-->
    <Edit v-model:visible="editVisible" :md5="tableRowMd5" @reFetchTableData="reFetchTableData" />

    <!--查看-->
    <AvatarView v-model:visible="viewVisible" :md5="tableRowMd5" />

    <!--裁剪-->
    <AvatarCrop v-model:visible="cropVisible" :md5="tableRowMd5" @reFetchTableData="reFetchTableData" />

    <!--批量删除-->
    <fc-batch-delete v-model:visible="batchDeleteVisible" :api="apiName" :md5List="tableSelectList" @reFetchTableData="reFetchTableData"/>

    <!--批量新增（多张上传）-->
    <BatchAdd v-model:visible="batchUploadVisible" @reFetchTableData="reFetchTableData" />
  </el-container>
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted } from 'vue';
import { SysOpsAvatarListApi, SysOpsAvatarDeleteApi, SysOpsAvatarLockApi } from '@/api/modules/systemOps';
import { ColumnProps, FcFilterTableInstance } from "@/components/fcFilterTable/model";
import { AvatarModelList } from "@/models/systemModel";
import { ElMessage, ElNotification } from 'element-plus';
import { fcTableField, PopConfirmField, buttonField } from "@/utils/attrs/field";
import { TableFieldColumnApi, DictEnumOptionApi } from "@/api/modules/common";
import { OptionEnumModel } from "@/models/X";
import { SysConfigXtcsKeyApi } from "@/api/modules/systemConfig";
import { tablePageSize, tablePageSizes } from "@/utils/variable";
import { avatarTagColor } from "@/utils/utils";
import Add from "./components/add.vue";
import BatchAdd from "./components/batchAdd.vue";
import Edit from "./components/edit.vue";
import AvatarView from "./components/view.vue";
import AvatarCrop from "./components/crop.vue";

// fc-table属性
const fcTableConfig = reactive({
  rowKey: "md5",
});
const ftField = {...fcTableField, ...fcTableConfig};
const pcField = {...PopConfirmField, ...{}};

// fc-Table 实例
const fcTableRef = ref<FcFilterTableInstance>();

// 表头从后端报表配置获取
const columns = ref<ColumnProps<AvatarModelList>[]>([]);

// Dialog状态管理
const addVisible = ref(false);
const editVisible = ref(false);
const viewVisible = ref(false);
const cropVisible = ref(false);
const batchDeleteVisible = ref(false);
const batchUploadVisible = ref(false);

const tableRowMd5 = ref(""); // 默认当前选择的数据MD5
const apiName = "SystemOpsAvatar"; // 组件标识名称
let tableSelectList = reactive([] as string[]); // 当前选择数据Keys列表
const requestParam = reactive({"content": "", "type": "", "favorite": "", "sort": ""});  // 查询条件：关键字/分类/是否收藏/排序
const searchInput = ref(""); // 关键字输入框
const typeOptions = ref<OptionEnumModel[]>([]); // 头像分类选项（字典 avatar-type）
const queryExpanded = ref(false); // 查询条件展开/收起

// 视图模式：table数据列表 / grid图片浏览（记录在Cookie中，默认数据模式）
const VIEW_MODE_COOKIE = 'avatar_view_mode';
const getViewModeCookie = (): 'table' | 'grid' => {
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${VIEW_MODE_COOKIE}=([^;]*)`));
  return match && decodeURIComponent(match[1]) === 'grid' ? 'grid' : 'table';
};
const setViewModeCookie = (mode: 'table' | 'grid') => {
  document.cookie = `${VIEW_MODE_COOKIE}=${mode}; path=/; max-age=${60 * 60 * 24 * 365}`;
};
const viewMode = ref<'table' | 'grid'>(getViewModeCookie());

// 图片浏览模式
const gridLoading = ref(false);
const gridList = ref<AvatarModelList[]>([]);
const gridPage = ref(1);
const gridPageSize = ref(tablePageSize);
const gridTotal = ref(0);
const gridColumns = ref(6); // 每行图片数量，来自系统参数 AVATAR-ROW-COUNT
const pageSizes = tablePageSizes;

onMounted(() => {
  fetchTypeOptions();
  fetchTableFieldColumn();
  fetchGridColumns();
  // Cookie中记录为图片浏览模式时，进入页面直接加载网格数据
  if (viewMode.value === 'grid') fetchGridData();
});

// 头像分类选项
const fetchTypeOptions = async () => {
  try {
    const response = await DictEnumOptionApi({ name: 'avatar-type' });
    typeOptions.value = (response.data || []) as OptionEnumModel[];
  } catch (e) {
    typeOptions.value = [];
  }
};

const fetchTableFieldColumn = async () => {
  try {
    const response = await TableFieldColumnApi({ xtbb: apiName });
    if (response.code === 100 && response.data) {
      columns.value = response.data as any;
    } else {
      ElNotification({
        title: '提示',
        message: '报表未配置表头，请联系平台管理员！',
        type: 'warning'
      });
    }
  } catch (e) {
    ElNotification({
      title: '提示',
      message: '获取表头配置失败',
      type: 'warning'
    });
  }
};

// 表格数据
const fetchTableData = async (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return await SysOpsAvatarListApi(newParams);
};

// 重新获取表格数据 + 清空选择数据
const reFetchTableData = (isReload: boolean = false) => {
  if (isReload) {
    fcTableRef.value?.clearSelection(); // 清除表格选择数据
    fcTableRef.value?.getTableList(); // 重新获取表格数据
    if (viewMode.value === 'grid') fetchGridData(); // 图片浏览模式同步刷新
  }
};

// 筛选条件变化（分类/收藏/排序），表格与图片浏览模式都回到第一页
const filterChange = () => {
  if (viewMode.value === 'grid') {
    gridPage.value = 1;
    fetchGridData();
    return;
  }
  if (fcTableRef.value) {
    fcTableRef.value.pageable.page = 1;
    fcTableRef.value.getTableList();
  }
};

// 查询（关键字确认后生效，图片浏览模式回到第一页）
const searchHandle = () => {
  requestParam.content = searchInput.value.trim();
  filterChange();
};

// 重置（分类/收藏/排序/关键字全部恢复默认）
const resetSearch = () => {
  searchInput.value = '';
  requestParam.content = '';
  requestParam.type = '';
  requestParam.favorite = '';
  requestParam.sort = '';
  filterChange();
};

// 每行图片数量（系统参数 AVATAR-ROW-COUNT，未配置时使用默认值）
const fetchGridColumns = async () => {
  try {
    const response = await SysConfigXtcsKeyApi({ key: 'AVATAR-ROW-COUNT' });
    const value = Number((response as { data: { value: string } })?.data?.value);
    if (value > 0) gridColumns.value = value;
  } catch (e) {
    // 参数未配置时保持默认列数
  }
};

// 图片浏览模式数据
const fetchGridData = async () => {
  gridLoading.value = true;
  try {
    const response = await SysOpsAvatarListApi({
      content: requestParam.content,
      type: requestParam.type || undefined,
      favorite: requestParam.favorite || undefined,
      sort: requestParam.sort || undefined,
      page: gridPage.value,
      pageSize: gridPageSize.value
    });
    const res = response as { data: { list: AvatarModelList[]; total: number } };
    gridList.value = res.data?.list || [];
    gridTotal.value = res.data?.total || 0;
  } finally {
    gridLoading.value = false;
  }
};

// 视图切换（保留当前搜索条件与分页状态）
const toggleViewMode = () => {
  if (viewMode.value === 'table') {
    viewMode.value = 'grid';
    setViewModeCookie('grid');
    gridPage.value = fcTableRef.value?.pageable?.page ?? 1;
    gridPageSize.value = fcTableRef.value?.pageable?.pageSize ?? tablePageSize;
    fetchGridData();
    return;
  }

  viewMode.value = 'table';
  setViewModeCookie('table');
  if (fcTableRef.value) {
    fcTableRef.value.pageable.page = gridPage.value;
    fcTableRef.value.pageable.pageSize = gridPageSize.value;
    fcTableRef.value.getTableList();
  }
};

// 图片浏览模式分页
const gridPageChange = (val: number) => {
  gridPage.value = val;
  fetchGridData();
};

const gridSizeChange = (val: number) => {
  gridPageSize.value = val;
  gridPage.value = 1;
  fetchGridData();
};

// 标签颜色使用公共方法 avatarTagColor（utils/utils.ts）

// 尺寸 / 格式
const dimensionText = (row: AvatarModelList) => {
  const dimension = row.width && row.height ? `${row.width} × ${row.height}` : "-";
  return `${dimension} / ${row.format || "-"}`;
};

// 文件大小
const formatFileSize = (bytes: number) => {
  if (!bytes || bytes <= 0) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
};

// 新增
const addHandle = () => {
  addVisible.value = true;
};

// 批量上传（多张）
const batchUploadHandle = () => {
  batchUploadVisible.value = true;
};

// 查看
const viewHandle = (row: AvatarModelList) => {
  tableRowMd5.value = row.md5;
  viewVisible.value = true;
};

// 编辑
const editHandle = (row: AvatarModelList) => {
  tableRowMd5.value = row.md5;
  editVisible.value = true;
};

// 裁剪
const cropHandle = (row: AvatarModelList) => {
  tableRowMd5.value = row.md5;
  cropVisible.value = true;
};

// 单条删除
const deleteHandle = (md5: string) => {
  SysOpsAvatarDeleteApi({ md5 }).then(() => {
    ElNotification({
      title: '提示',
      message: '删除成功',
      type: 'success'
    });
    reFetchTableData(true);
  })
};

// 锁定管理（value=true禁用 false启用）
const lockHandle = (md5: string, value: boolean) => {
  SysOpsAvatarLockApi({ md5, value }).then(() => {
    const message = value ? '<strong>状态修改成功</strong><br /><div style="color: red;">禁用状态的头像将无法被使用，请谨慎禁用</div>' : '<strong>状态修改成功</strong>';
    ElNotification({
      title: '提示',
      dangerouslyUseHTMLString: true,
      message,
      type: 'success'
    });
  })
};

// 批量删除
const batchDeleteHandle = () => {
  // 无选择数据
  if (!fcTableRef.value?.isSelected) {
    ElMessage.warning("请选择需要删除的数据");
    return;
  }

  tableSelectList = fcTableRef.value?.selectedListKeys;
  batchDeleteVisible.value = true;
};
</script>

<style scoped>
.avatar-thumb {
  width: 45px;
  height: 45px;
  border-radius: 6px;
}

.avatar-tag {
  margin-right: 4px;
}

/* 数据区纵向布局：查询面板 + 数据区平分高度 */
.avatar-main {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 查询条件面板（头像超市同款筛选） */
.avatar-filter {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 12px;
  margin: 0 20px 16px 20px;
  padding: 14px 16px;
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

.category-group {
  display: flex;
  flex-wrap: wrap;
  row-gap: 8px;
}

.avatar-filter :deep(.el-radio-group) {
  display: flex;
  flex-wrap: wrap;
  row-gap: 8px;
}

.avatar-filter :deep(.el-radio-button__inner) {
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  border-left: 1px solid var(--el-border-color-lighter);
  transition: color 0.2s, background-color 0.2s, border-color 0.2s, box-shadow 0.2s;
}

.avatar-filter :deep(.el-radio-button:not(:first-child)) {
  margin-left: -1px;
}

.avatar-filter :deep(.el-radio-button__inner:hover) {
  color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
}

.avatar-filter :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  font-weight: 600;
  box-shadow: -1px 0 0 0 var(--el-color-primary);
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

/* 展开的查询条件区（是否收藏/排序方式/关键字） */
.query-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px dashed var(--el-border-color);
}

/* 表格模式容器（fc-filter-table 多根节点，v-show 需包一层普通元素） */
.avatar-table-box {
  flex: 1;
  min-height: 0;
}

/* 图片浏览模式 */
.avatar-grid-box {
  flex: 1;
  min-height: 0;
  box-sizing: border-box;
  padding: 0 20px 20px 20px;
  overflow-y: auto;
}

.avatar-grid {
  display: grid;
  gap: 18px;
}

.avatar-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 10px;
  background-color: var(--el-bg-color);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.25s, transform 0.25s, border-color 0.25s;
}

.avatar-card:hover {
  transform: translateY(-4px);
  border-color: var(--el-color-primary);
  box-shadow: 0 0 0 2px var(--el-color-primary-light-5), 0 12px 24px rgba(0, 0, 0, 0.12);
}

.avatar-card-image {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background: linear-gradient(135deg, var(--el-fill-color), var(--el-fill-color-dark));
  cursor: zoom-in;
}

.avatar-card-image :deep(.el-image) {
  width: 100%;
  height: 100%;
  transition: transform 0.35s ease;
}

.avatar-card:hover .avatar-card-image :deep(.el-image) {
  transform: scale(1.08);
}

/* 悬浮遮罩：图片蒙上一层浅灰，突出查看预览 */
.avatar-card-mask {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.5);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s;
}

.avatar-card:hover .avatar-card-mask {
  opacity: 1;
}

.avatar-card-mask .el-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  font-size: 18px;
  color: var(--el-text-color-regular);
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

/* 禁用标识 */
.avatar-card-lock {
  position: absolute;
  top: 8px;
  right: 8px;
  height: 20px;
  padding: 0 8px;
  font-size: 12px;
  line-height: 20px;
  color: #fff;
  background-color: var(--el-color-danger);
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.avatar-card-name {
  padding: 10px 12px 0;
  font-size: 13px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 卡片统计：设置次数/收藏数 */
.avatar-card-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 8px;
  padding: 0 12px;
}

.avatar-card-meta .stat-cell {
  gap: 3px;
  padding: 2px 10px;
  font-size: 12px;
  background: var(--el-fill-color-light);
  border-radius: 10px;
}

.avatar-card-meta .stat-cell .el-icon {
  font-size: 13px;
}

.avatar-card-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 8px;
  padding: 8px 0;
  border-top: 1px solid var(--el-border-color-extra-light);
  background-color: var(--el-fill-color-blank);
  transition: background-color 0.2s;
}

.avatar-card:hover .avatar-card-actions {
  background-color: var(--el-fill-color-lighter);
}

.avatar-card-actions .el-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  font-size: 15px;
  color: var(--el-text-color-regular);
  border-radius: 50%;
  cursor: pointer;
  transition: color 0.2s, background-color 0.2s;
}

.avatar-card-actions .el-icon:hover {
  color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
}

.avatar-card-actions .avatar-card-delete:hover {
  color: var(--el-color-danger);
  background-color: var(--el-color-danger-light-9);
}

.avatar-grid-pagination {
  display: flex;
  justify-content: flex-end;
  padding: 16px 0 4px;
}
</style>
