<template>
  <el-card>
    <div v-if="isLoading">
      <el-skeleton :rows="5" />
      <el-skeleton class="mt-4" :rows="5" />
    </div>
    <el-table v-if="!isLoading && data" :data="data.data" style="width: 100%">
      <el-table-column prop="id" label="用户ID" width="120" />
      <el-table-column prop="name" label="名称" width="180" />
      <el-table-column label="头像" width="180">
        <template #default="socpe">
          <img
            class="!w-12 rounded-sm"
            :src="`${axios.defaults.baseURL}/${socpe.row.avatar}`"
            alt="avatar"
          />
        </template>
      </el-table-column>
      <el-table-column prop="email" label="邮箱地址" />
      <el-table-column type="expand" label="订单信息">
        <template #default="socpe">
          <div
            class="px-2 py-1 border-0 border-b border-solid border-gray-200"
            v-for="(item, index) in socpe.row.order_data"
            :class="index && '!mt-6'"
            :key="item.id"
          >
            <el-descriptions direction="vertical" :column="4" border>
              <el-descriptions-item label="订单时间" :span="4"
                >{{ moment(item.create_time).format("YYYY-MM-DD hh:mm:ss") }}
              </el-descriptions-item>
              <el-descriptions-item label="商品信息信息">
                <div class="flex">
                  <div
                    class="bg-gray-50 p-4 rounded-md text-center"
                    v-for="(item, index) in item.commodity_data"
                    :key="index"
                  >
                    <img
                      @click="router.push(`/admin/commodity/${item.id}`)"
                      class="w-20 rounded-sm"
                      :src="`${axios.defaults.baseURL}/${item.cover}`"
                      alt="cover"
                    />
                    <div>{{ item.name }}</div>
                    <div>{{ formatNumber(item.price) }}</div>
                  </div>
                </div>
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script setup>
import useFetch from "@/hooks/useFetch";
import axios from "axios";
import { Edit } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import moment from "moment";
let { data, isLoading } = useFetch("/user-list");
let router = useRouter();

function formatNumber(value) {
  if (value < 1000) {
    return value.toString();
  } else if (value < 10000) {
    const thousands = Math.floor(value / 1000);
    return `${thousands}千`;
  } else {
    const tenThousandths = (value / 10000).toFixed(2);
    return `${tenThousandths}万`;
  }
}
</script>
<style scoped lang="scss"></style>
