/*
 * @Author: zhangyang
 * @Date: 2021-04-08 10:51:16
 * @LastEditTime: 2021-07-09 09:41:19
 * @Description: 
 */
import { Context } from 'koa';
export interface Young_Route_Item {
  path: string;
  handler(ctx: Context): Promise<any>;
  no_auth?: boolean;
}