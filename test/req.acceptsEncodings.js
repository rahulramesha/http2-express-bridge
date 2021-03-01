
var express = require('express')
  , request = require('supertest');

  const createH2ExpressBridge = require('../lib');

describe('req', function(){
  describe('.acceptsEncodings', function () {
    it('should be true if encoding accepted', function(done){
      var app = createH2ExpressBridge(express);

      app.use(function(req, res){
        req.acceptsEncodings('gzip').should.be.ok()
        req.acceptsEncodings('deflate').should.be.ok()
        res.end();
      });

      request(app)
      .get('/')
      .set('Accept-Encoding', ' gzip, deflate')
      .expect(200, done);
    })

    it('should be false if encoding not accepted', function(done){
      var app = createH2ExpressBridge(express);

      app.use(function(req, res){
        req.acceptsEncodings('bogus').should.not.be.ok()
        res.end();
      });

      request(app)
      .get('/')
      .set('Accept-Encoding', ' gzip, deflate')
      .expect(200, done);
    })
  })
})
