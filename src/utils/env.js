export const isFirefox = navigator.userAgent.indexOf('Firefox') > -1;
export const isChrome = navigator.userAgent.indexOf('Chrome') !== -1;
export const isWindows = navigator.platform.indexOf('Win') === 0;
export const isMac = navigator.platform === 'MacIntel';
export const isLinux = navigator.platform.indexOf('Linux') === 0;
export const keys = {
  ctrl: isMac ? '&#8984;' : 'Ctrl',
  shift: 'Shift',
  alt: isMac ? '&#8997;' : 'Alt',
  del: 'Del',
  enter: 'Enter',
  esc: 'Esc',
};

export function initEnv(Vue) {
  const hasProtype = Object.prototype.hasOwnProperty.call(Vue.prototype, '$isChrome');
  if (hasProtype) return;
  Object.defineProperties(Vue.prototype, {
    $isChrome: { get: () => isChrome },
    $isFirefox: { get: () => isFirefox },
    $isWindows: { get: () => isWindows },
    $isMac: { get: () => isMac },
    $isLinux: { get: () => isLinux },
    $keys: { get: () => keys },
  });

  if (isWindows) document.body.classList.add('platform-windows');
  if (isMac) document.body.classList.add('platform-mac');
  if (isLinux) document.body.classList.add('platform-linux');
}
/* eslint-disable no-useless-escape */
/* eslint-disable no-cond-assign */
/* eslint-disable no-unused-expressions */
export const getExplore = function() {
  var Sys = {};
  var ua = navigator.userAgent.toLowerCase();
  var s;
  (s = ua.match(/rv:([\d.]+)\) like gecko/))
    ? (Sys.ie = s[1])
    : (s = ua.match(/msie ([\d\.]+)/))
    ? (Sys.ie = s[1])
    : (s = ua.match(/edge\/([\d\.]+)/))
    ? (Sys.edge = s[1])
    : (s = ua.match(/firefox\/([\d\.]+)/))
    ? (Sys.firefox = s[1])
    : (s = ua.match(/(?:opera|opr).([\d\.]+)/))
    ? (Sys.opera = s[1])
    : (s = ua.match(/chrome\/([\d\.]+)/))
    ? (Sys.chrome = s[1])
    : (s = ua.match(/version\/([\d\.]+).*safari/))
    ? (Sys.safari = s[1])
    : 0;
  // 根据关系进行判断
  if (Sys.ie) return { type: 'IE', version: Sys.ie };
  if (Sys.edge) return { type: 'EDGE', version: Sys.edge };
  if (Sys.firefox) return { type: 'Firefox', version: Sys.firefox };
  if (Sys.chrome) return { type: 'Chrome', version: Sys.chrome };
  if (Sys.opera) return { type: 'Opera', version: Sys.opera };
  if (Sys.safari) return { type: 'Safari', version: Sys.safari };
  return 'Unkonwn';
};
