/*
 * @Author: zhangyang
 * @Date: 2021-07-08 16:26:45
 * @LastEditTime: 2021-07-08 17:42:00
 * @Description: 用户详细信息表
 */
import { Column, CreateDateColumn, Entity, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
@Entity()
export class UserMetaData {
  /**
   * 自增主键
   */
  @PrimaryGeneratedColumn()
  autoid: number;
  /**
   * 用户关联id
   */
  @OneToOne(() => User, user => user.metadata)
  user: User;
  /**
   * 真实姓名
   */
  @Column({ default: '' })
  real_name?: string;
  /**
   * 角色 id
   */
  @Column({ default: '' })
  role_id?: string;
  /**
   * 注册时间
   */
  @CreateDateColumn()
  time: string;
  /**
   * 激活状态
   * 0 禁用，1 激活
   */
  @Column({ type: 'tinyint', default: 1 })
  is_enable: 0 | 1;
}
