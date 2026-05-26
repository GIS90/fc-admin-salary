<template>
  <el-dialog
      :model-value="props.visible"
      :width="dgField.width"
      :fullscreen="dgField.fullScreen"
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
      @close="closeDialog"
  >
    <!--header-->
    <template #header>
      <div class="my-dialog-header">
        <div class="my-dialog-header-title">{{ dgField.title }}</div>
        <div class="my-dialog-header-icon">
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
      <div>
        账号：<span style="font-size: 2rem">{{ rtxId }}</span>
      </div>
      <div>
        初始密码为<span style="color: red;">abc1234</span>，确认重置吗？
      </div>
    </div>

    <!--footer-->
    <template #footer>
      <div class="my-dialog-footer">
        <el-button :disabled="btnDisabled" @click="closeDialog">取 消</el-button>
        <el-button :disabled="btnDisabled" :loading="btnLoading" type="primary" @click="confirm">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang='ts'>
import { ref, reactive, defineProps, defineEmits } from 'vue';
import { dialogField } from "@/utils/attrs/field";
import {SysMainUserApi, SysMainUserResetPwdApi} from "@/api/modules/system";
import { ElNotification } from 'element-plus';
import {UserModelDetail} from "@/models/systemModel";
import {OptionEnumModel, OptionExtendEnumModel} from "@/models/X";

const dgConfigField = reactive({
  title: '重置密码',
  width: '32%',
  top: '14%'
});
const dgField = {...dialogField, ...dgConfigField}; // DIALOG属性
const emit = defineEmits(['update:visible']);
const btnDisabled = ref(false); // 禁用
const btnLoading = ref(false); // 加载中
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
  rtxId: {
    type: String,
    required: true,
    default: ''
  }
});

// 关闭
function closeDialog() {
  emit('update:visible', false);
};

// 全屏
/*
function fullScreen() {
  field.fullScreen = !field.fullScreen;
};
*/

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//              ↑Dialog通用配置         ↓定制化方法
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// 请求数据API
const fetchApiData = async () => {
  // const response = await SysMainUserApi({ md5 });
  // if (response.data) {
  //   const res = response as { data: { user: UserModelDetail, sexEnum: OptionEnumModel[], roleList: OptionExtendEnumModel[] } }; // declare
  //   Object.assign(ruleForm, res.data.user);
  //   sexOption.value = res.data.sexEnum as OptionEnumModel[];
  //   roleList.value = res.data.roleList as OptionExtendEnumModel[];
  // }
};

// 确认
const confirm = () => {
  btnDisabled.value = true;
  btnLoading.value = true;
  SysMainUserResetPwdApi({ md5: props.md5 }).then(() => {
    ElNotification.success({
      title: '提示',
      message: '重置密码成功'
    });
    closeDialog();
  }).finally(() => {
    btnDisabled.value = false;
    btnLoading.value = false;
  })
};
</script>

<style scoped>
</style>
