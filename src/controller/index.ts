/*
 * @Author: zhangyang
 * @Date: 2021-06-17 17:49:54
 * @LastEditTime: 2021-07-12 12:24:58
 * @Description: 统一暴露，触发装饰器
 */
import { LoginController } from './LoginController';
import { NodeController } from './NodeController';
import { RoleController } from './RoleController';
import { UserController } from './UserController';
import { ErrorController } from './ErrorController';

export default {
  LoginController,
  NodeController,
  RoleController,
  UserController,
  ErrorController
};