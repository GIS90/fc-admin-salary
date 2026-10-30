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
          <el-tag v-if="reportTable" type="primary" size="large" effect="plain">报表名称：{{ reportName }}</el-tag>
          <el-tag v-if="reportTable" type="danger" size="large" effect="plain">数据库表名：{{ reportTable }}</el-tag>
        </div>
        <div class="drawer-header-right">
          <span class="width-sum-label">宽度之和：</span>
          <span class="width-sum-value text-primary">{{ widthSumText }} px</span>
        </div>
      </div>
    </template>

    <el-container class="drawer-container">
      <el-header class="drawer-toolbar">
        <div class="left-panel">
          <el-button type="primary" icon="Plus" @click="addHandle">新增字段</el-button>
          <el-button type="danger" icon="Delete" :plain="true" :disabled="!isSelected" @click="batchDeleteHandle">批量删除</el-button>
          <el-button type="success" icon="CircleCheck" @click="checkHandle">字段校验</el-button>
          <el-popover placement="bottom" width="650" trigger="hover">
            <template #default>
              <div style="line-height: 2.5; color: black;">
                （1）<span style="color: #f56c6c;">新增、编辑、删除</span>只支持单条数据操作，请勿新增/编辑多个报表字段，点击保存时，只会保存当前操作数据。
                <br />
                （2）必填字段：带<span style="color: red;"> * </span>字段（数据库字段、中文名称、英文名称）为必填。
                <br />
                （3）宽度模式：固定宽度（无论屏幕宽度多大，始终保持设定宽度不变）；最小宽度（根据凭证宽度自动调整，但不得小于设定的最小宽度）。
                <br />
                （4）当宽度设置为0时，该列将不采用固定宽度，而是根据内容自动调整，实现自适应宽度效果。
                <br />
                （5）ID自增字段默认只对id字段生效，其他字段不生效。
                <br />
                （6）字段筛选支持类型：input、select、radio、daterange、boolean、number，其他字段不支持筛选，格式为：{"type":"input","placeholder":"请输入查询条件"}。
              </div>
            </template>
            <template #reference>
              <el-button id="btn-popover" type="info" icon="Reading">操作说明</el-button>
            </template>
          </el-popover>
          <el-divider direction="vertical" />
          <span class="template-label">模板字段：</span>
          <el-button v-for="tpl in fieldTemplates" :key="tpl.field" size="small" type="primary" plain
                     :disabled="isFieldExists(tpl.field)" :title="tpl.remark" @click="addTemplateHandle(tpl)">
            {{ tpl.field }}
          </el-button>
        </div>
        <div class="right-panel">
          <el-button icon="Refresh" circle @click="fetchData" />
        </div>
      </el-header>

      <el-main class="nopadding">
        <el-table ref="tableRef" :data="fieldList" border stripe row-key="_rowKey" height="calc(100vh - 200px)" @selection-change="handleSelectionChange">
          <el-table-column type="selection" min-width="60" align="center" :selectable="row => !isEditing(row)" />
          <el-table-column type="index" label="序号" width="100" align="center" />
          <el-table-column prop="field" min-width="150" align="center">
            <template #header>
              <span style="color: red;">* </span>数据库字段
            </template>
            <template #default="scope">
              <el-input v-if="isEditing(scope.row)" v-model="scope.row.field" placeholder="字段名" size="small" />
              <span v-else>{{ scope.row.field }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="nameCh" min-width="150" align="center">
            <template #header>
              <span style="color: red;">* </span>中文名称
            </template>
            <template #default="scope">
              <el-input v-if="isEditing(scope.row)" v-model="scope.row.nameCh" placeholder="中文名" size="small" />
              <span v-else>{{ scope.row.nameCh }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="nameZh" min-width="150" align="center">
            <template #header>
              <span style="color: red;">* </span>英文名称
            </template>
            <template #default="scope">
              <el-input v-if="isEditing(scope.row)" v-model="scope.row.nameZh" placeholder="英文名" size="small" />
              <span v-else>{{ scope.row.nameZh }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="mode" label="宽度模式" min-width="130" align="center">
            <template #default="scope">
              <el-switch v-if="isEditing(scope.row)" v-model="scope.row.mode" size="small" active-text="最小" inactive-text="固定" />
              <el-tag v-else :type="scope.row.mode ? 'warning' : 'primary'" size="small">{{ scope.row.mode ? '最小宽度' : '固定宽度' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="width" label="宽度" min-width="140" align="center">
            <template #default="scope">
              <el-input-number v-if="isEditing(scope.row)" v-model="scope.row.width" :min="0" :precision="2" :step="1" controls-position="right" size="small" style="width:110px;" />
              <span v-else>{{ scope.row.width }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="align" label="对齐方式" min-width="130" align="center">
             <template #default="scope">
              <el-select v-if="isEditing(scope.row)" v-model="scope.row.align" placeholder="对齐方式" clearable size="small" style="width:100px;">
                <el-option v-for="op in fieldAlignOptions" :key="op.value" :label="op.label" :value="op.value" />
              </el-select>
              <span v-else>{{ fieldAlignOptions.find(o => o.value === scope.row.align)?.label || scope.row.align || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="fixed" label="锁定" min-width="130" align="center">
            <template #default="scope">
              <el-select v-if="isEditing(scope.row)" v-model="scope.row.fixed" placeholder="锁定" clearable size="small" style="width:100px;">
                <el-option v-for="op in fieldFixedOptions" :key="op.value" :label="op.label" :value="op.value" />
              </el-select>
              <span v-else>{{ fieldFixedOptions.find(o => o.value === scope.row.fixed)?.label || scope.row.fixed || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="列表" min-width="100" align="center">
            <template #default="scope">
              <el-switch v-if="isEditing(scope.row)" v-model="scope.row.list" size="small" />
              <el-tag v-else :type="scope.row.list ? 'success' : 'info'" size="small">{{ scope.row.list ? '是' : '否' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="列表类型" min-width="140" align="center">
            <template #default="scope">
              <el-select v-if="isEditing(scope.row)" v-model="scope.row.listType" placeholder="类型" clearable size="small" style="width:110px;">
                <el-option v-for="op in fieldTypeOptions" :key="op.value" :label="op.label" :value="op.value" />
              </el-select>
              <span v-else>{{ fieldTypeOptions.find(o => o.value === scope.row.listType)?.label || scope.row.listType || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="导出" min-width="100" align="center">
            <template #default="scope">
              <el-switch v-if="isEditing(scope.row)" v-model="scope.row.export" size="small" />
              <el-tag v-else :type="scope.row.export ? 'success' : 'info'" size="small">{{ scope.row.export ? '是' : '否' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="导出类型" min-width="140" align="center">
            <template #default="scope">
              <el-select v-if="isEditing(scope.row)" v-model="scope.row.exportType" placeholder="类型" clearable size="small" style="width:110px;">
                <el-option v-for="op in fieldTypeOptions" :key="op.value" :label="op.label" :value="op.value" />
              </el-select>
              <span v-else>{{ fieldTypeOptions.find(o => o.value === scope.row.exportType)?.label || scope.row.exportType || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="扩展" min-width="100" align="center">
            <template #default="scope">
              <el-switch v-if="isEditing(scope.row)" v-model="scope.row.extend" size="small" />
              <el-tag v-else :type="scope.row.extend ? 'warning' : 'info'" size="small">{{ scope.row.extend ? '是' : '否' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="允许空值" min-width="100" align="center">
            <template #default="scope">
              <el-switch v-if="isEditing(scope.row)" v-model="scope.row.null" size="small" />
              <el-tag v-else :type="scope.row.null ? 'success' : 'info'" size="small">{{ scope.row.null ? '是' : '否' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="ID自增" min-width="100" align="center">
            <template #default="scope">
              <el-switch v-if="isEditing(scope.row)" v-model="scope.row.idAuto" size="small" />
              <el-tag v-else :type="scope.row.idAuto ? 'success' : 'info'" size="small">{{ scope.row.idAuto ? '是' : '否' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="filter" label="字段筛选" min-width="200" show-overflow-tooltip align="left">
            <template #default="scope">
              <el-input v-if="isEditing(scope.row)" v-model="scope.row.filter" placeholder="筛选配置JSON" size="small" />
              <span v-else>{{ scope.row.filter || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="orderId" label="排序" min-width="100" align="center">
            <template #default="scope">
              <el-input-number v-if="isEditing(scope.row)" v-model="scope.row.orderId" :min="0" controls-position="right" size="small" style="width:80px;" />
              <span v-else>{{ scope.row.orderId ?? '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="说明" min-width="180" show-overflow-tooltip align="left">
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

    <FieldValidate v-model:visible="checkDialogVisible" :report-table="props.reportTable" :field-list="fieldList.map(r => r.field)" />
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
  SysConfigReportFieldBatchDeleteApi,
} from '@/api/modules/systemConfig';
import { ReportFieldModelList } from '@/models/systemModel';
import { DictEnumOptionsApi } from '@/api/modules/common';
import FieldValidate from './fieldValidate.vue';

const props = defineProps<{
  visible: boolean;
  reportName: string;
  reportTable: string;
}>();

const emit = defineEmits<{
  (e: 'update:visible', val: boolean): void;
  (e: 'reFetchTableData', val?: boolean): void;
}>();

const handleClose = () => {
  emit('update:visible', false);
};

interface DictOption { label: string; value: any }
const fieldFixedOptions = ref<DictOption[]>([]);
const fieldTypeOptions = ref<DictOption[]>([]);
const fieldAlignOptions = ref<DictOption[]>([]);

const fetchFieldTypeEnums = async () => {
  try {
    const response = await DictEnumOptionsApi({ names: ["xtbb-field-fixed", "xtbb-field-type", "xtbb-field-align"] });
    fieldFixedOptions.value = (response?.data?.xtbbFieldFixed as DictOption[]) || [];
    fieldTypeOptions.value = (response?.data?.xtbbFieldType as DictOption[]) || [];
    fieldAlignOptions.value = (response?.data?.xtbbFieldAlign as DictOption[]) || [];
  } catch (e) {}
};

watch(() => props.visible, (val) => {
  if (val && props.reportName) {
    fetchFieldTypeEnums();
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
const widthSumText = computed(() => widthSum.value.toFixed(2));

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
interface FieldTemplate {
  field: string;
  nameCh: string;
  nameZh: string;
  width: number;
  mode: boolean;
  align: string;
  fixed: string;
  list: boolean;
  listType: string;
  export: boolean;
  exportType: string;
  null: boolean;
  idAuto: boolean;
  remark: string;
  orderId: number;
  extend: boolean;
  filter: string;
}

// 常用字段模板（与后端 field_column_by_xtbb 的内置列保持一致）
const fieldTemplates: FieldTemplate[] = [
  { field: 'id', nameCh: '序号', nameZh: 'id', width: 100, mode: false, align: 'center', fixed: '', list: true, listType: 'integer', export: true, exportType: 'integer', null: false, idAuto: true, remark: '主键自增ID', orderId: 1, extend: false, filter: '' },
  { field: 'create_time', nameCh: '创建时间', nameZh: 'createTime', width: 0, mode: true, align: 'center', fixed: '', list: true, listType: 'datetime', export: true, exportType: 'datetime', null: true, idAuto: false, remark: '数据创建时间', orderId: 2, extend: false, filter: '{"type":"dateRange","placeholder":"请选择创建时间范围"}' },
  { field: 'create_rtx', nameCh: '创建人', nameZh: 'createRtx', width: 0, mode: true, align: 'center', fixed: '', list: true, listType: 'string', export: true, exportType: 'string', null: true, idAuto: false, remark: '数据创建人RTX-ID', orderId: 3, extend: false, filter: '{"type":"input","placeholder":"请输入创建人RTX-ID"}' },
  { field: 'order_id', nameCh: '排序编号', nameZh: 'orderId', width: 0, mode: true, align: 'center', fixed: '', list: true, listType: 'integer', export: true, exportType: 'integer', null: true, idAuto: false, remark: '排序字段，数值越小越靠前', orderId: 4, extend: false, filter: '{"type":"input","placeholder":"请输入排序编号"}' },
  { field: 'options', nameCh: '操作', nameZh: 'options', width: 200, mode: false, align: 'center', fixed: 'right', list: true, listType: '', export: false, exportType: '', null: true, idAuto: false, remark: '表格操作列', orderId: 5, extend: true, filter: '' },
  { field: 'status', nameCh: '状态管理', nameZh: 'status', width: 200, mode: false, align: 'center', fixed: 'right', list: true, listType: 'boolean', export: true, exportType: 'lock_text', null: true, idAuto: false, remark: '状态管理', orderId: 6, extend: false, filter: '{"type":"select","placeholder":"请选择状态","options":[{"label":"启用","value":false}, {"label": "禁用","value":true}]}' },
];

const isFieldExists = (field: string) => fieldList.value.some((r) => r.field === field);

const buildNewRow = (preset?: Partial<FieldRow>): FieldRow => {
  const now = Date.now();
  return {
    id: 0,
    md5: '',
    field: '',
    nameZh: '',
    nameCh: '',
    xtbb: props.reportName,
    remark: '',
    width: 0,
    mode: true,
    align: 'center',
    fixed: '',
    list: true,
    listType: '',
    export: true,
    exportType: '',
    null: true,
    idAuto: false,
    extend: false,
    filter: '',
    orderId: 0,
    _rowKey: `__new_${now}`,
    _isNew: true,
    ...preset
  };
};

const pushNewRow = (newRow: FieldRow) => {
  fieldList.value.push(newRow);
  editingSet.add(newRow._rowKey);
};

const addHandle = () => {
  pushNewRow(buildNewRow());
};

// 模板一键新增（已存在的字段直接拦截）
const addTemplateHandle = (tpl: FieldTemplate) => {
  if (isFieldExists(tpl.field)) {
    ElNotification({ title: '提示', message: `字段【${tpl.field}】已存在，无需重复新增`, type: 'warning' });
    return;
  }
  pushNewRow(buildNewRow({ ...tpl }));
  ElNotification({ title: '提示', message: `已按模板新增字段【${tpl.field}】，请调整后保存`, type: 'success' });
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
    mode: row.mode,
    align: row.align,
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

const checkDialogVisible = ref(false);
const checkHandle = () => {
  if (!props.reportTable) { ElMessage.warning('未指定数据库表名'); return; }
  const fields = fieldList.value.map(r => r.field).filter(Boolean);
  if (!fields.length) { ElMessage.warning('暂无字段可校验'); return; }
  checkDialogVisible.value = true;
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
.template-label {
  color: #4e4f52;
  font-size: 15px;
  margin-right: 5px;
}
:deep(.el-table th.el-table__cell) {
  background-color: #ebeef5 !important;
  color: #303133;
  font-weight: 600;
}
</style>
