import localforage from 'localforage';

class NoteCache {
  EXPIRES_TIME = 1000 * 60 * 60 * 24 * 10; // 写了但是没保存的数据最多存10天

  constructor() {
    this._db = localforage.createInstance({
      name: 'plugin-collect', // 数据库名
      storeName: 'note-cache', // 表名
    });
    this.checkClear();
  }

  async checkClear() {
    const curTimeStamp = +new Date();

    await this._db.iterate(e => {
      // this.apiCache[e.key] = e;
      // 数据过期
      if (curTimeStamp > e.timestamp) {
        this.remove(e.key);
      }
    });
  }

  async get(key) {
    const curTimeStamp = +new Date();
    const data = await this._db.getItem(key); // this.apiCache[key];
    // 没数据
    if (!data) return null;

    // (有数据 && 数据过期)
    if (data && curTimeStamp > data.timestamp) {
      await this.remove(key);
      return null;
    }
    // console.log('GET >>> ', key, data.data);
    // 可用
    return data.data;
  }

  async set(key, value, expiresTime = null) {
    expiresTime = expiresTime || this.EXPIRES_TIME;
    const data = {
      key: key,
      data: value,
      timestamp: +new Date() + expiresTime,
    };
    // this.apiCache[key] = data;
    // console.log('SET >>> ', key, data);

    await this._db.setItem(key, data);
  }

  async remove(key) {
    await this._db.removeItem(key);
    // console.log('DELETE >>>', key);
  }
}

const noteCache = new NoteCache();

export default noteCache;
