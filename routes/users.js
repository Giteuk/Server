var express = require('express');
var router = express.Router();
var db_config = require('../secret/database.js');
const { route } = require('./index.js');
var conn = db_config.init();

// 회원가입
router.post('/signUp', function(req, res, next) {
  try{
    let sql = `SELECT FarmNum FROM Capstone.KEY WHERE KeyValue = '${req.body.key}';`;
    conn.query(sql, function (err, rows, fields) {
        if(err) res.send(err);
        else{
          if(rows.length != 1){
            res.send("Key권한 없음");
          }else{ 
            // USERS 테이블에 유저의 정보 값 넣기
            let sqlInsert = `INSERT INTO USERS(UserId, UserPw, UserName, UserNickName, UserPhoneNum, UserEmail)
                        VALUES ( '${req.body.id}', '${req.body.pw}', '${req.body.name}', '${req.body.nickname}', '${req.body.phone}' , '${req.body.email}');`;
            conn.query(sqlInsert, function(err, result, fields2){
              if(err) res.send(err);
              else{
                // USERS_TO_FARM 테이블에 갖고있는 밭 번호 넣기
                let sqlInsertFarmN = `INSERT INTO USER_TO_FARM(UserId, FarmNum) VALUES (${result.insertId}, '${rows[0].FarmNum}')`
                conn.query(sqlInsertFarmN, function(err, result2, fields3){
                  if(err) res.send(err);
                  else{
                    res.send("회원가입이 완료되었습니다.");
                  }
                })
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
    let sql = `SELECT COUNT(*) as cnt FROM USERS WHERE UserNickName = '${req.body.nickname}';`;
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
