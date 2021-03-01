
var express = require('express')
  , request = require('supertest');

  const createH2ExpressBridge = require('../lib');

describe('app', function(){
  describe('.response', function(){
    it('should extend the response prototype', function(done){
      var app = createH2ExpressBridge(express);

      app.response.shout = function(str){
        this.send(str.toUpperCase());
      };

      app.use(function(req, res){
        res.shout('hey');
      });

      request(app)
      .get('/')
      .expect('HEY', done);
    })

    it('should not be influenced by other app protos', function(done){
      var app = createH2ExpressBridge(express)
        , app2 = createH2ExpressBridge(express);

      app.response.shout = function(str){
        this.send(str.toUpperCase());
      };

      app2.response.shout = function(str){
        this.send(str);
      };

      app.use(function(req, res){
        res.shout('hey');
      });

      request(app)
      .get('/')
      .expect('HEY', done);
    })
  })
})
