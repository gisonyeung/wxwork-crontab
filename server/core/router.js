/**
 * author: gisonyeung(gisonyang)
 * date:   2017/08/18   
 */

var router = require('express').Router();
var project = require('../../package.json');
// var conf = require('../conf');
var _ = require('../util');

module.exports = function (routes) {
  routes.forEach(function (route) {
    var m, method, path, controllerPath, module, role;

    /* eslint-disable no-cond-assign */
    // method /path => /controllerPath
    if (m = route.match(/^(.+?) (.+?)(?:\s*)=>(?:\s*)(.+?)$/)) {
      method = m[1];
      path = m[2];
      controllerPath = m[3];
    // method /path
    } else if (m = route.match(/^(.+?) (.+?)(?:\s*)$/)) {
      method = m[1];
      path = m[2];
    } else {
      throw new Error('路由格式错误: ' + route);
    }
    /* eslint-enable no-cond-assign */

    if (!router[method]) throw new Error('方法名错误: ' + method);

    // 去掉'/'
    if (!controllerPath) controllerPath = path.substr(1);

    var fullControllerPath = '../controllers/' + controllerPath;
    var controller = require(fullControllerPath);

    // 支持 { get, post } 格式的controller
    if (typeof controller === 'object') controller = controller[method];

    router[method](path, function (req, res) {
      _.extend(res, {

        resolve: function (data) {
          res.json({
            code: 0,
            result: data || null
          });
        },
        reject: function () {
          if (arguments.length === 1) {
            var err = arguments[0];
            console.log(`[Request fail]response msg: ${err.msg}`);
            res.json({
              code: err.code,
              msg: err.msg,
              result: null
            });
          } else {
            var code = arguments[0];
            var msg = arguments[1];
            var obj = arguments[2];

            console.log(`[Request fail]response msg: ${msg}`);
            res.json({
              code,
              msg,
              result: obj || null
            });
          }
        },
      });
      
      controller.apply({
        project: project,
        // conf: conf,
      }, arguments);
    });
  });

  return router
};