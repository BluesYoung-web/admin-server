/*
 * @Author: zhangyang
 * @Date: 2021-04-08 09:51:39
 * @LastEditTime: 2021-07-12 10:47:00
 * @Description: 路由汇总
 */
import KoaRouter from '@koa/router';
import { Context } from 'koa';
import combineRouters from 'koa-combine-routers';
import { respond } from '../controller/msgFormat';
import { AuthController } from './../controller/AuthController';
import { controllerMap } from '../decorators/YoungRoute';
const router  = new KoaRouter();
router.post('/', async (ctx: Context) => {
  const { com, task, aid } = ctx.request.body;
  const _path = `${com}/${task}`;

  const handler = controllerMap.get(_path);
  if (handler) {
    // 默认需要鉴权通过之后才能执行
    if (!handler.no_auth) {
      const res = await AuthController.hasPermission(aid, _path);
      if (!res) {
        respond(ctx, '权限不足，请联系管理员添加对应的权限', 'fail');
        return;
      }
    }
    await handler.handler(ctx);
  } else {
    respond(ctx, '无对应的服务', 'fail');
    return;
  }
});
export default combineRouters(router);