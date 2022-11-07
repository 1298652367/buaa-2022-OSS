import { DomUtils } from './utils';
import collectCSSInChromeStorage from '../utils/frame.style';

class AsyncDataFetcher {
  constructor(fetch) {
    this.port = null;
    this.queue = [];
    setTimeout(() => {
      return fetch(port => {
        this.port = port;
        for (const callback of this.queue) callback(this.port);
      });
    }, 0);
  }

  use(callback) {
    if (this.port != null) return callback(this.port);
    else return this.queue.push(callback);
  }
}

class UICollectComponent {
  constructor(iframeUrl, className, handleMessage) {
    this.handleMessage = handleMessage;
    this.iframeElement = null;
    this.iframePort = null;
    this.showing = false;
    this.iframeFrameId = null;
    this.options = null;
    this.shadowDOM = null;
    this.maskDOM = null;

    // const isReady = document.readyState !== 'loading';
    // console.log('this!', isReady, document.readyState);

    DomUtils.documentReady(() => {
      console.log('UICollectComponent');
      const styleSheet = document.createElement('style');
      styleSheet.type = 'text/css';
      styleSheet.innerHTML = collectCSSInChromeStorage;
      this.iframeElement = document.createElement('iframe');
      Object.assign(this.iframeElement, {
        className,
      });
      // 创建shadowDOM
      const shadowWrapper = document.createElement('div');
      shadowWrapper.id = 'Plugin_csdn-search-box';
      if (shadowWrapper.attachShadow) {
        this.shadowDOM = shadowWrapper.attachShadow({ mode: 'open' });
      } else {
        this.shadowDOM = shadowWrapper;
      }
      this.maskDOM = document.createElement('div');
      this.maskDOM.className = 'mask';
      this.maskDOM.id = 'mask';

      // append样式以及iframe
      this.shadowDOM.appendChild(styleSheet);
      this.shadowDOM.appendChild(this.iframeElement);
      this.shadowDOM.appendChild(this.maskDOM);

      this.iframePort = new AsyncDataFetcher(setIframePort => {
        this.iframeElement.src = `${chrome.runtime.getURL(iframeUrl)}?referer=${encodeURIComponent(location.href)}`;
        document.documentElement.appendChild(shadowWrapper);

        this.iframeElement.addEventListener('load', () => {
          const { port1, port2 } = new MessageChannel();

          this.iframeElement.contentWindow.postMessage('Collect_Port', chrome.runtime.getURL(''), [port2]);

          port1.onmessage = event => {
            console.log('event port1=>>', event);
            let eventName = '';
            if (event) eventName = (event.data ? event.data.name : '') || event.data;

            switch (eventName) {
              case 'uiComponentIsReady':
                window.addEventListener(
                  'click',
                  window.forTrusted(event => {
                    if (event.view === window && this.options && this.options.focus) this.hide(false);
                    return true;
                  }),
                  true
                );
                setIframePort(port1);
                break;
              case 'setIframeFrameId':
                this.iframeFrameId = event.data.iframeFrameId;
                break;
              case 'hide':
                return this.hide();
              default:
                this.handleMessage(event);
            }
          };
        });
      });
    });
  }

  // 切换iframe的显示
  toggleIframeElementClasses(removeClass, addClass) {
    console.log('toggleIframeElementClasses', removeClass, addClass);
    this.iframeElement.classList.remove(removeClass);
    this.iframeElement.classList.add(addClass);
  }

  postMessage(message = null, continuation = null) {
    if (!this.iframePort) {
      return;
    }

    this.iframePort.use(function(port) {
      if (message != null) {
        port.postMessage(message);
      }
      if (continuation) {
        continuation();
      }
    });
  }

  activate(options = null) {
    // console.log('content-script =>>> ', 'ui-component activate');

    this.options = options;
    this.postMessage(this.options, () => {
      // document.body.style.overflow = 'hidden';
      this.maskDOM && (this.maskDOM.style.display = 'block');
      setTimeout(() => {
        this.maskDOM && (this.maskDOM.style.display = 'block');
      }, 300);

      this.toggleIframeElementClasses('FrameUIComponentHidden', 'FrameUIComponentVisible');
      if (this.options && this.options.focus) {
        this.iframeElement.focus();
      }
      this.showing = true;
    });
  }

  hide() {
    // console.log('content-script =>>> ', 'ui-component hidden');
    this.postMessage(null, () => {
      if (!this.showing) return;

      setTimeout(() => {
        this.maskDOM && (this.maskDOM.style.display = 'none');
      }, 300);
      this.showing = false;
      // document.body.style.overflow = 'auto';
      this.toggleIframeElementClasses('FrameUIComponentVisible', 'FrameUIComponentHidden');

      if (this.options && this.options.focus) this.iframeElement.blur();

      this.options = null;
      this.postMessage('hidden', () => {});
    });
  }
}
export default UICollectComponent;
