<template>
  <div class="box">
    <!--操作-->
    <el-row :gutter="20" class="box-opr">
      <!--操作>过滤器-->
      <el-col :span="12">
        <el-input v-model.trim="filterText"
                  style="width: 100%"
                  :size="inputField.size"
                  :show-word-limit="inputField.showWordLimit"
                  :clearable="inputField.clearable"
                  :prefix-icon="inputField.prefixIcon"
                  maxlength="25"
                  placeholder="请输入查询的节点"
        />
      </el-col>
      <!--操作>操作按钮-->
      <el-col :span="12">
         <span style="float: left">
          <el-button id="btn-delete" type="danger" icon="Delete" plain @click="batchDeleteHandle">
            批量删除
          </el-button>
          <el-button id="btn-reset" icon="RefreshRight" plain @click="resetHandle">
            清空选择
          </el-button>
        </span>
        <span style="float: right">
          <el-tooltip effect="dark" content="刷新" placement="top">
            <el-button icon="Refresh" :plain="buttonField.plain" :size="buttonField.size"
                       circle @click="refreshHandle" />
          </el-tooltip>
          <el-tooltip effect="dark" content="下载" placement="top">
            <el-button icon="Download" :plain="buttonField.plain" :size="buttonField.size"
                       circle @click="downloadHandle" />
          </el-tooltip>
        </span>
      </el-col>
    </el-row>
    <!--tree-->
    <el-row :gutter="20" class="box-app">
      <!--tree>列表-->
      <el-col :span="12">
        <el-tree
            ref="treeRef"
            class="box-app-tree"
            :data="treeData"
            :node-key="teField.nodeKey"
            :empty-text="teField.emptyText"
            :props="defaultTreeProps"
            :render-after-expand="teField.renderAfterExpand"
            :highlight-current="teField.highlightCurrent"
            :default-expand-all="teField.defaultExpandAll"
            :expand-on-click-node="teField.expandOnClickNode"
            :check-on-click-node="teField.checkOnClickNode"
            :auto-expand-parent="teField.autoExpandParent"
            :show-checkbox="teField.showCheckbox"
            :check-strictly="teField.checkStrictly"
            :indent="teField.indent"
            :draggable="teField.draggable"
            :default-expanded-keys="treeExpandedKeys"
            :filter-node-method="filterNodeMethod"
            :allow-drag="allowDrag"
            @node-click="nodeClick"
            @check="nodeCheck"
            @node-drop="nodeDrag"
            @node-expand="nodeExpand"
        >
          <template #default="{ node, data }">
            <div class="custom-tree-node">
              <span>{{ node.label }}</span>
              <div>
                <el-button :disabled="node.disabled" type="primary" link @click="nodeAppend(node, data)">
                  新增
                </el-button>
                <el-button type="primary" link @click="nodeEdit(data)">
                  编辑
                </el-button>
                <el-popconfirm :title="pcField.title" :confirm-button-text="pcField.confirmText" :cancel-button-text="pcField.cancelText"
                               :confirm-button-type="pcField.confirmType" :cancel-button-type="pcField.cancelType"
                               :icon="pcField.icon" :icon-color="pcField.iconColor" :width="pcField.width"
                               @confirm="nodeRemove(node, data)">
                  <template #reference>
                    <el-button v-show="data.id !== 1" type="danger" link :disabled="node.disabled">
                      删除
                    </el-button>
                  </template>
                </el-popconfirm>
              </div>
            </div>
          </template>
        </el-tree>
      </el-col>
      <!--tree>数据-->
      <el-col :span="12" class="box-app-data">
        <Edit v-model:visible="editVisible" :md5="selectNodeMd5" @fetch-tree-data="fetchTreeData"/>
      </el-col>
    </el-row>

    <!--新增-->
    <Add v-model:visible="addVisible" :md5="selectNodeMd5" @node-append-tree="nodeAppendTree" />

    <!--批量删除-->
    <fc-batch-delete v-model:visible="batchDeleteVisible" :api="apiName" :md5List="treeCheckedKeys" @reFetchTableData="fetchTreeData"/>

    <!--表格下载-->
    <fc-batch-download v-model:visible="downloadVisible" :api="apiName" :md5List="treeCheckedKeys" />
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, watch, onMounted } from 'vue'
import {inputField, buttonField, treeField, PopConfirmField} from "@/utils/attrs/field";
import type { TreeInstance } from 'element-plus'
import {ElMessage, ElNotification, ElTree} from "element-plus";
import { DepartmentNode } from "@/models/systemModel";
import {SysOpsDepartDeleteApi, SysOpsDepartDragApi, SysOpsDepartTreeApi} from "@/api/modules/systemOps";
import type Node from 'element-plus/es/components/tree/src/model/node'
import type { DragEvents } from 'element-plus/es/components/tree/src/model/useDragNode'
import type { NodeDropType, FilterNodeMethodFunction } from 'element-plus/es/components/tree/src/tree.type'
import Add from "./components/add.vue";
import Edit from "./components/edit.vue";

const treeRef = ref<TreeInstance>(); // Tree组件实例
const treeData = ref<DepartmentNode[]>([]); // Tree数据
const apiName = "SystemOpsDepart"; // 组件标识名称
let treeCheckedKeys = ref<string[]>([]); // 选中
let treeExpandedKeys = ref<string[]>([]); // 展开
const filterText = ref(''); // 过滤器值
const selectNodeMd5 = ref('');
const addVisible = ref(false); // 新增
const editVisible = ref(false); // 编辑
const batchDeleteVisible = ref(false); // 批量删除
const downloadVisible = ref(false); // 下载
const addNodeParent = ref<Node | null>(null);

