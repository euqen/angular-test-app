angular.module("app")
  .factory("httpModel", function ($http, $q, $state, Notification) {
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
            self.handleErrors(data, status);
            deferred.reject();
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
            self.handleErrors(data, status);
          });

        return deferred.promise;
      },

      fillFormErrors : function(form, errors, field, message) {
        form.globalErrors = [];
        for (var i = 0; i < errors.length; i++) {
          if (errors[i][field] && errors[i][field] != "") {
            console.log(errors[i][field]);
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
            deferred.reject(data);
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
      },

     /* handleErrors: function (data, status) {
        switch (status) {
          case 400:
            //don't do anything, just pass errors to the controllers
            //sometimes needed when make a post request and there is validation error you need return to a client
            break;
          case 404:
            $state.go("not-found");
            break;
          case 401:
            window.location = "/";
            break;
          case 403:
            $state.go("access-denied");
            break;
          default:
            Notification.success('Success notification');
            break;
        }
      }*/
    };
    return httpModel;
  });
