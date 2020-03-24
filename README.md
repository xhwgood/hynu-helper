# 我的衡师
为衡师莘莘学子量身打造的微信小程序

基于 **Taro.js** 与小程序云开发的校园工具类微信小程序（所有数据均使用node.js爬虫获取）。

本项目开源度99.9%，为保证校园卡安全，校园卡密码加密算法不开源。

## 实现细节

主要页面：课程表、毕业设计、查四六级、选修课、找人、教学评价、查成绩、图书馆、考试安排、校园卡

已实现功能：教务处登录、教务处密码重置、查询所有学期课程、查看论文课题、找人、图书馆信息查询、图书馆历史借阅查询、校园卡充值、校园卡余额查询、校园卡账单查询、成绩查询/排序

### 课程表

<!-- [课程表](http://cdn.xianghw.xyz/%E8%AF%BE%E7%A8%8B%E8%A1%A8.png "课程表") -->
<img src="http://cdn.xianghw.xyz/%E8%AF%BE%E7%A8%8B%E8%A1%A8.png" width="160" />

### CET查询

<img src="http://cdn.xianghw.xyz/%E6%9F%A5%E5%9B%9B%E5%85%AD%E7%BA%A7.png" width="160" />

### 百宝箱

<img src="http://cdn.xianghw.xyz/%E7%99%BE%E5%AE%9D%E7%AE%B1.png" width="160" />


## :package: Build Setup

``` bash
# 克隆仓库至本地
$ git clone https://github.com/xhwgood/hynu-helper.git

# 安装依赖
$ cd client && npm install

# 全局 taro-cli 版本需与项目版本保持一致，否则可能无法编译
$ npm run dev:weapp

# 编译成功后在小程序开发者工具中导入项目，选择项目根目录
```
