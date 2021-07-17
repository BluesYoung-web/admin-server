/*
 * @Author: zhangyang
 * @Date: 2021-04-08 09:51:39
 * @LastEditTime: 2021-07-17 20:12:23
 * @Description: 路由汇总
 */
import KoaRouter from '@koa/router';
import { Context } from 'koa';
import combineRouters from 'koa-combine-routers';
import { respond } from '../controller/msgFormat';
import { AuthController } from './../controller/AuthController';
import AllController from '../controller';
import { controllerMap } from '../decorators/YoungRoute';
const router  = new KoaRouter();
router.post('/', async (ctx: Context) => {
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
    await handler.handler(ctx);
    return;
  } else {
    respond(ctx, '无对应的服务', 'fail');
    return;
  }
});
export default combineRouters(router);