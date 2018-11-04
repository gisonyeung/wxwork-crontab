/**
 * author: gisonyeung(gisonyang)
 * date:   2017/08/18   
 */


'use strict';

var meta = require('../../package.json');
var express = require('express');
var compress = require('compression');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');
var app = module.exports = express();
var middleware = ['static'];
var routes = require('../routes');
var router = require('./router')(routes);
// var scheduleList = require('../schedules');
// var schedule = require('./schedule');

// lazy load middlewares
middleware.forEach(function (m) {
  middleware.__defineGetter__(m, function () {
    return require('./' + m);
  });
});

process.on('uncaughtException', function (err) {
  (app.get('logger') || console).error('Uncaught exception:\n', err.stack);
  process.exit(1);
});

app.set('root', path.resolve(__dirname, '../../www').replace(/\/+$/, ''));
app.set('logger', console);
app.enable('trust proxy');

app.use(bodyParser.json({
  limit : '50mb',
}));
app.use(bodyParser.raw({
  limit : '50mb'
}));
app.use(bodyParser.urlencoded({ limit : '50mb', extended: true }));

app.use(cookieParser());

app.use(compress());

//路由的配置
app.use(router);

app.use('', middleware.static());

// 404 
app.all('*', function(req, res) {
  if (req.method.toUpperCase() === 'GET') {
    res.status(404).end('Page Not Found');
  } else {
    res.json({
      result: {
        retCode: -1,
        retMsg: 'Cgi Not Found',
        retObj: null
      }
    })
  }
})

app.use(function (err, req, res, next) {
  console.log(err.stack);
  // console.log(err);
  res.status(500).send('Something broke!');
});

// 开启计划任务
// schedule.loops(scheduleList);

app.listen(8000, function() {
  console.log('server is running on http://localhost:8000...');
});