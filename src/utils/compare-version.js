/**
 * 比较版本号, 返回比较结果
 * @description 因为会有子版本的问题，所以需要比较-后面的。 比如 "1.2.3-beta.1" < "1.2.3", "1.2.3-beta.2" < "1.2.3-beta.3"
 * @param {*} ver1
 * @param {*} ver2
 * @return 0:相同结果 1:ver1>ver2 -1:ver1<ver2
 */
const VERSION_RE = /^(.*?)-([-.0-9a-z]+)|$/i;
export const compareVersion = (ver1, ver2) => {
  // 切割主版本副版本
  // "1.2.3-2.1-release" => ['1.2.3-2.1-release', '1.2.3', '2.1-release']
  // "1.2.3-beta.12" =>  ['1.2.3-beta.12', '1.2.3', 'beta.12']
  //
  const [, mainVer1 = ver1 || '', preVer1] = VERSION_RE.exec(ver1);
  const [, mainVer2 = ver2 || '', preVer2] = VERSION_RE.exec(ver2);

  // 无副版本号 > 有小版本号
  // "" > "beta.2" => !"" - !"beta.2" => 1 - 0 => 1
  // "beta.2" < "" => !"beta.2" - !"" => 0 - 1 => -1
  // 两者都有小版本号
  // .....
  const result = compareVersionRank(mainVer1, mainVer2) || !preVer1 - !preVer2;
  return result;
};

// 比较版本号
export const compareVersionRank = (ver1, ver2) => {
  let i = 0;
  let j = 0;
  const n = ver1.length;
  const m = ver2.length;
  while (i < n || j < m) {
    let x = 0;
    for (; i < n && ver1[i] !== '.'; ++i) {
      x = x * 10 + ver1[i].charCodeAt() - '0'.charCodeAt();
    }
    ++i;
    let y = 0;
    for (; j < m && ver2.charAt(j) !== '.'; ++j) {
      y = y * 10 + ver2[j].charCodeAt() - '0'.charCodeAt();
    }
    ++j;
    if (x !== y) {
      return x < y ? -1 : 1;
    }
  }
  return 0;
};
