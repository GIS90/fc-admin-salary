<template>
    <el-card shadow="hover" header="修改密码">
        <el-alert title="密码更新成功后，系统将被重定向到登录页面，您可以使用新密码重新登录。" type="warning" show-icon style="margin-bottom: 15px;" />
        <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="auto" style="margin-top:20px;">
            <el-form-item label="当前密码" prop="userPassword">
                <el-input v-model="ruleForm.userPassword" type="password" show-password
                          :placeholder="PasswordPlace.userPassword" :maxlength="PasswordLen.max"/>
              <div class="el-form-item-msg">必须提供当前登录用户密码才能进行更改，（最大长度支持{{PasswordLen.max}}位，当前长度<span style="color: red;">{{ruleForm.userPassword.length}}</span>位）</div>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
                <el-input v-model="ruleForm.newPassword" type="password" show-password
                          :placeholder="PasswordPlace.newPassword" :maxlength="PasswordLen.max" />
                <fc-password-strength v-model="ruleForm.newPassword" />
                <div class="el-form-item-msg">请输入包含英文、数字的8位以上密码，（最大长度支持{{PasswordLen.max}}位，当前长度<span style="color: red;">{{ruleForm.newPassword.length}}</span>位）</div>
            </el-form-item>
            <el-form-item label="确认新密码" prop="confirmNewPassword">
                <el-input v-model="ruleForm.confirmNewPassword" type="password" show-password
                          :placeholder="PasswordPlace.confirmNewPassword" :maxlength="PasswordLen.max" />
            </el-form-item>
            <el-form-item>
                <el-button class="submit-btn" type="primary" @click="save(ruleFormRef)">保存密码</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessageBox, type FormInstance, FormRules } from 'element-plus';
import { ProfilePassword } from "@/models/setterModel";
import publicLength from "@/utils/attrs/length";
import publicPlaceHolder from "@/utils/attrs/place";
import { SetProfilePasswordApi } from "@/api/modules/setter";
import { useAuthStore } from "@/store/modules/auth";

const PasswordLen = publicLength.setterProfilePassword;
const PasswordPlace = publicPlaceHolder.setterProfilePassword;
const authStore = useAuthStore();
const router = useRouter();

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<ProfilePassword>({
  // userId: authStore.getUserInfoId,
  userPassword: "",
  newPassword: "",
  confirmNewPassword: "",
});

const rules = reactive<FormRules<ProfilePassword>>({
    userPassword: [
        { required: true, message: "当前密码不允许为空", trigger: 'blur' }
    ],
    newPassword: [
        { required: true, message: "新密码不允许为空", trigger: 'blur' },
        { min: PasswordLen.min, message: '最小长度至少'+PasswordLen.min+'位', trigger: 'blur' },
        { max: PasswordLen.max, message: '最大长度支持'+PasswordLen.max+'位', trigger: 'blur' }
    ],
    confirmNewPassword: [
        { required: true, message: "确认密码不允许为空", trigger: 'blur' },
        { min: PasswordLen.min, message: '最小长度至少'+PasswordLen.min+'位', trigger: 'blur' },
        {
            validator: (_rule, value, callback) => {
                if (value !== ruleForm.newPassword) {
                    callback(new Error('两次输入密码不一致'));
                } else {
                    callback();
                }
            }
        },
        { max: PasswordLen.max, message: '最大长度支持'+PasswordLen.max+'位', trigger: 'blur' }
    ]
})

const save = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (!valid) return
    SetProfilePasswordApi(ruleForm).then(res => {
      if (res?.code === 100) {
        ElMessageBox.confirm('密码修改成功，是否跳转至登录页使用新密码登录', '修改成功', {
          type: 'success'
        }).then(() => {
          // 清空store
          authStore.reset();
          // 跳转
          router.replace({ path: '/login' });
        }).catch(() => {
          ElMessageBox.close();
        })
      }
    })
  })
}
</script>

<style scoped>
.submit-btn {
  margin: 10px auto 0 auto;
}
</style>
