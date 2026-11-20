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
      :draggable="dgField.draggable"
      :overflow="dgField.overflow"
      :center="dgField.center"
      :align-center="dgField.alignCenter"
      :destroy-on-close="true"
      @open="openHandle"
      @close="closeHandle"
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
            <el-icon @click="closeHandle">
              <Close />
            </el-icon>
          </el-tooltip>
        </div>
      </div>
    </template>

    <!--body-->
    <div class="my-dialog-body">
      <el-form :model="form" label-width="96px" :label-position="formField.labelPosition" :size="formField.size" v-loading="loading">
        <el-divider content-position="left">基础信息</el-divider>
        <el-form-item label="文件名称" required>
          <el-input v-model.trim="form.name" :maxlength="DtalkLen.name" :placeholder="DtalkPlace.name" :disabled="btnDisabled || sheetSaving"
                    :size="inputField.size" :show-word-limit="inputField.showWordLimit" :clearable="inputField.clearable" />
        </el-form-item>
        <el-form-item label="消息Sheet" required>
          <el-select v-model="form.setSheet" :multiple="selectMultiField.multiple" :collapse-tags="selectMultiField.collapseTags" 
                     :collapse-tags-tooltip="selectMultiField.collapseTagsTooltip" :disabled="btnDisabled || sheetSaving"
                     :max-collapse-tags="selectMultiField.maxCollapseTags" :limit="selectMultiField.limit"
                     :size="selectMultiField.size" :clearable="selectMultiField.clearable"
                     :placeholder="DtalkPlace.setSheet" style="width: 100%;">
            <el-option v-for="item in sheetNames" :key="item.key" :label="`表${item.key}：${item.value}`" :value="item.key" />
          </el-select>
          <div class="el-form-item-msg">需要勾选后才能发送消息，并配置对应的消息标题与消息列头</div>
        </el-form-item>

        <el-divider content-position="left">消息内容</el-divider>
        <el-form-item label="设置Sheet" required>
          <div class="sheet-row">
            <el-select v-model="form.sheet" placeholder="请选择需要设置的Sheet" style="flex: 1;"
                       :size="selectSingleField.size" :clearable="selectSingleField.clearable"
                       :filterable="selectSingleField.filterable" :no-match-text="selectSingleField.noMatchText"
                       :no-data-text="selectSingleField.noDataText" :disabled="btnDisabled || sheetSaving" @change="changeSheetHandle">
              <el-option v-for="item in sheetNames" :key="item.key" :label="`表${item.key}：${item.value}`" :value="item.key" />
            </el-select>
            <el-button type="primary" plain :disabled="btnDisabled || sheetSaving" :loading="sheetSaving" @click="saveSheetHandle">保存</el-button>
          </div>
          <div class="el-form-item-msg">切换Sheet以设置对应的消息标题与消息列头，修改后请先保存再切换</div>
        </el-form-item>
        <el-form-item label="消息标题">
          <el-input v-model.trim="form.title" :maxlength="DtalkLen.title" :placeholder="DtalkPlace.title" :disabled="btnDisabled || sheetSaving"
                    :size="inputField.size" :show-word-limit="inputField.showWordLimit" :clearable="inputField.clearable" />
        </el-form-item>
        <el-form-item label="消息列头" required>
          <el-select v-model="form.column" :multiple="selectMultiField.multiple" :collapse-tags="selectMultiField.collapseTags" 
                     :collapse-tags-tooltip="selectMultiField.collapseTagsTooltip" :disabled="btnDisabled || sheetSaving"
                     :max-collapse-tags="maxCollapseTags" :limit="selectMultiField.limit"
                     :size="selectMultiField.size" :clearable="selectMultiField.clearable"
                     :placeholder="DtalkPlace.column" style="width: 100%;">
            <el-option v-for="item in setColumns" :key="item.key" :label="`${item.key}：${item.value}`" :value="item.key" />
          </el-select>
          <div class="el-form-item-msg">第一列固定为钉钉User-ID（<span style="color: red;">必选</span>），不会展示在消息内容中</div>
        </el-form-item>
      </el-form>
    </div>

    <!--footer-->
    <template #footer>
      <div class="my-dialog-footer">
        <el-button :disabled="btnDisabled || sheetSaving" @click="closeHandle">取 消</el-button>
        <el-button type="primary" :disabled="btnDisabled || sheetSaving" :loading="btnLoading" @click="saveHandle">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { ElMessage, ElNotification } from "element-plus";
import { dialogField, formField, inputField, selectSingleField, selectMultiField } from "@/utils/attrs/field";
import publicLength from "@/utils/attrs/length";
import publicPlaceHolder from "@/utils/attrs/place";
import { SalaryNotifyDtalkApi, SalaryNotifyDtalkUpdateApi, SalaryNotifyDtalkChangeSheetApi } from "@/api/modules/salaryNotify";
import { DtalkSheetName } from "@/models/salaryModel";

