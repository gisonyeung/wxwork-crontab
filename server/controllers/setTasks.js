const cronRedis = require('../redis/cron');

/**
 * 设置机器人任务列表
 * @method POST
 * @bodyParam { String } skey 
 * @bodyParam { String } password 
 * @bodyParam { String } taskList 
 */
module.exports = function (req, res) {
  let { skey, password, taskList } = req.body;

  if (!skey || !password) {
    return res.reject({
      code: 400,
      msg: '参数不齐'
    });
  }

  cronRedis
    .getAccountPassword({ skey })
    .then((rightPassword) => {
      if (rightPassword !== password) {
        return res.reject({
          code: 403,
          msg: '密码错误'
        });
      }

      cronRedis
        .setTasks({ skey, taskList })
        .then(() => {
          res.resolve();
        })
        .catch((err) => {
          res.reject(
            code: 500,
            msg: '数据库操作发生错误',
            result: err
          );
        })
    });
};