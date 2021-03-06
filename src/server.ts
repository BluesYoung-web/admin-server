/*
 * @Author: zhangyang
 * @Date: 2020-09-23 08:58:47
 * @LastEditTime: 2021-08-02 11:09:50
 * @Description: http 服务器启动配置
 */
import Koa from 'koa';
import cors from '@koa/cors';
import koaBody from 'koa-body';
import helmet from 'koa-helmet';
import staticFile from 'koa-static';
import path from 'path';
import router from './routers';
import WebSocket, { Server as WebSocketServer } from 'ws';
import conf from '../conf';
import { myredis } from './database/conn';

import logger from './middleware/logger';
import auth from './middleware/auth';
import { MySocket } from './model/socket';
import { URLSearchParams } from 'url';
import { pushFormat } from './controller/msgFormat';

export const createApp = () => {
  const app = new Koa();
  const httpPort = conf.CONF_HTTP_PORT;
  // 处理跨域
  app.use(cors());
  // 加入安全的响应头信息
  app.use(helmet());
  // 记录日志
  app.use(logger());
  // 静态文件托管
  app.use(staticFile(path.join(__dirname, '../public')));
  
  // 参数解析 + 文件上传
  app.use(koaBody({
    multipart: true, // 不设置这个无法解析 FormData 传递的参数
    encoding: 'gzip',
    formidable: {
      uploadDir: path.join(__dirname, '../public/upload/'),
      keepExtensions: true,
      maxFieldsSize: 1024 * 1024 * 2
    }
  }));
  // 鉴权
  app.use(auth());
  // 路由
  app.use(router());
  app.listen(httpPort, () => {
    console.log('服务器运行中......');
    console.log(`http://localhost:${httpPort}`);
  });
};
/**
 * websocket 服务器
 */
let ws: WebSocketServer;
/**
 * websocket 连接池
 */
const websocketPool = new Map<string, WebSocket>();
/**
 * 签名校验
 */
const tokenCheck = async (sign: string, uid: string, conn: WebSocket) => {
  const md5 = require('md5');
  const token = await myredis.get(uid + '_token');
    if (md5(uid + token) == sign) {
      // 挤号
      updateSocketPool(uid, conn);
      // 验证成功，实例化 socket
      let socket = new MySocket(uid, conn, websocketPool);
      // 清空离线消息队列
      await socket.offLineSend(uid, conn);

      conn.on('message', (str: string) => {
        try {
          str = JSON.parse(str);
        } catch (error) {
          null;
        }
        socket.msgProcess(str as any);
      });

      conn.on('close', (code, reason) => {
        console.log('socket服务器关闭:\n' + code + reason);
        websocketPool.delete(uid);
      });
      conn.on('error', (code: Error, reason: any) => {
        console.log('服务器异常关闭:\n' + code + reason);
        websocketPool.delete(uid);
      });
      const str = pushFormat(conf.Structor.操作成功, { msg: '签名校验成功，欢迎使用' });
      conn.send(str);
    } else {
      conn.send(pushFormat(conf.Structor.操作失败, { msg: '签名过期，请重新登录' }, conf.Structor.签名过期));
      conn.close(4000, '签名错误');
    }
};
/**
 * 更新连接池，确保一个账户同一时间只有一个连接
 */
const updateSocketPool = (uid: string, conn: WebSocket) => {
  const old_client = websocketPool.get(uid);
  if (old_client) {
    old_client.send(pushFormat(conf.Structor.操作失败, { msg: '账号异地登录，建议重新登录之后修改密码' }, conf.Structor.异地登录));
    old_client.close(4001, '异地登录');
  }
  websocketPool.set(uid, conn);
}
export const createWebSocket = () => {
  const wsPort = conf.CONF_WS_PORT;
  ws = new WebSocketServer({
    port: wsPort
  });
  ws.on('connection', async (socket, req) => {
    const { aid, sign } = Object.fromEntries(Array.from(new URLSearchParams(req.url?.substr(1))));
    tokenCheck(sign, aid, socket);
  });
  console.log('websocket 服务已启动');
  console.log(`ws://localhost:${wsPort}`);
};

export default createApp;