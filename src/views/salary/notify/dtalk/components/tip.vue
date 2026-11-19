<template>
  <el-dialog
      :model-value="props.visible"
      :width="dgField.width"
      :top="dgField.top"
      :modal="dgField.modal"
      :lock-scroll="dgField.lockScroll"
      :close-on-click-modal="dgField.closeOnClickModal"
      :close-on-press-escape="dgField.closeOnPressEscape"
      :show-close="dgField.showClose"
      :destroy-on-close="true"
      @close="closeHandle"
  >
    <!--header-->
    <template #header>
      <div class="my-dialog-header">
        <div class="my-dialog-header-title">{{ dgField.title }}</div>
        <div class="my-dialog-header-icon">
          <el-tooltip effect="dark" content="关闭" placement="top">
            <el-icon @click="closeHandle">
              <Close />
            </el-icon>
          </el-tooltip>
        </div>
      </div>
    </template>

    <!--body-->
    <div class="my-dialog-body tip-body">
      <el-alert type="info" :closable="false" show-icon title="钉钉绩效通知操作流程"
                description="按照以下流程完成绩效消息的配置与发送，配置完成后即可批量推送" />

      <div class="tip-list">
        <div v-for="(item, index) in steps" :key="index" class="tip-item">
          <div class="tip-index">{{ index + 1 }}</div>
          <div class="tip-content">
            <div class="tip-title">{{ item.title }}</div>
            <div class="tip-desc">{{ item.desc }}</div>
          </div>
        </div>
      </div>

      <el-alert type="warning" :closable="false" show-icon title="注意事项">
        <div class="tip-warning">
          <p>1、文件第一列必须为钉钉 User-ID，其余列为消息内容。</p>
          <p>2、相同文件重复上传时会提示「文件数据已存在」，无需重复上传。</p>
          <p>3、删除操作为软删除，删除后不可在列表查看。</p>
        </div>
      </el-alert>
    </div>

    <!--footer-->
    <template #footer>
      <div class="my-dialog-footer">
        <el-button type="primary" @click="closeHandle">知道了</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { dialogField } from "@/utils/attrs/field";

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
    default: false
  }
});
const emit = defineEmits(["update:visible"]);

// Dialog属性
const dgConfigField = reactive({
  title: "操作说明",
  width: "65%",
  top: "5vh"
});
const dgField = { ...dialogField, ...dgConfigField };

const steps = [
  {
    title: "配置通知机器人",
    desc: "进入「Robot配置」，新增机器人并填写 APP-KEY、APP-SECRET，可点击 Ping 验证配置是否正确，并勾选「设为默认」。"
  },
  {
    title: "上传薪资文件",
    desc: "点击「上传」选择薪资 Excel 文件（.xls、.xlsx），第一列必须为钉钉 User-ID，其余列为消息内容。上传成功后列表会显示文件的 Sheet 信息。"
  },
  {
    title: "设置消息内容",
    desc: "点击表格操作列的「设置」，选择需要发送的 Sheet，设置对应 Sheet 的消息标题与消息列头（至少选择 2 列），保存后生效。"
  },
  {
    title: "发送消息",
    desc: "点击操作列的「发送」，选择机器人与需要发送的 Sheet，系统会按行向对应钉钉用户推送消息，并返回每个 Sheet 的成功/失败条数。"
  },
  {
    title: "查看与导出",
    desc: "列表中的「操作次数」「发送条数」会累计发送情况；可通过表格底部的下载按钮导出列表数据，或通过操作列的下载图标下载原始文件。"
  }
];

// 关闭
const closeHandle = () => {
  emit("update:visible", false);
};
</script>

<style scoped lang="scss">
.tip-body {
  max-height: 62vh;
  overflow-y: auto;
  padding: 18px 22px 12px;

  // 顶部 info alert 微调
  :deep(.el-alert--info) {
    border-radius: 8px;
    border-left: none;
    background: linear-gradient(135deg, #ecf5ff 0%, #f4faff 100%);
  }

  .tip-list {
    margin: 22px 0 14px 0;
  }

  .tip-item {
    position: relative;
    display: flex;
    align-items: flex-start;
    padding: 10px 14px 10px 10px;
    margin-bottom: 2px;
    border-radius: 10px;
    transition: background-color 0.25s ease;

    &:hover {
      background-color: var(--el-fill-color-light);
    }

    &:not(:last-child)::before {
      content: "";
      position: absolute;
      left: 23px;
      top: 42px;
      bottom: -4px;
      width: 2px;
      background: linear-gradient(
        to bottom,
        var(--el-color-primary-light-5) 0%,
        var(--el-border-color-lighter) 100%
      );
    }
  }

  .tip-index {
    flex: 0 0 30px;
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border-radius: 50%;
    background: linear-gradient(
      135deg,
      var(--el-color-primary) 0%,
      var(--el-color-primary-light-3) 100%
    );
    color: #fff;
    font-size: 13px;
    font-weight: 700;
    box-shadow: 0 2px 6px rgba(64, 158, 255, 0.35);
    transition: transform 0.25s ease, box-shadow 0.25s ease;

    .tip-item:hover & {
      transform: scale(1.08);
      box-shadow: 0 3px 10px rgba(64, 158, 255, 0.5);
    }
  }

  .tip-content {
    flex: 1;
    padding-left: 16px;
    padding-top: 4px;
  }

  .tip-title {
    font-size: 15px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    letter-spacing: 0.3px;
  }

  .tip-desc {
    margin-top: 5px;
    font-size: 15px;
    line-height: 1.85;
    color: var(--el-text-color-secondary);
  }

  // 底部 warning 区域
  :deep(.el-alert--warning) {
    border-radius: 8px;
    border-left: none;
    background: linear-gradient(135deg, #fdf6ec 0%, #fef9f0 100%);
    margin-top: 4px;
  }

  .tip-warning {
    margin-top: 4px;
    font-size: 14px;
    line-height: 1.9;

    p {
      margin: 0;
      padding: 1px 0;
    }
  }
}
</style>
