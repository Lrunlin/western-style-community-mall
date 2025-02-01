<template>
  <van-uploader v-model="fileList" :max="props.max || 1" :after-read="afterRead" @delete="remove" />
</template>
<script setup>
import { ref, watchEffect } from "vue";
import axios from "axios";

let props = defineProps(["max-count", "initValue"]);

const fileList = ref([]);
let stop = watchEffect(() => {
  if (props.initValue) {
    fileList.value.push({ url: `${axios.defaults.baseURL}/${props.initValue}` });
    setTimeout(() => {
      stop();
    }, 0);
  }
});
let emit = defineEmits(["onSubmit"]);
const afterRead = file => {
  const forms = new FormData();
  forms.append("image", file.file);

  axios.post("/static", forms).then(res => {
    if (!res.data.success) {
      file.status = "failed";
      file.message = "上传失败";
    } else {
      emit("onSubmit", res.data.data);
    }
  });
};

function remove() {
  emit("onSubmit", null);
}
</script>
<style scoped lang="scss"></style>
