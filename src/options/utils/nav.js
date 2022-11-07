const navList = [
  // {
  //   name: '搜索栏设置',
  //   routeName: 'index',
  //   icon: 'search-engine.png',
  // },
  // {
  //   name: '预设插件',
  //   routeName: 'plugin/tools',
  //   icon: 'tools.png',
  // },
  // {
  //   name: 'JSON设置',
  //   routeName: 'plugin/json',
  //   icon: 'json.png',
  // },
  {
    name: 'C笔记设置',
    routeName: 'plugin/collect',
    icon: 'collect.png',
  },
  // {
  //   name: '内置插件',
  //   routeName: 'pluginManage',
  //   icon: 'tools.png',
  // },
  // {
  //   name: '关于开发者助手',
  //   routeName: 'about',
  //   icon: 'about.png',
  // },
];
const searchConf = [
  [{ name: '搜索引擎', routeName: 'Index' }, '搜索引擎,默认搜索地址'],
  [{ name: '工具', routeName: 'Tools' }, '工具,预设工具,预设工具配置'],
  [{ name: '插件', routeName: 'WebIframe' }, '网页嵌入,插件,嵌入'],
  [{ name: 'JSON配置', routeName: 'JSON' }, 'json,JSON,json格式化'],
  [{ name: '关于浏览器助手', routeName: 'About' }, '关于开发者助手,关于,浏览器助手'],
];
const search = param => {
  if (!param) return [];
  return searchConf
    .filter(v => {
      return v[1].indexOf(param) > -1;
    })
    .map(v => v[0]);
};

export default {
  list: navList,
  search: search,
};
