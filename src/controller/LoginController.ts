
/*
 * @Author: zhangyang
 * @Date: 2021-04-08 11:02:48
 * @LastEditTime: 2021-07-09 09:14:45
 * @Description: 处理登录
 */
import { getRepository } from 'typeorm';
import { User } from '../entity/User';
import { Context } from 'koa';
import { respond } from './msgFormat';
import svgCaptcha from 'svg-captcha';
import conf from '../../conf';
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