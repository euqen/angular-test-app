var fs = require('fs');
/*
 * GET home page.
 */

exports.index = function(request, response) {
	fs.readFile("views/index.html", function (error, page) {
		response.writeHead(202, {"Content-type":"text/html"});
		response.end(page);
	});
};
