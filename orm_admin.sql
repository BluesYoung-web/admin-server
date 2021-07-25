/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50726
Source Host           : localhost:3306
Source Database       : orm_admin

Target Server Type    : MYSQL
Target Server Version : 50726
File Encoding         : 65001

Date: 2021-07-25 19:48:30
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for node
-- ----------------------------
DROP TABLE IF EXISTS `node`;
CREATE TABLE `node` (
  `autoid` int(11) NOT NULL AUTO_INCREMENT,
  `is_show` tinyint(4) NOT NULL DEFAULT '1',
  `node_desc` varchar(255) NOT NULL DEFAULT '',
  `node_name` varchar(255) NOT NULL DEFAULT '',
  `node_path` varchar(255) NOT NULL DEFAULT '',
  `node_sort` int(11) NOT NULL DEFAULT '0',
  `node_type` int(11) NOT NULL DEFAULT '1',
  `parentIdAutoid` int(11) DEFAULT NULL,
  PRIMARY KEY (`autoid`),
  KEY `FK_3341dbe0417c4e6f7a41de5702a` (`parentIdAutoid`),
  CONSTRAINT `FK_3341dbe0417c4e6f7a41de5702a` FOREIGN KEY (`parentIdAutoid`) REFERENCES `node` (`autoid`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of node
-- ----------------------------
INSERT INTO `node` VALUES ('0', '0', '根节点', '', '', '0', '0', null);
INSERT INTO `node` VALUES ('1', '1', '系统管理', '系统管理', '', '-1', '1', '0');
INSERT INTO `node` VALUES ('2', '1', '自定义组件', '常用组件', '', '-2', '1', '0');
INSERT INTO `node` VALUES ('3', '1', '', 'VueUse使用示例', '', '-3', '1', '0');
INSERT INTO `node` VALUES ('5', '1', '', '节点列表', '10000/5', '-3', '2', '1');
INSERT INTO `node` VALUES ('6', '1', '', '角色列表', '10000/8', '-4', '2', '1');
INSERT INTO `node` VALUES ('7', '1', '', '管理员列表', '10000/12', '-5', '2', '1');
INSERT INTO `node` VALUES ('8', '0', '新增 | 编辑', '新增 | 编辑', '10000/6', '0', '3', '5');
INSERT INTO `node` VALUES ('9', '0', '删除', '删除', '10000/7', '0', '3', '5');
INSERT INTO `node` VALUES ('12', '1', '自动创建测试', '自动创建测试', '', '-4', '1', '0');
INSERT INTO `node` VALUES ('13', '0', '添加 | 编辑', '添加 | 编辑', '10000/9', '0', '3', '6');
INSERT INTO `node` VALUES ('14', '0', '删除', '删除', '10000/10', '0', '3', '6');
INSERT INTO `node` VALUES ('15', '0', '获取节点权限列表', '获取节点权限列表', '10000/11', '0', '3', '6');
INSERT INTO `node` VALUES ('16', '0', '获取可选择的角色列表', '获取可选择的角色列表', '10000/13', '0', '3', '7');
INSERT INTO `node` VALUES ('17', '0', '新增 | 编辑', '新增 | 编辑', '10000/14', '0', '3', '7');
INSERT INTO `node` VALUES ('18', '0', '删除', '删除', '10000/15', '0', '3', '7');
INSERT INTO `node` VALUES ('19', '1', '表格组件', '表格组件', '10000/16', '0', '2', '2');
INSERT INTO `node` VALUES ('20', '1', 'tab', 'tab', '10000/17', '-1', '2', '2');
INSERT INTO `node` VALUES ('21', '1', '图片上传', '图片上传', '10000/18', '-2', '2', '2');
INSERT INTO `node` VALUES ('22', '1', '富文本编辑器', '富文本编辑器', '10000/19', '-3', '2', '2');
INSERT INTO `node` VALUES ('23', '1', 'useEventListener', 'useEventListener', '10000/20', '0', '2', '3');
INSERT INTO `node` VALUES ('24', '1', '页面创建测试', '页面创建测试', '10000/21', '0', '2', '12');
INSERT INTO `node` VALUES ('25', '0', '文件上传接口', '文件上传接口', '10000/22', '0', '3', '21');
INSERT INTO `node` VALUES ('26', '0', '', '获取权限列表', '10000/3', '0', '2', '29');
INSERT INTO `node` VALUES ('27', '0', '退出登录', '退出登录', '10000/2', '-1', '2', '29');
INSERT INTO `node` VALUES ('28', '0', '修改密码', '修改密码', '10000/4', '-2', '2', '29');
INSERT INTO `node` VALUES ('29', '0', 'base', 'base', '', '0', '1', '0');

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `autoid` int(11) NOT NULL AUTO_INCREMENT,
  `is_enable` tinyint(4) NOT NULL DEFAULT '1',
  `parent_role_id` int(11) NOT NULL DEFAULT '0',
  `platform_type` tinyint(4) NOT NULL DEFAULT '0',
  `role_desc` varchar(255) NOT NULL DEFAULT '',
  `role_name` varchar(255) NOT NULL,
  `role_access` longtext NOT NULL,
  PRIMARY KEY (`autoid`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO `role` VALUES ('1', '1', '0', '0', '超级管理员', '超级管理员', '*');
INSERT INTO `role` VALUES ('2', '1', '0', '0', '产品', '产品', '29,26,27,28,1,5,2,19,20,21,22,3,23,12,24');
INSERT INTO `role` VALUES ('3', '1', '0', '0', '游客', '游客', '29,26,27,28,2,19,20,21,22,3,23,12,24');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `aid` int(11) NOT NULL AUTO_INCREMENT,
  `admin_name` varchar(255) NOT NULL,
  `phone_number` varchar(11) NOT NULL DEFAULT '',
  `passwd` varchar(255) NOT NULL,
  `metadataAutoid` int(11) DEFAULT NULL,
  PRIMARY KEY (`aid`),
  UNIQUE KEY `IDX_81a16d17d501cba9be802fd26b` (`admin_name`),
  UNIQUE KEY `REL_52f0a7932dddb6fdf30889c846` (`metadataAutoid`),
  CONSTRAINT `FK_52f0a7932dddb6fdf30889c846d` FOREIGN KEY (`metadataAutoid`) REFERENCES `user_meta_data` (`autoid`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1', 'young', '', '96e79218965eb72c92a549dd5a330112', '1');
INSERT INTO `user` VALUES ('2', 'hei', '', '96e79218965eb72c92a549dd5a330112', '2');
INSERT INTO `user` VALUES ('5', 'guest', '', '96e79218965eb72c92a549dd5a330112', '5');

-- ----------------------------
-- Table structure for user_meta_data
-- ----------------------------
DROP TABLE IF EXISTS `user_meta_data`;
CREATE TABLE `user_meta_data` (
  `autoid` int(11) NOT NULL AUTO_INCREMENT,
  `real_name` varchar(255) NOT NULL DEFAULT '',
  `role_id` varchar(255) NOT NULL DEFAULT '',
  `time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `is_enable` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`autoid`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of user_meta_data
-- ----------------------------
INSERT INTO `user_meta_data` VALUES ('1', '君不见', '1', '2021-07-08 17:39:22.529674', '1');
INSERT INTO `user_meta_data` VALUES ('2', '小黑', '2', '2021-07-13 10:00:23.537447', '1');
INSERT INTO `user_meta_data` VALUES ('4', '测试', '2', '2021-07-13 10:19:37.136444', '1');
INSERT INTO `user_meta_data` VALUES ('5', '路人甲', '3', '2021-07-13 11:32:16.426633', '1');
