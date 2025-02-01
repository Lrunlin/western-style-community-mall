<template>
  <van-nav-bar title="地址修改" left-text="返回" left-arrow @click-left="router.back()" />
  <div v-if="isLoading">
    <van-skeleton title :row="3" />
    <van-skeleton title :row="3" />
    <van-skeleton title :row="3" />
  </div>
  <div v-else>
    <van-address-list
      v-if="data?.data.length"
      v-model="chosenAddressId"
      :list="data.data.map(item => ({ ...item, tel: item.phone }))"
      default-tag-text="默认"
      @add="router.push(`/client/address/create`)"
      @edit="onEdit"
      :switchable="false"
    />
  </div>
</template>
<script setup>
import { ref, watchEffect } from "vue";
import useFetch from "@/hooks/useFetch";
import axios from "axios";
import empty from "@/assets/empty.png";
import { showNotify } from "vant";

let route = useRoute();
let router = useRouter();

let { data, isLoading } = useFetch("/address");

function onEdit(params) {
  router.push("/client/address/" + params.id);
}
</script>
<style scoped lang="scss"></style>
<route lang="json">
{
  "meta": {
    "layout": "client-empty"
  }
}
</route>
