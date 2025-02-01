<template>
  <van-nav-bar title="下单" left-text="返回" left-arrow @click-left="router.back()" />
  <div class="animate-pulse bg-gray-200 w-full h-16" v-if="addressIsLoading"></div>
  <div v-else class="cursor-pointer border-0 border-b border-solid border-gray-200">
    <div class="py-2 px-3" v-if="detail" @click="show = true">
      <div>
        <span class="font-bold">{{ detail.name }}</span>
        <span class="ml-2">{{ detail.phone }}</span>
        <van-tag v-if="detail.isDefault" class="ml-2" round type="primary">默认</van-tag>
      </div>
      <div class="break-all mt-2 text-sm">{{ detail.address }}</div>
    </div>
    <div v-else class="flex justify-center mt-4 pb-4">
      <van-button type="primary" round @click="router.push('/client/address/create')"
        >新增地址</van-button
      >
    </div>
  </div>

  <!-- 商品信息部分 -->
  <!-- 单个订单 -->
  <div class="mt-4" v-if="!typeIsCart">
    <div v-if="commodityIsLoading" class="animate-pulse bg-gray-200 w-full h-20"></div>
    <div v-else>
      <van-card
        v-if="commodityData.data"
        :price="commodityData.data.price"
        :desc="commodityData.data.description"
        :title="commodityData.data.name"
        :thumb="`${axios.defaults.baseURL}/${commodityData.data.cover}`"
      >
        <template #num>
          <van-stepper v-model="count" :min="1" />
        </template>
      </van-card>
      <van-empty v-else :image="empty" image-size="100" description="没有找到对应商品" />
    </div>
  </div>

  <!-- 购物车 -->
  <div class="mt-4" v-else>
    <div v-if="cartIsLoading" class="animate-pulse bg-gray-200 w-full h-20"></div>
    <div v-else>
      <van-card
        v-for="(item, index) in cartData?.data"
        :key="index"
        v-if="cartData?.data"
        :price="item.commodity_price"
        :desc="item.commodity_description"
        :title="item.commodity_name"
        :thumb="`${axios.defaults.baseURL}/${item.commodity_cover}`"
      >
        <template #num>
          <van-stepper v-model="item.count" :min="1" />
        </template>
      </van-card>
      <van-empty v-else :image="empty" image-size="100" description="没有找到对应商品" />
    </div>
  </div>
  <!-- 底部信息 -->
  <van-field
    v-model="notes"
    rows="3"
    autosize
    label="备注"
    type="textarea"
    maxlength="50"
    placeholder="请输入备注"
    show-word-limit
  />
  <van-radio-group icon-size="16" v-model="payment" class="p-2 mt-6">
    <van-radio name="支付宝"
      ><van-icon size="22" name="alipay" color="#00a5e7" />
      <span class="ml-2">支付宝</span></van-radio
    >
    <van-radio size="22" class="mt-2" name="微信支付"
      ><van-icon name="wechat" color="#00db64" /><span class="ml-2">微信支付</span></van-radio
    >
    <van-radio size="22" class="mt-2" name="数字人民币"
      ><van-icon name="card" color="#c02e38" /><span class="ml-2">数字人民币</span></van-radio
    >
  </van-radio-group>
  <van-submit-bar
    placeholder
    :price="price"
    button-text="提交订单"
    tip-icon="info-o"
    @submit="onSubmit"
  />
  <!-- 地址弹窗 -->
  <van-action-sheet
    v-if="addressData?.data"
    v-model:show="show"
    cancel-text="取消"
    close-on-click-action
    @cancel="show = false"
  >
    <van-address-list
      :list="addressData.data.map(item => ({ ...item, tel: item.phone }))"
      @edit="val => router.push('/client/address/' + val.id)"
      :switchable="false"
      :show-add-button="false"
      @click-item="
        val => {
          show = false;
          detail = val;
        }
      "
    />

    <div class="flex justify-center">
      <van-button
        type="primary"
        block
        round
        class="mt-4 !w-4/5"
        @click="router.push('/client/address/create')"
        >新增地址</van-button
      >
    </div>
  </van-action-sheet>
</template>
<script setup>
import { ref, watchEffect } from "vue";
import useFetch from "@/hooks/useFetch";
import axios from "axios";
import empty from "@/assets/empty.png";
import { showNotify } from "vant";

let route = useRoute();
let router = useRouter();

let typeIsCart = typeof route.query.id != "string";

let {
  data: commodityData,
  isLoading: commodityIsLoading,
  refetch: commodityRefetch,
} = useFetch("/commodity/" + route.query.id, {}, true);

let {
  data: cartData,
  isLoading: cartIsLoading,
  refetch: cartRefetch,
} = useFetch("/cart", { params: { id: route.query.id } }, true);

typeIsCart ? cartRefetch() : commodityRefetch();

let { data: addressData, isLoading: addressIsLoading } = useFetch("/address");
let detail = ref(null);
let stop = watchEffect(() => {
  if (addressData.value) {
    detail.value =
      addressData.value?.data.find(item => item.isDefault) || addressData.value?.data[0];
    setTimeout(() => {
      stop();
    }, 0);
  }
});

let price = computed(() => {
  return typeIsCart
    ? cartData?.value?.data?.reduce((total, item) => {
        console.log(item.count, item.commodity_price);
        return (total += item.count * item.commodity_price * 100);
      }, 0)
    : commodityData.value?.data?.price * 100 * count.value;
});
let show = ref(false);

let count = ref(1);
let payment = ref("支付宝");
let notes = ref("");
function onSubmit() {
  axios
    .post("/order", {
      payment: payment.value,
      commodity_data: typeIsCart
        ? cartData.value.data
            .map(item => ({ id: item.commodity_id, count: item.count }))
            .filter(item => item.count)
        : [{ id: route.query.id, count: count.value }],
      address_id: detail.value.id,
      notes: notes.value,
      cart_id: typeIsCart ? route.query.id : undefined,
    })
    .then(res => {
      if (res.data.success) {
        router.replace("/client/order/success");
      } else {
        showNotify({ type: "warning", message: res.data.message });
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
