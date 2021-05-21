var express = require('express');
var router = express.Router();
var db_info = require('../secret/database.js');
var mysql = require('mysql');

router.route('/')
  .post((req, res, next)=>{ // 게시글 쓰기
    try{
      let sql = `INSERT INTO FORUM(UserId, Title, UserNickName, Content, CreatedDate) 
            VALUES (${req.body.userIdent}, '${req.body.title}', '${req.body.nickname}', '${req.body.content}', now());`; 
  
      let connection = mysql.createConnection(db_info);
      connection.connect();
      connection.query(sql, function (err, rows, fields) {
          if(err){
            connection.end();
            res.send(err);
          }
          else{
            connection.end();
            res.send('게시글 쓰기 성공');
          } 
      });
    }catch(err){
      res.send(err);
    }
  })
  .get((req, res, next)=>{ // 게시글 확인
    try{
      let sql = `
      SELECT id, Title, UserNickName, DATE_FORMAT(CreatedDate, '%Y-%m-%d %H:%i') as date, CommentCnt 
      FROM FORUM f 
        LEFT JOIN (
          SELECT PostNum, COUNT(PostNum) as CommentCnt 
          FROM COMMENT c 
          GROUP BY PostNum 
        ) cmtCnt
        ON(f.id = cmtCnt.PostNum)
      `; 
      if(req.query.keyword) // 주소에 쿼리스트링 쓰기
          sql += `WHERE Title LIKE '%${req.query.keyword}%' OR Content LIKE '%${req.query.keyword}%'`;
      sql+=';';
      let connection = mysql.createConnection(db_info);
      connection.connect();
      connection.query(sql, function (err, result, fields) {
          if(err){ connection.end(); res.send(err); }
          else{
            connection.end();
            res.json(result);
          } 
      });
    }catch(err){
      res.send(err);
    }
  })

router.route('/:id')
  .get((req, res, next)=>{ // 세부 게시글 확인 
    try{
      let sql = `
                SELECT id, Title, UserNickName, Content, DATE_FORMAT(CreatedDate, '%Y-%m-%d %H:%i') as date, IFNULL(commentCnt, 0) as CommentCnt , ImageName
                FROM FORUM f 
                  LEFT JOIN (
                    SELECT PostNum, COUNT(PostNum) as commentCnt 
                    FROM COMMENT c 
                    GROUP BY PostNum 
                  ) cmtCnt
                  ON(f.id = cmtCnt.PostNum)
                WHERE f.id = ${req.params.id};`; 
      let connection = mysql.createConnection(db_info);
      connection.connect();
      connection.query(sql, function (err, Post, fields) {
        try{
          if(err) res.send(err);
          else{
            let sql2 = `
            SELECT id, UserNickName as nickname, Content, DATE_FORMAT(CreatedDate, '%Y-%m-%d %H:%i') as date
            FROM COMMENT c 
            WHERE PostNum = ${req.params.id}`;
            connection.query(sql2, function(err, Comment, fields){
              if(err){ res.send(err); connection.end(); }
              else{
                connection.end();
                res.json({Post, Comment});
              } 
            })
          }
        }catch(err2){
          res.send(err2);
        }
      });
    }catch(err){
      res.send(err);
    }
  })
  .post((req, res, next)=> { // 게시글 내 댓글 쓰기
    try{
      let sql = `INSERT INTO COMMENT(UserId, UserNickName, Content, PostNum, CreatedDate) 
            VALUES (${req.body.userIdent}, '${req.body.nickname}', '${req.body.content}', '${req.params.id}', now());`; 
      let connection = mysql.createConnection(db_info);
      connection.connect();
      connection.query(sql, function (err, rows, fields) {
          if(err){ connection.end(); res.send(err); }
          else{
            connection.end();
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
      let connection = mysql.createConnection(db_info);
      connection.connect();
      connection.query(sql, (err, result, fields)=>{
        if(err){ connection.end(); res.send(err);}
        else{
          connection.end();
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
      let connection = mysql.createConnection(db_info);
      connection.connect();
      connection.query(sql, (err, result, fields) => {
        if(err) {connection.end(); res.send(err);}
        else{
          let sql2 = `DELETE FROM FORUM WHERE id = ${req.params.id}`;
          connection.query(sql2, (err, result, fields2) => {
            if(err) { connection.end(); res.send(err);}
            else {
              connection.end();
              res.send("게시글 삭제 성공");
            }
          })
        }
      })
    }catch(err){
      res.send(err);
    }
  })

router.route('/com/:comId')
  .patch((req, res, next)=>{ // 댓글 수정
    try{
      let sql = `UPDATE COMMENT SET Content='${req.body.content}' WHERE id=${req.params.comId}`;
      let connection = mysql.createConnection(db_info);
      connection.connect();
      connection.query(sql, (err, result, fields) => {
        if(err) {connection.end(); res.send(err);}
        else{
          if(err) res.send(err);
          else { connection.end(); res.send("댓글 수정 성공");}
        }
      })
    }catch(err){
      res.send(err);
    }
  })
  .delete((req, res, next)=>{ // 댓글 삭제
    try{
      let sql = `DELETE FROM COMMENT WHERE id=${req.params.comId}`
      let conn = mysql.createConnection(db_info);
      conn.connect();
      conn.query(sql, (err, result, fields) => {
        if(err) res.send(err)
        else{
          if(err) res.send(err);
          else{ conn.end(); res.send("댓글 삭제 성공");}
        }
      })
    }catch(err){
      res.send(err);
    }
  })

router.get('/user/post/:userId', (req, res, next)=> { // 아이디별 게시글 출력
  try{
    let sql = `
    SELECT id, Title, UserNickName, DATE_FORMAT(CreatedDate, '%Y-%m-%d %H:%i') as date, CommentCnt 
      FROM FORUM f 
        LEFT JOIN (
          SELECT PostNum, COUNT(PostNum) as CommentCnt 
          FROM COMMENT c 
          GROUP BY PostNum 
        ) cmtCnt
        ON(f.id = cmtCnt.PostNum)
      WHERE UserId = ${req.params.userId}
    `;
    let conn = mysql.createConnection(db_info);
    conn.connect();
    conn.query(sql, (err, result, fields) => {
      if(err) res.send(err);
      else {
        if(result.length == 0){ conn.end(); res.send("검색 결과가 없습니다."); }
        else
          { conn.end(); res.json(result);}
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
    let conn = mysql.createConnection(db_info);
    conn.connect();
    conn.query(sql, (err, result, fields) => {
      if(err) res.send(err);
      else {
        let inform = [];
        for(let i=0; i<result.length;i++){
          // console.log(result[i].cmtCnt)
          if(result[i].userCmt != null){
            let temp = {
              id : result[i].id,
              Title : result[i].Title,
              UserNickName : result[i].UserNickName,
              date : result[i].date,
              CommentCnt : result[i].cmtCnt
            }
            inform.push(temp);
          }
        }
        conn.end();
        res.json(inform);
      }
    })
  }catch(err){
    res.send(err);
  }
})

module.exports = router;