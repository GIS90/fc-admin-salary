<template>
  <div class="slider-check-box">
    <div class="slider-check" :class="sliderStatus ? 'success' : ''">
      <el-icon @mousedown.stop="rangeMove">
        <component :is="sliderIcon" @mousedown.stop/>
      </el-icon>
      {{ sliderStatus ? $t('login.sliderSuccess') : $t('login.sliderText') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, watch } from 'vue';

const props = defineProps({
  // 成功函数
  successFun: {
    type: Function,
    default: () => {}
  },
  // 失败函数
  errorFun: {
    type: Function,
    default: () => {}
  },
});

let disX = ref(0);
const sliderStatus = ref(false);
const sliderIcon = ref('Right222');
const sliderText = ref('请拖住滑块，拖动到最右边');

// 监听状态
watch(sliderStatus, (value) => {
  if (value) {
    sliderIcon.value = "SuccessFilled";
    sliderText.value = "验证通过";
  } else {
    sliderIcon.value = "Right222";
    sliderText.value = "请拖住滑块，拖动到最右边";
  }
}, { immediate: true });

const rangeMove = (e) => {
  const ele = e.target;
  const startX = e.clientX;
  const eleWidth = ele.offsetWidth;
  const parentWidth = ele.parentElement.offsetWidth;
  const MaxX = parentWidth - eleWidth;

  if (sliderStatus.value) {
    // 不运行
    return false
  };

  document.onmousemove = e => {
    const endX = e.clientX;
    disX.value = endX - startX;
    if (disX.value <= 0) {
      disX.value = 0;
    };
    if (disX.value >= MaxX - eleWidth) {
      // 减去滑块的宽度,体验效果更好
      disX.value = MaxX;
    };
    ele.style.transition = '.1s all';
    ele.style.transform = 'translateX(' + disX.value + 'px)';
    e.preventDefault();
  }
  document.onmouseup = () => {
    if (disX.value !== MaxX) {
      ele.style.transition = '.5s all'
      ele.style.transform = 'translateX(0)'
      // 执行失败的函数
      if (props.errorFun) {
        props.errorFun();
      }
    } else {
      sliderStatus.value = true
      // 执行成功的函数
      if (props.successFun) {
        props.successFun();
      }
    }
    document.onmousemove = null;
    document.onmouseup = null;
  }
};
</script>
<style lang="scss" scoped>
$success-color: #42B984;
$s-width: 60px;
$s-height: 40px;

@mixin jc-flex {
  display: flex;
  justify-content: center;
  align-items: center;
}

.slider-check-box {
  .slider-check {
    height: $s-height;
    font-size: 14px !important;
    background-color: #d9d9d9;
    position: relative;
    transition: 1s all;
    user-select: none;
    color: #505050;
    @include jc-flex;

    &.success {
      background-color: $success-color;
      color: #fff;
      i {
        color: $success-color;
      }
    }
    i {
      position: absolute;
      left: 0;
      width: $s-width;
      height: 100%;
      color: $success-color;
      background-color: #fff;
      border: 1px solid #d8d8d8;
      cursor: pointer;
      font-size: 20px;
      @include jc-flex;
    }
  }
}
</style>
