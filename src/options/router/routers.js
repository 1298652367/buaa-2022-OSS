import Collect from '../pages/Plugins/Collect.vue';

export default [
  {
    path: '/',
    name: 'index',
    redirect: '/plugin/collect',
  },
  {
    path: '/plugin/collect',
    name: 'plugin/collect',
    component: Collect,
  },
];
