/**
 * author: gisonyeung(gisonyang)
 * date:   2017/08/18   
 */


'use strict';

var httpProxy = require('http-proxy'),
  proxy = httpProxy.createProxy();

module.exports = function (options) {
  if (typeof options === 'string') options = {target: options};

  return function (req, res, next) {
    proxy.web(req, res, options, function (err) {
      err.mod = 'proxy';
      next(err);
    });
  };
};