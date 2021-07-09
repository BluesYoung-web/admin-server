/*
 * @Author: zhangyang
 * @Date: 2021-07-09 09:36:28
 * @LastEditTime: 2021-07-09 09:46:36
 * @Description: 权限控制
 */
import { getRepository } from 'typeorm';

import { User } from '../entity/User';
import { Role } from '../entity/Role';
import { Node } from '../entity/Node';
export class AuthController {
  static async hasPermission(aid: number, path: string) {
    console.log(aid, path);
    const userRepo = getRepository(User);
    return false;
  }
}