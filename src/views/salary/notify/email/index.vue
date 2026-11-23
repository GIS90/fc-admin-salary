<template>
  <el-container>
    <!--操作区-->
    <el-header>
      <div class="left-panel">
        <el-button id="btn-upload" class="table-handle-button" :type="buttonField.type" :plain="buttonField.plain" :size="buttonField.size" icon="Upload" @click="uploadVisible = true">
          上传文件
        </el-button>
        <el-button id="btn-batch-delete" class="table-handle-button" type="danger" :plain="buttonField.plain" :size="buttonField.size" icon="Delete" :disabled="!fcTableRef?.isSelected" @click="batchDeleteHandle">
          批量删除
        </el-button>
        <el-button id="btn-robot" class="table-handle-button" :type="buttonField.type" :plain="buttonField.plain" :size="buttonField.size" icon="Setting" @click="robotVisible = true">
          邮件服务
        </el-button>
        <el-button id="btn-template" class="table-handle-button" :type="buttonField.type" :plain="buttonField.plain" :size="buttonField.size" icon="Download" @click="templateHandle">
          模板下载
        </el-button>
        <el-button id="btn-tip" class="table-handle-button" type="info" :plain="buttonField.plain" :size="buttonField.size" icon="Reading" @click="tipVisible = true">
          操作说明
        </el-button>
      </div>
    </el-header>

    <!--数据区-->
    <el-main class="nopadding">
      <fc-filter-table ref="fcTableRef" :tableName="apiName" :requestApi="fetchTableData" :initParam="requestParam" :columns="columns"
                       :rowKey="ftField.rowKey" :stripe="ftField.stripe" :border="ftField.border" :pagination="ftField.pagination"
                       :showBottomView="ftField.showBottomView" :showRefreshBtn="ftField.showRefreshBtn"
                       :showColumnBtn="ftField.showColumnBtn" :showDownloadBtn="ftField.showDownloadBtn">
        <!-- Sheet 数量（纯数字展示） -->
        <template #nsheet="scope">
          <span>{{ scope.row.nsheet ?? sheetList(scope.row).length }}</span>
        </template>

        <!-- Sheet 名称（悬浮查看全部 Sheet） -->
        <template #sheetNames="scope">
          <el-popover v-if="sheetList(scope.row).length > 0" placement="top" :width="340" trigger="hover" popper-class="email-sheet-popper">
            <template #reference>
              <el-tag type="danger" effect="light" class="sheet-count-tag">{{ sheetList(scope.row).length }} 个</el-tag>
            </template>
            <div class="sheet-panel">
              <div class="sheet-panel-header">
                <span class="sheet-panel-title">Sheet 列表</span>
                <span class="sheet-panel-count">{{ sheetList(scope.row).length }} 个</span>
              </div>
              <div class="sheet-panel-list">
                <div
                  v-for="(item, index) in sheetList(scope.row)"
                  :key="item.key + index"
                  class="sheet-panel-item"
                >
                  <span class="sheet-panel-index">{{ index + 1 }}</span>
                  <span class="sheet-panel-name">{{ item.value || "（未命名）" }}</span>
                  <span class="sheet-panel-key">索引 {{ item.key }}</span>
                </div>
              </div>
            </div>
          </el-popover>
          <span v-else>-</span>
        </template>

        <!-- 操作Sheet（点击详情） -->
        <template #setSheetName="scope">
          <span
            v-if="scope.row.setSheetName"
            class="detail-link"
            @click="openDetail(scope.row)"
          >
            {{ scope.row.setSheetName }}
          </span>
          <span v-else class="empty-text">-</span>
        </template>

        <!-- 消息标题（悬浮查看每个 Sheet 的消息标题） -->
        <template #setTitle="scope">
          <el-popover v-if="titleList(scope.row).length > 0" placement="top" :width="400" trigger="hover" popper-class="email-sheet-popper">
            <template #reference>
              <el-tag type="warning" effect="light" class="sheet-count-tag">{{ titleList(scope.row).length }} 条</el-tag>
            </template>
            <div class="sheet-panel title-sheet-panel">
              <div class="sheet-panel-header">
                <span class="sheet-panel-title">消息标题</span>
                <span class="sheet-panel-count">{{ titleList(scope.row).length }} 条</span>
              </div>
              <div class="sheet-panel-list">
                <div
                  v-for="(item, index) in titleList(scope.row)"
                  :key="index"
                  class="title-panel-item"
                >
                  <span class="title-panel-sheet">{{ item.sheet }}</span>
                  <span class="title-panel-key">【{{ item.key }}】</span>
                  <span class="title-panel-sep">：</span>
                  <span class="title-panel-text">{{ item.title || "（未设置）" }}</span>
                </div>
              </div>
            </div>
          </el-popover>
          <span v-else class="empty-text">-</span>
        </template>
        
        <!-- 成功名单 -->
        <template #success="scope">
          <el-link v-if="userCount(scope.row.success)" type="success" :underline="false" class="list-link"
                   @click="openUserList('success', scope.row)">
            <el-icon><User /></el-icon>{{ userCount(scope.row.success) }} 人
          </el-link>
          <span v-else class="empty-text">-</span>
        </template>
        <!-- 失败名单 -->
        <template #failure="scope">
          <el-link v-if="userCount(scope.row.failure)" type="danger" :underline="false" class="list-link"
                   @click="openUserList('failure', scope.row)">
            <el-icon><User /></el-icon>{{ userCount(scope.row.failure) }} 人
          </el-link>
          <span v-else class="empty-text">-</span>
        </template>
        <!-- 表格操作 -->
        <template #options="scope">
          <el-tooltip effect="dark" content="设置" placement="top">
            <el-icon class="table-handle-icon" @click="setHandle(scope.row)">
              <Setting />
            </el-icon>
          </el-tooltip>
          <el-tooltip effect="dark" content="发送" placement="top">
            <el-icon class="table-handle-icon margin-left-30px" @click="sendHandle(scope.row)">
              <Promotion />
            </el-icon>
          </el-tooltip>
          <el-tooltip v-if="userCount(scope.row.failure)" effect="dark" content="重发失败人员" placement="top">
            <el-icon class="table-handle-icon margin-left-30px" @click="resendHandle(scope.row)">
              <RefreshRight />
            </el-icon>
          </el-tooltip>
          <el-tooltip effect="dark" content="下载" placement="top">
            <a v-if="scope.row.url" :href="scope.row.url" target="_blank" class="table-handle-link">
              <el-icon class="table-handle-icon margin-left-30px">
                <Download />
              </el-icon>
            </a>
          </el-tooltip>
          <el-tooltip effect="dark" content="删除" placement="top">
            <el-icon class="table-handle-icon margin-left-30px" @click="deleteHandle(scope.row)">
              <Delete />
            </el-icon>
          </el-tooltip>
        </template>
      </fc-filter-table>
    </el-main>

    <!--文件上传-->
    <fc-upload-file v-model:visible="uploadVisible" uploadDialogTitle="文件上传" uploadType="8" @reFetchTableData="reFetchTableData" />

    <!--设置-->
    <EmailSet v-model:visible="setVisible" :md5="rowMd5" @reFetchTableData="reFetchTableData" />

    <!--邮件服务配置-->
    <FcRobotConfig v-model:visible="robotVisible" :api-set="emailRobotApiSet" />

    <!--发送-->
    <EmailSend v-model:visible="sendVisible" :md5="sendMd5" @reFetchTableData="reFetchTableData" />

    <!--重发-->
    <NotifyResend v-model:visible="resendVisible" :md5="resendMd5"
                  :init-api="SalaryNotifyEmailResendInitApi" :resend-api="SalaryNotifyEmailResendApi"
                  @reFetchTableData="reFetchTableData" />

    <!--人员名单-->
    <UserListDrawer v-model:visible="userListVisible" :type="userListType" :users="userListUsers"
                    :sheet-names="userListSheetNames" :file-name="userListFileName" />

    <!--操作说明-->
    <EmailTip v-model:visible="tipVisible" />

    <!--详情 Drawer -->
    <el-drawer
      v-model="detailVisible"
      size="520px"
      with-header
      :title="detailRow?.fileName || '消息配置详情'"
      direction="rtl"
    >
      <template v-if="detailRow">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="文件名称">
            {{ detailRow.fileName }}
          </el-descriptions-item>
          <el-descriptions-item label="Sheet总数">
            <el-tag type="danger" effect="light">{{ detailRow.nsheet }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="操作Sheet">
            <div v-if="sheetList(detailRow).length" class="detail-tags">
              <el-tag
                v-for="(item, index) in sheetList(detailRow)"
                :key="item.key + index"
                :type="isSheetSelected(detailRow, item.key) ? 'primary' : 'info'"
                effect="light"
                class="mr-6px"
              >
                {{ item.value || "（未命名）" }}
              </el-tag>
            </div>
            <span v-else class="empty-text">-</span>
          </el-descriptions-item>
          <el-descriptions-item label="消息标题">
            <div class="detail-title-list">
              <template v-if="detailTitleList.length">
                <div
                  v-for="(t, index) in detailTitleList"
                  :key="index"
                  class="detail-title-item"
                >
                  <span class="detail-title-sheet">{{ t.sheet }}</span>
                  <span class="detail-title-sep">：</span>
                  <span class="detail-title-value">{{ t.title || "（未设置）" }}</span>
                </div>
              </template>
              <span v-else class="empty-text">-</span>
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="操作次数">
            {{ detailRow.count }} 次
          </el-descriptions-item>
          <el-descriptions-item label="发送条数">
            {{ detailRow.number }} 条
          </el-descriptions-item>
          <el-descriptions-item label="上传人 / 时间">
            {{ detailRow.createRtx }} / {{ detailRow.createTime }}
          </el-descriptions-item>
        </el-descriptions>
      </template>
    </el-drawer>
  </el-container>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
import {
  SalaryNotifyEmailListApi,
  SalaryNotifyEmailDeleteApi,
  SalaryNotifyEmailBatchDeleteApi,
  SalaryNotifyEmailRobotListApi,
  SalaryNotifyEmailRobotApi,
  SalaryNotifyEmailRobotAddApi,
  SalaryNotifyEmailRobotUpdateApi,
  SalaryNotifyEmailRobotDeleteApi,
  SalaryNotifyEmailRobotBatchDeleteApi,
  SalaryNotifyEmailRobotSelectApi,
  SalaryNotifyEmailRobotPingApi,
  SalaryNotifyEmailResendInitApi,
  SalaryNotifyEmailResendApi
} from "@/api/modules/salaryNotify";
import { SysConfigXtcsKeyApi, TableFieldColumnApi } from "@/api/modules/common";
import { ColumnProps, FcFilterTableInstance } from "@/components/fcFilterTable/model";
import { EmailListModel } from "@/models/salaryModel";
import { fcTableField, buttonField } from "@/utils/attrs/field";
import publicLength from "@/utils/attrs/length";
import publicPlaceHolder from "@/utils/attrs/place";
import FcUploadFile from "@/components/fcUploadFile/index.vue";
import FcRobotConfig from "@/components/fcRobotConfig/index.vue";
import type { RobotApiSet } from "@/components/fcRobotConfig/model";
import EmailSet from "./components/set.vue";
import EmailSend from "./components/send.vue";
import NotifyResend from "../components/resend.vue";
import UserListDrawer from "../components/userListDrawer.vue";
import EmailTip from "./components/tip.vue";

// 邮件服务配置接口集合
const emailRobotApiSet: RobotApiSet = {
  list: SalaryNotifyEmailRobotListApi,
  detail: SalaryNotifyEmailRobotApi,
  add: SalaryNotifyEmailRobotAddApi,
  update: SalaryNotifyEmailRobotUpdateApi,
  remove: SalaryNotifyEmailRobotDeleteApi,
  batchRemove: SalaryNotifyEmailRobotBatchDeleteApi,
  select: SalaryNotifyEmailRobotSelectApi,
  ping: SalaryNotifyEmailRobotPingApi,
  entityName: "邮件服务",
  schema: {
    keyLabel: "SMTP服务器",
    secretLabel: "密码/授权码",
    agentLabel: "发件邮箱",
    agentRequired: true,
    length: publicLength.salaryEmailRobotModel,
    placeholder: publicPlaceHolder.salaryEmailRobotModel
  },
  docKey: "SALARY-EMAIL-SERVICE",
  docLabel: "配置说明"
};

// fc-table属性
const fcTableConfig = reactive({
  rowKey: "md5",
  stripe: true
});
const ftField = { ...fcTableField, ...fcTableConfig };

// fc-Table 实例
const fcTableRef = ref<FcFilterTableInstance>();
const columns = ref<any[]>([]);
const requestParam = reactive({});

// Dialog状态管理
const uploadVisible = ref(false);
const setVisible = ref(false);
const sendVisible = ref(false);
const robotVisible = ref(false);
const tipVisible = ref(false);
const resendVisible = ref(false);
const resendMd5 = ref("");
const userListVisible = ref(false);
const userListType = ref<"success" | "failure">("success");
const userListUsers = ref<Record<string, string[]> | string[]>({});
const userListSheetNames = ref<any[]>([]);
const userListFileName = ref("");
const rowMd5 = ref("");
const sendMd5 = ref("");
const apiName = "SalaryNotifyEmail"; // 组件标识名称

// 详情 Drawer
const detailVisible = ref(false);
const detailRow = ref<any>(null);

const openDetail = (row: any) => {
  detailRow.value = row;
  detailVisible.value = true;
};

// 归一化 Sheet 列表：兼容后端返回的对象 { "0": "Sheet1" }、数组 [{ key, value }] 及 JSON 字符串
const normalizeSheetNames = (raw: any): { key: string; value: string }[] => {
  if (!raw) return [];
  if (typeof raw === "string") {
    try {
      return normalizeSheetNames(JSON.parse(raw));
    } catch {
      return [];
    }
  }
  if (Array.isArray(raw)) {
    return raw
      .filter((item) => item && typeof item === "object")
      .map((item) => ({
        key: String(item.key ?? ""),
        value: String(item.value ?? "")
      }));
  }
  if (typeof raw === "object") {
    return Object.keys(raw).map((k) => ({ key: k, value: String(raw[k] ?? "") }));
  }
  return [];
};

// 行数据的 Sheet 列表（模板中使用）
const sheetList = (row: any) => normalizeSheetNames(row?.sheetNames);

// 解析 success/failure 字段：兼容 JSON 字符串、按 Sheet 分组对象与旧扁平数组
const parseUserMap = (raw: any): Record<string, string[]> => {
  if (!raw) return {};
  if (typeof raw === "string") {
    try {
      return parseUserMap(JSON.parse(raw));
    } catch {
      return {};
    }
  }
  if (Array.isArray(raw)) {
    return { "0": raw.map((item) => String(item)) };
  }
  if (typeof raw === "object") {
    return Object.keys(raw).reduce((acc: Record<string, string[]>, key: string) => {
      const users = (raw as any)[key];
      acc[key] = Array.isArray(users) ? users.map((item) => String(item)) : [];
      return acc;
    }, {});
  }
  return {};
};

// 人员名单数量
const userCount = (raw: any): number => {
  const map = parseUserMap(raw);
  return (Object.values(map) as string[][]).reduce(
    (sum: number, list: string[]) => sum + list.length, 0
  );
};

// 判断某个 sheet 是否为已选的操作 Sheet（优先使用后端返回的 setSheetIndex，其次按名称匹配）
const isSheetSelected = (row: any, key: string): boolean => {
  if (Array.isArray(row?.setSheetIndex) && row.setSheetIndex.length) {
    return row.setSheetIndex.map((i: any) => String(i)).includes(String(key));
  }
  const item = sheetList(row).find((s) => s.key === key);
  const setSheetName: string = row?.setSheetName || "";
  if (!item || !setSheetName) return false;
  return setSheetName.includes(item.value);
};

// 解析消息标题：兼容对象 { "0": "标题A" } 与字符串【Sheet1】：标题A｜【Sheet2】：标题B｜
const normalizeTitleList = (row: any): { key: string; sheet: string; title: string }[] => {
  const raw = row?.setTitle;
  const list = sheetList(row);
  const nameOf = (k: string) => list.find((s) => s.key === k)?.value || `表${k}`;
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    return Object.keys(raw).map((k) => ({ key: k, sheet: nameOf(k), title: String(raw[k] ?? "") }));
  }
  const text: string = typeof raw === "string" ? raw : "";
  if (!text) return [];
  const parts = text.split("｜").filter((s: string) => s.trim());
  return parts.map((p: string, idx: number) => {
    const m = p.match(/^【(.+?)】[：:]\s*(.*)$/);
    if (m) {
      const sheetName = m[1].trim();
      const found = list.find((s) => s.value === sheetName);
      return { key: found?.key ?? String(idx), sheet: sheetName, title: m[2].trim() };
    }
    return { key: String(idx), sheet: p, title: "" };
  });
};

