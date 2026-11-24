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
                           :showDownloadBtn="false">
            <template #match="scope">
              <el-tag effect="plain">{{ matchText(scope.row.match) }}</el-tag>
            </template>
            <template #lockText="scope">
              <el-tag :type="scope.row.lock ? 'info' : 'success'" effect="plain">
                {{ scope.row.lock ? '已停用' : '已启用' }}
              </el-tag>
            </template>
            <template #options="scope">
              <el-button link type="primary" :size="buttonField.size" icon="Search" @click="previewHandle(scope.row)">预览</el-button>
              <el-button link type="warning" :size="buttonField.size" icon="Delete" @click="cleanHandle(scope.row)">清理</el-button>
              <el-button link type="primary" :size="buttonField.size" icon="Edit" @click="editRuleHandle(scope.row)">编辑</el-button>
              <el-switch :model-value="scope.row.lock === true || scope.row.lockText === '已停用'"
                         :active-value="false" :inactive-value="true"
                         inline-prompt active-text="启" inactive-text="停" @change="val => lockHandle(scope.row, val)" />
              <el-popconfirm title="确认删除该清理规则？" confirm-button-text="确定" cancel-button-text="取消"
                             @confirm="deleteRuleHandle(scope.row.md5)">
                <template #reference>
                  <el-button link type="danger" :size="buttonField.size" icon="Delete">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </fc-filter-table>
        </div>
      </div>

      <!--Redis配置-->
      <div v-show="activeTab === 'config'" class="pane">
        <div class="table-wrapper">
          <el-table :data="configList" v-loading="configLoading" border stripe height="100%" style="width: 100%" size="default">
            <el-table-column prop="name" label="配置名称" min-width="140" />
            <el-table-column prop="host" label="主机" min-width="140" />
            <el-table-column prop="port" label="端口" width="90" align="center" />
            <el-table-column prop="db" label="库" width="70" align="center" />
            <el-table-column prop="orderId" label="排序" width="80" align="center" />
            <el-table-column label="状态" width="90" align="center">
              <template #default="scope">
                <el-tag :type="scope.row.lock ? 'info' : 'success'" effect="plain">
                  {{ scope.row.lock ? '停用' : '启用' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="170" align="center" />
            <el-table-column label="操作" width="180" align="center" fixed="right">
              <template #default="scope">
                <el-button link type="primary" icon="Edit" @click="editConfigHandle(scope.row)">编辑</el-button>
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
    <ConfigForm v-model:visible="configFormVisible" :md5="configFormMd5" @success="onConfigSuccess" />
  </el-container>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, h } from 'vue';
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus';
import { FcFilterTableInstance } from '@/components/fcFilterTable/model';
import { buttonField, fcTableField } from '@/utils/attrs/field';
import { OptionEnumModelList } from '@/models/X';
import { RedisConfigModelList, RedisRuleModelList } from '@/models/systemModel';
import { TableFieldColumnApi } from '@/api/modules/common';
import {
  SysOpsRedisConfigListApi, SysOpsRedisRuleFilterApi, SysOpsRedisRuleListApi,
  SysOpsRedisRuleDeleteApi, SysOpsRedisRulesDeleteApi, SysOpsRedisRuleLockApi,
  SysOpsRedisRulePreviewApi, SysOpsRedisRuleCleanApi, SysOpsRedisConfigDeleteApi
} from '@/api/modules/systemOps';
import Filter from './components/filter.vue';
import RuleForm from './components/ruleForm.vue';
import ConfigForm from './components/configForm.vue';

const fcTableConfig = reactive({ rowKey: 'md5', border: false, showDownloadBtn: false });
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

const defaultColumns: any[] = [
  { type: 'selection', width: 50, fixed: 'left' },
  { prop: 'name', label: '规则名称', minWidth: 140 },
  { prop: 'configName', label: 'Redis配置', minWidth: 130 },
  { prop: 'match', label: '匹配方式', width: 110 },
  { prop: 'pattern', label: '键匹配内容', minWidth: 200 },
  { prop: 'maxKeys', label: '最大键数', width: 100 },
  { prop: 'lockText', label: '状态', width: 90 },
  { prop: 'lastCleanCount', label: '上次清理数', width: 110 },
  { prop: 'lastCleanTime', label: '上次清理时间', width: 170 }
];

const matchText = (value: string) => {
  return matchOptions.value.find(item => item.value === value)?.label || value;
};

onMounted(async () => {
  await fetchTableFieldColumn();
  await fetchFilterOptions();
  await fetchConfigList();
});

const fetchTableFieldColumn = async () => {
  const optionColumn = { prop: 'options', label: '操作', width: 330, fixed: 'right' };
  try {
    const response = await TableFieldColumnApi({ xtbb: apiName });
    if (response.code === 100 && Array.isArray(response.data) && response.data.length) {
      columns.value = [...(response.data as any[]), optionColumn];
      return;
    }
  } catch {
    // 后台未配置报表时使用内置表头
  }
  columns.value = [...defaultColumns, optionColumn];
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
  ElMessageBox.alert(h('div', [
    h('p', `规则：${data?.rule || row.name}；匹配 ${data?.count ?? 0} 个键（单次上限 ${data?.maxKeys ?? 0}）`),
    h('p', `匹配表达式：${data?.match || '-'}`),
    h('p', '示例键名：'),
    h('pre', { style: { maxHeight: '240px', overflow: 'auto', background: '#f5f7fa', padding: '8px' } },
      (data?.sample || []).join('\n') || '（无）')
  ]), '预览结果', { confirmButtonText: '知道了' });
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

const lockHandle = async (row: RedisRuleModelList, value: any) => {
  await SysOpsRedisRuleLockApi({ md5: row.md5, value: Boolean(value) });
  ElMessage.success(value ? '规则已启用' : '规则已停用');
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

const deleteConfigHandle = async (md5: string) => {
  await SysOpsRedisConfigDeleteApi({ md5 });
  ElNotification({ title: '提示', message: '删除成功', type: 'success' });
  fetchConfigList();
  fetchFilterOptions();
};

const onConfigSuccess = () => {
  fetchConfigList();
  fetchFilterOptions();
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
