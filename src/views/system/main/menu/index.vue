<template>
  <el-container>
    <el-header>
      <el-button id="btn-add" :type="buttonField.type" :plain="buttonField.plain" :size="buttonField.size" icon="Plus" @click="addMenuHandle()">新增</el-button>
      <el-button :type="buttonField.type" :plain="buttonField.plain" :size="buttonField.size" :icon="allExpanded ? 'Fold' : 'Expand'" @click="toggleAllExpand">{{ allExpanded ? '全部关闭' : '全部展开' }}</el-button>
      <el-alert class="alert" :title="alertContent" type="success" />
    </el-header>
    <el-main class="nopadding">
      <fc-filter-table ref="fcTableRef" :tableName="apiName" :requestApi="fetchTableData" :columns="columns"
                :rowKey="ftField.rowKey" :stripe="ftField.stripe" :border="ftField.border" :indent="ftField.indent" :pagination="ftField.pagination"
                :showBottomView="ftField.showBottomView" :showRefreshBtn="ftField.showRefreshBtn"
                :showColumnBtn="ftField.showColumnBtn" :showDownloadBtn="ftField.showDownloadBtn">
        <!-- 菜单标题 -->
        <template #title="scope">
          <span>{{ scope.row.title }}</span>
          <span v-if="scope.row?.tag" class="menu-tag-line">{{ scope.row.tag }}</span>
        </template>
        <!-- 菜单图标 -->
        <template #icon="scope">
          <el-icon :size="18">
            <component :is="scope.row.icon" v-if="scope.row.icon"/>
          </el-icon>
        </template>
        <!-- 菜单类型 -->
        <template #type="scope">
          <el-button :type="menuTypeColor(scope.row.type)" size="small" plain>{{ scope.row.type }}</el-button>
        </template>

        <!-- 表格操作 -->
        <template #options="scope">
          <el-button type="primary" icon="Plus" link @click="addMenuHandle(scope.row.id)">添加子菜单</el-button>
          <el-button class="margin-left-10px" type="primary" icon="Edit" link @click="editeHandle(scope.row.md5)">编辑</el-button>
          <el-popconfirm :title="pcField.title" :confirm-button-text="pcField.confirmText" :cancel-button-text="pcField.cancelText"
                         :confirm-button-type="pcField.confirmType" :cancel-button-type="pcField.cancelType"
                         :icon="pcField.icon" :icon-color="pcField.iconColor" :width="pcField.width"
                         @confirm="deleteHandle(scope.row.md5)">
            <template #reference>
              <el-button class="margin-left-10px" type="danger" link>删除</el-button>
            </template>
          </el-popconfirm>
        </template>
        <!-- 状态管理
        <template #isHide="scope">
          <el-switch v-model="scope.row.isHide" active-text="隐藏" inactive-text="启用" style="--el-switch-on-color: #ff4949; --el-switch-off-color: #13ce66;" @change="statusHandle(scope.row.md5, $event)" />
        </template>
        -->
      </fc-filter-table>
    </el-main>

    <!--新增-->
    <MenuAdd v-model:visible="addVisible" :pid="tableRowId" @reFetchTableData="reFetchTableData" />

    <!--编辑-->
    <MenuEdit v-model:visible="editVisible" :md5="tableRowMd5" @reFetchTableData="reFetchTableData" />

  </el-container>
</template>

<script setup lang='ts'>

import { reactive, ref, onMounted } from 'vue'
import { ColumnProps, FcFilterTableInstance } from "@/components/fcFilterTable/model"
import { SysMainMenuDeleteApi, SysMainMenuListApi } from '@/api/modules/systemMain';
import { ElNotification } from 'element-plus';
import MenuEdit from "./components/edit.vue";
import MenuAdd from "./components/add.vue";
import {fcTableField, PopConfirmField, buttonField } from "@/utils/attrs/field";
import { TableFieldColumnApi } from "@/api/modules/common";

// fc-table属性
const fcTableConfig = reactive({
  rowKey: "md5",
  indent: 25,
  border: false,
  pagination: false,
  showDownloadBtn: false
});
const ftField = {...fcTableField, ...fcTableConfig};
const pcField = {...PopConfirmField, ...{}};

// fc-Table 实例
const fcTableRef = ref<FcFilterTableInstance>();
const allExpanded = ref(false);
// 表格配置项（后端报表配置下发）
const columns = ref<ColumnProps<Menu.MenuOptions>[]>([]);

onMounted(() => {
  fetchTableFieldColumn(); // 表头数据
});

const fetchTableFieldColumn = async () => {
  const response = await TableFieldColumnApi({xtbb: apiName});
  if (response.code === 100 && response.data) {
    columns.value = response.data;
  } else {
    ElNotification({
      title: '提示',
      message: '报表未配置表头，请联系平台管理员！',
      type: 'warning'
    });
  }
};

// Dialog状态管理
const addVisible= ref(false); // 新增菜单
const editVisible = ref(false); // 编辑菜单

const alertContent = ref('只展示系统动态路由的配置菜单，关于前端默认路由配置与静态路由不展示。');
const apiName = "SystemMainMenu"; // 组件标识名称
const tableRowMd5 = ref(""); // 默认当前选择的数据MD5
const tableRowId = ref<number | undefined>(undefined); // 默认当前选择的菜单ID，非数字为新增，否则添加子菜单

// 表格数据
const fetchTableData = async (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return await SysMainMenuListApi(newParams);
};

// 重新获取表格数据
const reFetchTableData = (isReload: boolean = false) => {
  if (isReload) {
    fcTableRef.value?.getTableList();
  }
};

// 启用/隐藏菜单
// const statusHandle = (md5: string, value: boolean) => {
//   SysMainMenuStatusApi({md5, value}).then(() => {
//     const message = value ? '<strong>状态修改成功</strong><br /><div style="color: red;">隐藏菜单为系统功能中不可见状态</div>' : '<strong>状态修改成功</strong>';
//     ElNotification({
//       title: '提示',
//       dangerouslyUseHTMLString: true,
//       message,
//       type: 'success'
//     });
//   })
// };

// 菜单类型对应的按钮颜色
const menuTypeColor = (type: string) => {
  switch (type) {
    case "MENU": return "primary";
    case "LINK": return "success";
    case "BUTTON": return "danger";
    default: return "primary";
  }
};

// 新增菜单
const addMenuHandle = (id: number | undefined = undefined) => {
  tableRowId.value = id;
  addVisible.value = true;
}


// 编辑
const editeHandle = (md5: string) => {
  tableRowMd5.value = md5;
  editVisible.value = true;
}

// 删除
const deleteHandle = (md5: string) => {
  SysMainMenuDeleteApi({ md5 }).then(() => {
    ElNotification({
      title: '提示',
      message: '删除成功',
      type: 'success'
    });
    reFetchTableData(true); // 成功后刷新数据
  })
}

const toggleAllExpand = () => {
  const elTable = fcTableRef.value?.element;
  if (!elTable) return;
  allExpanded.value = !allExpanded.value;
  const walk = (list: any[]) => {
    list.forEach((row) => {
      if (row.children && row.children.length > 0) {
        elTable.toggleRowExpansion(row, allExpanded.value);
        walk(row.children);
      }
    });
  };
  walk(elTable.store.states.data.value);
}

</script>

<style scoped>
.alert {
  margin-left: 20px;
}

.menu-tag-line {
  margin-left: 10px;
  /*position: absolute;*/
  height: 18px;
  line-height: 18px;
  background: var(--el-color-danger);
  font-size: 13px;
  color: #fff;
  right: 20px;
  border-radius: 18px;
  padding: 0 6px;
}
</style>
