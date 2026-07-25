<template>
  <el-container>
    <!--操作区-->
    <el-header>
      <div class="left-panel">
        <el-button id="btn-add" class="table-handle-button" :type="buttonField.type" :plain="buttonField.plain" :size="buttonField.size" icon="Plus" @click="addHandle">
          新增
        </el-button>
        <el-button id="btn-batch-import" class="table-handle-button" :type="buttonField.type" icon="DocumentAdd" :plain="buttonField.plain" :size="buttonField.size" @click="batchImportHandle">
          批量导入
        </el-button>
        <el-button id="btn-batch-status" class="table-handle-button" type="danger" icon="Close" :plain="buttonField.plain" :size="buttonField.size" @click="batchStatusHandle" :disabled="!fcTableRef?.isSelected">
          批量注销
        </el-button>
        <el-button id="btn-batch-delete" class="table-handle-button" type="warning" icon="Delete" :plain="buttonField.plain" :size="buttonField.size" @click="batchDeleteHandle" :disabled="!fcTableRef?.isSelected">
          批量删除
        </el-button>
        <el-popover placement="bottom" title="操作说明" width="350" trigger="hover">
          <template #default>
            <div style="line-height: 2.5;">
              <span style="color: #f56c6c;">【注销】</span>：禁止用户登录系统，停止系统配置相关菜单，再次允许使用重新开启状态即可<br/>
              <span style="color: #e6a23c;">【删除】</span>：直接从数据库删除用户，请谨慎操作，一旦删除不可恢复，建议不用人员改为注销状态
            </div>
          </template>
          <template #reference>
            <el-button id="btn-popover" type="info" :plain="buttonField.plain" :size="buttonField.size">说明</el-button>
          </template>
        </el-popover>
        <el-button id="btn-file-download" class="table-handle-button" type="info" icon="Download" :plain="buttonField.plain" :size="buttonField.size" @click="templateFileDownload">
          模板下载
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
        <!-- 字段个性化配置 -->
        <template #avatar="scope">
          <el-avatar :size="40" :src="scope.row.avatar" />
        </template>
        <!-- 表格操作 -->
        <template #options="scope">
          <el-tooltip effect="dark" content="编辑" placement="top">
            <el-icon class="table-handle-icon" @click="editHandle(scope.row)">
              <EditPen />
            </el-icon>
          </el-tooltip>
          <el-tooltip effect="dark" content="重置密码" placement="top">
            <el-icon class="table-handle-icon margin-left-25px" @click="resetPwdHandle(scope.row)">
              <Unlock />
            </el-icon>
          </el-tooltip>
        </template>
        <!-- 状态管理 -->
        <template #status="scope">
          <el-switch v-if="scope.row.rtxId !== 'admin'"
                     v-model="scope.row.status"
                     active-text="注销"
                     inactive-text="启用"
                     style="--el-switch-on-color: #ff4949; --el-switch-off-color: #13ce66;"
                     @change="statusHandle(scope.row.md5, $event)" />
        </template>
      </fc-table>
    </el-main>

    <!--新增-->
    <UserAdd v-model:visible="addVisible" @reFetchTableData="reFetchTableData" />

    <!--编辑-->
    <UserEdit v-model:visible="editVisible" :md5="tableRowMd5" @reFetchTableData="reFetchTableData" />

    <!--重置密码-->
    <UserResetPwd v-model:visible="rePwdVisible" :md5="tableRowMd5" :rtxId="tableRowRtxId" />

    <!--批量注销-->
    <fc-batch-delete v-model:visible="batchDeleteVisible" :api="apiName" :md5List="tableSelectList" @reFetchTableData="reFetchTableData"/>
    <!--批量删除-->
    <fc-batch-delete v-model:visible="batchDeleteVisible2" :api="apiName2" :md5List="tableSelectList" @reFetchTableData="reFetchTableData"/>

    <!--文件上传-->
    <fc-upload-file v-model:visible="uploadVisible" uploadType="1" uploadDialogTitle="导入" @reFetchTableData="reFetchTableData"/>
  </el-container>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue';
import { SysMainUserListApi, SysMainUserStatusApi } from '@/api/modules/systemMain';
import { ColumnProps, FcTableInstance } from "@/components/fcTable/model";
import { UserModelList } from "@/models/systemModel";
import UserResetPwd from "./components/resetPwd.vue";
import UserEdit from "./components/edit.vue";
import UserAdd from "./components/add.vue";
import { ElMessage, ElNotification } from 'element-plus';
import { fcTableField, buttonField } from "@/utils/attrs/field";
import { tableWidth } from "@/utils/attrs/table";

// fc-table属性
const fcTableConfig = reactive({
  rowKey: "md5",
  border: false,
  stripe: true,
});
const ftField = {...fcTableField, ...fcTableConfig};

