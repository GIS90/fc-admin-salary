<!--<template>-->
<!--  <el-container>-->
<!--    &lt;!&ndash;操作区&ndash;&gt;-->
<!--    <el-header style="border: none !important;">-->
<!--      <div class="left-panel">-->
<!--        <el-button id="btn-search" class="table-handle-button" :type="buttonField.type" :plain="buttonField.plain" :size="buttonField.size" :icon="searchIcon" @click="switchSearch">-->
<!--          {{ searchBtnText }}-->
<!--        </el-button>-->
<!--        <el-button id="btn-batch-delete" type="danger" icon="Delete" plain @click="batchDeleteHandle" :disabled="!fcTableRef?.isSelected">-->
<!--          批量删除-->
<!--        </el-button>-->
<!--      </div>-->
<!--    </el-header>-->

<!--    &lt;!&ndash;数据区&ndash;&gt;-->
<!--    <el-main class="nopadding">-->
<!--      &lt;!&ndash;Search查询条件&ndash;&gt;-->
<!--      <transition name="t-filter">-->
<!--        <div v-if="filterVisible" class="table-search">-->
<!--          <Filter :api-option="apiOption" :user-option="userOption" @search="search"  />-->
<!--        </div>-->
<!--      </transition>-->

<!--      &lt;!&ndash;Table区&ndash;&gt;-->
<!--      <fc-table ref="fcTableRef" :tableName="apiName" :requestApi="fetchTableData" :initParam="requestParam" :columns="columns"-->
<!--                :rowKey="ftField.rowKey" :stripe="ftField.stripe" :border="ftField.border" :pagination="ftField.pagination"-->
<!--                :showBottomView="ftField.showBottomView" :showRefreshBtn="ftField.showRefreshBtn"-->
<!--                :showColumnBtn="ftField.showColumnBtn" :showDownloadBtn="ftField.showDownloadBtn">-->
<!--        &lt;!&ndash; 表格操作 &ndash;&gt;-->
<!--        <template #method="scope">-->
<!--          <el-tag :type="scope.row.tag" effect="dark">{{ scope.row.method }}</el-tag>-->
<!--        </template>-->
<!--        <template #options="scope">-->
<!--          <el-tooltip effect="dark" content="详情" placement="top">-->
<!--            <el-icon class="table-handle-icon" @click="viewHandle(scope.row)">-->
<!--              <View />-->
<!--            </el-icon>-->
<!--          </el-tooltip>-->
<!--          <el-popconfirm :title="pcField.title" :confirm-button-text="pcField.confirmText" :cancel-button-text="pcField.cancelText"-->
<!--                         :confirm-button-type="pcField.confirmType" :cancel-button-type="pcField.cancelType"-->
<!--                         :icon="pcField.icon" :icon-color="pcField.iconColor" :width="pcField.width"-->
<!--                         @confirm="deleteHandle(scope.row.md5)">-->
<!--            <template #reference>-->
<!--              <el-icon class="table-handle-icon margin-left-25px">-->
<!--                <Delete />-->
<!--              </el-icon>-->
<!--            </template>-->
<!--          </el-popconfirm>-->
<!--        </template>-->
<!--      </fc-table>-->
<!--    </el-main>-->

<!--    &lt;!&ndash;详情&ndash;&gt;-->
<!--    <Detail v-model:visible="viewVisible" :md5="tableRowMd5" />-->

<!--    &lt;!&ndash;批量删除&ndash;&gt;-->
<!--    <fc-batch-delete v-model:visible="batchDeleteVisible" :api="apiName" :md5List="tableSelectList" @reFetchTableData="reFetchTableData"/>-->
<!--  </el-container>-->
<!--</template>-->

<!--<script setup lang='ts'>-->
<!--import { ref, reactive, watch, onMounted } from 'vue';-->
<!--import {SysOpsLogListApi, SysOpsLogDeleteApi, SysOpsLogFilterApi} from '@/api/modules/systemOps';-->
<!--import { ColumnProps, FcTableInstance } from "@/components/fcTable/model";-->
<!--import { LogModelList} from "@/models/systemModel";-->
<!--import { ElMessage, ElNotification } from 'element-plus';-->
<!--import { fcTableField, PopConfirmField, buttonField } from "@/utils/attrs/field";-->
<!--import { OptionEnumModelList } from "@/models/X";-->
<!--import Detail from "./components/view.vue";-->
<!--import Filter from "./components/filter.vue";-->


