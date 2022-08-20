import Vue from 'vue';
import VueRouter from 'vue-router';
import DynamicMatcher from '@/views/DynamicMatcher.vue';
import KycResult from '@/views/components/StepToResult.vue';
import ErrorPage from '@/views/components/ErrorPage.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/main/:name',
    name: 'main',
    component: DynamicMatcher,
  },
  {
    path: 'main/step/result',
    name: 'Step5',
    component: KycResult,
  },
  {
    path: '/main/error',
    name: 'ErrorPage',
    component: ErrorPage,
  },
];

export default new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});
