// import http from '@tab/plugins/request';
// const API_URL = 'http://plugin-api.csdn.net:7001';
import http from '@/HttpInterceptor/http';
import { Message } from 'ant-design-vue';

const API_URL = process.env.TAB_API;

export const collectServ = {
  // 检查是否已经创建社区
  async communityCheck() {
    try {
      const { code, data } = await http.get(`${API_URL}/api/v1/collect/community/fetch?needCreate=false`);
      if (code === 200) {
        return data;
      } else {
        return false;
      }
    } catch (e) {
      Message.error('获取用户社区失败');
    }
  },
  // 创建用户私密社区
  async communityCreate() {
    try {
      const { code, data } = await http.get(`${API_URL}/api/v1/collect/community/fetch?needCreate=true`);
      // console.log('communityCreate', data);
      if (code === 200) {
        return data;
      } else {
        return false;
      }
    } catch (e) {
      Message.error('创建用户社区失败');
    }
  },
  // 获取当前网址是否被收藏
  async collected(url) {
    try {
      let [_url, param] = url.split('?');
      param = param ? encodeURIComponent(`?${param}`) : '';
      // SPA特殊字符处理
      _url = _url.replace(/#/g, '%23');
      const { code, data } = await http.get(`${API_URL}/api/v1/collect/fetch?url=${_url}${param}`);
      if (code === 200) {
        return data;
      } else {
        console.warn('是否被收藏失败');
        return false;
      }
    } catch (e) {
      Message.error('获取收藏数据失败');
    }
  },
  // 创建收藏 / 笔记
  async createCollect(postData) {
    const url = `${API_URL}/api/v1/collect/create`;
    try {
      const res = await http.post(url, postData, {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
      });
      if (res.code !== 200) {
        Message.error(res.msg);
      }
      return res;
    } catch (error) {
      Message.destroy();
      Message.error(error);
    }
  },
  // 频道(标签)列表
  async tagList() {
    try {
      const { code, data } = await http.get(`${API_URL}/api/v1/collect/tag/list`);
      if (code === 200) {
        return data || [];
      } else {
        return [];
      }
    } catch (e) {
      Message.error('获取标签失败');
      return [];
    }
  },
  // 创建频道(标签)
  async tagCreate(tagName) {
    try {
      const { code, data } = await http.post(
        `${API_URL}/api/v1/collect/tag/create`,
        {
          tagName: tagName,
        },
        {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
          },
        }
      );
      if (code === 200) {
        return data;
      } else {
        console.warn('创建频道失败');
        return null;
      }
    } catch (e) {
      Message.error('创建频道失败');
    }
  },
};
