var filters = angular.module('filters', []);


filters.filter('reverse', function() {
	return function(posts) {
		console.log(posts);
		return posts.reverse();
	}
});