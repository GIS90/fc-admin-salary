<template>
  <el-drawer :model-value="props.visible"
             :size="dwField.size"
             :modal="dwField.modal"
             :direction="dwField.direction"
             :lock-scroll="dwField.lockScroll"
             :show-close="dwField.showClose"
             :close-on-click-modal="dwField.closeOnClickModal"
             :close-on-press-escape="dwField.closeOnPressEscape"
             :open-delay="dwField.openDelay"
             :with-header="dwField.withHeader"
             :destroy-on-close="dwField.destroyOnClose"
             @open="openDrawer"
             @close="closeDrawer">
    <el-container>
      <!--header-->
      <el-header class="d-header">
        <div class="left-panel">
          <h2>编辑</h2>
        </div>
        <div class="right-panel">
          <el-button type="primary" @click="confirm(ruleFormRef)" :disabled="btnDisabled">确 定</el-button>
          <el-button icon="Close" circle @click="closeDrawer" :disabled="btnDisabled"/>
        </div>
      </el-header>
      <!--main-->
      <el-main class="nopadding" v-loading="btnLoading">
        <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules"
                 :label-position="formField.labelPosition" :label-width="formField.labelWidth"
                 :size="formField.size" style="width: 100%" >
          <el-row :gutter="40" class="main-box">
            <!--基础信息-->
            <el-col :lg="12">
              <h3 class="main-box-title">基础信息</h3>
              <el-form-item label="菜单ID" prop="id">
                <el-input v-model.trim="ruleForm.id" disabled :size="inputField.size"/>
                <div class="el-form-item-msg">菜单唯一标识，系统不允许修改</div>
              </el-form-item>
              <el-form-item label="名称" prop="name">
                <el-input v-model.trim="ruleForm.name"
                          :size="inputField.size"
                          :show-word-limit="inputField.showWordLimit"
                          :clearable="inputField.clearable"
                          :prefix-icon="inputField.prefixIcon"
                          :maxlength="ProfileLen.name"
                          :placeholder="ProfilePlace.name"
                          :disabled="btnDisabled"
                />
                <div class="el-form-item-msg">系统唯一且与内置组件名一致，否则导致缓存失效，采用全英文名称，大驼峰命名方式[注：需要与父节点连接映射]，例如SystemMainMenu</div>
              </el-form-item>
              <el-form-item label="显示标题" prop="title">
                <el-input v-model.trim="ruleForm.title"
                          :size="inputField.size"
                          :show-word-limit="inputField.showWordLimit"
                          :clearable="inputField.clearable"
                          :prefix-icon="inputField.prefixIcon"
                          :maxlength="ProfileLen.title"
                          :placeholder="ProfilePlace.title"
                          :disabled="btnDisabled"
                />
              </el-form-item>
              <el-form-item label="上级菜单" prop="pid">
                <el-select v-model="ruleForm.pid" style="width: 100%;" :size="selectSingleField.size" :clearable="selectSingleField.clearable"
                           :filterable="selectSingleField.filterable" :allow-create="selectSingleField.allowCreate"
                           :no-match-text="selectSingleField.noMatchText" :no-data-text="selectSingleField.noDataText"
                           :placeholder="ProfilePlace.pid" :disabled="btnDisabled">
                  <el-option-group v-for="group in menuOption" :key="group.label" :label="group.label">
                    <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value">
                      <span class="el-select-key">{{ item.label }}</span>
                      <span class="el-select-value">{{ item.name }}</span>
                    </el-option>
                  </el-option-group>
                </el-select>
              </el-form-item>
              <el-form-item label="级别" prop="level">
                <el-select v-model="ruleForm.level" style="width: 100%;" :size="selectSingleField.size" :clearable="selectSingleField.clearable"
                           :filterable="selectSingleField.filterable" :allow-create="selectSingleField.allowCreate"
                           :no-match-text="selectSingleField.noMatchText" :no-data-text="selectSingleField.noDataText"
                           :placeholder="ProfilePlace.level" :disabled="btnDisabled">
                  <el-option v-for="item in menuLevel" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled"/>
                </el-select>
              </el-form-item>
              <el-form-item label="类型" prop="type">
                <el-radio-group v-model="ruleForm.type">
                  <el-radio-button v-for="item in menuType" :label="item.label" :value="item.value" :disabled="item.disabled"/>
                </el-radio-group>
                <div class="el-form-item-msg" v-show="ruleForm.type === 'MENU'">功能菜单，用于菜单分类、展示功能等</div>
                <div class="el-form-item-msg" v-show="ruleForm.type === 'LINK'">外链接菜单，需要配置外链接地址到路由地址，示例：https://www.baidu.com</div>
                <div class="el-form-item-msg" v-show="ruleForm.type === 'BUTTON'">暂不支持</div>
              </el-form-item>
              <el-form-item label="路由地址" prop="path">
                <el-input v-model.trim="ruleForm.path"
                          :size="inputField.size"
                          :show-word-limit="inputField.showWordLimit"
                          :clearable="inputField.clearable"
                          :prefix-icon="inputField.prefixIcon"
                          :maxlength="ProfileLen.path"
                          :placeholder="ProfilePlace.path"
                          :disabled="btnDisabled"
                />
                <div class="el-form-item-msg" v-if="ruleForm.type === 'LINK'">链接类型菜单，需要配置外链接地址到路由地址，示例：https://www.baidu.com</div>
                <div class="el-form-item-msg" v-else>配置的菜单路由地址，以/开头，示例：/system/main/menu</div>
              </el-form-item>
              <el-form-item label="重定向" prop="redirect">
                <el-input v-model.trim="ruleForm.redirect"
                          :size="inputField.size"
                          :show-word-limit="inputField.showWordLimit"
                          :clearable="inputField.clearable"
                          :prefix-icon="inputField.prefixIcon"
                          :maxlength="ProfileLen.redirect"
                          :placeholder="ProfilePlace.redirect"
                          :disabled="btnDisabled"
                >
                  <template #prepend>views/</template>
                </el-input>
                <div class="el-form-item-msg">菜单重定向地址，示例：/system/main/menu</div>
              </el-form-item>
              <el-form-item label="菜单图标" prop="icon">
                <fc-icon-select v-model="ruleForm.icon" clearable />
              </el-form-item>
              <el-form-item label="排序编号" prop="order_id">
                <el-input-number v-model="ruleForm.order_id"
                                 style="width: 100%;"
                                 :min="inputNumberField.min"
                                 :max="inputNumberField.max"
                                 :step="inputNumberField.step"
                                 :step-strictly="inputNumberField.stepStrictly"
                                 :precision="inputNumberField.precision"
                                 :size="inputNumberField.size"
                                 :controls="inputNumberField.controls"
                                 :controls-position="inputNumberField.controlsPosition"
                                 />
              </el-form-item>
            </el-col>
            <!--属性配置-->
            <el-col :lg="12" class="vertical-line">
              <h3 class="main-box-title">属性配置</h3>
              <el-form-item label="组件路径" prop="component">
                <el-input v-model.trim="ruleForm.component"
                          :size="inputField.size"
                          :show-word-limit="inputField.showWordLimit"
                          :clearable="inputField.clearable"
                          :prefix-icon="inputField.prefixIcon"
                          :maxlength="ProfileLen.component"
                          :placeholder="ProfilePlace.component"
                          :disabled="btnDisabled"
                />
              </el-form-item>
              <el-form-item label="页面缓存" prop="isKeepAlive">
                <el-switch v-model="ruleForm.isKeepAlive" />
                <div class="el-form-item-msg">缓存后每次切换标签页，页面内容不会重新加载</div>
              </el-form-item>
              <el-form-item label="导航隐藏" prop="isHide">
                <el-switch v-model="ruleForm.isHide" />
                <div class="el-form-item-msg">菜单不显示在导航中，但用户依然可以访问</div>
              </el-form-item>
              <el-form-item label="标签固定" prop="isAffix">
                <el-switch v-model="ruleForm.isAffix" />
                <div class="el-form-item-msg">固定到标签栏，不允许在标签栏中进行关闭</div>
              </el-form-item>
              <el-form-item label="全屏显示" prop="isFull">
                <el-switch v-model="ruleForm.isFull" />
                <div class="el-form-item-msg">全屏显示，开启后标签页不会显示页脚</div>
              </el-form-item>
              <el-form-item label="面包屑" prop="isBreadcrumb">
                <el-switch v-model="ruleForm.isBreadcrumb" disabled />
                <div class="el-form-item-msg">是否在面包屑菜单中进行显示，默认开启，不允许调整</div>
              </el-form-item>
              <el-form-item label="标签" prop="tag">
                <el-input v-model.trim="ruleForm.tag"
                          :size="inputField.size"
                          :show-word-limit="inputField.showWordLimit"
                          :clearable="inputField.clearable"
                          :prefix-icon="inputField.prefixIcon"
                          :maxlength="ProfileLen.tag"
                          :placeholder="ProfilePlace.tag"
                          :disabled="btnDisabled"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-main>
    </el-container>
  </el-drawer>
