<template>
    <el-main>
        <el-row :gutter="15">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-card shadow="hover" class="welcome">
                    <el-avatar size="large" :src="authStore.userInfo.avatar" :fit="'cover'"/>
                    <div class="tip-body">
                        <div class="tip-title">{{ getTipTitle() }}</div>
                    </div>
                </el-card>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6">
                <el-card shadow="never" class="vab-card vab-card-primary">
                    <fc-statistic title="总销量" value="123456.78" prefix="¥" groupSeparator style="color: white;">
                        <fc-trend v-model="trendValue1"></fc-trend>
                    </fc-statistic>
                </el-card>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6">
                <el-card shadow="never" class="vab-card">
                    <fc-statistic title="今日净利润" value="123456.78" prefix="¥" groupSeparator>
                        <fc-trend v-model="trendValue1"></fc-trend>
                    </fc-statistic>
                </el-card>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6">
                <el-card shadow="never" class="vab-card">
                    <fc-statistic title="总成交" value="456789.88" prefix="¥" groupSeparator>
                        <fc-trend v-model="trendValue1"></fc-trend>
                    </fc-statistic>
                </el-card>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6">
                <el-card shadow="never" class="vab-card">
                    <fc-statistic title="订单量" value="7890" suffix="单" groupSeparator>
                        <fc-trend v-model="trendValue2"></fc-trend>
                    </fc-statistic>
                </el-card>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                <el-card shadow="never" class="vab-card">
                    <template #header>
                        <div class="vab-card-header">
                            <el-icon>
                                <EditPen />
                            </el-icon>
                            <div>待处理</div>
                            <el-badge :value="12"></el-badge>
                        </div>
                    </template>
                    <template #default>
                        <div>处理信息1</div>
                        <div>处理信息2</div>
                        <div>处理信息3</div>
                        <div>处理信息4</div>
                    </template>
                </el-card>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                <el-card shadow="never" class="vab-card">
                    <template #header>
                        <div class="vab-card-header">
                            <el-icon>
                                <Message />
                            </el-icon>
                            <div>信息</div>
                        </div>
                        <el-tag type="success">当前版本：{{ packageJson.version }}。更新时间：2024-10-06</el-tag>
                    </template>
                    <template #default>
                        <el-descriptions border :column="3">
                            <el-descriptions-item label="vue">
                                {{ packageJson.dependencies.vue }}
                            </el-descriptions-item>
                            <el-descriptions-item label="element-plus">
                                {{ packageJson.dependencies['element-plus'] }}
                            </el-descriptions-item>
                            <el-descriptions-item label="pinia">
                                {{ packageJson.dependencies.pinia }}
                            </el-descriptions-item>
                            <el-descriptions-item label="vue-router">
                                {{ packageJson.dependencies['vue-router'] }}
                            </el-descriptions-item>
                            <el-descriptions-item label="axios">
                                {{ packageJson.dependencies.axios }}
                            </el-descriptions-item>
                            <el-descriptions-item label="vue-i18n">
                                {{ packageJson.dependencies['vue-i18n'] }}
                            </el-descriptions-item>
                        </el-descriptions>
                    </template>
                </el-card>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                <el-card shadow="never" class="vab-card">
                    <template #header>
                        <div class="vab-card-header">
                            <el-icon>
                                <DataLine />
                            </el-icon>
                            <div>分析概览</div>
                        </div>
                    </template>
                    <template #default>
                        <fc-echarts style="height: 300px;" :option="lineOption"></fc-echarts>
                    </template>
                </el-card>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                <el-card shadow="never" class="vab-card">
                    <template #header>
                        <div class="vab-card-header">
                            <el-icon>
                                <DataAnalysis />
                            </el-icon>
                            <div>数据统计</div>
                        </div>
                    </template>
                    <template #default>
                        <fc-echarts style="height: 300px;" :option="columnOption"></fc-echarts>
                    </template>
                </el-card>
            </el-col>
        </el-row>
    </el-main>

</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/modules/auth';
import packageJson from '../../../package.json'
import { ECOption } from '@/components/fcEcharts/config';
import { onMounted, ref } from 'vue';
import { AuthDashboardApi } from '@/api/modules/auth'

const authStore = useAuthStore()
const lineOption = ref<ECOption>({})
const columnOption = ref<ECOption>({})
const trendValue1 = ref(7.7)
const trendValue2 = ref(-6.7)
const tip = ref("")

onMounted(() => {
    getData()
})

const getData = async () => {
    let response = await AuthDashboardApi();
    lineOption.value = response.data.lineChart as ECOption
    columnOption.value = response.data.columnChart as ECOption

    // tip后台返回
    // const now = new Date();
    // const hour = now.getHours();
    //
    // if (hour >= 6 && hour < 12) {
    //   tip.value = '上午好，' + authStore.userInfo.userName + '。' + response.data.tip;
    // } else if (hour >= 12 && hour < 14) {
    //   tip.value = '中午好，' + authStore.userInfo.userName + '。' + response.data.tip;
    // } else if (hour >= 14 && hour < 18) {
    //   tip.value = '下午好，' + authStore.userInfo.userName + '。' + response.data.tip;
    // } else {
    //   tip.value = '晚上好，' + authStore.userInfo.userName + '。' + response.data.tip;
    // }
}

const getTipTitle = () => {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 6 && hour < 12) {
        return '上午好，' + authStore.userInfo.userName + '。希望您有一个元气满满的早晨，充满动力地开始新的一天，加油哦！';
    } else if (hour >= 12 && hour < 14) {
        return '中午好，' + authStore.userInfo.userName + '。忙碌了一上午，确实应该适当休息一下，记得按时吃午饭，补充能量才能更好地完成下午的工作！';
    } else if (hour >= 14 && hour < 18) {
        return '下午好，' + authStore.userInfo.userName + '。下午是继续推进各项任务的好时间，保持专注和效率，希望您能够保持良好的状态，顺利完成每一天的目标！';
    } else {
        return '晚上好，' + authStore.userInfo.userName + '。一天的努力即将结束，回顾今天的成就，为明天做好准备。别忘了放松一下自己，享受美好的夜晚时光，睡觉要有好梦。';
    }
}

</script>

<style scoped>
.welcome :deep(.el-card__body) {
    display: flex;
    flex-direction: row;
    align-items: center;
    background: var(--el-color-white) linear-gradient(120deg, var(--el-color-primary-light-9) 10%, var(--el-color-white)) no-repeat;
}

.welcome .tip-body {
    margin-left: 20px;
}

.welcome .tip-body .tip-title {
    font-weight: 700;
    font-size: 18px;
    line-height: 30px;
}

.welcome .tip-body .tip-desc {
    margin-top: 3px;
}

.welcome .tip-body .tip-desc a {
    color: var(--el-color-primary);
}

.vab-card :deep(.el-card__body) {
    display: flex;
    flex-direction: column;
    font-size: 14px;
}

.vab-card-primary {
    color: var(--el-color-white);
    background: linear-gradient(90deg, var(--el-color-primary-light-4), var(--el-color-primary));
}

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

.vab-card .vab-card-header .el-icon {
    margin-right: 5px;
    color: var(--el-color-primary);
}
</style>
