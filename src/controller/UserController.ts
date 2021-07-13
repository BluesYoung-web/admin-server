/*
 * @Author: zhangyang
 * @Date: 2021-07-12 12:23:50
 * @LastEditTime: 2021-07-13 10:27:27
 * @Description: 管理员相关
 */
import { Context } from 'koa';
import { User } from '../entity/User';
import { getRepository } from 'typeorm';
import { YoungRoute } from '../decorators/YoungRoute';
import { respond } from './msgFormat';
import { error } from '../middleware/logger';
import { UserMetaData } from '../entity/UserMetadata';

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
      .addSelect('user.phone_number', 'phone_number')
      .addSelect('meta.time', 'create_time')
      .addSelect('meta.is_enable', 'is_enable')
      .addSelect('meta.real_name', 'real_name')
      .addSelect('meta.role_id', 'role_id')
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
  /**
   * 新增 | 编辑管理员
   */
  @YoungRoute('10000/14')
  static async changeUser(ctx: Context) {
    const {
      admin_id,
      is_enable,
      name,
      phone,
      pwd,
      real_name,
      role
    } = ctx.request.body;
    const userRepo = getRepository(User);
    const md5 = require('md5');

    if (admin_id > 0) {
      // 编辑
      const user = await userRepo.findOne({ where: { aid: admin_id }, relations: ['metadata'] });
      if (user) {
        name && (user.admin_name = name);
        pwd && (user.passwd = md5(pwd));
        phone && (user.phone_number = phone);
        real_name && (user.metadata.real_name = real_name);
        user.metadata.is_enable = is_enable;
        user.metadata.role_id = role;
        try {
          await userRepo.save(user);
          respond(ctx, '编辑成功', 'success');
        } catch (err) {
          error(err);
          respond(ctx, err, 'fail');
        }
      } else {
        respond(ctx, '用户不存在', 'fail');
      }
    } else {
      // 新建
      const user = new User();
      const metadata = new UserMetaData();
      user.admin_name = name;
      user.passwd = md5(pwd);
      user.phone_number = phone;
      metadata.is_enable = is_enable;
      metadata.real_name = real_name;
      metadata.role_id = role;
      user.metadata = metadata;
      try {
        await userRepo.save(user);
        respond(ctx, '新建成功', 'success');
      } catch (err) {
        error(err);
        respond(ctx, err, 'fail');
      }
    }
  }
  /**
   * 删除管理员
   */
  @YoungRoute('10000/15')
  static async delUser(ctx: Context) {
    const { admin_id } = ctx.request.body;
    const userRepo = getRepository(User);
    try {
      await userRepo.createQueryBuilder('user')
        .delete()
        .where(`user.aid = ${admin_id}`)
        .execute();
      respond(ctx, '删除成功', 'success');
    } catch (err) {
      error(err);
      respond(ctx, '删除失败', 'fail');
    }
  }
}