<template>
  <div id="cololect-box">
    <div class="collect-header">
      <img src="./assets/images/logo.png" />
      <span>CSDN·浏览器助手 - C笔记</span>

      <div class="collect-header_right" v-if="!loading && initialized && bbsInfo">
        <a-checkbox :checked="isSaveUriInfo" v-if="tab === 'create' && !isIllegalURL" @change="onChange">
          记录网址
        </a-checkbox>
        <a :href="qaUrl" v-if="qaUrl" target="_blank">
          <img class="home" src="./assets/images/qa.png" alt="" />
        </a>

        <a :href="myCCloudURL" v-if="myCCloudURL" target="_blank">
          <img class="home" src="./assets/images/home.png" alt="" />
        </a>

        <span @click="openSettings">
          <img class="home" src="./assets/images/settings.png" alt="" />
        </span>
        <!-- <div class="close" @click="close"></div> -->
      </div>
    </div>
    <div class="loading" v-if="loading">
      <img src="./assets/images/create.png" alt="" />
      <div class="loading-wrapper">
        <div class="translate-loading">
          <svg class="circular" viewBox="25 25 50 50"><circle cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10" class="path"></circle></svg>
        </div>
      </div>
      <span>加载中...</span>
    </div>
    <div v-else-if="!initialized" class="no-data">
      <img src="./assets/images/create.png" alt="" />
      <span>C笔记是你的网页收藏和笔记助手，可以很方便的将你所喜爱的网站进行收藏·整理，还可以用来写笔记</span>
      <a class="link-text" target="_blank" v-if="blogUrl" :href="blogUrl">进一步了解</a>
      <!-- :class="{ disabled: !initialized }" -->
      <button @click="handlerCreateBBSCloud()" v-if="isLogin">开始写笔记</button>
      <a href="https://passport.csdn.net/login?code=public&platform=plugin&openNewTab=false" v-else class="login-btn" target="_blank">立即登录</a>
    </div>
    <template v-else>
      <Collected v-if="tab === 'collected' && collectedData" :data="collectedData" :cloud-url="myCCloudURL" @create="createComment()" @edit="editComment"></Collected>
      <CollectForm
        v-if="bbsInfo && tab === 'create'"
        ref="CollectForm"
        :userName="userInfo.UserName || ''"
        :isSaveUriInfo="isSaveUriInfo"
        @close="close()"
        @update-list="checkCollected"
        @on-illegal-change="val => (isIllegalURL = val)"
        @on-saveUriInfo-change="val => (isSaveUriInfo = val)"
        :communityId="bbsInfo.communityId"
      >
      </CollectForm>
    </template>
  </div>
</template>

<script>
import { getUserInfo, onUserInfoChange } from './utils/index';
import CollectForm from './components/CollectForm.vue';
import Collected from './components/Collected.vue';
import UICollectRender from './libs/UICollectRender';
// import { collectServ } from '@/collectBox/api';
import collectServMock from '@/collectBox/api-mock';
const bbsBaseURL = process.env.HTTP === 'TEST' ? 'https://test-cms-ccloud.csdn.net/ccloud/' : 'https://bbs.csdn.net/forums/';

export default {
  data() {
    return {
      myCCloudURL: '',
      isSaveUriInfo: false,
      isIllegalURL: false,
      qaUrl: '',
      blogUrl: '',
      //
      loading: true,
      // 是否初始化社区了
      initialized: false,
      // BBS
      bbsInfo: {},
      tab: '',
      userInfo: {
        UserName: '',
      },
      collectedData: null,
    };
  },
  computed: {
    isLogin() {
      return this.userInfo.UserName;
    },
  },
  watch: {
    'userInfo.UserName': {
      async handler(val) {
        if (val) {
          this.loading = true;
          // 已登录 -> 检查是否创建社区了
          const { community, url, qaUrl } = await collectServMock.communityCheck();
          this.initialized = !!community;
          this.blogUrl = url || '';
          this.qaUrl = qaUrl || '';

          if (community) {
            this.bbsInfo = community;
            this.myCCloudURL = bbsBaseURL + community.uriName;

            // 有没有收藏过
            const isCollected = await this.checkCollected();
            // console.log('isCollected', isCollected);
            this.tab = isCollected ? 'collected' : 'create';

            // bbsInfo && 如果已经收藏 && 选择了文本 => 直接进入新建
            this.$nextTick(() => {
              if (isCollected && this.$sourcePage.selection) {
                this.createComment();
              }
            });
          }
          this.loading = false;
        }
      },
    },
  },
  methods: {
    onChange(val) {
      this.isSaveUriInfo = val.target.checked;
    },
    // 新建 （已收藏网页->新建）
    createComment() {
      this.tab = 'create';
      this.$nextTick(() => {
        this.$refs.CollectForm.initCollectedData({
          topicId: this.collectedData.contentId,
          tagId: this.collectedData.cateId,
        });
      });
    },
    editComment(comment) {
      this.tab = 'create';
      this.$nextTick(() => {
        // 编辑时首先应该重设编辑的id 和 分类id
        this.$refs.CollectForm.edit({
          topicId: this.collectedData.contentId,
          tagId: this.collectedData.cateId,
          data: comment,
        });
      });
    },
    // 获取用户信息
    getUserInfo() {
      const getUser = () => {
        getUserInfo().then(user => {
          this.userInfo = user;
          if (!user.UserName) {
            this.loading = false;
            this.initialized = false;
          }
        });
      };
      getUser();
      onUserInfoChange(getUser);
    },
    // 关闭
    close() {
      if (this.collectedData) {
        this.tab = 'collected';
      } else {
        UICollectRender.postMessage('hide');
      }
    },
    openSettings() {
      const url = chrome.runtime.getURL('pages/options.html#/plugin/collect');
      window.open(url, '_blank');
    },
    // 创建社区
    async handlerCreateBBSCloud() {
      const { community } = await collectServMock.communityCreate();
      if (community) {
        this.initialized = true;
        this.bbsInfo = community;
        this.tab = 'create';
      }
    },
    // 检查是否收藏
    async checkCollected() {
      const collectedData = await collectServMock.collected(this.$sourcePage.url);
      // const collectedData = await collectServ.collected(this.$sourcePage.url);
      if (collectedData) {
        const { comments, topicInfo } = collectedData;
        this.collectedData = { ...topicInfo, comments };
        return true;
      }
    },
  },
  components: {
    CollectForm,
    Collected,
  },
  created() {
    this.getUserInfo();
  },
};
</script>
