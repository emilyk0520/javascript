const db = require('../modules/connection'),
      mysql = require('mysql'),
      // create the connection here, rather than in module.exports, to avoid
      // exhausting the connection pool when there are a lot of concurrent users
      pool = db.connect();

module.exports = {
  
  // open items page content
  render: function(req, res) {

    // determine the project id based on passed get variable
    const theURL = new URL(req.url, `http://${req.headers.host}`);
    const theValue = theURL.searchParams.get('project'); 

    // redirects
    if (!theValue) {return res.redirect('/openitems?project=1');} // if no GET variable passed
    if (isNaN(theValue)) {return res.redirect('/openitems?project=1');} // if GET variable is not numerical

    // connect to db and query data
    pool.getConnection(function(err, connection) {
    
      // failure to get a connection from the pool
      if (err) {
    	  console.log(err);
      }
      
      else {
    
        // query to get all open issues for specific project
        let sql = "SELECT items.*, employees.employee_name, projects.* FROM items JOIN projects ON items.project_id=projects.project_id LEFT JOIN employees ON items.assigned_to=employees.employee_id WHERE items.project_id=? AND items.item_status=1 ORDER BY items.project_counter ASC";

        // insert GET variable
    	  const bindings = [theValue];
    	
    	  // bind values to block SQL injection attacks
    	  sql = mysql.format(sql, bindings);

    	  connection.query(sql, function(error, results) {
    	  
    	    if (error) {
    	      console.log(error);
    	    }
    	  
    	    else {
        
            // if open issues exist, set up for readable data and render accordingly
            if (results.length > 0) {

              for (let i=0; i<results.length; i++){

                // convert the numbers representing priority to words
                switch (results[i].item_priority){
                  case 1:
                    results[i].item_priority = 'High';
                    break;
                  case 2:
                    results[i].item_priority = 'Medium';
                    break;
                  case 3:
                    results[i].item_priority = 'Low';
                    break;
                } 

                // convert the numbers representing type to words
                switch (results[i].item_type){
                  case 1:
                    results[i].item_type = 'Bug';
                    break;
                  case 2:
                    results[i].item_type = 'Enhancement';
                    break;
                  case 3:
                    results[i].item_type = 'Task';
                    break;
                }
                
              }
              
              // send locals for proper render
              res.render('openitems', {
                projectID: theValue, 
                dataRows: results, 
                projectAbbrev: results[0].project_abbrev, 
                projectName: results[0].project_name, 
                tableFound: true
              });
            }

            // if no open issues, set up to render alert message
            else {

              // query for project information for specific project
              let sql2 = "SELECT * FROM projects WHERE project_id=?";
              sql2 = mysql.format(sql2, bindings);

              connection.query(sql2, function(error, results) {

                if (error) {
                  console.log(error);
                }

                else {

                  if (results.length > 0) {
                    res.render('openitems', {
                      projectID: theValue, 
                      projectAbbrev: results[0].project_abbrev, 
                      projectName: results[0].project_name, 
                      noTable: true
                    });
                  }

                  else {
                    // if project ID does not bring up any database matches, redirect
                    return res.redirect('/openitems?project=1');
                  }

                  
                }
              });

            }
            
            // release the database connection
            connection.release();

            // handle error after release, if one occurs
            if(error) { throw error; }
           
    	  
    	    }

        });
    
      }
    
    });
  },

  redirect: function(req, res){
    res.redirect('/openitems?project=1');
  }

}