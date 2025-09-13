<template>
  <div class="container" @wheel="handleWheel">
    <!-- 海浪阶段 - 始终显示 -->
    <div class="waves-container" :class="{ 'waves-fixed': stage !== 'wave' }">
      <svg width="0" height="0" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="wave1" clipPathUnits="objectBoundingBox">
            <path d="M0,0.15 Q0.2,0.08 0.4,0.14 T0.8,0.16 T1,0.15 L1,1 L0,1 Z" />
          </clipPath>
          <clipPath id="wave2" clipPathUnits="objectBoundingBox">
            <path d="M0,0.12 Q0.3,0.05 0.6,0.11 T1,0.12 L1,1 L0,1 Z" />
          </clipPath>
          <clipPath id="wave3" clipPathUnits="objectBoundingBox">
            <path d="M0,0.18 Q0.25,0.1 0.5,0.17 T0.9,0.19 T1,0.18 L1,1 L0,1 Z" />
          </clipPath>
          <clipPath id="wave4" clipPathUnits="objectBoundingBox">
            <path d="M0,0.14 Q0.15,0.07 0.3,0.13 T0.7,0.15 T1,0.14 L1,1 L0,1 Z" />
          </clipPath>
          <clipPath id="wave5" clipPathUnits="objectBoundingBox">
            <path d="M0,0.16 Q0.22,0.09 0.45,0.15 T0.85,0.17 T1,0.16 L1,1 L0,1 Z" />
          </clipPath>
        </defs>
      </svg>

      <div
        class="layer layer-1"
        :style="{ transform: `translate(${translateX1}px, ${translateY1}px)` }"
      ></div>
      <div
        class="layer layer-2"
        :style="{ transform: `translate(${translateX2}px, ${translateY2}px)` }"
      ></div>
      <div
        class="layer layer-3"
        :style="{ transform: `translate(${translateX3}px, ${translateY3}px)` }"
      ></div>
      <div
        class="layer layer-4"
        :style="{ transform: `translate(${translateX4}px, ${translateY4}px)` }"
      ></div>
      <div
        class="layer layer-5"
        :style="{ transform: `translate(${translateX5}px, ${translateY5}px)` }"
      ></div>
    </div>

    <!-- 文字提示阶段 -->
    <transition name="fade">
      <div v-if="stage === 'text' || stage === 'sky'" class="text-stage">
        <h1 class="welcome-text" :style="{ opacity: textOpacity }">Welcome</h1>
        <p class="hint-text" :style="{ opacity: textOpacity }">鼠标下滑以继续</p>
      </div>
    </transition>

    <!-- 天空阶段内容 -->
    <div v-if="stage === 'sky'" class="sky-content" :style="{ transform: `translateY(${skyTranslateY}px)` }">
      <div class="content-section">
        <h2>探索新世界</h2>
        <p>欢迎来到这个由海浪引领的新空间。在这里，您可以尽情探索、发现和体验。</p>
        <p>我们致力于为您提供最佳的浏览体验，让每一次访问都成为一次愉快的旅程。</p>
        <p>向下滚动发现更多内容，或使用顶部导航菜单浏览不同区域。</p>
      </div>
    </div>

    <!-- 滚动指示器 -->
    <div v-if="stage === 'text'" class="scroll-indicator">
      ↓ 向下滑动 ↓
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// 阶段控制：wave（海浪）、text（文字）、sky（天空）
const stage = ref('wave');

// 波浪位移和动画参数
const translateX1 = ref(-400);
const translateX2 = ref(-300);
const translateX3 = ref(-200);
const translateX4 = ref(-100);
const translateX5 = ref(0);

const translateY1 = ref(-50);
const translateY2 = ref(-40);
const translateY3 = ref(-30);
const translateY4 = ref(-20);
const translateY5 = ref(-10);

// 波浪动画参数
const amplitude1 = ref(12);
const amplitude2 = ref(15);
const amplitude3 = ref(18);
const amplitude4 = ref(16);
const amplitude5 = ref(13);

// 波浪下滑参数
const maxSlideOffset = ref(650);
const currentSlide1 = ref(0);
const currentSlide2 = ref(0);
const currentSlide3 = ref(0);
const currentSlide4 = ref(0);
const currentSlide5 = ref(0);

// 文字透明度
const textOpacity = ref(0);

// 天空阶段的垂直位移
const skyTranslateY = ref(0);

// 动画控制
let animationId = null;
let startTime = null;

