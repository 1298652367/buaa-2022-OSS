import { objToUrlParams } from './urlParams';

/**
 * 通用Fetch API
 * @param data { type:'get', url: '', data: {} } 基本信息
 * @param option { headers: {}， responseType: 'json' } 附加配置项目
 * @returns
 */
export const fetchApi = async (data, option = {}) => {
  // console.log('fetch =>>', data, option);
  let url = data.url;
  if (!url) return;
  const fetchOptions = {
    method: data.type || 'GET',
    credentials: 'include',
    ...option,
  };

  const responseTypeMap = {
    arraybuffer: 'arrayBuffer',
    blob: 'blob',
    json: 'json',
    text: 'text',
  };
  const responseType = responseTypeMap[option.responseType || 'text'];

  if (data.data) {
    if (fetchOptions.method === 'POST') {
      fetchOptions.body = data.data;
    } else {
      const char = url.indexOf('?') > 0 ? '&' : '?';
      url = `${url}${char}${objToUrlParams(data.data, true)}`;
    }
  }
  const response = { url, status: -1 };

  try {
    const resp = await fetch(url, fetchOptions);
    response.status = resp.status || 200;
    response.headers = resp.headers;
    response.data = await resp[responseType]();
    return response;
  } catch (error) {
    return { ...response, error };
  }
};
