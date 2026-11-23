<template>
  <div class="notify-message-page">
    <div class="page-glow glow-one"></div>
    <div class="page-glow glow-two"></div>

    <section class="hero-card">
      <div class="hero-content">
        <div class="status-badge">
          <span class="status-dot"></span>
          功能规划中
        </div>
        <h1>短信通知功能开发中</h1>
        <p class="hero-description">
          短信通知需要企业主体注册、实名认证、短信签名与模板报备，并涉及短信通道接入及费用预算申请。
          目前该功能尚未开放，敬请期待。
        </p>

        <div class="reason-list">
          <div class="reason-item">
            <div class="reason-icon icon-blue"><el-icon><OfficeBuilding /></el-icon></div>
            <div>
              <div class="reason-title">企业资质要求</div>
              <div class="reason-desc">需完成企业注册、实名认证及相关资质审核</div>
            </div>
          </div>
          <div class="reason-item">
            <div class="reason-icon icon-purple"><el-icon><Document /></el-icon></div>
            <div>
              <div class="reason-title">签名与模板报备</div>
              <div class="reason-desc">短信签名、通知模板需提交运营商审核</div>
            </div>
          </div>
          <div class="reason-item">
            <div class="reason-icon icon-orange"><el-icon><Wallet /></el-icon></div>
            <div>
              <div class="reason-title">通道与预算</div>
              <div class="reason-desc">需完成短信服务商接入及发送预算评估</div>
            </div>
          </div>
        </div>

        <div class="hero-actions">
          <el-button type="primary" icon="ArrowLeft" @click="goBack">返回上一页</el-button>
          <el-button icon="Promotion" @click="showNotice = true">查看替代方案</el-button>
        </div>
      </div>

      <div class="hero-visual">
        <div class="phone-shell">
          <div class="phone-notch"></div>
          <div class="phone-screen">
            <div class="phone-header">
              <el-icon><Message /></el-icon>
              <span>工资通知</span>
            </div>
            <div class="phone-bubble">
              <div class="bubble-title">工资发放提醒</div>
              <div class="bubble-line"></div>
              <div class="bubble-line short"></div>
              <div class="bubble-line medium"></div>
            </div>
            <div class="phone-footer">功能上线后，将在此展示短信通知效果</div>
          </div>
        </div>
        <div class="visual-badge badge-one"><el-icon><Lock /></el-icon> 安全合规</div>
        <div class="visual-badge badge-two"><el-icon><Timer /></el-icon> 即将上线</div>
      </div>
    </section>

    <section class="progress-card">
      <div class="section-header">
        <div>
          <div class="section-title">上线准备进度</div>
          <div class="section-subtitle">短信通知将在通道及合规流程完成后开放</div>
        </div>
        <el-tag type="warning" effect="light" size="large">当前阶段：资质准备</el-tag>
      </div>
      <el-steps :active="1" finish-status="success" align-center class="progress-steps">
        <el-step title="企业资质" description="企业注册与实名认证" icon="OfficeBuilding" />
        <el-step title="签名报备" description="短信签名与模板审核" icon="Document" />
        <el-step title="通道接入" description="短信服务商配置" icon="Connection" />
        <el-step title="功能开放" description="页面发布与使用" icon="Promotion" />
      </el-steps>
    </section>

    <el-dialog
        :model-value="showNotice"
        :width="dgField.width"
        :top="dgField.top"
        :modal="dgField.modal"
        :lock-scroll="dgField.lockScroll"
        :open-delay="dgField.openDelay"
        :close-delay="dgField.closeDelay"
        :close-on-click-modal="dgField.closeOnClickModal"
        :close-on-press-escape="dgField.closeOnPressEscape"
        :show-close="dgField.showClose"
        :draggable="dgField.draggable"
        :overflow="dgField.overflow"
        :center="dgField.center"
        :align-center="dgField.alignCenter"
        @close="closeDialog"
    >
      <template #header>
        <div class="my-dialog-header">
          <div class="my-dialog-header-title">当前可使用的通知方式</div>
          <div class="my-dialog-header-icon">
            <el-tooltip effect="dark" content="关闭" placement="top">
              <el-icon @click="closeDialog">
                <Close />
              </el-icon>
            </el-tooltip>
          </div>
        </div>
      </template>

      <div class="notice-list">
        <div v-for="item in alternatives" :key="item.path" class="notice-item" @click="goTo(item.path)">
          <el-icon class="notice-icon" :class="item.iconClass"><component :is="item.icon" /></el-icon>
          <div>
            <div class="notice-title">{{ item.title }}</div>
            <div class="notice-desc">{{ item.desc }}</div>
          </div>
          <el-icon class="notice-arrow"><ArrowRight /></el-icon>
        </div>
      </div>
      <template #footer>
        <div class="my-dialog-footer">
          <el-button type="primary" @click="closeDialog">我知道了</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ArrowRight, ChatLineSquare, Message } from "@element-plus/icons-vue";
