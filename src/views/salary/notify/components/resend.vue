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

    <div class="my-dialog-body">
      <el-alert v-if="!loading && failureGroups.length === 0" type="info" show-icon :closable="false"
                title="暂无失败人员" description="该文件没有发送失败的人员，无需重发" style="margin-bottom: 18px;" />

      <el-form label-width="90px" v-loading="loading">
        <el-form-item label="机器人" required>
          <el-select v-model="robot" placeholder="请选择机器人" style="width: 100%;">
            <el-option v-for="item in robotEnums" :key="item.key" :label="item.value" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="失败人员">
          <div class="user-toolbar">
            <span class="user-count">共 {{ failureCount }} 人，已选 {{ selectedCount }} 人</span>
          </div>
          <div class="sheet-group-list">
            <div v-for="group in failureGroups" :key="group.sheet" class="sheet-group">
              <div class="sheet-group-header">
                <div class="sheet-group-title">
                  <el-tag type="danger" effect="light" size="small">Sheet {{ group.sheet }}</el-tag>
                  <span class="sheet-group-name">{{ group.sheetName || labelOf(group.sheet) }}</span>
                  <span class="sheet-group-count">{{ group.users.length }} 人</span>
                </div>
                <div class="sheet-group-actions">
                  <el-button link type="primary" size="small" @click="selectGroup(group.sheet, true)">全选</el-button>
                  <el-button link type="info" size="small" @click="selectGroup(group.sheet, false)">清空</el-button>
                </div>
              </div>
              <el-checkbox-group v-model="selectedBySheet[group.sheet]" class="user-group">
                <el-checkbox v-for="uid in group.users" :key="uid" :value="uid" :label="uid" class="user-checkbox">
                  {{ uid }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <div class="my-dialog-footer">
        <el-button :disabled="btnDisabled" @click="closeHandle">取 消</el-button>
        <el-button type="primary" :disabled="btnDisabled || !robot || selectedCount === 0"
                   :loading="btnLoading" @click="resendHandle">重 发</el-button>
      </div>
    </template>

    <!--发送结果-->
    <FcSendResult v-model:visible="resultVisible" :results="resultData" />
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { dialogField } from "@/utils/attrs/field";
import FcSendResult from "@/components/fcSendResult/index.vue";

interface FailureGroup {
  sheet: string;
  sheetName: string;
  users: string[];
}

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
  },
  // 重发初始化接口：返回配置 Sheet、各 Sheet 失败名单及机器人选项
  initApi: {
    type: Function,
    required: true
  },
  // 重发接口
  resendApi: {
    type: Function,
    required: true
  }
});
const emit = defineEmits(["update:visible", "reFetchTableData"]);

const dgConfigField = reactive({
  title: "失败人员重发",
  width: "60%",
  top: "5vh"
});
const dgField = { ...dialogField, ...dgConfigField };

const loading = ref(false);
const btnDisabled = ref(false);
const btnLoading = ref(false);
const robot = ref("");
const robotEnums = ref<{ key: string; value: string }[]>([]);
const sheetNames = ref<Record<string, string>>({});
const failureGroups = ref<FailureGroup[]>([]);
const selectedBySheet = reactive<Record<string, string[]>>({});
const resultVisible = ref(false);
const resultData = ref<any[]>([]);

const failureCount = computed(() =>
  failureGroups.value.reduce((sum, group) => sum + group.users.length, 0)
);
const selectedCount = computed(() =>
  Object.values(selectedBySheet).reduce((sum, list) => sum + list.length, 0)
);

const labelOf = (sheet: string) => sheetNames.value[sheet] || `Sheet ${Number(sheet) + 1 || sheet}`;

const normalizeSheetNames = (raw: any): Record<string, string> => {
  if (!raw) return {};
  if (typeof raw === "string") {
    try { return normalizeSheetNames(JSON.parse(raw)); } catch { return {}; }
  }
  if (Array.isArray(raw)) {
    return raw.reduce((acc: Record<string, string>, item: any) => {
      if (item && item.key !== undefined) acc[String(item.key)] = String(item.value ?? "");
      return acc;
    }, {});
  }
  return Object.keys(raw).reduce((acc: Record<string, string>, key: string) => {
    acc[key] = String((raw as any)[key] ?? "");
    return acc;
  }, {});
};

