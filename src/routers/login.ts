/*
 * @Author: zhangyang
 * @Date: 2021-04-08 09:51:39
 * @LastEditTime: 2021-07-09 09:41:38
 * @Description: 登录路由
 */
import { Young_Route_Item } from '../@types/my-routes';
import { LoginController } from './../controller/LoginController';


export const router: Young_Route_Item[] = [
  { path: '10000/1', handler: LoginController.userLogin, no_auth: true },
  { path: '10000/2', handler: LoginController.getCaptcha },
  { path: '10000/3', handler: LoginController.getCaptcha },
];