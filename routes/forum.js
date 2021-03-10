var express = require('express');
var router = express.Router();
var db_config = require('../secret/database.js');
var conn = db_config.init();

router.route('/')
  .post((req, res, next)=>{ // 게시글 쓰기
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
  .get((req, res, next)=>{ // 모든 게시글 확인
    try{
      let sql = `;`; 
      res.send("모든 게시글 확인")
      // conn.query(sql, function (err, rows, fields) {
      //     if(err) res.send(err);
      //     else{
      //       res.send('게시글 쓰기 성공');
      //     } 
      // });
    }catch(err){
      res.send(err);
    }
  })

router.route('/:id')
  .get((req, res, next)=>{ // 세부 게시글 확인
    res.send("세부 게시글 확인");
  })

module.exports = router;