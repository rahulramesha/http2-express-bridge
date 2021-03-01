
var express = require('express')
  , request = require('supertest');

const createH2ExpressBridge = require('../lib');

describe('app.all()', function(){
  it('should add a router per method', function(done){
    var app = createH2ExpressBridge(express);

    app.all('/tobi', function(req, res){
      res.end(req.method);
    });

    request(app)
    .put('/tobi')
    .expect('PUT', function(){
      request(app)
      .get('/tobi')
      .expect('GET', done);
    });
  })

  it('should run the callback for a method just once', function(done){
    var app = createH2ExpressBridge(express)
      , n = 0;

    app.all('/*', function(req, res, next){
      if (n++) return done(new Error('DELETE called several times'));
      next();
    });

    request(app)
    .del('/tobi')
    .expect(404, done);
  })
})
