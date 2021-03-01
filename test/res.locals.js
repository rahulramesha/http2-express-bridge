
var express = require('express')
  , request = require('supertest');

  const createH2ExpressBridge = require('../lib');

describe('res', function(){
  describe('.locals', function(){
    it('should be empty by default', function(done){
      var app = createH2ExpressBridge(express);

      app.use(function(req, res){
        res.json(res.locals)
      });

      request(app)
      .get('/')
      .expect(200, {}, done)
    })
  })

  it('should work when mounted', function(done){
    var app = createH2ExpressBridge(express);
    var blog = createH2ExpressBridge(express);

    app.use(blog);

    blog.use(function(req, res, next){
      res.locals.foo = 'bar';
      next();
    });

    app.use(function(req, res){
      res.json(res.locals)
    });

    request(app)
    .get('/')
    .expect(200, { foo: 'bar' }, done)
  })
})
