var app = angular.module('app');

app.service('auth', function($cookies, $cookieStore)
{
	this.isAuthorized = function(authField)
	{
		var auth = $cookies.get(authField);
		if (auth) return true;

		return false;
	};

	this.authorize = function(authField, userData)
	{
		return $cookieStore.put(authField, userData);
	};

	this.unAuthorize = function(authField)
	{
		return $cookieStore.remove(authField);
	};

	this.getUserData = function(authField)
	{
		return $cookies.get(authField);
	};
});