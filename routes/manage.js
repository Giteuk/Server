var express = require('express');
var router = express.Router();
var db_config = require('../secret/database.js');
var conn = db_config.init();

// 키 값 만들기
router.post('/newBie', function(req, res, next) {
  try{
    var key = Math.random().toString(36).slice(2);
    let Fnum = req.body.farmNum;
    let farmId = '';
    for(var i=1; i<=Fnum[0]; i++){
      console.log(Fnum[i]);
      farmId += Fnum[i];
      if( i != Fnum.length-1) farmId += ', ';
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