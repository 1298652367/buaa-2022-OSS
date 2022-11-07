//
/**
 * 有网站信息的 => 收藏
 *               笔记内容作为评论信息存储
 */
import localforage from 'localforage';
import { getUniqId } from './index';

// const demo1 = {
//   type: 'collect', // note
//   // 标题
//   title: '',
//   // 去除?后的URL
//   url: '',
//   // 富文本编辑器内容
//   content: '<p>支持</p>\n',
//   // markdown编辑器内容
//   mdContent: '支持',
//   // 来源网站信息
//   source: {
//     url: '',
//     image: '',
//     title: '',
//   },
//   // 收藏时间
//   dateTime: '',
//   // 评论数据
//   comment: [
//     {
//       id: 1,
//       content: '<p>支持</p>\n',
//       mdContent: '支持',
//     },
//     {
//       id: 2,
//       content: '<p>支持</p>\n',
//       mdContent: '支持',
//     },
//   ],
// };

class DBService {
  constructor({ dbName, dbTableName }) {
    if (!dbName || !dbTableName) {
      throw new Error('请填写数据库表名信息');
    }
    this._db = localforage.createInstance({
      name: dbName,
      storeName: dbTableName,
    });
  }

  // 删除
  async remove(id) {
    await this._db.removeItem(id);
  }

  // 添加
  async add(data) {
    const id = getUniqId('');
    await this._db.setItem(id, {
      id: `${id}`,
      updateTime: +new Date(),
      ...data,
    });
    return id;
  }

  // 更新
  async update(id, data) {
    if (!id) return;
    await this._db.setItem(id, {
      id: `${id}`,
      updateTime: +new Date(),
      ...data,
    });
    return id;
  }

  // 载入本地
  async list() {
    let result = [];
    await this._db.iterate(e => {
      result.push(e);
    });
    result = result.sort((v, i) => v.updateTime - i.updateTime);
    return result;
  }
}

const collectDB = new DBService({
  dbName: 'plugin-collect',
  dbTableName: 'collect',
});

const tagsDB = new DBService({
  dbName: 'plugin-collect',
  dbTableName: 'tags',
});

const collectCacheDB = new DBService({
  dbName: 'plugin-collect',
  dbTableName: 'tags',
});

export { DBService, collectCacheDB, tagsDB, collectDB };
