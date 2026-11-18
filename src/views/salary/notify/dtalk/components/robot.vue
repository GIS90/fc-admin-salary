<template>
  <el-drawer
      :model-value="props.visible"
      :size="dwField.size"
      :direction="dwField.direction"
      :with-header="dwField.withHeader"
      :modal="dwField.modal"
      :lock-scroll="dwField.lockScroll"
      :close-on-click-modal="dwField.closeOnClickModal"
      :close-on-press-escape="dwField.closeOnPressEscape"
      :destroy-on-close="dwField.destroyOnClose"
      @open="openHandle"
      @close="closeHandle"
  >
    <el-container class="robot-container">
      <!--header-->
      <el-header class="robot-header">
        <div class="left-panel">
          <h2>Robot配置</h2>
        </div>
        <div class="right-panel">
          <el-button type="primary" plain icon="Plus" @click="addHandle">新增</el-button>
          <el-button type="warning" plain icon="Delete" :disabled="selectedKeys.length === 0" @click="batchDeleteHandle">批量删除</el-button>
          <el-button icon="Refresh" @click="fetchList">刷新</el-button>
          <el-button icon="Close" circle @click="closeHandle" />
        </div>
      </el-header>

      <!--body-->
      <el-main class="nopadding robot-main">
        <div class="robot-table-box">
          <el-table :data="rows" row-key="md5" v-loading="loading" border stripe height="100%"
                    @selection-change="selectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column prop="id" label="序号" width="70" align="center" />
            <el-table-column prop="name" label="机器人名称" min-width="140" show-overflow-tooltip />
            <el-table-column prop="key" label="APP-KEY" min-width="170" show-overflow-tooltip />
            <el-table-column label="APP-SECRET" min-width="140">
              <template #default="scope">
                <span v-if="scope.row.secret">••••••••</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="描述" min-width="160" show-overflow-tooltip>
              <template #default="scope">{{ scope.row.description || "-" }}</template>
            </el-table-column>
            <el-table-column label="默认" width="80" align="center">
              <template #default="scope">
                <el-tag v-if="scope.row.select" type="success">默认</el-tag>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="170" align="center" />
            <el-table-column label="操作" width="250" align="center" fixed="right">
              <template #default="scope">
                <el-button link type="primary" icon="EditPen" @click="editHandle(scope.row)">编辑</el-button>
                <el-button link type="success" icon="Connection" :loading="pingLoading === scope.row.md5"
                           @click="pingHandle(scope.row)">Ping</el-button>
                <el-button v-if="!scope.row.select" link type="warning" icon="Star" @click="selectHandle(scope.row)">设为默认</el-button>
                <el-button link type="danger" icon="Delete" @click="deleteHandle(scope.row)">删除</el-button>
              </template>
            </el-table-column>
            <template #empty>
              <el-empty description="暂无机器人配置" :image-size="90" />
            </template>
          </el-table>
        </div>
      </el-main>
    </el-container>

    <!--新增/编辑-->
    <el-dialog v-model="editVisible" :title="form.md5 ? '编辑机器人' : '新增机器人'" width="520px"
               append-to-body :close-on-click-modal="false" :destroy-on-close="true">
      <el-form :model="form" label-width="104px">
        <el-form-item label="机器人名称" required>
          <el-input v-model.trim="form.name" maxlength="30" show-word-limit placeholder="请输入机器人名称" clearable />
        </el-form-item>
        <el-form-item label="APP-KEY" required>
          <el-input v-model.trim="form.key" maxlength="30" show-word-limit placeholder="请输入机器人APP-KEY" clearable />
        </el-form-item>
        <el-form-item label="APP-SECRET" required>
          <el-input v-model.trim="form.secret" maxlength="70" show-word-limit placeholder="请输入机器人APP-SECRET" clearable />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model.trim="form.description" maxlength="120" show-word-limit placeholder="请输入描述" clearable />
        </el-form-item>
        <el-form-item label="设为默认">
          <el-switch v-model="form.select" />
          <div class="el-form-item-msg">默认机器人会在发送消息时自动选中</div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="my-dialog-footer">
          <el-button :disabled="btnDisabled" @click="editVisible = false">取 消</el-button>
          <el-button type="primary" :disabled="btnDisabled" :loading="btnLoading" @click="saveHandle">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
import { drawerField } from "@/utils/attrs/field";
import {
  SalaryNotifyDtalkRobotListApi,
  SalaryNotifyDtalkRobotApi,
  SalaryNotifyDtalkRobotAddApi,
  SalaryNotifyDtalkRobotUpdateApi,
  SalaryNotifyDtalkRobotDeleteApi,
  SalaryNotifyDtalkRobotBatchDeleteApi,
  SalaryNotifyDtalkRobotSelectApi,
  SalaryNotifyDtalkRobotPingApi
} from "@/api/modules/salaryNotify";
import { DtalkRobotModel } from "@/models/salaryModel";

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
    default: false
  }
});
const emit = defineEmits(["update:visible"]);

