/*
 * schedule 计划任务执行框架
 *
 * 初始化方法：主进程中调用 schedule.loops(scheduleList)
 * https://github.com/node-schedule/node-schedule
 *
 * created by gisonyang on 2017/11/28
 */


var cluster = require('cluster');
var Schedule = require('node-schedule');

exports.loops = function(scheduleList) {

  scheduleList.forEach(function (scheduleItem) {
    var m, cron, schedulePath, masterOnly;

    if (m = scheduleItem.match(/^(?:\s*)(.+?)(?:\s*)=>(?:\s*)(.+?)(?:(?:\s*\|\s*)(.+?))?$/)) {
      cron = m[1];
      schedulePath = m[2];
      masterOnly = m[3] == 'masterOnly';
    } else {
      throw new Error('计划任务项格式错误: ' + scheduleItem);
    }
    
    var fullPath = '../schedules/' + schedulePath;
    var scheduleHandler = require(fullPath);

    // 判断是否多核心中的主进程
    // if (cluster.isMaster || !masterOnly) {

      console.log(`初始化线程计划任务：${schedulePath}`);

      // 注册计划任务
      Schedule.scheduleJob(cron, function() {
        console.log('执行计划任务：', schedulePath);
        scheduleHandler();
      });
    // }


  });

  return scheduleList;
}
