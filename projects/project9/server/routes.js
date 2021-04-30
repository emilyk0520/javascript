// dependencies
const express = require('express'),
	    router = express.Router(),
	    openitems = require('../controllers/openitems')

module.exports = function(app) {
  
  // routes  
  router.get('/', openitems.redirect); // redirects to project=1
  router.get('/openitems', openitems.render);
  
  app.use(router);
 
}