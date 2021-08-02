/*
 * @Author: zhangyang
 * @Date: 2021-04-08 09:51:39
 * @LastEditTime: 2021-08-02 10:57:43
 * @Description: 路由汇总
 */
import KoaRouter from '@koa/router';
import { Context } from 'koa';
import combineRouters from 'koa-combine-routers';
import { controllerMap } from '../decorators/YoungRoute';
const router  = new KoaRouter();
router.post('/', async (ctx: Context) => {
  const { com, task } = ctx.request.body;
  const handler = controllerMap.get(`${com}/${task}`);
  if (handler) {
    await handler.handler(ctx);
    return;
  }
});
export default combineRouters(router);