
/**
 * api接口的统一出口
 */

import login from './modules/login';
import register from './modules/register';
import prescription from './modules/prescription';
import index from './modules/index';
import patient from './modules/patient';
import revisitsession from './modules/revisitsession';
import revisitpaper from './modules/revisitpaper';
import lesson from "./modules/lesson";
import webRTC from './modules/webRTC';
import im from './modules/im';
import smscode from './modules/smscode';

// 导出接口params
export default {
  login,
  register,
  prescription,
  index,
  patient,
  revisitsession,
  revisitpaper,
  lesson,
  webRTC,
  im,
  smscode
}
