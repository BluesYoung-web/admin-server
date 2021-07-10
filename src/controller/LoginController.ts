
/*
 * @Author: zhangyang
 * @Date: 2021-04-08 11:02:48
 * @LastEditTime: 2021-07-10 20:24:23
 * @Description: 处理登录
 */
import { getRepository, Not } from 'typeorm';
import { Context } from 'koa';
import { respond } from './msgFormat';
import svgCaptcha from 'svg-captcha';
import conf from '../../conf';
import { User } from '../entity/User';
import { Role } from '../entity/Role';
import { Node } from '../entity/Node';
import { UserMetaData } from '../entity/UserMetadata';
import { myredis } from './../database/conn';

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
  static async userLogin(ctx: Context) {
    const userRepository = getRepository(User);
    const md5 = require('md5');
    console.log(ctx.body)
    const { login_name: username, login_code: passwd } = ctx.request.body;
    const savePass = md5(passwd);
    const hasUser = await userRepository.findOne({ where: { admin_name: username } });
    const token = makeToken();

    if (hasUser) {
      // 用户存在，校验密码
      if (savePass === hasUser.passwd) {
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
  static async loginOut(ctx: Context) {
    respond(ctx, '退出登录成功', 'success');
  }
  /**
   * 获取用户对应的信息
   */
  static async getUserInfo(ctx: Context) {
    const { com, task, aid } = ctx.request.body;
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
      return respond(ctx, nodes, 'success');
    } else {
      return respond(ctx, '请联系管理员完善您的信息', 'fail');
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