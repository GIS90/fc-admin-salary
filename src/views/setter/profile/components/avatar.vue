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
      :close-on-click-modal="false"
      :close-on-press-escape="dgField.closeOnPressEscape"
      :show-close="dgField.showClose"
      :draggable = "dgField.draggable"
      :overflow = "dgField.overflow"
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
            <el-icon @click="fullScreen" class="margin-right-15px">
              <FullScreen />
            </el-icon>
          </el-tooltip>
          <el-tooltip effect="dark" content="关闭" placement="top">
            <el-icon @click="closeDialog">
              <Close />
            </el-icon>
          </el-tooltip>
        </div>
      </div>
    </template>

    <!--body-->
    <div class="my-dialog-body">
      <el-row class="avatar-box">
        <el-col :span="12" >
          <vue-cropper
              ref="cropper"
              :img="cropOptions.img"
              :outputSize="cropOptions.outputSize"
              :outputType="cropOptions.outputType"
              :info="cropOptions.info"
              :canScale="cropOptions.canScale"
              :autoCrop="cropOptions.autoCrop"
              :autoCropWidth="cropOptions.autoCropWidth"
              :autoCropHeight="cropOptions.autoCropHeight"
              :fixed="cropOptions.fixed"
              :full="cropOptions.full"
              :fixedBox="cropOptions.fixedBox"
              :canMove="cropOptions.canMove"
              :canMoveBox="cropOptions.canMoveBox"
              :centerBox="cropOptions.centerBox"
              @realTime="realTime"
              v-if="showCropper"
          />
        </el-col>
        <el-col :span="12">
          <h2 class="avatar-preview-text">预览</h2>
          <div class="avatar-preview-box">
            <img v-if="previews.url" :src="previews.url" :style="previews.img" />
            <span class="avatar-preview-box-no" v-else>暂无内容</span>
          </div>
        </el-col>
      </el-row>
      <el-row class="avatar-opr">
        <el-col :span="12">
          <el-row>
            <el-col :span="8">
              <el-upload
                  action="#"
                  :multiple="false"
                  :accept="'image/*'"
                  :http-request="() => {}"
                  :before-upload="beforeUpload"
                  :show-file-list="false"
              >
                <el-button type="primary" :disabled="btnDisabled">选择</el-button>
              </el-upload>
            </el-col>
            <el-col :span="8">
              <el-button-group>
                <el-button :icon="Plus" @click="changeScale(cropOptions.scale)" :disabled="btnDisabled" />
                <el-button :icon="Minus" @click="changeScale(-1*cropOptions.scale)" :disabled="btnDisabled" />
              </el-button-group>
            </el-col>
            <el-col :span="8">
              <el-button-group>
                <el-button :icon="RefreshLeft" @click="rotateLeft()" :disabled="btnDisabled" />
                <el-button :icon="RefreshRight" @click="rotateRight()" :disabled="btnDisabled" />
              </el-button-group>
            </el-col>
          </el-row>
        </el-col>
        <!-- 禁用
        <el-col :span="12">
          <el-input v-model="cropOptions.scale" type="number" step="1" inputmode="decimal" style="width: 180px" :disabled="btnDisabled">
            <template #prepend>缩放比例</template>
          </el-input>
        </el-col>
        -->
      </el-row>
    </div>

    <!--footer-->
    <template #footer>
      <div class="my-dialog-footer">
        <el-button :disabled="btnDisabled" @click="closeDialog">取 消</el-button>
        <el-button :disabled="btnDisabled" :loading="btnLoading" type="primary" @click="confirm()">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang='ts'>
import 'vue-cropper/dist/index.css'
import { VueCropper }  from "vue-cropper";
import { Plus, Minus, RefreshLeft, RefreshRight } from '@element-plus/icons-vue'
import { ElMessage, ElNotification } from 'element-plus'
import { defineEmits, defineProps, reactive, ref, watch, getCurrentInstance } from "vue";
import { dialogField } from "@/utils/attrs/field";
import { SetProfileAvatarApi } from "@/api/modules/setter";
import { useAuthStore } from "@/store/modules/auth";

const authStore = useAuthStore();
const dgConfigField = reactive({
  title: '头像设置',
  width: '65%'
});
const dgField = {...dialogField, ...dgConfigField}; // DIALOG属性
const fullView = ref(dgField.fullScreen); // 全屏控制
const fullViewText = ref('全屏');
const emit = defineEmits(['update:visible']);
const btnDisabled = ref(false); // 禁用
const btnLoading = ref(false); // 加载中

