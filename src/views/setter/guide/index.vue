<template>
  <el-container>
    <el-header class="vab-card-header-title" height="550px;">
      <div>
        它是一款工具箱集合，希望可以帮助你提升办公效率，如果你想定制一款工具，可以发邮件或者微信给管理员，定制化的工具不仅可以帮助你，更可以帮助更多的人，祝你每日生活愉快。
      </div>
    </el-header>
    <el-main>
      <!--作者信息-->
      <el-card shadow="hover" class="vab-card">
        <template #header>
          <div class="vab-card-header">
            <div>开发者信息</div>
          </div>
          <el-tag type="success">当前版本：{{ packageJson.version }}</el-tag>
        </template>
        <template #default>
          <h3>
            系统前端基于FC-Admin脚手架开发，使用Vue3、TypeScript、Vite、Pinia、Element-Plus开源技术，如果增加系统个性化开发需求，请联系管理员。
          </h3>
          <el-descriptions :column="2" border class="margin-top-20px">
            <el-descriptions-item v-for="(item, index) in AdminInfos" :key="index" :label="item.key">
              {{ item.value }}
            </el-descriptions-item>
          </el-descriptions>
        </template>
      </el-card>

      <!--环境依赖-->
      <el-card shadow="hover" class="vab-card margin-top-20px">
        <template #header>
          <div class="vab-card-header">
            <div>平台前端项目依赖</div>
          </div>
        </template>
        <template #default>
          <h3>生产环境依赖</h3>
          <el-descriptions :column="3" border class="margin-top-20px">
            <el-descriptions-item v-for="(value, key) in packageJson.dependencies" :key="key" :label="key">
              <el-tag type="info">
                {{ value }}
              </el-tag>
            </el-descriptions-item>
          </el-descriptions>
          <h3 class="margin-top-20px">开发环境依赖</h3>
          <el-descriptions :column="3" border class="margin-top-20px">
            <el-descriptions-item v-for="(value, key) in packageJson.devDependencies" :key="key" :label="key">
              <el-tag type="info">
                {{ value }}
              </el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </template>
      </el-card>

    </el-main>
  </el-container>
</template>

<script setup lang='ts'>
import packageJson from '../../../../package.json';
import { ref } from 'vue';

const AdminInfos = ref([
  {key: "作者", value: "高明亮"},
  {key: "邮箱", value: "gaoming971366@163.com"},
  {key: "电话", value: "13051355646（微信同步）"},
  {key: "座右铭", value: "代码改变世界"}
]);
</script>


<style scoped>
.vab-card :deep(.el-card__header) {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.vab-card .vab-card-header {
  display: flex;
  align-items: center;
}

.vab-card-header-title {
  background-color: #F5F7FA;
  font-size: 15px;
}

.margin-top-20px {
  margin-top: 20px;
}
</style>