</template>

<script setup lang='ts'>
import { defineEmits, defineProps, reactive, ref } from "vue";
import { drawerField, formField, inputField, selectSingleField, inputNumberField } from "@/utils/attrs/field";
import { SysMainMenuApi, SysMainMenuUpdateApi } from "@/api/modules/systemMain";
import {ElNotification, FormInstance, FormRules} from "element-plus";
import {GroupOptionEnumModel, OptionEnumModel, OptionExtendEnumModel} from "@/models/X";
import publicLength from "@/utils/attrs/length";
import publicPlaceHolder from "@/utils/attrs/place";

// 数据组件属性值
const ProfileLen = publicLength.systemMenuModel;
const ProfilePlace = publicPlaceHolder.systemMenuModel;

// Drawer属性
const dwConfigField = reactive({
  title: '编辑',
  size: '95%'
});
const dwField = {...drawerField, ...dwConfigField};

const emit = defineEmits(['update:visible', 'reFetchTableData']);
const btnDisabled = ref(false); // 禁用
const btnLoading = ref(false); // 加载中
const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
    default: false
  },
  md5: {
    type: String,
    required: true,
    default: ''
  }
});

// 响应式数据
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({}) as Menu.MenuFlat;
const menuOption = ref<GroupOptionEnumModel[]>([]);
const menuType = ref<OptionExtendEnumModel[]>([]);
const menuLevel = ref<OptionEnumModel[]>([]);
const rules = reactive<FormRules<Menu.MenuFlat>>({
  title: [
    { required: true, message: "显示标题不允许为空", trigger: 'blur' },
    { min: 1, max: ProfileLen.title, message: '最大长度支持'+ProfileLen.title+'位', trigger: 'blur' },
  ],
  pid: [
    { required: true, message: "上级菜单不允许为空", trigger: 'change' },
  ],
  name: [
    { required: true, message: "菜单名称不允许为空", trigger: 'blur' },
    { min: 1, max: ProfileLen.name, message: '最大长度支持'+ProfileLen.name+'位', trigger: 'blur' },
  ],
  path: [
    { required: true, message: "路由地址不允许为空", trigger: 'blur' },
    { min: 1, max: ProfileLen.path, message: '最大长度支持'+ProfileLen.path+'位', trigger: 'blur' },
  ],
  level: [
    { required: true, message: "菜单级别不允许为空", trigger: 'change' },
  ],
  component: [
    { required: true, message: "组件路径不允许为空", trigger: 'blur' },
    { min: 1, max: ProfileLen.component, message: '最大长度支持'+ProfileLen.component+'位', trigger: 'blur' },
  ],
});