const instance = getCurrentInstance();
if (!instance) {
  throw new Error('Component instance is null');
}

// 使用类型断言
const { proxy } = instance as { proxy: any };
const showCropper = ref(false);
const originalFileName = ref(''); // 存储原始文件名
// cropper配置  更多配置可参考 https://www.npmjs.com/package/vue-cropper
interface CropOptions {
  img: string | null;
  outputSize: number,
  outputType: string,
  info: boolean,
  canScale: boolean,
  autoCrop: boolean,
  autoCropWidth: number,
  autoCropHeight: number,
  fixed: boolean,
  full: boolean,
  fixedBox: boolean,
  canMove: boolean,
  canMoveBox: boolean,
  centerBox: boolean,
  scale: number
}
const cropOptions: CropOptions = reactive({
  img: null, // 裁剪图片的地址
  outputSize: 1, //裁剪生成图片的质量0~1
  outputType: "png", // 裁剪生成图片的格式jpeg, png, webp
  info: true, // 裁剪框的大小信息true, false
  canScale: true, // 图片是否允许滚轮缩放
  autoCrop: true,	// 是否默认生成截图框
  autoCropWidth: 200, // 默认生成截图框宽度
  autoCropHeight: 200, // 默认生成截图框高度
  fixed: true, // 是否开启截图框宽高固定比例
  full: false, // 是否输出原图比例的截图
  fixedBox: false, // 固定截图框大小
  canMove: true, // 上传图片是否可以移动
  canMoveBox: true, // 截图框能否拖动
  centerBox: true, // 截图框是否被限制在图片里面
  scale: 2 // 缩放比例数值
});

// 预览地址
const previews = ref({
  url: '',
  img: {}
});

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
    default: false
  }
});

// 全屏Text侦听器
watch(fullView, (value) => {
  fullViewText.value = value ? '取消全屏' : '全屏';
}, { immediate: true });

// 关闭
function closeDialog() {
  cropOptions.img = null;
  previews.value.url = '';
  originalFileName.value = '';
  emit('update:visible', false);
};

// 全屏
function fullScreen() {
  fullView.value = !fullView.value;
};

// 打开
const openDialog = () => {
  showCropper.value = true;
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// 修改图片大小 正数为变大 负数变小
const changeScale = (num: number) => {
  num = num || 1;
  proxy.$refs.cropper.changeScale(num);
};

// 向左边旋转90度
const rotateLeft = () => {
  proxy.$refs.cropper.rotateLeft()
};

// 向右边旋转90度
const rotateRight = () => {
  proxy.$refs.cropper.rotateRight()
};

// 上传图片处理
const beforeUpload = (rawFile: any) => {
  if (rawFile.type.indexOf('image/') == -1) {
    ElMessage.error('请上传图片类型文件!')
    return false
  };
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('图片大小不能超过2MB!')
    return false
  };
  originalFileName.value = rawFile.name; // 保存原始文件名
  const reader = new FileReader();
  reader.readAsDataURL(rawFile);
  reader.onload = () => {
    // 图片在这里
    cropOptions.img = reader.result as string;
  };
};

// 实时预览事件
const realTime = (data: any) => {
  previews.value = data
};
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const confirm = async () => {
  btnDisabled.value = true;
  btnLoading.value = true;
  // 裁剪后上传
  proxy.$refs.cropper.getCropBlob(async (blob: Blob) => {
    const formData = new FormData();
    formData.append('file', blob, originalFileName.value || 'cropped-avatar.png');

    SetProfileAvatarApi(formData).then(response => {
      if (response.code === 100) {
        const res = response as { code: number, data: { url: string } };
        // 更新authStore
        authStore.setUserInfoField("avatar", res.data.url);
        ElNotification({
          title: '提示',
          message: '上传成功',
          type: 'success'
        })
        closeDialog();
      } else {
        ElNotification({
          title: '提示',
          message: '上传失败，请稍后重试',
          type: 'error'
        })
      }
    }).finally(() => {
      btnDisabled.value = false;
      btnLoading.value = false;
    })
  });

};

</script>

<style lang='scss' scoped>
.avatar-box {
  height: 350px;

  .avatar-preview-box {
    position: absolute;
    top: 50%;
    transform: translate(50%, -50%);
    width: 220px;
    height: 220px;
    border-radius: 50%;
    border: 1px solid #ccc;
    overflow: hidden;

    .avatar-preview-box-no {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 220px;
    }
  }

  .avatar-preview-text {
    text-align: left;
    margin-left: 35px;
  }
}

.avatar-opr {
  margin-top: 15px;
}

</style>
