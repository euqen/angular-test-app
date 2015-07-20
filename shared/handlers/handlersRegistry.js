var socketsHandlers = function()
{
	/*
	* REQUIRE SOCKET HANDLERS HERE
	 */
	
	require('./socket');
};

var registerHandlers = function()
{
	/*
	* REQUIRE FUNCTIONS WHICH REQUIRING HANDLERS
	 */
	
	socketsHandlers();
};

module.exports = registerHandlers();