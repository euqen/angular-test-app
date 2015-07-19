function ErrorResponse(errors){
  this.errors = errors || [];
}

ErrorResponse.prototype.addError = function(field, message, code){
  this.errors.push({
    param: field,
    msg: message,
    code: code
  })
};

ErrorResponse.prototype.hasErrors = function(){
  return this.errors.length > 0;
};

module.exports = ErrorResponse;