var express = require('express');

const createH2ExpressBridge = require('../../../../lib');

var app = module.exports = createH2ExpressBridge(express);

app.use('/api/v1', require('./controllers/api_v1'));
app.use('/api/v2', require('./controllers/api_v2'));

app.get('/', function(req, res) {
  res.send('Hello from root route.')
});

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
