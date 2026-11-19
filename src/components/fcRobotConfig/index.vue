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
          <h2>{{ entityName }}配置</h2>
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
            <el-table-column type="selection" width="80" align="center" />
            <el-table-column prop="id" label="序号" width="100" align="center" />
            <el-table-column :label="`${entityName}名称`" show-overflow-tooltip>
              <template #default="scope">{{ scope.row.name || "-" }}</template>
            </el-table-column>
            <el-table-column prop="key" label="APP-KEY" show-overflow-tooltip />
            <el-table-column label="APP-SECRET" show-overflow-tooltip>
              <template #default="scope">
                <span v-if="scope.row.secret">••••••••</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="描述" show-overflow-tooltip>
              <template #default="scope">{{ scope.row.description || "-" }}</template>
            </el-table-column>
            <el-table-column label="默认" align="center">
              <template #default="scope">
                <el-tag v-if="scope.row.select" type="success">默认</el-tag>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip align="center" />
            <el-table-column label="操作" width="260" align="center" fixed="right">
              <template #default="scope">
                <el-button link type="primary" icon="EditPen" @click="editHandle(scope.row)">编辑</el-button>
                <el-button link type="success" icon="Connection" :loading="pingLoading === scope.row.md5"
                           @click="pingHandle(scope.row)">Ping</el-button>
                <el-button v-if="!scope.row.select" link type="warning" icon="Star" @click="selectHandle(scope.row)">设为默认</el-button>
                <el-button link type="danger" icon="Delete" @click="deleteHandle(scope.row)">删除</el-button>
              </template>
            </el-table-column>
            <template #empty>
              <el-empty :description="`暂无${entityName}配置`" :image-size="90" />
            </template>
          </el-table>
        </div>
      </el-main>
    </el-container>

    <!--新增/编辑-->
    <RobotEdit v-model:visible="editVisible" :md5="editMd5" :default-select="rows.length === 0"
               :api-set="props.apiSet" @reFetchTableData="fetchList" />
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
import { drawerField } from "@/utils/attrs/field";
import RobotEdit from "./edit.vue";
import type { RobotApiSet } from "./model";

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
    default: false
  },
  // 渠道接口集合（钉钉、企业微信等）
  apiSet: {
    type: Object as () => RobotApiSet,
    required: true
  }
});
const emit = defineEmits(["update:visible"]);

// Drawer属性
const dwConfigField = reactive({
  size: "85%",
  withHeader: false
});
const dwField = { ...drawerField, ...dwConfigField };

// 实体名称
const entityName = computed(() => props.apiSet.entityName || "机器人");

const loading = ref(false);
const pingLoading = ref("");
const rows = ref<any[]>([]);
const selectedKeys = ref<string[]>([]);
const editVisible = ref(false);
const editMd5 = ref("");

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
    response = await props.apiSet.list();
  } finally {
    loading.value = false;
  }
  rows.value = response?.data?.list || [];
};

// 选择
const selectionChange = (selection: any[]) => {
  selectedKeys.value = selection.map(item => item.md5);
};

// 新增
const addHandle = () => {
  editMd5.value = "";
  editVisible.value = true;
};

// 编辑
const editHandle = (row: any) => {
  editMd5.value = row.md5;
  editVisible.value = true;
};

// Ping
const pingHandle = (row: any) => {
  if (pingLoading.value) return;
  pingLoading.value = row.md5;
  props.apiSet.ping({ md5: row.md5 }).then(() => {
    ElNotification.success({ title: "提示", message: "PING成功，配置可用" });
  }).finally(() => {
    pingLoading.value = "";
  });
};

// 设为默认
const selectHandle = (row: any) => {
  props.apiSet.select({ md5: row.md5, select: true }).then(() => {
    ElNotification.success({ title: "提示", message: `默认${entityName.value}设置成功` });
    fetchList();
  });
};

// 单条删除
const deleteHandle = (row: any) => {
  ElMessageBox.confirm(`确认删除该${entityName.value}配置吗？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    props.apiSet.remove({ md5: row.md5 }).then(() => {
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
    ElMessage.warning(`请选择需要删除的${entityName.value}`);
    return;
  }
  ElMessageBox.confirm(`确认删除选择的 ${selectedKeys.value.length} 条${entityName.value}配置吗？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    props.apiSet.batchRemove({ md5: selectedKeys.value }).then(() => {
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
    color: var(--el-text-color-secondary);
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

// 表格表头背景色
:deep(.el-table th.el-table__cell) {
  background-color: var(--el-fill-color-light);
  color: var(--el-text-color-regular);
}

.robot-table-box {
  height: calc(100vh - 95px);
  padding: 15px 20px 20px 20px;
  box-sizing: border-box;
}
</style>
