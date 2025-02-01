<template>
  <van-nav-bar title="地址管理" left-text="返回" left-arrow @click-left="router.back()" />
  <div v-if="isLoading">
    <van-skeleton title :row="3" />
    <van-skeleton title :row="3" />
    <van-skeleton title :row="3" />
  </div>
  <div v-else>
    <van-address-edit
      v-if="data?.data"
      :address-info="data.data"
      :show-area="false"
      show-set-default
      @save="save"
      show-delete
      @delete="remove"
      :tel-maxlength="11"
      :detail-rows="4"
    />
    <van-empty v-else :image="empty" image-size="100" description="未找到对应地址" />
  </div>
</template>
<script setup>
import { ref, watchEffect } from "vue";
import useFetch from "@/hooks/useFetch";
import axios from "axios";
import empty from "@/assets/empty.png";
import { showSuccessToast, showFailToast } from "vant";

let route = useRoute();
let router = useRouter();

let { data, isLoading } = useFetch("/address/" + route.params.id);

let stop = watchEffect(() => {
  if (data.value?.data) {
    let item = data.value?.data;
    item.addressDetail = item.address;
    item.tel = item.phone;
    data.value.data = item;

    setTimeout(() => {
      stop();
    }, 0);
  }
});

function save({ name, addressDetail, tel, isDefault }) {
  axios
    .put(`/address/${route.params.id}`, {
      name: name,
      address: addressDetail,
      phone: tel,
      isDefault: isDefault,
    })
    .then(res => {
      if (res.data.success) {
        showSuccessToast(res.data.message);
        router.replace("/client/address/" + res.data.data);
      } else {
        showFailToast(res.data.message);
      }
    });
}

function remove() {
  axios.delete(`/address/${route.params.id}`).then(res => {
    if (res.data.success) {
      showSuccessToast(res.data.message);
      router.push("/client/address");
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
