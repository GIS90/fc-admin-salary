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
      <fc-table ref="fcTableRef" :tableName="apiName" :requestApi="fetchTableData" :initParam="requestParam" :columns="columns"
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
          <el-tooltip effect="dark" content="授权" placement="top">
            <el-icon class="table-handle-icon margin-left-30px" @click="authHandle(scope.row)">
              <Menu />
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
      </fc-table>
    </el-main>

    <!--新增-->
    <Add v-model:visible="addVisible" @reFetchTableData="reFetchTableData" />

    <!--编辑-->
    <Edit v-model:visible="editVisible" :md5="tableRowMd5" @reFetchTableData="reFetchTableData" />

    <!--新增-->
    <Auth v-model:visible="authVisible" :md5="tableRowMd5" />

    <!--批量删除-->
    <fc-batch-delete v-model:visible="batchDeleteVisible" :api="apiName" :md5List="tableSelectList" @reFetchTableData="reFetchTableData"/>
  </el-container>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue';
import { SysMainRoleListApi, SysMainRoleDeleteApi } from '@/api/modules/systemMain';
import { ColumnProps, FcTableInstance } from "@/components/fcTable/model";
import { RoleModelList } from "@/models/systemModel";
import { ElMessage, ElNotification } from 'element-plus';
import { fcTableField, PopConfirmField, buttonField } from "@/utils/attrs/field";
import { tableWidth } from "@/utils/attrs/table";
import Edit from "./components/edit.vue";
import Add from "./components/add.vue";
import Auth from "./components/auth.vue";

// fc-table属性
const fcTableConfig = reactive({
  rowKey: "md5",
});
const ftField = {...fcTableField, ...fcTableConfig};
const pcField = {...PopConfirmField, ...{}};

// fc-Table 实例
const fcTableRef = ref<FcTableInstance>();

const columns = reactive<ColumnProps<RoleModelList>[]>([
  { prop: "", width: tableWidth.selection, type: "selection", fixed: "left" },
  { prop: "id", label: "序号", width: tableWidth.id },
  { prop: "engname", label: "角色ID", width: tableWidth.rtx },
  { prop: "chnname", label: "名称", width: tableWidth.name },
  { prop: "introduction", label: "简介", align: "left" },
  { prop: "createTime", label: "创建时间" },
  { prop: "createRtx", label: "创建人"},
  { prop: "options", label: "操作", width: tableWidth.option3, fixed: "right" }
]);

// Dialog状态管理
const addVisible= ref(false);
const editVisible = ref(false);
const authVisible = ref(false);
const batchDeleteVisible = ref(false);

const tableRowMd5 = ref(""); // 默认当前选择的数据MD5
const apiName = "SystemMainRole"; // 组件标识名称
let tableSelectList = reactive([] as string[]); // 当前选择数据Keys列表
const requestParam = reactive({"content": "" });  // 查询内容

// 表格数据
const fetchTableData = async (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return await SysMainRoleListApi(newParams);
};

// 重新获取表格数据 + 清空选择数据
const reFetchTableData = (isReload: boolean = false) => {
  if (isReload) {
    fcTableRef.value?.clearSelection(); // 清除表格选择数据
    fcTableRef.value?.getTableList(); // 重新获取表格数据
  }
};

// 新增
const addHandle = () => {
  addVisible.value = true;
};

// 编辑
const editHandle = (row: RoleModelList) => {
  tableRowMd5.value = row.md5;
  editVisible.value = true;
};

// 授权
const authHandle = (row: RoleModelList) => {
  tableRowMd5.value = row.md5;
  if (row.engname == "ADMIN") {
    ElNotification({
      title: '提示',
      message: '管理员角色已授权全部功能，不允许进行授权操作',
      type: 'warning'
    });
    return
  }
  authVisible.value = true;
};

// 单条删除
const deleteHandle = (md5: string) => {
  SysMainRoleDeleteApi({ md5 }).then(() => {
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

</style>
