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
      let sql = `
      SELECT id, Title as title, UserNickName as userNickName, DATE_FORMAT(CreatedDate, '%Y-%m-%d %H:%i') as date, commentCnt 
      FROM FORUM f 
        LEFT JOIN (
          SELECT PostNum, COUNT(PostNum) as commentCnt 
          FROM COMMENT c 
          GROUP BY PostNum 
        ) cmtCnt
        ON(f.id = cmtCnt.PostNum)
      ;`; 
      conn.query(sql, function (err, result, fields) {
          if(err) res.send(err);
          else{
            res.json(result);
          } 
      });
    }catch(err){
      res.send(err);
    }
  })

router.route('/:id')
  .get((req, res, next)=>{ // 세부 게시글 확인 
    // 무슨 값을 보내줘야하는지 논의 필요
    res.send("세부 게시글 확인");
  })
  .post((req, res, next)=> { // 게시글 내 댓글 쓰기
    try{
      let sql = `INSERT INTO COMMENT(UserNickName, Content, PostNum, CreatedDate) 
            VALUES ( '${req.body.nickName}', '${req.body.content}', '${req.params.id}', now());`; 
      conn.query(sql, function (err, rows, fields) {
          if(err) res.send(err);
          else{
            res.send('댓글 작성 성공');
          } 
      });
    }catch(err){
      res.send(err);
    }
  })
  .patch((req, res, next) => { // 게시글 수정
    try{
      let sql = `UPDATE FORUM SET Title = '${req.body.title}', Content = '${req.body.content}' WHERE id='${req.params.id}'`;
      conn.query(sql, (err, result, fields)=>{
        if(err) res.send(err);
        else{
          res.send("게시글 수정 성공");
        }
      })
    }catch(err){
      res.send(err);
    }
  })

module.exports = router;