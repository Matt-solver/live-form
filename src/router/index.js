import Vue from "vue";
import VueRouter from "vue-router";
import DynamicMatcher from "@/views/DynamicMatcher";
import KycResult from "@/views/components/Step5_result";
import ErrorPage from "@/views/components/ErrorPage";

Vue.use(VueRouter);

const routes = [
  {
    path: "/main/:name",
    name: "main",
    component: DynamicMatcher,
  },
  {
    path: "main/step/result",
    name: "Step5",
    component: KycResult,
  },
  {
    path: "/main/error",
    name: "ErrorPage",
    component: ErrorPage,
  },
];

export default new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

