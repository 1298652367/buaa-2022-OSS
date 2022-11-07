import Vue from 'vue';
import App from './App';
import './collect-box.scss';
import './plugins/ant-design';
import UICollectRender from './libs/UICollectRender';

let app;

if (window.top === window || window.parent === window) {
  app = new Vue({
    render: h => h(App),
  }).$mount('#root');
}

/**
 * 收藏侧边仅在初次打开的时候创建Iframe，后续仅通过重新创建实例来初始化（否则需要hidden时重置数据）
 */

UICollectRender.registerHandler(function(event) {
  console.log('event =>>>>', event.data.name != null ? event.data.name : event.data);
  switch (event.data.name != null ? event.data.name : event.data) {
    case 'hidden':
      hidden();
      break;
    case 'activate':
      activate(event.data);
      break;
  }
});

function hidden() {
  // 解绑事件
  if (app) {
    app.$destroy();
  }
  // 创建一个新容器
  const el = document.createElement('div');
  el.id = 'root';
  document.body.appendChild(el);
}

function activate(data) {
  // console.warn('activate!!!!', data);
  Vue.prototype.$sourcePage = {
    title: data.title,
    url: data.url,
    hostname: data.host,
    picture: data.picture,
    // 选中的文本
    selection: data.selection || '',
    // 去除?的链接
    // url_noparams: data.url ? data.url.split('?')[0] : '',
  };
  // console.log(Vue.prototype.$sourcePage);
  if (app && app.$el) {
    try {
      document.body.removeChild(app.$el);
    } catch (e) {}
  }
  app = new Vue({
    render: h => h(App),
  }).$mount('#root');
  // 来源页面信息
}
