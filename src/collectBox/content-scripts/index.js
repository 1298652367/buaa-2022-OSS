import UICollectComponent from './ui_component';
import closeImage from '@/collectBox/assets/images/close.png';
import logoImage from '@/collectBox/assets/images/logo.png';
import Settings from '@/utils/settings';

const CollectBox = {
  CollectBoxUI: null,
  activate(sourceFrameId, options = {}) {
    return this.open(sourceFrameId, Object.assign({}, options));
  },
  init() {
    if (!this.CollectBoxUI) {
      this.CollectBoxUI = new UICollectComponent('pages/collect-box.html', 'collectBoxFrame', function() {});
      console.log('CollectBoxUI ==>> ', this.CollectBoxUI);
    }
  },
  open(sourceFrameId, options) {
    this.init();
    const title = document.querySelector('h1')?.innerText || document.title;
    const href = document.querySelector('link[rel="canonical"]') ? document.querySelector('link[rel="canonical"]').href : location.href;
    const host = location.hostname || location.host;
    const images = document.getElementsByTagName('img');
    let picture = '';
    for (var i = 0; i < images.length; i++) {
      if (picture) break;
      if (images[i].width > 72 && images[i].height > 72 && images[i].offsetWidth > 50 && images[i].offsetHeight > 50) {
        picture = images[i].src;
      }
    }
    // picture = picture || `chrome://favicon/size/32@2x/${href}`;
    return this.CollectBoxUI.activate(
      Object.assign(options, {
        name: 'activate',
        sourceFrameId,
        focus: true,
        title,
        url: href,
        host,
        picture,
      })
    );
  },
  hide(sourceFrameId, options) {
    return this.CollectBoxUI.hide(Object.assign(options, { name: 'hide', sourceFrameId, focus: true }));
  },
  appendStyle(css) {
    const style = document.createElement('style');
    style.append(css);
    const elemByTag = tag => document.getElementsByTagName(tag)[0];
    const root = elemByTag('head') || elemByTag('*');
    root && root.appendChild(style);
  },
  // 显示关闭弹窗
  showCloseDialog() {
    const css = `
      #csdn-plugin_note-close-dialog { z-index: 99999; user-select: none; position: fixed;top: 0;left: 0;width: 100%;height: 100%;}
      #csdn-plugin_note-close-dialog .jdcu3s{ position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.3); transition: all .2s; }
      #csdn-plugin_note-close-dialog .gh23dh{ position: relative; overflow: hidden; border-radius: 8px; pointer-events: auto; width: 540px; background: #fff; top: 120px;left: 50%;transform: translateX(-50%);}
      #csdn-plugin_note-close-dialog .gh23dh .t3sdn2 { text-align: center; height: 30px; font-size: 22px; font-weight: bold; line-height: 30px; margin-bottom: 16px; } 
      #csdn-plugin_note-close-dialog .gh23dh .as2fr13 { padding: 16px 16px; } 
      #csdn-plugin_note-close-dialog .gh23dh .as2fr13 .yjsfi3 { padding:0 16px; }   
      #csdn-plugin_note-close-dialog .gh23dh .as2fr13 .yjsfi3 a { color: #2440b3 }
      #csdn-plugin_note-close-dialog .gh23dh .as2fr13 .r1j3s2 { text-align: right; padding: 16px 0 0; } 
      #csdn-plugin_note-close-dialog .gh23dh .as2fr13 .r1j3s2 button { display: inline-block; background: rgba(0, 0, 0, 0); border: 1px solid rgb(78, 89, 105); outline: none; cursor: pointer; width: 120px; height: 40px; line-height: 40px; margin-left: 16px; border-radius: 20px; } 
      #csdn-plugin_note-close-dialog .gh23dh .as2fr13 .r1j3s2 button:hover{ background: rgba(237, 237, 237, 0.55); color: #222226; border: 1px solid rgba(0, 0, 0, 0);}
      #csdn-plugin_note-close-dialog .gh23dh .as2fr13 .r1j3s2 button:last-child { margin: 0; }
    `;
    CollectBox.appendStyle(css);
    const modalEle = document.createElement('div');
    modalEle.id = 'csdn-plugin_note-close-dialog';
    const url = chrome.runtime.getURL('pages/options.html#/plugin/collect');

    modalEle.innerHTML = ` 
        <div class="jdcu3s"></div> 
        <div class="gh23dh">
            <div class="as2fr13">
              <div class="t3sdn2">提示</div>
              <div class="yjsfi3"> 
                  <p>关闭成功，可在<a target="_blank" href="${url}">【扩展程序选项页 - C笔记配置】</a>中再次打开</p> 
              </div>
              <div class="r1j3s2">
                  <button class="confirm">我知道了</button> 
              </div>
            </div>
        </div> 
    `;
    document.body.appendChild(modalEle);
    modalEle.querySelector('button.confirm').addEventListener('click', function() {
      document.body.removeChild(modalEle);
    });
  },
  showMiniBtn() {
    const miniBtn = document.createElement('div');
    miniBtn.id = 'csdn-plugin-note-btn';
    const rootPath = chrome.runtime.getURL('').slice(0, -1);
    miniBtn.innerHTML = `<img src="${rootPath}${logoImage}" class="logo" alt="" /><span>C笔记</span><img class="close" src="${rootPath}${closeImage}" alt="" />`;

    const css = `#csdn-plugin-note-btn{
      position: fixed;
      z-index: 100;
      width: 25px;
      box-sizing: content-box;
      right: 0px;
      top: 20%;
      color: rgb(255, 255, 255);
      background: #fff;
      cursor: pointer;
      border-bottom-left-radius: 6px;
      padding: 10px 5px;
      border-top-left-radius: 6px;
      font-size: 16px;
      letter-spacing: 4px;
      box-shadow: 0px 2px 12px 0px rgba(123,123,123,0.26);
    }
    #csdn-plugin-note-btn img.logo{
      display: block; width:25px; height:25px; margin-bottom:2px;
    }
    #csdn-plugin-note-btn img.close{
      display: none; padding: 5px 5px 10px 5px; width: 15px; height: 15px; box-sizing: content-box; opacity:0.8;
    }
    #csdn-plugin-note-btn img.close:hover{opacity:1;}
    #csdn-plugin-note-btn:hover img.close{display: block;} 
    #csdn-plugin-note-btn:hover{ padding-bottom: 0;} 
    #csdn-plugin-note-btn span{
      color: #484848; font-size: 15px; width: 25px; display: block; text-align: center; word-break: break-all; line-height: 18px; font-weight: 600;padding-left: 2px;
    }`;
    CollectBox.appendStyle(css);
    miniBtn.addEventListener('click', function() {
      CollectBox.activate();
      chrome.runtime.sendMessage({
        handler: 'reportClick',
        message: {
          spm: '1021.2146.3001.8139',
          extend1: 'page',
        },
      });
      // chrome.runtime.sendMessage({
      //   handler: 'sendMessageToFrames',
      //   message: {
      //     name: 'runInTopFrame',
      //     registryEntry: {
      //       command: 'CollectBox.activate',
      //       optionList: [],
      //       options: {},
      //       topFrame: true,
      //     },
      //     sourceFrameId: 0,
      //   },
      // });
    });
    miniBtn.querySelector('img.close').addEventListener('click', function(e) {
      try {
        e.stopPropagation();
        // eslint-disable-next-line
        const config = Settings.get('collectConfig')
        config && (config.button = false);
        // eslint-disable-next-line
        Settings.set('collectConfig', config); 
        CollectBox.showCloseDialog();
      } catch (e) {
        console.log('关闭失败', e);
      } finally {
        document.body.removeChild(miniBtn);
      }
    });
    document.body.appendChild(miniBtn);
  },
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.handler === 'Collect.contextMenu.active') {
    CollectBox.activate('', request.data);
  }
});
// 创建写笔记按钮
window.addEventListener('DOMContentLoaded', function() {
  // eslint-disable-next-line
  Settings.onLoaded(() => { 
    try {
      // eslint-disable-next-line
    const collectConfig = Settings.get('collectConfig');   
    if (collectConfig && !collectConfig.button) {
        return;
      }
    } catch (error) {
      console.log('收藏按钮控制异常');
    }
    CollectBox.showMiniBtn();
  });
});

export default CollectBox;
