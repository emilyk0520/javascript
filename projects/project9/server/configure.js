// pull in the dependencies
const routes = require('./routes'),
      express = require('express'),
      exphbs = require('express-handlebars'),
      path = require('path'),
      bodyParser = require('body-parser');

module.exports = function(app) {

  // set up body-parser, used for POST data
  app.use(bodyParser.urlencoded({'extended':false}));

  // put app into the routes constructor
  routes(app);
  
  // make the public folder static so we can call front-end code
  app.use('/public/', express.static(path.join(__dirname,'../public')));

  // set up handlebars as the template engine
  app.engine('handlebars', exphbs.create({
    defaultLayout: 'main',
    layoutsDir: app.get('views') + '/layouts',
    partialDir: app.get('views') + '/partials'
  }).engine);
  app.set('view engine','handlebars');

  return app;

}