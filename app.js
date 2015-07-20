/**
 * Module dependencies.
 */

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var logger = require("./shared/logger");
var config = require('./shared/config');
var expressValidator = require('express-validator');
var ErrorResponse = require('./shared/infrastructure/errorResponse');
var http = require('http').Server(app);
var socketServer = require('./shared/infrastructure/socketServer').init(http);
var handlers = require('./shared/handlers/handlersRegistry');
var server;

/**
 * Configuration
 **/

app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text({ type: 'text/html' }));
app.use(bodyParser.json({ type: 'application/json'}));
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use('/bower_components', express.static(path.join(__dirname, '/bower_components')));

app.use(function(error, request, response, next) {
  if (error.status) {
    logger.warn('Invalid json: ', error);
    var errorResponse = new ErrorResponse();
    errorResponse.addError('', 'invalid JSON');

    response.status(error.status).send(errorResponse);
  }
  else next();
});

app.use(expressValidator());
app.use(logger.expressErrorLogger);

app.use(function(request, response, next) {
  if(app.get("isShuttingDown")) {
    request.connection.setTimeout(1);
  }
  next();
});

app.use('/api/v1', require('./routes/api'));
app.use('/*', require('./routes/index'));

app.use(function(request, response, next) {
  logger.warn("404 - Resource or page is not found: " + request.url);
  response.sendStatus(404);
});

app.use(function(error, request, response, next) {
   logger.warn("500 - Bad gateway: " + request.url);
   response.sendStatus(500);
});

process.on('uncaughtException', function (err) {
  logger.error('FATALERROR! UNEXPECTED ERROR HAPPENED. CRASHING NODE PROCESS. ', err);
  logger.error('FATALERROR! UNEXPECTED ERROR STACK: ', err.stack);
  process.exit(1);
});

http.listen(config.environment.httpPort, function() {
  logger.info("Server listening on port %d in %s mode", config.environment.httpPort, config.environment.type);
});