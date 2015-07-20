var bus = require('../bus');
var emitter = require('../infrastructure/ioEmitter');

var socketHandlers = function() {
	bus.on('read.PostCreated', function(post) {
		var evtName = 'post';
		emitter.emit(evtName, post);
	});
};

module.exports = socketHandlers();