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
        <el-divider content-position="left">基本信息</el-divider>
        <el-form-item label="账号" prop="rtxId">
          <el-input v-model.trim="ruleForm.rtxId"
                    :size="inputField.size"
                    :show-word-limit="inputField.showWordLimit"
                    :clearable="inputField.clearable"
                    :prefix-icon="inputField.prefixIcon"
                    :maxlength="ProfileLen.rtxId"
                    :placeholder="ProfilePlace.rtxId"
                    :disabled="btnDisabled"
          />
          <div class="el-form-item-msg">只允许包含字母、数字、连字符(-)和点(.)（不能包含空格、标点等特殊字符），示例：mingliang.gao</div>
        </el-form-item>
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
import { SysMainUserAddEnumApi, SysMainUserAddApi } from "@/api/modules/systemMain";
import { FormInstance, FormRules } from "element-plus";
import {OptionEnumModel, OptionExtendEnumModel} from "@/models/X";
import { ElNotification } from 'element-plus';
import { dialogField, inputField, textAreaField, selectSingleField, selectMultiField, formField } from "@/utils/attrs/field";
import publicLength from "@/utils/attrs/length";
import publicPlaceHolder from "@/utils/attrs/place";

// 数据组件属性值
const ProfileLen = publicLength.setterProfileModel;
const ProfilePlace = publicPlaceHolder.setterProfileModel;

const dgConfigField = reactive({
  title: '新增',
  width: '70%'
});
const dgField = {...dialogField, ...dgConfigField}; // DIALOG属性
const fullView = ref(dgField.fullScreen); // 全屏控制
const fullViewText = ref('全屏');
const emit = defineEmits(['update:visible', 'reFetchTableData']);
const btnDisabled = ref(false); // 禁用
const btnLoading = ref(false); // 加载中
const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
    default: false
  }
});

// 全屏Text侦听器
watch(fullView, (value) => {
  fullViewText.value = value ? '取消全屏' : '全屏';
}, { immediate: true });

// 关闭
function closeDialog() {
  emit('update:visible', false);
  resetForm(); // 对话框关闭时重置表单数据
};

// 全屏
function fullScreen() {
  fullView.value = !fullView.value;
};

// 打开
function openDialog() {
  // 重置验证
  ruleFormRef.value?.clearValidate();
  // 请求数据
  fetchApiData();
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//              ↑Dialog通用配置         ↓定制化方法
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// 响应式数据
const ruleFormRef = ref<FormInstance>();
let ruleForm = reactive({
  rtxId: "",
  name: "",
  sex: "",
  email: "",
  phone: "",
  introduction: "",
  department: "",
  role: [],
}) as UserModelDetail;
// 性别枚举
const sexOption = ref<OptionEnumModel[]>([]);
// 角色枚举
const roleList = ref<OptionEnumModel[]>([]);
// from rule
const rules = reactive<FormRules<UserModelDetail>>({
  rtxId: [
    { required: true, message: "用户RTX-ID账户不允许为空", trigger: 'blur' },
    { min: 1, max: ProfileLen.rtxId, message: '最大长度支持'+ProfileLen.rtxId+'位', trigger: 'blur' },
  ],
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
const fetchApiData = async () => {
  const response = await SysMainUserAddEnumApi();
  if (response.data) {
    const res = response as { data: { sexEnum: OptionEnumModel[], roleList: OptionExtendEnumModel[] } }; // declare
    sexOption.value = res.data.sexEnum as OptionEnumModel[];
    roleList.value = res.data.roleList as OptionEnumModel[];
  }
};

const resetForm = () => {
  ruleForm.rtxId = "";
  ruleForm.name = "";
  ruleForm.sex = "";
  ruleForm.email = "";
  ruleForm.phone = "";
  ruleForm.introduction = "";
  ruleForm.department = "";
  ruleForm.role = [];
};

// 确认
const confirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      btnDisabled.value = true;
      btnLoading.value = true;

      SysMainUserAddApi(ruleForm).then(() => {
        ElNotification({
          title: '提示',
          message: '新增成功',
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
