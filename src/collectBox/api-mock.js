/**
 * 简单做了下数据本地存储, 生产API涉及签名不开源
 */

import { collectDB } from './utils/db';

export default {
  async communityCheck() {
    return {
      qaUrl: 'https://bbs.csdn.net/forums/placard?category=0&typeId=23466',
      community: {
        id: 1,
        userName: 'User',
        communityId: 1000,
        uriName: 'test',
        homePageUrl: 'https://bbs.csdn.net/ccloud/test',
        status: 1,
        createTime: '2022-04-20T08:11:23.000+0000',
      },
      url: 'https://blog.csdn.net/SoftwareTeacher/article/details/123940505',
    };
  },
  async communityCreate() {
    return await this.communityCheck();
  },
  async collected(url) {
    const list = await collectDB.list();
    const collectItem = list.filter(v => v.type === 'collect').find(v => v.url === url);

    if (!collectItem) {
      return null;
    }
    const [comment] = collectItem.comment;
    const result = {
      // 收藏的信息在这里获取
      topicInfo: {
        url: 'https://bbs.csdn.net/topics/XXX',
        id: collectItem.id,
        cateName: '全部',
        cateId: comment.tagId,
        contentId: collectItem.id,
        topicTitle: collectItem.title,
        content: collectItem.content,
      },
      comments: collectItem.comment,
    };
    return result;
  },
  async delet(id) {
    await collectDB.remove(id);
    return { code: 200, data: {} };
  },
  async createCollect(formData) {
    const list = await collectDB.list();
    const { topicId, replyId, type, source, ...data } = formData;
    const _replyId = replyId || +new Date() + '';

    // 编辑
    if (topicId) {
      let collectItem = list.find(v => v.id === topicId);
      if (!collectItem) throw new Error('ID不存在');

      if (type === 'collect') {
        // 编辑笔记单项
        if (replyId) {
          const commentIndex = collectItem.comment.findIndex(v => v.id === replyId);
          if (commentIndex === -1) throw new Error('commentId不存在');
          collectItem.comment[commentIndex] = {
            ...collectItem.comment[commentIndex],
            ...data,
          };
        } else {
          // 有id, 没commentId代表新增一个评论
          collectItem.comment.push({
            ...data,
            id: _replyId,
          });
        }
      } else {
        collectItem = {
          ...collectItem,
          ...data,
        };
      }
      await collectDB.update(topicId, collectItem);
      return { code: 200, data: { topicId, replyId: type === 'collect' ? _replyId : '' } };
    } else {
      let postData = {
        type: type,
        title: source.title || '',
        url: source ? source.url : '', // 去除?后的URL
        source: source || {}, // 来源网站信息
        comment: [], // 评论数据
      };
      // 收藏修改标题
      if (type === 'collect') {
        postData.mdContent = `>标题: ${source.title}\n` + `  链接: ${source.url}\n` + `${source.selection ? `  引用: ${source.selection}\n>` : '>'}`;
        postData.content = `<blockquote>\n<p>标题：${source.title}}<br>链接：${source.url}${source.selection ? `<br>引用： ${source.selection}` : ''}</p>\n</blockquote>\n`;
        postData.comment.push({
          ...data,
          id: _replyId,
        });
      } else {
        postData = { ...postData, ...data };
      }
      const retId = await collectDB.add(postData);
      return { code: 200, data: { id: retId, replyId: type === 'collect' ? _replyId : '' } };
    }
  },
  async tagList() {
    return [
      { tabContribute: 0, cdId: 4451, tabName: '全部', createTime: null, sortType: 1, cardType: 0, tabType: 4, indexOrder: 0, id: 23632, tabUrl: '', tabSwitch: 1, status: 0 },
      {
        tabContribute: 1,
        cdId: 4451,
        tabName: '博客笔记',
        createTime: null,
        sortType: 1,
        cardType: 0,
        tabType: 1,
        indexOrder: 0,
        id: 23646,
        tabUrl: '',
        tabSwitch: 1,
        status: 0,
      },
      {
        tabContribute: 2,
        cdId: 4451,
        tabName: '技术',
        createTime: null,
        sortType: 1,
        cardType: 0,
        tabType: 1,
        indexOrder: 0,
        id: 23647,
        tabUrl: '',
        tabSwitch: 1,
        status: 0,
      },
      {
        tabContribute: 3,
        cdId: 4451,
        tabName: '工作',
        createTime: null,
        sortType: 1,
        cardType: 0,
        tabType: 1,
        indexOrder: 0,
        id: 23648,
        tabUrl: '',
        tabSwitch: 1,
        status: 0,
      },
      {
        tabContribute: 4,
        cdId: 4451,
        tabName: '资料',
        createTime: null,
        sortType: 1,
        cardType: 0,
        tabType: 1,
        indexOrder: 0,
        id: 23649,
        tabUrl: '',
        tabSwitch: 1,
        status: 0,
      },
      {
        tabContribute: 5,
        cdId: 4451,
        tabName: '生活',
        createTime: null,
        sortType: 1,
        cardType: 0,
        tabType: 1,
        indexOrder: 0,
        id: 23650,
        tabUrl: '',
        tabSwitch: 1,
        status: 0,
      },
      {
        tabContribute: 6,
        cdId: 4451,
        tabName: '代表',
        createTime: null,
        sortType: 1,
        cardType: 0,
        tabType: 1,
        indexOrder: 0,
        id: 23651,
        tabUrl: '',
        tabSwitch: 1,
        status: 0,
      },
    ];
    // return tagService.list();
  },
  async tagCreate(tagName) {
    return {
      tabContribute: 1,
      cdId: +`${+new Date()}`.slice(9),
      tabName: tagName,
      createTime: null,
      sortType: null,
      cardType: null,
      tabType: 1,
      indexOrder: null,
      id: +(100 + `${+new Date()}`.slice(9)),
      tabUrl: null,
      tabSwitch: 1,
      status: 0,
    };
  },
};
