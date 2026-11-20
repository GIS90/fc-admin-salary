<template>
  <el-drawer
      :model-value="props.visible"
      :size="drawerSize"
      :title="drawerTitle"
      direction="rtl"
      append-to-body
      destroy-on-close
      @update:model-value="closeHandle"
  >
    <template #header>
      <div class="drawer-header">
        <div class="drawer-header-icon" :class="props.type === 'success' ? 'is-success' : 'is-danger'">
          <el-icon><component :is="props.type === 'success' ? CircleCheckFilled : CircleCloseFilled" /></el-icon>
        </div>
        <div class="drawer-header-text">
          <div class="drawer-title">{{ drawerTitle }}</div>
          <div class="drawer-subtitle">{{ props.fileName || '消息文件' }} · 共 {{ totalCount }} 人 · {{ sheetEntries.length }} 个Sheet</div>
        </div>
      </div>
    </template>

    <div class="drawer-body">
      <div v-if="sheetEntries.length > 1" class="sheet-tabs">
        <el-button
          v-for="item in sheetEntries"
          :key="item.key"
          size="small"
          :type="item.key === activeSheet ? 'primary' : 'info'"
          :plain="item.key !== activeSheet"
          @click="activeSheet = item.key"
        >
          {{ labelOf(item) }}（{{ item.users.length }}）
        </el-button>
      </div>
      <div v-else-if="sheetEntries.length === 1" class="sheet-single">
        当前Sheet：{{ labelOf(sheetEntries[0]) }}
      </div>

      <div class="drawer-toolbar">
        <el-input v-model="keyword" clearable placeholder="搜索人员 User-ID" :prefix-icon="Search" class="search-input" />
        <el-button type="primary" plain icon="DocumentCopy" :disabled="!filteredUsers.length" @click="copyAll">
          复制{{ filteredUsers.length === currentUsers.length ? '全部' : '结果' }}（{{ filteredUsers.length }}）
        </el-button>
      </div>

      <div v-if="filteredUsers.length" class="user-list">
        <div v-for="(uid, i) in filteredUsers" :key="i" class="user-item">
          <span class="user-index">{{ i + 1 }}</span>
          <span class="user-id">{{ uid }}</span>
          <el-tooltip effect="dark" content="复制该ID" placement="top">
            <el-icon class="user-copy" @click="copyOne(uid)"><DocumentCopy /></el-icon>
          </el-tooltip>
        </div>
      </div>
      <el-empty v-else :description="currentUsers.length ? '无匹配结果' : '暂无数据'" />
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { ElMessage } from "element-plus";
import { CircleCheckFilled, CircleCloseFilled, Search } from "@element-plus/icons-vue";

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
    default: false
  },
  type: {
    type: String as () => "success" | "failure",
    default: "success"
  },
  title: {
    type: String,
    default: ""
  },
  fileName: {
    type: String,
    default: ""
  },
  users: {
    type: [Object, Array] as any,
    default: () => ({})
  },
  sheetNames: {
    type: [Object, Array] as any,
    default: () => []
  }
});
const emit = defineEmits(["update:visible"]);

interface UserGroup {
  key: string;
  name: string;
  users: string[];
}

const keyword = ref("");
const activeSheet = ref("");
const drawerSize = "460px";
const drawerTitle = computed(() =>
  props.title || (props.type === "success" ? "发送成功人员名单" : "发送失败人员名单")
);

const normalizeNames = (raw: any): Record<string, string> => {
  if (!raw) return {};
  if (typeof raw === "string") {
    try { return normalizeNames(JSON.parse(raw)); } catch { return {}; }
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

const sheetEntries = computed<UserGroup[]>(() => {
  const names = normalizeNames(props.sheetNames);
  const raw = props.users as any;
  const entries: UserGroup[] = [];
  if (Array.isArray(raw)) {
    entries.push({ key: "0", name: names["0"] || "Sheet 1", users: raw.map((u) => String(u)) });
    return entries;
  }
  if (raw && typeof raw === "object") {
    Object.keys(raw)
      .sort((a, b) => Number(a) - Number(b))
      .forEach((key) => {
        const users = Array.isArray(raw[key]) ? raw[key].map((u: any) => String(u)) : [];
        entries.push({ key, name: names[key] || `Sheet ${Number(key) + 1 || key}`, users });
      });
  }
  return entries;
});

const totalCount = computed(() =>
  sheetEntries.value.reduce((sum, item) => sum + item.users.length, 0)
);
const currentEntry = computed(() =>
  sheetEntries.value.find((item) => item.key === activeSheet.value) || sheetEntries.value[0]
);
const currentUsers = computed(() => currentEntry.value?.users || []);
const labelOf = (item: UserGroup) => item.name || `Sheet ${Number(item.key) + 1}`;

watch(
  () => [props.visible, props.users],
  () => {
    if (!props.visible) return;
    const entries = sheetEntries.value;
    const target = entries.find((item) => item.users.length) || entries[0];
    activeSheet.value = target?.key || "";
    keyword.value = "";
  },
  { immediate: true, deep: true }
);

const filteredUsers = computed(() => {
  const kw = keyword.value.trim().toLowerCase();
  return kw ? currentUsers.value.filter((u) => String(u).toLowerCase().includes(kw)) : currentUsers.value;
});

const writeClipboard = async (text: string) => {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    return true;
  } catch {
    return false;
  }
};

const copyAll = async () => {
  const ok = await writeClipboard(filteredUsers.value.join("\n"));
  ElMessage[ok ? "success" : "error"]({ message: ok ? `已复制 ${filteredUsers.value.length} 个人员` : "复制失败" });
};

const copyOne = async (uid: string) => {
  const ok = await writeClipboard(uid);
  ElMessage[ok ? "success" : "error"]({ message: ok ? `已复制 ${uid}` : "复制失败" });
};

const closeHandle = () => {
  keyword.value = "";
  emit("update:visible", false);
};
</script>

<style scoped lang="scss">
.drawer-header {
  display: flex;
  align-items: center;
  gap: 14px;
}

.drawer-header-icon {
  flex: 0 0 42px;
  width: 42px;
  height: 42px;
  line-height: 42px;
  text-align: center;
  border-radius: 50%;
  font-size: 24px;

  .el-icon { vertical-align: middle; }

  &.is-success {
    color: var(--el-color-success);
    background: var(--el-color-success-light-9);
  }

  &.is-danger {
    color: var(--el-color-danger);
    background: var(--el-color-danger-light-9);
  }
}

.drawer-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.drawer-subtitle {
  margin-top: 3px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.drawer-body {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.sheet-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
}

.sheet-single {
  margin-bottom: 14px;
  padding: 8px 12px;
  border-radius: 6px;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-regular);
  font-size: 13px;
}

.drawer-toolbar {
  display: flex;
  gap: 10px;
  margin-bottom: 14px;
}

.search-input {
  flex: 1;
}

.user-list {
  flex: 1;
  overflow-y: auto;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  transition: background-color 0.2s ease;

  &:last-child { border-bottom: none; }
  &:hover { background-color: var(--el-fill-color-light); }
}

.user-index {
  flex: 0 0 30px;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 50%;
  background: var(--el-fill-color);
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

.user-id {
  flex: 1;
  font-size: 14px;
  color: var(--el-text-color-primary);
  word-break: break-all;
}

.user-copy {
  color: var(--el-text-color-secondary);
  cursor: pointer;
  font-size: 15px;

  &:hover { color: var(--el-color-primary); }
}
</style>
