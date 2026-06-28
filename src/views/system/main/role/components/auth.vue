<template>
  <el-drawer :model-value="props.visible"
             :size="dwField.size"
             :modal="dwField.modal"
             :direction="dwField.direction"
             :lock-scroll="dwField.lockScroll"
             :show-close="dwField.showClose"
             :close-on-click-modal="dwField.closeOnClickModal"
             :close-on-press-escape="dwField.closeOnPressEscape"
             :open-delay="dwField.openDelay"
             :with-header="dwField.withHeader"
             :destroy-on-close="dwField.destroyOnClose"
             @open="openDrawer"
             @close="closeDrawer">
    <el-container>
      <!--main-->
      <el-main class="nopadding" v-loading="btnLoading">
        <el-tabs v-model="tabActiveName">
          <el-tab-pane class="pane" :label="tabList.t1.label" :name="tabList.t1.id">
            <div class="tree-box">
              <el-scrollbar>
                <el-tree
                    ref="treeRef"
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
                    :default-checked-keys="treeCheckedKeys"
                >
                  <template #default="{ node, data }">
                    <div class="custom-tree-node">
                      <span>{{ node.label }}</span>
                      <span>{{ data.id }}</span>
                    </div>
                  </template>
                </el-tree>
              </el-scrollbar>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="tabList.t2.label" :name="tabList.t2.id">
            <div class="tab-desc-text">
              <p>1、平台用户需要配置角色权限，并且角色权限拥有菜单功能，用户方可正常登录使用。</p>
              <p>2、建议依据菜单功能进行角色权限配置，用户可配置多个角色。</p>
              <p>3、管理员角色可以看到平台全部数据，请勿乱配置管理角色。</p>
              <p>4、以下流程是配置用户权限流程，请严格按照流程进行操作。</p>
            </div>
            <div class="tab-desc-step">
              <el-steps :active="3" align-center style="width: 100%">
                <el-step title="Step 1" description="新增用户" />
                <el-step title="Step 2" description="新增编辑角色" />
                <el-step title="Step 3" description="角色配置权限" />
                <el-step title="Step 4" description="用户配置角色" />
              </el-steps>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-main>
      <!--footer-->
      <el-footer style="text-align: center;">
        <el-button :disabled="btnDisabled" @click="closeDrawer">取 消</el-button>
        <el-button :disabled="btnDisabled" type="primary" @click="confirm">确 定</el-button>
      </el-footer>
    </el-container>
  </el-drawer>
</template>

<script setup lang='ts'>
import { ref, reactive, defineProps, defineEmits } from 'vue';
import { SysMainRoleAuthApi, SysMainRoleAuthUpdateApi } from '@/api/modules/system';
import { RoleAuthTreeModel } from "@/models/systemModel";
import { drawerField, treeField } from "@/utils/attrs/field";
import { ElNotification, ElTree } from "element-plus";

// Drawer属性
const dwConfigField = reactive({
  title: '权限管理',
  size: '40%'
});
const dwField = {...drawerField, ...dwConfigField};
// Tree属性
const treeConfigField = reactive({
  nodeKey: 'id',
  indent: 22
});
const teField = {...treeField, ...treeConfigField};
// 默认的树节点属性
const defaultTreeProps = {
  label: 'label',
  children: 'children',
  disabled: 'disabled'
};
const btnDisabled = ref(false); // 禁用
const btnLoading = ref(false); // 加载中
const emit = defineEmits(['update:visible']);
const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
    default: false
  },
  md5: {
    type: String,
    required: true,
    default: ''
  }
});

const treeRef = ref<InstanceType<typeof ElTree>>(); // Tree组件
let treeData = ref<RoleAuthTreeModel[]>([]); // Tree数据
let treeCheckedKeys = ref<number[]>([]); // 选中
let treeExpandedKeys = ref<number[]>([]); // 展开

// tab配置
const tabActiveName = ref('t1')
const tabList = ref({
  t1: {id: "t1", label: "菜单列表"},
  t2: {id: "t2", label: "权限说明"}
});


// 打开
function openDrawer() {
  // 请求数据
  fetchApiData(props.md5);
};

// 关闭
function closeDrawer() {
  emit('update:visible', false);
};

// 请求数据API
const fetchApiData = async (md5: string) => {
  const response = await SysMainRoleAuthApi({ md5 });
  if (response.data) {
    const res = response.data as { menu: RoleAuthTreeModel[], checked: number[], expanded: number[] }; // declare
    treeData.value = res.menu;
    treeCheckedKeys.value = res.checked;
    treeExpandedKeys.value = res.expanded;
  }
};

// 提交
const confirm = async () => {
  const checkedKeys = treeRef.value?.getCheckedKeys() ?? []; // 全选
  // const halfCheckedKeys = treeRef.value?.getHalfCheckedKeys(); // 半选
  //const keys = [...new Set([...checkedKeys, ...halfCheckedKeys])];
  if (!checkedKeys.length) {
    ElNotification({
      title: '提示',
      message: '请选择角色菜单权限',
      type: 'warning'
    });
    return;
  }

  btnDisabled.value = true;
  btnLoading.value = true;

  SysMainRoleAuthUpdateApi({md5: props.md5, id: checkedKeys ?? []}).then(() => {
    ElNotification({
      title: '提示',
      message: '权限配置成功',
      type: 'success'
    });
    closeDrawer();
  }).finally(() => {
    btnDisabled.value = false;
    btnLoading.value = false;
  });
};

</script>

<style scoped>
.tree-box {
  height: calc(100vh - 160px);
  border: solid 1px #eee;
  border-radius: 5px;
  box-sizing: border-box;
  padding: 15px;
  overflow-x: hidden;
  background-color: var(--el-bg-color);
  box-shadow: 0 0 12px rgb(0 0 0 / 5%);
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.tab-desc-text {
  font-size: 16px;
  line-height: 2;
}

.tab-desc-step {
  margin-top: 35px;
}
</style>
