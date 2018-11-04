const cronRedis = require('../redis/cron');

/**
 * 注册机器人账户
 * @method POST
 * @bodyParam { String } skey 
 * @bodyParam { String } password 
 */
module.exports = function (req, res) {

  let { skey, password } = req.body;

  if (!skey || !password) {
    return res.reject({
      code: 400,
      msg: '参数不齐'
    });
  }

  cronRedis
    .registerAccount({ skey, password })
    .then(() => {
      res.resolve();
    })
    .catch((err) => {
      res.reject({
        code: 500,
        msg: '服务器错误',
        result: err
      })
    });
};