/*
 * @Author: zhangyang
 * @Date: 2021-04-08 14:10:59
 * @LastEditTime: 2021-07-09 09:18:59
 * @Description: 
 */
import { Context } from 'koa';

type RespondType = 'success' | 'token no use' | 'fail';
export const respond = (ctx: Context, data: any, type: RespondType) => {
  switch (type) {
    case 'success':
      ctx.body = { status: 0, data, msg: '成功' };
      break;
    case 'token no use':
      ctx.body = { status: -1, data, msg: '登录过期' };
      break;
    case 'fail':
      ctx.body = { status: 99999, data: ctx.request.body, msg: data };
      break;
    default:
      ctx.body = { status: 99999, data: ctx.request.body, msg: data };
      break;
  }
};

export const pushFormat = (cbk: string, data: any, extra: any = null) => {
  return JSON.stringify({ cbk, data, extra });
};