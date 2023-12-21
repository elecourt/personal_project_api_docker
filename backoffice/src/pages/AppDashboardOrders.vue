<script setup>
import ApiService from "../api/ApiService";
import { useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import RestaurantItem from "../components/RestaurantItem.vue";
import OrderItem from "../components/OrderItem.vue";
import { useUserStore } from "../store/user";

const orders = ref([]);
const userStore = useUserStore()
async function loadRestaurantOrders() {
  orders.value = await ApiService.getRestaurantOrders(userStore?.user?._id);
}

async function onOrderCanceled() {
  loadRestaurantOrders();
}
onMounted(() => {
  loadRestaurantOrders();
});
</script>

<template>
  <div>
    <header class="page-header">
      <h1 class="page-title">Commandes</h1>
    </header>
    <div class="orders">
      <OrderItem
        @orderCanceled="onOrderCanceled"
        v-for="order in orders"
        :key="order._id"
        :order="order"
      />
    </div>
  </div>
</template>

<style scoped>
.orders {
  margin-top: 20px;
}
</style>