import { dialogField } from "@/utils/attrs/field";

defineOptions({
  name: "SalaryNotifyMessage"
});

const router = useRouter();
const showNotice = ref(false);
const dgConfigField = {
  title: "当前可使用的通知方式",
  width: "620px",
  top: "10vh"
};
const dgField = { ...dialogField, ...dgConfigField };

const alternatives = [
  {
    title: "钉钉通知",
    desc: "通过钉钉机器人按员工发送工资明细消息",
    path: "/salary/notify/dtalk",
    icon: ChatLineSquare,
    iconClass: "icon-blue"
  },
  {
    title: "企业微信通知",
    desc: "通过企业微信应用消息推送工资明细",
    path: "/salary/notify/qywx",
    icon: Message,
    iconClass: "icon-green"
  },
  {
    title: "邮件通知",
    desc: "通过企业邮箱按员工发送工资邮件",
    path: "/salary/notify/email",
    icon: Message,
    iconClass: "icon-orange"
  }
];

const goTo = (path: string) => {
  showNotice.value = false;
  router.push(path);
};

const closeDialog = () => {
  showNotice.value = false;
};

const goBack = () => {
  router.back();
};
</script>

<style scoped lang="scss">
.notify-message-page {
  position: relative;
  min-height: calc(100vh - 110px);
  padding: 28px 32px 40px;
  overflow: hidden;
  background:
    radial-gradient(circle at 10% 8%, rgba(64, 158, 255, 0.12), transparent 34%),
    radial-gradient(circle at 88% 18%, rgba(151, 122, 255, 0.14), transparent 32%),
    linear-gradient(135deg, #f5f8ff 0%, #f8fafc 48%, #f6f7fb 100%);
}

.page-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(10px);
  pointer-events: none;
}

.glow-one {
  width: 240px;
  height: 240px;
  top: -90px;
  right: 12%;
  background: rgba(64, 158, 255, 0.14);
}

.glow-two {
  width: 180px;
  height: 180px;
  bottom: -70px;
  left: 8%;
  background: rgba(151, 122, 255, 0.12);
}

.hero-card,
.progress-card {
  position: relative;
  z-index: 1;
  max-width: 1180px;
  margin: 0 auto;
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 18px 48px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(12px);
}

.hero-card {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(320px, 0.75fr);
  gap: 36px;
  align-items: center;
  padding: 52px 58px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(245, 108, 108, 0.1);
  color: #d46b6b;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.4px;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #f56c6c;
  box-shadow: 0 0 0 4px rgba(245, 108, 108, 0.15);
}

h1 {
  margin: 20px 0 14px;
  color: #1f2937;
  font-size: 36px;
  line-height: 1.25;
  letter-spacing: -0.8px;
}

.hero-description {
  max-width: 640px;
  margin: 0;
  color: #64748b;
  font-size: 15px;
  line-height: 1.9;
}

.reason-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 30px;
}

.reason-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 16px;
  border: 1px solid #edf1f7;
  border-radius: 12px;
  background: #fbfcff;
}

.reason-icon {
  display: flex;
  flex: 0 0 36px;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  font-size: 17px;
}

.icon-blue {
  color: #2f7cf6;
  background: rgba(47, 124, 246, 0.12);
}

.icon-purple {
  color: #7c5cff;
  background: rgba(124, 92, 255, 0.12);
}

.icon-orange {
  color: #e8912d;
  background: rgba(232, 145, 45, 0.13);
}

