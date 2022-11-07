<template>
  <div>
    <Layout>
      <template slot="page">
        <router-view></router-view>
      </template>
    </Layout>
  </div>
</template>

<script>
import Layout from './components/Layout';
export default {
  name: 'App',
  data() {
    return {};
  },
  created() {},
  components: {
    Layout,
  },
  methods: {},
};
</script>
