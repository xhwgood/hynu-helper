# 我的衡师
衡师精彩尽在我的衡师

基于 **Taro.js** 与 **小程序云开发** 的校园工具类微信小程序（所有数据均使用 node.js 爬虫获取）。

本项目开源度99.9%，为保证校园卡安全，校园卡密码加密算法不开源。

talk is cheap, show me the ~~code~~ qrcode

<img src="https://github.com/xhwgood/hynu-helper/blob/master/screenshot/hynu-helper.jpg" width="240" />

## 实现细节

主要页面：课程表、毕业设计、选修课、找人、查成绩、图书馆、考试安排、校园卡

主要功能：绑定教务处、教务处密码重置、抢选修课、查询所有学期课程、查看毕业设计课题、找人、图书馆信息查询/历史借阅查询、校园卡充值/余额查询/账单查询、成绩查询/排序等

### 部分页面展示

![card3](https://github.com/xhwgood/hynu-helper/blob/master/screenshot/card3.jpg)
![treasure3](https://github.com/xhwgood/hynu-helper/blob/master/screenshot/treasure3.jpg)
![classindex2](https://github.com/xhwgood/hynu-helper/blob/master/screenshot/classindex2.jpg)
![electives2](https://github.com/xhwgood/hynu-helper/blob/master/screenshot/electives2.jpg)

### 云函数的使用

<img src="https://github.com/xhwgood/hynu-helper/blob/master/screenshot/cloud-use.png" width="497" />

1、在已有 node.js 的环境下在终端中`npm install`后开启云函数本地调试；

2、直接上传并部署至你自己的云开发控制台。

## :package: Build Setup

``` bash
# 1.克隆仓库至本地
$ git clone https://github.com/xhwgood/hynu-helper.git

# 2.安装依赖
$ cd client && npm install

# 3.为考虑校园卡安全，校园卡加密算法不开源，需在 src/utils目录下建一个crypto.js文件，否则无法编译
# 全局 taro-cli 版本需与项目版本保持一致，否则会编译失败
$ npm run dev:weapp

# 4.编译成功后在小程序开发者工具中导入项目，选择项目根目录
```
