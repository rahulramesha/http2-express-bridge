
var express = require('express')
  , request = require('supertest');

  const createH2ExpressBridge = require('../lib');

describe('throw after .end()', function(){
  it('should fail gracefully', function(done){
    var app = createH2ExpressBridge(express);

    app.get('/', function(req, res){
      res.end('yay');
      throw new Error('boom');
    });

    request(app)
    .get('/')
    .expect('yay')
    .expect(200, done);
  })
})
