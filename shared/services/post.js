var db = require('./../db'),
    BaseViewService = require('./baseViewService');

var postService = new BaseViewService(db.Post);

postService.getById = function(id) {
  return postService.findOne({_id: id});
};

postService.getByAuthor = function(author) {
  return postService.find({author: author});
};

postService.getAllPosts = function() {
  return postService.find({});
};

postService.insertPost = function(post) {
  return postService.create(post);
};

module.exports = postService;

