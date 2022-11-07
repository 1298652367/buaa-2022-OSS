/* eslint-disable prefer-rest-params */
if (window.forTrusted == null) {
  window.forTrusted = handler =>
    function(event) {
      if (event && event.isTrusted) return handler.apply(this, arguments);
      else return true;
    };
}

export const DomUtils = {
  documentReady: (function() {
    let isReady = document.readyState !== 'loading';
    let callbacks = [];
    if (!isReady) {
      const onDOMContentLoaded = () => {
        window.removeEventListener('DOMContentLoaded', onDOMContentLoaded, true);
        isReady = true;
        for (const callback of callbacks) callback();
        callbacks = null;
      };
      window.addEventListener('DOMContentLoaded', onDOMContentLoaded, true);
    }
    return function(callback) {
      if (isReady) return callback();
      else callbacks.push(callback);
    };
  })(),
};
