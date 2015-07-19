var ErrorResponse = require('./../../../shared/infrastructure/errorResponse'),
    Q = require('q');

module.exports.validate = function(request) {
  var deferred = Q.defer();

  request.checkBody('text', 'The post text can not be empty or more than 150 characters').isLength(1, 150);
  request.checkBody('author', 'The author field can not be empty').notEmpty();
  request.checkBody('time', 'Date can not be empty').notEmpty();

  var errors = request.validationErrors();
  var errorResponse = new ErrorResponse(errors);

  deferred.resolve({
    errorResponse: errorResponse,
    data: {
      text: request.body.text,
      author: request.body.author,
      time: request.body.time
    }
    });

  return deferred.promise;
};
