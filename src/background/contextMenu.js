/**
 * 右键菜单管理
 */
import Settings from '../utils/settings';
// 配置项例如:
//  {
//     title: 'CSDN 搜索',
//     id: 'search',
//     contexts: ['selection', 'editable', 'link', 'image'],
//     documentUrlPatterns: ['http://*/*', 'https://*/*', 'file://*/*'],
//     onclick: info => {
//       const txt = info.selectionText;
//       chrome.tabs.create({
//         url: 'https://so.csdn.net/so/search/s.do?from=chrome_plugin&q=' + (txt || ''),
//         active: true,
//       });
//     },
//   };

const configs = {
  // 搜索
  selectionSearch: {
    config: {
      title: 'CSDN 搜索',
      id: 'selectionSearch',
      contexts: ['selection'],
      documentUrlPatterns: ['http://*/*', 'https://*/*'],
    },
    callback: function(info, tab) {
      const txt = info.selectionText;
      chrome.tabs.create({
        url: 'https://so.csdn.net/so/search/s.do?from=chrome_plugin&q=' + (txt || ''),
        active: true,
      });
    },
  },
  // 收藏
  defaultCollect: {
    config: { contexts: ['page'], id: 'defaultCollect', title: 'C笔记' },
    callback: function(info, tab) {
      chrome.tabs.sendMessage(tab.id, {
        handler: 'Collect.contextMenu.active',
        data: {},
      });
    },
  },
  // 选择文本收藏
  selectionCollect: {
    config: {
      contexts: ['selection'], // ['frame', 'link', 'video', 'audio'],
      id: 'selectionCollect',
      title: 'C笔记',
    },
    callback: function(info, tab) {
      const txt = info.selectionText;
      chrome.tabs.sendMessage(tab.id, {
        handler: 'Collect.contextMenu.active',
        data: {
          selection: txt,
        },
      });
    },
  },
  // imageCollect: { contexts: ['image'], id: 'imageCollect', title: '添加图片到收藏' },
  // blankNoteCollect: {
  //   contexts: ['browser_action'],
  //   id: 'blankNoteCollect',
  //   title: '添加收藏',
  // },
};
const ContextMenu = {
  /**
   * 设置开启/关闭收藏相关右键菜单
   */
  setCollectContextMenuStatus(enable) {
    const menuIds = ['defaultCollect', 'selectionCollect'];
    menuIds.forEach(menuId => {
      if (configs[menuId]) {
        enable ? this.createContextMenu(configs[menuId].config) : this.removeContextMenu(menuId);
      }
    });
  },
  /**
   * 移除右键菜单
   */
  removeContextMenu: function(menuId) {
    if (!menuId) return;
    const checkLastRuntimeError = () => chrome.runtime.lastError;
    chrome.contextMenus.remove(menuId, checkLastRuntimeError);
  },
  /**
   * 创建右键菜单
   */
  createContextMenu: function(menuItem) {
    // console.log('menuItem', menuItem);
    const checkLastRuntimeError = () => chrome.runtime.lastError;
    chrome.contextMenus.create(menuItem, checkLastRuntimeError);
  },
};

/**
 * 右键菜单点击回调函数
 */

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  // console.warn('contextMenus.onClicked =>>> ', configs);

  const { menuItemId } = info;
  if (configs[menuItemId]) {
    configs[menuItemId].callback(info, tab);
  } else {
    configs.selectionSearch.callback(info, tab);
  }
});

for (const value of Object.values(configs)) {
  ContextMenu.createContextMenu(value.config);
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.handler.indexOf('Collect.contextMenu') > -1) {
    const [action] = request.handler.split('.').reverse();
    if (['enable', 'disable'].indexOf(action) > -1) {
      const isEnable = action === 'enable';
      ContextMenu.setCollectContextMenuStatus(isEnable);
    }
  }
});

try {
  // eslint-disable-next-line
  const collectConfig = Settings.get('collectConfig');
  if (collectConfig) {
    if (collectConfig.menu) {
      ContextMenu.setCollectContextMenuStatus(true);
    } else {
      ContextMenu.setCollectContextMenuStatus(false);
    }
  }
} catch (e) {
  console.log('C笔记右键菜单状态异常', e);
}
