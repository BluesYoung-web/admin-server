/*
 * @Author: zhangyang
 * @Date: 2021-04-08 09:51:39
 * @LastEditTime: 2021-07-10 20:23:16
 * @Description: 登录路由
 */
import { Young_Route_Item } from '../@types/my-routes';
import { LoginController } from './../controller/LoginController';


export const router: Young_Route_Item[] = [
  { path: '10000/1', handler: LoginController.userLogin, no_auth: true },
  { path: '10000/2', handler: LoginController.loginOut, no_auth: true },
  { path: '10000/3', handler: LoginController.getUserInfo, no_auth: true },
];