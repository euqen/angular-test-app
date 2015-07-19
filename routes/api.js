module.exports = function(app, io) {
	var Post = require('../models/posts');

	app.addPost = function(request, response)
	{
		var post = new Post(request.body);

		post.save(function(error, posts) {
			if (error) return response.json(error);
			response.send(200);
			io.emit('post', post);
		});
	};

	app.getPosts = function(request, response)
	{
		Post.find({}, function(error, posts) {
			if (error) return response.json(error);
			response.json(posts);
		});
	}

}