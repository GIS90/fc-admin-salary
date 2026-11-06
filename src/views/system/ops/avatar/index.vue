<template>
  <el-container>
    <!--操作区-->
    <el-header>
      <div class="left-panel">
        <el-button id="btn-add" class="table-handle-button" :type="buttonField.type" :plain="buttonField.plain" :size="buttonField.size" icon="Plus" @click="addHandle">
          新增
        </el-button>
        <el-button id="btn-batch-delete" type="danger" icon="Delete" :plain="buttonField.plain" :size="buttonField.size" @click="batchDeleteHandle" :disabled="!fcTableRef?.isSelected">
          批量删除
        </el-button>
      </div>
      <div class="right-panel">
        <el-input v-model.trim="requestParam.content" placeholder="支持按名称/标签/类型模糊查询，输入后点击查询" clearable style="width: 280px;" />
        <el-button id="btn-search" :type="buttonField.type" :plain="buttonField.plain" :size="buttonField.size" icon="Search" @click="reFetchTableData" />
      </div>
    </el-header>

    <!--数据区-->
    <el-main class="nopadding">
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
          <el-tag v-for="item in tagList(scope.row.tag)" :key="item" size="small" class="avatar-tag">{{ item }}</el-tag>
          <span v-if="!scope.row.tag">-</span>
        </template>
        <!-- 尺寸 / 格式 -->
        <template #dimension="scope">
          {{ dimensionText(scope.row) }}
        </template>
        <!-- 文件大小 -->
        <template #size="scope">
          {{ formatFileSize(scope.row.size) }}
        </template>
        <!-- 状态 -->
        <template #status="scope">
          <el-tag :type="scope.row.status ? 'info' : 'success'" size="small">
            {{ scope.row.status ? '已停用' : '已启用' }}
          </el-tag>
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
      </fc-filter-table>
    </el-main>

    <!--新增-->
    <Add v-model:visible="addVisible" @reFetchTableData="reFetchTableData" />

    <!--编辑-->
    <Edit v-model:visible="editVisible" :md5="tableRowMd5" @reFetchTableData="reFetchTableData" />

    <!--查看-->
    <AvatarView v-model:visible="viewVisible" :md5="tableRowMd5" />

    <!--批量删除-->
    <fc-batch-delete v-model:visible="batchDeleteVisible" :api="apiName" :md5List="tableSelectList" @reFetchTableData="reFetchTableData"/>
  </el-container>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue';
import { SysOpsAvatarListApi, SysOpsAvatarDeleteApi } from '@/api/modules/systemOps';
import { ColumnProps, FcFilterTableInstance } from "@/components/fcFilterTable/model";
import { AvatarModelList } from "@/models/systemModel";
import { ElMessage, ElNotification } from 'element-plus';
import { fcTableField, PopConfirmField, buttonField } from "@/utils/attrs/field";
import Add from "./components/add.vue";
import Edit from "./components/edit.vue";
import AvatarView from "./components/view.vue";

// fc-table属性
const fcTableConfig = reactive({
  rowKey: "md5",
  showDownloadBtn: false
});
const ftField = {...fcTableField, ...fcTableConfig};
const pcField = {...PopConfirmField, ...{}};

// fc-Table 实例
const fcTableRef = ref<FcFilterTableInstance>();

// 静态表头（头像管理不依赖报表配置）
const columns = ref<ColumnProps<AvatarModelList>[]>([
  { type: "selection", width: 50 },
  { type: "index", label: "序号", width: 60, align: "center" },
  { prop: "url", label: "头像", width: 72, align: "center" },
  { prop: "name", label: "名称", minWidth: 160, showOverflowTooltip: true },
  { prop: "tag", label: "标签", minWidth: 170 },
  { prop: "dimension", label: "尺寸 / 格式", width: 130 },
  { prop: "size", label: "文件大小", width: 110 },
  { prop: "count", label: "映射数量", width: 90, align: "center" },
  { prop: "createTime", label: "上传时间", width: 165 },
  { prop: "status", label: "状态", width: 90, align: "center" },
  { prop: "options", label: "操作", width: 140, fixed: "right", align: "center" },
]);

// Dialog状态管理
const addVisible = ref(false);
const editVisible = ref(false);
const viewVisible = ref(false);
const batchDeleteVisible = ref(false);

const tableRowMd5 = ref(""); // 默认当前选择的数据MD5
const apiName = "SystemOpsAvatar"; // 组件标识名称
let tableSelectList = reactive([] as string[]); // 当前选择数据Keys列表
const requestParam = reactive({"content": "" });  // 查询内容

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
  }
};

// 标签
const tagList = (tag: string) => {
  return tag ? tag.split(',').map(item => item.trim()).filter(Boolean) : [];
};

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
  width: 42px;
  height: 42px;
  border-radius: 6px;
}

.avatar-tag {
  margin-right: 4px;
}
</style>