// 行数据的消息标题列表（模板中使用）
const titleList = (row: any) => normalizeTitleList(row);

// 详情 Drawer 的消息标题列表
const detailTitleList = computed<{ key: string; sheet: string; title: string }[]>(() =>
  normalizeTitleList(detailRow.value)
);

onMounted(() => {
  fetchTableFieldColumn(); // 表头数据
});

// 报表配置可能使用下划线或业务别名，统一映射为页面 slot 使用的字段名
const COLUMN_ALIAS: Record<string, string> = {
  file_name: "fileName",
  sheet_names: "sheetNames",
  sheet_list: "sheetNames",
  sheetList: "sheetNames",
  sheetName: "sheetNames",
  sheet_num: "nsheet",
  sheet_count: "nsheet",
  set_sheet: "setSheetName",
  setSheet: "setSheetName",
  set_title: "setTitle",
  title: "setTitle",
  title_list: "setTitle",
  titleList: "setTitle",
  create_rtx: "createRtx",
  create_time: "createTime",
  update_rtx: "updateRtx",
  update_time: "updateTime"
};

const DEFAULT_COLUMNS: any[] = [
  { prop: "fileName", label: "文件名称", minWidth: 180, showOverflowTooltip: true },
  { prop: "nsheet", label: "Sheet数", align: "center", width: 90 },
  { prop: "sheetNames", label: "Sheet名称", minWidth: 180 },
  { prop: "setSheetName", label: "发送Sheet", minWidth: 140 },
  { prop: "setTitle", label: "消息标题", minWidth: 180 },
  { prop: "count", label: "操作次数", align: "center", width: 100 },
  { prop: "number", label: "发送条数", align: "center", width: 100 },
  { prop: "success", label: "成功名单", align: "center", minWidth: 100 },
  { prop: "failure", label: "失败名单", align: "center", minWidth: 100 },
  { prop: "createTime", label: "上传时间", align: "center", minWidth: 160 },
  { prop: "options", label: "操作", align: "center", fixed: "right", width: 320 }
];

