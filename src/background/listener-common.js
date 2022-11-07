// import reportInstallChannel from './reportInstallChannel';
const manifest = chrome.runtime.getManifest();

const RondomPass = function(number) {
  var arr = [];
  var arr1 = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  for (var i = 0; i < number; i++) {
    var n = Math.floor(Math.random() * 10);
    arr[i] = arr1[n];
  }
  return arr.join('');
};

export const setCSDNDomainCookie = () => {
  const checkLastRuntimeError = () => chrome.runtime.lastError;

  try {
    // pluginUUID
    chrome.storage.local.get('installUUID', function(items) {
      if (items.installUUID) {
        chrome.cookies.set(
          {
            url: 'https://csdn.net',
            domain: '.csdn.net',
            expirationDate: ~~(+new Date() / 1000) + 365 * 24 * 3600,
            name: 'pluginUUID',
            value: items.installUUID,
          },
          checkLastRuntimeError
        );
      }
    });
    // pluginId
    if (chrome.runtime.getURL) {
      const pluginId = chrome.runtime.getURL('/').split('//')[1];
      chrome.cookies.set(
        {
          url: 'https://csdn.net',
          domain: '.csdn.net',
          expirationDate: ~~(+new Date() / 1000) + 365 * 24 * 3600,
          name: 'pluginId',
          value: pluginId.substring(0, pluginId.length - 1),
        },
        checkLastRuntimeError
      );
    }
    // pluginVersion
    if (manifest.version) {
      chrome.cookies.set(
        {
          url: 'https://csdn.net',
          domain: '.csdn.net',
          expirationDate: ~~(+new Date() / 1000) + 365 * 24 * 3600,
          name: 'pluginVersion',
          value: manifest.version,
        },
        checkLastRuntimeError
      );
    }
  } catch (e) {
    console.log('set cookie error');
  }
};

export const pluginInstallInit = reason => {
  chrome.runtime.onInstalled.addListener(function({ reason }) {
    if (!['chrome_update', 'shared_module_update'].includes(reason)) {
      chrome.storage.local.set({ installDate: new Date().toString() });
    }
    chrome.storage.local.get('installUUID', function(items) {
      let UUID = `10_${RondomPass(11)}-${+new Date()}-${RondomPass(6)}`;
      if (!items.installUUID) {
        chrome.storage.local.set({ installUUID: UUID }, function() {
          // reportInstallChannel(UUID);
          setCSDNDomainCookie();
        });
      } else {
        UUID = items.installUUID;
        setCSDNDomainCookie();
      }
    });
  });
};

export const jsonbrowserAction = () => {
  chrome.action.onClicked.addListener(tab => {
    const checkLastRuntimeError = () => chrome.runtime.lastError;
    const url = chrome.runtime.getURL('pages/jsonPages.html');
    chrome.tabs.create({ url: url, active: true }, checkLastRuntimeError);
  });
};
