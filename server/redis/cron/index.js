var redis = require('redis');
var conf = require('../../conf');
var client = redis.createClient(conf.redisServer);

client.on('error', function (err) {
  console.log('[Redis Connect Error] ', err);
})

/**
 * 注册机器人
 * @param { String } params.skey 机器人webhook-key 
 * @param { String } params.password 对应秘钥
 */
exports.registerAccount = function (params) {
  let { skey, password } = params;

  let requestPromise = new Promise((resolve, reject) => {
    client.hset(skey, 'password', password, function(err, res) {
      if (err) {
        return reject(err);
      }

      resolve();
    })
  });

  return requestPromise;
}

/**
 * 获取机器人校验密码
 * @param { String } params.skey 
 * @return { String } password
 */
exports.getAccountPassword = function (params) {
  let { skey } = params;

  let requestPromise = new Promise((resolve, reject) => {
    client.hget(skey, 'password', function (err, reply) {
      if (err) {
        return reject(err);
      }

      return resolve(reply);
    })
  });

  return requestPromise;
}

/**
 * 存储机器人定时任务
 * @param { String } params.skey 
 * @param { Array } params.taskList 
 */
exports.setTasks = function (params) {
  let { skey, taskList } = params;

  let requestPromise = new Promise((resolve, reject) => {
    client.hset(skey, 'taskList', taskList, function (err, res) {
      if (err) {
        return reject(err);
      }

      return resolve();
    })
  });

  return requestPromise;
}

/**
 * 获取机器人任务列表
 * @param { String } params.skey
 * @return { Array } taskList
 */
exports.getTasks = function (params) {
  let { skey } = params;

  let requestPromise = new Promise((resolve, reject) => {
    client.hget(skey, 'taskList', function (err, reply) {
      if (err) {
        return reject(err);
      }

      return resolve(reply);
    })
  });

  return requestPromise;
}
}
