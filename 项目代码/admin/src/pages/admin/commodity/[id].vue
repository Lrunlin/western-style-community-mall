<template>
  <el-card >
    <el-skeleton :rows="5" v-if="isLoading" />
    <div v-else>
      <CommodityForm @onSubmit="onSubmit" v-if="data?.success" :initValue="data.data" />
      <el-result v-else icon="error" title="没有找到对应的车型">
        <template #extra>
          <el-button type="primary" @click="router.back()">返回</el-button>
        </template>
      </el-result>
    </div>
  </el-card>
</template>
<script setup>
import CommodityForm from "@/components/admin/CommodityForm";
import axios from "axios";
import { ElMessage } from "element-plus";
import useFetch from "@/hooks/useFetch";
let route = useRoute();
let router = useRouter();
let { data, isLoading } = useFetch(`/commodity/${route.params.id}`);

function onSubmit(params) {
  axios.put(`/commodity/${route.params.id}`, params).then(res => {
    if (res.data.success) {
      ElMessage({
        message: res.data.message,
        type: "success",
      });
    } else {
      ElMessage.error(res.data.message);
    }
  });
}
</script>
<style scoped lang="scss"></style>
