<template>
  <el-main class="guide-page">
    <!-- 顶部横幅 -->
    <section class="guide-hero">
      <div class="hero-main">
        <!--
        <div class="hero-badge">
          <el-icon><Compass /></el-icon>
          <span>系统向导</span>
        </div>
        -->
        <h1 class="hero-title">高效办公，从这里开始</h1>
        <p class="hero-desc">
          它是一款工具箱集合，旨在帮助你提升办公效率，让日常工作更轻松、更高效。如果你希望定制一款更贴合自身需求的工具，欢迎通过邮件或微信联系管理员，说明你的想法与使用场景；定制化的工具不仅能解决你的实际问题，也能惠及更多有相似需求的人。
        </p>
        <p class="hero-desc">
          感谢你的支持与信任，祝你每日生活愉快、工作顺心。
        </p>
        <div class="hero-actions">
          <el-button type="default" size="large" class="hero-btn" @click="goHome">
            <el-icon><HomeFilled /></el-icon>
            <span>返回首页</span>
          </el-button>
          <el-button size="large" class="hero-btn hero-btn-ghost" v-copy="developer.mail">
            <el-icon><Message /></el-icon>
            <span>联系管理员</span>
          </el-button>
        </div>
      </div>
      <div class="hero-stats">
        <div class="stat-card" v-for="item in stats" :key="item.label" :style="{ '--stat-color': item.color }">
          <span class="stat-value">{{ item.value }}</span>
          <span class="stat-label">{{ item.label }}</span>
        </div>
      </div>
    </section>

    <!-- 快速上手 -->
    <el-card shadow="never" class="guide-card accent-blue">
      <template #header>
        <div class="card-header">
          <div class="card-title">
            <el-icon><Promotion /></el-icon>
            <span>快速上手</span>
          </div>
          <span class="card-sub">四步开启高效办公</span>
        </div>
      </template>
      <div class="step-grid">
        <div class="step-item" v-for="(step, index) in steps" :key="step.title">
          <div class="step-index" :style="{ background: step.color }">{{ index + 1 }}</div>
          <div class="step-body">
            <h4>{{ step.title }}</h4>
            <p>{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 平台能力 -->
    <el-card shadow="never" class="guide-card accent-green">
      <template #header>
        <div class="card-header">
          <div class="card-title">
            <el-icon><Grid /></el-icon>
            <span>平台能力</span>
          </div>
          <span class="card-sub">开箱即用的办公工具集合</span>
        </div>
      </template>
      <div class="feature-grid">
        <div class="feature-item" v-for="feature in features" :key="feature.title">
          <div class="feature-icon" :style="{ color: feature.color, background: feature.bg }">
            <el-icon><component :is="feature.icon" /></el-icon>
          </div>
          <div class="feature-body">
            <h4>{{ feature.title }}</h4>
            <p>{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 技术栈 -->
    <el-card shadow="never" class="guide-card accent-purple">
      <template #header>
        <div class="card-header">
          <div class="card-title">
            <el-icon><Cpu /></el-icon>
            <span>技术栈</span>
          </div>
          <span class="card-sub">稳定、现代、可扩展的技术底座</span>
        </div>
      </template>
      <div class="stack-grid">
        <div class="stack-group" v-for="group in techStack" :key="group.name">
          <div class="stack-group-title">
            <span class="dot" :style="{ background: group.color }"></span>
            <span>{{ group.name }}</span>
          </div>
          <div class="stack-tags">
            <el-tag v-for="tag in group.tags" :key="tag" effect="plain" round>{{ tag }}</el-tag>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 依赖清单 -->
    <el-card shadow="never" class="guide-card accent-amber">
      <template #header>
        <div class="card-header">
          <div class="card-title">
            <el-icon><Box /></el-icon>
            <span>依赖清单</span>
          </div>
          <el-input
            v-model="keyword"
            class="dep-search"
            size="small"
            clearable
            placeholder="搜索依赖名称"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
      </template>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="生产环境依赖" name="dependencies" />
        <el-tab-pane label="开发环境依赖" name="devDependencies" />
      </el-tabs>
      <div v-if="depList.length" class="dep-grid">
        <div class="dep-item" v-for="[name, version] in depList" :key="name">
          <span class="dep-name">{{ name }}</span>
          <el-tag size="small" type="info" effect="plain">{{ version }}</el-tag>
        </div>
      </div>
      <el-empty v-else description="没有匹配的依赖" :image-size="80" />
    </el-card>

    <!-- 开发者信息 / 运行环境 -->
    <el-row :gutter="20" class="guide-row">
      <el-col :xs="24" :lg="12">
        <el-card shadow="never" class="guide-card guide-card-flat accent-cyan">
          <template #header>
            <div class="card-header">
              <div class="card-title">
                <el-icon><UserFilled /></el-icon>
                <span>开发者信息</span>
              </div>
              <el-tag type="success" effect="light">v{{ packageJson.version }}</el-tag>
            </div>
          </template>
          <div class="developer">
            <el-avatar :size="56" class="developer-avatar">
              <el-icon :size="28"><UserFilled /></el-icon>
            </el-avatar>
            <div class="developer-main">
              <h3>{{ developer.name }}</h3>
              <p>{{ developer.motto }}</p>
            </div>
          </div>
          <div class="contact-list">
            <div class="contact-item" v-for="item in contacts" :key="item.label">
              <div class="contact-icon" :style="{ color: item.color, background: item.bg }">
                <el-icon><component :is="item.icon" /></el-icon>
              </div>
              <div class="contact-body">
                <span class="contact-label">{{ item.label }}</span>
                <span class="contact-value">{{ item.value }}</span>
              </div>
              <el-button text type="primary" size="small" v-copy="item.value">复制</el-button>
            </div>
          </div>
          <p class="developer-tip">
            如需定制专属工具，欢迎通过邮件或微信联系管理员，期待与你一起打磨更好的办公体验。
          </p>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="12">
        <el-card shadow="never" class="guide-card guide-card-flat accent-rose">
          <template #header>
            <div class="card-header">
              <div class="card-title">
                <el-icon><Monitor /></el-icon>
                <span>运行环境</span>
              </div>
              <span class="card-sub">当前会话信息</span>
            </div>
          </template>
          <el-descriptions :column="1" border>
            <el-descriptions-item v-for="item in envInfo" :key="item.label" :label="item.label">
              {{ item.value }}
            </el-descriptions-item>
          </el-descriptions>
          <p class="developer-tip">
            本系统前端基于 FC-Admin 脚手架开发，使用 Vue3、TypeScript、Vite、Pinia、Element-Plus 开源技术。
            如果增加系统个性化开发需求，请联系管理员。
          </p>
        </el-card>
      </el-col>
    </el-row>
  </el-main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import packageJson from '../../../../package.json';

const router = useRouter();

const developer = {
  name: '高明亮',
  mail: 'gaoming971366@163.com',
  phone: '13051355646（微信同步）',
  motto: '代码改变世界',
};

const stats = [
  { label: '当前版本', value: `v${packageJson.version}`, color: '#409eff' },
  { label: '生产依赖', value: Object.keys(packageJson.dependencies).length, color: '#10b981' },
  { label: '开发依赖', value: Object.keys(packageJson.devDependencies).length, color: '#f59e0b' },
  { label: '技术底座', value: 'Vue 3', color: '#8b5cf6' },
];

const steps = [
  { title: '登录系统', desc: '使用账号密码或手机号完成身份验证，进入管理后台。', color: '#409eff' },
  { title: '选择工具', desc: '通过左侧菜单进入系统工具、办公工具等功能模块。', color: '#10b981' },
  { title: '上传与处理', desc: '支持单个/批量上传文件，在线完成转换、压缩等处理。', color: '#f59e0b' },
  { title: '个性化设置', desc: '在个人中心维护资料、头像、密码与界面偏好。', color: '#8b5cf6' },
];

const features = [
  { icon: 'Tools', title: '工具箱集合', desc: '文档转换、图片处理、数据导出等常用办公工具随手可用。', color: '#409eff', bg: '#ecf5ff' },
  { icon: 'Files', title: '批量任务', desc: '批量上传与下载，实时反馈处理进度，失败项清晰可见。', color: '#10b981', bg: '#e8f8f2' },
  { icon: 'Lock', title: '权限控制', desc: '基于角色与按钮级权限校验，保障系统数据安全。', color: '#f43f5e', bg: '#fdeaee' },
  { icon: 'DataAnalysis', title: '数据看板', desc: 'Dashboard 汇总关键数据，帮助快速掌握业务概况。', color: '#8b5cf6', bg: '#f3eefe' },
];

const techStack = [
  { name: '核心框架', tags: ['Vue 3.4', 'TypeScript 5.4', 'Vite 5.2'], color: '#409eff' },
  { name: 'UI 与交互', tags: ['Element Plus 2.7', 'ECharts 5.5', 'WangEditor 5.1'], color: '#10b981' },
  { name: '状态与路由', tags: ['Pinia 2.1', 'Vue Router 4.3', 'Vue I18n 9.13'], color: '#f59e0b' },
  { name: '工具与工程', tags: ['Axios 1.6', 'Sass 1.77', 'XLSX 0.18', 'FileSaver 2.0'], color: '#8b5cf6' },
];

const contacts = [
  { label: '邮箱', value: developer.mail, icon: 'Message', color: '#409eff', bg: '#ecf5ff' },
  { label: '电话', value: developer.phone, icon: 'Iphone', color: '#10b981', bg: '#e8f8f2' },
  { label: '座右铭', value: developer.motto, icon: 'Star', color: '#f59e0b', bg: '#fdf6e3' },
];

const activeTab = ref<string>('dependencies');
const keyword = ref('');

const depMap: Record<string, Record<string, string>> = {
  dependencies: packageJson.dependencies,
  devDependencies: packageJson.devDependencies,
};

const depList = computed(() => {
  const key = keyword.value.trim().toLowerCase();
  return Object.entries(depMap[activeTab.value] || {})
    .filter(([name]) => name.toLowerCase().includes(key))
    .sort(([a], [b]) => a.localeCompare(b));
});

const envInfo = computed(() => {
  const ua = navigator.userAgent;
  let browser = '未知浏览器';
  if (/Edg\//.test(ua)) browser = 'Microsoft Edge';
  else if (/Chrome\//.test(ua)) browser = 'Google Chrome';
  else if (/Firefox\//.test(ua)) browser = 'Mozilla Firefox';
  else if (/Safari\//.test(ua)) browser = 'Safari';

  return [
    { label: '系统版本', value: `v${packageJson.version}` },
    { label: '技术底座', value: 'Vue 3 + TypeScript + Vite' },
    { label: '当前浏览器', value: browser },
    { label: '屏幕分辨率', value: `${window.screen.width} × ${window.screen.height}` },
  ];
});

const goHome = () => {
  router.push('/dashboard');
};
</script>

<style scoped>
.guide-page {
  display: flex;
  flex-direction: column;
}

/* ---------------- 顶部横幅 ---------------- */
.guide-hero {
  position: relative;
  display: flex;
  justify-content: space-between;
  gap: 32px;
  padding: 36px 32px;
  border-radius: 14px;
  overflow: hidden;
  color: #fff;
  background: linear-gradient(120deg, #4f46e5 0%, #7c3aed 45%, #06b6d4 100%);
  box-shadow: 0 10px 30px rgba(79, 70, 229, 0.25);
}

.guide-hero::after {
  content: '';
  position: absolute;
  right: -80px;
  top: -100px;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  pointer-events: none;
}

.hero-main {
  position: relative;
  z-index: 1;
  flex: 1 1 auto;
  min-width: 0;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  letter-spacing: 0.5px;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.28);
}

.hero-title {
  margin: 16px 0 12px;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.3;
}

.hero-desc {
  margin: 0;
  /* max-width: 1960px; */
  font-size: 15px;
  line-height: 1.8;
  opacity: 0.92;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
}

.hero-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: none;
  color: var(--el-color-primary);
  background: #fff;
}

.hero-btn:hover {
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}

.hero-btn-ghost {
  color: #fff;
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.45);
}

.hero-btn-ghost:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.26);
}

.hero-stats {
  position: relative;
  z-index: 1;
  flex: none;
  display: grid;
  grid-template-columns: repeat(2, minmax(120px, 1fr));
  gap: 12px;
  align-content: center;
  width: 300px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px 18px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.65);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
}

.stat-value {
  font-size: 25px;
  font-weight: 700;
  line-height: 1.2;
  color: var(--stat-color, var(--el-color-primary));
}

.stat-label {
  font-size: 15px;
  color: var(--el-text-color-secondary);
}

/* ---------------- 通用卡片 ---------------- */
.accent-blue {
  --accent: #409eff;
  --accent-bg: #ecf5ff;
}

.accent-green {
  --accent: #10b981;
  --accent-bg: #e8f8f2;
}

.accent-amber {
  --accent: #f59e0b;
  --accent-bg: #fdf6e3;
}

.accent-purple {
  --accent: #8b5cf6;
  --accent-bg: #f3eefe;
}

.accent-cyan {
  --accent: #06b6d4;
  --accent-bg: #e6f8fb;
}

.accent-rose {
  --accent: #f43f5e;
  --accent-bg: #fdeaee;
}

.guide-card {
  margin-top: 20px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 12px;
}

.guide-card-flat {
  margin-top: 0;
  height: 100%;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 17px;
  font-weight: 600;
}

.card-title .el-icon {
  color: var(--accent, var(--el-color-primary));
  font-size: 18px;
}

.card-sub {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

/* ---------------- 快速上手 ---------------- */
.step-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.step-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-radius: 10px;
  background: var(--el-fill-color-lighter);
  border: 1px solid var(--el-border-color-lighter);
}

.step-index {
  flex: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, var(--el-color-primary), var(--el-color-primary-light-3));
}

