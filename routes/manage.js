var express = require('express');
var router = express.Router();
var db_info = require('../secret/database.js');
var mysql = require('mysql');
const nodemailer = require('nodemailer');
const mailerInfo = require('../secret/email.js');

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

    if(req.body.email)
      sendEmail(req.body.email, key).catch(console.error);

    let connection = mysql.createConnection(db_info);
    connection.connect(
      function(err) {
          if(err) console.error('mysql connection error : ' + err);
          else{console.log('mysql is connected successfully!');}
      }
    );

    connection.query(sql, function (err, rows, fields) {
      if(err){
        connection.end();
        res.send(err);
      }
      else{
        connection.end();
        res.send(key);
      } 
  });
    
  }catch(err){
    res.send(err);
  }
});

// router.post('/', function(req,res,next){
//   sendEmail(req.body.email).catch(console.error);
// })

// 메일 보내기 
const sendEmail  = async (userEmail, key) => {
  console.log(mailerInfo.NODEMAIL_USER)
  console.log(mailerInfo.NODEMAIL_PW)
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      // Gmail 주소 입력
      user: mailerInfo.NODEMAIL_USER,
      // Gmail 패스워드 입력
      pass: mailerInfo.NODEMAIL_PW,
    },
  });

  let info = await transporter.sendMail({
    // 보내는 곳의 이름과, 메일 주소를 입력
    from: `"TEAM Giteuk" <${mailerInfo.NODEMAIL_USER}>`,
    // 받는 곳의 메일 주소를 입력
    to: `${userEmail}`,
    // 보내는 메일의 제목을 입력
    subject: '농사왕 회원가입 키 값입니다.',
    // 보내는 메일의 내용을 입력
    // text: 일반 text로 작성된 내용
    // html: html로 작성된 내용
    html: `당신이 사용해야 할 값은 다음과 같습니다.<br> <h3>${key}</h3>복사하셔서 사용하시면 됩니다.<br>- 팀 기특 드림`,
  });

  console.log('Message sent: %s', info.messageId);
}

// 모든 유저들의 아이디와 이름 전송
router.get('/allMemberInfo', function(req, res, next) {
  try{
    var sql = `SELECT id as UserIdent, UserId, UserName FROM USERS;`; 
    let connection = mysql.createConnection(db_info);
    connection.connect(
      function(err) {
          if(err) console.error('mysql connection error : ' + err);
          else{console.log('mysql is connected successfully!');}
      }
    );
    
    connection.query(sql, function (err, rows, fields) {
      if(err){
        connection.end();
        res.send(err);
      }
      else{
        connection.end();
        res.send(rows);
      } 
  });
  }catch(err){
    res.send(err);
  }
});

// 모든 밭 별명 정보
router.get('/allFarmInfo', (req, res, next)=>{
  try{
    var sql = `SELECT id as FarmId, FarmName FROM FARM;`; 
    let conn = mysql.createConnection(db_info);
    conn.connect(
      function(err) {
          if(err) console.error('mysql connection error : ' + err);
          else{console.log('mysql is connected successfully!');}
      }
    );
    
    conn.query(sql, function (err, rows, fields) {
      if(err){
        conn.end();
        res.send(err);
      }
      else{
        conn.end();
        res.send(rows);
      } 
  });
  }catch(err){
    res.send(err);
  }
})

// 밭 별 관리
router.route('/eachFarm')
  .get((req, res, next)=>{ // 밭 별 사용자 id&이름
    try{
      var sql = `SELECT u.id as UserIdent, u.UserId, u.UserName 
                FROM USER_TO_FARM utf LEFT JOIN USERS u ON(utf.UserId = u.id)
                WHERE FarmNum LIKE '%${req.query.FarmId}%';`; 
      let conn = mysql.createConnection(db_info);
      conn.connect(
        function(err) {
            if(err) console.error('mysql connection error : ' + err);
            else{console.log('mysql is connected successfully!');}
        }
      );
      
      conn.query(sql, function (err, rows, fields) {
        if(err){
          conn.end();
          res.send(err);
        }
        else{
          conn.end();
          res.send(rows);
        } 
    });
    }catch(err){
      res.send(err);
    }
  })


// 유저 별 관리
router.route('/eachUser')
  .get((req, res, next)=>{ // 사용자 정보 + 소유 밭 별명
    try{
      var sql = `
        SELECT u.id, u.UserId, u.UserName, u.UserPhoneNum, f.id as FarmId, f.FarmName as FarmName 
        FROM USERS u 
          JOIN (
            select utf.id as utfID, utf.UserId as utfUserId,
              SUBSTRING_INDEX(SUBSTRING_INDEX(utf.FarmNum , ', ', numbers.n), ', ', -1) FarmNum 
            from
              (select 1 n union all
              select 2 union all select 3 union all
              select 4 union all select 5) numbers INNER JOIN USER_TO_FARM utf
              on CHAR_LENGTH(utf.FarmNum)
                -CHAR_LENGTH(REPLACE(utf.FarmNum, ',', ''))>=numbers.n-1
          ) t1 ON (u.id = t1.utfUserId) 
        JOIN FARM f ON (t1.FarmNum = f.id)
        WHERE u.id = ${req.query.UserIdent}
      ;`; 
      let conn = mysql.createConnection(db_info);
      conn.connect(
        function(err) {
            if(err) console.error('mysql connection error : ' + err);
            else{console.log('mysql is connected successfully!');}
        }
      );
      conn.query(sql, function (err, result, fields) {
        if(err){ conn.end(); res.send(err);}
        else{
          let userInfo = {
            FarmID : [],
            FarmName : [],
            UserIdent : result[0].id,
            UserName : result[0].UserName,
            UserPhoneNum : result[0].UserPhoneNum
          }
          for(let i=0; i<result.length; i++){
            userInfo.FarmID.push(result[i].FarmId);
            userInfo.FarmName.push(result[i].FarmName);
          }
          conn.end();
          res.json(userInfo);
        } 
      });
    }catch(err){
      res.send(err);
    }
  })

// 유저 비밀번호 초기화
router.get('/resetPw', function(req, res, next) {
  try{
    var sql = `UPDATE USERS SET UserPw = '0000' WHERE id = ${req.query.UserIdent};`; 
    let connection = mysql.createConnection(db_info);
    connection.connect(
      function(err) {
          if(err) console.error('mysql connection error : ' + err);
          else{console.log('mysql is connected successfully!');}
      }
    );
    
    connection.query(sql, function (err, rows, fields) {
      if(err){
        connection.end();
        res.send(err);
      }
      else{
        connection.end();
        res.send("초기화완료");
      } 
  });
  }catch(err){
    res.send(err);
  }
});

module.exports = router;