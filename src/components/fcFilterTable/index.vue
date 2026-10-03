<template>
    <div class="fc-filter-table-box" :style="{ 'height': _height }" ref="fcTableMain" v-loading="loading">
        <div class="fc-table" :style="{ 'height': _table_height }">
            <el-table ref="tableRef" v-bind="$attrs" :data="processTableData" :border="border" :row-key="rowKey"
                @selection-change="selectionChange" :header-cell-style="setTableHeaderStyle">
                <slot></slot>
                <template v-for="(item, colIndex) in tableColumns" :key="colIndex">
                    <el-table-column v-bind="item" :align="item.align ?? 'center'"
                        :reserve-selection="item.type == 'selection'" :selectable="selectable"
                        v-if="item.type && columnTypes.includes(item.type)">
                        <template #default="scope">
                            <template v-if="item.type == 'expand'">
                                <slot :name="item.type" v-bind="scope" />
                            </template>
                            <el-radio v-if="item.type == 'radio'" v-model="radio" :label="scope.row[rowKey]">
                                <i></i>
                            </el-radio>
                            <el-tag v-if="item.type == 'sort'" class="move">
                                <el-icon>
                                    <DCaret />
                                </el-icon>
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column v-bind="item" :align="item.align ?? 'center'"
                        :show-overflow-tooltip="tableField.sot"
                        v-if="!item.type && item.prop && !item.isHide">
                        <template #header="scope">
                            <slot v-if="$slots[item.prop + 'Header']" :name="item.prop + 'Header'" v-bind="scope" />
                            <template v-else>
                                <div class="filter-header-cell">
                                    <span>{{ scope.column.label }}</span>
                                    <el-popover v-if="item.filter" placement="bottom" :width="filterPopoverWidth(item.filter)"
                                        trigger="click" :hide-after="0">
                                        <template #reference>
                                            <el-icon class="filter-icon" :class="{ 'is-active': hasFilterValue(item.filter!, item.prop) }">
                                                <Filter />
                                            </el-icon>
                                        </template>
                                        <div class="filter-popover-content">
                                            <template v-if="item.filter.type === 'input'">
                                                <el-input
                                                    v-model="tempFilterParam[item.filter.field || item.prop]"
                                                    :placeholder="item.filter.placeholder || '请输入'"
                                                    clearable
                                                    size="small"
                                                    @clear="handleFilterClear(item.filter!, item.prop)" />
                                            </template>
                                            <template v-else-if="item.filter.type === 'select'">
                                                <el-select
                                                    v-model="tempFilterParam[item.filter.field || item.prop]"
                                                    :placeholder="item.filter.placeholder || '请选择'"
                                                    :multiple="item.filter.multiple"
                                                    clearable
                                                    size="small"
                                                    :teleported="false"
                                                    style="width: 100%;"
                                                    @clear="handleFilterClear(item.filter!, item.prop)">
                                                    <el-option
                                                        v-for="opt in item.filter.options"
                                                        :key="opt.value"
                                                        :label="opt.label"
                                                        :value="opt.value" />
                                                </el-select>
                                            </template>
                                            <template v-else-if="item.filter.type === 'radio'">
                                                <el-radio-group
                                                    v-model="tempFilterParam[item.filter.field || item.prop]"
                                                    size="small">
                                                    <el-radio
                                                        v-for="opt in item.filter.options"
                                                        :key="opt.value"
                                                        :value="opt.value">
                                                        {{ opt.label }}
                                                    </el-radio>
                                                </el-radio-group>
                                            </template>
                                            <template v-else-if="item.filter.type === 'daterange'">
                                                <el-date-picker
                                                    v-model="tempFilterParam[item.filter.field || item.prop]"
                                                    type="daterange"
                                                    range-separator="至"
                                                    start-placeholder="开始日期"
                                                    end-placeholder="结束日期"
                                                    :value-format="item.filter.valueFormat || 'YYYY-MM-DD'"
                                                    :shortcuts="item.filter.shortcuts"
                                                    :teleported="false"
                                                    size="small"
                                                    style="width: 100%;" />
                                            </template>
                                            <template v-else-if="item.filter.type === 'boolean'">
                                                <el-select
                                                    v-model="tempFilterParam[item.filter.field || item.prop]"
                                                    :placeholder="item.filter.placeholder || '请选择'"
                                                    clearable
                                                    :teleported="false"
                                                    size="small"
                                                    style="width: 100%;"
                                                    @clear="handleFilterClear(item.filter!, item.prop)">
                                                    <el-option label="是" :value="true" />
                                                    <el-option label="否" :value="false" />
                                                </el-select>
                                            </template>
                                            <template v-else-if="item.filter.type === 'number'">
                                                <div class="filter-number-range">
                                                    <el-input-number
                                                        v-model="tempFilterParam[item.filter!.field || item.prop]"
                                                        :placeholder="item.filter.placeholder || '请输入'"
                                                        :controls="false"
                                                        size="small"
                                                        style="width: 100%;" />
                                                </div>
                                            </template>
                                            <div class="filter-popover-actions">
                                                <el-button size="small" type="primary" @click="handleFilterChange">查询</el-button>
                                                <el-button size="small" @click="handleFilterClear(item.filter!, item.prop)">重置</el-button>
                                            </div>
                                        </div>
                                    </el-popover>
                                </div>
                            </template>
                        </template>
                        <template #default="scope">
                            <slot v-if="$slots[item.prop]" :name="item.prop" v-bind="scope" />
                        </template>
                    </el-table-column>
                </template>
                <template #append>
                    <slot name="append" />
                </template>
                <template #empty>
                    <el-empty :description="emptyText" :image-size="100"></el-empty>
                </template>
            </el-table>
        </div>
        <div :class="pagination || showColumnBtn || showRefreshBtn || showDownloadBtn ? 'fc-table-bottom' : ''">
            <div class="bottom-left">
                <el-popover v-if="showColumnBtn" placement="top-start" :width="600" trigger="click" :hide-after="0">
                    <template #reference>
                      <el-button v-if="showColumnBtn" icon="Operation" circle @click="" />
                    </template>
                    <div style="display: flex;flex-direction: row;justify-content: space-between;align-items: center;">
                        <div style="font-size: 16px;">列设置</div>
                        <el-button class="addBtn" type="primary" @click="resetColumn">重置</el-button>
                    </div>
                    <el-table :data="columnTableData" class-name="column-table" row-key="label">
                        <el-table-column v-slot="scope" align="center" label="" width="60">
                            <el-tag :class="scope.row.fixed ? '' : 'column-move'"
                                :type="scope.row.fixed ? 'info' : 'primary'">
                                <el-icon>
                                    <DCaret />
                                </el-icon>
                            </el-tag>
                        </el-table-column>
                        <el-table-column v-slot="scope" prop="isHide" align="center" label="隐藏">
                            <el-switch v-model="scope.row.isHide"></el-switch>
                        </el-table-column>
                        <el-table-column prop="label" align="center" label="列名" />
                        <el-table-column v-slot="scope" prop="width" align="center" label="宽度">
                            <el-input v-model="scope.row.width" placeholder="自动"></el-input>
                        </el-table-column>
                        <el-table-column v-slot="scope" prop="sortable" align="center" label="排序">
                            <el-switch v-model="scope.row.sortable"></el-switch>
                        </el-table-column>
                        <template #empty>
                            <el-empty description="暂无可配置的列" :image-size="100"></el-empty>
                        </template>
                    </el-table>
                </el-popover>
                <el-button v-if="showRefreshBtn" icon="Refresh" circle @click="getTableList"/>
                <el-button v-if="showDownloadBtn" icon="Download" circle @click="downTableList"/>
            </div>
            <slot name="toolButtons"></slot>
            <slot name="pagination">
                <div v-if="pagination">
                    <el-pagination background layout="total, sizes, prev, pager, next, jumper"
                        :current-page="pageable.page" :page-size="hasAnyFilter ? userPreferredPageSize : pageable.pageSize" :total="localTotal"
                        :page-sizes="pageSizes" @current-change="handleCurrentChange"
                        @size-change="handleSizeChange"></el-pagination>
                </div>
            </slot>
        </div>
    </div>

    <fc-batch-download v-model:visible="downloadVisible" :api="props.tableName" :md5List="selectedListKeys" />
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, computed } from 'vue';
import { ElTable } from "element-plus";
import { useTable, useSelection } from '@/components/fcTable/hooks';
import { ColumnProps, TypeProps, ColumnFilterProps } from "./model";
import Sortable from "sortablejs";
import { tablePageSizes, tablePageSize, tableEmptyText } from '@/utils/variable';
import { tableField } from "@/utils/attrs/field";
import { Filter } from '@element-plus/icons-vue';
import { SelfStorage } from '@/store/securels';

