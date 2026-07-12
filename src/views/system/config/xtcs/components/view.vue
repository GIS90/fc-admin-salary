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
        <el-form-item label="参数名称" prop="key">
          <el-input v-model.trim="ruleForm.key"
                    :size="inputField.size"
                    :placeholder="ProfilePlace.key"
                    disabled
          />
        </el-form-item>
        <el-form-item label="参数说明" prop="remark">
          <el-input v-model.trim="ruleForm.remark"
                    :size="inputField.size"
                    :placeholder="ProfilePlace.remark"
                    disabled
          />
        </el-form-item>
        <el-form-item label="参数值" prop="value">
          <el-input v-model="ruleForm.value"
                    :type="textAreaField.type"
                    :size="textAreaField.size"
                    :placeholder="ProfilePlace.value"
                    :rows="4"
                    disabled
          />
        </el-form-item>
        <el-form-item label="排序编号" prop="orderId">
          <el-input v-model="ruleForm.orderId"
                     style="width: 100%;"
                     :size="inputField.size"
                     disabled
          />
        </el-form-item>
        <el-divider content-position="left">其他信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="创建人" prop="createRtx">
              <el-input v-model.trim="ruleForm.createRtx"
                        :size="inputField.size"
                        disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间" prop="createTime">
              <el-input v-model.trim="ruleForm.createTime"
                        :size="inputField.size"
                        disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="ruleForm.updateRtx">
          <el-col :span="12">
            <el-form-item label="更新人" prop="updateRtx">
              <el-input v-model.trim="ruleForm.updateRtx"
                        :size="inputField.size"
                        disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="更新时间" prop="updateTime">
              <el-input v-model.trim="ruleForm.updateTime"
                        :size="inputField.size"
                        disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </el-dialog>
</template>

<script setup lang='ts'>
import { ref, reactive, defineProps, defineEmits, watch } from 'vue';
import { XtcsModelView } from "@/models/systemModel";
import { SysConfigXtcsViewApi } from "@/api/modules/systemConfig";
import { FormInstance } from "element-plus";
import { dialogField, inputField, textAreaField, formField } from "@/utils/attrs/field";
import publicPlaceHolder from "@/utils/attrs/place";

// 数据组件属性值
const ProfilePlace = publicPlaceHolder.systemXtcsModel;

const dgConfigField = reactive({
  title: '查看',
  width: '55%'
});
const dgField = {...dialogField, ...dgConfigField}; // DIALOG属性
const fullView = ref(dgField.fullScreen); // 全屏控制
const fullViewText = ref('全屏');
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
  // 请求数据
  fetchApiData(props.md5);
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//              ↑Dialog通用配置         ↓定制化方法
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// 响应式数据
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  md5: "",
  key: "",
  remark: "",
  value: "",
  orderId: undefined,
  createRtx: "",
  createTime: "",
  updateRtx: "",
  updateTime: "",
}) as XtcsModelView;

// 请求数据API
const fetchApiData = async (md5: string) => {
  const response = await SysConfigXtcsViewApi({ md5 });
  if (response.data) {
    const res = response as { data: XtcsModelView }; // declare
    Object.assign(ruleForm, res.data);
  }
};

</script>

<style scoped>
</style>
