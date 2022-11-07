// import { fields as InjectKeys } from '@/InjectPlugins/config.js';
let storageArea = 'local';
const URL_FRAMEMODE = '__mode__=frame';

// const InjectDefaultConfig = InjectKeys.reduce((pre, cur) => {
//   return pre ? { ...pre, [cur]: true } : { [cur]: true };
// }, '');

const Settings = {
  debug: false,
  storage: chrome.storage[storageArea],
  cache: {},
  isLoaded: false,
  onLoadedCallbacks: [],
  urlFrameMode: URL_FRAMEMODE,
  init() {
    try {
      this.cache = localStorage;
    } catch (error) {
      this.cache = {};
    }
    this.runOnLoadedCallbacks();

    chrome.storage.sync.get(null, () => {
      if (chrome.runtime.lastError) {
        storageArea = 'local';
        this.storage = chrome.storage[storageArea];
      }

      chrome.storage.local.get(null, localItems => {
        if (chrome.runtime.lastError) {
          localItems = {};
        }
        return this.storage.get(null, syncedItems => {
          if (!chrome.runtime.lastError) {
            const object = Object.assign(localItems || {}, syncedItems);
            for (const key of Object.keys(object)) {
              const value = object[key];
              this.handleUpdateFromChromeStorage(key, value);
            }
          }

          chrome.storage.onChanged.addListener((changes, area) => {
            if (area === storageArea) {
              return this.propagateChangesFromChromeStorage(changes);
            }
          });

          this.runOnLoadedCallbacks();
        });
      });
    });
  },

  runOnLoadedCallbacks() {
    this.log(`runOnLoadedCallbacks: ${this.onLoadedCallbacks.length} callback(s)`);
    this.isLoaded = true;
    while (this.onLoadedCallbacks.length > 0) {
      this.onLoadedCallbacks.pop()();
    }
  },

  onLoaded(callback) {
    if (this.isLoaded) {
      return callback();
    } else {
      this.onLoadedCallbacks.push(callback);
    }
  },

  shouldSyncKey(key) {
    return key in this.defaults && !['settingsVersion', 'previousVersion'].includes(key);
  },

  propagateChangesFromChromeStorage(changes) {
    for (const key of Object.keys(changes || {})) {
      const change = changes[key];
      this.handleUpdateFromChromeStorage(key, change != null ? change.newValue : undefined);
    }
  },

  handleUpdateFromChromeStorage(key, value) {
    this.log(`handleUpdateFromChromeStorage: ${key}`);
    if (this.shouldSyncKey(key)) {
      if (!value || !(key in this.cache) || this.cache[key] !== value) {
        if (value == null) {
          value = JSON.stringify(this.defaults[key]);
        }
        let setValue = null;
        try {
          setValue = typeof value === 'string' ? JSON.parse(value) : value;
        } catch (e) {
          setValue = value;
        }
        this.set(key, setValue, false);
      }
    }
  },

  get(key) {
    if (!this.isLoaded) {
      console.log(`WARNING: Settings have not loaded yet; using the default value for ${key}.`);
    }
    if (key in this.cache && this.cache[key] != null) {
      try {
        return JSON.parse(this.cache[key]);
      } catch (e) {
        return this.cache[key];
      }
    } else {
      var result = this.defaults[key];
      try {
        result = this.defaults[key] ? JSON.parse(JSON.stringify(this.defaults[key])) : null;
      } catch (e) {
        console.warn('获取Setting数据失败 key:', key, ' value:', this.defaults[key]);
      }
      return result;
    }
  },

  set(key, value, shouldSetInSyncedStorage) {
    if (shouldSetInSyncedStorage == null) {
      shouldSetInSyncedStorage = true;
    }
    this.cache[key] = JSON.stringify(value);
    this.log(`set: ${key} (length=${this.cache[key].length}, shouldSetInSyncedStorage=${shouldSetInSyncedStorage})`);
    if (this.shouldSyncKey(key)) {
      if (shouldSetInSyncedStorage) {
        const setting = {};
        setting[key] = this.cache[key];
        this.log(`chrome.storage.${storageArea}.set(${key})`);
        this.storage.set(setting);
      }
    }
    this.performPostUpdateHook(key, value);
  },

  clear(key) {
    this.log(`clear: ${key}`);
    this.set(key, this.defaults[key]);
  },

  has(key) {
    return key in this.cache;
  },

  use(key, callback) {
    this.log(`use: ${key} (isLoaded=${this.isLoaded})`);
    this.onLoaded(() => callback(this.get(key)));
  },

  // Add hooks to this object.
  postUpdateHooks: {},
  performPostUpdateHook(key, value) {
    if (this.postUpdateHooks[key]) {
      this.postUpdateHooks[key](value);
    }
  },

  nuke(key) {
    delete localStorage[key];
    chrome.storage.local.remove(key);
    if (chrome.storage.sync != null) {
      chrome.storage.sync.remove(key);
    }
  },

  log(...args) {
    if (this.debug) {
      console.log('settings:', ...args);
    }
  },

  defaults: {
    // 是否自动格式化页面JSON
    // jsonConfig: {
    //   theme: 'default',
    //   autoFormatJSONPage: true,
    //   structure: {
    //     styleActiveLine: true,
    //   },
    // },
    collectConfig: {
      keybord: true, // 快捷键
      menu: true, // 右键菜单
      button: true, // 按钮
    },
    newTabUrl: 'about:newtab',
    // injectConfig: InjectDefaultConfig,
    settingsVersion: '',
  },
  // frameConfigs: {
  //   doc: getDocFrameUrls(),
  // },
  // 所有需要 Tab、 BookMarks、History排除的Key
  // excludesMode: ['json', 'calc', 'date', 'qrcode', 'help', 'doc', 'ip', 'wd', 'version'],
};

Settings.init();

Settings.applyMigrations = function() {
  if (!Settings.get('settingsVersion')) {
  }
  Settings.set('settingsVersion', chrome.runtime.getManifest().version);
};
Settings.onLoaded(Settings.applyMigrations.bind(Settings));

export default Settings;
