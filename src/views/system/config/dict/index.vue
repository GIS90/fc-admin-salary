<template>
  <el-container>
    <!--字典分类-->
    <el-aside>
      <el-container>
        <el-main class="nopadding">
          <fc-tree-filter ref="fcTreeFilterRef" :name="ftfField.name" :tree-props="ftfField.treeProps" :multiple="ftfField.multiple"
              :show-search="ftfField.showSearch" :showAll="ftfField.showAll" :border="ftfField.border"
              :request-api="ftfField.requestApi" :default-value="selectKeyMd5"
              @change="changeTreeFilter" @selectClick="clickTreeNode">
            <template #option="scope">
              <span class="custom-tree-node">
                <span class="code">{{ scope.row.data.key }}</span>
                <span class="do" v-show="scope.row.data.key !== allNode">
                  <el-button-group v-if="!scope.row.data.status">
                    <el-button icon="Edit" size="small" @click.stop="editDictKeyHandle(scope.row.data)" />
                    <el-popconfirm title="确认要锁定吗？" :confirm-button-text="pcField.confirmText" :cancel-button-text="pcField.cancelText"
                                   :confirm-button-type="pcField.confirmType" :cancel-button-type="pcField.cancelType"
                                   :icon="pcField.icon" :icon-color="pcField.iconColor" :width="pcField.width"
                                   @confirm="lockDictKeyHandle(scope.row.data)">
                      <template #reference>
                        <el-button icon="Lock" size="small" />
                      </template>
                    </el-popconfirm>
                    <el-popconfirm :title="pcField.title" :confirm-button-text="pcField.confirmText" :cancel-button-text="pcField.cancelText"
                                   :confirm-button-type="pcField.confirmType" :cancel-button-type="pcField.cancelType"
                                   :icon="pcField.icon" :icon-color="pcField.iconColor" :width="pcField.width"
                                   @confirm="deleteDictCateHandle(scope)">
                      <template #reference>
                        <el-button icon="Delete" size="small" />
                      </template>
                    </el-popconfirm>
                  </el-button-group>
                   <el-tooltip effect="dark" content="已锁定" placement="top" v-else>
                    <el-button icon="Unlock" size="small" @click.stop="unlockDictKeyHandle(scope.row.data)" />
                  </el-tooltip>
                </span>
              </span>
            </template>
          </fc-tree-filter>
        </el-main>
        <el-footer>
          <el-button type="primary" icon="Plus" style="width: 100%;" @click="addDictKeyHandle()">字典分类</el-button>
        </el-footer>
      </el-container>
    </el-aside>
    <!--字典列表-->
    <el-container>
      <el-header>
        <div class="left-panel">
          <el-button id="btn-add" class="table-handle-button" :type="buttonField.type" :plain="buttonField.plain" :size="buttonField.size" icon="Plus" @click="addDictEnumHandle()">新增</el-button>
          <el-button id="btn-batch-delete" type="danger" :plain="buttonField.plain" :size="buttonField.size" icon="Delete" @click="batchDeleteDictEnumHandle" :disabled="!fcTableRef?.isSelected">批量删除</el-button>
        </div>
    </el-header>
    <el-main class="nopadding">
        <fc-table ref="fcTableRef" :tableName="apiName" :requestApi="fetchTableData" :initParam="requestParam" :columns="columns"
                  :rowKey="ftField.rowKey" :stripe="ftField.stripe" :border="ftField.border" :pagination="ftField.pagination"
                  :showBottomView="ftField.showBottomView" :showRefreshBtn="ftField.showRefreshBtn"
                  :showColumnBtn="ftField.showColumnBtn" :showDownloadBtn="ftField.showDownloadBtn">
          <!-- 表格操作 -->
          <template #options="scope">
            <el-tooltip effect="dark" content="编辑" placement="top">
              <el-icon class="table-handle-icon" @click="editDictEnumHandle(scope.row)">
                <EditPen />
              </el-icon>
            </el-tooltip>
            <el-popconfirm :title="pcField.title" :confirm-button-text="pcField.confirmText" :cancel-button-text="pcField.cancelText"
                           :confirm-button-type="pcField.confirmType" :cancel-button-type="pcField.cancelType"
                           :icon="pcField.icon" :icon-color="pcField.iconColor" :width="pcField.width"
                           @confirm="deleteDictEnumHandle(scope.row.md5)">
              <template #reference>
                <el-icon class="table-handle-icon margin-left-25px">
                  <Delete />
                </el-icon>
              </template>
            </el-popconfirm>
          </template>
          <!-- 状态管理 -->
          <template #status="scope">
            <el-switch v-model="scope.row.status" active-text="禁用" inactive-text="启用" style="--el-switch-on-color: #ff4949; --el-switch-off-color: #13ce66;" @change="statusDictEnumHandle(scope.row.md5, $event)" />
          </template>
        </fc-table>
      </el-main>
    </el-container>

    <!--批量删除-->
    <fc-batch-delete v-model:visible="batchDeleteVisible" :api="apiName" :md5List="tableSelectList" @reFetchTableData="reFetchTableData"/>

    <!--字典分类.新增-->
    <KeyAdd v-model:visible="addKeyVisible" @reFetchTreeData="reFetchTreeData" />

    <!--字典分类.编辑-->
    <KeyEdit v-model:visible="editKeyVisible" :md5="selectKeyMd5" @reFetchTreeData="reFetchTreeData" />

    <!--字典枚举.新增-->
    <EnumAdd v-model:visible="addEnumVisible" :name="selectKeyName" @reFetchTableData="reFetchTableData" />

    <!--字典分类.编辑-->
    <EnumEdit v-model:visible="editEnumVisible" :md5="selectEnumMd5" @reFetchTableData="reFetchTableData" />

  </el-container>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue';
