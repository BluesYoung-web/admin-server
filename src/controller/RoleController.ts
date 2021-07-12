/*
 * @Author: zhangyang
 * @Date: 2021-07-12 10:59:51
 * @LastEditTime: 2021-07-12 12:13:37
 * @Description: 角色相关
 */
import { getRepository } from 'typeorm';
import { Context } from 'koa';
import { respond } from './msgFormat';
import { Role } from '../entity/Role';
import { Node } from '../entity/Node';
import { error } from '../middleware/logger';
import { YoungRoute } from '../decorators/YoungRoute';

export class RoleController {
  /**
   * 获取角色列表
   */
  @YoungRoute('10000/8')
  static async getRoleList(ctx: Context) {
    const roleRepo = getRepository(Role);
    const roles = await roleRepo.find();
    return respond(ctx, roles, 'success');
  }
  /**
   * 新建 | 编辑角色
   */
  @YoungRoute('10000/9')
  static async changRole(ctx: Context) {
    const roleRepo = getRepository(Role);
    const {
      autoid,
      is_enable,
      parent_role_id,
      role_access,
      role_desc,
      role_name
    } = ctx.request.body;
    if (autoid > 0) {
      // 编辑
      const role = await roleRepo.findOne({ autoid });
      if (role) {
        (is_enable !== '') && (role.is_enable = +is_enable);
        role_name && (role.role_name = role_name);
        role_desc && (role.role_desc = role_desc);
        role_access && (role.role_access = role_access);
        await roleRepo.save(role);
        respond(ctx, '修改成功', 'success');
      } else {
        respond(ctx, '节点不存在', 'fail');
      }
    } else {
      // 新建
      const p_role = await roleRepo.findOne({ where: { autoid: parent_role_id } });
      const role = new Role();
      role.is_enable = is_enable??1;
      role.parent_role_id = parent_role_id??0;
      role.role_desc = role_desc??'';
      role.role_name = role_name??'';
      role.role_access = p_role?.role_access??'';
      await roleRepo.save(role);
      respond(ctx, '新增成功', 'success');
    }
  }
  /**
   * 删除角色
   */
  @YoungRoute('10000/10')
  static async delRole(ctx: Context) {
    const roleRepo = getRepository(Role);
    const { role_id: autoid } = ctx.request.body;
    try {
      await roleRepo.createQueryBuilder('role')
        .delete()
        .where(`role.autoid = ${autoid}`)
        .execute();
      respond(ctx, '删除成功', 'success');
    } catch (err) {
      error(err);
      respond(ctx, '删除失败', 'fail');
    }
  }
  /**
   * 获取角色拥有权限的节点列表
   */
  @YoungRoute('10000/11')
  static async getRoleAccessNodeList(ctx: Context) {
    const roleRepo = getRepository(Role);
    const { role_id: autoid } = ctx.request.body;
    const role = await roleRepo.findOne({ autoid });
    if (role) {
      const node_ids = role.role_access.split(',').map((id) => +id);
      const nodeRepo = getRepository(Node);
      let nodes: Node[] = [];
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
      for (const node of nodes) {
        if (role.role_access === '*' || node_ids.includes(node.autoid)) {
          node.is_checked = 1;
        } else {
          node.is_checked = 0;
        }
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
          if (role.role_access === '*' || node_ids.includes(sub_node.autoid)) {
            sub_node.is_checked = 1;
          } else {
            sub_node.is_checked = 0;
          }
          // 获取所有三级节点
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
          for (const son of sub_node.part) {
            if (role.role_access === '*' || node_ids.includes(son.autoid)) {
              son.is_checked = 1;
            } else {
              son.is_checked = 0;
            }
            // 获取所有四级节点
            son.part = await nodeRepo.createQueryBuilder('node')
              .select('node.autoid', 'autoid')
              .addSelect('node.is_show', 'is_show')
              .addSelect('node.node_desc', 'node_desc')
              .addSelect('node.node_name', 'node_name')
              .addSelect('node.node_path', 'node_path')
              .addSelect('node.node_sort', 'node_sort')
              .addSelect('node.node_type', 'node_type')
              .addSelect('node.parent_id', 'parent_id')
              .where(`node.parent_id = ${son.autoid}`)
              .andWhere(`node.node_type = 4`)
              .orderBy('node.node_sort', 'DESC')
              .getRawMany();
          }
        }
      }
      respond(ctx, { info: role, list: nodes }, 'success');
    } else {
      respond(ctx, '角色不存在', 'fail');
    }
  }
}