// Drawer属性
const dwConfigField = reactive({
  size: "80%",
  withHeader: false
});
const dwField = { ...drawerField, ...dwConfigField };

const loading = ref(false);
const btnDisabled = ref(false);
const btnLoading = ref(false);
const pingLoading = ref("");
const rows = ref<DtalkRobotModel[]>([]);
const selectedKeys = ref<string[]>([]);
const editVisible = ref(false);
const form = reactive({
  md5: "",
  name: "",
  key: "",
  secret: "",
  description: "",
  select: false
});

// 打开
const openHandle = () => {
  fetchList();
};

// 关闭
const closeHandle = () => {
  emit("update:visible", false);
};

// 列表
const fetchList = async () => {
  loading.value = true;
  let response: any = null;
  try {
    response = await SalaryNotifyDtalkRobotListApi();
  } finally {
    loading.value = false;
  }
  rows.value = response?.data?.list || [];
};

// 选择
const selectionChange = (selection: DtalkRobotModel[]) => {
  selectedKeys.value = selection.map(item => item.md5);
};

// 新增
const addHandle = () => {
  form.md5 = "";
  form.name = "";
  form.key = "";
  form.secret = "";
  form.description = "";
  form.select = rows.value.length === 0;
  editVisible.value = true;
};

// 编辑
const editHandle = async (row: DtalkRobotModel) => {
  const response: any = await SalaryNotifyDtalkRobotApi({ md5: row.md5 });
  const data = response?.data;
  if (!data) return;
  form.md5 = data.md5 || "";
  form.name = data.name || "";
  form.key = data.key || "";
  form.secret = data.secret || "";
  form.description = data.description || "";
  form.select = !!data.select;
  editVisible.value = true;
};

// 保存
const saveHandle = () => {
  if (!form.name || !form.key || !form.secret) {
    ElMessage.warning("机器人名称、APP-KEY、APP-SECRET 不允许为空");
    return;
  }
  const params = {
    name: form.name,
    key: form.key,
    secret: form.secret,
    description: form.description,
    select: form.select
  };
  btnDisabled.value = true;
  btnLoading.value = true;
  const request = form.md5
      ? SalaryNotifyDtalkRobotUpdateApi({ md5: form.md5, ...params })
      : SalaryNotifyDtalkRobotAddApi(params);
  request.then(() => {
    ElNotification.success({ title: "提示", message: "保存成功" });
    editVisible.value = false;
    fetchList();
  }).finally(() => {
    btnDisabled.value = false;
    btnLoading.value = false;
  });
};

// Ping
const pingHandle = (row: DtalkRobotModel) => {
  if (pingLoading.value) return;
  pingLoading.value = row.md5;
  SalaryNotifyDtalkRobotPingApi({ md5: row.md5 }).then(() => {
    ElNotification.success({ title: "提示", message: "PING成功，配置可用" });
  }).finally(() => {
    pingLoading.value = "";
  });
};

// 设为默认
const selectHandle = (row: DtalkRobotModel) => {
  SalaryNotifyDtalkRobotSelectApi({ md5: row.md5, select: true }).then(() => {
    ElNotification.success({ title: "提示", message: "默认机器人设置成功" });
    fetchList();
  });
};

// 单条删除
const deleteHandle = (row: DtalkRobotModel) => {
  ElMessageBox.confirm("确认删除该机器人配置吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    SalaryNotifyDtalkRobotDeleteApi({ md5: row.md5 }).then(() => {
      ElNotification.success({ title: "提示", message: "删除成功" });
      fetchList();
    }).catch(() => {});
  }).catch(() => {
    ElMessage.info("已取消删除操作");
  });
};

// 批量删除
const batchDeleteHandle = () => {
  if (selectedKeys.value.length === 0) {
    ElMessage.warning("请选择需要删除的机器人");
    return;
  }
  ElMessageBox.confirm(`确认删除选择的 ${selectedKeys.value.length} 条机器人配置吗？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    SalaryNotifyDtalkRobotBatchDeleteApi({ md5: selectedKeys.value }).then(() => {
      ElNotification.success({ title: "提示", message: "删除成功" });
      fetchList();
    }).catch(() => {});
  }).catch(() => {
    ElMessage.info("已取消删除操作");
  });
};
</script>

<style scoped lang="scss">
:deep(.el-drawer__body) {
  padding: 0;
}

.robot-container {
  height: 100vh;
}

.robot-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 20px;
  border-bottom: 1px solid var(--el-border-color-lighter);

  .left-panel h2 {
    font-size: 18px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  .right-panel {
    display: flex;
    align-items: center;

    .el-button + .el-button {
      margin-left: 10px;
    }
  }
}

.robot-main {
  padding: 0;
  background: var(--el-bg-color);
}

.robot-table-box {
  height: calc(100vh - 95px);
  padding: 15px 20px 20px 20px;
  box-sizing: border-box;
}
</style>
