<template>
  <div class="rich-editor">
    <div class="pub-tips">
      按下Enter换行，Ctrl+Enter保存
    </div>
    <div :id="selector" class="area"></div>
    <!-- <div class="tag-bottom" style="display: flex">
      <div v-for="(item, index) in tags" @click="selectTage(item)" :key="index">{{ item.label }}</div>
    </div> -->
  </div>
</template>
<script>
// https://gitcode.net/codechina_dev/awesome-markdown-editor
// import { imageUploader, videoUploader, fileUploader } from './upload';
export default {
  data() {
    return {
      mdEditor: null,
      txtCount: 0,
      uploader: null,
    };
  },
  computed: {},
  props: {
    selector: {
      type: String,
      default: 'mdEditor',
    },
    tags: {
      type: Array,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: [],
    },
    placeholder: {
      type: String,
      default: '请编写您的帖子内容',
    },
    config: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {},
  methods: {
    replay() {
      this.$emit('replayBack');
    },
    closeEditor() {
      this.$emit('closeEditor');
    },
    focus() {
      this.mdEditor.focus();
    },
    // 获取
    getData() {
      return this.mdEditor.getValue();
    },
    // 设置值
    setData(str) {
      this.mdEditor && this.mdEditor.setValue(str);
    },
    // 切换Tab
    toggleTab(str) {
      this.mdEditor.toggleTab && this.mdEditor.toggleTab(str);
    },
    async getVideoPlayLength() {
      const temp = await this.mdEditor.getVideoList();
      return temp;
    },
    // 1.渲染MD
    rederMdEditor() {
      var that = this;
      const height = this.$el.parentElement.offsetHeight - 250;
      // eslint-disable-next-line
      this.mdEditor = new MdEditor({
        height: height < 300 ? 300 : height,
        //   {
        //   rows: 20,
        //   extraPlugins: 'uploadimage, autogrow, editorplaceholder',
        //   autoGrow_minHeight: 300,
        //   autoGrow_maxHeight: 600,
        // },
        el: `#${this.selector}`,
        themeOptions: {
          // borderColor: '#E8E7E8',
          // textColor: '#999AAA',
          // codeTheme: 'light',
          // textColorActive: '#222226',
          // borderColorActive: 'red',
        },
        toolsOptions: {
          call: false,
          file: false,
          video: false,
          headline: true,
          img: false,
          bold: true,
          italic: true,
          quote: true,
          code: true,
          link: true,
          ul: true,
          ol: true,
          task: true,
          table: true,
          help: true,
          fullScreen: true,
        },
        rows: 'auto',
        placeholder: that.placeholder,
        fullScreen: false,
        showWordLimit: true,
        onChange: function(res) {
          that.txtCount = res.text.replace(/[\r\n\v]+/g, '').length;
          that.$emit('count', that.txtCount);
          that.$emit('change', res);
        },
        onBlur: function(res) {
          that.$emit('blur', res.text);
        },
        onFocus: function(res) {},
        onUpload: function(file, type, callback) {
          if (type === 'img') {
            // imageUploader(file).then(callback);
          } else if (type === 'file') {
            if (/video/.test(file.type)) {
              alert('暂不支持上传视频');
            } else {
              // fileUploader(file).then(callback);
            }
          } else if (type === 'video') {
            // videoUploader(file).then(callback);
          } else {
            // 兼容之前只有上传图片
            // imageUploader(file).then(callback);
          }
        },
        onLoad: function(res) {
          that.txtCount = res.text.replace(/[\r\n\v]+/g, '').length;
          that.$emit('count', that.txtCount);
          that.$emit('loaded');
        },
        onSubmit: function(res) {
          that.$emit('doSubmit');
          // console.log(res, 'submit');
        },
        ...this.config,
      });
    },
  },
  mounted() {
    this.rederMdEditor();
  },
};
</script>

<style lang="scss">
.rich-editor {
  textarea::-webkit-textarea-placeholder {
    color: #999aaa;
  }
  textarea:-moz-placeholder {
    color: #999aaa;
  }
  textarea::-ms-textarea-placeholder {
    color: #999aaa;
  }
  .cke_toolbar .cke_toolgroup::after {
    display: none;
  }
  .cke_bottom {
    display: none;
  }
  .cke_chrome {
    border-top: none;
  }
  .pub-tips {
    font-size: 14px;
    position: absolute;
    user-select: none;
    color: #999aaa;
    right: 20px;
    bottom: 83px;
    z-index: 3;
  }
}

.area {
  opacity: 0;
}
#cke_editor {
  border-top-width: 0;
}
#cke_editorMain {
  border-top-width: 0;
}
.cke_top {
  border-bottom: 1px solid #eaeaef;
  padding: 0 !important;
  background: #f8f8f9;
  height: 51px !important;
}
.rich-editor {
  position: relative;
  background: #ffffff;
  border-radius: 4px;
  .close-editor {
    font-size: 16px;
    position: absolute;
    top: 8px;
    right: 10px;
    cursor: pointer;
  }
  .close-editor {
    font-size: 16px;
    font-weight: 400;
    color: #999aaa;
    line-height: 16px;
  }
  .replay-btm {
    position: absolute;
    width: 80px;
    height: 28px;
    background: #fc5531;
    border-radius: 100px;
    bottom: 12px;
    right: 12px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    line-height: 28px;
    text-align: center;
    cursor: pointer;
    z-index: 2;
  }
  a.cke_button {
    padding: 0 8px !important;
  }
}
.tag-bottom {
  margin: 20px;
  div {
    width: 120px;
    text-align: center;
    border-bottom: 1px solid #1a91e7;
    margin: 10px 20px;
  }
}
</style>
