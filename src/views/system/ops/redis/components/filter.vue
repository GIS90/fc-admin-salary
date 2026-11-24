<template>
  <el-form label-position="top" size="default" style="width: 100%">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="关键字">
          <el-input v-model.trim="content" :size="inputField.size" :clearable="inputField.clearable"
                    :prefix-icon="inputField.prefixIcon" maxlength="55" placeholder="规则名称/键匹配内容/说明" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="Redis配置">
          <el-select v-model="configMd5" style="width: 100%;" :size="selectSingleField.size" :clearable="selectSingleField.clearable"
                     :filterable="selectSingleField.filterable" placeholder="请选择Redis连接配置">
            <el-option v-for="item in configOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="匹配方式">
          <el-select v-model="matchValue" style="width: 100%;" :size="selectSingleField.size" :clearable="selectSingleField.clearable"
                     placeholder="请选择匹配方式">
            <el-option v-for="item in matchOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="状态">
          <el-select v-model="lock" style="width: 100%;" :size="selectSingleField.size" clearable placeholder="全部状态">
            <el-option label="启用" :value="false" />
            <el-option label="停用" :value="true" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="操作">
          <el-button id="btn-redis-filter-search" class="table-handle-button" :type="buttonField.type" :plain="buttonField.plain"
                     :size="buttonField.size" icon="Search" @click="submit">查询</el-button>
          <el-button id="btn-redis-filter-reset" class="table-handle-button" type="danger" :plain="buttonField.plain"
                     :size="buttonField.size" icon="RefreshRight" @click="reset">重置</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { OptionEnumModelList } from "@/models/X";
import { selectSingleField, inputField, buttonField } from "@/utils/attrs/field";

defineProps({
  configOption: { type: Array as () => OptionEnumModelList, default: () => [] },
  matchOption: { type: Array as () => OptionEnumModelList, default: () => [] }
});
const emit = defineEmits(['search']);

const content = ref('');
const configMd5 = ref('');
const matchValue = ref('');
const lock = ref<boolean | ''>('');

const submit = () => {
  emit('search', {
    content: content.value,
    redisMd5: configMd5.value,
    match: matchValue.value,
    lock: lock.value
  });
};

const reset = () => {
  content.value = '';
  configMd5.value = '';
  matchValue.value = '';
  lock.value = '';
  emit('search', {});
};
</script>

<style scoped>
</style>
