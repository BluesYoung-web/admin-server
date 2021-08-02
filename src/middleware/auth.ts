/*
 * @Author: zhangyang
 * @Date: 2021-08-01 17:01:59
 * @LastEditTime: 2021-08-02 11:16:41
 * @Description:  负责权限校验的中间件
 */
import { AuthController } from './../controller/AuthController';
import AllController from '../controller';
import { controllerMap } from '../decorators/YoungRoute';
import { Context, Next } from 'koa';
import { respond } from '../controller/msgFormat';
import { unlinkSync } from 'fs';

export default () => async (ctx: Context, next: Next) => {
  const { com, task } = ctx.request.body;
  AllController; // 仅为触发装饰器
  const handler = controllerMap.get(`${com}/${task}`);
  if (handler) {
    // 默认需要鉴权通过之后才能执行
    if (!handler.no_auth) {
      const res = await AuthController.hasPermission(ctx);
      if (!res) {
        // 目前只有 koa-body 可以解析 form 传参，但是又不能执行两次，只有曲线救国
        // 权限不足，如果是上传文件的，则删除对应的文件
        const files = ctx.request.files;
        if (files) {
          for (const file of Object.values(files) as any[]) {
            try {
              unlinkSync(file.path);
            } catch (error) {
              null;
            }
          }
        }
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