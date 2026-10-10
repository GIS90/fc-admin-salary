<template>
  <el-drawer
    :model-value="visible"
    @update:model-value="(val: boolean) => emit('update:visible', val)"
    size="90%"
    direction="rtl"
    destroy-on-close
    @close="handleClose">
    <template #header>
      <div class="drawer-header">
        <div class="drawer-header-left">
          <span class="drawer-title">配置报表字段</span>
          <el-tag v-if="reportTable" type="info" size="large" effect="plain">报表名称：{{ reportName }}</el-tag>
          <el-tag v-if="reportTable" type="danger" size="large" effect="plain">数据库表名：{{ reportTable }}</el-tag>
          <el-tag v-if="reportMode" type="success" size="large">百分比模式</el-tag>
          <el-tag v-else type="primary" size="large">固定数值模式</el-tag>
        </div>
        <div class="drawer-header-right">
          <span class="width-sum-label">宽度之和：</span>
          <span class="width-sum-value" :class="widthSumClass">{{ widthSumText }}</span>
          <el-tag v-if="reportMode && Math.abs(widthSum - 100) > 0.001" type="danger" size="small" class="margin-left-10px">
            宽度之和需等于 100
          </el-tag>
        </div>
      </div>
    </template>

    <el-container class="drawer-container">
      <el-header class="drawer-toolbar">
        <div class="left-panel">
          <el-button type="primary" icon="Plus" @click="addHandle">新增字段</el-button>
          <el-button type="danger" icon="Delete" :plain="true" :disabled="!isSelected" @click="batchDeleteHandle">批量删除</el-button>
          <el-popover placement="bottom" width="400" trigger="hover">
            <template #default>
              <div style="line-height: 2.5;">
                <span style="color: #f56c6c;">新增、编辑、删除</span>只支持单条数据操作，请勿新增/编辑多个报表字段，点击保存时，只会保存当前操作数据
              </div>
            </template>
            <template #reference>
              <el-button id="btn-popover" type="info" icon="Reading">操作说明</el-button>
            </template>
          </el-popover>
        </div>
        <div class="right-panel">
          <el-button icon="Refresh" circle @click="fetchData" />
        </div>
      </el-header>

      <el-main class="nopadding">
        <el-table ref="tableRef" :data="fieldList" border stripe row-key="_rowKey" height="calc(100vh - 200px)" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="45" align="center" :selectable="row => !isEditing(row)" />
          <el-table-column type="index" label="序号" width="70" align="center" />
          <el-table-column prop="field" label="数据库字段" min-width="150">
            <template #default="scope">
              <el-input v-if="isEditing(scope.row)" v-model="scope.row.field" placeholder="字段名" :disabled="isExistingRow(scope.row)" size="small" />
              <span v-else>{{ scope.row.field }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="nameCh" label="中文名称" min-width="150">
            <template #default="scope">
              <el-input v-if="isEditing(scope.row)" v-model="scope.row.nameCh" placeholder="中文名" size="small" />
              <span v-else>{{ scope.row.nameCh }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="nameZh" label="英文名称" min-width="150">
            <template #default="scope">
              <el-input v-if="isEditing(scope.row)" v-model="scope.row.nameZh" placeholder="英文名" size="small" />
              <span v-else>{{ scope.row.nameZh }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="width" label="宽度" width="130" align="right">
            <template #default="scope">
              <el-input-number v-if="isEditing(scope.row)" v-model="scope.row.width" :min="0" :precision="4" :step="1" controls-position="right" size="small" style="width:110px;" />
              <span v-else :class="{ 'text-danger': reportMode && Math.abs(scope.row.width) > 100 }">{{ scope.row.width }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="fixed" label="锁定" width="110" align="center">
            <template #default="scope">
              <el-select v-if="isEditing(scope.row)" v-model="scope.row.fixed" placeholder="锁定" clearable size="small" style="width:90px;">
                <el-option label="无" value="" />
                <el-option label="left" value="left" />
                <el-option label="right" value="right" />
              </el-select>
              <el-tag v-else-if="scope.row.fixed" size="small" type="info">{{ scope.row.fixed }}</el-tag>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="列表" width="90" align="center">
            <template #default="scope">
              <el-switch v-if="isEditing(scope.row)" v-model="scope.row.list" size="small" />
              <el-tag v-else :type="scope.row.list ? 'success' : 'info'" size="small">{{ scope.row.list ? '是' : '否' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="导出" width="90" align="center">
            <template #default="scope">
              <el-switch v-if="isEditing(scope.row)" v-model="scope.row.export" size="small" />
              <el-tag v-else :type="scope.row.export ? 'success' : 'info'" size="small">{{ scope.row.export ? '是' : '否' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="扩展" width="90" align="center">
            <template #default="scope">
              <el-switch v-if="isEditing(scope.row)" v-model="scope.row.extend" size="small" />
              <el-tag v-else :type="scope.row.extend ? 'warning' : 'info'" size="small">{{ scope.row.extend ? '是' : '否' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="orderId" label="排序" width="100" align="right">
            <template #default="scope">
              <el-input-number v-if="isEditing(scope.row)" v-model="scope.row.orderId" :min="0" controls-position="right" size="small" style="width:80px;" />
              <span v-else>{{ scope.row.orderId ?? '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="说明" min-width="150" show-overflow-tooltip>
            <template #default="scope">
              <el-input v-if="isEditing(scope.row)" v-model="scope.row.remark" placeholder="字段说明" size="small" />
              <span v-else>{{ scope.row.remark }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right" align="center">
            <template #default="scope">
              <template v-if="isEditing(scope.row)">
                <el-button type="primary" size="small" link @click="saveHandle(scope.row)">保存</el-button>
                <el-button type="info" size="small" link @click="cancelHandle(scope.row)">取消</el-button>
              </template>
              <template v-else>
                <el-tooltip effect="dark" content="编辑" placement="top">
                  <el-icon class="table-handle-icon" @click="editHandle(scope.row)">
                    <EditPen />
                  </el-icon>
                </el-tooltip>
                <el-popconfirm title="确认删除该字段吗？" confirm-button-text="删除" cancel-button-text="取消" confirm-button-type="danger" @confirm="deleteHandle(scope.row)">
                  <template #reference>
                    <el-icon class="table-handle-icon margin-left-30px">
                      <Delete />
                    </el-icon>
                  </template>
                </el-popconfirm>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </el-drawer>
</template>

<script setup lang='ts'>
import { ref, reactive, computed, watch } from 'vue';
import { ElMessage, ElNotification } from 'element-plus';
import {
  SysConfigReportFieldListApi,
  SysConfigReportFieldAddApi,
  SysConfigReportFieldUpdateApi,
  SysConfigReportFieldDeleteApi,
  SysConfigReportFieldBatchDeleteApi
} from '@/api/modules/systemConfig';
import { ReportFieldModelList } from '@/models/systemModel';

const props = defineProps<{
  visible: boolean;
  reportName: string;
  reportTable: string;
  reportMode: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:visible', val: boolean): void;
  (e: 'reFetchTableData', val?: boolean): void;
}>();

const handleClose = () => {
  emit('update:visible', false);
};

watch(() => props.visible, (val) => {
  if (val && props.reportName) {
    fetchData();
  }
});

// ============ 数据 ============
interface FieldRow extends ReportFieldModelList {
  _rowKey: string;
  _isNew?: boolean;
}

const tableRef = ref();
const fieldList = ref<FieldRow[]>([]);
const editingSet = reactive<Set<string>>(new Set());
const snapshotMap = reactive<Map<string, FieldRow>>(new Map());

const selectedListKeys = ref<string[]>([]);
const isSelected = ref(false);

const widthSum = computed(() => {
  return fieldList.value.reduce((acc, row) => acc + (Number(row.width) || 0), 0);
});
const widthSumText = computed(() => widthSum.value.toFixed(4));
const widthSumClass = computed(() => {
  if (props.reportMode) {
    return Math.abs(widthSum.value - 100) > 0.001 ? 'text-danger' : 'text-success';
  }
  return 'text-primary';
});

const isExistingRow = (row: FieldRow) => !row._isNew;
const isEditing = (row: FieldRow) => editingSet.has(row._rowKey);
const takeSnapshot = (row: FieldRow) => { snapshotMap.set(row._rowKey, JSON.parse(JSON.stringify(row))); };
const popSnapshot = (row: FieldRow): FieldRow | undefined => {
  const s = snapshotMap.get(row._rowKey);
  snapshotMap.delete(row._rowKey);
  return s;
};

const fetchData = async () => {
  if (!props.reportName) return;
  editingSet.clear();
  snapshotMap.clear();
  try {
    const res = await SysConfigReportFieldListApi({ xtbb: props.reportName });
    const data = (res?.data as ReportFieldModelList[]) || [];
    fieldList.value = data.map((r) => ({ ...r, _rowKey: r.md5 }));
  } catch (e) {
    fieldList.value = [];
  }
};

const handleSelectionChange = (rows: FieldRow[]) => {
  isSelected.value = rows.length > 0;
  selectedListKeys.value = rows.filter((r) => !r._isNew).map((r) => r.md5);
};

// ============ 新增 / 编辑 / 保存 / 取消 ============
const addHandle = () => {
  const now = Date.now();
  const newRow: FieldRow = {
    id: 0,
    md5: '',
    field: '',
    nameZh: '',
    nameCh: '',
    xtbb: props.reportName,
    remark: '',
    width: 0,
    fixed: '',
    list: true,
    listType: '',
    export: true,
    exportType: '',
    null: true,
    idAuto: true,
    extend: false,
    filter: '',
    orderId: 0,
    _rowKey: `__new_${now}`,
    _isNew: true
  };
  fieldList.value.push(newRow);
  editingSet.add(newRow._rowKey);
};

const editHandle = (row: FieldRow) => {
  takeSnapshot(row);
  editingSet.add(row._rowKey);
};

const cancelHandle = (row: FieldRow) => {
  editingSet.delete(row._rowKey);
  if (row._isNew) {
    const idx = fieldList.value.findIndex((r) => r._rowKey === row._rowKey);
    if (idx !== -1) fieldList.value.splice(idx, 1);
  } else {
    const snap = popSnapshot(row);
    if (snap) Object.assign(row, snap);
  }
};

const validateRow = (row: FieldRow): string | null => {
  if (!row.field?.trim()) return '请输入数据库字段名称';
  if (!row.nameCh?.trim()) return '请输入中文名称';
  if (!row.nameZh?.trim()) return '请输入英文名称';
  return null;
};

const saveHandle = async (row: FieldRow) => {
  const err = validateRow(row);
  if (err) {
    ElMessage.warning(err);
    return;
  }
  const payload: any = {
    field: row.field,
    nameZh: row.nameZh,
    nameCh: row.nameCh,
    xtbb: row.xtbb,
    remark: row.remark,
    width: row.width,
    fixed: row.fixed,
    list: row.list,
    listType: row.listType,
    export: row.export,
    exportType: row.exportType,
    null: row.null,
    idAuto: row.idAuto,
    extend: row.extend,
    filter: row.filter,
    orderId: row.orderId
  };
  try {
    if (row._isNew) {
      await SysConfigReportFieldAddApi(payload);
      ElNotification({ title: '提示', message: '新增成功', type: 'success' });
    } else {
      await SysConfigReportFieldUpdateApi({ ...payload, md5: row.md5 });
      ElNotification({ title: '提示', message: '更新成功', type: 'success' });
    }
    editingSet.delete(row._rowKey);
    snapshotMap.delete(row._rowKey);
    fetchData();
  } catch (e) {}
};

// ============ 删除 ============
const deleteHandle = async (row: FieldRow) => {
  try {
    await SysConfigReportFieldDeleteApi({ md5: row.md5 });
    ElNotification({ title: '提示', message: '删除成功', type: 'success' });
    fetchData();
  } catch (e) {}
};

const batchDeleteHandle = async () => {
  if (!isSelected.value) {
    ElMessage.warning('请选择需要删除的数据');
    return;
  }
  try {
    await SysConfigReportFieldBatchDeleteApi({ md5: selectedListKeys.value });
    ElNotification({ title: '提示', message: '批量删除成功', type: 'success' });
    fetchData();
  } catch (e) {}
};
</script>

<style scoped>
.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
}
.drawer-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}
.drawer-title {
  font-size: 20px;
  font-weight: bold;
  margin-right: 12px;
}
.drawer-header-right {
  display: flex;
  align-items: center;
  gap: 4px;
}
.width-sum-label {
  color: #606266;
  font-size: 14px;
}
.width-sum-value {
  font-size: 18px;
  font-weight: bold;
}
.text-primary { color: #409eff; }
.text-success { color: #67c23a; }
.text-danger { color: #f56c6c; }
.margin-left-10px { margin-left: 10px; }
.drawer-container { height: 100%; }
.drawer-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  border-bottom: 1px solid #ebeef5;
  background: #fafafa;
}
.table-handle-icon {
  cursor: pointer;
  color: #606266;
  font-size: 16px;
  &:hover { color: #409eff; }
}
.margin-left-30px { margin-left: 30px; }
:deep(.el-table th.el-table__cell) {
  background-color: #ebeef5 !important;
  color: #303133;
  font-weight: 600;
}
</style>
