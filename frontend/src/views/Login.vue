<template>
  <div class="container" ref="container" @mousemove="handleMouseMove" @mouseleave="handleMouseLeave">
    <!-- 动画容器，登录成功后显示 -->
    <div ref="animationContainer" class="animation-container" v-if="showAnimation">
      <svg ref="animationSvg" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"></svg>
    </div>

    <!-- 海浪阶段 -->
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

    <!-- 登录框 -->
    <div
      class="login-container"
      :style="{
        opacity: loginOpacity,
        transform: `translateY(${loginTranslateY}px)`
      }"
      v-if="stage === 'login'"
    >
      <div class="login-card">
        <div class="login-header">
          <h2>欢迎回来</h2>
          <p>请登录您的账号</p>
        </div>

        <form class="login-form" @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="username">用户名</label>
            <div class="input-wrapper">
              <input
                type="text"
                id="username"
                v-model="username"
                placeholder="请输入用户名"
                required
              >
            </div>
          </div>

          <div class="form-group">
            <label for="password">密码</label>
            <div class="input-wrapper">
              <input
                type="password"
                id="password"
                v-model="password"
                placeholder="请输入密码"
                required
              >
            </div>
          </div>

          <div class="form-options">
            <label class="remember-me" @click="rememberMe = !rememberMe">
              <input type="checkbox" v-model="rememberMe" style="cursor: pointer;">
              <span>记住我</span>
            </label>
            <a href="#" class="forgot-password">忘记密码?</a>
          </div>

          <button type="submit" class="login-btn">
            登录
          </button>
        </form>

        <div class="register-prompt">
          还没有账号? <a href="#">立即注册</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { useRouter } from 'vue-router';

// 阶段控制
const stage = ref('wave');
const container = ref(null);

// 滚动条控制 - 只保留垂直滚动相关逻辑
const showScrollbar = ref(false);
const scrollbarThreshold = 40; // 光标靠近垂直滚动条的检测阈值(px)
let scrollTimeout = null;
// 状态定义
const showNewPage = ref(false);
const router = useRouter()
// 监听 showNewPage 的变化
watch(
  () => showNewPage.value,
  (newVal) => {
    if (newVal) {
      // 用路由跳转项目内页面，动画会自然衔接
      router.push('/home'); // 替换为你的目标路由
      
    }
  },
  { immediate: false }
);
// 新增加载状态
const isLoading = ref(false);

const handleLogin = () => {
  if (isLoading.value) return;

  console.log('登录信息:', {
    username: username.value,
    password: password.value,
    rememberMe: rememberMe.value
  });

  isLoading.value = true;
  showAnimation.value = true;

  nextTick(() => {
    startDiffusionAnimation();
  });
};

// 波浪位移与动画参数
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

// 登录框状态
const loginOpacity = ref(0);
const loginTranslateY = ref(-50);
const username = ref('');
const password = ref('');
const rememberMe = ref(false);

// 动画与新页面状态
const showAnimation = ref(false);
const animationContainer = ref(null);
const animationSvg = ref(null);
let waveAnimationId = null;
let animationFrameId = null;
let startTime = null;

// 滚动控制
const isSmallWindow = ref(false);

// 检查窗口大小 - 移除水平滚动相关逻辑
const checkWindowSize = () => {
  if (!container.value) return;

  const containerRect = container.value.getBoundingClientRect();
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const contentWidth = 1920;
  const contentHeight = 1080;

  // 判断是否为小窗模式
  isSmallWindow.value = windowWidth < contentWidth || windowHeight < contentHeight;

  // 根据窗口大小动态设置容器样式
  if (isSmallWindow.value) {
    container.value.style.position = 'absolute';
    container.value.style.overflowX = 'hidden'; // 禁用水平滚动
    container.value.style.overflowY = 'auto';  // 启用垂直滚动
    container.value.style.width = '100%';
    container.value.style.height = '100%';
  } else {
    container.value.style.position = 'fixed';
    container.value.style.overflow = 'hidden';
    container.value.style.width = '1920px';
    container.value.style.height = '1080px';
  }
};

