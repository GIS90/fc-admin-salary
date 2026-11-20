<template>
  <el-dialog
      :model-value="props.visible"
      :width="dgField.width"
      :top="dgField.top"
      :modal="dgField.modal"
      :lock-scroll="dgField.lockScroll"
      :close-on-click-modal="dgField.closeOnClickModal"
      :close-on-press-escape="dgField.closeOnPressEscape"
      :show-close="dgField.showClose"
      :destroy-on-close="true"
      @open="openHandle"
      @close="closeHandle"
  >
    <!--header-->
    <template #header>
      <div class="my-dialog-header">
        <div class="my-dialog-header-title">{{ dgField.title }}</div>
        <div class="my-dialog-header-icon">
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
      <el-alert v-if="!loading && robotEnums.length === 0" type="warning" show-icon :closable="false"
                title="暂无机器人配置" description="请先在「Robot配置」中新增机器人并设为默认后再发送消息"
                style="margin-bottom: 20px;" />
      <el-form :model="form" label-width="96px" v-loading="loading">
        <el-form-item label="机器人" required>
          <el-select v-model="form.robot" placeholder="请选择机器人" style="width: 100%;" :disabled="btnDisabled">
            <el-option v-for="item in robotEnums" :key="item.key" :label="item.value" :value="item.key" />
          </el-select>
          <div class="el-form-item-msg">默认选中「Robot配置」中设置为默认的机器人</div>
        </el-form-item>
        <el-form-item label="发送Sheet" required>
          <el-select v-model="form.sheet" :multiple="selectMultiField.multiple" :collapse-tags="selectMultiField.collapseTags"
                     :collapse-tags-tooltip="selectMultiField.collapseTagsTooltip" :disabled="btnDisabled"
                     :max-collapse-tags="selectMultiField.maxCollapseTags" :limit="selectMultiField.limit"
                     :size="selectMultiField.size" :clearable="selectMultiField.clearable"
                     :placeholder="DtalkPlace.setSheet" style="width: 100%;">
            <el-option v-for="item in sheetNames" :key="item.key" :label="`表${item.key}：${item.value}`" :value="item.key" />
          </el-select>
          <div class="el-form-item-msg">按行向钉钉用户推送，第一列为User-ID</div>
        </el-form-item>
      </el-form>
    </div>

    <!--footer-->
    <template #footer>
      <div class="my-dialog-footer">
        <el-button :disabled="btnDisabled" @click="closeHandle">取 消</el-button>
        <el-button type="primary" icon="Promotion" :disabled="btnDisabled || robotEnums.length === 0"
                   :loading="btnLoading" @click="sendHandle">发 送</el-button>
      </div>
    </template>
  </el-dialog>

  <!--发送结果-->
  <SendResult v-model:visible="resultVisible" :results="resultData" />
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import { dialogField, selectMultiField } from "@/utils/attrs/field";
import { SalaryNotifyDtalkSendInitApi, SalaryNotifyDtalkSendApi } from "@/api/modules/salaryNotify";
import { DtalkSheetName } from "@/models/salaryModel";
import publicPlaceHolder from "@/utils/attrs/place";
import SendResult from "@/views/salary/notify/components/sendResult.vue";

const DtalkPlace = publicPlaceHolder.salaryDtalkModel;
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
  title: "消息发送",
  width: "55%",
  top: "5%"
});
const dgField = { ...dialogField, ...dgConfigField };

const loading = ref(false);
const btnDisabled = ref(false);
const btnLoading = ref(false);
const sheetNames = ref<DtalkSheetName[]>([]);
const robotEnums = ref<{ key: string; value: string }[]>([]);
const form = reactive({
  robot: "",
  sheet: [] as string[]
});

// 发送结果（展示由 SendResult 组件负责）
const resultVisible = ref(false);
const resultData = ref<any[]>([]);

// 打开
const openHandle = () => {
  form.robot = "";
  form.sheet = [];
  sheetNames.value = [];
  robotEnums.value = [];
  fetchInit();
};

// 关闭
const closeHandle = () => {
  emit("update:visible", false);
};

// 初始化数据
const fetchInit = async () => {
  if (!props.md5) return;
  loading.value = true;
  let response: any = null;
  try {
    response = await SalaryNotifyDtalkSendInitApi({ md5: props.md5 });
  } finally {
    loading.value = false;
  }
  const data = response?.data;
  if (!data) return;
  sheetNames.value = data.sheetNames || [];
  robotEnums.value = data.robotEnums || [];
  form.robot = data.robotIndex || (robotEnums.value.length > 0 ? robotEnums.value[0].key : "");
  form.sheet = data.sheetIndex || [];
};

// 发送
const sendHandle = () => {
  if (!form.robot) {
    ElMessage.warning("请选择机器人");
    return;
  }
  if (form.sheet.length === 0) {
    ElMessage.warning("请选择发送的Sheet");
    return;
  }
  btnDisabled.value = true;
  btnLoading.value = true;
  SalaryNotifyDtalkSendApi({ md5: props.md5, robot: form.robot, sheet: form.sheet }).then((response: any) => {
    resultData.value = response?.data || [];
    resultVisible.value = true;
    emit("reFetchTableData", true);
    closeHandle();
  }).finally(() => {
    btnDisabled.value = false;
    btnLoading.value = false;
  });
};
</script>

<style scoped lang="scss">
.my-dialog-body {
  max-height: 66vh;
  overflow-y: auto;
}

// 覆盖全局 .my-dialog-footer 的顶部分隔线，仅本页生效
.my-dialog-footer {
  border-top: none;
}
</style>