<!--// fc-table属性-->
<!--const fcTableConfig = reactive({-->
<!--  rowKey: "md5",-->
<!--  border: false,-->
<!--});-->
<!--const ftField = {...fcTableField, ...fcTableConfig};-->
<!--const pcField = {...PopConfirmField, ...{}};-->

<!--// fc-Table 实例-->
<!--const fcTableRef = ref<FcTableInstance>();-->

<!--const columns = reactive<ColumnProps<LogModelList>[]>([-->
<!--  { prop: "", width: 80, type: "selection" },-->
<!--  { prop: "id", label: "序号", width: 80 },-->
<!--  { prop: "create_time", label: "请求时间" },-->
<!--  { prop: "rtx_id", label: "系统用户"},-->
<!--  { prop: "ip", label: "IP来源" },-->
<!--  { prop: "path", label: "请求路径" },-->
<!--  { prop: "method", label: "请求方式" },-->
<!--  { prop: "cost", label: "花销时间(单位：s)" },-->
<!--  { prop: "options", label: "操作", width: 130, fixed: "right" }-->
<!--]);-->

<!--// Dialog状态管理-->
<!--const viewVisible = ref(false);-->
<!--const filterVisible = ref(false);-->
<!--const batchDeleteVisible = ref(false);-->

<!--const tableRowMd5 = ref(""); // 默认当前选择的数据MD5-->
<!--const apiName = "SystemOpsLog"; // 组件标识名称-->
<!--let tableSelectList = reactive([] as string[]); // 当前选择数据Keys列表-->
<!--const requestParam = reactive({"content": {}});  // 条件查询内容-->
<!--const searchIcon = ref("SwitchButton"); // 查询按钮图标-->
<!--const searchBtnText = ref("展开查询"); // 查询按钮文本-->
<!--const apiOption = ref<OptionEnumModelList>([]);-->
<!--const userOption = ref<OptionEnumModelList>([]);-->


<!--onMounted(async () => {-->
<!--  const response = await SysOpsLogFilterApi();-->
<!--  if (response.code ===100) {-->
<!--    const res = response.data as { api: OptionEnumModelList, user: OptionEnumModelList };-->
<!--    apiOption.value = res.api;-->
<!--    userOption.value = res.user;-->
<!--  }-->
<!--});-->

<!--// 表格数据-->
<!--const fetchTableData = async (params: any) => {-->
<!--  let formatParams = JSON.parse(JSON.stringify(params));-->
<!--  return await SysOpsLogListApi(formatParams);-->
<!--};-->

<!--// 重新获取表格数据 + 清空选择数据-->
<!--const reFetchTableData = (isReload: boolean = false) => {-->
<!--  if (isReload) {-->
<!--    fcTableRef.value?.clearSelection(); // 清除表格选择数据-->
<!--    fcTableRef.value?.getTableList(); // 重新获取表格数据-->
<!--  }-->
<!--};-->

<!--// 编辑-->
<!--const viewHandle = (row: LogModelList) => {-->
<!--  tableRowMd5.value = row.md5;-->
<!--  viewVisible.value = true;-->
<!--};-->

<!--// 单条删除-->
<!--const deleteHandle = (md5: string) => {-->
<!--  SysOpsLogDeleteApi({ md5 }).then(() => {-->
<!--    ElNotification({-->
<!--      title: '提示',-->
<!--      message: '删除成功',-->
<!--      type: 'success'-->
<!--    });-->
<!--    reFetchTableData(true);-->
<!--  })-->
<!--};-->

<!--// 批量删除-->
<!--const batchDeleteHandle = () => {-->
<!--  // 无选择数据-->
<!--  if (!fcTableRef.value?.isSelected) {-->
<!--    ElMessage.warning("请选择需要删除的数据");-->
<!--    return;-->
<!--  }-->

<!--  tableSelectList = fcTableRef.value?.selectedListKeys;-->
<!--  batchDeleteVisible.value = true;-->

<!--};-->

<!--// 全屏Text侦听器-->
<!--watch(filterVisible, (value) => {-->
<!--  searchIcon.value = value ? 'Filter' : 'SwitchButton';-->
<!--  searchBtnText.value = value ? '关闭查询' : '展开查询';-->
<!--}, { immediate: true });-->

<!--// 展开/关闭查询-->
<!--const switchSearch = () => {-->
<!--  filterVisible.value = !filterVisible.value;-->
<!--};-->

<!--const search = (params: any) => {-->
<!--  requestParam.content = params;-->
<!--  reFetchTableData(true);-->
<!--};-->
<!--</script>-->

<!--<style scoped>-->

<!--</style>-->
