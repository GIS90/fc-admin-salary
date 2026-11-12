<template>
  <el-dialog
      :model-value="props.visible"
      :width="dgField.width"
      :fullscreen="fullView"
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
      @open="openDialog"
      @close="closeDialog"
  >
    <!--header-->
    <template #header>
      <div class="my-dialog-header">
        <div class="my-dialog-header-title">{{ dgField.title }}</div>
        <div class="my-dialog-header-icon">
          <el-tooltip effect="dark" :content="fullViewText" placement="top">
            <el-icon @click="fullScreen">
              <FullScreen />
            </el-icon>
          </el-tooltip>
          <el-tooltip effect="dark" content="关闭" placement="top">
            <el-icon class="margin-left-10px" @click="closeDialog">
              <Close />
            </el-icon>
          </el-tooltip>
        </div>
      </div>
    </template>

    <!--body-->
    <div class="my-dialog-body">
      <div class="avatar-crop">
        <!--左侧：图片操作-->
        <div class="avatar-crop-editor">
          <!--顶部工具栏-->
          <div class="avatar-crop-toolbar">
            <el-button-group>
              <el-tooltip effect="dark" content="撤销" placement="top">
                <el-button size="small" icon="Back" :disabled="!canUndo" @click="undo" />
              </el-tooltip>
              <el-tooltip effect="dark" content="重做" placement="top">
                <el-button size="small" icon="Right" :disabled="!canRedo" @click="redo" />
              </el-tooltip>
            </el-button-group>

            <el-select v-model="ratioKey" size="small" style="width: 104px;" @change="onRatioChange">
              <el-option v-for="item in RATIOS" :key="item.key" :label="'比例 ' + item.label" :value="item.key" />
            </el-select>

            <el-button-group>
              <el-button size="small" icon="RefreshLeft" @click="rotateBy(-90)">左转</el-button>
              <el-button size="small" icon="RefreshRight" @click="rotateBy(90)">右转</el-button>
            </el-button-group>

            <el-button-group>
              <el-button size="small" :type="flipX ? 'primary' : 'default'" @click="flipX = !flipX">水平翻转</el-button>
              <el-button size="small" :type="flipY ? 'primary' : 'default'" @click="flipY = !flipY">垂直翻转</el-button>
            </el-button-group>
  
            <el-button size="small" @click="resetEditor">重置</el-button>
          </div>

          <!--画布-->
          <div class="avatar-crop-stage">
            <canvas ref="canvasRef" class="avatar-crop-canvas" :class="{ 'is-dragging': dragging, 'is-marking': tool !== 'none' }"
                    :style="{ height: frameH + 'px' }"
                    @mousedown.prevent="onMouseDown" @wheel.prevent="onWheel"></canvas>
            <div v-if="loading" v-loading="true" class="avatar-crop-loading"></div>
          </div>

          <!--缩放栏-->
          <div class="avatar-crop-zoom">
            <el-icon><ZoomOut /></el-icon>
            <el-slider v-model="zoom" :min="0.2" :max="4" :step="0.01" :show-tooltip="false" />
            <el-icon><ZoomIn /></el-icon>
            <span class="avatar-crop-zoom-value">{{ Math.round(zoom * 100) }}%</span>
            <el-button size="small" @click="fitScreen">适应屏幕</el-button>
            <el-button size="small" @click="actualSize">1:1</el-button>
          </div>

          <!--底部功能标签-->
          <el-tabs v-model="activeTab" class="avatar-crop-tabs">
            <!--调节-->
            <el-tab-pane label="调节" name="adjust">
              <div class="avatar-crop-adjust-row">
                <span>亮度</span>
                <el-slider v-model="brightness" :min="0.5" :max="1.5" :step="0.01" :show-tooltip="false" />
                <em>{{ brightness.toFixed(2) }}</em>
              </div>
              <div class="avatar-crop-adjust-row">
                <span>对比度</span>
                <el-slider v-model="contrast" :min="0.5" :max="2" :step="0.01" :show-tooltip="false" />
                <em>{{ contrast.toFixed(2) }}</em>
              </div>
              <div class="avatar-crop-adjust-row">
                <span>饱和度</span>
                <el-slider v-model="saturation" :min="0" :max="2" :step="0.01" :show-tooltip="false" />
                <em>{{ saturation.toFixed(2) }}</em>
              </div>
              <div class="avatar-crop-adjust-row">
                <span>旋转微调</span>
                <el-slider v-model="fineAngle" :min="-45" :max="45" :step="1" :show-tooltip="false" />
                <em>{{ fineAngle }}°</em>
              </div>
              <div class="avatar-crop-adjust-actions">
                <el-checkbox v-model="sharpen">锐化（提升文字清晰度）</el-checkbox>
                <el-button size="small" @click="documentEnhance">文档增强</el-button>
                <el-button size="small" text @click="resetAdjust">恢复默认</el-button>
              </div>
            </el-tab-pane>

            <!--滤镜-->
            <el-tab-pane label="滤镜" name="filter">
              <div class="avatar-crop-filter-list">
                <div v-for="item in FILTERS" :key="item.key" class="avatar-crop-filter-item"
                     :class="{ active: filterKey === item.key }" @click="filterKey = item.key">
                  <img v-if="detail.url" :src="detail.url" :style="{ filter: item.css }" alt="" />
                  <span>{{ item.label }}</span>
                </div>
              </div>
            </el-tab-pane>

            <!--标注-->
            <el-tab-pane label="标注" name="mark">
              <div class="avatar-crop-mark">
                <el-radio-group v-model="tool" size="small">
                  <el-radio-button value="none">无</el-radio-button>
                  <el-radio-button value="mosaic">马赛克</el-radio-button>
                  <el-radio-button value="rect">画框</el-radio-button>
                  <el-radio-button value="text">文字</el-radio-button>
                </el-radio-group>

                <div v-if="tool === 'text'" class="avatar-crop-mark-text">
                  <el-input v-model.trim="markText" size="small" :maxlength="30" placeholder="输入标注文字，然后点击图片放置" style="width: 220px;" />
                  <el-input-number v-model="markFontSize" :min="12" :max="48" size="small" controls-position="right" style="width: 90px;" />
                </div>

                <div class="avatar-crop-mark-actions">
                  <el-color-picker v-if="tool !== 'none'" v-model="markColor" size="small" />
                  <el-button size="small" :disabled="annotations.length === 0" @click="clearAnnotations">清除标注</el-button>
                </div>
                <div class="avatar-crop-hint">
                  拖动图片可调整位置，滚轮缩放；选择标注工具后在图片上拖拽/点击即可添加，框内区域为裁剪结果
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>

        <!--右侧：是否新增 + 图片信息-->
        <div class="avatar-crop-side">
          <el-form ref="formRef" :model="form" :rules="rules" v-bind="formField">
            <el-form-item label="是否新增">
              <el-radio-group v-model="isNew">
                <el-radio :value="true">是</el-radio>
                <el-radio :value="false">否</el-radio>
              </el-radio-group>
              <div class="avatar-crop-tip">
                选择“是”将生成新文件，需要填写图片信息，原图片会保留；选择“否”将直接覆盖原图片文件
              </div>
            </el-form-item>

            <template v-if="isNew">
              <el-form-item label="图片名称" prop="name">
                <el-input v-model.trim="form.name" v-bind="inputField" :maxlength="ProfileLen.name" :placeholder="ProfilePlace.name" />
              </el-form-item>
              <el-form-item label="图片类型" prop="type">
                <el-select v-model="form.type" v-bind="selectSingleField" :placeholder="ProfilePlace.type" style="width: 100%;">
                  <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
                    <span class="el-select-key">{{ item.label }}</span>
                    <span class="el-select-value">{{ item.value }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="图片标签" prop="tag">
                <el-input v-model.trim="form.tag" v-bind="inputField" :maxlength="ProfileLen.tag" :placeholder="ProfilePlace.tag" />
              </el-form-item>
              <el-form-item label="备注说明" prop="summary">
                <el-input v-model="form.summary" v-bind="textAreaField" :maxlength="ProfileLen.summary" :autosize="summarySize" :placeholder="ProfilePlace.summary" />
              </el-form-item>
              <el-form-item label="状态" prop="lock">
                <el-radio-group v-model="form.lock">
                  <el-radio :value="false">启用</el-radio>
                  <el-radio :value="true">禁用</el-radio>
                </el-radio-group>
              </el-form-item>
            </template>
            <template v-else>
              <el-form-item label="图片名称">{{ detail.name || '-' }}</el-form-item>
              <el-form-item label="图片类型">{{ typeLabel(detail.type) }}</el-form-item>
              <el-form-item label="状态">
                <el-tag :type="detail.lock ? 'info' : 'success'" size="small">
                  {{ detail.lock ? '已禁用' : '已启用' }}
                </el-tag>
              </el-form-item>
            </template>

            <el-form-item label="原始图片">
              <span class="avatar-crop-url" :title="detail.url">{{ detail.url || '-' }}</span>
            </el-form-item>
            <el-form-item label="输出尺寸">
              <div class="avatar-crop-size">
                <el-input-number v-model="outputWidth" :min="64" :max="4000" :step="10" size="small" controls-position="right" />
                <span class="avatar-crop-size-x">×</span>
                <el-input-number v-model="outputHeight" :min="64" :max="4000" :step="10" size="small" controls-position="right" />
                <span class="avatar-crop-size-unit">px</span>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>

    <!--footer-->
    <template #footer>
      <div class="my-dialog-footer">
        <el-button :disabled="saving" @click="closeDialog">取 消</el-button>
        <el-button :disabled="saving" :loading="saving" type="primary" @click="confirm">保 存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang='ts'>
import { ref, reactive, shallowRef, computed, watch, nextTick, onUnmounted, defineProps, defineEmits } from 'vue';
import { AvatarModelDetail } from "@/models/systemModel";
import { SysOpsAvatarApi, SysOpsAvatarAddApi, SysOpsAvatarUpdateApi } from "@/api/modules/systemOps";
import { UploadFileApi, DictEnumOptionApi } from "@/api/modules/common";
import { FormInstance, FormRules, ElMessage, ElNotification } from "element-plus";
import { dialogField, inputField, textAreaField, formField, selectSingleField } from "@/utils/attrs/field";
import publicLength from "@/utils/attrs/length";
import publicPlaceHolder from "@/utils/attrs/place";

// 数据组件属性值
const ProfileLen = publicLength.systemAvatarModel;
const ProfilePlace = publicPlaceHolder.systemAvatarModel;

// 预览框宽度（CSS px）与默认导出宽度
const FRAME_W = 500;
const DEFAULT_OUTPUT_WIDTH = 800;

// 裁剪比例
const RATIOS = [
  { key: 'free', label: '自由', value: 4 / 3 },
  { key: '1:1', label: '1:1', value: 1 },
  { key: '4:3', label: '4:3', value: 4 / 3 },
  { key: '16:9', label: '16:9', value: 16 / 9 },
  { key: 'a4', label: 'A4', value: 210 / 297 },
];

// 滤镜预设
const FILTERS = [
  { key: 'none', label: '原图', css: 'none' },
  { key: 'gray', label: '黑白', css: 'grayscale(1)' },
  { key: 'gray-deep', label: '硬黑白', css: 'grayscale(1) contrast(1.45)' },
  { key: 'gray-soft', label: '淡灰', css: 'grayscale(0.6) brightness(1.05)' },
  { key: 'ink', label: '水墨', css: 'grayscale(1) contrast(1.8) brightness(1.1)' },
  { key: 'sketch', label: '素描', css: 'grayscale(1) contrast(1.5) brightness(1.2)' },
  { key: 'silver', label: '银灰', css: 'grayscale(0.8) brightness(1.1) contrast(1.1)' },
  { key: 'sepia', label: '怀旧', css: 'sepia(0.7)' },
  { key: 'vintage', label: '复古', css: 'sepia(0.45) saturate(0.8) contrast(0.95)' },
  { key: 'film', label: '胶片', css: 'sepia(0.3) contrast(1.1) saturate(0.9) brightness(0.98)' },
  { key: 'coffee', label: '咖啡', css: 'sepia(0.8) contrast(1.1) brightness(0.95)' },
  { key: 'gold', label: '金色', css: 'sepia(0.55) saturate(1.4) brightness(1.08)' },
  { key: 'desert', label: '沙漠', css: 'sepia(0.6) saturate(1.2) brightness(1.05)' },
  { key: 'japan', label: '日系', css: 'brightness(1.12) saturate(0.8) contrast(0.92)' },
  { key: 'korea', label: '韩系', css: 'brightness(1.08) saturate(1.05) contrast(0.95) hue-rotate(-5deg)' },
  { key: 'pastel', label: '马卡龙', css: 'saturate(0.7) brightness(1.18) contrast(0.85)' },
  { key: 'dream', label: '梦幻', css: 'brightness(1.15) saturate(0.85) hue-rotate(20deg) contrast(0.92)' },
  { key: 'fade', label: '淡化', css: 'brightness(1.2) saturate(0.6) contrast(0.9)' },
  { key: 'bright', label: '明亮', css: 'brightness(1.12)' },
  { key: 'light', label: '提亮', css: 'brightness(1.25) contrast(1.05)' },
  { key: 'high-key', label: '高调', css: 'brightness(1.3) contrast(0.9) saturate(0.95)' },
  { key: 'dark', label: '暗调', css: 'brightness(0.85) contrast(1.1)' },
  { key: 'low-key', label: '低调', css: 'brightness(0.7) contrast(1.25) saturate(0.9)' },
  { key: 'night', label: '夜景', css: 'brightness(0.75) contrast(1.2) saturate(0.9) hue-rotate(-15deg)' },
  { key: 'horror', label: '暗黑', css: 'grayscale(0.9) contrast(1.6) brightness(0.85)' },
  { key: 'contrast', label: '高对比', css: 'contrast(1.35)' },
  { key: 'soft', label: '柔和', css: 'contrast(0.88) brightness(1.06) saturate(1.05)' },
  { key: 'vivid', label: '鲜艳', css: 'saturate(1.6) contrast(1.1)' },
  { key: 'neon', label: '霓虹', css: 'saturate(2.2) contrast(1.3) hue-rotate(-20deg)' },
  { key: 'comic', label: '漫画', css: 'saturate(1.7) contrast(1.4) brightness(1.05)' },
  { key: 'invert', label: '反色', css: 'invert(1)' },
  { key: 'cool', label: '冷色', css: 'hue-rotate(-12deg) saturate(1.15)' },
  { key: 'warm', label: '暖色', css: 'sepia(0.25) saturate(1.25)' },
  { key: 'cyan', label: '青蓝', css: 'hue-rotate(160deg) saturate(1.2)' },
  { key: 'ice', label: '冰蓝', css: 'hue-rotate(180deg) saturate(0.7) brightness(1.12)' },
  { key: 'ocean', label: '海洋', css: 'hue-rotate(180deg) saturate(1.3) contrast(1.05)' },
  { key: 'blue-night', label: '蓝夜', css: 'hue-rotate(200deg) brightness(0.8) contrast(1.15)' },
  { key: 'mint', label: '薄荷', css: 'hue-rotate(120deg) saturate(0.9) brightness(1.05)' },
  { key: 'forest', label: '森林', css: 'hue-rotate(80deg) saturate(1.2) brightness(0.95)' },
  { key: 'vintage-green', label: '复绿', css: 'sepia(0.4) hue-rotate(60deg) saturate(0.9)' },
  { key: 'lemon', label: '柠檬', css: 'hue-rotate(40deg) saturate(1.3) brightness(1.08)' },
  { key: 'purple', label: '紫调', css: 'hue-rotate(240deg) saturate(1.1)' },
  { key: 'lavender', label: '薰衣草', css: 'hue-rotate(260deg) saturate(0.9) brightness(1.1)' },
  { key: 'pink', label: '粉调', css: 'hue-rotate(320deg) saturate(1.15)' },
  { key: 'rose', label: '玫瑰', css: 'sepia(0.3) hue-rotate(310deg) saturate(1.3)' },
  { key: 'retro-red', label: '复古红', css: 'sepia(0.4) hue-rotate(-25deg) saturate(1.4) contrast(1.05)' },
  { key: 'sunset', label: '落日', css: 'sepia(0.5) saturate(1.5) hue-rotate(-20deg) brightness(1.05)' },
  { key: 'fire', label: '火焰', css: 'sepia(0.5) saturate(1.8) hue-rotate(-15deg) contrast(1.1)' },
  { key: 'mono-blue', label: '单蓝', css: 'grayscale(1) sepia(1) hue-rotate(180deg) saturate(2)' },
  { key: 'mono-green', label: '单绿', css: 'grayscale(1) sepia(1) hue-rotate(70deg) saturate(1.6)' },
];

// 标注
interface Annotation {
  id: number;
  type: 'mosaic' | 'rect' | 'text';
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  text: string;
  fontSize: number;
}

const dgConfigField = reactive({
  title: '裁剪',
  width: '82%',
  top: '1%'
});
const dgField = {...dialogField, ...dgConfigField}; // DIALOG属性
const fullView = ref(dgField.fullScreen); // 全屏控制
const fullViewText = ref('全屏');
const emit = defineEmits(['update:visible', 'reFetchTableData']);
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

// 全屏Text侦听器
watch(fullView, (value) => {
  fullViewText.value = value ? '取消全屏' : '全屏';
}, { immediate: true });

// 关闭
function closeDialog() {
  endDrag();
  emit('update:visible', false);
};

// 全屏
function fullScreen() {
  fullView.value = !fullView.value;
};

// 打开
function openDialog() {
  resetAll();
  detail.value = {} as AvatarModelDetail;
  fetchTypeOptions();
  fetchDetail();
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//              ↑Dialog通用配置         ↓定制化方法
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// 图片类型选项（打开弹窗时才加载，避免多个弹窗同时发起相同请求被 axios 取消）
const typeOptions = ref<Array<{ label: string; value: string }>>([]);
const typeOptionsLoaded = ref(false);
const fetchTypeOptions = async () => {
  if (typeOptionsLoaded.value) return;
  typeOptionsLoaded.value = true;
  try {
    const response = await DictEnumOptionApi({ name: 'avatar-type' });
    if (response.data) {
      typeOptions.value = response.data as Array<{ label: string; value: string }>;
    }
  } catch (e: any) {
    typeOptionsLoaded.value = false;
  }
};

// 类型名称
const typeLabel = (value: string) => {
  return typeOptions.value.find(item => item.value === value)?.label || value || '-';
};

// 详情数据
const detail = ref<AvatarModelDetail>({} as AvatarModelDetail);
const loading = ref(false);
const saving = ref(false);
const isNew = ref(true); // 是否新增：true生成新文件 / false覆盖原图片

// 右侧表单
const formRef = ref<FormInstance>();
const summarySize = ref({minRows: 3, maxRows: 4});
const form = reactive({
  name: '',
  type: '',
  tag: '',
  summary: '',
  lock: false
});
const rules = reactive<FormRules>({
  name: [
    { required: true, message: "图片名称不允许为空", trigger: 'blur' },
    { min: 1, max: ProfileLen.name, message: '最大长度支持' + ProfileLen.name + '位', trigger: 'blur' },
  ],
  type: [
    { required: true, message: "请选择图片类型", trigger: 'change' },
    { max: ProfileLen.type, message: '最大长度支持' + ProfileLen.type + '位', trigger: 'change' },
  ],
  tag: [
    { max: ProfileLen.tag, message: '最大长度支持' + ProfileLen.tag + '位', trigger: 'blur' },
  ],
  summary: [
    { max: ProfileLen.summary, message: '最大长度支持' + ProfileLen.summary + '位', trigger: 'blur' },
  ]
});

// 请求详情数据
const fetchDetail = async () => {
  loading.value = true;
  try {
    const response = await SysOpsAvatarApi({ md5: props.md5 });
    const res = response as { data: AvatarModelDetail };
    detail.value = res.data || ({} as AvatarModelDetail);
    Object.assign(form, {
      // 新增时名称默认追加“-裁剪”，避免与原记录重名
      name: `${detail.value.name || ''}-裁剪`.slice(0, ProfileLen.name),
      type: detail.value.type || '',
      tag: detail.value.tag || '',
      summary: detail.value.summary || '',
      lock: !!detail.value.lock
    });
    await nextTick();
    await loadImage(detail.value.url);
    await buildSource();
    draw();
    pushHistory();
  } catch (e: any) {
    if (e?.code !== 'ERR_CANCELED') {
      ElMessage.error('图片加载失败，请重新打开弹窗');
    }
  } finally {
    loading.value = false;
  }
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//                          画布编辑
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const canvasRef = ref<HTMLCanvasElement>();
const imageEl = shallowRef<HTMLImageElement | null>(null);
const sourceRef = shallowRef<HTMLImageElement | HTMLCanvasElement | null>(null);
const srcWidth = ref(0);
const srcHeight = ref(0);

const activeTab = ref('adjust');
const ratioKey = ref('free');
const rotation = ref(0); // 90度整倍旋转
const fineAngle = ref(0); // 旋转微调
const flipX = ref(false);
const flipY = ref(false);
const zoom = ref(1);
const offsetX = ref(0);
const offsetY = ref(0);
const filterKey = ref('none');
const brightness = ref(1);
const contrast = ref(1);
const saturation = ref(1);
const sharpen = ref(false);
const dragging = ref(false);

// 标注
const tool = ref<'none' | 'mosaic' | 'rect' | 'text'>('none');
const markColor = ref('#ff4949');
const markText = ref('');
const markFontSize = ref(20);
const annotations = ref<Annotation[]>([]);
const draft = ref<{ x: number; y: number; w: number; h: number } | null>(null);
let annotationSeed = 0;

// 导出尺寸
const outputWidth = ref(DEFAULT_OUTPUT_WIDTH);
const frameRatio = computed(() => RATIOS.find(item => item.key === ratioKey.value)?.value || 4 / 3);
const frameH = computed(() => Math.round(FRAME_W / frameRatio.value));
const outputHeight = computed({
  get: () => Math.max(1, Math.round(frameH.value * outputWidth.value / FRAME_W)),
  set: (value: number) => {
    outputWidth.value = Math.max(64, Math.round(value * FRAME_W / frameH.value));
  }
});

const filterValue = computed(() => {
  const preset = FILTERS.find(item => item.key === filterKey.value)?.css || 'none';
  const adjust = `brightness(${brightness.value}) contrast(${contrast.value}) saturate(${saturation.value})`;
  return preset === 'none' ? adjust : `${adjust} ${preset}`;
});

// 图片自适应预览框的基准缩放
const fitScale = computed(() => {
  if (!srcWidth.value || !srcHeight.value) return 1;
  const rotate90 = Math.abs(rotation.value % 180) === 90;
  const width = rotate90 ? srcHeight.value : srcWidth.value;
  const height = rotate90 ? srcWidth.value : srcHeight.value;
  return Math.min(FRAME_W / width, frameH.value / height);
});

// 马赛克：把目标区域缩小再放大，实现像素化
const applyMosaic = (ctx: CanvasRenderingContext2D, item: Annotation, scale: number) => {
  const sx = item.x * scale;
  const sy = item.y * scale;
  const sw = item.w * scale;
  const sh = item.h * scale;
  if (sw < 4 || sh < 4) return;
  const block = Math.max(2, 8 * scale);
  const tw = Math.max(1, Math.round(sw / block));
  const th = Math.max(1, Math.round(sh / block));
  const tmp = document.createElement('canvas');
  tmp.width = tw;
  tmp.height = th;
  const tctx = tmp.getContext('2d');
  if (!tctx) return;
  tctx.drawImage(ctx.canvas, sx, sy, sw, sh, 0, 0, tw, th);
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(tmp, 0, 0, tw, th, sx, sy, sw, sh);
  ctx.restore();
};

// 按当前状态绘制到指定画布
const render = (ctx: CanvasRenderingContext2D, scale: number, preview: boolean) => {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, FRAME_W * scale, frameH.value * scale);
  if (sourceRef.value) {
    ctx.save();
    ctx.scale(scale, scale);
    ctx.translate(FRAME_W / 2 + offsetX.value, frameH.value / 2 + offsetY.value);
    ctx.rotate(((rotation.value + fineAngle.value) * Math.PI) / 180);
    ctx.scale(flipX.value ? -1 : 1, flipY.value ? -1 : 1);
    ctx.filter = filterValue.value;
    const imageScale = fitScale.value * zoom.value;
    const width = srcWidth.value * imageScale;
    const height = srcHeight.value * imageScale;
    ctx.drawImage(sourceRef.value, -width / 2, -height / 2, width, height);
    ctx.restore();
    ctx.filter = 'none';
  }

  // 马赛克（设备像素坐标）
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  annotations.value.filter(item => item.type === 'mosaic').forEach(item => applyMosaic(ctx, item, scale));

  // 画框 / 文字
  ctx.save();
  ctx.scale(scale, scale);
  annotations.value.forEach(item => {
    if (item.type === 'rect') {
      ctx.strokeStyle = item.color;
      ctx.lineWidth = 3;
      ctx.strokeRect(item.x, item.y, item.w, item.h);
    } else if (item.type === 'text') {
      ctx.font = `600 ${item.fontSize}px "PingFang SC", "Microsoft YaHei", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineWidth = Math.max(2, item.fontSize / 6);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.strokeText(item.text, item.x, item.y);
      ctx.fillStyle = item.color;
      ctx.fillText(item.text, item.x, item.y);
    }
  });
  ctx.restore();

  // 预览辅助线（不进入导出结果）
  if (preview) {
    ctx.save();
    ctx.scale(scale, scale);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 1; i <= 2; i++) {
      ctx.moveTo((FRAME_W / 3) * i, 0);
      ctx.lineTo((FRAME_W / 3) * i, frameH.value);
      ctx.moveTo(0, (frameH.value / 3) * i);
      ctx.lineTo(FRAME_W, (frameH.value / 3) * i);
    }
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, FRAME_W, frameH.value);
    if (draft.value) {
      ctx.setLineDash([6, 4]);
      ctx.strokeStyle = '#409eff';
      ctx.lineWidth = 2;
      ctx.strokeRect(draft.value.x, draft.value.y, draft.value.w, draft.value.h);
    }
    ctx.restore();
  }
};

const draw = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const width = FRAME_W * 2;
  const height = frameH.value * 2;
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  render(ctx, 2, true);
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//                        撤销 / 重做
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

interface Snapshot {
  rotation: number;
  fineAngle: number;
  flipX: boolean;
  flipY: boolean;
  zoom: number;
  offsetX: number;
  offsetY: number;
  filterKey: string;
  brightness: number;
  contrast: number;
  saturation: number;
  sharpen: boolean;
  ratioKey: string;
  annotations: Annotation[];
}

const history = ref<Snapshot[]>([]);
const historyIndex = ref(-1);
const restoring = ref(false);
const canUndo = computed(() => historyIndex.value > 0);
const canRedo = computed(() => historyIndex.value < history.value.length - 1);

const snapshot = (): Snapshot => ({
  rotation: rotation.value,
  fineAngle: fineAngle.value,
  flipX: flipX.value,
  flipY: flipY.value,
  zoom: zoom.value,
  offsetX: offsetX.value,
  offsetY: offsetY.value,
  filterKey: filterKey.value,
  brightness: brightness.value,
  contrast: contrast.value,
  saturation: saturation.value,
  sharpen: sharpen.value,
  ratioKey: ratioKey.value,
  annotations: JSON.parse(JSON.stringify(annotations.value))
});

const pushHistory = () => {
  if (restoring.value) return;
  const current = JSON.stringify(snapshot());
  const last = historyIndex.value >= 0 ? JSON.stringify(history.value[historyIndex.value]) : '';
  if (current === last) return;
  history.value = history.value.slice(0, historyIndex.value + 1);
  history.value.push(JSON.parse(current));
  if (history.value.length > 50) history.value.shift();
  historyIndex.value = history.value.length - 1;
};

const restore = async (state: Snapshot) => {
  restoring.value = true;
  rotation.value = state.rotation;
  fineAngle.value = state.fineAngle;
  flipX.value = state.flipX;
  flipY.value = state.flipY;
  zoom.value = state.zoom;
  offsetX.value = state.offsetX;
  offsetY.value = state.offsetY;
  filterKey.value = state.filterKey;
  brightness.value = state.brightness;
  contrast.value = state.contrast;
  saturation.value = state.saturation;
  ratioKey.value = state.ratioKey;
  annotations.value = JSON.parse(JSON.stringify(state.annotations));
  if (sharpen.value !== state.sharpen) {
    sharpen.value = state.sharpen;
    await buildSource();
  }
  await nextTick();
  draw();
  restoring.value = false;
};

const undo = async () => {
  if (!canUndo.value) return;
  historyIndex.value -= 1;
  await restore(history.value[historyIndex.value]);
};

const redo = async () => {
  if (!canRedo.value) return;
  historyIndex.value += 1;
  await restore(history.value[historyIndex.value]);
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//                        载入 / 锐化处理
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// 通过 fetch 载入图片，避免跨域导致画布污染
const loadImage = async (url: string) => {
  if (!url) throw new Error('图片地址为空');
  const blob = await fetch(url).then(res => res.blob());
  const objectUrl = URL.createObjectURL(blob);
  try {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('图片加载失败'));
      img.src = objectUrl;
    });
    imageEl.value = img;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

// 3x3 锐化卷积
const sharpenPixels = (source: ImageData, width: number, height: number) => {
  const input = source.data;
  const output = new Uint8ClampedArray(input);
  const kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      for (let channel = 0; channel < 3; channel++) {
        let value = 0;
        let index = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const offset = ((y + ky) * width + (x + kx)) * 4 + channel;
            value += input[offset] * kernel[index++];
          }
        }
        output[(y * width + x) * 4 + channel] = value;
      }
    }
  }
  return new ImageData(output, width, height);
};

// 生成绘制源（锐化时生成处理后的画布）
const buildSource = async () => {
  const img = imageEl.value;
  if (!img) return;
  if (!sharpen.value) {
    sourceRef.value = img;
    srcWidth.value = img.naturalWidth;
    srcHeight.value = img.naturalHeight;
    return;
  }
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  ctx.putImageData(sharpenPixels(imageData, canvas.width, canvas.height), 0, 0);
  sourceRef.value = canvas;
  srcWidth.value = canvas.width;
  srcHeight.value = canvas.height;
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//                        状态变更监听
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

let historyTimer: number | undefined;
const scheduleHistory = () => {
  if (restoring.value) return;
  if (historyTimer) window.clearTimeout(historyTimer);
  historyTimer = window.setTimeout(() => pushHistory(), 300);
};

watch([rotation, fineAngle, flipX, flipY, zoom, offsetX, offsetY, filterKey,
  brightness, contrast, saturation, ratioKey], () => {
  draw();
  scheduleHistory();
});

watch(sharpen, async () => {
  await buildSource();
  draw();
  scheduleHistory();
});

watch(annotations, () => {
  draw();
  scheduleHistory();
}, { deep: true });

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//                        交互
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const rotateBy = (value: number) => {
  rotation.value += value;
};

const fitScreen = () => {
  zoom.value = 1;
  offsetX.value = 0;
  offsetY.value = 0;
};

const actualSize = () => {
  zoom.value = Math.min(4, Math.max(0.2, 1 / fitScale.value));
};

const resetAdjust = () => {
  brightness.value = 1;
  contrast.value = 1;
  saturation.value = 1;
  fineAngle.value = 0;
  sharpen.value = false;
};

// 文档增强：偏黑白、高对比
const documentEnhance = () => {
  brightness.value = 1.08;
  contrast.value = 1.45;
  saturation.value = 0.15;
  sharpen.value = true;
  filterKey.value = 'none';
};

const clearAnnotations = () => {
  annotations.value = [];
};

// 重置全部
const resetAll = () => {
  imageEl.value = null;
  sourceRef.value = null;
  srcWidth.value = 0;
  srcHeight.value = 0;
  rotation.value = 0;
  fineAngle.value = 0;
  flipX.value = false;
  flipY.value = false;
  zoom.value = 1;
  offsetX.value = 0;
  offsetY.value = 0;
  filterKey.value = 'none';
  brightness.value = 1;
  contrast.value = 1;
  saturation.value = 1;
  sharpen.value = false;
  ratioKey.value = 'free';
  outputWidth.value = DEFAULT_OUTPUT_WIDTH;
  annotations.value = [];
  draft.value = null;
  tool.value = 'none';
  markText.value = '';
  activeTab.value = 'adjust';
  isNew.value = true;
  history.value = [];
  historyIndex.value = -1;
};

const resetEditor = () => {
  rotation.value = 0;
  fineAngle.value = 0;
  flipX.value = false;
  flipY.value = false;
  zoom.value = 1;
  offsetX.value = 0;
  offsetY.value = 0;
  filterKey.value = 'none';
  brightness.value = 1;
  contrast.value = 1;
  saturation.value = 1;
  sharpen.value = false;
  ratioKey.value = 'free';
  annotations.value = [];
};

const onRatioChange = () => {
  offsetX.value = 0;
  offsetY.value = 0;
  nextTick(draw);
};

// 画布坐标
const getCanvasPoint = (e: MouseEvent) => {
  const canvas = canvasRef.value;
  if (!canvas) return { x: 0, y: 0 };
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((e.clientX - rect.left) / rect.width) * FRAME_W,
    y: ((e.clientY - rect.top) / rect.height) * frameH.value
  };
};

// 拖拽 / 标注
let dragStart = { x: 0, y: 0, offsetX: 0, offsetY: 0 };
let markStart = { x: 0, y: 0 };

const onMove = (e: MouseEvent) => {
  if (dragging.value) {
    offsetX.value = dragStart.offsetX + (e.clientX - dragStart.x);
    offsetY.value = dragStart.offsetY + (e.clientY - dragStart.y);
    return;
  }
  if (!draft.value) return;
  const point = getCanvasPoint(e);
  draft.value = {
    x: Math.min(markStart.x, point.x),
    y: Math.min(markStart.y, point.y),
    w: Math.abs(point.x - markStart.x),
    h: Math.abs(point.y - markStart.y)
  };
  draw();
};

const onUp = (e: MouseEvent) => {
  if (dragging.value) {
    dragging.value = false;
    endDrag();
    return;
  }
  const current = draft.value;
  draft.value = null;
  endDrag();
  if (!current) return;

  const point = getCanvasPoint(e);
  if (tool.value === 'text') {
    if (!markText.value) {
      ElMessage.warning('请先输入标注文字');
      draw();
      return;
    }
    annotations.value.push({
      id: ++annotationSeed,
      type: 'text',
      x: point.x,
      y: point.y,
      w: 0,
      h: 0,
      color: markColor.value,
      text: markText.value,
      fontSize: markFontSize.value
    });
    return;
  }

  if (current.w < 6 || current.h < 6) {
    draw();
    return;
  }
  annotations.value.push({
    id: ++annotationSeed,
    type: tool.value === 'mosaic' ? 'mosaic' : 'rect',
    x: current.x,
    y: current.y,
    w: current.w,
    h: current.h,
    color: markColor.value,
    text: '',
    fontSize: markFontSize.value
  });
};

const onMouseDown = (e: MouseEvent) => {
  if (!imageEl.value) return;
  if (tool.value !== 'none') {
    markStart = getCanvasPoint(e);
    draft.value = { x: markStart.x, y: markStart.y, w: 0, h: 0 };
  } else {
    dragging.value = true;
    dragStart = { x: e.clientX, y: e.clientY, offsetX: offsetX.value, offsetY: offsetY.value };
  }
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);
};

const endDrag = () => {
  dragging.value = false;
  window.removeEventListener('mousemove', onMove);
  window.removeEventListener('mouseup', onUp);
};
onUnmounted(endDrag);

// 滚轮缩放
const onWheel = (e: WheelEvent) => {
  const delta = e.deltaY > 0 ? 0.92 : 1.08;
  zoom.value = Math.min(4, Math.max(0.2, Number((zoom.value * delta).toFixed(2))));
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//                        导出 / 保存
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const getEditedBlob = (): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const scale = outputWidth.value / FRAME_W;
    const canvas = document.createElement('canvas');
    canvas.width = outputWidth.value;
    canvas.height = Math.max(1, Math.round(frameH.value * scale));
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('画布初始化失败'));
      return;
    }
    render(ctx, scale, false);
    canvas.toBlob(blob => (blob ? resolve(blob) : reject(new Error('图片生成失败'))), 'image/png');
  });
};

// 上传裁剪后的图片
const uploadEdited = async (blob: Blob, name: string) => {
  const formData = new FormData();
  formData.append('file', blob, `${name}.png`);
  formData.append('upload_type', '100');
  const response = await UploadFileApi(formData);
  const res = response as { data: { name: string; url: string } };
  if (!res.data?.url) throw new Error('图片上传失败');
  return res.data;
};

// 保存
const confirm = async () => {
  if (!detail.value.url) {
    ElMessage.warning('图片尚未加载完成');
    return;
  }
  if (isNew.value) {
    const valid = await formRef.value?.validate().then(() => true).catch(() => false);
    if (!valid) return;
  }

  saving.value = true;
  try {
    const blob = await getEditedBlob();
    const fileName = (isNew.value ? form.name : detail.value.name) || 'avatar';
    const uploaded = await uploadEdited(blob, fileName);
    const width = outputWidth.value;
    const height = Math.max(1, Math.round(frameH.value * outputWidth.value / FRAME_W));

    if (isNew.value) {
      await SysOpsAvatarAddApi({
        name: form.name,
        type: form.type || '',
        summary: form.summary || '',
        tag: form.tag || '',
        url: uploaded.url,
        orUrl: detail.value.url,
        format: 'PNG',
        width,
        height,
        size: blob.size,
        lock: form.lock,
        status: false
      } as AvatarModelDetail);
      ElNotification({ title: '提示', message: '裁剪图片新增成功', type: 'success' });
    } else {
      await SysOpsAvatarUpdateApi({
        md5: props.md5,
        name: detail.value.name,
        type: detail.value.type || '',
        summary: detail.value.summary || '',
        tag: detail.value.tag || '',
        url: uploaded.url,
        orUrl: detail.value.orUrl || detail.value.url,
        format: 'PNG',
        width,
        height,
        size: blob.size,
        lock: detail.value.lock
      } as AvatarModelDetail);
      ElNotification({ title: '提示', message: '裁剪图片已覆盖原图片', type: 'success' });
    }

    closeDialog();
    emit('reFetchTableData', true);
  } catch (e: any) {
    // 业务错误已由请求拦截器统一提示
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
.avatar-crop {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.avatar-crop-editor {
  flex: 1;
  min-width: 0;
}

.avatar-crop-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.avatar-crop-stage {
  position: relative;
  display: flex;
  justify-content: center;
}

.avatar-crop-canvas {
  width: 500px;
  max-width: 100%;
  background-color: var(--el-fill-color-lighter);
  border-radius: 6px;
  box-shadow: inset 0 0 0 1px var(--el-border-color);
  cursor: grab;
}

.avatar-crop-canvas.is-dragging {
  cursor: grabbing;
}

.avatar-crop-canvas.is-marking {
  cursor: crosshair;
}

.avatar-crop-loading {
  position: absolute;
  inset: 0;
  border-radius: 6px;
  background-color: var(--el-mask-color);
}

.avatar-crop-zoom {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 14px;
  color: var(--el-text-color-regular);
}

.avatar-crop-zoom .el-slider {
  flex: 1;
}

.avatar-crop-zoom-value {
  width: 46px;
  font-size: 12px;
  text-align: right;
  color: var(--el-text-color-secondary);
}

.avatar-crop-tabs {
  margin-top: 8px;
}

.avatar-crop-adjust-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar-crop-adjust-row > span {
  width: 60px;
  flex: 0 0 60px;
  font-size: 13px;
  color: var(--el-text-color-regular);
}

.avatar-crop-adjust-row .el-slider {
  flex: 1;
}

.avatar-crop-adjust-row em {
  width: 46px;
  font-style: normal;
  font-size: 12px;
  text-align: right;
  color: var(--el-text-color-secondary);
}

.avatar-crop-adjust-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
}

.avatar-crop-filter-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  max-height: 200px;
  padding-right: 6px;
  overflow-y: auto;
}

.avatar-crop-filter-item {
  width: 62px;
  padding: 4px;
  text-align: center;
  font-size: 12px;
  color: var(--el-text-color-regular);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 6px;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}

.avatar-crop-filter-item:hover,
.avatar-crop-filter-item.active {
  border-color: var(--el-color-primary);
  color: var(--el-color-primary);
}

.avatar-crop-filter-item img {
  display: block;
  width: 100%;
  height: 42px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 2px;
}

.avatar-crop-mark {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.avatar-crop-mark-text {
  display: flex;
  align-items: center;
  gap: 8px;
}

.avatar-crop-mark-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar-crop-hint {
  margin-top: 2px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.avatar-crop-side {
  flex: 0 0 380px;
  box-sizing: border-box;
  max-height: 68vh;
  padding-left: 20px;
  overflow-y: auto;
  border-left: 1px solid var(--el-border-color-lighter);
}

.avatar-crop-tip {
  width: 100%;
  margin-top: 6px;
  font-size: 12px;
  line-height: 18px;
  color: var(--el-text-color-secondary);
}

.avatar-crop-url {
  display: inline-block;
  max-width: 100%;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  word-break: break-all;
}

.avatar-crop-size {
  display: flex;
  align-items: center;
  gap: 6px;
}

.avatar-crop-size .el-input-number {
  width: 110px;
}

.avatar-crop-size-x,
.avatar-crop-size-unit {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
</style>
