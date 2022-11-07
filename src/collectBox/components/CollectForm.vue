<template>
  <div class="collect-box_wrapper">
    <div class="collect-box_base-info" v-if="!isIllegalURL">
      <!-- <div class="image" v-if="baseInfo.picture" :style="{ 'background-image': `url(${baseInfo.picture})` }"></div> -->
      <div class="info">
        <div class="title">{{ baseInfo.title }}</div>
        <div class="hostname">
          <span>{{ baseInfo.url }}</span>
        </div>
      </div>
    </div>

    <div class="collect-box_quote" v-if="$sourcePage && $sourcePage.selection">原文内容： {{ $sourcePage.selection }}</div>

    <div class="collect-box_form">
      <Input maxlength="100" v-if="showTitleAndTags" v-model="noteInfo.title" placeholder="请输入笔记标题"></Input>

      <mdEditor
        ref="textArea"
        selector="mdMain"
        @change="v => ((noteInfo.noteMd = v.text), (noteInfo.notehtml = v.html))"
        @doSubmit="submit()"
        placeholder="请输入正文内容"
      ></mdEditor>

      <a-select
        v-if="showTitleAndTags && tags.length"
        v-model="noteInfo.tags"
        mode="tags"
        :allowClear="true"
        style="width:100%;"
        placeholder="标签"
        :options="tags"
        class="tags-select"
        @blur="val => (noteInfo.tags = val.slice(-1))"
        @select="tagSelect"
      ></a-select>
    </div>

    <div class="collect-box_footer">
      <!-- <div class="remove-collect" data-tooltip-text="删除" style="user-select: none;"></div> -->

      <!-- <div class="remove-tips" v-show="!isSaveUriInfo && !isIllegalURL"> 
        <div class="remove-tips-text" style="user-select: none;" @click="$emit('on-noteType-change', true)">撤消</div>
      </div> -->
      <div class="save-status">
        <div class="loading-wrapper" v-show="loading">
          <div class="translate-loading">
            <svg class="circular" viewBox="25 25 50 50"><circle cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10" class="path"></circle></svg>
          </div>
        </div>
        <span>
          {{ loading ? '保存中' : '' }}
        </span>
      </div>

      <div class="btn-group">
        <div class="btn-cancel btn" @click="$emit('close')">
          取消
        </div>
        <div class="btn-save btn" @click="submit()">
          保存
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mdEditor from './mEditor/mdEditor.vue';
import { debounce } from 'lodash';
import UICollectRender from '../libs/UICollectRender';
import Input from './Input.vue';
import NoteCache from '../plugins/note-cache';
import collectServMock from '@/collectBox/api-mock';
// import { collectServ } from '../api';

