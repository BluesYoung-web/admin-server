/*
 * @Author: zhangyang
 * @Date: 2021-07-09 09:36:28
 * @LastEditTime: 2021-07-14 11:15:22
 * @Description: 权限控制
 */
import { getRepository, Not } from 'typeorm';
import { myredis } from './../database/conn';
import { User } from '../entity/User';
import { Role } from '../entity/Role';
import { Node } from '../entity/Node';
import { Context } from 'koa';
import { respond } from './msgFormat';

export class AuthController {
  static async hasPermission(ctx: Context) {
    const { com, task, aid, token } = ctx.request.body;
    const _path = `${com}/${task}`;
    const server_token = await myredis.get(`${aid}_token`);
    if (server_token && server_token === token) {
      // token 未过期，重置过期时间
      await myredis.set(`${aid}_token`, token, 60 * 10);
    } else {
      respond(ctx, '登录过期，请重新登录', 'token no use');
      return false;
    }
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
      if (nodes.some((node) => node.node_path === _path)) {
        return true;
      } else {
        respond(ctx, '权限不足，请联系管理员添加对应的权限', 'fail');
        return false;
      }
    } else {
      respond(ctx, '权限不足，请联系管理员添加对应的权限', 'fail');
      return false;
    }
  }
}