/*
 * @Author: zhangyang
 * @Date: 2021-07-12 12:23:50
 * @LastEditTime: 2021-07-12 17:48:32
 * @Description: 管理员相关
 */
import { Context } from 'koa';
import { User } from '../entity/User';
import { getRepository } from 'typeorm';
import { YoungRoute } from '../decorators/YoungRoute';
import { respond } from './msgFormat';

export class UserController {
  /**
   * 获取管理员列表
   */
  @YoungRoute('10000/12')
  static async getAdminList(ctx: Context) {
    const userRepo = getRepository(User);
    const {
      name,
      real_name,
      phone,
      page = 1,
      limit = 10
    } = ctx.request.body;
    let sql = userRepo.createQueryBuilder('user')
      .leftJoinAndSelect('user.metadata', 'meta')
      .leftJoinAndSelect('role', 'role', 'meta.role_id = role.autoid')
      .select('user.admin_name', 'admin_name')
      .addSelect('user.aid', 'autoid')
      .addSelect('meta.time', 'create_time')
      .addSelect('meta.is_enable', 'is_enable')
      .addSelect('meta.real_name', 'real_name')
      .addSelect('role.role_name', 'role_des');
    if (name) {
      sql = sql.andWhere(`user.admin_name = '${name}'`);
    }
    if (phone) {
      sql = sql.andWhere(`user.phone_number = '${phone}'`);
    }
    if (real_name) {
      sql = sql.andWhere(`meta.real_name LIKE '%${real_name}%'`);
    }
    const total = await sql.getCount();
    const users = await sql
      .offset((page - 1) * limit)
  	  .limit(limit)
      .getRawMany();
    respond(ctx, { list: users, total }, 'success');
  }
}