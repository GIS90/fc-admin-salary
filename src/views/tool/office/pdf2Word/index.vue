<template>
  <el-container>
    <!--操作区-->
    <el-header>
      <div class="left-panel">
        <el-button id="btn-batch-delete" class="table-handle-button" type="danger" icon="Delete" :plain="buttonField.plain" :size="buttonField.size" @click="batchDeleteHandle" :disabled="!fcTableRef?.isSelected">
          批量删除
        </el-button>
      </div>
      <div class="right-panel">
        <el-input v-model.trim="requestParam.content" placeholder="支持模糊查询，输入后点击查询" clearable style="width: 250px;" />
        <el-button id="btn-search" :type="buttonField.type" :plain="buttonField.plain" :size="buttonField.size" icon="Search" @click="reFetchTableData" />
      </div>
    </el-header>

    <!--数据区-->
    <el-main class="nopadding">
      <fc-filter-table ref="fcTableRef" :tableName="apiName" :requestApi="fetchTableData" :initParam="requestParam" :columns="columns"
                :rowKey="ftField.rowKey" :stripe="ftField.stripe" :border="ftField.border" :pagination="ftField.pagination"
                :showBottomView="ftField.showBottomView" :showRefreshBtn="ftField.showRefreshBtn"
                :showColumnBtn="ftField.showColumnBtn" :showDownloadBtn="ftField.showDownloadBtn">
        <!-- 转换状态 -->
        <template #transfer="scope">
          <el-tag :type="scope.row.transfer ? 'success' : 'warning'">
            {{ scope.row.transfer ? '已转换' : '待转换' }}
          </el-tag>
        </template>
        <!-- 转换模式 -->
        <template #mode="scope">
          <el-tag :type="scope.row.mode ? 'primary' : 'info'">
            {{ scope.row.mode ? '精确模式' : '快速模式' }}
          </el-tag>
        </template>
        <!-- 原始文件下载 -->
        <template #storeUrl="scope">
          <el-link v-if="scope.row.storeUrl" :href="scope.row.storeUrl" type="primary" :underline="false" target="_blank">
            <el-icon><Download /></el-icon>
          </el-link>
          <span v-else>-</span>
        </template>
        <!-- 转换文件下载 -->
        <template #transferUrl="scope">
          <el-link v-if="scope.row.transferUrl" :href="scope.row.transferUrl" type="primary" :underline="false" target="_blank">
            <el-icon><Download /></el-icon>
          </el-link>
          <span v-else>-</span>
        </template>
        <!-- 表格操作 -->
        <template #options="scope">
          <el-popconfirm :title="pcField.title" :confirm-button-text="pcField.confirmText" :cancel-button-text="pcField.cancelText"
                         :confirm-button-type="pcField.confirmType" :cancel-button-type="pcField.cancelType"
                         :icon="pcField.icon" :icon-color="pcField.iconColor" :width="pcField.width"
                         @confirm="deleteHandle(scope.row.md5)">
            <template #reference>
              <el-tooltip effect="dark" content="删除" placement="top">
                <el-icon class="table-handle-icon">
                  <Delete />
                </el-icon>
              </el-tooltip>
            </template>
          </el-popconfirm>
        </template>
      </fc-filter-table>
    </el-main>

    <!--批量删除-->
    <fc-batch-delete v-model:visible="batchDeleteVisible" :api="apiName" :md5List="tableSelectList" @reFetchTableData="reFetchTableData"/>
  </el-container>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue';
import { ToolOfficeP2WListApi, ToolOfficeP2WDeleteApi } from '@/api/modules/toolOffice';
import { ColumnProps } from "@/components/fcFilterTable/model";
import type { FcFilterTableInstance } from "@/components/fcFilterTable/model";
import { Pdf2WordModelList } from "@/models/toolModel";
import { ElMessage, ElNotification } from 'element-plus';
import { fcTableField, PopConfirmField, buttonField } from "@/utils/attrs/field";
import { tableWidth } from "@/utils/attrs/table";
import { Delete, Download } from '@element-plus/icons-vue';

// fc-table属性
const fcTableConfig = reactive({
  rowKey: "md5",
});
const ftField = {...fcTableField, ...fcTableConfig};
const pcField = {...PopConfirmField, ...{}};

// fc-Table 实例
const fcTableRef = ref<FcFilterTableInstance>();

const columns = reactive<ColumnProps<Pdf2WordModelList>[]>([
  { prop: "", width: tableWidth.selection, type: "selection", fixed: "left" },
  { prop: "id", label: "序号", width: tableWidth.id },
  { prop: "name", label: "文件名", width: 220, filter: { type: "input", placeholder: "请输入文件名" } },
  { prop: "storeName", label: "存储名称", width: 200 },
  { prop: "transferName", label: "转换名称", width: 200, filter: { type: "input", placeholder: "请输入转换名称" } },
  { prop: "transfer", label: "转换状态", width: 120, filter: { type: "boolean", placeholder: "请选择状态" } },
  { prop: "transferTime", label: "转换时间", width: 180 },
  { prop: "storeUrl", label: "原始文件", width: 100 },
  { prop: "transferUrl", label: "转换文件", width: 100 },
  { prop: "mode", label: "转换模式", width: 120, filter: { type: "boolean", placeholder: "请选择模式" } },
  { prop: "start", label: "起始页", width: 90 },
  { prop: "end", label: "结束页", width: 90 },
  { prop: "pages", label: "转换页码", width: 120 },
  { prop: "createRtx", label: "创建人", width: tableWidth.createRtx, filter: { type: "input", placeholder: "请输入创建人" } },
  { prop: "createTime", label: "创建时间", width: tableWidth.createTime, filter: { type: "daterange" } },
  { prop: "options", label: "操作", width: tableWidth.option2, fixed: "right" }
]);

// Dialog状态管理
const batchDeleteVisible = ref(false);

const apiName = "ToolOfficeP2W";
let tableSelectList = reactive([] as string[]);
const requestParam = reactive({ content: "" });

// 表格数据
const fetchTableData = async (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return await ToolOfficeP2WListApi(newParams);
};

// 重新获取表格数据 + 清空选择数据
const reFetchTableData = (isReload: boolean = false) => {
  if (isReload) {
    fcTableRef.value?.clearSelection();
    fcTableRef.value?.getTableList();
  }
};

// 单条删除
const deleteHandle = (md5: string) => {
  ToolOfficeP2WDeleteApi({ md5 }).then(() => {
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