const fetchTableFieldColumn = async () => {
  const response = await TableFieldColumnApi({ xtbb: apiName });
  columns.value = (response.code === 100 && response.data
    ? response.data as ColumnProps<EmailListModel>[]
    : [...DEFAULT_COLUMNS]).map((column: any) => ({
    ...column,
    prop: COLUMN_ALIAS[column?.prop] || column?.prop
  }));
  // 确保成功/失败字段列存在（slot 自定义展示）
  [
    { prop: "success", label: "成功名单", align: "center", minWidth: 100 },
    { prop: "failure", label: "失败名单", align: "center", minWidth: 100 }
  ].forEach((column: any) => {
    if (!columns.value.some((item: any) => item?.prop === column.prop)) {
      columns.value.push(column as any);
    }
  });
  if (response.code !== 100 || !response.data) {
    ElNotification({
      title: "提示",
      message: "报表未配置表头，已使用默认表头展示",
      type: "warning"
    });
  }
};

// 表格数据：兼容报表配置输出的下划线/业务别名字段
const fetchTableData = async (params: any) => {
  const response: any = await SalaryNotifyEmailListApi(params);
  if (Array.isArray(response?.data?.list)) {
    response.data.list = response.data.list.map((row: any) => ({
      ...row,
      sheetNames: row.sheetNames ?? row.sheet_names ?? row.sheetList ?? [],
      setTitle: row.setTitle ?? row.set_title ?? row.title ?? {},
      setSheetName: row.setSheetName ?? row.set_sheet ?? "",
      successUsers: row.successUsers ?? row.success_users ?? {},
      failureUsers: row.failureUsers ?? row.failure_users ?? {}
    }));
  }
  return response;
};

