var express = require('express');
var router = express.Router();
var db_config = require('../secret/database.js');
var conn = db_config.init();

router.route('/')
  .post((req, res, next)=>{ // 게시글 쓰기
    try{
      let sql = `INSERT INTO FORUM(UserId, Title, UserNickName, Content, CreatedDate) 
            VALUES (${req.body.userIdent}, '${req.body.title}', '${req.body.nickName}', '${req.body.content}', now());`; 
  
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
      let sql = `UPDATE FORUM SET Title = '${req.body.title}', Content = '${req.body.content}' WHERE id=${req.params.id}`;
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
  .delete((req, res, next)=>{ // 게시글 삭제
    try{
      let sql = `DELETE FROM COMMENT WHERE PostNum = ${req.params.id}`;
      conn.query(sql, (err, result, fields) => {
        if(err) res.send(err);
        else{
          let sql2 = `DELETE FROM FORUM WHERE id = ${req.params.id}`;
          conn.query(sql2, (err, result, fields2) => {
            if(err) res.send(err);
            else res.send("게시글 삭제 성공");
          })
        }
      })
    }catch(err){
      res.send(err);
    }
  })


router.get('/user/post/:userId', (req, res, next)=> { // 아이디별 게시글 출력
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
      WHERE UserId = ${req.params.userId}
    `;
    conn.query(sql, (err, result, fields) => {
      if(err) res.send(err);
      else {
        if(result.length == 0) res.send("검색 결과가 없습니다.");
        else
          res.json(result);
      }
    })
  }catch(err){
    res.send(err);
  }
})

router.get('/user/com/:userId', (req, res, next)=>{ // 아이디별 댓글 출력
  try{
    let sql = `
    SELECT id, Title, UserNickName, DATE_FORMAT(CreatedDate, '%Y-%m-%d %H:%i') as date,
      (SELECT PostNum
        FROM COMMENT c
        WHERE UserId = ${req.params.userId} AND f.id = c.PostNum
        GROUP BY PostNum 
        ) as userCmt, cmtCnt.cnt as cmtCnt
    FROM FORUM f 
      LEFT JOIN(
        SELECT PostNum, COUNT(PostNum) as cnt 
        FROM COMMENT c2 
        GROUP BY PostNum 
      ) cmtCnt 
      ON f.id = cmtCnt.PostNum 
    `;
    conn.query(sql, (err, result, fields) => {
      if(err) res.send(err);
      else {
        let inform = [];
        for(let i=0; i<result.length;i++){
          console.log(result[i].cmtCnt)
          if(result[i].userCmt != null){
            let temp = {
              id : result[i].id,
              title : result[i].Title,
              userNickName : result[i].UserNickName,
              date : result[i].date,
              commentCnt : result[i].cmtCnt
            }
            inform.push(temp);
          }
        }
        res.json(inform);
      }
    })
  }catch(err){
    res.send(err);
  }
})

module.exports = router;