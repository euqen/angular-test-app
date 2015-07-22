angular.module("app")
  .factory("httpModel", function ($http, $q) {
    var httpModel = {
      get: function (url, options) {
        var deferred = $q.defer(),
            config = {
              params: options || {}
            };

        var self = this;
        $http.get(url, config)
          .success(
          function (data) {
            deferred.resolve(data);
          }).error(function(data, status){
            deferred.reject(data);
          });

        return deferred.promise;
      },

      verb: function (url, model, method) {
        var self = this,
            deferred = $q.defer();

        $http[method](url, model)
          .success(function (data) {
            deferred.resolve(data);
          })
          .error(function (data, status, headers, config) {
            deferred.reject(data);
          });

        return deferred.promise;
      },

      fillFormErrors : function(form, errors, field, message) {
        form.globalErrors = [];
        for (var i = 0; i < errors.length; i++) {
          if (errors[i][field] && errors[i][field] != "") {
            form[errors[i][field]].$serverErrorText = errors[i][message];
          } else {
            form.globalErrors = errors[i][message];
          }
        }
      },

      getErrorString: function(errors) {
        errors.errorString = '';
        for (var i = 0; i < errors.length; i++) {
          if (errors[i]['msg'] && errors[i]['msg'] != "") {
            errors.errorString += ' ' + errors[i]['msg'];
          }
        }
      },

      verbForm: function(url, form, model, method) {
        var self = this;
        var deferred = $q.defer();

        $http[method](url, model)
          .success(function (data) {
            deferred.resolve(data);
            var result = {};
            result.success = true;
            result.data = data;
            //cleanup old errors
            for (var key in form) {
              if (form[key]) { //This seems unecessary but otherwise if there are already errors and we press submit we get an undefined error
                form[key].$serverErrorText = "";
              }
            }
          })
          .error(function (data, status, headers, config) {
            data.error = true;

            var errors = typeof data == 'object' ? data.errors : JSON.parse(data).errors;
                
            for (var key in form) {
              if (form[key]) { //This seems unecessary but otherwise if there are already errors and we press submit we get an undefined error
                form[key].$serverErrorText = "";
              }
            }
            
            self.getErrorString(errors);
            deferred.reject(errors);
          });

        return deferred.promise;
      },

      remove: function(url, model) {
        return this.verb(url, model, 'delete');
      },

      post: function (url, model) {
        return this.verb(url, model, 'post');
      },

      put: function (url, model) {
        return this.verb(url, model, 'put');
      },

      postForm: function (url, form, model) {
        return this.verbForm(url, form, model, 'post');
      },

      putForm: function (url, form, model) {
        return this.verbForm(url, form, model, 'put');
      }
    };
    return httpModel;
  });