// Tree属性
const treeConfigField = reactive({
  nodeKey: 'md5',
  draggable: true,
  expandOnClickNode: false,
  indent: 20
});
const teField = {...treeField, ...treeConfigField};
const pcField = {...PopConfirmField, ...{}};
// 默认的树节点属性
const defaultTreeProps = {
  label: 'label',
  children: 'children',
  disabled: 'disabled'
};

watch(filterText, (val) => {
  treeRef.value!.filter(val)
});

onMounted(() => {
  fetchTreeData();
});

const fetchTreeData = async () => {
  const response = await SysOpsDepartTreeApi();
  if (response.data) {
    const res = response.data as { data: DepartmentNode[], check: string[], expand: string[] }; // declare
    treeData.value = res.data;
    if (treeExpandedKeys.value.length === 0) {
      treeExpandedKeys.value = res.expand;
    }
    treeCheckedKeys.value = []; // 刷新为空
  }
}

const filterNodeMethod = ((value: string, data: any, _node: any) => {
  if (!value) return true;
  const departmentData = data as DepartmentNode;
  return departmentData.label.includes(value);
}) as FilterNodeMethodFunction;

const resetHandle = () => {
  treeRef.value!.setCheckedKeys([], false);
};

const refreshHandle = () => {
  fetchTreeData();
};

const downloadHandle = () => {
  downloadVisible.value = true;
};

const nodeClick = (node: DepartmentNode) => {
  selectNodeMd5.value = node.md5;
};

const nodeCheck = (_data: any, state: any) => {
  if (state?.checkedKeys) {
    treeCheckedKeys.value = state.checkedKeys;
  }
};

// 验证节点是否可以拖拽逻辑
const allowDrag = (draggingNode: Node) => {
  if (draggingNode.data.id === 1) {
    ElNotification({
      title: '提示',
      message: '架构根节点不允许调整',
      type: 'error'
    });
    return false;
  }
  if (draggingNode.data.disabled === true) {
    ElNotification({
      title: '提示',
      message: '节点已锁定不允许移动，请先解锁进行调整',
      type: 'error'
    });
    return false;
  }
  return true;
}

const nodeDrag = (draggingNode: Node, dropNode: Node, dropType: NodeDropType, _event: DragEvents) => {
  // 获取拖拽后的父节点
  let parentNodeId;
  if (dropType === 'inner') {
    // 如果拖拽到目标节点内部（成为子节点）
    parentNodeId = dropNode.data.id;
  } else {
    // 如果拖拽到目标节点前后（成为兄弟节点）
    parentNodeId = dropNode.parent.data.id;
  }

  SysOpsDepartDragApi({ md5: draggingNode.data.md5, pid: parentNodeId }).then(() => {
    ElNotification({
      title: '提示',
      message: '节点架构调整成功',
      type: 'success'
    });
  })

};

const nodeExpand = (data: DepartmentNode) => {
  if (!treeExpandedKeys.value.includes(data.md5)) {
    treeExpandedKeys.value.push(data.md5);
  } else {
    treeExpandedKeys.value = treeExpandedKeys.value.filter(key => key !== data.md5);
  }
}

const nodeAppend = (node: Node, data: DepartmentNode) => {
  addVisible.value = true;
  selectNodeMd5.value = data.md5;
  addNodeParent.value = node;
};

const nodeAppendTree = (data: DepartmentNode) => {
  // 在问题代码之前添加 null 检查
  if (!addNodeParent.value) {
    console.error('addNodeParent 为 null');
    return;
  }

  if (!addNodeParent.value.data.children) {
    addNodeParent.value.data.children = []; // 或使用 Vue.set/Vue3 的 reactive 方式
  }
  addNodeParent.value.data.children.push(data);
  treeData.value = [...treeData.value]
};

const nodeEdit = (data: DepartmentNode) => {
  editVisible.value = true;
  selectNodeMd5.value = data.md5;
};

const nodeRemove = (node: Node, data: DepartmentNode) => {
  selectNodeMd5.value = data.md5;
  // 判断是否有子节点
  if (data.children && data.children.length > 0) {
    ElNotification({
      title: '提示',
      message: '当前节点的子节点不为空，请优先删除子节点',
      type: 'error'
    });
    return;
  };
  SysOpsDepartDeleteApi({ md5: data.md5 }).then(() => {
    ElNotification({
      title: '提示',
      message: '删除成功',
      type: 'success'
    });

    //方式一：fetchTreeData();
    //方式二：保持节点状态
    const parent = node.parent
    const children: DepartmentNode[] = parent.data.children || parent.data
    const index = children.findIndex((d) => d.id === data.id)
    children.splice(index, 1)
    treeData.value = [...treeData.value]
  })
};

// 批量删除
const batchDeleteHandle = () => {
  // 无选择数据
  if (treeCheckedKeys.value.length === 0) {
    ElMessage.warning("请选择需要删除的数据");
    return;
  }
  batchDeleteVisible.value = true;
};

</script>
<style scoped>
.box {
  padding: 20px;
}

.box-opr{}

.box-app{
  margin-top: 25px;
}

.box-app-tree {
  background-color: #F6F8F9
}

.box-app-data {
  font-size: 15px;
  line-height: 2;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
