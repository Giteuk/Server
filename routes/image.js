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
  console.log(req.file);
  const imagePath = req.file.path;
  console.log(imagePath);
  if(imagePath == undefined){
    console.log("이미지가 존재하지 않습니다.");
    res.send("이미지가 존재하지 않습니다.");
  }else{
    console.log("이미지 전송 성공");
    next();
    res.send("전송성공");
  }
});

module.exports = router;
