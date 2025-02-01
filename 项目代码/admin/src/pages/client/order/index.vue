<template>
  <van-nav-bar title="我的订单" left-text="返回" left-arrow @click-left="router.back()" />
  <div v-if="isLoading">
    <van-skeleton :row="3" />
    <van-skeleton :row="3" />
    <van-skeleton :row="3" />
  </div>
  <div v-else>
    <div
      v-if="data?.data.length"
      class="px-2 py-1 border-0 border-b border-gray-200 border-solid"
      v-for="(item, index) in data?.data"
      :key="item.id"
    >
      <!-- 商品信息遍历 -->
      <van-card
        v-for="(item, index) in item.commodity_data"
        :key="item.id + 'commodity_data' + index"
        :num="item.count"
        :price="item.price"
        :desc="item.description"
        :title="item.name"
        :thumb="`${axios.defaults.baseURL}/${item.cover}`"
        @click="router.push(`/client/commodity/${item.id}`)"
      />

      <!-- 操作按钮 -->
      <div class="flex justify-end mt-4">
        <div>
          <van-button
            size="small"
            type="primary"
            round
            class="!mr-2"
            @click="comment(item.id, item.state)"
            v-if="!item.is_reviewed"
            >评论</van-button
          >
          <van-button
            size="small"
            type="danger"
            round
            v-if="item.state == 2"
            icon="success"
            disabled
            >交易完成</van-button
          >
          <van-button size="small" type="danger" round v-else @click="finish(item.id)"
            >确认收货</van-button
          >
        </div>
      </div>
      <!-- 订单信息 -->
      <div class="ml-4 mt-4 text-sm text-gray-500">
        <div>订单号:{{ item.id }}</div>
        <div v-if="item.logistics_number">
          物流信息:<span class="font-bold">{{ item.logistics_number }}</span>
        </div>
        <div>支付凭证:{{ item.payment_method }}</div>
        <div v-if="item.notes">订单备注:{{ item.notes }}</div>
        <div>
          <div class="font-bold">物流信息:</div>
          <div class="mt-1 mb-1">
            <div><span>姓名:</span>{{ item.address_data.name }}</div>
            <div><span>电话号码:</span>{{ item.address_data.phone }}</div>
            <div class="break-all"><span>详细地址:</span>{{ item.address_data.address }}</div>
          </div>
        </div>
        <div>创建时间:{{ moment(item.create_time).format("YYYY-MM-DD hh:mm:ss") }}</div>
      </div>
    </div>
    <van-empty v-else :image="empty" image-size="100" description="暂时没有订单哦" />
  </div>

  <van-back-top />
</template>
<script setup>
import { ref } from "vue";
import useFetch from "@/hooks/useFetch";
import empty from "@/assets/empty.png";
import axios from "axios";
import moment from "moment";
import { showSuccessToast, showFailToast } from "vant";
import { showNotify } from "vant";

let router = useRouter();

let { data, isLoading, refetch } = useFetch("/order");

function finish(id) {
  console.log(id);
  axios.put(`/order/finish/${id}`).then(res => {
    if (res.data.success) {
      refetch();
      showSuccessToast(res.data.message);
    } else {
      showFailToast(res.data.message);
    }
  });
}

function comment(id, state) {
  if (state != 2) {
    showNotify({ type: "warning", message: "请在订单完成后进行评论" });
  } else {
    router.push(`/client/comment/${id}`);
  }
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
