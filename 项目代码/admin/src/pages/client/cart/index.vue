<template>
  <van-nav-bar title="购物车"> </van-nav-bar>
  <div class="mt-4">
    <div v-if="isLoading" class="animate-pulse bg-gray-200 w-full h-20"></div>
    <div v-else>
      <div v-if="data?.data?.length" class="px-2 mb-2 flex items-center justify-between">
        <van-checkbox v-model="allSelect">全选</van-checkbox>
        <div
          class="cursor-pointer"
          :class="
            Object.values(select).filter(item => !!item).length ? 'text-red-600' : 'text-red-200'
          "
          @click="
            () => {
              if (Object.values(select).filter(item => !!item).length) {
                remove();
              }
            }
          "
        >
          <span>删除</span>
          <span v-if="Object.values(select).filter(item => !!item).length"
            >({{ Object.values(select).filter(item => !!item).length }})</span
          >
        </div>
      </div>
      <div
        class="flex items-center"
        v-for="(item, index) in data.data"
        v-if="data?.data?.length"
        :key="item.cart_id"
      >
        <van-checkbox v-if="item.count" v-model="select[item.cart_id]" class="mx-2"></van-checkbox>
        <van-card
          v-if="item.count"
          class="flex-1 mr-2"
          :price="item.commodity_price"
          :title="item.commodity_name"
          :thumb="`${axios.defaults.baseURL}/${item.commodity_cover}`"
          :tag="!!item.commodity_inventory ? undefined : '库存不足'"
        >
          <template #num>
            <van-stepper
              v-model="item.count"
              :min="0"
              @plus="updateCart(item.cart_id, 'add')"
              @minus="updateCart(item.cart_id, 'less')"
            />
          </template>
        </van-card>
        <van-submit-bar
          class="mb-14"
          :disabled="!Object.values(select).filter(item => !!item).length"
          :price="price"
          button-text="提交订单"
          @submit="onSubmit"
        />
      </div>
      <van-empty v-else :image="empty" image-size="100" description="暂时没有添加商品" />
    </div>
  </div>
</template>
<script setup>
import { ref, watchEffect } from "vue";
import { useUserData } from "@/store/useUserData";
import axios from "axios";
import empty from "@/assets/empty.png";
import useFetch from "@/hooks/useFetch";
import { showFailToast } from "vant";
import { computed } from "vue";
let { data, isLoading } = useFetch("/cart");

let store = useUserData();

let router = useRouter();

function updateCart(id, type) {
  axios.put(`/cart/${id}`, { type }).then(res => {
    if (res.data.success) {
      if (type == "add") {
        data.value.data.find(item => item.id == id).count++;
      } else {
        data.value.data.find(item => item.id == id).count--;
      }
    } else {
      showFailToast(res.data.message);
    }
  });
}

let select = ref({});
let allSelect = computed({
  get: () => {
    return (
      data.value?.data.filter(item => item.count).length ==
      Object.keys(select.value).filter(item => select.value[item]).length
    );
  },
  set: val => {
    if (val) {
      data.value?.data
        .filter(item => item.count)
        .forEach(item => {
          select.value[item.cart_id] = true;
        });
    } else {
      select.value = {};
    }
  },
});

let price = computed(() => {
  let val = Object.keys(select.value)
    .filter(item => select.value[item])
    .map(id => {
      let item = data.value.data.find(item => item.cart_id == id);
      return item ? item.commodity_price * item.count : 0;
    })
    .reduce((total, item) => (total += item), 0);
  return val * 100 || 0;
});

function onSubmit() {
  router.push({
    path: `/client/order/create`,
    query: { id: Object.keys(select.value).filter(item => select.value[item]) },
  });
}

function remove() {
  let id = Object.keys(select.value)
    .filter(item => select.value[item])
    .map(item => +item);

  axios
    .delete("/cart", {
      params: { id: id },
    })
    .then(res => {
      if (res.data.success) {
        data.value.data = data.value.data.filter(item => {
          return !id.includes(item.cart_id);
        });
        id.forEach(item => {
          delete select.value[item];
        });
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
    "layout": "client"
  }
}
</route>
