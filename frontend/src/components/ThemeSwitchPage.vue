<template>
  <div class="app-container" :class="{ 'dark': theme === 'dark' }">
    <!-- 主题图标容器 -->
    <div class="theme-icon-container">
      <!-- 拖动轨迹指示线 -->
      <div class="drag-line"></div>

      <!-- 太阳图标（可拖动） -->
      <div
        class="sun-icon"
        :style="sunStyle"
        @mousedown="startDrag"
        @touchstart="startDrag"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      </div>

      <!-- 月亮图标（初始隐藏） -->
      <div class="moon-icon" :class="{ 'show': showMoon }">
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </div>
      <div class="drag-hint" :class="{ 'dark': theme === 'dark' }">
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const theme = ref('light');
const isDragging = ref(false);
const showMoon = ref(false);
const dragStartX = ref(0);
const dragStartY = ref(0);
const currentX = ref(0);
const currentY = ref(0);

// 初始化主题
onMounted(() => {
  const savedTheme = localStorage.getItem('app-theme');
  if (savedTheme) {
    theme.value = savedTheme;
  } else {
    const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    theme.value = isSystemDark ? 'dark' : 'light';
  }
  document.documentElement.classList.toggle('dark', theme.value === 'dark');
});

// 太阳图标样式
const sunStyle = computed(() => {
  if (isDragging.value) {
    return {
      transform: `translate(${currentX.value}px, ${currentY.value}px) rotate(${-(currentX.value + currentY.value) * 0.8}deg)`,
      cursor: 'grabbing'
    };
  }
  return {};
});

// 开始拖动
const startDrag = (event) => {
  event.preventDefault();
  isDragging.value = true;
  showMoon.value = false;

  const clientX = event.touches ? event.touches[0].clientX : event.clientX;
  const clientY = event.touches ? event.touches[0].clientY : event.clientY;

  dragStartX.value = clientX;
  dragStartY.value = clientY;
  currentX.value = 0;
  currentY.value = 0;

  // 添加事件监听器
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('touchmove', onDrag, { passive: false });
  document.addEventListener('mouseup', stopDrag);
  document.addEventListener('touchend', stopDrag);
};

// 拖动中
const onDrag = (event) => {
  if (!isDragging.value) return;

  event.preventDefault();
  const clientX = event.touches ? event.touches[0].clientX : event.clientX;
  const clientY = event.touches ? event.touches[0].clientY : event.clientY;

  // 计算位移（限制向左下方移动）
  currentX.value = Math.min(0, clientX - dragStartX.value);
  currentY.value = Math.max(0, clientY - dragStartY.value);

  // 计算拖动距离（斜线距离）
  const dragDistance = Math.sqrt(Math.pow(currentX.value, 2) + Math.pow(currentY.value, 2));

  // 拖动距离超过100px时显示月亮图标
  if (dragDistance > 100) {
    showMoon.value = true;
  } else {
    showMoon.value = false;
  }
};

// 停止拖动
const stopDrag = () => {
  // 计算拖动距离
  const dragDistance = Math.sqrt(Math.pow(currentX.value, 2) + Math.pow(currentY.value, 2));

  // 如果拖动距离超过阈值，切换主题
  if (dragDistance > 100) {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark', theme.value === 'dark');
    localStorage.setItem('app-theme', theme.value);
  }

  // 重置状态
  isDragging.value = false;
  currentX.value = 0;
  currentY.value = 0;
  showMoon.value = false;

  // 移除事件监听器
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('touchmove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
  document.removeEventListener('touchend', stopDrag);
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  transition: background-color 0.5s ease, color 0.5s ease;
  background-color: #f0f2f5;
  color: #333;
  min-height: 100vh;
  overflow-x: hidden;
}

.dark {
  background-color: #1a1a2e;
  color: #f0f0f0;
}

.app-container {
  min-height: 100vh;
  padding: 2rem;
  position: relative;
}

/* 主题图标容器 */
.theme-icon-container {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  z-index: 1000;
}

/* 太阳图标 */
.sun-icon {
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  user-select: none;
  z-index: 2;
  background: linear-gradient(135deg, #ffdd00, #ff9500);
  box-shadow: 0 0 20px rgba(255, 221, 0, 0.6);
  color: #fff;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

/* 月亮图标（初始隐藏在左侧） */
.moon-icon {
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  z-index: 1;
  background: linear-gradient(135deg, #94a3b8, #475569);
  box-shadow: 0 0 20px rgba(148, 163, 184, 0.6);
  color: #e2e8f0;
  opacity: 0;
  transform: translateX(-80px) rotate(-180deg);
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
  opacity 0.5s ease;
}

/* 月亮图标显示状态 */
.moon-icon.show {
  opacity: 1;
  transform: translateX(0) rotate(0);
}

/* 拖动轨迹指示线 */
.drag-line {
  position: absolute;
  top: 50px;
  right: 50px;
  width: 150px;
  height: 2px;
  background: rgba(255, 149, 0, 0.3);
  transform: rotate(-45deg);
  transform-origin: right top;
  pointer-events: none;
  z-index: 999;
}

.dark .drag-line {
  background: rgba(96, 165, 250, 0.3);
}

/* 拖动提示 */
.drag-hint {
  position: absolute;
  top: 90px;
  right: 20px;
  font-size: 14px;
  color: #666;
  animation: pulse 2s infinite;
  z-index: 1000;
  text-align: right;
}

.dark .drag-hint {
  color: #aaa;
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}

/* 内容区样式 */
.content {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-align: center;
  background: linear-gradient(90deg, #ff9500, #ffdd00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dark .title {
  background: linear-gradient(90deg, #818cf8, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.desc {
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  text-align: center;
  opacity: 0.8;
}

.card {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  transition: all 0.5s ease;
}

.dark .card {
  background-color: rgba(26, 27, 41, 0.9);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #ff9500;
}

.dark .card h3 {
  color: #60a5fa;
}

.card p {
  opacity: 0.9;
  line-height: 1.6;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.feature {
  background: rgba(255, 255, 255, 0.8);
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s ease;
}

.dark .feature {
  background: rgba(39, 40, 60, 0.8);
}

.feature:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.dark .feature:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .theme-icon-container {
    top: 15px;
    right: 15px;
    width: 50px;
    height: 50px;
  }

  .sun-icon, .moon-icon {
    width: 50px;
    height: 50px;
  }

  .drag-hint {
    font-size: 12px;
    top: 80px;
    right: 15px;
  }

  .drag-line {
    width: 120px;
  }

  .content {
    padding: 1rem;
  }

  .title {
    font-size: 2rem;
  }
}
</style>
