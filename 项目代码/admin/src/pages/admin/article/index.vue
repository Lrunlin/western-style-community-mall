<template>
  <el-card>
    <ArticleEdit :key="key" @onSubmit="onSubmit" />
  </el-card>
</template>
<script setup>
import { ref } from "vue";
import ArticleEdit from "@/components/admin/ArticleEdit/index";
import axios from "axios";
import { ElMessage } from "element-plus";

let key = ref(Math.random() + "" + Math.random());
function onSubmit(params) {
  axios.post(`/article`, params).then(res => {
    if (res.data.success) {
      ElMessage({
        message: res.data.message,
        type: "success",
      });
      key.value = Math.random() + "" + Math.random();
    } else {
      ElMessage({
        message: res.data.message,
        type: "error",
      });
    }
  });
}
</script>
<style scoped lang="scss"></style>