const startWaveAnimation = () => {
  startTime = performance.now();

  const animate = (timestamp) => {
    const elapsed = timestamp - startTime;

    // 波浪下滑逻辑
    if (stage.value === 'wave') {
      currentSlide1.value = Math.min(currentSlide1.value + 1, maxSlideOffset.value);
      currentSlide2.value = Math.min(currentSlide2.value + 1, maxSlideOffset.value);
      currentSlide3.value = Math.min(currentSlide3.value + 1, maxSlideOffset.value);
      currentSlide4.value = Math.min(currentSlide4.value + 1, maxSlideOffset.value);
      currentSlide5.value = Math.min(currentSlide5.value + 1, maxSlideOffset.value);
    }

    // 波浪持续摆动
    translateY1.value = Math.sin(elapsed * 0.001) * amplitude1.value + currentSlide1.value - 50;
    translateY2.value = Math.sin(elapsed * 0.0012 + 1) * amplitude2.value + currentSlide2.value - 40;
    translateY3.value = Math.sin(elapsed * 0.0009 + 2) * amplitude3.value + currentSlide3.value - 30;
    translateY4.value = Math.sin(elapsed * 0.0011 + 3) * amplitude4.value + currentSlide4.value - 20;
    translateY5.value = Math.sin(elapsed * 0.0008 + 4) * amplitude5.value + currentSlide5.value - 10;

    // 海浪结束后，切换到文字阶段
    if (stage.value === 'wave' &&
        currentSlide1.value >= maxSlideOffset.value &&
        currentSlide2.value >= maxSlideOffset.value &&
        currentSlide3.value >= maxSlideOffset.value &&
        currentSlide4.value >= maxSlideOffset.value &&
        currentSlide5.value >= maxSlideOffset.value) {
      stage.value = 'text';
      // 渐变显示文字
      const textFade = setInterval(() => {
        textOpacity.value += 0.05;
        if (textOpacity.value >= 1) {
          clearInterval(textFade);
        }
      }, 50);
    }

    animationId = requestAnimationFrame(animate);
  };

  animationId = requestAnimationFrame(animate);
};

const handleWheel = (e) => {
  // 文字阶段 → 天空阶段（初始滚动）
  if (stage.value === 'text' && e.deltaY > 0) {
    stage.value = 'sky';
    let scrollAmount = 0;
    const scrollInterval = setInterval(() => {
      scrollAmount += 5;
      skyTranslateY.value = scrollAmount;
      if (scrollAmount >= 300) clearInterval(scrollInterval);
    }, 20);
  }
  // 天空阶段内的滚动（上/下）
  else if (stage.value === 'sky') {
    // 向下滚动 → 内容上移（视觉上是向下看）
    if (e.deltaY > 0) {
      skyTranslateY.value += e.deltaY * 0.3;
    }
    // 向上滚动 → 内容下移（但不能超出初始位置）
    else if (e.deltaY < 0 && skyTranslateY.value > 0) {
      skyTranslateY.value += e.deltaY * 0.3;
      if (skyTranslateY.value < 0) skyTranslateY.value = 0;
    }
  }
};

onMounted(() => {
  startWaveAnimation();
});

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  overflow: hidden;
  color: #333;
}

.container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #e6f2ff;
  transition: all 0.5s ease;
}

.waves-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: opacity 1s ease;
}

.waves-fixed {
  position: fixed;
  opacity: 0.7;
}

.layer {
  position: absolute;
  top: 0;
  width: 150%;
  height: 120%;
  transition: transform 0.1s ease-out;
  will-change: transform;
}

.layer-1 {
  background-color: rgba(40, 100, 200, 0.7);
  z-index: 1;
  clip-path: url(#wave1);
}

.layer-2 {
  background-color: rgba(60, 120, 220, 0.65);
  z-index: 2;
  clip-path: url(#wave2);
}

.layer-3 {
  background-color: rgba(80, 140, 230, 0.6);
  z-index: 3;
  clip-path: url(#wave3);
}

.layer-4 {
  background-color: rgba(100, 160, 240, 0.55);
  z-index: 4;
  clip-path: url(#wave4);
}

.layer-5 {
  background-color: rgba(120, 180, 255, 0.5);
  z-index: 5;
  clip-path: url(#wave5);
}

.text-stage {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 10;
}

.welcome-text {
  font-size: 4rem;
  font-weight: bold;
  color: #000;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.8);
}

.hint-text {
  font-size: 1.5rem;
  color: #000;
  margin-top: 2rem;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
}

.sky-content {
  position: absolute;
  top: 100vh;
  left: 0;
  width: 100%;
  min-height: 100vh;
  background: #fff;
  padding: 2rem;
  z-index: 10; /* 确保比海浪的 z-index（5）高 */
  transition: transform 0.5s ease-out;
}

.content-section {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.content-section h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-size: 2.2rem;
}

.content-section p {
  color: #34495e;
  line-height: 1.8;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 1.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.scroll-indicator {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  color: #000;
  font-size: 1.2rem;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0) translateX(-50%);
  }
  40% {
    transform: translateY(-20px) translateX(-50%);
  }
  60% {
    transform: translateY(-10px) translateX(-50%);
  }
}
</style>
