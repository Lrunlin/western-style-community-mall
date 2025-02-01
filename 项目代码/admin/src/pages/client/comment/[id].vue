<template>
  <van-nav-bar title="评论" left-text="返回" left-arrow @click-left="router.back()" />
  <div v-if="isLoading">
    <van-skeleton title :row="3" />
    <van-skeleton title :row="3" />
    <van-skeleton title :row="3" />
  </div>
  <div v-else>
    <div v-if="data?.data">
      <div v-for="(item, index) in data.data.commodity_data" :key="index + '' + item.id">
        <van-card
          :price="item.price"
          :desc="item.description"
          :title="item.name"
          :thumb="`${axios.defaults.baseURL}/${item.cover}`"
          :num="item.count"
        />
        <van-rate :size="16" class="mt-2 ml-2" v-model="item.score" allow-half />
        <van-field
          class="mt-3"
          v-model="item.message"
          rows="3"
          autosize
          label="评论"
          type="textarea"
          maxlength="50"
          placeholder="请输入评论"
          show-word-limit
        />
      </div>
      <van-button
        round
        class="!w-3/5 !mt-4 !mx-auto"
        type="primary"
        block
        @click="submit"
        :disabled="data.data.is_reviewed"
        >{{ data.data.is_reviewed ? "已评论" : "提交" }}</van-button
      >
    </div>
    <van-empty v-else :image="empty" image-size="100" description="没有找到对应的订单" />
  </div>
</template>
<script setup>
import { ref } from "vue";
import useFetch from "@/hooks/useFetch";
import empty from "@/assets/empty.png";
import axios from "axios";
import { showSuccessToast, showFailToast } from "vant";

let route = useRoute();
let router = useRouter();

let { data, isLoading, refetch } = useFetch("/order/" + route.params.id);

function submit() {
  if (data.value.data.commodity_data.some(item => !item.score)) {
    showFailToast("请将信息填写完整");
    return;
  }
  axios
    .post(`/evaluate/${route.params.id}`, {
      comment: data.value.data.commodity_data.map(item => ({
        commodity_id: item.id,
        score: item.score,
        message: item.message,
      })),
    })
    .then(res => {
      console.log(res.data);
      if (res.data.success) {
        showSuccessToast(res.data.message);
        data.value.data.is_reviewed = true;
      } else {
        showFailToast(res.data.message);
      }
    });
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
