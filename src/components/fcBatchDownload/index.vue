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
      @open="openDialog"
      @close="closeDialog"
  >
    <!--header-->
    <template #header>
      <div class="my-dialog-header download-dialog-header">
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
    <div class="my-dialog-body" v-loading="btnLoading">
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules"
               :label-position="formField.labelPosition" :label-width="formField.labelWidth"
               :size="formField.size" style="width: 100%" >
        <el-form-item label="下载类型" prop="type">
          <el-select v-model="ruleForm.type" style="width: 100%;" :size="selectSingleField.size"
                     :clearable="selectSingleField.clearable" :allow-create="selectSingleField.allowCreate"
                     :no-match-text="selectSingleField.noMatchText" :no-data-text="selectSingleField.noDataText"
                     :placeholder="FormPlace.type" :disabled="btnDisabled">
            <el-option v-for="item in typeOption" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled" />
          </el-select>
        </el-form-item>
        <el-form-item label="文件名称" prop="name">
          <el-input v-model.trim="ruleForm.name"
                    :size="inputField.size"
                    :clearable="inputField.clearable"
                    :show-word-limit="inputField.showWordLimit"
                    :prefix-icon="inputField.prefixIcon"
                    :maxlength="FormLen.name"
                    :placeholder="FormPlace.name"
                    :disabled="btnDisabled">
            <template #append>
              <el-select v-model="ruleForm.format" style="width: 120px;" :size="selectSingleField.size"
                         :allow-create="selectSingleField.allowCreate"
                         :no-match-text="selectSingleField.noMatchText" :no-data-text="selectSingleField.noDataText"
                         :placeholder="FormPlace.format" :disabled="btnDisabled">
                <el-option v-for="item in formatOption" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled" />
              </el-select>
            </template>
          </el-input>
          <div class="el-form-item-msg">文件格式默认为Excel的.xlsx格式</div>
        </el-form-item>

      </el-form>
    </div>

    <!--footer-->
    <template #footer>
      <div class="my-dialog-footer">
        <el-button :disabled="btnDisabled" @click="closeDialog">取 消</el-button>
        <el-button :disabled="btnDisabled" type="primary" @click="confirm(ruleFormRef)">确 定</el-button>
      </div>
    </template>

  </el-dialog>
</template>

<script setup lang='ts'>
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ref, reactive, defineProps, defineEmits, watch } from 'vue';
import { ElNotification, ElMessage, FormInstance, FormRules } from 'element-plus';
import { dialogField, inputField, selectSingleField, formField } from "@/utils/attrs/field";
import publicLength from "@/utils/attrs/length";
import publicPlaceHolder from "@/utils/attrs/place";
import { OptionEnumModel, RequestDownloadModel, FormDownloadModel } from "@/models/X";
import { DownloadTableApi, DownloadEnumApi } from "@/api/modules/common";

const FormLen = publicLength.downloadFormModel;
const FormPlace = publicPlaceHolder.downloadFormModel;

const dgConfigField = reactive({
  title: '文件下载',
  width: '45%',
  top: '12%'
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

// 关闭
function closeDialog() {
  emit('update:visible', false);
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
  type: "",
  name: "",
  format: ".xlsx" // 默认值
}) as FormDownloadModel;
// 数据类型枚举
const typeOption = ref<OptionEnumModel[]>([]);
const formatOption = ref<OptionEnumModel[]>([]);
// from rule
const rules = reactive<FormRules<FormDownloadModel>>({
  name: [
    { required: true, message: FormPlace.name, trigger: 'blur' },
    { min: 1, max: FormLen.name, message: '最大长度支持'+FormLen.name+'位', trigger: 'blur' },
  ],
  type: [
    { required: true, message: FormPlace.type, trigger: 'change' },
  ]
});

// 请求数据API
const fetchApiData = async () => {
  const response = await DownloadEnumApi();
  if (response.data) {
    const res = response as { data: { typeList: OptionEnumModel[], formatList: OptionEnumModel[] } }; // declare
    typeOption.value = res.data.typeList as OptionEnumModel[];
    formatOption.value = res.data.formatList as OptionEnumModel[];
  }
};

// 监听visible属性的变化
watch(() => props.visible, (newValue) => {
  if (!newValue) {
    resetForm(); // 对话框关闭时重置表单数据
  }
});

const resetForm = () => {
  ruleForm.type = "";
  ruleForm.name = "";
  ruleForm.format = ".xlsx"; // 默认值
};

// 确认
const confirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  if (ruleForm.type === "SELECT" && props.md5List.length === 0) {
    ElMessage.warning("暂无选择数据，请关闭窗口选择需要下载的数据");
    return;
  }

  await formEl.validate((valid) => {
    if (valid) {
      btnDisabled.value = true;
      btnLoading.value = true;
      // 参数
      const params = {
        api: props.api,
        name: ruleForm.name + ruleForm.format,
        type: ruleForm.type,
        md5: props.md5List as string[]
      } as RequestDownloadModel;

      // 下载
      DownloadTableApi(params).then((response) => {
        const res = response as { code: number, data: { list: [], name: string } }; // declare
        const { code, data } = res;
        if (code === 100) {
          const wb = XLSX.utils.book_new();  // 创建一个新的工作簿
          const ws = XLSX.utils.json_to_sheet(data.list);  // 创建一个新的工作表
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');  // 将工作表添加到工作簿
          const wbout = XLSX.write(wb, {bookType: 'xlsx', type: 'array'}); // 生成Excel文件
          const blob = new Blob([wbout], {type: 'application/octet-stream'});  // 创建一个Blob对象
          saveAs(blob, data.name); // 使用file-saver保存文件

          ElNotification.success({
            title: '提示',
            message: '下载成功'
          });
          closeDialog();
        };

      }).finally(() => {
        btnDisabled.value = false;
        btnLoading.value = false;
      });
    }
  })
};
</script>

<style scoped>
.download-dialog-header {
  background-color: #FFF9D2 !important;
  border-bottom: 2px solid #FF6A1C !important;
}
</style>
