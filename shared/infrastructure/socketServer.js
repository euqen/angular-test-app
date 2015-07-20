var config = require('./../config'),
    redis = require('socket.io-redis'),
    logger = require('../logger');

module.exports.init = function(server) {
  io = require('socket.io')(server); //creating socket.io entity
  var redisStore = redis({host: config.redis.session.host, port: config.redis.session.port}); //connectiong to redis server
  io.adapter(redisStore); //binding io entity with redis storage

  io.on('connection',function() {
    logger.info('Newly client connected to socket server!');
  });

  io.on('disconnect',function() {
    logger.info('Client disconnected from socket server!');
  });

};