var express = require('express');
var router = express.Router();
var db_config = require('../secret/database.js');
const nodemailer = require('nodemailer');
const mailerInfo = require('../secret/email.js');
var conn = db_config.init();

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

module.exports = router;