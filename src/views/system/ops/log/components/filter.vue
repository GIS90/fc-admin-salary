<template>
  <el-form ref="ruleFormRef" :label-position="formField.labelPosition" :label-width="formField.labelWidth"
           :size="formField.size" style="width: 100%" >
    <el-row>
      <el-col :span="24">
        <el-form-item label="搜索内容">
          <el-input v-model.trim="content"
                    :size="inputField.size"
                    :show-word-limit="inputField.showWordLimit"
                    :clearable="inputField.clearable"
                    :prefix-icon="inputField.prefixIcon"
                    maxlength="55"
                    placeholder="搜索内容可在表单多个字段中进行查询，支持模糊查询"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="系统用户">
          <el-select v-model="user" style="width: 100%;" :size="selectMultiField.size" :clearable="selectMultiField.clearable"
                     :filterable="selectMultiField.filterable" :allow-create="selectMultiField.allowCreate"
                     :no-match-text="selectMultiField.noMatchText" :no-data-text="selectMultiField.noDataText"
                     :multiple="selectMultiField.multiple" :multiple-limit="selectMultiField.limit" :collapse-tags="selectMultiField.collapseTags"
                     :max-collapse-tags="selectMultiField.maxCollapseTags" :collapse-tags-tooltip="selectMultiField.collapseTagsTooltip"
                     placeholder="请选择系统用户，支持多选">
            <el-option v-for="item in userOption" :key="item.value" :label="item.label" :value="item.value">
              <span class="el-select-key">{{ item.label }}</span>
              <span class="el-select-value">{{ item.value }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="请求类型">
          <el-select v-model="api" style="width: 100%;" :size="selectMultiField.size" :clearable="selectMultiField.clearable"
                     :filterable="selectMultiField.filterable" :allow-create="selectMultiField.allowCreate"
                     :no-match-text="selectMultiField.noMatchText" :no-data-text="selectMultiField.noDataText"
                     :multiple="selectMultiField.multiple" :multiple-limit="selectMultiField.limit" :collapse-tags="selectMultiField.collapseTags"
                     :max-collapse-tags="selectMultiField.maxCollapseTags" :collapse-tags-tooltip="selectMultiField.collapseTagsTooltip"
                     placeholder="请选择请求API类型，支持多选">
            <el-option v-for="item in apiOption" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="请求日期">
          <el-date-picker v-model="dateRange" :type="dateRangePickerField.type" :size="dateRangePickerField.size" :format="dateRangePickerField.format"
              :value-format="dateRangePickerField.valueFormat" :editable="dateRangePickerField.editable" :clearable="dateRangePickerField.clearable"
              :range-separator="dateRangePickerField.rangeSeparator" :start-placeholder="dateRangePickerField.startPlaceholder" :end-placeholder="dateRangePickerField.endPlaceholder"
              :unlink-panels="dateRangePickerField.unlinkPanels" :shortcuts="dateRangePickerField.shortcuts"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item>
          <el-button id="btn-filter-search" class="table-handle-button" :type="buttonField.type" :plain="buttonField.plain" :size="buttonField.size" icon="Search" @click="submit">
            查询
          </el-button>
          <el-button id="btn-filter-reset" class="table-handle-button" type="danger" :plain="buttonField.plain" :size="buttonField.size" icon="RefreshRight" @click="reset">
            重置
          </el-button>
        </el-form-item>
      </el-col>
    </el-row>

  </el-form>
</template>

<script setup lang='ts'>
import { ref, defineProps, defineEmits } from "vue";
import { formField, selectMultiField, buttonField, inputField, dateRangePickerField } from "@/utils/attrs/field";
import { OptionEnumModelList } from "@/models/X";

defineProps({
  apiOption: {
    type: Array as () => OptionEnumModelList,
    required: true,
    default: []
  },
  userOption: {
    type: Array as () => OptionEnumModelList,
    required: true,
    default: []
  }
});
const emit = defineEmits(['search']);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const dateRange = ref(''); // 日志日期：[起始日期, 结束日期]
const content = ref(''); // 搜索内容
const api = ref([]); // API请求类型
const user = ref([]); // 系统用户
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const submit = () => {
  emit('search', {
    content: content.value,
    dateRange: dateRange.value,
    method: api.value,
    user: user.value
  });
};

const reset = () => {
  content.value = '';
  dateRange.value = '';
  api.value = [];
  user.value = [];
  emit('search', {});
};


</script>

<style scoped>

</style>
