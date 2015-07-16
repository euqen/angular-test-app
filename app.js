
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes/index');
var path = require('path');
var api = require('./routes/api');
var bodyParser = require('body-parser');
var app = module.exports = express.createServer();

// Configuration

app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text({ type: 'text/html' }));
app.use(bodyParser.json({ type: 'application/json' }));
app.use(express.methodOverride());
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use('/bower_components', express.static(path.join(__dirname, '/bower_components')));
app.use(app.router);

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

//API Routes
app.post('/api/v1/posts', api.addPost);
app.get('/api/v1/posts', api.getPosts);

// Other routes
app.get('*', routes.index);

app.listen(4000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
