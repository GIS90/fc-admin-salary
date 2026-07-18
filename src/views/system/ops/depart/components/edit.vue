<template>
  <div v-if="!props.visible" class="depart-edit-desc">
    <h3>📌 操作说明</h3>
    <p>1、架构根节点不允许删除、调整操作。</p>
    <p>2、每个节点拥有新增、编辑、删除、调整等操作功能。</p>
    <p>3、节点信息通过点击编辑按钮，在详情中进行信息编辑。</p>
    <p>4、节点架构通过拖拽的方式进行调整，禁用部门不允许进行调整，如需调整请先解锁。</p>
    <p>5、筛选功能可以根据节点关键字进行筛选过滤。</p>
    <p>6、部门顺序编号，数字越小越靠前，最小值为1，最大值为10000。</p>
  </div>
  <div v-else>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules"
             :label-position="formField.labelPosition" :label-width="formField.labelWidth"
             :size="formField.size" style="width: 100%; padding: 0 15px 0 15px;" >
      <el-form-item label="部门ID">
        <el-input v-model.trim="ruleForm.id" :size="inputField.size" disabled/>
      </el-form-item>
      <el-form-item label="部门路径">
        <el-input v-model.trim="ruleForm.deptPath" :size="inputField.size" disabled/>
      </el-form-item>
      <el-form-item label="部门名称" prop="label">
        <el-input v-model.trim="ruleForm.label"
                  :size="inputField.size"
                  :show-word-limit="inputField.showWordLimit"
                  :clearable="inputField.clearable"
                  :prefix-icon="inputField.prefixIcon"
                  :maxlength="lmodelLen.label"
                  :placeholder="lmodelPlace.label"
                  :disabled="btnDisabled"
        />
      </el-form-item>
      <el-form-item label="部门描述" prop="description">
        <el-input v-model="ruleForm.description"
                  :type="textAreaField.type"
                  :size="textAreaField.size"
                  :show-word-limit="textAreaField.showWordLimit"
                  :clearable="textAreaField.clearable"
                  :autosize="introductionSize"
                  :maxlength="lmodelLen.description"
                  :placeholder="lmodelPlace.description"
                  :disabled="btnDisabled"
        />
      </el-form-item>

      <el-form-item label="上级节点" v-if="ruleForm.id !== 1">
        <el-select v-model="ruleForm.pid" style="width: 100%;" :size="selectSingleField.size" :filterable="selectSingleField.filterable"
                   :clearable="selectSingleField.clearable" :allow-create="selectSingleField.allowCreate"
                   :no-match-text="selectSingleField.noMatchText" :no-data-text="selectSingleField.noDataText"
                   :placeholder="lmodelPlace.pnode" :disabled="btnDisabled">
          <el-option v-for="item in treeData" :key="item.id" :label="item.label" :value="item.id">
            <span :style="{ paddingLeft: (item.level ?? 0) * 25 + 'px' }">{{ item.label }}</span>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="管理员" prop="manageRtx">
        <el-select v-model="ruleForm.manageRtx" style="width: 100%;" :size="selectMultiField.size" :clearable="selectMultiField.clearable"
                   :filterable="selectMultiField.filterable" :allow-create="selectMultiField.allowCreate"
                   :no-match-text="selectMultiField.noMatchText" :no-data-text="selectMultiField.noDataText"
                   :multiple="selectMultiField.multiple" :multiple-limit="selectMultiField.limit" :collapse-tags="selectMultiField.collapseTags"
                   :max-collapse-tags="selectMultiField.maxCollapseTags" :collapse-tags-tooltip="selectMultiField.collapseTagsTooltip"
                   :placeholder="lmodelPlace.manage_rtx" :disabled="btnDisabled">
          <el-option v-for="item in userOption" :key="item.value" :label="item.label" :value="item.value">
            <span class="el-select-key">{{ item.label }}</span>
            <span class="el-select-value">{{ item.value }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="ruleForm.disabled" :disabled="btnDisabled">
          <el-radio :value="false">启用</el-radio>
          <el-radio :value="true">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序编号" prop="orderId">
        <el-input-number v-model="ruleForm.orderId"
                         style="width: 100%;"
                         :min="inputNumberField.min"
                         :max="inputNumberField.max"
                         :step="inputNumberField.step"
                         :step-strictly="inputNumberField.stepStrictly"
                         :precision="inputNumberField.precision"
                         :size="inputNumberField.size"
                         :controls="inputNumberField.controls"
                         :controls-position="inputNumberField.controlsPosition"
                         :disabled="btnDisabled"
        />
      </el-form-item>
      <el-button :disabled="btnDisabled" @click="close">取 消</el-button>
      <el-button :disabled="btnDisabled" :loading="btnLoading" type="primary" @click="confirm(ruleFormRef)">确 定</el-button>
    </el-form>
  </div>
</template>

<script setup lang='ts'>
import { ref, reactive, defineProps, defineEmits, watch } from 'vue';
import { DepartmentNode } from "@/models/systemModel";
import { SysOpsDepartUpdateApi, SysOpsDepartApi } from "@/api/modules/systemOps";
import { FormInstance, FormRules } from "element-plus";
import { ElNotification } from 'element-plus';
import {
  inputField, textAreaField, formField,
  selectMultiField, selectSingleField, inputNumberField,
} from "@/utils/attrs/field";
import publicLength from "@/utils/attrs/length";
import publicPlaceHolder from "@/utils/attrs/place";
import { OptionEnumModelList } from "@/models/X";

// 数据组件属性值
const lmodelLen = publicLength.systemDepartModel;
const lmodelPlace = publicPlaceHolder.systemDepartModel;

const introductionSize = ref({minRows: 3, maxRows: 4});
const emit = defineEmits(['update:visible', 'fetchTreeData']);
const btnDisabled = ref(false); // 禁用
const btnLoading = ref(false); // 加载中
const userOption = ref<OptionEnumModelList>([]);
// 定义树节点类型
interface TreeNode {
  id: number;
  label: string;
  level?: number;
}
const treeData = ref<TreeNode[]>([]);
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

// 请求数据API
const fetchApiData = async (md5: string) => {
  const response = await SysOpsDepartApi({ md5 });
  if (response.data) {
    const res = response.data as { data: DepartmentNode, user: OptionEnumModelList, tree: [DepartmentNode] }; // declare
    Object.assign(ruleForm, res.data); // 节点
    userOption.value = res.user; // 用户枚举
    treeData.value = res.tree; // 树结构
  }
};

// 监听 md5 变化
watch(
    () => props.md5,
    (newVal, oldVal) => {
      if (newVal && newVal !== oldVal) {
        fetchApiData(newVal);
      }
    },
    {
      immediate: true,
      deep: false
    }
)

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//              ↑Dialog通用配置         ↓定制化方法
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// 响应式数据
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({}) as DepartmentNode;
// from rule
const rules = reactive({
  label: [
    { required: true, message: "部门名称不允许为空", trigger: 'blur' },
    { min: 1, max: lmodelLen.label, message: '最大长度支持'+lmodelLen.label+'位', trigger: 'blur' },
  ],
  description: [
    { required: true, message: "部门描述不允许为空", trigger: 'blur' },
    { min: 1, max: lmodelLen.description, message: '最大长度支持'+lmodelLen.description+'位', trigger: 'blur' },
  ],
  orderId: [
    { required: true, message: "排序编号不允许为空", trigger: 'blur' }
  ],
} as FormRules);

const close = () => {
  emit('update:visible', false);
};

// 确认
const confirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  await formEl.validate((valid) => {
    if (valid) {
      btnDisabled.value = true;
      btnLoading.value = true;

      SysOpsDepartUpdateApi(ruleForm).then(() => {
        ElNotification({
          title: '提示',
          message: '编辑成功',
          type: 'success'
        });
        close();
        emit('fetchTreeData', true);
      }).finally(() => {
        btnDisabled.value = false;
        btnLoading.value = false;
      })
    }
  })
};
</script>

<style scoped>
.depart-edit-desc {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px 28px;
  margin-bottom: 20px;
  border: 1px solid #e4e7ed;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  /* ===== 新增：过渡动画 ===== */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ===== 新增：悬停阴影效果 ===== */
.depart-edit-desc:hover {
  box-shadow: 0 12px 48px rgba(64, 158, 255, 0.20);
  transform: translateY(-4px);
}

.depart-edit-desc h3 {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.depart-edit-desc p {
  font-size: 16px;
  color: #606266;
  line-height: 1.8;
  margin: 6px 0;
  padding-left: 28px;
  position: relative;
}

.depart-edit-desc p::before {
  content: "";
  position: absolute;
  left: 8px;
  top: 12px;
  width: 6px;
  height: 6px;
  background: #409eff;
  border-radius: 50%;
  opacity: 0.6;
}
</style>
