var express = require('express');
var router = express.Router();
var db_config = require('../secret/database.js');
var conn = db_config.init();
db_config.connect(conn);

/* GET home page. */
router.get('/:userId', function(req, res, next) {
  try{
    var sql = `SELECT * FROM Books;`;    
    conn.query(sql, function (err, rows, fields) {
        if(err) res.send(err);
        else{
          res.send(rows);
        } 
    });
  }catch(err){
    res.send(err);
  }
});

module.exports = router;
