/*
 * @Author: zhangyang
 * @Date: 2021-07-08 17:16:46
 * @LastEditTime: 2021-07-08 17:26:00
 * @Description: 角色列表
 */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Role {
  /**
   * 自增唯一id
   */
  @PrimaryGeneratedColumn()
  autoid: number;
  /**
   * 启用状态
   */
  @Column({ type: 'tinyint', default: 1 })
  is_enable: number;
  /**
   * 父级角色 id
   */
  @Column({ default: 0 })
  parent_role_id?: number;
  /**
   * 平台类型(可以在同时控制多个平台时，进行区分)
   */
  @Column({ type: 'tinyint', default: 0 })
  platform_type?: number;
  /**
   * 角色描述
   */
  @Column({ default: '' })
  role_desc?: string;
  /**
   * 角色名称
   */
  @Column()
  role_name: string;
  /**
   * 拥有权限的所有节点
   */
  @Column({ type: 'longtext' })
  role_access: string;
}