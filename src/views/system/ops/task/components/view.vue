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
      <el-form ref="ruleFormRef" :model="ruleForm" :size="formField.size" style="width: 100%"
               :label-position="formField.labelPosition" :label-width="formField.labelWidth">
        <el-divider content-position="left">基本信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="创建时间" prop="createTime">
              <el-input v-model.trim="ruleForm.createTime" :size="inputField.size" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="系统用户" prop="rtxId">
              <el-input v-model.trim="ruleForm.rtxId" :size="inputField.size" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="left">任务信息</el-divider>
        <el-form-item label="MD5" prop="md5">
          <el-input v-model.trim="ruleForm.md5" :size="inputField.size" disabled>
            <template #append>
              <el-button v-copy="ruleForm.md5" type="primary"><span style="color: red;">一键复制</span></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="接口名称" prop="api">
              <el-input v-model.trim="ruleForm.api" :size="inputField.size" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="花销时间" prop="cost">
              <el-input v-model.trim="ruleForm.cost" :size="inputField.size" disabled>
                <template #append>（单位：s）</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="下载类型" prop="data">
              <el-input v-model.trim="ruleForm.data" :size="inputField.size" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务状态" prop="task">
              <el-input v-model.trim="ruleForm.task" :size="inputField.size" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!--footer-->
    <template #footer>
      <div class="my-dialog-footer">
        <el-button @click="closeDialog">关 闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang='ts'>
import { ref, reactive, defineProps, watch, defineEmits } from 'vue';
import { TaskModelDetail } from "@/models/systemModel";
import { SysOpsTaskApi } from "@/api/modules/systemOps";
import { dialogField, inputField, formField } from "@/utils/attrs/field";


const dgConfigField = reactive({
  title: '查看',
  width: '65%'
});
const dgField = {...dialogField, ...dgConfigField}; // DIALOG属性
const fullView = ref(dgField.fullScreen); // 全屏控制
const fullViewText = ref('全屏');
const emit = defineEmits(['update:visible']);
const ruleForm = reactive<TaskModelDetail>({
  rtxId: "",
  createTime: "",
  data: "",
  md5: "",
  name: "",
  api: "",
  cost: 0,
  task: "",
});
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
  // 请求数据
  fetchApiData(props.md5);
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//              ↑Dialog通用配置         ↓定制化方法
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// 请求数据API
const fetchApiData = async (md5: string) => {
  const response = await SysOpsTaskApi({ md5 });
  if (response.data) {
    const res = response as { data: TaskModelDetail }; // declare
    Object.assign(ruleForm, res.data);
  }
};
</script>

<style scoped>
</style>
