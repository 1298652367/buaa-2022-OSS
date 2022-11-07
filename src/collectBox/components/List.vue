<template>
  <div id="collect-list" class="collect-list" ref="scrollView">
    <ul class="content collect-list-inner">
      <li class="collect-item" v-for="(k, i) in list" :key="i">
        <div>
          <pre>{{ k }}</pre>
          <button @click="deleteItem(k, i)">删除</button>
          <button @click="editItem(k, i)">编辑</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import BScroll from '../plugins/bscroll';
import { collectDB } from '../utils/db';

export default {
  data() {
    return {
      bscroll: null,
      list: [],
    };
  },
  created() {},
  methods: {
    async editItem(data) {
      this.$emit('edit', data);
    },
    async deleteItem(data, index) {
      const { id } = data;
      await collectDB.remove(id);
      this.list.splice(index, 1);
    },
    // 初始化滚动
    initScroll() {
      this.$nextTick(() => {
        if (this.bscroll) {
          this.bscroll.refresh();
          this.bscroll.scrollTo(0, 0);
        } else {
          this.bscroll = new BScroll('.collect-list', {
            scrollY: true,
            click: true,
            scrollbar: {
              fade: true,
              interactive: true,
            },
            bounce: false,
            mouseWheel: true,
          });
        }
      });
    },
    async getData() {
      const list = await collectDB.list();
      this.list = list;
    },
  },
  updated() {
    console.log('updated');
    this.initScroll();
  },
  mounted() {
    this.getData();
    this.initScroll();
  },
};
</script>

<style lang="scss">
#collect-list {
  height: calc(100% - 38px);
  position: relative;
  overflow: hidden;
  margin-top: 38px;
  ul {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    flex-direction: column;
    padding: 20px;
    li {
      width: calc(100% - 40px);
      display: flex;
      flex-direction: column;
      position: relative;
      min-height: 130px;
      padding: 14px 18px 18px;
      border: 1px solid #e5e6eb;
      border-radius: 4px;
      cursor: pointer;
      margin-bottom: 16px;
      transition: all 0.15s linear;
      &:hover {
        box-shadow: 0 10px 20px rgba($color: #000000, $alpha: 0.05);
      }
    }
  }
}
</style>