.icon-green {
  color: #17a673;
  background: rgba(23, 166, 115, 0.13);
}

.reason-title {
  margin-bottom: 5px;
  color: #334155;
  font-size: 14px;
  font-weight: 600;
}

.reason-desc {
  color: #94a3b8;
  font-size: 12px;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 12px;
  margin-top: 32px;
}

.hero-visual {
  position: relative;
  display: flex;
  justify-content: center;
  min-height: 360px;
}

.phone-shell {
  position: relative;
  width: 220px;
  height: 380px;
  padding: 14px;
  border: 8px solid #1f2937;
  border-radius: 34px;
  background: #ffffff;
  box-shadow: 0 26px 60px rgba(15, 23, 42, 0.2);
}

.phone-notch {
  position: absolute;
  top: 0;
  left: 50%;
  width: 74px;
  height: 14px;
  transform: translateX(-50%);
  border-radius: 0 0 12px 12px;
  background: #1f2937;
}

.phone-screen {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 22px 14px 14px;
  border-radius: 22px;
  background: linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%);
}

.phone-header {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #475569;
  font-size: 13px;
  font-weight: 600;
}

.phone-bubble {
  margin-top: 28px;
  padding: 16px;
  border-radius: 14px 14px 14px 4px;
  background: #dbeafe;
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.12);
}

.bubble-title {
  margin-bottom: 12px;
  color: #1d4ed8;
  font-size: 13px;
  font-weight: 700;
}

.bubble-line {
  height: 7px;
  margin-bottom: 8px;
  border-radius: 4px;
  background: rgba(59, 130, 246, 0.2);
}

.bubble-line.short { width: 55%; }
.bubble-line.medium { width: 78%; margin-bottom: 0; }

.phone-footer {
  margin-top: auto;
  color: #94a3b8;
  font-size: 11px;
  line-height: 1.6;
  text-align: center;
}

.visual-badge {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.96);
  color: #475569;
  font-size: 12px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
}

.badge-one {
  top: 48px;
  left: 2px;
}

.badge-two {
  right: 0;
  bottom: 62px;
}

.progress-card {
  margin-top: 22px;
  padding: 26px 32px 34px;
}

.section-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 22px;
}

.section-title {
  color: #334155;
  font-size: 17px;
  font-weight: 700;
}

.section-subtitle {
  margin-top: 6px;
  color: #94a3b8;
  font-size: 13px;
}

.progress-steps {
  --el-color-primary: #3b82f6;
}

.my-dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.my-dialog-header-title {
  color: #1f2937;
  font-size: 16px;
  font-weight: 600;
}

.my-dialog-header-icon {
  display: flex;
  align-items: center;
  color: #64748b;
  font-size: 16px;

  .el-icon {
    cursor: pointer;

    &:hover {
      color: #3b82f6;
    }
  }
}

.notice-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 18px 20px;
}

.notice-item {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 12px 14px;
  border: 1px solid #edf1f7;
  border-radius: 10px;
  background: #fbfcff;
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease, transform 0.2s ease;

  &:hover {
    border-color: var(--el-color-primary-light-5);
    background: var(--el-color-primary-light-9);
    transform: translateX(2px);
  }
}

.notice-icon {
  font-size: 20px;
}

.notice-arrow {
  margin-left: auto;
  color: #cbd5e1;
  font-size: 16px;
  transition: color 0.2s ease, transform 0.2s ease;

  .notice-item:hover & {
    color: var(--el-color-primary);
    transform: translateX(2px);
  }
}

.notice-title {
  color: #334155;
  font-size: 14px;
  font-weight: 600;
}

.notice-desc {
  margin-top: 3px;
  color: #94a3b8;
  font-size: 12px;
}

@media (max-width: 1100px) {
  .hero-card {
    grid-template-columns: 1fr;
    padding: 36px;
  }

  .hero-visual {
    min-height: 300px;
    margin-top: 8px;
  }

  .reason-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .notify-message-page {
    padding: 18px;
  }

  .hero-card,
  .progress-card {
    padding: 24px 18px;
  }

  h1 {
    font-size: 26px;
  }

  .section-header {
    flex-direction: column;
  }
}
</style>
