<template>
  <el-dialog
      :model-value="props.visible"
      :width="dgField.width"
      :fullscreen="fullView"
      :top="dgField.top"
      :modal="dgField.modal"
      :lock-scroll="dgField.lockScroll"
      :open-delay="dgField.openDelay"
      :close-delay="dgField.closeDelay"
      :close-on-click-modal="dgField.closeOnClickModal"
      :close-on-press-escape="dgField.closeOnPressEscape"
      :show-close="dgField.showClose"
      :draggable = "dgField.draggable"
      :overflow = "dgField.overflow"
      :center="dgField.center"
      :align-center="dgField.alignCenter"
      @open="openDialog"
      @close="closeDialog"
  >
    <!--header-->
    <template #header>
      <div class="my-dialog-header">
        <div class="my-dialog-header-title">{{ dgField.title }}</div>
        <div class="my-dialog-header-icon">
          <el-tooltip effect="dark" :content="fullViewText" placement="top">
            <el-icon @click="fullScreen" class="margin-right-15px">
              <FullScreen />
            </el-icon>
          </el-tooltip>
          <el-tooltip effect="dark" content="关闭" placement="top">
            <el-icon @click="closeDialog">
              <Close />
            </el-icon>
          </el-tooltip>
        </div>
      </div>
    </template>

    <!--body-->
    <div class="my-dialog-body">
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules"
               :label-position="formField.labelPosition" :label-width="formField.labelWidth"
               :size="formField.size" style="width: 100%" >
        <el-form-item label="账号" prop="rtx_id">
          <el-input v-model.trim="ruleForm.rtxId" disabled :size="inputField.size"/>
          <div class="el-form-item-msg">账号为系统用户唯一标识，注册后不可修改</div>
        </el-form-item>
        <el-divider content-position="left">基本信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="昵称" prop="name">
              <el-input v-model.trim="ruleForm.name"
                        :size="inputField.size"
                        :show-word-limit="inputField.showWordLimit"
                        :clearable="inputField.clearable"
                        :prefix-icon="inputField.prefixIcon"
                        :maxlength="ProfileLen.userName"
                        :placeholder="ProfilePlace.userName"
                        :disabled="btnDisabled"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="sex">
              <el-select v-model="ruleForm.sex" style="width: 100%;" :size="selectSingleField.size" :clearable="selectSingleField.clearable"
                         :filterable="selectSingleField.filterable" :allow-create="selectSingleField.allowCreate"
                         :no-match-text="selectSingleField.noMatchText" :no-data-text="selectSingleField.noDataText"
                         :placeholder="ProfilePlace.sex" :disabled="btnDisabled">
                <el-option v-for="item in sexOption" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model.trim="ruleForm.email"
                        :size="inputField.size"
                        :show-word-limit="inputField.showWordLimit"
                        :clearable="inputField.clearable"
                        :prefix-icon="inputField.prefixIcon"
                        :maxlength="ProfileLen.email"
                        :placeholder="ProfilePlace.email"
                        :disabled="btnDisabled"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话" prop="phone">
              <el-input v-model.trim="ruleForm.phone"
                        :size="inputField.size"
                        :show-word-limit="inputField.showWordLimit"
                        :clearable="inputField.clearable"
                        :prefix-icon="inputField.prefixIcon"
                        :maxlength="ProfileLen.phone"
                        :placeholder="ProfilePlace.phone"
                        @input="handleStrictNumberInput"
                        :disabled="btnDisabled"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="部门">
              <el-tree-select
                  v-model="ruleForm.department"
                  node-key="md5"
                  :data="props.departmentData"
                  :props="defaultTreeProps"
                  :check-strictly="true"
                  placeholder="请选择用户所属部门"
                  empty-text="无数据，请联系管理员进行部门配置"
                  clearable
                  filterable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="个性签名" prop="introduction">
          <el-input v-model="ruleForm.introduction"
                    :type="textAreaField.type"
                    :size="textAreaField.size"
                    :show-word-limit="textAreaField.showWordLimit"
                    :clearable="textAreaField.clearable"
                    :autosize="textAreaField.autosize"
                    :maxlength="ProfileLen.introduction"
                    :placeholder="ProfilePlace.introduction"
                    :disabled="btnDisabled"
          />
        </el-form-item>
        <el-divider content-position="left">权限信息</el-divider>
        <el-form-item label="菜单权限" prop="role">
          <el-select v-model="ruleForm.role" style="width: 100%;" :size="selectMultiField.size" :clearable="selectMultiField.clearable"
                     :filterable="selectMultiField.filterable" :allow-create="selectMultiField.allowCreate"
                     :no-match-text="selectMultiField.noMatchText" :no-data-text="selectMultiField.noDataText"
                     :multiple="selectMultiField.multiple" :multiple-limit="selectMultiField.limit" :collapse-tags="selectMultiField.collapseTags"
                     :max-collapse-tags="selectMultiField.maxCollapseTags" :collapse-tags-tooltip="selectMultiField.collapseTagsTooltip"
                     :placeholder="ProfilePlace.role" :disabled="btnDisabled">
            <el-option v-for="item in roleList" :key="item.value" :label="item.label" :value="item.value">
              <span class="el-select-key">{{ item.label }}</span>
              <span class="el-select-value">{{ item.value }}</span>
            </el-option>
          </el-select>
          <div class="el-form-item-msg">用户系统菜单权限，只有分配了权限才有可以登录</div>
        </el-form-item>
      </el-form>
    </div>

    <!--footer-->
    <template #footer>
      <div class="my-dialog-footer">
        <el-button :disabled="btnDisabled" @click="closeDialog">取 消</el-button>
        <el-button :disabled="btnDisabled" :loading="btnLoading" type="primary" @click="confirm(ruleFormRef)">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang='ts'>
