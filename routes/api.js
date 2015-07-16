var Post = require('../models/posts');

exports.addPost = function(request, response)
{
	var post = new Post(request.body);

	post.save(function(error, posts) {
		if (error) return response.json(error);
		response.send(200);
	});
};

exports.getPosts = function(request, response)
{
	Post.find({}, function(error, posts) {
		if (error) return response.json(error);

		response.json(posts);
	});
}