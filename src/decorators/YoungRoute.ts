/*
 * @Author: zhangyang
 * @Date: 2021-07-12 10:14:14
 * @LastEditTime: 2021-07-12 10:35:58
 * @Description: 注册路由处理函数的装饰器
 */
import { Young_Route_Item } from "../@types/my-routes";
export const controllerMap = new Map<string, Young_Route_Item>();

export const YoungRoute = (_path: string, no_auth = false) => {
  return (target: any, _name: any, desc: any) => {
    controllerMap.set(_path, { no_auth, handler: desc.value, path: _path });
  }
}