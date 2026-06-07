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
      <div class="my-dialog-header delete-dialog-header">
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
        {{ message }}
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
import {
  SysMainUsersStatusApi, SysMainRolesDeleteApi,
  SysOpsDictEnumsDeleteApi, SysOpsLogsDeleteApi,
  SysOpsTasksDeleteApi, SysOpsDepartsDeleteApi
} from "@/api/modules/system";
import { ElNotification, ElMessage } from 'element-plus';

const dgConfigField = reactive({
  title: '提示',
  width: '32%',
  top: '14%'
});
const dgField = {...dialogField, ...dgConfigField}; // DIALOG属性
const emit = defineEmits(['update:visible', 'reFetchTableData']);
const btnDisabled = ref(false); // 禁用
const btnLoading = ref(false); // 加载中
const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
    default: false
  },
  api: {
    type: String,
    required: true,
    default: ''
  },
  md5List: {
    type: Array,
    required: true,
    default: []
  }
});

let message = ref("确认删除选择的数据吗？")
if (props.api === 'SystemMainUser') {
  message = ref("确认注销选择的数据吗？")
}

// 关闭
function closeDialog() {
  emit('update:visible', false);
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//              ↑Dialog通用配置         ↓定制化方法
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// 确认
const confirm = () => {
  if (props.md5List.length === 0) {
    ElMessage.warning("请选择需要删除的数据");
    closeDialog();
    return;
  }

  btnDisabled.value = true;
  btnLoading.value = true;
  if (props.api === 'SystemMainUser') {
    // 系统>权限管理>用户管理
    SysMainUsersStatusApi({ md5: props.md5List as string[] }).then(() => {
      ElNotification.success({
        title: '提示',
        message: '注销成功'
      });
      closeDialog();
      emit('reFetchTableData', true);
    }).finally(() => {
      btnDisabled.value = false;
      btnLoading.value = false;
    });
  } else if (props.api === 'SystemMainRole') {
    // 系统>权限管理>角色管理
    SysMainRolesDeleteApi({ md5: props.md5List as string[] }).then(() => {
      ElNotification.success({
        title: '提示',
        message: '删除成功'
      });
      closeDialog();
      emit('reFetchTableData', true);
    }).finally(() => {
      btnDisabled.value = false;
      btnLoading.value = false;
    });
  } else if (props.api === 'SystemOpsDict') {
    // 系统>系统维护>数据字典
    SysOpsDictEnumsDeleteApi({ md5: props.md5List as string[] }).then(() => {
      ElNotification.success({
        title: '提示',
        message: '删除成功'
      });
      closeDialog();
      emit('reFetchTableData', true);
    }).finally(() => {
      btnDisabled.value = false;
      btnLoading.value = false;
    });
  } else if (props.api === 'SystemOpsLog') {
    // 系统>系统维护>系统日志
    SysOpsLogsDeleteApi({ md5: props.md5List as string[] }).then(() => {
      ElNotification.success({
        title: '提示',
        message: '删除成功'
      });
      closeDialog();
      emit('reFetchTableData', true);
    }).finally(() => {
      btnDisabled.value = false;
      btnLoading.value = false;
    });
  } else if (props.api === 'SystemOpsTask') {
    // 系统>系统维护>任务中心
    SysOpsTasksDeleteApi({ md5: props.md5List as string[] }).then(() => {
      ElNotification.success({
        title: '提示',
        message: '删除成功'
      });
      closeDialog();
      emit('reFetchTableData', true);
    }).finally(() => {
      btnDisabled.value = false;
      btnLoading.value = false;
    });
  } else if (props.api === 'SystemOpsDepart') {
    // 系统>系统维护>部门架构
    SysOpsDepartsDeleteApi({ md5: props.md5List as string[] }).then(() => {
      ElNotification.success({
        title: '提示',
        message: '删除成功'
      });
      closeDialog();
      emit('reFetchTableData', true);
    }).finally(() => {
      btnDisabled.value = false;
      btnLoading.value = false;
    });
  }
};
</script>

<style scoped>
.delete-dialog-header {
  background-color: #FEE2DF !important;
  border-bottom: 2px solid #F56C6C !important;
}
</style>
