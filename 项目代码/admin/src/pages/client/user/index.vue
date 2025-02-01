<template>
  <van-nav-bar title="我的">
    <template #left>
      <img src="/logo.svg" alt="logo" class="h-6" />
    </template>
  </van-nav-bar>
  <div v-if="store?.userData" class="p-4">
    <div class="flex">
      <img
        class="w-14 h-14 rounded-full"
        :src="axios.defaults.baseURL + '/' + store?.userData?.avatar"
        alt="face"
      />
      <div class="font-bold text-lg ml-3 mt-1">{{ store?.userData?.name }}</div>
    </div>
    <van-grid :column-num="3" class="mt-6">
      <van-grid-item icon="star-o" to="/client/collection" text="我的收藏" />
      <van-grid-item icon="bookmark-o" to="/client/article" text="我的文章" />
      <van-grid-item icon="orders-o" to="/client/order" text="我的订单" />
      <van-grid-item icon="apps-o" to="/client/address" text="我的地址" />
      <van-grid-item icon="setting-o" to="/client/set" text="信息修改" />
    </van-grid>
    <van-button type="danger" block size="small" class="w-4/5 !mt-4" @click="out" round
      >退出登录</van-button
    >
  </div>
</template>
<script setup>
import { ref, watchEffect } from "vue";
import { useUserData } from "@/store/useUserData";
import axios from "axios";
import cookie from "js-cookie";

let store = useUserData();
watchEffect(() => {
  // console.log(store?.userData?.avatar);
});
let router = useRouter();

function out() {
  localStorage.removeItem("token");
  cookie.remove("token");
  store.set(null);
  router.replace("/client/sign");
}
</script>
<style scoped lang="scss"></style>
<route lang="json">
{
  "meta": {
    "layout": "client"
  }
}
</route>
