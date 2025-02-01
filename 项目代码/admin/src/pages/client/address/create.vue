<template>
  <van-nav-bar title="新增地址" left-text="返回" left-arrow @click-left="router.back()" />
  <van-address-edit
    :key="key"
    :show-area="false"
    show-delete
    show-set-default
    @save="save"
    @delete="router.back()"
    :tel-maxlength="11"
    delete-button-text="取消"
    :detail-rows="4"
  />
</template>
<script setup>
import { ref } from "vue";
import axios from "axios";
import { showNotify } from "vant";

let route = useRoute();
let router = useRouter();
let key = ref(+new Date());
function save({ name, addressDetail, tel, isDefault }) {
  axios
    .post("/address", { name: name, address: addressDetail, phone: tel, isDefault: isDefault })
    .then(res => {
      if (res.data.success) {
        showNotify({ type: "success", message: res.data.message });
        key.value = +new Date();
      } else {
        showNotify({ type: "danger", message: res.data.message });
      }
    });
}

const searchResult = ref([]);
</script>
<style scoped lang="scss"></style>
<route lang="json">
{
  "meta": {
    "layout": "client-empty"
  }
}
</route>