const maxCollapseTags = ref(12);
const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
    default: false
  },
  md5: {
    type: String,
    required: true,
    default: ""
  }
});
const emit = defineEmits(["update:visible", "reFetchTableData"]);

// Dialog属性
const dgConfigField = reactive({
  title: "消息设置",
  width: "55%",
  top: "5vh"
});
const dgField = { ...dialogField, ...dgConfigField };
const fullView = ref(dgField.fullScreen); // 全屏控制
const fullViewText = ref("全屏");

// 全屏Text侦听器
watch(fullView, (value) => {
  fullViewText.value = value ? "取消全屏" : "全屏";
}, { immediate: true });

// 全屏
const fullScreen = () => {
  fullView.value = !fullView.value;
};

// 字段长度、占位提示
const DtalkLen = publicLength.salaryDtalkModel;
const DtalkPlace = publicPlaceHolder.salaryDtalkModel;

const loading = ref(false);
const btnDisabled = ref(false);
const btnLoading = ref(false);
const sheetSaving = ref(false);
const sheetNames = ref<DtalkSheetName[]>([]);
const setColumns = ref<DtalkSheetName[]>([]);
const form = reactive({
  name: "",
  setSheet: [] as string[],
  sheet: "0",
  title: "",
  column: [] as string[]
});

// 打开
const openHandle = () => {
  form.name = "";
  form.setSheet = [];
  form.sheet = "0";
  form.title = "";
  form.column = [];
  sheetNames.value = [];
  setColumns.value = [];
  fetchDetail();
};

// 关闭
const closeHandle = () => {
  emit("update:visible", false);
};

// 详情
const fetchDetail = async () => {
  if (!props.md5) return;
  loading.value = true;
  let response: any = null;
  try {
    response = await SalaryNotifyDtalkApi({ md5: props.md5 });
  } finally {
    loading.value = false;
  }
  const data = response?.data;
  if (!data) return;
  sheetNames.value = data.sheetNames || [];
  form.name = data.fileName || "";
  form.setSheet = data.setSheetIndex || [];
  form.sheet = data.curSheet || "0";
  form.title = data.setTitle || "";
  form.column = (data.setSelectColumn || []).map((item: string) => String(item));
  setColumns.value = data.setColumns || [];
};

// 切换Sheet
const changeSheetHandle = async (sheet: string) => {
  const response: any = await SalaryNotifyDtalkChangeSheetApi({ md5: props.md5, sheet });
  const data = response?.data;
  if (!data) return;
  form.title = data.setTitle || "";
  form.column = (data.setSelectColumn || []).map((item: string) => String(item));
  setColumns.value = data.setColumns || [];
};

// 表单校验
const validateForm = (): boolean => {
  if (!form.name) {
    ElMessage.warning("请输入文件名称");
    return false;
  }
  if (!/\.(xls|xlsx)$/i.test(form.name)) {
    ElMessage.warning("文件格式只支持.xls、.xlsx");
    return false;
  }
  if (form.setSheet.length === 0) {
    ElMessage.warning("请选择消息Sheet");
    return false;
  }
  if (form.column.length < 2) {
    ElMessage.warning("消息列头至少选择2列");
    return false;
  }
  return true;
};

// 保存
const saveHandle = () => {
  if (!validateForm()) return;
  btnDisabled.value = true;
  btnLoading.value = true;
  SalaryNotifyDtalkUpdateApi({
    md5: props.md5,
    name: form.name,
    setSheet: form.setSheet,
    sheet: form.sheet,
    title: form.title,
    column: form.column
  }).then(() => {
    ElNotification.success({ title: "提示", message: "设置保存成功" });
    emit("reFetchTableData", true);
    closeHandle();
  }).finally(() => {
    btnDisabled.value = false;
    btnLoading.value = false;
  });
};

// 保存当前Sheet（不关闭弹窗，便于继续切换其他Sheet设置）
const saveSheetHandle = () => {
  if (!validateForm()) return;
  sheetSaving.value = true;
  SalaryNotifyDtalkUpdateApi({
    md5: props.md5,
    name: form.name,
    setSheet: form.setSheet,
    sheet: form.sheet,
    title: form.title,
    column: form.column
  }).then(() => {
    const sheetName = sheetNames.value.find((item) => item.key === form.sheet)?.value || "";
    ElNotification.success({ title: "提示", message: `【${sheetName}】设置已保存` });
    emit("reFetchTableData", true);
  }).finally(() => {
    sheetSaving.value = false;
  });
};
</script>

<style scoped lang="scss">
.my-dialog-body {
  max-height: 66vh;
  overflow-y: auto;
}

.sheet-row {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}

:deep(.el-divider) {
  margin: 5px 0 20px 0;

  .el-divider__text {
    font-size: 14px;
    font-weight: 600;
  }
}
</style>
