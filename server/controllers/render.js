var path = require('path');
var etag = require('etag');
var fs = require('fs');

module.exports = function (req, res) {
  var page = req.params.page;
  var filePath = path.resolve(__dirname, '../../www/pages/', page + '.html');

  fs.readFile(filePath, (err, html) => {
    // 如果有错误，则直接响应报错，并且不设置cache-control响应头
    if (err) {
      res.status(404).end('Not Found');
      return;
    }

    // 设置 cache-control 响应头
    res.setHeader('Cache-Control', 'public, max-age=86400');

    // 设置Etag，以及检查Etag的变化
    var requestEtag = req.headers['if-none-match'];
    var currentEtag = etag(html);

    // 如果有带If-None-Match请求头，表示客户端本地有缓存，则判断Etag是否有改变
    if (requestEtag && (requestEtag === currentEtag)) return res.status(304).end();

    res.setHeader('ETag', currentEtag);

    res.status(200).end(html);
  });

};