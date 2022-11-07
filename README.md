C笔记
ver: 3.0.1
### 介绍

### 说明
C笔记为[CSDN浏览器助手](https://plugin.csdn.net/download-list)中的功能。此仓库代码为精简而来，只包含C笔记功能。源码仅供学习参考，完整功能请使用[CSDN浏览器助手](https://plugin.csdn.net)
 
# 开发环境

```
 node: >=10.0.0
 npm/cnpm >6.14.8
```

## 下载依赖

```
npm install
```

## 开发：

```
npm run dev  

1.执行之后会在extension目录输出文件
2.在chrome://extensions/中打开开发者模式
3.点击“加载已解压的扩展程序”，选择extension目录
```

## 打包

```
npm run build:zip 
```
