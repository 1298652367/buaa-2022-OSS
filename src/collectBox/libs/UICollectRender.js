const UICollectRender = {
  ownerPagePort: null,
  handleMessage: null,

  portOpen(ownerPagePort) {
    this.ownerPagePort = ownerPagePort;
    this.ownerPagePort.onmessage = event => {
      if (this.handleMessage) {
        return this.handleMessage(event);
      }
    };
    this.registerIsReady();
  },
  registerHandler(handleMessage) {
    this.handleMessage = handleMessage;
  },
  postMessage(message) {
    if (this.ownerPagePort) {
      this.ownerPagePort.postMessage(message);
    }
  },
  hide() {
    this.postMessage('hide');
  },
  registerIsReady: (function() {
    let uiComponentIsReadyCount;
    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', () => UICollectRender.registerIsReady());
      uiComponentIsReadyCount = 0;
    } else {
      uiComponentIsReadyCount = 1;
    }

    return function() {
      if (++uiComponentIsReadyCount === 2) {
        if (window.frameId != null) {
          this.postMessage({ name: 'setIframeFrameId', iframeFrameId: window.frameId });
        }
        this.postMessage('uiComponentIsReady');
      }
    };
  })(),
};

const registerPort = function(event) {
  if (event.source !== window.parent || event.data !== 'Collect_Port') {
    return;
  }
  UICollectRender.portOpen(event.ports[0]);
  window.removeEventListener('message', registerPort);
};
window.addEventListener('message', registerPort);

export default UICollectRender;

// export const CollectBox = {
//   vomnibarUI: null,
//   getUI() {
//     return this.vomnibarUI;
//   },
//   activate(userOptions) {
//     console.log('userOptions', userOptions);
//   },
//   // 隐藏搜索框
//   hide() {
//     if (this.vomnibarUI) {
//       this.vomnibarUI.hide();
//     }
//   },
//   // 隐藏搜索框结果
//   onHidden() {
//     if (this.vomnibarUI) {
//       this.vomnibarUI.onHidden();
//     }
//   },
// };

// 事件响应 （挂在window上的message）
// UICollectRender.registerHandler(function(event) {
//   switch (event.data.name != null ? event.data.name : event.data) {
//     case 'hide':
//       CollectBox.hide();
//       break;
//     case 'hidden':
//       CollectBox.onHidden();
//       break;
//     case 'activate':
//       CollectBox.activate(event.data);
//       break;
//   }
// });
