<template>
  <div class="collected">
    <div class="collect-box_base-info" v-if="data && data.id">
      <!-- <div class="image" :style="{ 'background-image': `url(${data.avatar})` }"></div> -->
      <div class="info">
        <a :href="data.url" target="_blank" class="title">{{ data.topicTitle }}</a>
        <a :href="data.url" target="_blank" class="hostname">
          <div>{{ data.url }}</div>
        </a>
        <div class="tags">
          <!-- <a v-if="cloudUrl"  target="_blank" :href="`${cloudUrl}?typeId=${data.cateId}`">{{ data.cateName }}</a> -->
          <a @click="select(23632)">全部</a>
          <a @click="select(23646)">博客笔记</a>
          <a @click="select(23647)">技术</a>
          <a @click="select(23648)">工作</a>
          <a @click="select(23649)">资料</a>
          <a @click="select(23650)">生活</a>
          <a @click="select(23651)">待办</a>
          <!-- <span v-else>{{ data.cateName }}</span> -->
          <!-- <a v-for="tag in data.comment" :key="tag">{{ filterTag(tag.tagId) }}</a> -->
        </div>
      </div>
      <a-input-search style="position: absolute;width: 267px;top: 86px;left: 259px;" v-model="value" placeholder="搜索笔记名称" enter-button="查询" size="default" />
      <button class="plugin-btn primary" @click="$emit('create')">新建</button>
    </div>
    <div class="comment-list-wrapper">
      <div class="comment-list" v-if="commentsData && commentsData.length">
        <ul class="comment-list-inner content">
          <li v-for="(comment, index) in commentsData" :key="comment.id">
            <a :href="data.url" target="_blank" :style="comment.backColor">
              <div class="comment-time">
                <span style="position: absolute;left: 0;color: #CCC;font-size: 18px;">{{ comment.TitleTime }} {{ comment.formatTime }}</span>
                <a-dropdown :trigger="['click']" class="comment-more">
                  <a-icon type="more" @click.stop="e => e.preventDefault()" style="color: #4d4d4d;font-size:16px;" />
                  <a-menu slot="overlay">
                    <a-menu-item>
                      <div @click="editComment(comment)"><a-icon type="edit" theme="filled" style="font-size:14px;margin-right:8px;" />编辑</div>
                    </a-menu-item>
                    <!-- //删除comment -->
                    <a-menu-item>
                      <div @click="deleteComment(comment)"><a-icon type="delete" theme="filled" style="font-size:14px;margin-right:8px;" />删除</div>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </div>
              <div
                class="comment-content htmledit_views markdown_views"
                style="position: absolute;top: 7px;"
                v-html="comment.TitleContent + ' ' + (backlog[index] === undefined ? '' : backlog[index]) + ' ' + tag[index]"
              ></div>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from '../plugins/bscroll';
