const RondomPass = number => {
  var arr = [];
  var arr1 = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  for (var i = 0; i < number; i++) {
    var n = Math.floor(Math.random() * 10);
    arr[i] = arr1[n];
  }
  return arr.join('');
};

export default {
  parseLines: text => {
    return text
      .replace(/\\\n/g, '')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    // .filter(line => line.length > 0 && !Array.from('#"').includes(line[0]));
  },
  parseToTxt: arr => {
    return '';
  },

  hasFullUrlPrefix: url => {
    const urlPrefix = new RegExp('^[a-z][-+.a-z0-9]{2,}://.');
    return urlPrefix.test(url);
  },
  hasJavascriptPrefix: url => {
    return url.startsWith('javascript:');
  },

  urlParamsToObj: query => {
    var queryObj = {};
    query.replace(/([^?&=]+)=([^?&=]+)/g, function() {
      queryObj[arguments[1]] = arguments[2];
    });
    return queryObj;
  },
  objToUrlParams: queryObj => {
    var paramStr = '';
    $.each(queryObj, function(i) {
      paramStr += '&' + i + '=' + queryObj[i];
    });
    return paramStr.substr(1);
  },
  parseKeyValue(arr) {
    if (Object.prototype.toString.call(arr).slice(8, -1) !== 'Array') {
      return [];
    }
    return arr.reduce((pre, cur) => {
      const curValueMap = cur.replace(/\s+/g, '').split(':');
      const key = curValueMap[0];
      const value = curValueMap[1].split(',');
      const result = value.reduce((p, c) => {
        return p ? { ...p, [c]: key } : { [c]: key };
      }, '');
      return pre ? { ...pre, ...result } : result;
    }, '');
  },

  // 生成一个随机的插件ID
  getPluginId(prefix) {
    return `CSDNPlugin-${prefix ? prefix + '_' : ''}${RondomPass(8)}-${+new Date()}-${RondomPass(8)}`;
  },
};