.step-body h4 {
  margin: 2px 0 6px;
  font-size: 15px;
  font-weight: 600;
}

.step-body p {
  margin: 0;
  font-size: 14px;
  line-height: 1.7;
  color: var(--el-text-color-secondary);
}

/* ---------------- 平台能力 ---------------- */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 16px;
}

.feature-item {
  display: flex;
  gap: 14px;
  padding: 18px;
  border-radius: 10px;
  border: 1px solid var(--el-border-color-lighter);
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
}

.feature-item:hover {
  border-color: var(--el-color-primary-light-5);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  transform: translateY(-2px);
}

.feature-icon {
  flex: none;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}

.feature-body h4 {
  margin: 2px 0 6px;
  font-size: 15px;
  font-weight: 600;
}

.feature-body p {
  margin: 0;
  font-size: 14px;
  line-height: 1.7;
  color: var(--el-text-color-secondary);
}

/* ---------------- 技术栈 ---------------- */
.stack-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.stack-group {
  padding: 16px;
  border-radius: 10px;
  background: var(--el-fill-color-lighter);
  border: 1px solid var(--el-border-color-lighter);
}

.stack-group-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 15px;
  font-weight: 600;
}

.stack-group-title .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--el-color-primary);
}

.stack-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* ---------------- 依赖清单 ---------------- */
.dep-search {
  width: 200px;
}

