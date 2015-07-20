var app = angular.module('app');

app.service('posts', function(httpModel)
{
	this.insertPost = function(post, form) {
		return httpModel.postForm('/api/v1/posts/', form, post);
	};

	this.getPosts = function() {
		return httpModel.get('/api/v1/posts')
	};
});
