
var express = require('express')
const createH2ExpressBridge = require('../lib');

const http2 = require('http2')
const { readFileSync } = require('fs')

const options = {
  key: readFileSync(process.env.CERT_KEY),
  cert: readFileSync(process.env.CERT),
  allowHTTP1: true
}

describe.skip('app.listen()', function(){
  it('should wrap with an HTTP server', function(done){
    var app = createH2ExpressBridge(express);

    app.del('/tobi', function(req, res){
      res.end('deleted tobi!');
    });

    var server = http2.createSecureServer(options, app)
    server.listen(9999, function(){
      server.close();
      done();
    });
  })
})
