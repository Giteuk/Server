var express = require('express');
var router = express.Router();
var db_config = require('../secret/database.js');
var conn = db_config.init();

// 게시글 쓰기
router.post('/', (req, res, next)=>{
  try{
    let sql = `INSERT INTO FORUM(Title, UserNickName, Content, CreatedDate) 
          VALUES ( '${req.body.title}', '${req.body.nickName}', '${req.body.content}', now());`; 

    conn.query(sql, function (err, rows, fields) {
        if(err) res.send(err);
        else{
          res.send('게시글 쓰기 성공');
        } 
    });
  }catch(err){
    res.send(err);
  }
})

module.exports = router;