<template>
  <el-container>
    <!--操作区-->
    <el-header>
      <div class="left-panel">
        <el-radio-group v-model="activeTab" class="tab-group">
          <el-radio-button value="rule">清理规则</el-radio-button>
          <el-radio-button value="config">Redis连接配置</el-radio-button>
        </el-radio-group>
        <el-divider direction="vertical" />
        <template v-if="activeTab === 'rule'">
          <el-button id="btn-redis-rule-add" class="table-handle-button" :type="buttonField.type" :plain="buttonField.plain"
                     :size="buttonField.size" icon="Plus" @click="addRuleHandle">新增规则</el-button>
          <el-button id="btn-redis-rule-delete" type="danger" icon="Delete" plain :size="buttonField.size"
                     :disabled="!fcTableRef?.isSelected" @click="batchDeleteHandle">批量删除</el-button>
        </template>
        <template v-else>
          <el-button id="btn-redis-config-add" class="table-handle-button" :type="buttonField.type" :plain="buttonField.plain"
                     :size="buttonField.size" icon="Plus" @click="addConfigHandle">新增配置</el-button>
          <el-button id="btn-redis-config-ping" type="success" plain :size="buttonField.size" icon="Connection"
                     @click="pingHandle()">全部PING</el-button>
        </template>
      </div>
      <div class="right-panel">
        <template v-if="activeTab === 'rule'">
          <el-button text :icon="filterVisible ? 'ArrowUp' : 'ArrowDown'" @click="switchSearch">
            {{ filterVisible ? '收起查询' : '展开查询' }}
          </el-button>
        </template>
        <template v-else>
          <el-input v-model="configKeyword" style="width: 240px;" :size="buttonField.size" clearable
                    placeholder="配置名称/主机" @keyup.enter="fetchConfigList" @clear="fetchConfigList">
            <template #append>
              <el-button icon="Search" @click="fetchConfigList" />
            </template>
          </el-input>
          <el-tooltip effect="dark" content="刷新" placement="top">
            <el-button id="btn-redis-config-refresh" :size="buttonField.size" icon="Refresh"
                       @click="refreshConfigHandle" />
          </el-tooltip>
        </template>
      </div>
    </el-header>

    <!--数据区-->
    <el-main class="nopadding redis-main">
      <!--清理规则-->
      <div v-show="activeTab === 'rule'" class="pane">
        <transition name="t-filter">
          <div v-if="filterVisible" class="table-search">
            <Filter :config-option="configOptions" :match-option="matchOptions" @search="search" />
          </div>
        </transition>
        <div class="table-wrapper">
          <fc-filter-table ref="fcTableRef" :tableName="apiName" :requestApi="fetchTableData" :initParam="requestParam"
                           :columns="columns" :rowKey="ftField.rowKey" :stripe="ftField.stripe" :border="ftField.border"
                           :pagination="ftField.pagination" :showBottomView="ftField.showBottomView"
                           :showRefreshBtn="ftField.showRefreshBtn" :showColumnBtn="ftField.showColumnBtn"
                           :showDownloadBtn="ftField.showDownloadBtn">
            <template #match="scope">
              <el-tag effect="plain">{{ matchText(scope.row.match) }}</el-tag>
            </template>
            <!-- 表格操作 -->
            <template #options="scope">
              <el-button link type="primary" :size="buttonField.size" icon="Search" @click="previewHandle(scope.row)">预览</el-button>
              <el-button link type="warning" :size="buttonField.size" icon="Delete" @click="cleanHandle(scope.row)">清理</el-button>
              <el-button link type="primary" :size="buttonField.size" icon="Edit" @click="editRuleHandle(scope.row)">编辑</el-button>
              <el-popconfirm title="确认删除该清理规则？" confirm-button-text="确定" cancel-button-text="取消"
                             @confirm="deleteRuleHandle(scope.row.md5)">
                <template #reference>
                  <el-button link type="danger" :size="buttonField.size" icon="Delete">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
            <!-- 状态管理 -->
            <template #lock="scope">
              <el-switch v-model="scope.row.lock"
                         active-text="禁用"
                         inactive-text="启用"
                         style="--el-switch-on-color: #ff4949; --el-switch-off-color: #13ce66;"
                         @change="statusHandle(scope.row.md5, $event)" />
            </template>
          </fc-filter-table>
        </div>
      </div>

      <!--Redis配置-->
      <div v-show="activeTab === 'config'" class="pane">
        <div class="table-wrapper">
          <el-table :data="configList" v-loading="configLoading" border stripe height="100%" style="width: 100%" size="default">
            <el-table-column prop="name" label="配置名称"align="center" />
            <el-table-column prop="host" label="主机"align="center" />
            <el-table-column prop="port" label="端口" align="center" />
            <el-table-column prop="db" label="库" align="center" />
            <el-table-column prop="orderId" label="排序编号" align="center" />
            <el-table-column label="状态" align="center">
              <template #default="scope">
                <el-tag :type="scope.row.lock ? 'info' : 'success'" effect="plain">
                  {{ scope.row.lock ? '停用' : '启用' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="center" />
            <el-table-column label="操作" width="320" align="center" fixed="right">
              <template #default="scope">
                <el-button link type="primary" icon="Edit" @click="editConfigHandle(scope.row)">编辑</el-button>
                <el-tooltip effect="dark" :disabled="!scope.row.lock" content="配置已停用，无法浏览" placement="top">
                  <span>
                    <el-button link type="primary" icon="View" :disabled="scope.row.lock"
                               @click="openKeyBrowser(scope.row)">查看Key</el-button>
                  </span>
                </el-tooltip>
                <el-button link type="success" icon="Connection" @click="pingHandle(scope.row.md5)">PING</el-button>
                <el-popconfirm title="确认删除该连接配置？" confirm-button-text="确定" cancel-button-text="取消"
                               @confirm="deleteConfigHandle(scope.row.md5)">
                  <template #reference>
                    <el-button link type="danger" icon="Delete">删除</el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
            <template #empty><el-empty description="暂无Redis连接配置" :image-size="80" /></template>
          </el-table>
        </div>
      </div>
    </el-main>

    <RuleForm v-model:visible="ruleFormVisible" :md5="ruleFormMd5" :config-option="configOptions"
              :match-option="matchOptions" @success="reFetchTableData(true)" />
    <ConfigForm v-model:visible="configFormVisible" :md5="configFormMd5" @reFetchTableData="onConfigSuccess" />
    <PingResult v-model:visible="pingVisible" :list="pingList" :total="pingTotal" :success="pingSuccess" :failed="pingFailed" />
    <PreviewResult v-model:visible="previewVisible" :rule="previewRule" :config="previewConfig" :match="previewMatch"
                   :count="previewCount" :max-keys="previewMaxKeys" :sample="previewSample" />
    <KeyBrowser v-model:visible="keyBrowserVisible" :md5="keyBrowserMd5" :config-name="keyBrowserConfigName" />
  </el-container>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus';
import { FcFilterTableInstance } from '@/components/fcFilterTable/model';
import { buttonField, fcTableField } from '@/utils/attrs/field';
import { OptionEnumModelList } from '@/models/X';
import { RedisConfigModelList, RedisRuleModelList } from '@/models/systemModel';
import { TableFieldColumnApi } from '@/api/modules/common';
import {
  SysOpsRedisConfigListApi, SysOpsRedisRuleFilterApi, SysOpsRedisRuleListApi,
  SysOpsRedisRuleDeleteApi, SysOpsRedisRulesDeleteApi, SysOpsRedisRuleLockApi,
  SysOpsRedisRulePreviewApi, SysOpsRedisRuleCleanApi, SysOpsRedisConfigDeleteApi,
  SysOpsRedisPingApi
} from '@/api/modules/systemOps';
import Filter from './components/filter.vue';
import RuleForm from './components/ruleForm.vue';
import ConfigForm from './components/configForm.vue';
import PingResult from './components/pingResult.vue';
import PreviewResult from './components/previewResult.vue';
import KeyBrowser from './components/keyBrowser.vue';

const fcTableConfig = reactive({ rowKey: 'md5', border: false });
const ftField = { ...fcTableField, ...fcTableConfig };
const fcTableRef = ref<FcFilterTableInstance>();

const apiName = 'SystemOpsRedis';
const activeTab = ref('rule');
const filterVisible = ref(false);
const columns = ref<any[]>([]);
const requestParam = reactive<{ filter: Record<string, any> }>({ filter: {} });

const configOptions = ref<OptionEnumModelList>([]);
const matchOptions = ref<OptionEnumModelList>([]);
const configList = ref<RedisConfigModelList[]>([]);
const configKeyword = ref('');
const configLoading = ref(false);

const ruleFormVisible = ref(false);
const ruleFormMd5 = ref('');
const configFormVisible = ref(false);
const configFormMd5 = ref('');

const pingVisible = ref(false);
const pingList = ref<any[]>([]);
const pingTotal = ref(0);
const pingSuccess = ref(0);
const pingFailed = ref(0);

const previewVisible = ref(false);
const previewRule = ref('');
const previewConfig = ref('');
const previewMatch = ref('');
const previewCount = ref(0);
const previewMaxKeys = ref(0);
const previewSample = ref<string[]>([]);

const keyBrowserVisible = ref(false);
const keyBrowserMd5 = ref('');
const keyBrowserConfigName = ref('');

const matchText = (value: string) => {
  return matchOptions.value.find(item => item.value === value)?.label || value;
};

onMounted(async () => {
  await fetchTableFieldColumn();
  await fetchFilterOptions();
  await fetchConfigList();
});

const fetchTableFieldColumn = async () => {
  const response = await TableFieldColumnApi({xtbb: apiName});
  if (response.code === 100 && response.data) {
    columns.value = response.data as any;
  } else {
    ElNotification({
      title: '提示',
      message: '报表未配置表头，请联系平台管理员！',
      type: 'warning'
    });
  }
};

const fetchFilterOptions = async () => {
  const response = await SysOpsRedisRuleFilterApi();
  if (response.code === 100 && response.data) {
    configOptions.value = response.data.config || [];
    matchOptions.value = response.data.match || [];
  }
};

const fetchConfigList = async () => {
  configLoading.value = true;
  try {
    const response = await SysOpsRedisConfigListApi({ content: configKeyword.value });
    if (response.code === 100) configList.value = response.data?.list || [];
  } finally {
    configLoading.value = false;
  }
};

const fetchTableData = async (params: any) => {
  return await SysOpsRedisRuleListApi(JSON.parse(JSON.stringify(params)));
};

const reFetchTableData = (isReload: boolean = false) => {
  if (isReload) {
    fcTableRef.value?.clearSelection();
    fcTableRef.value?.getTableList();
    fetchFilterOptions();
    fetchConfigList();
  }
};

const switchSearch = () => { filterVisible.value = !filterVisible.value; };
const search = (params: any) => {
  requestParam.filter = params;
  reFetchTableData(true);
};

const addRuleHandle = () => { ruleFormMd5.value = ''; ruleFormVisible.value = true; };
const editRuleHandle = (row: RedisRuleModelList) => { ruleFormMd5.value = row.md5; ruleFormVisible.value = true; };

const previewHandle = async (row: RedisRuleModelList) => {
  const response = await SysOpsRedisRulePreviewApi({ md5: row.md5 });
  const data = response.data;
  previewRule.value = data?.rule || row.name;
  previewConfig.value = data?.config || '';
  previewMatch.value = data?.match || '-';
  previewCount.value = data?.count ?? 0;
  previewMaxKeys.value = data?.maxKeys ?? 0;
  previewSample.value = data?.sample || [];
  previewVisible.value = true;
};

const cleanHandle = async (row: RedisRuleModelList) => {
  try {
    await ElMessageBox.confirm(
      `确认按后台规则【${row.name}】执行清理？清理条件与范围完全由后台配置决定。`,
      '清理确认',
      { type: 'warning', confirmButtonText: '确认清理', cancelButtonText: '取消' }
    );
  } catch {
    return;
  }
  const response = await SysOpsRedisRuleCleanApi({ md5: row.md5 });
  ElNotification({
    title: '清理完成',
    message: `规则【${response.data?.rule || row.name}】共处理 ${response.data?.count ?? 0} 个键`,
    type: 'success'
  });
  reFetchTableData(true);
};

const statusHandle = async (md5: string, value: any) => {
  await SysOpsRedisRuleLockApi({ md5, value: Boolean(value) });
  ElMessage.success(value ? '规则已禁用' : '规则已启用');
  reFetchTableData(true);
};

const deleteRuleHandle = async (md5: string) => {
  await SysOpsRedisRuleDeleteApi({ md5 });
  ElNotification({ title: '提示', message: '删除成功', type: 'success' });
  reFetchTableData(true);
};

const batchDeleteHandle = () => {
  if (!fcTableRef.value?.isSelected) {
    ElMessage.warning('请选择需要删除的数据');
    return;
  }
  const md5List = fcTableRef.value?.selectedListKeys as string[];
  ElMessageBox.confirm(`确认删除选中的 ${md5List.length} 条规则？`, '批量删除', { type: 'warning' })
    .then(async () => {
      await SysOpsRedisRulesDeleteApi({ md5: md5List });
      ElNotification({ title: '提示', message: '删除成功', type: 'success' });
      reFetchTableData(true);
    }).catch(() => {});
};

const addConfigHandle = () => { configFormMd5.value = ''; configFormVisible.value = true; };
const editConfigHandle = (row: RedisConfigModelList) => { configFormMd5.value = row.md5; configFormVisible.value = true; };

const openKeyBrowser = (row: RedisConfigModelList) => {
  keyBrowserMd5.value = row.md5;
  keyBrowserConfigName.value = row.name;
  keyBrowserVisible.value = true;
};

const pingHandle = async (md5?: string) => {
  const response = await SysOpsRedisPingApi(md5 ? { md5 } : {});
  const data = response.data;
  pingList.value = data?.list || [];
  pingTotal.value = data?.total ?? pingList.value.length;
  pingSuccess.value = data?.success ?? 0;
  pingFailed.value = data?.failed ?? 0;
  pingVisible.value = true;
};

const deleteConfigHandle = async (md5: string) => {
  await SysOpsRedisConfigDeleteApi({ md5 });
  ElNotification({ title: '提示', message: '删除成功', type: 'success' });
  fetchConfigList();
  fetchFilterOptions();
};

const onConfigSuccess = async () => {
  await fetchConfigList();
  await fetchFilterOptions();
};

const refreshConfigHandle = async () => {
  await fetchConfigList();
  await fetchFilterOptions();
  ElNotification({ title: '提示', message: '刷新成功', type: 'success', duration: 1500 });
};
</script>

<style scoped>
.redis-main { height: 100%; padding: 0 !important; overflow: hidden; }
.pane { display: flex; flex-direction: column; height: 100%; padding: 12px 15px 15px; }
.table-wrapper { flex: 1; min-height: 0; }
.table-search { padding-bottom: 12px; flex: none; }
:deep(.el-header) { display: flex; align-items: center; justify-content: space-between; }
.left-panel, .right-panel { display: flex; align-items: center; gap: 8px; }
.tab-group { margin-right: 4px; }
:deep(.el-radio-button__inner) { min-width: 92px; }
</style>
