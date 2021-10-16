/*
 * @Author: zhangyang
 * @Date: 2021-07-13 14:51:30
 * @LastEditTime: 2021-10-16 19:07:46
 * @Description: 处理文件上传
 */
import { Context } from 'koa';
import { YoungRoute } from '../decorators/YoungRoute';
import { respond } from './msgFormat';

export class FileController {
  /**
   * 处理文件上传
   */
  @YoungRoute('10000/22')
  static async uploadHandler(ctx: Context) {
    const files = ctx.request.files;
    const urls: string[] = [];
    if (files) {
      for (const file of Object.values(files) as any[]) {
        const prefix = '/upload/admin';
        const p_split = process.platform === 'linux' ? '/' : '\\';
        const name = file.path.split(p_split).pop();
        urls.push(`${prefix}/${name}`);
      }
    }
    respond(ctx, urls, 'success');
  }
}