.dep-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 10px;
  margin-top: 4px;
}

.dep-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 13px;
  background: var(--el-fill-color-lighter);
  border: 1px solid var(--el-border-color-lighter);
  transition: border-color 0.2s;
}

.dep-item:hover {
  border-color: var(--el-color-primary-light-5);
}

.dep-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: Menlo, Consolas, monospace;
  color: var(--el-text-color-regular);
}

/* ---------------- 开发者 / 环境 ---------------- */
.guide-row {
  margin-top: 20px;
}

.developer {
  display: flex;
  align-items: center;
  gap: 14px;
  padding-bottom: 16px;
  border-bottom: 1px dashed var(--el-border-color-lighter);
}

.developer-avatar {
  color: var(--accent, var(--el-color-primary));
  background: var(--accent-bg, var(--el-color-primary-light-9));
}

.developer-main h3 {
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 600;
}

.developer-main p {
  margin: 0;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.contact-list {
  margin-top: 4px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px dashed var(--el-border-color-lighter);
}

.contact-item:last-child {
  border-bottom: none;
}

.contact-icon {
  flex: none;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}

.contact-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.contact-label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.contact-value {
  font-size: 13px;
  word-break: break-all;
}

.developer-tip {
  margin: 16px 0 0;
  padding: 12px 14px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.8;
  color: var(--el-text-color-secondary);
  background: var(--el-fill-color-lighter);
}

/* ---------------- 响应式 ---------------- */
@media (max-width: 992px) {
  .guide-hero {
    flex-direction: column;
    padding: 28px 24px;
  }

  .hero-title {
    font-size: 24px;
  }

  .hero-stats {
    grid-template-columns: repeat(2, 1fr);
    width: 100%;
  }

  .dep-search {
    width: 140px;
  }

  .guide-card-flat {
    margin-top: 0;
  }

  .el-col-lg-12 + .el-col-lg-12 .guide-card-flat {
    margin-top: 20px;
  }
}
</style>
