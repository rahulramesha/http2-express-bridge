
var express = require('express')
  , request = require('supertest');

  const createH2ExpressBridge = require('../lib');

describe('req', function(){
  describe('.route', function(){
    it('should be the executed Route', function(done){
      var app = createH2ExpressBridge(express);

      app.get('/user/:id/:op?', function(req, res, next){
        req.route.path.should.equal('/user/:id/:op?');
        next();
      });

      app.get('/user/:id/edit', function(req, res){
        req.route.path.should.equal('/user/:id/edit');
        res.end();
      });

      request(app)
      .get('/user/12/edit')
      .expect(200, done);
    })
  })
})
