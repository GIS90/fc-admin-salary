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
          <div class="avatar-crop-toolbar">
            <el-button-group>
              <el-button size="small" icon="RefreshLeft" @click="rotateBy(-90)">左转</el-button>
              <el-button size="small" icon="RefreshRight" @click="rotateBy(90)">右转</el-button>
            </el-button-group>
            <el-button size="small" :type="flipX ? 'primary' : 'default'" @click="flipX = !flipX">水平翻转</el-button>
            <el-button size="small" :type="flipY ? 'primary' : 'default'" @click="flipY = !flipY">垂直翻转</el-button>
            <el-button size="small" @click="resetEditor">重置</el-button>
          </div>

          <div class="avatar-crop-stage">
            <canvas ref="canvasRef" class="avatar-crop-canvas" :class="{ 'is-dragging': dragging }"
                    @mousedown.prevent="onMouseDown"></canvas>
            <div v-if="loading" v-loading="true" class="avatar-crop-loading"></div>
          </div>

          <div class="avatar-crop-zoom">
            <el-icon><ZoomOut /></el-icon>
            <el-slider v-model="zoom" :min="0.3" :max="3" :step="0.01" :show-tooltip="false" />
            <el-icon><ZoomIn /></el-icon>
            <span class="avatar-crop-zoom-value">{{ Math.round(zoom * 100) }}%</span>
          </div>

          <div class="avatar-crop-filters">
            <span class="avatar-crop-filter-label">滤镜</span>
            <el-radio-group v-model="filterKey" size="small">
              <el-radio-button v-for="item in FILTERS" :key="item.key" :value="item.key">{{ item.label }}</el-radio-button>
            </el-radio-group>
          </div>

          <div class="avatar-crop-hint">拖动图片可调整位置，预览框内区域即为裁剪结果</div>
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
            <el-form-item label="输出尺寸">{{ VIEW_W * OUTPUT_RATIO }} × {{ VIEW_H * OUTPUT_RATIO }}</el-form-item>
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

// 画布尺寸（CSS px）与导出倍率
const VIEW_W = 400;
const VIEW_H = 300;
const OUTPUT_RATIO = 2;

// 滤镜预设
const FILTERS = [
  { key: 'none', label: '原图', value: 'none' },
  { key: 'gray', label: '黑白', value: 'grayscale(1)' },
  { key: 'sepia', label: '怀旧', value: 'sepia(0.8)' },
  { key: 'bright', label: '明亮', value: 'brightness(1.15) contrast(1.05)' },
  { key: 'warm', label: '暖色', value: 'sepia(0.3) saturate(1.3)' },
  { key: 'cool', label: '冷色', value: 'hue-rotate(-12deg) saturate(1.2)' },
];

const dgConfigField = reactive({
  title: '裁剪',
  width: '75%'
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
  resetEditor();
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
    draw();
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
const rotation = ref(0); // 旋转角度
const flipX = ref(false);
const flipY = ref(false);
const zoom = ref(1); // 缩放倍数
const offsetX = ref(0);
const offsetY = ref(0);
const filterKey = ref('none');
const dragging = ref(false);

const filterValue = computed(() => FILTERS.find(item => item.key === filterKey.value)?.value || 'none');

// 图片自适应预览框的基准缩放
const fitScale = computed(() => {
  const img = imageEl.value;
  if (!img) return 1;
  const rotate90 = Math.abs(rotation.value % 180) === 90;
  const width = rotate90 ? img.naturalHeight : img.naturalWidth;
  const height = rotate90 ? img.naturalWidth : img.naturalHeight;
  return Math.min(VIEW_W / width, VIEW_H / height);
});

// 按当前变换绘制到指定画布
const render = (ctx: CanvasRenderingContext2D, ratio: number) => {
  const img = imageEl.value;
  if (!img) return;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, VIEW_W * ratio, VIEW_H * ratio);
  ctx.save();
  ctx.scale(ratio, ratio);
  ctx.translate(VIEW_W / 2 + offsetX.value, VIEW_H / 2 + offsetY.value);
  ctx.rotate((rotation.value * Math.PI) / 180);
  ctx.scale(flipX.value ? -1 : 1, flipY.value ? -1 : 1);
  ctx.filter = filterValue.value;
  const scale = fitScale.value * zoom.value;
  const width = img.naturalWidth * scale;
  const height = img.naturalHeight * scale;
  ctx.drawImage(img, -width / 2, -height / 2, width, height);
  ctx.restore();
  ctx.filter = 'none';
};

const draw = () => {
  const canvas = canvasRef.value;
  if (!canvas || !imageEl.value) return;
  if (canvas.width !== VIEW_W * 2 || canvas.height !== VIEW_H * 2) {
    canvas.width = VIEW_W * 2;
    canvas.height = VIEW_H * 2;
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  render(ctx, 2);
};

watch([rotation, flipX, flipY, zoom, offsetX, offsetY, filterKey], draw);

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

// 重置编辑器
const resetEditor = () => {
  imageEl.value = null;
  rotation.value = 0;
  flipX.value = false;
  flipY.value = false;
  zoom.value = 1;
  offsetX.value = 0;
  offsetY.value = 0;
  filterKey.value = 'none';
  isNew.value = true;
};

const rotateBy = (value: number) => {
  rotation.value += value;
};

// 拖拽移动
let dragStart = { x: 0, y: 0, offsetX: 0, offsetY: 0 };
const onMouseMove = (e: MouseEvent) => {
  offsetX.value = dragStart.offsetX + (e.clientX - dragStart.x);
  offsetY.value = dragStart.offsetY + (e.clientY - dragStart.y);
};
const onMouseUp = () => {
  dragging.value = false;
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
};
const onMouseDown = (e: MouseEvent) => {
  if (!imageEl.value) return;
  dragging.value = true;
  dragStart = { x: e.clientX, y: e.clientY, offsetX: offsetX.value, offsetY: offsetY.value };
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
};
const endDrag = () => {
  dragging.value = false;
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
};
onUnmounted(endDrag);

// 导出裁剪后的图片
const getEditedBlob = (): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = VIEW_W * OUTPUT_RATIO;
    canvas.height = VIEW_H * OUTPUT_RATIO;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('画布初始化失败'));
      return;
    }
    render(ctx, OUTPUT_RATIO);
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
    const width = VIEW_W * OUTPUT_RATIO;
    const height = VIEW_H * OUTPUT_RATIO;

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
  aspect-ratio: 4 / 3;
  background-color: var(--el-fill-color-lighter);
  border-radius: 6px;
  box-shadow: inset 0 0 0 1px var(--el-border-color);
  cursor: grab;
}

.avatar-crop-canvas.is-dragging {
  cursor: grabbing;
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

.avatar-crop-filters {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;
}

.avatar-crop-filter-label {
  font-size: 13px;
  color: var(--el-text-color-regular);
}

.avatar-crop-hint {
  margin-top: 10px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.avatar-crop-side {
  flex: 0 0 380px;
  box-sizing: border-box;
  max-height: 62vh;
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
</style>
