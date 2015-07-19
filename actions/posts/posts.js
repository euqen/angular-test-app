var addPostContract = require('./contracts/addPost');
var postService = require('../../shared/services/post');

module.exports.addPost = function(request, response)
{
	addPostContract.validate(request)
	.then(function(contract) {
		if(contract.errorResponse.hasErrors()) {
			response.status(400).send(contract.errorResponse);
			return;
		}
		postService.insertPost(contract.data)
		.then(function() {
			response.status(200).send();
		})
		.done();
	})
	.done();

	/* =======================================
	var post = new Post(request.body);

	post.save(function(error, posts) {
	if (error) return response.json(error);
	response.send(200);
		io.emit('post', post);
	}); */
};

module.exports.getPosts = function(request, response)
{
	postService.getAllPosts()
	.then(function(posts) {
		response.send(posts);
	})
	.done();
};