export default {
  data() {
    return {
      isIllegalURL: false, // 是否是不合法URL
      topicId: '',
      // 编辑评论
      editComment: {
        replyId: '',
        type: '',
      },
      loading: false,
      tags: [],
      noteInfo: {
        title: '',
        noteMd: '',
        notehtml: '',
        tags: [],
      },
      baseInfo: {
        title: '',
        url: '',
        picture: '',
      },
    };
  },
  props: {
    // 社区ID
    communityId: {
      type: Number,
      required: true,
    },
    //
    isSaveUriInfo: {
      type: Boolean,
      default: false,
    },
    userName: {
      type: String,
      default: '',
    },
  },
  computed: {
    // 是否显示标题、tag
    showTitleAndTags() {
      // 有帖子ID && 是收藏
      return !(this.topicId && this.isSaveUriInfo);
    },
    watcherLocalSave() {
      try {
        return this.noteInfo.noteMd + this.isSaveUriInfo + this.noteInfo.title + this.noteInfo.tags.toString();
      } catch (e) {
        return +new Date() + '';
      }
    },
    isEditMode() {
      return !!this.editComment.replyId;
    },
  },
  watch: {
    watcherLocalSave: {
      handler(val) {
        val && this.localSaveDebounce(val);
      },
    },
  },
  methods: {
    tagSelect(val) {
      this.noteInfo.tags = [val];

      this.tags.forEach(v => {
        v.disabled = false;
      });
      const curTagIndex = this.tags.findIndex(v => val === v.value);
      if (curTagIndex > -1) {
        this.tags[curTagIndex] = {
          ...this.tags[curTagIndex],
          disabled: true,
        };
      }
    },
    // 初始化已收藏
    initCollectedData({ topicId, tagId }) {
      this.topicId = topicId;
      this.tagSelect(tagId);
    },
    // 未提交前，写入到本地。下次进入回显
    localSave() {
      const key = this.baseInfo.url || 'newTab';
      if (this.isEditMode) return;

      const data = {
        title: this.replaceTitle(this.noteInfo.title),
        type: this.isSaveUriInfo ? 'collect' : 'note',
        tagIds: [this.userName, this.noteInfo.tags],
      };
      if (this.$refs.textArea) {
        const { text } = this.$refs.textArea.getData();
        data.content = text;
      } else {
        data.content = this.noteInfo.noteMd;
      }
      this.baseInfo.url && NoteCache.set(key, data);
    },
    // 初始化
    async init() {
      let defaultTitle = '';

      if (this.$sourcePage) {
        this.baseInfo.title = this.$sourcePage.title;
        this.baseInfo.url = this.$sourcePage.url;
        this.baseInfo.picture = this.$sourcePage.picture; // 是否支持收藏, 只能收藏合法URL

        const saveUriInfo = !!/^(http|https)/.exec(this.$sourcePage.url);
        this.isIllegalURL = !saveUriInfo;

        defaultTitle = this.isIllegalURL ? '笔记' : this.$sourcePage.title;
        // 写入默认标题
        // eslint-disable-next-line
        this.noteInfo.title = `[${dayjs().format('YYYY/MM/DD HH:mm')}] ${defaultTitle}`;

        // 是否记录
        this.$emit('on-saveUriInfo-change', saveUriInfo);
        // 是否非法
        this.$emit('on-illegal-change', this.isIllegalURL);
      }

      const noteCache = await NoteCache.get(this.baseInfo.url || 'newTab');
      // 有本地缓存并且不是编辑
      if (noteCache && !this.isEditMode) {
        const { title, content, type, tagIds } = noteCache;
        console.log('取得缓存', noteCache);

        if (content) {
          this.$refs.textArea.setData(content);
          const { text, html } = this.$refs.textArea.getData();
          this.noteInfo.notehtml = html;
          this.noteInfo.noteMd = text;
        }
        const unDateTitle = this.replaceTitle(title);
        if (title && title !== defaultTitle) {
          // eslint-disable-next-line
          this.noteInfo.title = `[${dayjs().format('YYYY/MM/DD HH:mm')}]${unDateTitle}` || defaultTitle;
        }
        if (type) {
          this.$emit('on-saveUriInfo-change', type === 'collect');
        }

        if (tagIds && tagIds.length && this.userName) {
          const [userName, tagId] = tagIds;
          if (userName === this.userName) {
            const [locTagId] = tagId;
            this.tagSelect(locTagId);
          }
        }
      }
    },
    /**
     * 关于编辑，这里应该支持两种格式数据，type： collect 、 note
     * 1.现在的编辑数据没有contentMd返回，没法回显
     * 2.缺失编辑评论接口
     *
     * 建议:
     * 1.新做一个edit接口，支持传type, topicId, tagId 针对两种类型数据做处理
     * 2.新增一个delete接口，支持传type, collect => 删除评论, 如果是最后一条 删除帖子
     *                                note => 直接删除帖子
     */
    async edit({ topicId, tagId, data }) {
      this.initCollectedData({ topicId, tagId });
      console.log('edit', { topicId, tagId, data });
      this.editComment.replyId = data.data.id;
      this.editComment.type = data.type;
      if (data?.data?.id) {
        const mdContent = data?.data?.mdContent || data?.data?.description || '';
        this.$refs.textArea.setData(mdContent);
        const { text, html } = this.$refs.textArea.getData();
        this.noteInfo.notehtml = html;
        this.noteInfo.noteMd = text;
      }
    },
    // 提交
    async submit() {
      if (this.loading) return;

      if (!this.noteInfo.noteMd) {
        this.$message.warning('请填写笔记内容');
        return;
      }
      this.loading = true;

      let [tagId] = this.noteInfo.tags;
      if (!tagId) {
        const [defaultTag] = this.tags;
        if (defaultTag) {
          tagId = defaultTag.value;
        }
        console.warn('将使用默认标签', defaultTag);
      } else {
        // 检查tagId是否存在不存在先创建
        const isNewTag = this.tags.find(v => v.value === tagId);
        const [newTagName] = this.noteInfo.tags;
        if (!isNewTag) {
          try {
            // mock
            const newTagResult = await collectServMock.tagCreate(newTagName);
            // const newTagResult = await collectServ.tagCreate(newTagName);
            if (newTagResult) {
              tagId = newTagResult.id;
            }
          } catch (error) {
            return;
          }
        }
      }
      const posdData = {
        source: this.$sourcePage,
        communityId: this.communityId,
        tagId: +tagId,
        type: this.isSaveUriInfo ? 'collect' : 'note',
        title: this.noteInfo.title,
        // 富文本编辑器内容
        content: this.noteInfo.notehtml,
        // markdown编辑器内容
        mdContent: this.noteInfo.noteMd,
      };
      if (this.topicId && posdData.type === 'collect') {
        posdData.topicId = this.topicId;
      }
      if (this.editComment.type && this.editComment.replyId) {
        posdData.replyId = this.editComment.replyId;
        console.log('编辑', posdData);
        // return;
      }
      // mock
      const { code } = await collectServMock.createCollect(posdData);
      // const { code } = await collectServ.createCollect(posdData);
      if (code === 200) {
        if (this.isEditMode) {
          this.$emit('update-list');
          this.$emit('close');
        } else {
          await NoteCache.remove(this.baseInfo.url || 'newTab');
          setTimeout(() => {
            UICollectRender.postMessage('hide');
          }, 800);
        }
      }
      this.loading = false;
    },
    // 获取频道
    async getTagList() {
      // 标签
      const list = await collectServMock.tagList();
      // const list = await collectServ.tagList();
      this.tags = list.map(v => ({
        value: v.id + '',
        label: v.tabName,
        disabled: false,
      }));
      const [defaultTagId] = this.tags;
      if (defaultTagId) {
        this.tagSelect(defaultTagId.value);
      }
    },
    // 取得标题中去除时间的标题
    replaceTitle(title) {
      if (title.trim().length) {
        title = title.trim()[0] === '[' ? title.trim() : title;
      }
      const maybeDateTimes = title.match(/\[(.+?)\]/g);
      if (maybeDateTimes && maybeDateTimes.length) {
        let [maybeDateTime] = maybeDateTimes;
        // 最前面的那个日期
        if (title.indexOf(maybeDateTime) === 0) {
          maybeDateTime = maybeDateTime.slice(1, maybeDateTime.length - 1);
          // eslint-disable-next-line
          if (dayjs(maybeDateTime).isValid()) {
            return title.slice(maybeDateTime.length + 2);
          }
        }
      }
      return title;
    },
  },
  components: { mdEditor, Input },
  async created() {
    this.localSaveDebounce = debounce(this.localSave, 1000, { leading: true });
    await this.getTagList();
    this.init();
  },
};
</script>
