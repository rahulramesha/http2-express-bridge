
var express = require('express')
  , request = require('supertest');

  const createH2ExpressBridge = require('../lib');

describe('app', function(){
  describe('.request', function(){
    it('should extend the request prototype', function(done){
      var app = createH2ExpressBridge(express);

      app.request.querystring = function(){
        return require('url').parse(this.url).query;
      };

      app.use(function(req, res){
        res.end(req.querystring());
      });

      request(app)
      .get('/foo?name=tobi')
      .expect('name=tobi', done);
    })
  })
})
