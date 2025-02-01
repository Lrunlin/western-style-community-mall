<template>
  <el-card>
    <el-input v-model="search" placeholder="输入订单号" class="!w-80" />
    <el-button type="primary" class="ml-4" @click="searchData(search)">查询</el-button>
  </el-card>
  <el-card class="mt-4">
    <div v-if="isLoading">
      <el-skeleton :rows="5" />
      <el-skeleton class="mt-4" :rows="5" />
    </div>
    <el-table v-else :data="data" style="width: 100%">
      <el-table-column type="expand">
        <template v-slot="socpe">
          <div class="ml-8">
            <div>名称:{{ socpe.row.address_data.name }}</div>
            <div>电话号码:{{ socpe.row.address_data.phone }}</div>
            <div>详细地址:{{ socpe.row.address_data.address }}</div>
          </div>
          <div class="flex mt-4">
            <div
              v-for="(item, index) in socpe.row.commodity_data"
              :key="index"
              class="cursor-pointer w-28 truncate ml-8"
              @click="router.push(`/admin/commodity/${item.id}`)"
            >
              <img
                class="w-12 rounded-full"
                :src="`${axios.defaults.baseURL}/${item.cover}`"
                alt="avatar"
              />
              <div class="mt-2">{{ item.name }}</div>
              <div>价格:{{ item.price }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="订单号" width="130" />
      <el-table-column label="用户" width="130">
        <template v-slot="socpe">
          <div>
            <img
              class="w-12 rounded-full"
              :src="`${axios.defaults.baseURL}/${socpe.row.user_avatar}`"
              alt="avatar"
            />
            <div class="mt-2">{{ socpe.row.user_name }}</div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="状态" width="80">
        <template v-slot="socpe">
          <el-tag type="success" v-if="socpe.row.state == 2">已完成</el-tag>
          <el-tag type="primary" v-else>进行中</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="支付凭证" width="190">
        <template v-slot="socpe">
          <div class="truncate">{{ socpe.row.payment_method }}</div>
        </template>
      </el-table-column>
      <el-table-column label="订单备注" width="190">
        <template v-slot="socpe">
          <div class="truncate">{{ socpe.row.notes }}</div>
        </template>
      </el-table-column>
      <el-table-column label="下单时间">
        <template v-slot="socpe">
          <el-date-picker v-model="socpe.row.create_time" type="datetime" readonly />
        </template>
      </el-table-column>
      <el-table-column label="订单号">
        <template v-slot="socpe">
          <el-input v-model="socpe.row.logistics_number" placeholder="物流号码" class="!w-44" />
          <el-button
            class="ml-4"
            type="primary"
            @click="update(socpe.row.id, socpe.row.logistics_number)"
            >修改</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script setup>
import axios from "axios";
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

let router = useRouter();

let search = ref("");

let isLoading = ref(false);
let data = ref([]);
function searchData(id) {
  isLoading.value = true;
  axios
    .get("/order", { params: { id: id ? +id : undefined } })
    .then(res => {
      if (res.data.success) {
        data.value = res.data.data;
      } else {
        ElMessage.error(`查询失败`);
      }
    })
    .finally(() => {
      isLoading.value = false;
    });
}
searchData();

function update(id, logistics_number) {
  axios.put(`/order/logistics/${id}`, { logistics_number: logistics_number }).then(res => {
    if (res.data.success) {
      ElMessage.success(res.data.message);
    } else {
      ElMessage.error(res.data.message);
    }
  });
}

function formatProductCount(count) {
  if (count >= 10000) {
    const num = Math.floor(count / 10000);
    return `${num}万+`;
  } else if (count >= 1000) {
    const num = Math.floor(count / 1000);
    return `${num}000+`;
  } else if (count >= 100) {
    const num = Math.floor(count / 100);
    return `${num}00+`;
  } else {
    return `${count}`;
  }
}
</script>
<style scoped lang="scss"></style>
