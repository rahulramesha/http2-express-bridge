/**
 * Module dependencies.
 */

var express = require('express');
var logger = require('morgan');
var vhost = require('vhost');
const createH2ExpressBridge = require('../../../../lib');

/*
edit /etc/hosts:

127.0.0.1       foo.example.com
127.0.0.1       bar.example.com
127.0.0.1       example.com
*/

// Main server app

var main = createH2ExpressBridge(express);

if (!module.parent) main.use(logger('dev'));

main.get('/', function(req, res){
  res.send('Hello from main app!');
});

main.get('/:sub', function(req, res){
  res.send('requested ' + req.params.sub);
});

// Redirect app

var redirect = createH2ExpressBridge(express);

redirect.use(function(req, res){
  if (!module.parent) console.log(req.vhost);
  res.redirect('http://example.com:3000/' + req.vhost[0]);
});

// Vhost app



var app = module.exports = createH2ExpressBridge(express);

app.use(vhost('*.example.com', redirect)); // Serves all subdomains via Redirect app
app.use(vhost('example.com', main)); // Serves top level domain via Main server app

/* istanbul ignore next */
if (!module.parent) {
  const http2 = require('http2')
  const { readFileSync } = require('fs')
  const options = {
    key: readFileSync(process.env.CERT_KEY),
    cert: readFileSync(process.env.CERT),
    allowHTTP1: true
  }
  const server = http2.createSecureServer(options, app)
  server.listen(3000);
  console.log('Express started on port 3000');
}
