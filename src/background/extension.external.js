const manifest = chrome.runtime.getManifest();
/** 
 * 外部API规范
 * 调用方式: 获取扩展ID，然后sendMessage
  chrome.runtime.sendMessage(extensionID, {  
    type: 'plugin:install-list',
    data: {}
  }, function(res) {
    console.log(res)
  }) 
*/

/**
 * @desc 1.打开插件内页面
 * @params { type: 'extension:openUrlPage', data: {url: ''} }
 * @return {Array} []
 */

const pluginMessage = () => {
  chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {
    const { type, data } = request;
    // 获取列表
    if (type === 'extension:openUrlPage') {
      const extensionRoot = chrome.runtime.getURL('/');
      chrome.tabs.create({ url: extensionRoot + data.url, active: true }, function() {
        sendResponse(true);
      });
    }
    if (type === 'extension:getVersion') {
      if (manifest && manifest.version) {
        sendResponse(manifest.version);
      }
    }
    // 处理逻辑
    return true;
  });
};

export default pluginMessage;
