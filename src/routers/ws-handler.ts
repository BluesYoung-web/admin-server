/*
 * @Author: zhangyang
 * @Date: 2021-06-17 17:31:06
 * @LastEditTime: 2021-07-08 16:20:06
 * @Description: websocket 消息及其对应的处理函数
 */
import conf from "../../conf";

const map = new Map<string, { Controller: string, handler: string }>();

export default (com: number, task: number, id:number) => {
  console.log(`${com}-${task}-${id}`);
  
  return map.get(`${com}-${task}-${id}`) || { Controller: 'ErrorController', handler: 'error' };
};