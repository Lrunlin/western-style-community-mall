<template>
  <van-field v-model="title" label="标题" placeholder="输入文章标题" :maxlength="50" />
  <van-field name="uploader" label="封面上传">
    <template #input>
      <VantUpload :max="3" :initValue="coverInit" @onSubmit="val => (cover = val)" />
    </template>
  </van-field>
  <van-field
    is-link
    readonly
    label="讲解商品"
    placeholder="点击选择讲解商品"
    @click="show = true"
  />
  <div class="mx-6 mt-3 flex items-center" v-if="commodityData">
    <div class="!max-w-full">
      <van-card
        :price="commodityData.price"
        :desc="commodityData.description"
        :title="commodityData.name"
        :thumb="`${axios.defaults.baseURL}/${commodityData.cover}`"
        class="mr-4"
      />
    </div>
    <van-icon @click="commodity_id = null" size="20" color="red" name="clear" />
  </div>
  <div class="mx-2 mt-4 mb-6">
    <ArticleEdit @onSubmit="h => (html = h)" :initValue="html" />
  </div>
  <van-button @click="submit" type="primary" block round class="!w-3/6 !mx-auto !mb-8"
    >发布</van-button
  >
  <van-dialog
    v-model:show="show"
    title="选择讲解商品"
    show-cancel-button
    :show-confirm-button="false"
  >
    <div class="max-h-[400px] overflow-scroll">
      <van-card
        v-if="commodityList?.data?.length"
        v-for="(item, index) in commodityList?.data"
        :key="item + '/' + index"
        :price="item.price"
        :desc="item.description"
        :title="item.name"
        :thumb="`${axios.defaults.baseURL}/${item.cover}`"
        @click="
          () => {
            commodity_id = item.id;
            show = false;
          }
        "
      />
      <van-empty v-else :image="empty" image-size="100" description="暂时没有商品" />
    </div>
  </van-dialog>

  <van-back-top />
</template>
<script setup>
import { ref } from "vue";
let router = useRouter();
import axios from "axios";
import useFetch from "@/hooks/useFetch";
import empty from "@/assets/empty.png";
import { computed } from "vue";
import ArticleEdit from "@/components/admin/ArticleEdit/Edit";
import { showNotify } from "vant";
import VantUpload from "./VantUpload";

let { data: commodityList } = useFetch("/commodity");

let show = ref(false);

let title = ref("");
let commodity_id = ref(null);
let html = ref("");

let commodityData = computed(() =>
  commodityList.value?.data.find(item => item.id == commodity_id?.value)
);

let cover = ref([]);
let coverInit = ref(false);

let props = defineProps(["initValue"]);
let emit = defineEmits(["onSubmit"]);
let stop = watchEffect(() => {
  if (props.initValue) {
    title.value = props.initValue.title;
    commodity_id.value = props.initValue.commodity_id;
    html.value = props.initValue.content;
    cover.value = props.initValue.cover;
    coverInit.value = props.initValue.cover;

    setTimeout(() => {
      stop();
    }, 0);
  }
});

function submit() {
  if (/!^[\s\S]*.*[^\s][\s\S]*$/.test(title.value)) {
    showNotify({ type: "warning", message: "请填写标题" });
    return;
  }
  if (!/^[\s\S]*.*[^\s][\s\S]*$/.test(html.value)) {
    showNotify({ type: "warning", message: "请填写文章内容" });
    return;
  }
  if (cover.value.length == 0) {
    showNotify({ type: "warning", message: "封面图片的长度为1-3" });
    return;
  }
  emit("onSubmit", {
    title: title.value,
    commodity_id: commodity_id.value,
    cover: cover.value,
    content: html.value,
  });
}
</script>
