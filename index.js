"use strict";

var https = require('https'),
    httpProxy = require('http-proxy'),
    fs = require('fs'),
    config = require('./config.json'),
    url = require('url'),
    _harRemix = require("har-remix"),
    path = require('path');

console.log("creating proxy gateway");

var proxy = httpProxy.createProxyServer({});
var server = https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.crt')
},function(req, res) {
  console.log(req.method + req.url);
  console.log(res.statusCode);
  var target = config.remoteServerURL;

  var urlObj = url.parse(req.url);
  for(var i in config.localfileMapping){
    if(urlObj.path.indexOf(i) > -1){
      console.log("read from local file server");
      target = "local";
      res.setHeader("gateway-org", "local");
      var realFilePath = urlObj.path.replace(i, config.localfileMapping[i]);
      realFilePath = (realFilePath.split("?"))[0]; //remove "?" from path
      console.log(realFilePath);
      var extname = path.extname(realFilePath);
      var contentType = 'text/html';
      switch (extname) {
          case '.js':
              contentType = 'text/javascript';
              break;
          case '.css':
              contentType = 'text/css';
              break;
          case '.json':
              contentType = 'application/json';
              break;
          case '.png':
              contentType = 'image/png';
              break;      
          case '.jpg':
              contentType = 'image/jpg';
              break;
      }

      fs.readFile(realFilePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT'){
                res.writeHead(404, { 'Content-Type': contentType });
                res.end("NOT FOUND", 'utf-8');
            }else {
                res.writeHead(500);
                res.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                res.end(); 
            }
        }else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
      });

      break;
    }
  }

  if(target == config.remoteServerURL){
    res.setHeader("gateway-org", "remote");
    proxy.web(req, res, {
      target: target,
      secure: false,
      protocolRewrite: false
    });
  }
  
  
});
server.listen(config.proxyServerPort);
console.log("proxy gateway created, listing on port", config.proxyServerPort);