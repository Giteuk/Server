var express = require('express');
var router = express.Router();
var db_config = require('../secret/database.js');
// var conn = db_config.init();

/* GET home page. */
router.get('/:Farmid', function(req, res, next) {
  try{
    var sql = `SELECT * FROM CAMERA WHERE Farmid='${req.params.Farmid}';`;    
    conn.query(sql, function (err, rows, fields) {
        if(err) res.send(err);
        else{
          let camera1;
          let camera2;
          let camera3;
         
          camera1=rows[0].Streamlink;
          camera2=rows[1].Streamlink;
          camera3=rows[2].Streamlink;
          
          res.json({camera1,camera2,camera3});
        }
    });
  }catch(err){
    res.send(err);
  }
});

module.exports = router;