import { ref, reactive, defineProps, defineEmits, watch } from 'vue';
import { UserModelDetail } from "@/models/systemModel";
import { SysMainUserApi, SysMainUserUpdateApi } from "@/api/modules/systemMain";
import { FormInstance, FormRules } from "element-plus";
import { OptionEnumModel, OptionExtendEnumModel } from "@/models/X";
import { ElNotification } from 'element-plus';
import { dialogField, inputField, textAreaField, selectSingleField, selectMultiField, formField } from "@/utils/attrs/field";
import publicLength from "@/utils/attrs/length";
import publicPlaceHolder from "@/utils/attrs/place";

// 数据组件属性值
const ProfileLen = publicLength.setterProfileModel;
const ProfilePlace = publicPlaceHolder.setterProfileModel;

const dgConfigField = reactive({
  title: '编辑',
  width: '70%'
});
const dgField = {...dialogField, ...dgConfigField}; // DIALOG属性
const fullView = ref(dgField.fullScreen); // 全屏控制
const fullViewText = ref('全屏');
const emit = defineEmits(['update:visible', 'reFetchTableData']);
const btnDisabled = ref(false); // 禁用
const btnLoading = ref(false); // 加载中
// 默认的树节点属性
const defaultTreeProps = {
  label: 'label',
  children: 'children',
  disabled: 'disabled'
};
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
  },
  departmentData: {
    type: Array,
    required: false,
  }
});

// 全屏Text侦听器
watch(fullView, (value) => {
  fullViewText.value = value ? '取消全屏' : '全屏';
}, { immediate: true });

// 关闭
function closeDialog() {
  emit('update:visible', false);
};

// 全屏
function fullScreen() {
  fullView.value = !fullView.value;
};

// 打开
function openDialog() {
  // 重置验证
  ruleFormRef.value?.clearValidate();
  fetchApiData(props.md5); // 枚举数据
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//              ↑Dialog通用配置         ↓定制化方法
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// 响应式数据
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({}) as UserModelDetail;
// 性别枚举
const sexOption = ref<OptionEnumModel[]>([]);
// 角色枚举
const roleList = ref<OptionEnumModel[]>([]);
// from rule
const rules = reactive<FormRules<UserModelDetail>>({
  name: [
    { required: true, message: "昵称不允许为空", trigger: 'blur' },
    { min: 1, max: ProfileLen.userName, message: '最大长度支持'+ProfileLen.userName+'位', trigger: 'blur' },
  ],
  sex: [
    { required: true, message: "性别不允许为空", trigger: 'change' },
  ],
  email: [
    { required: true, message: "邮箱不允许为空", trigger: 'blur' },
    { min: 1, max: ProfileLen.email, message: '最大长度支持'+ProfileLen.email+'位', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: "电话不允许为空", trigger: 'blur' },
    { min: ProfileLen.phone, max: ProfileLen.phone, message: '请填写正确电话号码', trigger: 'blur' },
  ]
});

// 请求数据API
const fetchApiData = async (md5: string) => {
  if (!md5?.trim()) {
    ElNotification({
      title: '提示',
      message: '缺少数据标识md5，无法获取详情',
      type: 'warning'
    });
    closeDialog();
    return;
  }
  const response = await SysMainUserApi({ md5 });
  if (response.data) {
    const res = response as { data: { user: UserModelDetail, sexEnum: OptionEnumModel[], roleList: OptionExtendEnumModel[] } }; // declare
    Object.assign(ruleForm, res.data.user);
    sexOption.value = res.data.sexEnum as OptionEnumModel[];
    roleList.value = res.data.roleList as OptionExtendEnumModel[];
  }
};

// 确认
const confirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      btnDisabled.value = true;
      btnLoading.value = true;

      SysMainUserUpdateApi(ruleForm).then(() => {
        ElNotification({
          title: '提示',
          message: '编辑成功',
          type: 'success'
        });
        closeDialog();
        emit('reFetchTableData', true);
      }).finally(() => {
        btnDisabled.value = false;
        btnLoading.value = false;
      })
    }
  })
};

const handleStrictNumberInput = (value: string) => {
  // 只保留数字字符
  ruleForm.phone = value.replace(/\D/g, '');
};
</script>

<style scoped>
</style>
