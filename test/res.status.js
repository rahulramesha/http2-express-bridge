
var express = require('express')
  , request = require('supertest');

  const createH2ExpressBridge = require('../lib');

describe('res', function(){
  describe('.status(code)', function(){
    it('should set the response .statusCode', function(done){
      var app = createH2ExpressBridge(express);

      app.use(function(req, res){
        res.status(201).end('Created');
      });

      request(app)
      .get('/')
      .expect('Created')
      .expect(201, done);
    })
  })
})