const buildGroups = (data: any): FailureGroup[] => {
  const names: Record<string, string> = normalizeSheetNames(data?.sheetNames);
  const sheets: string[] = Array.isArray(data?.sheetIndex)
    ? data.sheetIndex.map((i: any) => String(i))
    : [];
  const groups: FailureGroup[] = [];

  if (Array.isArray(data?.failureGroups)) {
    data.failureGroups.forEach((item: any) => {
      const sheet = String(item?.sheet ?? "");
      if (!sheet) return;
      groups.push({
        sheet,
        sheetName: String(item?.sheetName || names[sheet] || labelOf(sheet)),
        users: Array.isArray(item?.users) ? item.users.map((u: any) => String(u)) : []
      });
    });
    return groups;
  }

  const raw = data?.failureUsers;
  const map: Record<string, string[]> = {};
  if (Array.isArray(raw)) {
    map["0"] = raw.map((u: any) => String(u));
  } else if (raw && typeof raw === "object") {
    Object.keys(raw).forEach((key) => {
      map[key] = Array.isArray(raw[key]) ? raw[key].map((u: any) => String(u)) : [];
    });
  }
  const keys = sheets.length ? sheets : Object.keys(map).sort((a, b) => Number(a) - Number(b));
  keys.forEach((sheet) => {
    groups.push({
      sheet,
      sheetName: names[sheet] || labelOf(sheet),
      users: map[sheet] || []
    });
  });
  return groups;
};

const openHandle = () => {
  fetchInit();
};

const closeHandle = () => {
  emit("update:visible", false);
};

const fetchInit = async () => {
  loading.value = true;
  robot.value = "";
  robotEnums.value = [];
  sheetNames.value = {};
  failureGroups.value = [];
  Object.keys(selectedBySheet).forEach((key) => delete selectedBySheet[key]);
  try {
    const response: any = await props.initApi({ md5: props.md5 });
    const data = response?.data || {};
    sheetNames.value = normalizeSheetNames(data.sheetNames);
    robotEnums.value = Array.isArray(data.robotEnums) ? data.robotEnums : [];
    robot.value = data.robotIndex || robotEnums.value[0]?.key || "";
    const groups = buildGroups(data).filter((group) => group.users.length > 0);
    failureGroups.value = groups;
    groups.forEach((group) => {
      selectedBySheet[group.sheet] = [...group.users];
    });
  } finally {
    loading.value = false;
  }
};

const selectGroup = (sheet: string, selected: boolean) => {
  selectedBySheet[sheet] = selected
    ? [...(failureGroups.value.find((group) => group.sheet === sheet)?.users || [])]
    : [];
};

const resendHandle = () => {
  if (!robot.value) {
    ElMessage.warning("请选择机器人");
    return;
  }
  if (selectedCount.value === 0) {
    ElMessage.warning("请选择需要重发的人员");
    return;
  }
  const users = failureGroups.value
    .map((group) => ({
      sheet: group.sheet,
      users: selectedBySheet[group.sheet] || []
    }))
    .filter((item) => item.users.length > 0);
  btnDisabled.value = true;
  btnLoading.value = true;
  props.resendApi({
    md5: props.md5,
    robot: robot.value,
    users
  }).then((response: any) => {
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

.user-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  margin-bottom: 8px;
}

.user-count {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.sheet-group-list {
  width: 100%;
  max-height: 360px;
  overflow-y: auto;
}

.sheet-group {
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  margin-bottom: 10px;
  overflow: hidden;
}

.sheet-group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  background: var(--el-fill-color-light);
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.sheet-group-title {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.sheet-group-name {
  font-weight: 600;
  color: var(--el-text-color-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sheet-group-count {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.sheet-group-actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.user-group {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 12px;
  width: 100%;
  max-height: 220px;
  overflow-y: auto;
  padding: 10px;
}

.user-checkbox {
  margin-right: 0;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
