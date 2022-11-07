<template>
  <a-menu @click="pushRoute" style="width: 256px" mode="inline" theme="light" :selected-keys="[current]" :default-selected-keys="['index']" :default-open-keys="['plugin']">
    <template v-for="item in list">
      <a-sub-menu :key="item.routeName" v-if="Array.isArray(item.children)">
        <span slot="title">
          <img :src="require(`@options/assets/images/nav/${item.icon}`)" style="width: 26px;height: 26px;margin-right: 4px;" alt="" />
          <span>{{ item.name }}</span></span
        >
        <template v-for="item2 in item.children">
          <a-sub-menu v-if="Array.isArray(item2.children)" :key="item2.routeName">
            <template slot="title">
              <img :src="require(`@options/assets/images/nav/${item2.icon}`)" style="width: 26px;height: 26px;margin-right: 4px;" alt="" />
              <span>{{ item2.name }}</span>
            </template>
            <template v-for="item3 in item2.children">
              <a-menu-item :key="item3.routeName" :title="item3.name">
                <img :src="require(`@options/assets/images/nav/${item3.icon}`)" style="width: 26px;height: 26px;margin-right: 4px;" alt="" />
                <span style="line-height: 40px;display: inline-block">{{ item3.name }}</span>
              </a-menu-item>
            </template>
          </a-sub-menu>
          <a-menu-item v-else :key="item2.routeName" :title="item2.name">
            <img :src="require(`@options/assets/images/nav/${item2.icon}`)" style="width: 26px;height: 26px;margin-right: 4px;" alt="" />
            <span style="line-height: 40px;display: inline-block">{{ item2.name }}</span>
          </a-menu-item>
        </template>
      </a-sub-menu>
      <a-menu-item v-else :key="item.routeName" :title="item.name">
        <img :src="require(`@options/assets/images/nav/${item.icon}`)" style="width: 26px;height: 26px;margin-right: 4px;" alt="" />
        <span style="line-height: 40px;display: inline-block">{{ item.name }}</span>
      </a-menu-item>
    </template>
  </a-menu>
</template>

<script>
import { Menu } from 'ant-design-vue';

export default {
  name: 'layout-menu',
  components: {
    'a-menu': Menu,
    'a-menu-item': Menu.Item,
    'a-sub-menu': Menu.SubMenu,
    // 'a-menu-item-group': Menu.ItemGroup,
  },
  props: {
    list: {
      default: () => [],
      type: Array,
    },
  },
  data() {
    return {
      current: 'WebIframe',
    };
  },
  created() {
    const routerName = window.location.hash.replace('#/', '').toLowerCase() || 'index';
    const current = routerName.split('?')[0];
    const routerList = current.split('/');
    if (routerList.length > 2) {
      routerList.pop();
    }
    this.current = routerList.join('/');
    if (routerList.length > 1) {
      routerList.pop();
    }
  },
  methods: {
    pushRoute({ key }) {
      this.current = key;
      this.$emit('pushRoute', key);
    },
  },
};
</script>

<style scoped></style>
