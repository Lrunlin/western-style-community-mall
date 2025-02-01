<template>
  <el-card> <CommodityForm :key="key" @onSubmit="onSubmit" /> </el-card>
</template>
<script setup>
import CommodityForm from "@/components/admin/CommodityForm";
import axios from "axios";
import { ElMessage } from "element-plus";

let key = ref(+new Date() + "" + Math.random());
function onSubmit(params) {
  axios.post("/commodity", params).then(res => {
    if (res.data.success) {
      ElMessage({
        message: res.data.message,
        type: "success",
      });
      key.value = +new Date() + "" + Math.random();
    } else {
      ElMessage.error(res.data.message);
    }
  });
}
</script>
<style scoped lang="scss"></style>
