var ErrorResponse = require('./../../../shared/infrastructure/errorResponse'),
    Q = require('q');

module.exports.validate = function(request) {
  var deferred = Q.defer();

  request.checkBody('name', 'The meeting\'s name can not be empty or more than 100 characters!').isLength(15, 100);
  request.checkBody('description', 'The description field can not be empty or more 300 characters!').isLength(30, 300);

  var errors = request.validationErrors();
  var errorResponse = new ErrorResponse(errors);
  
  deferred.resolve({
    errorResponse: errorResponse,
    data: {
      name: request.body.name,
      description: request.body.description,
      time: new Date(),
      author: 'euqen',
      location: 'minsk',
      active: true
    }
  });

  return deferred.promise;
};
