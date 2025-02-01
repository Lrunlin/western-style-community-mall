<template>
  <div class="flex items-center m-2">
    <img class="w-7" src="/logo.svg" alt="logo" />
    <van-search class="w-full" v-model="search" placeholder="请输入搜索关键词" @search="onSearch" />
    <van-badge :content="noticeCount || 0">
      <van-icon name="bell" size="22" color="gray" @click="router.push('/client/notice')" />
    </van-badge>
  </div>
  <div>
    <div v-if="isLoading" class="w-screen  rounded-sm animate-pulse bg-slate-50"></div>
    <div v-else>
      <van-swipe v-if="data?.data" class="my-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item v-for="(item, index) in data.data" :key="item.id">
          <img
            :src="axios.defaults.baseURL + '/' + item.cover"
            alt="banner"
            class="w-screen rounded-sm"
          />
        </van-swipe-item>
        <template #indicator="{ active, total }">
          <div class="custom-indicator">{{ active + 1 }}/{{ total }}</div>
        </template>
      </van-swipe>
    </div>
  </div>
  <ArticleList :isLoading="articleIsLoading" :data="articleData?.data" />
</template>
<script setup>
import { ref } from "vue";
import ArticleList from "@/components/user/ArticleList/index";
import useFetch from "@/hooks/useFetch";
import axios from "axios";
import { computed } from "vue";

let { data, isLoading } = useFetch("/banner");
let { data: articleData, isLoading: articleIsLoading } = useFetch("/article");
let { data: noticeData } = useFetch("/notice");
let noticeCount = computed(() => noticeData.value?.data?.filter(item => !item.is_read)?.length);

let router = useRouter();
let search = ref("");
function onSearch() {
  router.push({ path: "/client/article/search", query: { keyword: search.value } });
}
</script>
<style scoped lang="scss">
.custom-indicator {
  position: absolute;
  right: 5px;
  bottom: 5px;
  padding: 2px 5px;
  font-size: 12px;
  background: rgba(0, 0, 0, 0.1);
}
</style>
<route lang="json">
{
  "meta": {
    "layout": "client"
  }
}
</route>
