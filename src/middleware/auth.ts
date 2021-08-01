/*
 * @Author: zhangyang
 * @Date: 2021-08-01 17:01:59
 * @LastEditTime: 2021-08-01 17:46:34
 * @Description:  负责权限校验的中间件
 */
import { AuthController } from './../controller/AuthController';
import AllController from '../controller';
import { controllerMap } from '../decorators/YoungRoute';
import { Context, Next } from 'koa';
import { respond } from '../controller/msgFormat';

export default () => async (ctx: Context, next: Next) => {
  console.log(ctx.request)
  const { com, task } = ctx.request.body;
  AllController; // 仅为触发装饰器
  const handler = controllerMap.get(`${com}/${task}`);
  if (handler) {
    // 默认需要鉴权通过之后才能执行
    if (!handler.no_auth) {
      const res = await AuthController.hasPermission(ctx);
      if (!res) {
        return;
      }
    }
    ctx._body = ctx.request.body;
    await next();
  } else {
    respond(ctx, '无对应的服务', 'fail');
    return;
  }
};