// 处理鼠标移动 - 只检测垂直滚动条
const handleMouseMove = (e) => {
  if (!isSmallWindow.value || !container.value) return;

  const containerRect = container.value.getBoundingClientRect();
  const windowWidth = containerRect.width;
  const clientX = e.clientX;

  // 只检测是否靠近右侧垂直滚动条（移除水平滚动条检测）
  const nearVerticalScrollbar = clientX >= windowWidth - scrollbarThreshold;

  // 当靠近垂直滚动条区域时显示滚动条
  if (nearVerticalScrollbar) {
    showScrollbar.value = true;
    clearTimeout(scrollTimeout);
  } else {
    // 离开滚动条区域后延迟隐藏
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      showScrollbar.value = false;
    }, 300);
  }
};

// 鼠标离开容器时隐藏滚动条
const handleMouseLeave = () => {
  if (!isSmallWindow.value) return;

  clearTimeout(scrollTimeout);
  showScrollbar.value = false;
};

// 监听窗口大小变化
const handleResize = () => {
  checkWindowSize();
};

// 启动海浪动画
const startWaveAnimation = () => {
  startTime = performance.now();

  const animateWaves = (timestamp) => {
    const elapsed = timestamp - startTime;

    // 波浪下滑逻辑
    if (stage.value === 'wave') {
      currentSlide1.value = Math.min(currentSlide1.value + 2, maxSlideOffset.value);
      currentSlide2.value = Math.min(currentSlide2.value + 2, maxSlideOffset.value);
      currentSlide3.value = Math.min(currentSlide3.value + 2, maxSlideOffset.value);
      currentSlide4.value = Math.min(currentSlide4.value + 2, maxSlideOffset.value);
      currentSlide5.value = Math.min(currentSlide5.value + 2, maxSlideOffset.value);
    }

    // 波浪摆动逻辑
    translateY1.value = Math.sin(elapsed * 0.001) * amplitude1.value + currentSlide1.value - 50;
    translateY2.value = Math.sin(elapsed * 0.0012 + 1) * amplitude2.value + currentSlide2.value - 40;
    translateY3.value = Math.sin(elapsed * 0.0009 + 2) * amplitude3.value + currentSlide3.value - 30;
    translateY4.value = Math.sin(elapsed * 0.0011 + 3) * amplitude4.value + currentSlide4.value - 20;
    translateY5.value = Math.sin(elapsed * 0.0008 + 4) * amplitude5.value + currentSlide5.value - 10;

    // 海浪动画结束，切换到登录阶段
    if (stage.value === 'wave' &&
      currentSlide1.value >= maxSlideOffset.value &&
      currentSlide2.value >= maxSlideOffset.value &&
      currentSlide3.value >= maxSlideOffset.value &&
      currentSlide4.value >= maxSlideOffset.value &&
      currentSlide5.value >= maxSlideOffset.value) {
      stage.value = 'login';
      // 渐变显示登录框
      const loginFade = setInterval(() => {
        loginOpacity.value += 0.05;
        if (loginOpacity.value >= 1) clearInterval(loginFade);
      }, 30);
    }

    waveAnimationId = requestAnimationFrame(animateWaves);
  };

  waveAnimationId = requestAnimationFrame(animateWaves);
};

