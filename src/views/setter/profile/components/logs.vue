<template>
    <el-card shadow="hover" header="操作历史">
        <fc-filter-table ref="fcTableRef" :tableName="apiName" :requestApi="fetchTableData" :columns="columns" :showDownloadBtn="showDownloadBtn">
            <template #method="scope">
                <el-tag :type="methodTagType(scope.row.method)" effect="dark">{{ scope.row.method }}</el-tag>
            </template>
        </fc-filter-table>
    </el-card>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { SetProfileLogApi } from "@/api/modules/setter";
import { ColumnProps, FcFilterTableInstance } from "@/components/fcFilterTable/model";
import { LogModelList } from "@/models/systemModel";
import { methodTagType } from "@/utils/utils";

// fc-filter-table 实例
const fcTableRef = ref<FcFilterTableInstance>();
const apiName = "setterProfileLog"; // 组件标识名称
const showDownloadBtn=ref(false); // 禁用下载按钮

// 表格配置项
const columns = reactive<ColumnProps<LogModelList>[]>([
  { prop: "id", label: "序号", width: 80, sortable: true },
  { prop: "ip", label: "IP来源", sortable: true, filter: {"type":"input","placeholder":"请输入查询条件"} },
  { prop: "method", label: "请求方式", sortable: true, filter: {"type":"input","placeholder":"请输入查询条件"} },
  { prop: "url", label: "请求路径", sortable: true, filter: {"type":"input","placeholder":"请输入查询条件"} },
  { prop: "cost", label: "耗时（单位：s）", sortable: true, filter: {"type":"input","placeholder":"请输入查询条件"} },
  { prop: "createTime", label: "请求时间", sortable: true, filter: {"type":"input","placeholder":"请输入查询条件"} }
]);

// 表格数据
const fetchTableData = async (params: any) => {
  return await SetProfileLogApi(params);
};
</script>
