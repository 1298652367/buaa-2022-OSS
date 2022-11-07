// import { sendReportAjaxListener } from './report-server';
import { pluginInstallInit, setCSDNDomainCookie } from '@/background/listener-common.js';
import extensionExternalMessage from './extension.external.js';

// 安装完成后的操作
chrome.runtime.onInstalled.addListener(function({ reason }) {
  // 插件插件更新
  // pluginUpdate();
  // 创建新标签页
  if (reason === 'install') {
    // chrome.tabs.create({ active: true });
  }
});

// 支持Web打开插件新标签页
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  const checkLastRuntimeError = () => chrome.runtime.lastError;
  if (request.handler === 'open_chrome_tab') {
    chrome.tabs.create({ active: true }, checkLastRuntimeError);
  }
  if (request.handler === 'open_plugin_settings') {
    const url = chrome.runtime.getURL('pages/options.html');
    chrome.tabs.create({ url: url, active: true }, checkLastRuntimeError);
  }
});

// 设置UUID, installDate, cookie等
pluginInstallInit();
// 插件外部消息
extensionExternalMessage();
// 每次启动都设置pluginVersion, pluginId
setCSDNDomainCookie();
// 上报请求
// sendReportAjaxListener();
