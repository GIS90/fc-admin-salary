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
        <el-input v-model.trim="requestParam.content" placeholder="支持模糊查询，输入后点击查询" clearable style="width: 250px;" />
        <el-button id="btn-search" :type="buttonField.type" :plain="buttonField.plain" :size="buttonField.size" icon="Search" @click="reFetchTableData" /> <!--采用手工查询按钮模式-->
      </div>
    </el-header>

    <!--数据区-->
    <el-main class="nopadding">
      <fc-filter-table ref="fcTableRef" :tableName="apiName" :requestApi="fetchTableData" :initParam="requestParam" :columns="columns"
                :rowKey="ftField.rowKey" :stripe="ftField.stripe" :border="ftField.border" :pagination="ftField.pagination"
                :showBottomView="ftField.showBottomView" :showRefreshBtn="ftField.showRefreshBtn"
                :showColumnBtn="ftField.showColumnBtn" :showDownloadBtn="ftField.showDownloadBtn">
        <!-- 表格操作 -->
        <template #options="scope">
          <el-tooltip effect="dark" content="编辑" placement="top">
            <el-icon class="table-handle-icon" @click="editHandle(scope.row)">
              <EditPen />
            </el-icon>
          </el-tooltip>
          <el-tooltip effect="dark" content="配置字段" placement="top">
            <el-icon class="table-handle-icon margin-left-30px" @click="fieldHandle(scope.row)">
              <Operation />
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

    <!--批量删除-->
    <fc-batch-delete v-model:visible="batchDeleteVisible" :api="apiName" :md5List="tableSelectList" @reFetchTableData="reFetchTableData"/>

    <!--配置字段 Drawer-->
    <FieldDrawer
      v-model:visible="fieldDrawerVisible"
      :report-name="fieldDrawerReportName"
      :report-table="fieldDrawerReportTable"
      @reFetchTableData="reFetchTableData" />
  </el-container>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue';
import {SysConfigReportListApi, SysConfigReportDeleteApi} from '@/api/modules/systemConfig';
import { ColumnProps, FcFilterTableInstance } from "@/components/fcFilterTable/model";
import { ReportModelList } from "@/models/systemModel";
import { ElMessage, ElNotification } from 'element-plus';
import { fcTableField, PopConfirmField, buttonField } from "@/utils/attrs/field";
import { tableWidth } from "@/utils/attrs/table";
import Add from "./components/add.vue";
import Edit from "./components/edit.vue";
import FieldDrawer from "./components/fieldDrawer.vue";

// fc-table属性
const fcTableConfig = reactive({
  rowKey: "md5",
});
const ftField = {...fcTableField, ...fcTableConfig};
const pcField = {...PopConfirmField, ...{}};

// fc-Table 实例
const fcTableRef = ref<FcFilterTableInstance>();

const columns = reactive<ColumnProps<ReportModelList>[]>([
  { prop: "", width: tableWidth.selection, type: "selection", fixed: "left" },
  { prop: "id", label: "序号", width: tableWidth.id },
  { prop: "name", label: "报表名称", filter: { type: "input", placeholder: "请输入报表名称" } },
  { prop: "table", label: "数据库表名", filter: { type: "input", placeholder: "请输入数据库表名" } },
  { prop: "remark", label: "报表说明", filter: { type: "input", placeholder: "请输入报表说明" } },
  { prop: "options", label: "操作", width: tableWidth.option3, fixed: "right" }
]);
const requestParam = reactive({"content": "" });  // 查询内容

// Dialog状态管理
const addVisible= ref(false);
const editVisible = ref(false);
const batchDeleteVisible = ref(false);

// 配置字段 Drawer
const fieldDrawerVisible = ref(false);
const fieldDrawerReportName = ref("");
const fieldDrawerReportTable = ref("");

const tableRowMd5 = ref("");
const apiName = "SystemConfigReport";
let tableSelectList = reactive([] as string[]);

// 表格数据
const fetchTableData = async (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return await SysConfigReportListApi(newParams);
};

// 重新获取表格数据 + 清空选择数据
const reFetchTableData = (isReload: boolean = false) => {
  if (isReload) {
    fcTableRef.value?.clearSelection();
    fcTableRef.value?.getTableList();
  }
};

// 新增
const addHandle = () => {
  addVisible.value = true;
};

// 编辑
const editHandle = (row: ReportModelList) => {
  tableRowMd5.value = row.md5;
  editVisible.value = true;
};

// 配置字段
const fieldHandle = (row: ReportModelList) => {
  fieldDrawerReportName.value = row.name;
  fieldDrawerReportTable.value = row.table;
  fieldDrawerVisible.value = true;
};

// 单条删除
const deleteHandle = (md5: string) => {
  SysConfigReportDeleteApi({ md5 }).then(() => {
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
  if (!fcTableRef.value?.isSelected) {
    ElMessage.warning("请选择需要删除的数据");
    return;
  }

  tableSelectList = fcTableRef.value?.selectedListKeys;
  batchDeleteVisible.value = true;
};
</script>

<style scoped>

</style>