// 重新获取表格数据 + 清空选择数据
const reFetchTableData = (isReload: boolean = false) => {
  if (isReload) {
    fcTableRef.value?.clearSelection();
  }
  fcTableRef.value?.getTableList();
};

// 设置
const setHandle = (row: EmailListModel) => {
  rowMd5.value = row.md5;
  setVisible.value = true;
};

// 发送
const sendHandle = (row: EmailListModel) => {
  sendMd5.value = row.md5;
  sendVisible.value = true;
};

// 重发失败人员
const resendHandle = (row: EmailListModel) => {
  resendMd5.value = row.md5;
  resendVisible.value = true;
};

// 打开人员名单 Drawer
const openUserList = (type: "success" | "failure", row: EmailListModel) => {
  userListType.value = type;
  userListUsers.value = parseUserMap(type === "success" ? row.success : row.failure);
  userListSheetNames.value = row.sheetNames || [];
  userListFileName.value = row.fileName || "";
  userListVisible.value = true;
};

// 单条删除
const deleteHandle = (row: EmailListModel) => {
  ElMessageBox.confirm("此操作将永久删除该行数据, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    SalaryNotifyEmailDeleteApi({ md5: row.md5 }).then(() => {
      ElNotification.success({ title: "提示", message: "删除成功" });
      reFetchTableData(true);
    }).catch(() => {});
  }).catch(() => {
    ElMessage.info("已取消删除操作");
  });
};

