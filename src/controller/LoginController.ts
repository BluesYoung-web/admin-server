
/*
 * @Author: zhangyang
 * @Date: 2021-04-08 11:02:48
 * @LastEditTime: 2021-07-12 10:34:06
 * @Description: 处理登录
 */
import { getRepository } from 'typeorm';
import { Context } from 'koa';
import { respond } from './msgFormat';
import svgCaptcha from 'svg-captcha';
import conf from '../../conf';
import { User } from '../entity/User';
import { Role } from '../entity/Role';
import { Node } from '../entity/Node';
import { UserMetaData } from '../entity/UserMetadata';
import { myredis } from './../database/conn';
import { YoungRoute } from '../decorators/YoungRoute';

/**
 * 制作token的函数
 */
 const makeToken = function(){
  const md5 = require('md5');
  const sha1 = require('sha1');
  const key = conf.CONF_TOKEN_KEY;
  return md5(key + sha1(new Date().getTime()));
}

export class LoginController {
  /**
   * 用户登录
   */
  @YoungRoute('10000/1', true)
  static async userLogin(ctx: Context) {
    const userRepository = getRepository(User);
    const md5 = require('md5');
    const { login_name: username, login_code: passwd } = ctx.request.body;
    // 用户名登录或者手机号登录
    const hasUser = await userRepository.findOne({ where: [{ admin_name: username }, { phone_number: username }], relations: ['metadata'] });

    if (hasUser) {
      // 封号了
      if (hasUser.metadata.is_enable === 0) {
        respond(ctx, '账号封禁，请联系管理员解封', 'fail');
        return;
      }
      // 用户存在，校验密码
      if (md5(passwd) === hasUser.passwd) {
        const token = makeToken();
        await myredis.set(hasUser.aid + '_token', token);
        respond(ctx, { token, aid: hasUser.aid }, 'success');
      } else {
        respond(ctx, '账号或密码错误', 'fail');
      }
    } else {
      respond(ctx, '账号不存在', 'fail');
    }
  }
  /**
   * 退出登录
   */
  @YoungRoute('10000/2', true)
  static async loginOut(ctx: Context) {
    // TODO 清除token
    respond(ctx, '退出登录成功', 'success');
  }
  /**
   * 获取用户对应的信息
   */
  @YoungRoute('10000/3', true)
  static async getUserInfo(ctx: Context) {
    const { aid } = ctx.request.body;

    interface UserInfo {
      admin_name: string;
      autoid: number;
      create_time: string;
      is_enable: 0 | 1;
      last_time?: string;
      login_ip?: string;
      login_time?: string;
      menuBar: Node[];
      phone_number: string;
      real_name: string;
      role_id: number[];
      role_name: string;
    };
    let res: UserInfo = {
      admin_name: '',
      autoid: aid,
      create_time: '',
      is_enable: 1,
      menuBar: [],
      phone_number: '',
      real_name: '',
      role_id: [],
      role_name: ''
    };
    const userRepo = getRepository(User);
    const roleRepo = getRepository(Role);
    const nodeRepo = getRepository(Node);

    const user = await userRepo.findOne({ where: { aid }, relations: ['metadata'] });
    if (user) {
      res.admin_name = user.admin_name??'';
      res.create_time = user.metadata.time??'';
      res.is_enable = user.metadata.is_enable??1;
      res.phone_number = user.phone_number??''
      res.real_name = user.metadata.real_name??'';

      const role_id = user.metadata.role_id;
      const role = await roleRepo.findOne({ where: { autoid: role_id } });
      res.role_id = [Number(role_id)];
      res.role_name = role?.role_name??'';
      let nodes: Node[] = [];
      if (role?.role_access === '*') {
        // 获取所有一级节点
        nodes = await nodeRepo.createQueryBuilder('node')
          .select('node.autoid', 'autoid')
          .addSelect('node.is_show', 'is_show')
          .addSelect('node.node_desc', 'node_desc')
          .addSelect('node.node_name', 'node_name')
          .addSelect('node.node_path', 'node_path')
          .addSelect('node.node_sort', 'node_sort')
          .addSelect('node.node_type', 'node_type')
          .addSelect('node.parent_id', 'parent_id')
          .where(`node.node_type = 1`)
          .orderBy('node.node_sort', 'DESC')
          .getRawMany();
      } else {
        const arr = (role?.role_access??'').split(',');
        for (const n of arr) {
          // 获取所有一级节点
          const node = await nodeRepo.createQueryBuilder('node')
          .select('node.autoid', 'autoid')
          .addSelect('node.is_show', 'is_show')
          .addSelect('node.node_desc', 'node_desc')
          .addSelect('node.node_name', 'node_name')
          .addSelect('node.node_path', 'node_path')
          .addSelect('node.node_sort', 'node_sort')
          .addSelect('node.node_type', 'node_type')
          .addSelect('node.parent_id', 'parent_id')
          .where(`node.autoid = ${n}`)
          .andWhere(`node.node_type = 1`)
          .orderBy('node.node_sort', 'DESC')
          .getRawOne();
          node && nodes.push(node);
        }
      }
      for (const node of nodes) {
        // 获取所有二级节点
        node.part = await nodeRepo.createQueryBuilder('node')
        .select('node.autoid', 'autoid')
        .addSelect('node.is_show', 'is_show')
        .addSelect('node.node_desc', 'node_desc')
        .addSelect('node.node_name', 'node_name')
        .addSelect('node.node_path', 'node_path')
        .addSelect('node.node_sort', 'node_sort')
        .addSelect('node.node_type', 'node_type')
        .addSelect('node.parent_id', 'parent_id')
        .where(`node.parent_id = ${node.autoid}`)
        .andWhere(`node.node_type = 2`)
        .orderBy('node.node_sort', 'DESC')
        .getRawMany();
        for (const sub_node of node.part) {
          // 获取所有三级节点(页面路由最多只到3级，4级节点一般用于控制具体权限)
          sub_node.part = await nodeRepo.createQueryBuilder('node')
          .select('node.autoid', 'autoid')
          .addSelect('node.is_show', 'is_show')
          .addSelect('node.node_desc', 'node_desc')
          .addSelect('node.node_name', 'node_name')
          .addSelect('node.node_path', 'node_path')
          .addSelect('node.node_sort', 'node_sort')
          .addSelect('node.node_type', 'node_type')
          .addSelect('node.parent_id', 'parent_id')
          .where(`node.parent_id = ${sub_node.autoid}`)
          .andWhere(`node.node_type = 3`)
          .orderBy('node.node_sort', 'DESC')
          .getRawMany();
        }
      }
      res.menuBar = nodes;
      return respond(ctx, res, 'success');
    } else {
      return respond(ctx, '请联系管理员完善您的信息', 'fail');
    }
  }
  /**
   * 修改密码
   */
  @YoungRoute('10000/4', true)
  static async modPasswd(ctx: Context) {
    const { aid, old_pass, pass } = ctx.request.body;
    if (old_pass === pass) {
      respond(ctx, '修改后的密码与原密码相同', 'fail');
      return;
    }
    const userRepo = getRepository(User);
    const user = await userRepo.findOne({ where: { aid } });
    if (user) {
      const md5 = require('md5');
      if (user.passwd === md5(old_pass)) {
        user.passwd = md5(pass);
        const res = await userRepo.save(user);
        respond(ctx, res, 'success');
      } else {
        respond(ctx, '旧密码错误', 'fail');
      }
    } else {
      respond(ctx, '用户不存在', 'fail');
    }
  }

  static async getCaptcha(ctx: Context) {
    const cap = svgCaptcha.create({
      size: 4, // 验证码长度
      width: 120,
      height: 40,
      fontSize: 40,
      ignoreChars: '0oO1ilI', // 验证码字符中排除 0o1i
      noise: 2, // 干扰线条的数量
      color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
      background: '#eee' // 验证码图片背景颜色
    });
    respond(ctx, cap, 'success');
  }

}