// 启动扩散动画（淡蓝圆环 + 深蓝填充圆）
const startDiffusionAnimation = () => {
  const svg = animationSvg.value;
  const container = animationContainer.value;

  if (!svg || !container) return;

  // 获取容器尺寸
  const { width, height } = container.getBoundingClientRect();
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);

  // 清空SVG内旧元素
  while (svg.firstChild) {
    svg.removeChild(svg.firstChild);
  }

  // 动画参数：中心位置（左上角）、半径、速度
  const centerX = 30;  // 左上角位置
  const centerY = 30;
  const centerX2 = width-30;
  const centerY2 = height-30;
  let newRadius = 0;
  let ringRadius = 10;   // 初始圆环半径
  let fillRadius = 0;    // 初始填充圆半径
  const maxRadius = Math.sqrt(width * width + height * height) * 1.2; // 确保覆盖全屏的对角线长度
  const phaseThreshold = maxRadius * 0.3; // 圆环扩散到40%时，填充圆开始追
  const chase = maxRadius * 0.4;
  // 动画速度控制
  const ringSpeed = 4;   // 圆环速度
  const fillSpeed = 10;   // 填充圆速度（更快）
  const newSpeed = 12;

  // 颜色设置
  const ringColor = '#b3e5fc';    // 淡蓝色x
  const fillColor = 'rgba(10,67,255,0.7)';    // 深蓝色
  const newColor = 'rgb(255,255,255,1)';

  const animateDiffusion = (timestamp) => {
    // 清空SVG，准备绘制新帧
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // 1. 绘制淡蓝色圆环
    const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    ring.setAttribute('cx', centerX);
    ring.setAttribute('cy', centerY);
    ring.setAttribute('r', ringRadius);
    ring.setAttribute('stroke', ringColor);
    ring.setAttribute('stroke-width', '10');
    ring.setAttribute('fill', 'none');
    svg.appendChild(ring);

    // 2. 当圆环扩散到阈值时，绘制深蓝色填充圆
    if (ringRadius >= phaseThreshold) {
      const fillCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      fillCircle.setAttribute('cx', centerX);
      fillCircle.setAttribute('cy', centerY);
      fillCircle.setAttribute('r', fillRadius);
      fillCircle.setAttribute('fill', fillColor);
      svg.appendChild(fillCircle);
      fillRadius += fillSpeed; // 填充圆加速
    }

    if(ringRadius >= chase){
      const chaseCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      chaseCircle.setAttribute('cx', centerX2);
      chaseCircle.setAttribute('cy', centerY2);
      chaseCircle.setAttribute('r', newRadius);
      chaseCircle.setAttribute('fill', newColor);
      svg.appendChild(chaseCircle);
      newRadius += newSpeed;
    }

    // 3. 圆环继续扩散
    ringRadius += ringSpeed;

    // 4. 检查动画是否完成
    if (ringRadius < maxRadius) {
      animationFrameId = requestAnimationFrame(animateDiffusion);
    } else {
      // 动画完成，延迟一点显示新页面
      setTimeout(() => {
        showNewPage.value = true;
        showAnimation.value = false;
      }, 300);
      cancelAnimationFrame(animationFrameId);
    }
  };

  // 启动动画
  animationFrameId = requestAnimationFrame(animateDiffusion);
};

// 重置页面到初始状态
const resetPage = () => {
  showNewPage.value = false;
  username.value = '';
  password.value = '';
  rememberMe.value = false;

  // 重置波浪位置
  currentSlide1.value = 0;
  currentSlide2.value = 0;
  currentSlide3.value = 0;
  currentSlide4.value = 0;
  currentSlide5.value = 0;

  loginOpacity.value = 0;
  stage.value = 'wave';
  startWaveAnimation();
  isLoading.value = false; // 返回登录页，恢复按钮
};

// 监听滚动条显示状态，添加相应的类
watch(showScrollbar, (newVal) => {
  if (container.value) {
    if (newVal) {
      container.value.classList.add('show-scrollbar');
    } else {
      container.value.classList.remove('show-scrollbar');
    }
  }
});

