# 基于 Koa + ws + TypeORM

- koa 搭建 http 服务器
- ws 搭建 websocket 服务器
- typeorm 处理数据库
- mysql 持久化存储
- redis 存储 token 以及离线消息队列(由于经过一段时间之后会自动断开，所以目前采用的方案是每次操作都新建一个连接实例，操作完成之后断开连接)
- 配套前端代码[admin-vue3-element3-vite2](https://gitee.com/BluseYoung-web/admin-vue3-element3-vite2)

## 开发进度

- [x] HTTP 服务器
- [x] WebSocket 服务器
- [x] 动态路由及控制器
- [ ] post 登录返回 token

## 使用

- node 版本： 16+

```bash
# 装依赖
yarn
# 直接运行
yarn dev
# 编译为 js
yarn build
# 运行打包后的 js 文件
yarn pre
```