import collectServMock from '@/collectBox/api-mock';
export default {
  data() {
    return {
      bscroll: null,
      value: '',
      commentsData: [],
      tag: [],
      backlog: [],
    };
  },
  computed: {
    commentList() {
      this.data.comments.map((item, index) => {
        // eslint-disable-next-line dot-notation
        this.data.comments[index]['TitleContent'] = item.mdContent.slice(0, 12);
        // eslint-disable-next-line dot-notation
        this.data.comments[index]['backColor'] = this.getColor();
        // eslint-disable-next-line dot-notation
        this.data.comments[index]['TitleTime'] = item.title.slice(1, 17);
        // eslint-disable-next-line dot-notation
        this.data.comments[index]['tagId'] = item.tagId;
      });
      console.log(this.data.comments, 'this.data.comments>>>>>>>>>>>>>');
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.commentsData = this.data.comments;
      return this.data.comments;
    },
  },
  props: {
    cloudUrl: {
      type: String,
      default: '',
    },
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    // 查询笔记名称
    // onSearch(name) {
    //   this.commentsData.map((item, index) =>{

    //   })
    // },
    // 根据type返回笔记标签名称
    async getTag(type) {
      const list = await collectServMock.tagList();
      const tagList = list.map(v => ({
        value: v.id + '',
        label: v.tabName,
      }));
      for (let i = 0; i < tagList.length; i++) {
        console.log('tagList[i].value: ' + tagList[i].value);
        console.log(typeof tagList[i].value);
        console.log('type: ' + type);
        if (tagList[i].value === type + '') {
          console.log('getType: in');
          this.tag.push(tagList[i].label);
          return tagList[i].label;
        }
      }
      this.tag.push('待办');
      return '待办';
    },
    async getBacklog(type) {
      const list = await collectServMock.backlogOptionList();
      const backlogOptionList = list.map(v => ({
        value: v.id + '',
        label: v.tabName,
      }));
      for (let i = 0; i < backlogOptionList.length; i++) {
        if (backlogOptionList[i].value === type + '') {
          this.backlog.push(backlogOptionList[i].label);
          return backlogOptionList[i].label;
        }
      }
      this.backlog.push(undefined);
      return undefined;
    },
    // 标签分类查询
    select(type) {
      if (type === 23632) {
        this.commentsData = this.data.comments;
        console.log(23632);
      } else if (type === 23651) {
        this.commentsData = this.data.comments.filter(p => {
          return p.tagId === '23651' + '' || p.tagId === '23652' + '' || p.tagId === '23653' + '' || p.tagId === '23654' + '' || p.tagId === '23655' + '';
        });
      } else {
        this.commentsData = this.data.comments.filter(p => {
          console.log(p, '》》》》》》》》》》》》》》》》》》');
          return p.tagId === type || p.tagId === type + '' || p.tagId[0] === type + '';
        });
      }
      this.tag = [];
      this.backlog = [];
      for (let i = 0; i < this.commentsData.length; i++) {
        this.getTag(this.commentsData[i].tagId);
        this.getBacklog(this.commentsData[i].tagId);
        console.log('tag: ' + this.tag[i]);
        console.log('backlog: ' + this.backlog[i]);
      }
      console.log('commentsData: ' + this.commentsData);
    },
    // 生成随机颜色
    getColor() {
      var str = '0123456789abcdef';
      var color = '#';
      for (var i = 1; i <= 6; i++) {
        color += str[parseInt(Math.random() * 16)];
      }
      return `background: ${color}`;
    },
    // 初始化滚动
    initScroll() {
      this.$nextTick(() => {
        if (this.bscroll) {
          this.bscroll.refresh();
          this.bscroll.scrollTo(0, 0);
        } else {
          this.bscroll = new BScroll('.comment-list', {
            scrollY: true,
            click: true,
            scrollbar: {
              fade: true,
              interactive: true,
            },
            mouseWheel: true,
            bounce: false,
          });
        }
      });
    },
    // 编辑评论
    editComment(comment) {
      this.$emit('edit', { type: 'collect', data: comment });
    },
    // 删除评论
    async deleteComment(comment) {
      // 注意删除唯一一条评论时，是否要删除帖子
      this.$emit('delete', { type: 'collect', data: comment });
    },
  },
  watch: {
    commentList(val) {
      if (val.length) {
        this.initScroll();
      }
    },
    value: {
      immediate: true,
      handler(val) {
        this.commentsData = this.data.comments.filter(p => {
          return p.TitleContent.indexOf(val) !== -1;
        });
      },
    },
  },
  mounted() {
    this.initScroll();
    this.select(23632);
    console.log(this.data, 'this.data....');
  },
  updated() {
    this.initScroll();
  },
};
</script>

<style lang="scss">
.collected {
  padding: 0 20px;
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
  .collect-box_base-info {
    border-bottom: 1px solid #e4e4e4;
    > .info {
      margin: 0 16px 0 0;
      .tags {
        margin-top: 8px;
        a,
        span {
          border-radius: 2px;
          height: 28px;
          background: rgba(34, 34, 38, 0.05);
          border-radius: 2px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #222226;
          padding: 4px 9px;
          display: inline-block;
        }
      }
    }
  }
  .comment-list-wrapper {
    margin: 0 -20px 0 -20px;
    flex: 1;
    position: relative;
    overflow: hidden;
    .comment-list {
      height: 100%;
      overflow-y: hidden;
      overscroll-behavior: contain;
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      flex-direction: column;
      margin: 0;
      padding: 0 20px;

      padding-bottom: 20px;
      li {
        width: 100%;
        display: flex;
        flex-direction: column;
        position: relative;
        // min-height: 130px;
        // border: 1px solid #e5e6eb;
        border-radius: 4px;
        cursor: pointer;
        margin-bottom: 16px;
        transition: all 0.15s linear;
        &:last-child {
          margin-bottom: 0;
        }
        &:hover {
          box-shadow: 0 10px 20px rgba($color: #000000, $alpha: 0.05);
        }
        a {
          padding: 14px 18px 18px;
          border-top-left-radius: 15px;
          border-bottom-left-radius: 15px;
          margin-left: 30%;
        }

        .comment-time {
          display: flex;
          justify-content: space-between;
          align-items: center;
          span {
            font-size: 14px;
            font-weight: 400;
            color: #555666;
            line-height: 24px;
          }
          .comment-more {
            padding: 3px 4px;
            border-radius: 2px;
            flex: 5;
            text-align: right;
            &:hover {
              background: #f3f3f3;
            }
          }
        }
        .comment-content {
          margin-top: 8px;
          font-size: 18px;
          font-weight: 700;
          max-height: 230px;
          color: #222226;
          line-height: 24px;
          word-break: break-all;
          display: -webkit-box;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .delete {
          position: absolute;
          bottom: 18px;
          right: 18px;
          border: 1px solid;
        }
      }
    }
  }
}
</style>
