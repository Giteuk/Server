var express = require('express');
var router = express.Router();
var db_config = require('../secret/database.js');
var conn = db_config.init();
db_config.connect(conn);

/* GET home page. */
router.get('/:Farmid', function(req, res, next) {
  try{
    var sql = `SELECT * FROM CAMERA WHERE Farmid='${req.params.Farmid}';`;    
    conn.query(sql, function (err, rows, fields) {
        if(err) res.send(err);
        else{
          //res.send(rows);
          let Link=[];
          for(let i=0; i<rows.length; i++){
            let temp={link:rows[i].Streamlink}
          }
          Link.push(temp);
        } 
        res.json(Link);
    });
  }catch(err){
    res.send(err);
  }
});

module.exports = router;
