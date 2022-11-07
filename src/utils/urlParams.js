export const objToUrlParams = (queryObj, needEncode = false) => {
  var paramStr = '';
  for (var key in queryObj) {
    paramStr += '&' + key + '=' + (needEncode ? encodeURIComponent(queryObj[key]) : queryObj[key]);
  }
  return paramStr.substr(1);
};

export const urlParamsToObj = function(query) {
  if (!query) return {};
  var queryObj = {};
  query.replace(/([^?&=]+)=([^?&=]+)/g, function() {
    queryObj[arguments[1]] = arguments[2];
  });
  return queryObj;
};
