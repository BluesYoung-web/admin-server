/*
 * @Author: zhangyang
 * @Date: 2021-07-08 16:25:23
 * @LastEditTime: 2021-07-08 17:36:37
 * @Description: 用户表
 */
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserMetaData } from './UserMetadata';

@Entity()
export class User {
  /**
   * 唯一 id，自增
   */
  @PrimaryGeneratedColumn()
  aid: number;
  /**
   * 用户名(用于登录及唯一标识)
   */
  @Column({ unique: true })
  admin_name: string;
  /**
   * 手机号
   */
  @Column({ length: 11, default: '' })
  phone_number?: string;
  /**
   * 密码
   */
  @Column()
  passwd: string;
  /**
   * 关联详细信息
   */
  @OneToOne(() => UserMetaData, meta => meta.autoid, {
    cascade: true // 保存用户的时候，自动保存相关联的元数据
  })
  @JoinColumn()
  metadata: UserMetaData;
}