// 打开
function openDrawer() {
  // 重置验证
  ruleFormRef.value?.clearValidate();
  // 请求数据
  fetchApiData(props.md5);
};

// 关闭
function closeDrawer() {
  emit('update:visible', false);
};

// 请求数据API
const fetchApiData = async (md5: string) => {
  const response = await SysMainMenuApi({ md5 });
  if (response.data) {
    const res = response.data as {
      menu: Menu.MenuFlat,
      menuOption: GroupOptionEnumModel[],
      menuType: OptionExtendEnumModel[]
      menuLevel: OptionEnumModel[]
    }; // declare
    Object.assign(ruleForm, res.menu);
    menuOption.value = res.menuOption as GroupOptionEnumModel[];
    menuType.value = res.menuType as OptionExtendEnumModel[];
    menuLevel.value = res.menuLevel as OptionEnumModel[];
  }
};

// 确定
const confirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      btnDisabled.value = true;
      btnLoading.value = true;

      SysMainMenuUpdateApi(ruleForm).then(() => {
        ElNotification({
          title: '提示',
          message: '编辑成功',
          type: 'success'
        });
        closeDrawer();
        emit('reFetchTableData', true);
      }).finally(() => {
        btnDisabled.value = false;
        btnLoading.value = false;
      })
    }
  })
};
</script>

<style lang="scss" scoped>
.d-header {
  padding-bottom: 15px;
  height: auto;
}

.main-box {
  width: 100%;

  .main-box-title {
    margin: 15px 0 15px 0;
  }
  .vertical-line {
    border-left: 1px solid #eee;
  }
}
</style>