onMounted(() => {
  startWaveAnimation();
  checkWindowSize();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  // 清理动画帧和事件监听
  if (waveAnimationId) cancelAnimationFrame(waveAnimationId);
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  window.removeEventListener('resize', handleResize);
  clearTimeout(scrollTimeout);
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

input:focus::placeholder {
  color: transparent;
  transition: color 0.2s ease;
}

.container {
  position: fixed;
  top: 0;
  left: 0;
  width: 1920px;
  height: 1080px;
  max-width: none;
  max-height: none;
  overflow: hidden;
  background-color: #e6f2ff;
  /* 只保留垂直滚动条样式设置 */
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
  transition: scrollbar-color 0.3s ease;
}

/* 小窗模式下的容器样式 - 明确禁用水平滚动 */
.container.small-window {
  position: absolute;
  overflow-x: hidden; /* 禁用水平滚动 */
  overflow-y: auto;  /* 启用垂直滚动 */
  width: 100%;
  height: 100%;
}

/* 滚动条显示状态 - 只针对垂直滚动条 */
.container.show-scrollbar {
  scrollbar-color: rgba(99, 179, 237, 0.6) rgba(224, 231, 255, 0.2);
}

/* Chrome/Safari 滚动条样式 - 隐藏水平滚动条，保留垂直 */
.container::-webkit-scrollbar {
  width: 6px;   /* 垂直滚动条宽度 */
  height: 0;    /* 水平滚动条高度设为0，隐藏 */
}

.container::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 3px;
  transition: background 0.3s ease;
}

.container::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 3px;
  transition: background 0.3s ease;
}

.container.show-scrollbar::-webkit-scrollbar-track {
  background: rgba(224, 231, 255, 0.2);
}

.container.show-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(99, 179, 237, 0.6);
}

.container.show-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(49, 130, 206, 0.8);
}

.container::-webkit-scrollbar-corner {
  background: transparent;
}

/* 动画容器 */
.animation-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 20;
  pointer-events: none;
}

/* 海浪容器 */
.waves-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: opacity 1s ease;
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

/* 登录框 */
.login-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  transition: all 0.5s ease;
  user-select: none;
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 30px;
  backdrop-filter: blur(10px);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  color: #1a365d;
  margin-bottom: 8px;
  font-size: 24px;
  font-weight: 600;
}

.login-header p {
  color: #718096;
  font-size: 14px;
}

.login-form .form-group {
  margin-bottom: 20px;
}

.login-form label {
  display: block;
  margin-bottom: 8px;
  color: #4a5568;
  font-size: 14px;
  font-weight: 500;
}

.input-wrapper {
  position: relative;
}

.login-form input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.login-form input:focus {
  outline: none;
  border-color: #63b3ed;
  box-shadow: 0 0 0 3px rgba(99, 179, 237, 0.1);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  font-size: 14px;
}

.remember-me {
  display: flex;
  align-items: center;
  color: #4a5568;
  cursor: pointer;
}

.remember-me input {
  margin-right: 2px;
  cursor: pointer;
}

.forgot-password {
  color: #3182ce;
  text-decoration: none;
  transition: color 0.2s ease;
}

.forgot-password:hover {
  color: #2b6cb0;
  text-decoration: underline;
}

.login-btn {
  width: 100%;
  padding: 12px;
  background-color: #3182ce;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-btn:hover {
  background-color: #2b6cb0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(49, 130, 206, 0.2);
}

.login-btn:active {
  transform: translateY(0);
}

.register-prompt {
  text-align: center;
  margin-top: 20px;
  color: rgb(113, 128, 150);
  font-size: 14px;
}

.register-prompt a {
  color: #3182ce;
  text-decoration: none;
  font-weight: 500;
}

.register-prompt a:hover {
  text-decoration: underline;
}

/* 新页面 */
.new-page {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(255, 255, 255);
  color: #333;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 20;
  transition: opacity 0.5s ease;
}

.new-page h1 {
  font-size: 32px;
  margin-bottom: 16px;
}

.new-page p {
  font-size: 18px;
  opacity: 0.8;
  margin-bottom: 30px;
}

/* 响应式设计 - 小窗模式 */
@media (max-width: 1920px), (max-height: 1080px) {
  .container {
    overflow-x: hidden; /* 禁用水平滚动 */
    overflow-y: auto;  /* 启用垂直滚动 */
  }
}
</style>
