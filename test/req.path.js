
var express = require('express')
  , request = require('supertest');

  const createH2ExpressBridge = require('../lib');

describe('req', function(){
  describe('.path', function(){
    it('should return the parsed pathname', function(done){
      var app = createH2ExpressBridge(express);

      app.use(function(req, res){
        res.end(req.path);
      });

      request(app)
      .get('/login?redirect=/post/1/comments')
      .expect('/login', done);
    })
  })
})
