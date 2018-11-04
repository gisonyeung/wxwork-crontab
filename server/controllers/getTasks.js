const cronRedis = require('../redis/cron');

/**
 * 获取机器人任务列表
 * @method GET
 * @bodyParam { String } skey 
 * @bodyParam { String } password 
 */
module.exports = function (req, res) {
  let { skey, password } = req.query;

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
        .getTasks({ skey })
        .then((taskList) => {
          return res.resolve(taskList)
        })
    });
};