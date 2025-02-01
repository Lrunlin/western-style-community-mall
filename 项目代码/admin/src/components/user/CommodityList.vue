<template>
  <div v-if="props.data">
    <Waterfall
      v-if="props.data.length"
      :breakpoints="{
        1200: {
          rowPerView: 4,
        },
        800: {
          rowPerView: 3,
        },
        500: {
          rowPerView: 2,
        },
      }"
      backgroundColor="none"
      :gutter="10"
      :delay="60"
      :list="props.data"
    >
      <template #item="{ item }">
        <div class="bg-gray-50 rounded p-2" @click="router.push(`/client/commodity/${item.id}`)">
          <van-image class="w-full" :src="`${axios.defaults.baseURL}/${item.cover}`" alt="cover">
          </van-image>
          <div class="text-sm mt-2 font-bold truncate">
            {{ item.name }}
          </div>
          <div class="mt-2">
            <span class="!text-orange-600 text-xs">￥</span>
            <span class="!text-orange-600 text-lg font-bold">{{ item.price.toLocaleString() }}</span>
            <span v-if="item.orderCount" class="text-xs text-gray-500 ml-3"
              >销量:{{ formatProductCount(item.orderCount) }}</span
            >
          </div>
        </div>
      </template>
    </Waterfall>
    <van-empty v-else description="空" />
  </div>
  <div v-if="props.isLoading">
    <van-skeleton title :row="3" />
    <van-skeleton title :row="3" />
    <van-skeleton title :row="3" />
  </div>
  <van-empty v-if="props.error" image="error" description="加载错误" />
</template>
<script setup>
import { Waterfall } from "vue-waterfall-plugin-next";
import "vue-waterfall-plugin-next/dist/style.css";
import axios from "axios";
let router = useRouter();

let props = defineProps(["data", "isLoading", "error"]);

function formatProductCount(count) {
  if (count >= 10000) {
    const num = Math.floor(count / 10000);
    return `${num}万+`;
  } else if (count >= 1000) {
    const num = Math.floor(count / 1000);
    return `${num}000+`;
  } else if (count >= 100) {
    const num = Math.floor(count / 100);
    return `${num}00+`;
  } else {
    return `${count}`;
  }
}
</script>
<style scoped lang="scss"></style>
