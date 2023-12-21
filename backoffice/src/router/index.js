import { createRouter, createWebHistory } from "vue-router";
import Login from "../pages/Login.vue";
import AppDashboard from "../pages/AppDashboard.vue";
import AppDashboardRestaurants from "../pages/AppDashboardRestaurants.vue";
import AppDashboardCreateRestaurant from "../pages/AppDashboardCreateRestaurant.vue";
import AppDashboardMyRestaurant from "../pages/AppDashboardMyRestaurant.vue";
import AppDashboardPlates from "../pages/AppDashboardPlates.vue";
import AppDashboardOrders from "../pages/AppDashboardOrders.vue";
import AppDashboardEditPlate from "../pages/AppDashboardEditPlate.vue";
import { useUserStore } from "../store/user";

function requireAuth(to, from, next) {
  if (!localStorage.getItem("accessToken")) {
    next({
      path: "/login",
      query: { redirect: to.fullPath },
    });
  } else {
    next();
  }
}

function requireAnonymous(to, from, next) {
  if (localStorage.getItem("accessToken")) {
    next({
      path: "/",
    });
  } else {
    next();
  }
}

async function requireRestaurantRole(to, from, next) {
  const userStore = useUserStore();
  await userStore.loadUser();

  if (userStore?.user?.role == "RESTAURANT") {
    next();
  } else if (userStore?.user?.role == "ADMIN") {
    next({ path: "/dashboard/restaurants" });
  } else {
    userStore.logout();
    next({ path: "/" });
  }
}
async function requireAdminRole(to, from, next) {
  const userStore = useUserStore();
  await userStore.loadUser();
  console.log(userStore?.user?.role);
  if (userStore?.user?.role == "ADMIN") {
    next();
  } else if (userStore?.user?.role == "RESTAURANT") {
    next({ path: "/dashboard/my-restaurant" });
  } else {
    userStore.logout();
    next({ path: "/" });
  }
}

const routes = [
  {
    path: "/:pathMatch(.*)*",
    redirect: "/dashboard",
  },
  { path: "/login", component: Login, beforeEnter: requireAnonymous },
  {
    path: "/dashboard",
    component: AppDashboard,
    beforeEnter: requireAuth,
    redirect: "/dashboard/restaurants",
    children: [
      {
        path: "restaurants",
        component: AppDashboardRestaurants,
        beforeEnter: requireAdminRole,
      },
      {
        path: "restaurants/create",
        component: AppDashboardCreateRestaurant,
        beforeEnter: requireAdminRole,
      },
      {
        path: "my-restaurant",
        component: AppDashboardMyRestaurant,
        beforeEnter: requireRestaurantRole,
      },
      {
        path: "plates",
        component: AppDashboardPlates,
        beforeEnter: requireRestaurantRole,
      },
      {
        path: "plates/:plate_id/edit",
        component: AppDashboardEditPlate,
        beforeEnter: requireRestaurantRole,
      },
      {
        path: "plates/create",
        component: AppDashboardEditPlate,
        beforeEnter: requireRestaurantRole,
      },
      {
        path: "orders",
        component: AppDashboardOrders,
        beforeEnter: requireRestaurantRole,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
