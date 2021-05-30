var express = require('express');
var router = express.Router();
var db_info = require('../secret/database.js');
var mysql = require('mysql');

router.route('/')
  .get((req, res, next)=>{ // 일 별, 주 별(날짜 간) 일지 목록 
    try{
      var sql = `
        SELECT id as diaryId, Content as content, DATE_FORMAT(Date, '%Y-%m-%d %H:%i') as date
        FROM DIARY d 
        WHERE UserId = ${req.query.userIdent} AND Date BETWEEN DATE_FORMAT('${req.query.startDate}', '%Y-%m-%d') AND DATE_FORMAT(DATE_ADD('${req.query.endDate}', INTERVAL +1 DAY),'%Y-%m-%d')
      ;`; 
      let conn = mysql.createConnection(db_info);
      conn.connect();
      conn.query(sql, function (err, result, fields) {
        if(err){ conn.end(); res.send(err);}
        else{
          conn.end();
          res.json(result);
        } 
      });
    }catch(err){
      res.send(err);
    }
  })
  .post((req, res, next)=>{ // 일지 쓰기
    try{
      let sql = `INSERT INTO DIARY(UserId, Content, Date) VALUES (${req.body.userIdent}, '${req.body.content}', now());`
      let conn = mysql.createConnection(db_info);
      conn.connect();
      
      conn.query(sql, function (err, rows, fields) {
        if(err){
          conn.end();
          res.send(err);
        }
        else{
          conn.end();
          res.send("성공");
        } 
      });
    }catch(err){
      res.send(err);
    }
  })
  .patch((req, res, next)=>{ // 일지 수정
    try{
      let sql = `UPDATE DIARY SET Content = '${req.body.content}' WHERE id = ${req.query.id};`
      let conn = mysql.createConnection(db_info);
      conn.connect();
      
      conn.query(sql, function (err, rows, fields) {
        if(err){
          conn.end();
          res.send(err);
        }
        else{
          conn.end();
          res.send("수정성공");
        } 
      });
    }catch(err){
      res.send(err);
    }
  })
  .delete((req, res, next)=>{ // 일지 삭제 
    try{
      let sql = `DELETE FROM DIARY WHERE id = ${req.query.id};`
      let conn = mysql.createConnection(db_info);
      conn.connect();
      
      conn.query(sql, function (err, rows, fields) {
        if(err){
          conn.end();
          res.send(err);
        }
        else{
          conn.end();
          res.send("삭제성공");
        } 
    });
    }catch(err){
      res.send(err);
    }
  })

// 월 별 일지 목록
router.get('/month', function(req, res, next) {
  try{
    var sql = `
      SELECT id as diaryId, Content as content, DATE_FORMAT(Date, '%Y-%m-%d %H:%i') as date
      FROM DIARY d 
      WHERE UserId = ${req.query.userIdent} AND DATE_FORMAT(Date, '%Y-%m') BETWEEN '${req.query.month}' AND '${req.query.month}'
    ;`; 
    let connection = mysql.createConnection(db_info);
    connection.connect();
    
    connection.query(sql, function (err, result, fields) {
      if(err){
        connection.end();
        res.send(err);
      }
      else{
        connection.end();
        res.send(result);
      } 
  });
  }catch(err){
    res.send(err);
  }
});

// 년 별 일지 목록
router.get('/year', function(req, res, next) {
  try{
    var sql = `
      SELECT id as diaryId, Content as content, DATE_FORMAT(Date, '%Y-%m-%d %H:%i') as date
      FROM DIARY d 
      WHERE UserId = ${req.query.userIdent} AND DATE_FORMAT(Date, '%Y') BETWEEN '${req.query.year}' AND '${req.query.year}'
    ;`; 
    let connection = mysql.createConnection(db_info);
    connection.connect();
    
    connection.query(sql, function (err, result, fields) {
      if(err){
        connection.end();
        res.send(err);
      }
      else{
        connection.end();
        res.send(result);
      } 
  });
  }catch(err){
    res.send(err);
  }
});

module.exports = router;