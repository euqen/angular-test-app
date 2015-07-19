var bus = require('../bus');

var init = function(server)
{
	var io = require('socket.io')(server);
	
	bus.on('read.PostCreated', function(post) {
		io.emit('post', post);
	});
};

module.exports = init;