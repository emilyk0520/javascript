// set up the main variables
let express = require('express'),
	config = require('./server/configure'),
	app = express()

// call the module.exports constructor function of the configure file
// this adds to app and returns app
// this is done to avoid putting a bunch of code in the index.js file
app = config(app);

// set the port
app.set('port',process.env.PORT || 3000);

// set the 'views' directory so we can load files from there
app.set('views', __dirname + '/views');

// listen on port 3000
app.listen(app.get('port'), function(){
  console.log('server up...');
});