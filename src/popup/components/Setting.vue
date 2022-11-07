<template>
  <div class="settings-panel">
    <div class="open-settings">
      <div>
        <i aria-label="icon: right" class="anticon anticon-right ant-collapse-arrow">
          <svg viewBox="64 64 896 896" focusable="false" class="" data-icon="reload" width="1em" height="1em" fill="currentColor" aria-hidden="true">
            <path
              d="M909.1 209.3l-56.4 44.1C775.8 155.1 656.2 92 521.9 92 290 92 102.3 279.5 102 511.5 101.7 743.7 289.8 932 521.9 932c181.3 0 335.8-115 394.6-276.1 1.5-4.2-.7-8.9-4.9-10.3l-56.7-19.5a8 8 0 00-10.1 4.8c-1.8 5-3.8 10-5.9 14.9-17.3 41-42.1 77.8-73.7 109.4A344.77 344.77 0 01655.9 829c-42.3 17.9-87.4 27-133.8 27-46.5 0-91.5-9.1-133.8-27A341.5 341.5 0 01279 755.2a342.16 342.16 0 01-73.7-109.4c-17.9-42.4-27-87.4-27-133.9s9.1-91.5 27-133.9c17.3-41 42.1-77.8 73.7-109.4 31.6-31.6 68.4-56.4 109.3-73.8 42.3-17.9 87.4-27 133.8-27 46.5 0 91.5 9.1 133.8 27a341.5 341.5 0 01109.3 73.8c9.9 9.9 19.2 20.4 27.8 31.4l-60.2 47a8 8 0 003 14.1l175.6 43c5 1.2 9.9-2.6 9.9-7.7l.8-180.9c-.1-6.6-7.8-10.3-13-6.2z"
            ></path>
          </svg>
        </i>
        <span @click="reload()" class="reload">重启插件</span>
      </div>
      <div @click="openUrl('pages/options.html')">
        <span>更多设置</span>
        <i aria-label="icon: right" class="anticon anticon-right ant-collapse-arrow">
          <svg viewBox="64 64 896 896" data-icon="right" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class="">
            <path
              d="M765.7 486.8L314.9 134.7A7.97 7.97 0 0 0 302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 0 0 0-50.4z"
            ></path></svg
        ></i>
      </div>
    </div>
    <div class="controlls">
      <!-- <div class="white-card">
        <h4>全局搜索栏</h4>
        <div class="common-settings">
          <ul>
            <li>
              <span>快捷键唤起: </span>
              <SearchBoxSwitch />
            </li>
          </ul>
        </div>
      </div> -->
      <!-- <div class="white-card">
        <h4>JSON配置</h4>
        <div class="common-settings">
          <ul>
            <li>
              <span>开启页面自动格式化: </span>
              <a-switch @change="autoFormatChange" v-model="jsonConfig.autoFormatJSONPage" />
            </li>
          </ul>
        </div>
      </div> -->
      <Collect title="C笔记配置"></Collect>
      <!-- <PluginMange title="内置插件配置"></PluginMange> -->
    </div>
  </div>
</template>

<script>
import Collect from '@/options/pages/Plugins/Collect.vue';
// import PluginMange from '@/options/pages/Plugins/PluginMange.vue';
import Settings from '@/utils/settings';
export default {
  data() {
    return {
      jsonConfig: {},
      value: false,
    };
  },
  components: {
    Collect,
    // PluginMange,
  },
  created() {
    const jsonConfig = JSON.parse(JSON.stringify(Settings.get('jsonConfig')));
    if (jsonConfig) {
      this.jsonConfig = jsonConfig;
    }
  },
  methods: {
    reload() {
      chrome.runtime.reload();
    },
    autoFormatChange(res) {
      Settings.set('jsonConfig', { ...this.jsonConfig, autoFormatJSONPage: res });
    },
    openUrl(url, isExtensionUrl = true) {
      const optionsUrl = isExtensionUrl ? chrome.runtime.getURL(url) : url;
      chrome.tabs.create({ active: true, url: optionsUrl }, () => chrome.runtime.lastError);
    },
  },
};
</script>

<style lang="scss">
.settings-panel {
  .open-settings {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 12px 4px 16px;
    font-size: 14px;
    height: 30px;
    margin-bottom: 8px;
    margin-top: 2px;
    > span,
    > div {
      cursor: pointer;
    }

    > div {
      span,
      i {
        color: #222226;
        transition: all 0.2s;
      }
      &:hover {
        span,
        i {
          color: #606060;
        }
      }
    }
    span {
      line-height: 30px;
      margin: 0 4px;
      font-weight: 400;
      user-select: none;
      overflow: hidden;
      word-break: break-all;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .white-card {
    padding: 0 20px;
    margin-bottom: 20px;
    .common-settings {
      > ul {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          margin-top: 8px;
          display: flex;
          justify-content: space-between;

          > span {
            width: 160px;
            color: rgba(0, 0, 0, 0.85);
            font-size: 14px;
            display: inline-block;
          }

          &:first-child {
            margin-top: 0;
          }
        }
      }
    }
  }
}
@media (prefers-color-scheme: dark) {
  .settings-panel {
    .open-settings {
      > div {
        span,
        i {
          color: #d5d5d5;
          transition: all 0.2s;
        }
        &:hover {
          span,
          i {
            color: #909090;
          }
        }
      }
      // .reload {
      //   color: #959595;
      //   &:hover {
      //     color: #7d7d7d;
      //   }
      // }
    }
    .white-card {
      h4 {
        color: #d5d5d5;
      }
      .common-settings {
        > ul {
          li {
            > span {
              color: #d5d5d5;
            }
          }
        }
      }
    }
  }
}
</style>
