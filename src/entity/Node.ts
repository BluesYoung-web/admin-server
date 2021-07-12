/*
 * @Author: zhangyang
 * @Date: 2021-07-08 16:58:59
 * @LastEditTime: 2021-07-12 11:57:32
 * @Description: 节点表
 */
import { Column, Entity, OneToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Node {
  /**
   * 节点 id 自增
   */
  @PrimaryGeneratedColumn()
  autoid: number;
  /**
   * 是否显示
   */
  @Column({ type: 'tinyint', default: 1 })
  is_show: 0 | 1;
  /**
   * 节点描述
   */
  @Column({ default: '' })
  node_desc?: string;
  /**
   * 节点名称
   */
  @Column({ default: '' })
  node_name?: string;
  /**
   * 节点路径
   */
  @Column({ default: '' })
  node_path?: string;
  /**
   * 节点排序
   */
  @Column({ default: 0 })
  node_sort?: number;
  /**
   * 节点层级
   *  1 - 4
   */
  @Column({ default: 1 })
  node_type: number;
  /**
   * 父节点 id
   */
  @ManyToOne(() => Node, node => node.part)
  parent_id?: Node;
  /**
   * 子节点
   */
  @OneToMany(() => Node, node => node.autoid)
  part?: Node[];

  /**
   * 仅用于角色列表选择标志
   */
  is_checked?: 0 | 1;
}