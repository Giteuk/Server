var express = require('express');
var router = express.Router();
var db_config = require('../secret/database.js');
var conn = db_config.init();

// 키 값 만들기 
router.post('/newBie', function(req, res, next) {
  try{
    var key = Math.random().toString(36).slice(2);
    let farmId = '';
    if(req.body.farm[0] == -1){
      // 관리자
      farmId = '-1';
    }else{
      for(var i=0; i<=req.body.farm.length-1; i++){
        farmId += req.body.farm[i];
        if( i != req.body.farm.length-1) farmId += ', ';
      }
    }
    var sql = `INSERT INTO Capstone.KEY(KeyValue, FarmNum) VALUES ( '${key}', '${farmId}');`; 

    conn.query(sql, function (err, rows, fields) {
        if(err) res.send(err);
        else{
          res.send(key);
        } 
    });
  }catch(err){
    res.send(err);
  }
});

module.exports = router;