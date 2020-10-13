var mysql = require('mysql');

var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'aurora9011',
  database: 'giteuk'
});
db.connect();
module.exports = db;