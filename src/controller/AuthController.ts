/*
 * @Author: zhangyang
 * @Date: 2021-07-09 09:36:28
 * @LastEditTime: 2021-07-12 10:58:53
 * @Description: 权限控制
 */
import { getRepository, Not } from 'typeorm';

import { User } from '../entity/User';
import { Role } from '../entity/Role';
import { Node } from '../entity/Node';
export class AuthController {
  static async hasPermission(aid: number, path: string) {
    const userRepo = getRepository(User);
    const roleRepo = getRepository(Role);
    const nodeRepo = getRepository(Node);

    const user = await userRepo.findOne({ where: { aid }, relations: ['metadata'] });
    if (user) {
      const role_id = user.metadata.role_id;

      const role = await roleRepo.findOne({ where: { autoid: role_id } });
      let nodes: Node[] = [];
      if (role?.role_access === '*') {
        nodes = await nodeRepo.find({ where: { autoid: Not(0) } });
      } else {
        const arr = (role?.role_access??'').split(',');
        for (const n of arr) {
          const node = await nodeRepo.findOne({ where: { autoid: n } });
          node && nodes.push(node);
        }
      }
      return nodes.some((node) => node.node_path === path);
    } else {
      return false;
    }
  }
}