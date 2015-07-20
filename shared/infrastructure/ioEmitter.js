var config = require('./../config'),
    logger = require('../logger'),
    io = require('socket.io-emitter')({ host: config.redis.session.host, port: config.redis.session.port }); 

    // MAKE EMITTER WHICH EMMIT EVENTS TO REDIS SERVER????????????

var Emitter = function(io) {
  this.__io = io;
};

Emitter.prototype.emit = function(name, data) {
  console.log('ioEmitter: Emitting event of newly created post!');
  this.__io.emit(name, data);
};

module.exports = new Emitter(io);
