
var express = require('express')
  , request = require('supertest');

const createH2ExpressBridge = require('../lib');

describe('app.del()', function(){
  it('should alias app.delete()', function(done){
    var app = createH2ExpressBridge(express);

    app.del('/tobi', function(req, res){
      res.end('deleted tobi!');
    });

    request(app)
    .del('/tobi')
    .expect('deleted tobi!', done);
  })
})