import {ElMessage, ElNotification} from "element-plus";
import {
  SysOpsDictKeyListApi, SysOpsDictEnumListApi,
  SysOpsDictKeyDeleteApi, SysOpsDictEnumDeleteApi,
  SysOpsDictEnumStatusApi, SysOpsDictKeyStatusApi,
} from '@/api/modules/systemConfig';
import { DictKeyListModel, DictEnumListModel } from "@/models/systemModel";
import { ColumnProps, FcTableInstance } from "@/components/fcTable/model";
import FcTreeFilter from '@/components/fcTreeFilter/index.vue';
import { fcTableField, fcTreeFilterField, PopConfirmField, buttonField } from "@/utils/attrs/field";
import { tableWidth } from "@/utils/attrs/table";
import KeyAdd from "./components/addKey.vue";
import EnumAdd from "./components/addEnum.vue";
import KeyEdit from "./components/editKey.vue";
import EnumEdit from "./components/editEnum.vue";

const allNode = 'ALL'; // 全部节点
const apiName = "SystemOpsDict"; // 组件标识名称
const batchDeleteVisible = ref(false);
const selectKeyMd5 = ref(allNode); //fcTreeFilter-Key选中值Md5，默认全部
const selectKeyName = ref(""); //fcTreeFilter-Key选中值Md5，默认全部
const selectEnumMd5 = ref(allNode); //fcTable-Value选中值Md5
let tableSelectList = reactive([] as string[]); // 当前选择数据Keys列表
const requestParam = reactive({"content": allNode })  // DictInfo查询Key，默认为ALL
const pcField = {...PopConfirmField, ...{}};
const addKeyVisible = ref(false); // 字典Key[新增]组件状态
const editKeyVisible = ref(false); // 字典Key[编辑]组件状态
const addEnumVisible = ref(false); // 字典Enum[新增]组件状态
const editEnumVisible = ref(false); // 字典Enum[编辑]组件状态

const fcTreeFilterRef = ref<InstanceType<typeof FcTreeFilter>>()    // fcTreeFilter 实例
// fc-tree-filter属性
const fcTreeFilterConfig = reactive({
  name: "md5",
  showSearch: true,
  treeProps: {label: "remark"}, // 设置label显示内容
  requestApi: SysOpsDictKeyListApi, // 数据API
});
const ftfField = {...fcTreeFilterField, ...fcTreeFilterConfig};

// 设置选择数据Key
const setKeySelected = (row: any) => {
  selectKeyMd5.value = row.md5;
  requestParam.content = row.key;
  selectKeyName.value = row.key === allNode ? "" : row.key;
};

const clickTreeNode = (node: any) => {
  if (node.status) {
    ElMessage.warning("数据已锁定，请先解锁");
  };
  // 设置当前选择
  setKeySelected(node);
  // 拉取参数枚举列表
  reFetchTableData(true);
};

// 设置checkbox为True，获取选择数据
const changeTreeFilter = (_keys: []) => {};

const fcTableRef = ref<FcTableInstance>();  // fcTabel 实例
// fc-table属性
const fcTableConfig= reactive({
  rowKey: "md5",
  border: false
});
const ftField = {...fcTableField, ...fcTableConfig};

// table表格配置
const columns = reactive<ColumnProps<DictEnumListModel>[]>([
  { type: "selection", fixed: "left", width: 60 },
  { prop: "id", label: "ID", width: tableWidth.id },
  { prop: "name", label: "Key值" },
  { prop: "key", label: "名称" },
  { prop: "value", label: "键值" },
  { prop: "orderId", label: "顺序" },
  { prop: "options", label: "操作", width: tableWidth.option2, fixed: "right" },
  { prop: "status", label: "状态管理", width: tableWidth.status, fixed: "right" }
]);

// 表格数据
const fetchTableData = async (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return await SysOpsDictEnumListApi(newParams);
};

