<template>
  <div class="collect-config">
    <div class="white-card">
      <h4 v-if="title">{{ title }}</h4>

      <div class="common-settings">
        <ul>
          <li>
            <span>侧边“C笔记”按钮: </span>
            <a-switch v-model="formatForm.button" @change="changeCollect('button', formatForm.button)" />
          </li>

          <li>
            <span>右键菜单: </span>
            <a-switch v-model="formatForm.menu" @change="changeCollect('menu', formatForm.menu)" />
          </li>

          <!-- <li>
            <span>快捷键唤起: </span>
            <a-switch v-model="formatForm.keybord" @change="changeCollect('keybord', formatForm.keybord)" />
          </li> -->
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Settings from '@/utils/settings';

export default {
  data() {
    return {
      formatForm: {
        keybord: true,
        menu: true,
        button: true,
      },
    };
  },
  props: {
    title: {
      type: String,
      default: '插件管理 / C笔记配置',
    },
  },
  methods: {
    changeCollect(field, value) {
      const data = JSON.parse(JSON.stringify(Settings.get('collectConfig')));
      data[field] = value;
      Settings.set('collectConfig', data);

      // 右键菜单
      if (field === 'menu') {
        chrome.runtime.sendMessage({
          handler: `Collect.contextMenu.${value ? 'enable' : 'disable'}`,
        });
      }
    },
  },
  created() {
    // console.log(Settings.get('keyMappings'));
    this.formatForm = JSON.parse(JSON.stringify(Settings.get('collectConfig')));
  },
};
</script>