export interface FcFilterTableProps {
    tableName: string;
    columns: ColumnProps[];
    data?: any[];
    requestApi?: (params: any) => Promise<any>;
    initParam?: any;
    requestError?: (params: any) => void;
    dataCallback?: (data: any) => any;
    pagination?: boolean;
    pageSizes?: number[];
    height?: number;
    border?: boolean;
    rowKey?: string;
    emptyText?: string;
    showBottomView?: boolean;
    showRefreshBtn?: boolean;
    showColumnBtn?: boolean;
    showDownloadBtn?: boolean;
    selectable?: (row: any, index: number) => boolean;
};
const props = withDefaults(defineProps<FcFilterTableProps>(), {
    tableName: "fcFilterTable",
    initParam: {},
    pagination: true,
    border: false,
    pageSizes: () => tablePageSizes,
    rowKey: "id",
    emptyText: tableEmptyText,
    showBottomView: true,
    showRefreshBtn: true,
    showColumnBtn: true,
    showDownloadBtn: true,
});
const tableRef = ref<InstanceType<typeof ElTable>>();

const PAGE_SIZE_KEY = 'FC_FILTER_TABLE_PAGESIZE_' + props.tableName;
const userPreferredPageSize = ref<number>(SelfStorage.getItem(PAGE_SIZE_KEY) ?? tablePageSize);

