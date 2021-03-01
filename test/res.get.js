
var express = require('express');
var request = require('supertest');

const createH2ExpressBridge = require('../lib');

describe('res', function(){
  describe('.get(field)', function(){
    it('should get the response header field', function (done) {
      var app = createH2ExpressBridge(express);

      app.use(function (req, res) {
        res.setHeader('Content-Type', 'text/x-foo');
        res.send(res.get('Content-Type'));
      });

      request(app)
      .get('/')
      .expect(200, 'text/x-foo', done);
    })
  })
})