// 重新获取Table数据 + 清空选择数据
const reFetchTableData = (isReload: boolean = false) => {
  if (isReload) {
    fcTableRef.value?.clearSelection(); // 清除表格选择数据
    fcTableRef.value?.getTableList(); // 重新获取表格数据
  }
};

// 重新获取Tree数据
const reFetchTreeData = (isReload: boolean = false) => {
  if (isReload) {
    // setKeySelected({id: "ALL", name: "ALL", key: "ALL"}); // 默认选择全部节点
    fcTreeFilterRef.value?.getData();
    reFetchTableData(true);
  }
};

// 字典分类.单条删除
const deleteDictCateHandle = (scope: any) => {
  if (scope?.row?.data?.md5 == allNode) {
    ElMessage.warning("全部字典类别不允许操作");
    return;
  };
  SysOpsDictKeyDeleteApi({ md5: scope.row.data.md5 }).then(() => {
    ElNotification({
      title: '提示',
      message: '删除成功',
      type: 'success'
    });
    // 更新Tree数据
    const parent = scope.row.node.parent;
    const children = parent.data.children || parent.data;
    const index = children.findIndex((d: any) => d.md5 === scope.row.data.md5);
    children.splice(index, 1);
    fcTreeFilterRef.value!.treeAllData = [...fcTreeFilterRef.value!.treeAllData];
    // 更新当前选择变量
    selectKeyMd5.value = allNode;
    requestParam.content = allNode;
    // 刷新字典枚举数据
    reFetchTableData(true);
  })
};


// 字典分类.锁定
const lockDictKeyHandle = (row: DictKeyListModel) => {
  if (row?.md5 == allNode) {
    ElMessage.warning("全部字典类别不允许操作");
    return;
  };
  SysOpsDictKeyStatusApi({ md5: row.md5, value: true }).then(() => {
    ElNotification({
      title: '提示',
      message: '数据已锁定，如进行操作请先进行解锁',
      type: 'success'
    });

    setKeySelected({id: "ALL", name: "ALL", key: "ALL"}); // setKeySelected(row); // fcTreeFilterRef.value?.setCheckedKey(row.md5);
    fcTreeFilterRef.value?.getData();
    reFetchTableData(true);
  });

};

// 字典分类.解锁
const unlockDictKeyHandle = (row: DictKeyListModel) => {
  if (row?.md5 == allNode) {
    ElMessage.warning("全部字典类别不允许操作");
    return;
  };
  SysOpsDictKeyStatusApi({ md5: row.md5, value: false }).then(() => {
    ElNotification({
      title: '提示',
      message: '数据已解锁',
      type: 'success'
    });
    setKeySelected({id: "ALL", name: "ALL", key: "ALL"});
    fcTreeFilterRef.value?.getData();
    reFetchTableData(true);
  });

};

// 字典分类.新增
const addDictKeyHandle = () => {
  addKeyVisible.value = true;
};

// 字典分类.编辑
const editDictKeyHandle = (data: any) => {
  editKeyVisible.value = true;
  setKeySelected(data)
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// 字典枚举.单条删除
const deleteDictEnumHandle = (md5: string) => {
  SysOpsDictEnumDeleteApi({ md5 }).then(() => {
    ElNotification({
      title: '提示',
      message: '删除成功',
      type: 'success'
    });
    reFetchTableData(true);
  })
};

// 字典枚举.批量删除
const batchDeleteDictEnumHandle = () => {
  // 无选择数据
  if (!fcTableRef.value?.isSelected) {
    ElMessage.warning("请选择需要删除的数据");
    return;
  }

  tableSelectList = fcTableRef.value?.selectedListKeys;
  batchDeleteVisible.value = true;

};

// 字典枚举.启用/禁用
const statusDictEnumHandle = (md5: string, value: boolean) => {
  SysOpsDictEnumStatusApi({md5, value}).then(() => {
    const message = value ? '<strong>状态修改成功</strong><br /><div style="color: red;">禁用状态的字典数据不可选择</div>' : '<strong>状态修改成功</strong>';
    ElNotification({
      title: '提示',
      dangerouslyUseHTMLString: true,
      message,
      type: 'success'
    });
  })
};

// 字典枚举.新增
const addDictEnumHandle = () => {
  addEnumVisible.value = true;
};

// 字典枚举.编辑
const editDictEnumHandle = (data: any) => {
  selectEnumMd5.value = data.md5;
  editEnumVisible.value = true;
};
</script>

<style scoped>
.type {
    font-size: 12px;
    color: #999;
}

.custom-tree-node .code {
    font-size: 12px;
    color: #999;
}

.custom-tree-node .do {
    display: none;
}

.custom-tree-node:hover .code {
    display: none;
}

.custom-tree-node:hover .do {
    display: inline-block;
}
</style>
