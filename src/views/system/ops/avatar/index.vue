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
        <el-tooltip effect="dark" :content="viewMode === 'table' ? '切换到图片浏览' : '切换到数据列表'" placement="top">
          <el-button id="btn-view-mode" :type="buttonField.type" :plain="buttonField.plain" :size="buttonField.size"
                     :icon="viewMode === 'table' ? 'Grid' : 'List'" @click="toggleViewMode" />
        </el-tooltip>
        <el-input v-model.trim="requestParam.content" placeholder="支持按名称/标签/类型模糊查询，输入后点击查询" clearable style="width: 280px;" />
        <el-button id="btn-search" :type="buttonField.type" :plain="buttonField.plain" :size="buttonField.size" icon="Search" @click="searchHandle" />
      </div>
    </el-header>

    <!--数据区-->
    <el-main class="nopadding">
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
            </div>
            <div class="avatar-card-name" :title="row.name">{{ row.name }}</div>
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
import { TableFieldColumnApi } from "@/api/modules/common";
import { SysConfigXtcsKeyApi } from "@/api/modules/systemConfig";
import { tablePageSize, tablePageSizes } from "@/utils/variable";
import { avatarTagColor } from "@/utils/utils";
import Add from "./components/add.vue";
import BatchAdd from "./components/batchAdd.vue";
import Edit from "./components/edit.vue";
import AvatarView from "./components/view.vue";

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
const batchDeleteVisible = ref(false);
const batchUploadVisible = ref(false);

const tableRowMd5 = ref(""); // 默认当前选择的数据MD5
const apiName = "SystemOpsAvatar"; // 组件标识名称
let tableSelectList = reactive([] as string[]); // 当前选择数据Keys列表
const requestParam = reactive({"content": "" });  // 查询内容

// 视图模式：table数据列表 / grid图片浏览
const viewMode = ref<'table' | 'grid'>('table');

// 图片浏览模式
const gridLoading = ref(false);
const gridList = ref<AvatarModelList[]>([]);
const gridPage = ref(1);
const gridPageSize = ref(tablePageSize);
const gridTotal = ref(0);
const gridColumns = ref(6); // 每行图片数量，来自系统参数 AVATAR-ROW-COUNT
const pageSizes = tablePageSizes;

onMounted(() => {
  fetchTableFieldColumn();
  fetchGridColumns();
});

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

// 查询（图片浏览模式回到第一页）
const searchHandle = () => {
  if (viewMode.value === 'grid') {
    gridPage.value = 1;
    fetchGridData();
    return;
  }
  fcTableRef.value?.getTableList();
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
    gridPage.value = fcTableRef.value?.pageable?.page ?? 1;
    gridPageSize.value = fcTableRef.value?.pageable?.pageSize ?? tablePageSize;
    fetchGridData();
    return;
  }

  viewMode.value = 'table';
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

/* 表格模式容器（fc-filter-table 多根节点，v-show 需包一层普通元素） */
.avatar-table-box {
  height: 100%;
}

/* 图片浏览模式 */
.avatar-grid-box {
  height: 100%;
  box-sizing: border-box;
  padding: 16px;
  overflow-y: auto;
}

.avatar-grid {
  display: grid;
  gap: 16px;
}

.avatar-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  background-color: var(--el-bg-color);
  transition: box-shadow 0.2s, transform 0.2s;
}

.avatar-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.avatar-card-image {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background-color: var(--el-fill-color-lighter);
  cursor: zoom-in;
}

.avatar-card-image :deep(.el-image) {
  width: 100%;
  height: 100%;
  transition: transform 0.3s;
}

.avatar-card:hover .avatar-card-image :deep(.el-image) {
  transform: scale(1.06);
}

.avatar-card-name {
  padding: 8px 10px 0;
  font-size: 13px;
  color: var(--el-text-color-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.avatar-card-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 8px 0 10px;
  color: var(--el-text-color-regular);
}

.avatar-card-actions .el-icon {
  font-size: 16px;
  cursor: pointer;
}

.avatar-card-actions .el-icon:hover {
  color: var(--el-color-primary);
}

.avatar-card-actions .avatar-card-delete:hover {
  color: var(--el-color-danger);
}

.avatar-grid-pagination {
  display: flex;
  justify-content: flex-end;
  padding: 16px 0 4px;
}
</style>
