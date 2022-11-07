export function urlParamsToObj(query) {
  var queryObj = {};
  query.replace(/([^=&#]+)=([^&#]*)/g, function() {
    queryObj[arguments[1]] = arguments[2];
  });
  return queryObj;
}

export const getUniqId = (prefix = 'CSDNPlugin') => {
  const perfNow = performance.now.bind(performance);
  const now = perfNow();
  return prefix + Math.floor((now - Math.floor(now)) * 1e12).toString(36) + Math.floor(Math.random() * 1e12).toString(36);
};

const getUserAvatar = function(userInfo) {
  if (!userInfo.AU) {
    return '';
  }
  const _AUPath = userInfo.AU.split('').join('/');
  const userName = userInfo.UserName && userInfo.UserName.toLowerCase();
  return 'https://profile.csdnimg.cn/' + _AUPath + '/0_' + userName;
};

export const getUserInfo = () => {
  return new Promise(resolve => {
    let result = {};
    chrome.cookies.getAll({ url: 'https://csdn.net' }, function(res) {
      result = res
        .filter(v => ['AU', 'UserNick', 'UserName'].indexOf(v.name) > -1)
        .reduce((pre, cur) => {
          return pre ? { ...pre, [cur.name]: cur.value } : { [cur.name]: cur.value };
        }, '');
      if (result) result.avatar = '';
      if (result.UserNick) {
        result.UserNick = decodeURIComponent(result.UserNick);
      }
      if (result.UserName) {
        result.avatar = getUserAvatar(result);
      }
      resolve(result);
    });
  });
};

export const onUserInfoChange = callback => {
  chrome.cookies.onChanged.addListener(changeInfo => {
    const { cookie, cause } = changeInfo;
    if (cookie.domain === '.csdn.net' && cookie.name === 'UserName' && cause === 'explicit') {
      callback();
    }
  });
};
