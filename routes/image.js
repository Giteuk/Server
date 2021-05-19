var express = require('express');
var router = express.Router();
var db_info = require('../secret/database.js');
var mysql = require('mysql');

const multer = require('multer');
const storage = multer.diskStorage({
  destination : 'uploads/',
  filename : (req, file, cb)=>{
    cb(null, file.originalname);
  }
});
const upload = multer({ storage : storage })

router.post('/', upload.single('image'), (req, res, next) => {
  const imagePath = req.file.path;
  console.log(imagePath);
  if(imagePath == undefined){
    console.log("이미지가 존재하지 않습니다.");
    res.send("이미지가 존재하지 않습니다.");
  }else{
    try{
      var sql = `INSERT INTO FORUM(UserId, Title, ImageName, UserNickName, Content, CreatedDate) 
              VALUES (${req.body.userIdent}, '${req.body.title}', '${req.file.originalname}', '${req.body.nickname}', '${req.body.content}', now());`; 
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
          console.log("이미지 전송 성공");
          res.send("이미지 전송 성공");
        } 
    });
    }catch(err){
      res.send(err);
    }
  }
});

module.exports = router;
