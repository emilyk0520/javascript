exports.db = function() {

  var connection = {
	connectionLimit: 10,
	host: 'localhost',
	user: 'username',
	password: 'password',
	database: 'sampleproject'
  }

  return connection;

}