<template>
    <div>
        <el-card shadow="hover" header="个人信息">
            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules"
                     :label-position="formField.labelPosition" :label-width="formField.labelWidth"
                     :size="formField.size" style="width: 100%" >
                <el-form-item label="账号" prop="userId">
                    <el-input v-model.trim="ruleForm.userId" disabled :size="inputField.size"/>
                    <div class="el-form-item-msg">账号信息用于登录，系统不允许修改</div>
                </el-form-item>
                <el-form-item label="昵称" prop="userName">
                    <el-input v-model.trim="ruleForm.userName"
                              :size="inputField.size"
                              :show-word-limit="inputField.showWordLimit"
                              :clearable="inputField.clearable"
                              :prefix-icon="inputField.prefixIcon"
                              :maxlength="ProfileLen.userName"
                              :placeholder="ProfilePlace.userName"
                              :disabled="btnDisabled"
                    />
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-select v-model="ruleForm.sex" style="width: 100%;" :size="selectSingleField.size" :clearable="selectSingleField.clearable"
                               :filterable="selectSingleField.filterable" :allow-create="selectSingleField.allowCreate"
                               :no-match-text="selectSingleField.noMatchText" :no-data-text="selectSingleField.noDataText"
                               :placeholder="ProfilePlace.sex" :disabled="btnDisabled">
                        <el-option v-for="item in sexOption" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model.trim="ruleForm.email"
                            :size="inputField.size"
                            :show-word-limit="inputField.showWordLimit"
                            :clearable="inputField.clearable"
                            :prefix-icon="inputField.prefixIcon"
                            :maxlength="ProfileLen.email"
                            :placeholder="ProfilePlace.email"
                            :disabled="btnDisabled"
                  />
                </el-form-item>
                <el-form-item label="电话" prop="phone">
                  <el-input v-model.trim="ruleForm.phone"
                            :size="inputField.size"
                            :show-word-limit="inputField.showWordLimit"
                            :clearable="inputField.clearable"
                            :prefix-icon="inputField.prefixIcon"
                            :maxlength="ProfileLen.phone"
                            :placeholder="ProfilePlace.phone"
                            @input="handleStrictNumberInput"
                            :disabled="btnDisabled"
                  />
                </el-form-item>
                <el-form-item label="个性签名" prop="introduction">
                    <el-input v-model="ruleForm.introduction"
                              :type="textAreaField.type"
                              :size="textAreaField.size"
                              :show-word-limit="textAreaField.showWordLimit"
                              :clearable="textAreaField.clearable"
                              :autosize="textAreaField.autosize"
                              :maxlength="ProfileLen.introduction"
                              :placeholder="ProfilePlace.introduction"
                              :disabled="btnDisabled"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button :disabled="btnDisabled" :loading="btnLoading" class="submit-btn" type="primary" @click="save(ruleFormRef)">保存</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { FormInstance, FormRules } from 'element-plus';
import { reactive, ref, onMounted } from 'vue';
import { SetProfileApi, SetProfileUpdateApi } from "@/api/modules/setter";
import { useAuthStore } from "@/store/modules/auth";
import { ProfileModel } from "@/models/setterModel";
import { OptionEnumModel } from "@/models/X";
import { ElNotification } from 'element-plus';
import { inputField, textAreaField, selectSingleField, formField } from "@/utils/attrs/field";
import publicLength from "@/utils/attrs/length";
import publicPlaceHolder from "@/utils/attrs/place";

const authStore = useAuthStore();
const ProfileLen = publicLength.setterProfileModel;
const ProfilePlace = publicPlaceHolder.setterProfileModel;
const btnDisabled = ref(false); // 禁用
const btnLoading = ref(false); // 加载中

// fc-Table 实例
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  userId: "",
  userName: "",
  sex: "",
  email: "",
  phone: "",
  introduction: ""
}) as ProfileModel;

// 性别枚举
const sexOption = ref<OptionEnumModel[]>([]);
// from rule
const rules = reactive<FormRules<ProfileModel>>({
  userName: [
    { required: true, message: "用户昵称不允许为空", trigger: 'blur' },
    { min: 1, max: ProfileLen.userName, message: '最大长度支持'+ProfileLen.userName+'位', trigger: 'blur' },
  ],
  sex: [
    { required: true, message: "性别不允许为空", trigger: 'change' },
  ],
  email: [
    { required: true, message: "电子邮箱不允许为空", trigger: 'blur' },
    { min: 1, max: ProfileLen.email, message: '最大长度支持'+ProfileLen.email+'位', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: "电话不允许为空", trigger: 'blur' },
    { min: ProfileLen.phone, max: ProfileLen.phone, message: '请填写正确电话号码', trigger: 'blur' },
  ]
});

onMounted(() => {
  fetchApiData();
});

const fetchApiData = async () => {
  const res = await SetProfileApi();
  if (res.data) {
    Object.assign(ruleForm, res.data.user);
    sexOption.value = res.data.sexEnum as OptionEnumModel[];
  }
};

const save = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      btnDisabled.value = true;
      btnLoading.value = true;

      SetProfileUpdateApi(ruleForm).then(res => {
        if (res.code === 100) {
          // 更新authStore
          authStore.setUserInfoField("userName", ruleForm.userName);
          authStore.setUserInfoField("sex", ruleForm.sex);

          ElNotification({
            title: '提示',
            message: '更新成功',
            type: 'success'
          })
        }
      }).finally(() => {
        btnDisabled.value = false;
        btnLoading.value = false;
      })
    }
  })
};

const handleStrictNumberInput = (value: string) => {
  // 只保留数字字符
  ruleForm.phone = value.replace(/\D/g, '');
};

</script>

<style scoped>
.submit-btn {
  margin: 10px auto 0 auto;
}
</style>