// fc-Table 实例
const fcTableRef = ref<FcTableInstance>();

const columns = reactive<ColumnProps<UserModelList>[]>([
  { prop: "", width: tableWidth.selection, type: "selection", fixed: "left" },
  { prop: "id", label: "数据ID", width: tableWidth.id },
  { prop: "rtxId", label: "账号", width: tableWidth.rtx },
  { prop: "avatar", label: "头像", width: 120 },
  { prop: "name", label: "昵称", width: tableWidth.name },
  { prop: "email", label: "邮箱", width: 200 },
  { prop: "phone", label: "手机号", width: 140 },
  { prop: "sex", label: "性别", width: 120 },
  // { prop: "introduction", label: "描述", width: 240, align: "left" },
  // { prop: "department", label: "部门", width: 180, align: "left" },
  { prop: "createTime", label: "创建时间", width: tableWidth.createTime },
  { prop: "createRtx", label: "创建人", width: tableWidth.createRtx },
  { prop: "options", label: "操作", width: tableWidth.option2, fixed: "right" },
  { prop: "status", label: "状态管理", width: 160, fixed: "right" }
]);

// Dialog状态管理
const addVisible= ref(false);
const editVisible = ref(false);
const rePwdVisible = ref(false);
const batchDeleteVisible = ref(false);
const batchDeleteVisible2 = ref(false);
const uploadVisible = ref(false);

const tableRowMd5 = ref(""); // 默认当前选择的数据MD5
const tableRowRtxId = ref(""); // 默认当前选择的数据rtx-id
const apiName = "SystemMainUser"; // 组件标识名称
const apiName2 = "SystemMainUser2"; // 组件标识名称
let tableSelectList = reactive([] as string[]); // 当前选择数据Keys列表
const requestParam = reactive({"content": "" });  // 查询内容

// 表格数据
const fetchTableData = async (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return await SysMainUserListApi(newParams);
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
const editHandle = (row: UserModelList) => {
  if (row?.status === true) {
    ElNotification({
      title: '提示',
      message: '用户已注销，不允许编辑操作',
      type: 'warning'
    });
    return
  }
  tableRowMd5.value = row.md5;
  editVisible.value = true;
};

// 重置密码
const resetPwdHandle = (row: UserModelList) => {
  tableRowMd5.value = row.md5;
  tableRowRtxId.value = row.rtxId;
  if (row.rtxId == "admin") {
    ElNotification({
      title: '提示',
      message: '管理员用户不允许密码重置操作',
      type: 'warning'
    });
    return
  }
  if (row?.status === true) {
    ElNotification({
      title: '提示',
      message: '用户已注销，不允许密码重置操作',
      type: 'warning'
    });
    return
  }
  rePwdVisible.value = true;
};

// 启用/注销用户
const statusHandle = (md5: string, value: boolean) => {
  SysMainUserStatusApi({md5, value}).then(() => {
    const message = value ? '<strong>状态修改成功</strong><br /><div style="color: red;">注销状态的用户拒绝登录平台</div>' : '<strong>状态修改成功</strong>';
    ElNotification({
      title: '提示',
      dangerouslyUseHTMLString: true,
      message,
      type: 'success'
    });
  })
};

// 批量注销用户
const batchStatusHandle = () => {
  // 无选择数据
  if (!fcTableRef.value?.isSelected) {
    ElMessage.warning("请选择需要注销的用户");
    return;
  }

  // 包含已注销数据
  if (fcTableRef.value?.selectedList.length > 0) {
    for (let item of fcTableRef.value?.selectedList) {
      if (item.is_del) {
        ElMessage.warning("选择的数据中包含已注销用户");
        return;
      }
    }
  }

  tableSelectList = fcTableRef.value?.selectedListKeys;
  batchDeleteVisible.value = true;

};


// 批量删除用户
const batchDeleteHandle = () => {
  // 无选择数据
  if (!fcTableRef.value?.isSelected) {
    ElMessage.warning("请选择需要删除的用户");
    return;
  }

  // 包含已注销数据
  if (fcTableRef.value?.selectedList.length > 0) {
    for (let item of fcTableRef.value?.selectedList) {
      if (item.is_del) {
        ElMessage.warning("选择的数据中包含已注销用户");
        return;
      }
    }
  }

  tableSelectList = fcTableRef.value?.selectedListKeys;
  batchDeleteVisible2.value = true;

};

const templateFileDownload = () => {
  ElNotification({
    title: '提示',
    dangerouslyUseHTMLString: true,
    message: '模板文件上传开发中，敬请期待',
    type: 'warning'
  });
};

const batchImportHandle = () => {
  uploadVisible.value = true;
};
</script>

<style scoped>

</style>
