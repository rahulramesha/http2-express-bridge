/**
 * Module dependencies.
 */

var escapeHtml = require('escape-html');
var express = require('express');
var fs = require('fs');
var marked = require('marked');
var path = require('path');

const createH2ExpressBridge = require('../../../../lib');

var app = module.exports = createH2ExpressBridge(express);

// register .md as an engine in express view system

app.engine('md', function(path, options, fn){
  fs.readFile(path, 'utf8', function(err, str){
    if (err) return fn(err);
    var html = marked.parse(str).replace(/\{([^}]+)\}/g, function(_, name){
      return escapeHtml(options[name] || '');
    });
    fn(null, html);
  });
});

app.set('views', path.join(__dirname, 'views'));

// make it the default so we dont need .md
app.set('view engine', 'md');

app.get('/', function(req, res){
  res.render('index', { title: 'Markdown Example' });
});

app.get('/fail', function(req, res){
  res.render('missing', { title: 'Markdown Example' });
});

/* istanbul ignore next */
if (!module.parent) {
  const http2 = require('http2')
  const { readFileSync } = require('fs')
  const options = {
    key: readFileSync(process.env.CERT_KEY),
    cert: readFileSync(process.env.CERT),
    allowHTTP1: true
  }
  const server = http2.createSecureServer(options, app)
  server.listen(3000);
  console.log('Express started on port 3000');
}
