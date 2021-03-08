var express = require('express');
var router = express.Router();
var db_config = require('../secret/database.js');
const { route } = require('./index.js');
var conn = db_config.init();

// 회원가입
router.post('/signUp', function(req, res, next) {
  try{
    let sql = `SELECT COUNT(*) as cnt FROM Capstone.KEY WHERE KeyValue = '${req.body.key}';`;
    conn.query(sql, function (err, rows, fields) {
        if(err) res.send(err);
        else{
          if(rows[0].cnt != 1){
            res.send("Key권한 없음");
          }else{
            let sqlInsert = `INSERT INTO Capstone.USERS(UserId, UserPw, UserName, UserNickName, UserPhoneNum, UserEmail)
                        VALUES ( '${req.body.id}', '${req.body.pw}', '${req.body.name}', '${req.body.nickname}', '${req.body.phone}' , '${req.body.email}');`;
            conn.query(sqlInsert, function(err, result, fields1){
              if(err) res.send(err);
              else{
                res.send("회원가입이 완료되었습니다.");
              }
            })
          }
        } 
    });
  }catch(err){
    res.send(err);
  }
});

// 아이디 존재 유무
router.post('/search/ID', function(req, res, next){
  try{
    let sql = `SELECT COUNT(*) as cnt FROM USERS WHERE UserId = '${req.body.id}';`;
    conn.query(sql, function(err, result, fields){
      if(err) res.send(err);
      else{
        if(result[0].cnt == 1) res.send("중복됨");
        else res.send("중복 안됨");
      }
    })
  }catch(err){
    res.send(err);
  }
})

// 닉네임 존재 유무
router.post('/search/NickName', function(req, res, next){
  try{
    let sql = `SELECT COUNT(*) as cnt FROM USERS WHERE UserNickName = '${req.body.nickName}';`;
    conn.query(sql, function(err, result, fields){
      if(err) res.send(err);
      else{
        if(result[0].cnt == 1) res.send("중복됨");
        else res.send("중복 안됨");
      }
    })
  }catch(err){
    res.send(err);
  }
})

// 로그인
router.post('/login', function(req, res, next){
  try{
    let sql = `SELECT COUNT(*) as cnt FROM USERS WHERE UserId = '${req.body.id}' AND UserPw = '${req.body.pw}';`;
    conn.query(sql, function(err, result, fields){
      if(err) res.send(err);
      else{
        if(result[0].cnt == 1) res.send("성공");
        else res.send("실패");
      }
    })
  }catch(err){
    res.send(err);
  }
})

module.exports = router;
