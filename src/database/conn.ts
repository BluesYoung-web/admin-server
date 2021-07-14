/*
 * @Author: zhangyang
 * @Date: 2021-04-09 13:38:07
 * @LastEditTime: 2021-07-14 09:38:26
 * @Description: 初始化 redis 连接
 */
import { createClient, RedisClient } from 'redis';
import { error } from './../middleware/logger';
import conf from '../../conf';

class MyRedis {
  private client: RedisClient;
  createClient() {
    this.client = createClient(conf.CONF_REDIS);
  }
  async get(key: string) {
    this.createClient();
    return new Promise((resolve, reject) => {
      this.client.get(key, (err: Error, data: string) => {
        if (err) {
          reject(err);
        } else {
          try {
            data = JSON.parse(data);
          } catch (error) {
            null;
          }
          resolve(data);
        }
        this.destory();
      });
    }).catch((err: Error) => error(err));
  }

  async set(key: string, value: any, exp = 0) {
    this.createClient();
    return new Promise((resolve, reject) => {
      if (typeof value === 'object') {
        value = JSON.stringify(value);
      }
      this.client.set(key, value, async (err: Error) => {
        if (err) {
          reject(err);
        } else {
          await this.exp(key, exp);
          resolve('OK');
        }
        this.destory();
      });
    }).catch((err) => error(err));
  }

  async exp(key: string, exp = 0) {
    this.createClient();
    return new Promise((resolve, reject) => {
      if (exp > 0) {
        this.client.expire(key, exp, (err: Error) => {
          if (err) {
            reject(err);
          } else {
            resolve('OK');
          }
          this.destory();
        });
      } else {
        resolve('OK');
        this.destory();
      }
    }).catch((err) => error(err));
  }

  async del(key: string) {
    this.createClient();
    return new Promise((resolve, reject) => {
      this.client.del(key, (err: Error) => {
        if (err) {
          reject(err);
        } else {
          resolve('OK');
        }
        this.destory();
      });
    }).catch((err) => error(err));
  }

  async destory() {
    return new Promise((resolve, reject) => {
      this.client.quit((err: Error) => {
        if (err) {
          reject(err);
        } else {
          resolve('OK');
        }
      });
    }).catch((err) => error(err));
  }
}

export const myredis = new MyRedis();