const fn = file => require('./img/' + file);

export const systemIcons = [
  {
    id: 'chrome://downloads',
    logoType: 'image',
    name: '下载',
    query: '',
    src: 'https://img-operation.csdnimg.cn/plugin/image/icon/1615859731961.png',
    url: 'chrome://downloads',
  },
  {
    id: 'chrome://extensions',
    logoType: 'image',
    name: '扩展管理',
    query: '',
    src: 'https://img-operation.csdnimg.cn/plugin/image/icon/1615859763967.png',
    url: 'chrome://extensions',
  },
  {
    id: 'chrome://bookmarks',
    logoType: 'image',
    name: '书签',
    src: 'https://img-operation.csdnimg.cn/plugin/image/icon/1615859781729.png',
    url: 'chrome://bookmarks',
  },
  {
    id: 'chrome://history',
    logoType: 'image',
    name: '历史记录',
    query: '',
    src: 'https://img-operation.csdnimg.cn/plugin/image/icon/1615859804032.png',
    url: 'chrome://history',
  },
];

export const navs = [
  {
    name: 'CSDN浏览器助手',
    logo: fn('tab-csdn.png'),
    logoActive: fn('tab-csdn-active.png'),
    value: 1,
  },
  {
    name: '设置',
    logo: fn('tab-plugin.png'),
    logoActive: fn('tab-plugin-active.png'),
    value: 2,
  },
];

export const store = {
  currentTab: {},
  domain: {},
};
