/*
 * @Author: zhangyang
 * @Date: 2021-07-12 09:10:45
 * @LastEditTime: 2021-07-14 11:20:11
 * @Description: 节点相关
 */
import { getRepository } from 'typeorm';
import { Context } from 'koa';
import { respond } from './msgFormat';
import { Node } from '../entity/Node';
import { error } from '../middleware/logger';
import { YoungRoute } from '../decorators/YoungRoute';

export class NodeController {
  /**
   * 获取节点列表
   */
  @YoungRoute('10000/5')
  static async getNodeList(ctx: Context) {
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
    respond(ctx, nodes, 'success');
    return;
  }
  /**
   * 添加 | 修改节点
   */
  @YoungRoute('10000/6')
  static async changeNode(ctx: Context) {
    const { autoid, node_name, node_desc, node_path, node_sort, is_show, parent_id } = ctx.request.body;
    const nodeRepo = getRepository(Node);
    if (autoid > 0) {
      // 编辑
      const node = await nodeRepo.findOne({ autoid });
      if (node) {
        node.is_show = is_show;
        node.node_name = node_name;
        node.node_desc = node_desc;
        node.node_path = node_path;
        node.node_sort = node_sort;
        await nodeRepo.save(node);
        respond(ctx, '修改成功', 'success');
      } else {
        respond(ctx, '不存在对应的节点', 'fail');
      }
    } else {
      // 新增
      const p_node = await nodeRepo.findOne({ autoid: parent_id });
      const node = new Node();
      node.is_show = is_show;
      node.node_name = node_name;
      node.node_desc = node_desc;
      node.node_path = node_path;
      node.node_sort = node_sort;
      node.parent_id = p_node;
      node.node_type = (p_node?.node_type??0) + 1;
      try {
        await nodeRepo.save(node);
        respond(ctx, '新增成功', 'success');
      } catch (err) {
        error(err);
        respond(ctx, '新增失败', 'fail');
      }
    }
    return;
  }
  /**
   * 删除节点
   */
  @YoungRoute('10000/7')
  static async delNode(ctx: Context) {
    const nodeRepo = getRepository(Node);
    const { node_id: autoid } = ctx.request.body;
    try {
      await nodeRepo.createQueryBuilder('node')
        .delete()
        .where(`node.autoid = ${autoid}`)
        .execute();
      respond(ctx, '删除成功', 'success');
    } catch (err) {
      error(err);
      respond(ctx, '删除失败', 'fail');
    }
    return;
  }
}