const hasAnyFilter = computed(() => props.columns.some(c => !!(c as ColumnProps).filter));

const { tableData: hooksTableData, pageable, loading, getTableList } =
    useTable(props.requestApi, props.initParam, props.pagination, props.dataCallback, props.requestError);
const { selectionChange, selectedList, selectedListKeys, isSelected } = useSelection(props.rowKey);
const radio = ref("");
const tableColumns = ref<ColumnProps[]>(props.columns);
const columnTypes: TypeProps[] = ["selection", "radio", "index", "expand", "sort"];

const tempFilterParam = reactive<Record<string, any>>({});
const activeFilterParam = reactive<Record<string, any>>({});

const handleSizeChange = (val: number) => {
    pageable.value.page = 1;
    SelfStorage.setItem(PAGE_SIZE_KEY, val);
    if (hasAnyFilter.value) {
        userPreferredPageSize.value = val;
    } else {
        pageable.value.pageSize = val;
        getTableList();
    }
};
const handleCurrentChange = (val: number) => {
    pageable.value.page = val;
    if (!hasAnyFilter.value) {
        getTableList();
    }
};

onMounted(() => {
    dragSort();
    if (props.requestApi) {
        if (hasAnyFilter.value && props.pagination) {
            pageable.value.pageSize = tablePageSizes[tablePageSizes.length - 1];
        } else {
            pageable.value.pageSize = userPreferredPageSize.value;
        }
        getTableList()
    }
});

const setTableHeaderStyle = ({ column }: { column: { label: string } }) => {
  if (column.label === '操作') {
    return { background: '#dfebf7', color: '#000000' };
  } else if (column.label === '状态管理') {
    return { background: '#efe390', color: '#000000' };
  } else {
    return { background: '#eee', color: '#606266' };
  }
};

const dragSort = () => {
    const tbody = document.querySelector(".fc-filter-table-box .el-table__body-wrapper tbody") as HTMLElement;
    if (tbody) {
        Sortable.create(tbody, {
            handle: ".move",
            animation: 300,
            onEnd({ newIndex, oldIndex }) {
                const [removedItem] = processTableData.value.splice(oldIndex!, 1);
                processTableData.value.splice(newIndex!, 0, removedItem);
            }
        });
    }

    if (props.showColumnBtn) {
        const tbody1 = document.querySelector(".fc-filter-table-box .column-table .el-table__body-wrapper tbody") as HTMLElement;
        if (tbody1) {
            Sortable.create(tbody1, {
                handle: ".column-move",
                animation: 300,
                onEnd({ newIndex, oldIndex }) {
                    const [removedItem] = tableColumns.value.splice(oldIndex!, 1);
                    tableColumns.value.splice(newIndex!, 0, removedItem);
                }
            });
        }
    }
};

const sourceData = computed<any[]>(() => {
    if (props.data) return props.data;
    const val = hooksTableData.value;
    if (Array.isArray(val)) return val;
    return [];
});

const applyLocalFilter = (list: any[]) => {
    if (!list || list.length === 0) return list;
    const filterEntries = Object.entries(activeFilterParam).filter(([, v]) => {
        if (v === undefined || v === null || v === '') return false;
        if (Array.isArray(v) && v.length === 0) return false;
        return true;
    });
    if (filterEntries.length === 0) return list;

    return list.filter(row => {
        return filterEntries.every(([key, value]) => {
            const colDef = tableColumns.value.find(c => {
                const f = c as ColumnProps;
                return f.filter && (f.filter.field || f.prop) === key;
            });
            const propKey = colDef?.prop || key;
            const rowVal = row[propKey];
            if (rowVal === undefined || rowVal === null) return false;

            const filterType = (colDef?.filter?.type) || 'input';
            switch (filterType) {
                case 'input':
                    return String(rowVal).toLowerCase().includes(String(value).toLowerCase());
                case 'select':
                    if (Array.isArray(value)) return value.includes(rowVal);
                    return rowVal === value;
                case 'radio':
                    return rowVal === value;
                case 'boolean':
                    return Boolean(rowVal) === Boolean(value);
                case 'number':
                    return Number(rowVal) === Number(value);
                case 'daterange': {
                    const [start, end] = value as string[];
                    if (!start) return true;
                    const d = String(rowVal).slice(0, 10);
                    if (start && d < start) return false;
                    if (end && d > end) return false;
                    return true;
                }
                default:
                    return String(rowVal).includes(String(value));
            }
        });
    });
};

