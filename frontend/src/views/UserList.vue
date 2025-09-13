<template>
  <div>
    <h1>用户列表</h1>
    <ul>
      <li v-for="user in users" :key="user.id">
        {{ user.name }} - {{ user.username }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, onMounted } from 'vue';

const users = ref([]);

onMounted(() => {
  // 假设 Django 后端的用户接口是 /api/users/
  axios.get('http://localhost:8000/api/users/')
    .then(response => {
      users.value = response.data;
    })
    .catch(error => {
      console.error('获取用户失败：', error);
    });
});
</script>

<style scoped>
h1 {
  color: #42b983;
  margin-bottom: 16px;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin-bottom: 8px;
  padding: 8px;
  background-color: #f5f5f5;
  border-radius: 4px;
}
</style>