// 批量删除
const batchDeleteHandle = () => {
  if (!fcTableRef.value?.isSelected) {
    ElMessage.warning("请选择需要删除的文件");
    return;
  }
  const md5List = fcTableRef.value?.selectedListKeys || [];
  ElMessageBox.confirm(`确认删除选择的 ${md5List.length} 条数据吗？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    SalaryNotifyEmailBatchDeleteApi({ md5: md5List }).then(() => {
      ElNotification.success({ title: "提示", message: "删除成功" });
      reFetchTableData(true);
    }).catch(() => {});
  }).catch(() => {
    ElMessage.info("已取消删除操作");
  });
};

// 模板下载
const templateHandle = () => {
  SysConfigXtcsKeyApi({ key: "SALARY-EMAIL-FILE-URL" }).then((response: any) => {
    const url = response?.data?.value;
    if (!url) {
      ElMessage.warning("模板地址未配置，请联系管理员");
      return;
    }
    window.open(url, "_blank");
  }).catch(() => {});
};
</script>

<style scoped lang="scss">
.left-panel {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .el-button + .el-button {
    margin-left: 10px;
  }
}

.table-handle-link {
  display: inline-flex;
  align-items: center;
  color: inherit;
  text-decoration: none;
}

// Sheet 数标签
.sheet-count-tag {
  cursor: pointer;
  font-weight: 600;
}

// 表格内可点击链接样式
.detail-link {
  color: var(--el-color-primary);
  cursor: pointer;
  text-decoration: none;
  border-bottom: 1px dashed transparent;
  transition: all 0.2s ease;

  &:hover {
    border-bottom-color: var(--el-color-primary);
  }
}

.empty-text {
  color: var(--el-text-color-placeholder);
}

.list-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
  cursor: pointer;
}

.mr-6px {
  margin-right: 6px;
}

// Drawer 详情
.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 0;
}

.detail-title-list {
  .detail-title-item {
    padding: 4px 0;
    line-height: 1.9;
    border-bottom: 1px dashed var(--el-border-color-lighter);

    &:last-child {
      border-bottom: none;
    }
  }

  .detail-title-sheet {
    display: inline-block;
    padding: 1px 8px;
    background: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
    border-radius: 4px;
    font-size: 12px;
    margin-right: 6px;
  }

  .detail-title-sep {
    color: var(--el-text-color-placeholder);
    margin-right: 4px;
  }

  .detail-title-value {
    color: var(--el-text-color-primary);
  }
}
</style>

<!-- Sheet 悬浮面板（弹层被 teleport 到 body，使用 popper-class 限定作用域） -->
<style lang="scss">
.email-sheet-popper.el-popover {
  padding: 14px 16px;

  .sheet-panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 10px;
    margin-bottom: 8px;
    border-bottom: 1px solid var(--el-border-color-lighter);
  }

  .sheet-panel-title {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: var(--el-text-color-primary);

    &::before {
      content: "";
      width: 3px;
      height: 14px;
      border-radius: 2px;
      background: var(--el-color-primary);
    }
  }

  .sheet-panel-count {
    padding: 0 8px;
    line-height: 20px;
    border-radius: 10px;
    background: var(--el-fill-color);
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }

  .sheet-panel-list {
    max-height: 280px;
    overflow-y: auto;
  }

  .sheet-panel-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
    border-radius: 6px;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: var(--el-fill-color-light);
    }
  }

  .sheet-panel-index {
    flex: 0 0 20px;
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    border-radius: 50%;
    background: var(--el-fill-color);
    color: var(--el-text-color-regular);
    font-size: 12px;
  }

  .sheet-panel-name {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 13px;
    color: var(--el-text-color-primary);
  }

  .sheet-panel-key {
    flex: 0 0 auto;
    font-size: 12px;
    color: var(--el-text-color-placeholder);
  }

  .name-tag {
    margin: 0 4px 6px 0;
  }

  // 消息标题面板（格式：Sheet名称【索引】：消息标题）
  .title-sheet-panel {
    .sheet-panel-title::before {
      background: var(--el-color-warning);
    }

    .sheet-panel-count {
      background: var(--el-color-warning-light-9);
      color: var(--el-color-warning-dark-2);
    }
  }

  .title-panel-item {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 9px 10px;
    margin-bottom: 6px;
    border-radius: 8px;
    background: var(--el-fill-color-lighter);
    line-height: 1.7;
    word-break: break-all;
    transition: background-color 0.2s ease;

    &:last-child {
      margin-bottom: 0;
    }

    &:hover {
      background: var(--el-color-warning-light-9);
    }
  }

  .title-panel-sheet {
    display: inline-block;
    padding: 1px 8px;
    border-radius: 10px;
    background: var(--el-color-warning-light-9);
    color: var(--el-color-warning-dark-2);
    font-size: 12px;
    font-weight: 600;
  }

  .title-panel-key {
    margin-left: 6px;
    font-size: 12px;
    color: var(--el-text-color-placeholder);
  }

  .title-panel-sep {
    margin: 0 4px;
    color: var(--el-text-color-placeholder);
  }

  .title-panel-text {
    font-size: 13px;
    color: var(--el-text-color-regular);
  }
}
</style>
