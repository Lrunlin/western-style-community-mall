<template>
  <van-tabbar route>
    <van-tabbar-item to="/client" icon="home-o">首页</van-tabbar-item>
    <van-tabbar-item to="/client/shop" icon="shop-o">商城</van-tabbar-item>
    <van-tabbar-item to="/client/edit" icon="add-o">发布</van-tabbar-item>
    <van-tabbar-item to="/client/cart" icon="cart-o">购物车</van-tabbar-item>
    <van-tabbar-item to="/client/user" icon="user-o">用户</van-tabbar-item>
  </van-tabbar>
</template>
<script setup>
import { ref } from "vue";
</script>
<style scoped lang="scss"></style>
