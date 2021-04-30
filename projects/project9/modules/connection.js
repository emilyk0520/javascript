const mysql = require('mysql');
const connection = require('../model/db');
const connection_obj = connection.db();

exports.connect = function() {

  const pool = mysql.createPool(connection_obj);
  return pool;

}