const filteredData = computed(() => applyLocalFilter(sourceData.value));
const localTotal = computed(() => filteredData.value.length);

const processTableData = computed(() => {
    if (!props.pagination) return filteredData.value;
    const pageSize = hasAnyFilter.value ? userPreferredPageSize.value : pageable.value.pageSize;
    const start = (pageable.value.page - 1) * pageSize;
    return filteredData.value.slice(start, start + pageSize);
});
const _height = computed(() => props.height ? props.height + 'px' : '100%');
const _table_height = computed(() =>
    !props.pagination && !props.showRefreshBtn && !props.showColumnBtn ? "100%" : "calc(100% - 56px)"
);

const columnTableData = computed(() => tableColumns.value.filter(item => !item.hasOwnProperty('type')));

const resetColumn = () => {
    tableColumns.value = JSON.parse(JSON.stringify(props.columns));
};
const clearSelection = () => {
    tableRef.value?.clearSelection();
};

const filterPopoverWidth = (filter: ColumnFilterProps) => {
    if (filter.type === 'daterange') return 300;
    return 200;
};

const hasFilterValue = (filter: ColumnFilterProps, prop?: string) => {
    const key = filter.field || prop || '';
    const val = activeFilterParam[key];
    if (val === undefined || val === null || val === '') return false;
    if (Array.isArray(val) && val.length === 0) return false;
    return true;
};

const handleFilterChange = () => {
    Object.keys(activeFilterParam).forEach(k => delete activeFilterParam[k]);
    Object.entries(tempFilterParam).forEach(([k, v]) => {
        activeFilterParam[k] = v;
    });
    pageable.value.page = 1;
};

const handleFilterClear = (filter: ColumnFilterProps, prop?: string) => {
    const key = filter.field || prop || '';
    if (filter.type === 'daterange') {
        tempFilterParam[key] = [];
        activeFilterParam[key] = [];
    } else {
        tempFilterParam[key] = null;
        activeFilterParam[key] = null;
    }
    pageable.value.page = 1;
};

const downloadVisible = ref(false);
const downTableList = () => {
    downloadVisible.value = true;
};

defineExpose({
    element: tableRef,
    tableData: processTableData,
    radio,
    pageable,
    localTotal,
    getTableList,
    isSelected,
    selectedList,
    selectedListKeys,
    activeFilterParam,
    handleSizeChange,
    handleCurrentChange,
    loading,
    clearSelection,
});
</script>

<style scoped lang="scss">
.fc-filter-table-box,
.fc-table {
    display: flex;
    flex: 1;
    flex-direction: column;
    width: 100%;
    height: 100%;

    .el-table {
        flex: 1;

        .el-table__header-wrapper,
        .el-table__body-wrapper {
            overflow-x: auto !important;
        }

        table {
            width: auto !important;
        }

        .el-table__header th {
            height: 45px;
            font-size: 15px;
            font-weight: bold;
            color: var(--el-text-color-primary);
            background: var(--el-fill-color-light);
        }

        .el-table__row {
            height: 45px;
            font-size: 14px;

            .move {
                cursor: move;
                .el-icon { cursor: move; }
            }
        }

        .el-table__header .el-table__cell>.cell {
            white-space: wrap;
        }

        .el-table__empty-block {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);

            .table-empty { line-height: 30px; }
        }

        .table-image {
            width: 50px;
            height: 50px;
            border-radius: 50%;
        }
    }

    .el-pagination {
        display: flex;
        justify-content: flex-end;
        margin: 12px 20px;
    }
}

.el-table--small {
    .el-table__header th { height: 40px !important; font-size: 14px !important; }
    .el-table__row { height: 40px !important; font-size: 13px !important; }
}

.el-table--large {
    .el-table__header th { height: 50px !important; font-size: 16px !important; }
    .el-table__row { height: 50px !important; font-size: 15px !important; }
}

.fc-table-bottom {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .bottom-left {
        margin-left: 20px;
        margin-right: 10px;
        height: 56px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
}

.filter-header-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    width: 100%;

    .filter-icon {
        font-size: 12px;
        color: #909399;
        cursor: pointer;
        transition: all 0.2s;
        width: 18px;
        height: 18px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 3px;
        background: #f0f2f5;

        &:hover {
            color: #fff;
            background: var(--el-color-primary);
        }

        &.is-active {
            color: #fff;
            background: var(--el-color-primary);
        }
    }
}

.filter-popover-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 4px 0;

    .filter-number-range {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .filter-popover-actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        padding-top: 8px;
        border-top: 1px solid #ebeef5;
    }
}
</style>
