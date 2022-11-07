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
          <a v-if="cloudUrl" target="_blank" :href="`${cloudUrl}?typeId=${data.cateId}`">{{ data.cateName }}</a>
          <span v-else>{{ data.cateName }}</span>
          <!-- <span v-for="tag in comment.tags" :key="tag">{{ tag }}</span> -->
        </div>
      </div>
      <button class="plugin-btn primary" @click="$emit('create')">新建</button>
    </div>
    <div class="comment-list-wrapper">
      <div class="comment-list" v-if="commentList && commentList.length">
        <ul class="comment-list-inner content">
          <li v-for="comment in commentList" :key="comment.id">
            <a :href="data.url" target="_blank">
              <div class="comment-time">
                <span>{{ comment.updateTime }} {{ comment.formatTime }}</span>
                <a-dropdown :trigger="['click']" class="comment-more">
                  <a-icon type="more" @click.stop="e => e.preventDefault()" style="color: #4d4d4d;font-size:16px;" />
                  <a-menu slot="overlay">
                    <a-menu-item>
                      <div @click="editComment(comment)"><a-icon type="edit" theme="filled" style="font-size:14px;margin-right:8px;" />编辑</div>
                    </a-menu-item>
                    <!-- <a-menu-item>
                      <div @click="deleteComment(comment)"><a-icon type="delete" theme="filled" style="font-size:14px;margin-right:8px;" />删除</div>
                    </a-menu-item> -->
                  </a-menu>
                </a-dropdown>
              </div>
              <div class="comment-content htmledit_views markdown_views" v-html="comment.content"></div>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from '../plugins/bscroll';
export default {
  data() {
    return {
      bscroll: null,
    };
  },
  computed: {
    commentList() {
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
    deleteComment() {
      // 注意删除唯一一条评论时，是否要删除帖子
      this.$confirm({
        title: '提示',
        content: '确认删除该笔记？',
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          this.$message.success('删除评论');
        },
      });
    },
  },
  watch: {
    commentList(val) {
      if (val.length) {
        this.initScroll();
      }
    },
  },
  mounted() {
    this.initScroll();
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
        border: 1px solid #e5e6eb;
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
            &:hover {
              background: #f3f3f3;
            }
          }
        }
        .comment-content {
          margin-top: 8px;
          font-size: 18px;
          font-weight: 400;
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
