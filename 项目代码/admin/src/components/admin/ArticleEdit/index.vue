<template>
  <el-form class="max-w-3xl" :model="form" label-width="120px" ref="formRef" :rules="formRules">
    <el-form-item label="文章标题" prop="title">
      <el-input v-model="form.title" />
    </el-form-item>
    <el-form-item label="对应商品" prop="commodity_id">
      <el-select v-model="form.commodity_id" placeholder="选择讲解商品">
        <el-option
          v-if="commodityList?.data"
          v-for="item in commodityList.data"
          :key="item.value"
          :value="item.id"
          class="h-28"
        >
          <el-popover placement="right" :title="item.name" :width="450" trigger="hover">
            <div class="flex">
              <div>
                <el-image
                  class="w-[150px] h-[150px]"
                  :src="axios.defaults.baseURL + '/' + item.cover"
                  alt="cover"
                  :zoom-rate="1.2"
                  :max-scale="7"
                  :min-scale="0.2"
                  :preview-src-list="[axios.defaults.baseURL + '/' + item.cover]"
                  :initial-index="0"
                  fit="cover"
                  :hide-on-click-modal="true"
                  :preview-teleported="true"
                />
              </div>
              <div class="ml-4">
                <el-carousel
                  trigger="click"
                  class="w-[250px] h-[100px]"
                  v-if="item?.banner?.length"
                >
                  <el-carousel-item
                    v-for="(item, index) in item.banner.map(
                      item => axios.defaults.baseURL + '/' + item
                    )"
                    :key="index + '' + item.id"
                  >
                    <el-image
                      class="w-[250px] h-[100px]"
                      :src="item"
                      alt="cover"
                      :zoom-rate="1.2"
                      :max-scale="7"
                      :min-scale="0.2"
                      :preview-src-list="[item]"
                      :initial-index="0"
                      fit="cover"
                      :hide-on-click-modal="true"
                      :preview-teleported="true"
                    />
                  </el-carousel-item>
                </el-carousel>
                <div class="flex flex-col">
                  <span class="mt-2 line-clamp-2">{{ item.description }}</span>
                  <div class="flex-grow"></div>
                  <div class="ml-2 mt-4 text-red-700 self-end flex justify-end">
                    <span>￥{{ item.price }}</span>
                  </div>
                </div>
              </div>
            </div>
            <template #reference>
              <div class="flex item-center">
                <img class="w-9 h-9" :src="axios.defaults.baseURL + '/' + item.cover" alt="cover" />
                <span class="ml-2 truncate">{{ item.name }}</span>
              </div>
            </template>
          </el-popover>
        </el-option>
      </el-select>

      <div v-if="form.commodity_id" class="flex items-center cursor-pointer">
        <el-icon color="red" :size="24" class="ml-3" @click="form.commodity_id = null"
          ><CircleCloseFilled
        /></el-icon>
        <span class="ml-3">{{
          commodityList?.data.find(item => item.id == form.commodity_id).name
        }}</span>
      </div>
    </el-form-item>
    <el-form-item label="封面图片" prop="cover">
      <MultipleUpload
        :limit="3"
        :initValue="form.cover"
        @onSubmit="
          val => {
            form.cover = val;
          }
        "
      />
    </el-form-item>
    <el-form-item label="文章内容" prop="content">
      <Edit @onSubmit="val => (form.content = val)" :initValue="form.content" />
    </el-form-item>

    <el-form-item label="">
      <el-button @click="submitForm" block type="primary" class="w-60 mt-4">提交</el-button>
    </el-form-item>
  </el-form>
</template>
<script setup>
import { ref } from "vue";
import MultipleUpload from "@/components/MultipleUpload.vue";
import Edit from "./Edit.vue";
import { watchEffect } from "vue";
import useFetch from "@/hooks/useFetch";
import axios from "axios";
import { CircleCloseFilled } from "@element-plus/icons-vue";

// 表单属性以及验证配置
let formRef = ref();
let form = ref({
  title: "",
  content: "",
  cover: [],
  commodity_id: null,
});
const formRules = {
  title: [{ required: true, message: "请填写标题", trigger: "blur" }],
  content: [{ required: true, message: "请输入文章内容", trigger: "blur" }],
  cover: [
    {
      required: true,
      validator: (rule, value, callback) => {
        if (!Array.isArray(value)) {
          callback(new Error("封面必须是一个数组"));
        } else if (value.length < 1 || value.length > 3) {
          callback(new Error("请上传封面"));
        } else {
          // 通过验证
          callback();
        }
      },
      trigger: "blur",
    },
  ],
};
const submitForm = () => {
  formRef.value.validate(valid => {
    if (valid) {
      emit("onSubmit", form.value);
    }
  });
};

// 组件通信
const emit = defineEmits(["onSubmit"]);
const props = defineProps(["initValue"]);
let stop = watchEffect(() => {
  if (props.initValue) {
    form.value = props.initValue;
    setTimeout(() => {
      if (stop) stop();
    }, 0);
  }
});
let { data: commodityList } = useFetch("/commodity");
</script>
<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
