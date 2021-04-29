var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var db_info = require('../secret/database.js');

/* GET home page. */
router.get('/:Farmid', function(req, res, next) {
  try{
    var sql = `SELECT * FROM CAMERA WHERE Farmid='${req.params.Farmid}';`;    
    console.log("asdf");
    let connection = mysql.createConnection(db_info);
    connection.connect(
      function(err) {
          if(err) console.error('mysql connection error : ' + err);
          else{console.log('mysql is connected successfully!');}
      }
    );

    connection.query(sql, function (err, rows, fields) {
        if(err){ res.send(err); connection.end();}
        else{
          let camera1;
          let camera2;
          let camera3;
         
          camera1=rows[0].Streamlink;
          camera2=rows[1].Streamlink;
          camera3=rows[2].Streamlink;
          
          connection.end();
          res.json({camera1,camera2,camera3});
        }
    });
  }catch(err){
    res.send(err);
  }
});

module.exports = router;
