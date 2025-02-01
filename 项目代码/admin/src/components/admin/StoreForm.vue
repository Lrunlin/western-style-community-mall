<template>
  <el-form class="max-w-3xl" :model="form" label-width="120px" ref="formRef" :rules="formRules">
    <el-form-item label="店铺名称" prop="name">
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item label="店铺地址" prop="address">
      <el-input v-model="form.address" :rows="2" type="textarea" />
    </el-form-item>
    <el-form-item label="邮箱地址" prop="email">
      <el-input v-model="form.email" />
    </el-form-item>
    <el-form-item label="封面地址" prop="cover_pic">
      <Upload
        :initValue="form.cover_pic"
        @onSubmit="
          val => {
            form.cover_pic = val;
          }
        "
      />
    </el-form-item>
    <el-form-item label="">
      <el-button @click="submitForm" block type="primary" class="w-60 mt-4">提交</el-button>
    </el-form-item>
  </el-form>
</template>
<script setup>
import { ref } from "vue";
import Upload from "@/components/Upload.vue";
import { watchEffect } from "vue";
let formRef = ref();
let form = ref({ email: "", name: "", address: "", cover_pic: null });
const formRules = {
  name: [{ required: true, message: "请输入店铺名称", trigger: "blur" }],
  address: [{ required: true, message: "请输入店铺地址", trigger: "blur" }],
  email: [
    { required: true, message: "请输入邮箱地址", trigger: "blur" },
    { type: "email", message: "请输入有效的邮箱地址", trigger: ["blur", "change"] },
  ],
  cover_pic: [{ message: "请上传封面地址", trigger: "change" }],
};

const emit = defineEmits(["onSubmit"]);
// 设置初始值
const props = defineProps(["initValue"]);
watchEffect(() => {
  if (props.initValue) {
    form.value = props.initValue;
  }
});

const submitForm = () => {
  formRef.value.validate(valid => {
    if (valid) {
      emit("onSubmit", form.value);
    }
  });
};
</script>
<style scoped lang="scss"></style>
