/**
 * Module dependencies.
 */

var cookieSession = require('cookie-session');
var express = require('express');
const createH2ExpressBridge = require('../../../../lib');

var app = module.exports = createH2ExpressBridge(express);

// add req.session cookie support
app.use(cookieSession({ secret: 'manny is cool' }));

// do something with the session
app.use(count);

// custom middleware
function count(req, res) {
  req.session.count = (req.session.count || 0) + 1
  res.send('viewed ' + req.session.count + ' times\n')
}

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
