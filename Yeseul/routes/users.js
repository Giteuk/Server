var express = require('express');
var router = express.Router();
const {UserTable} = require('../models');

var session = require('express-session');
const FileStore = require('session-file-store')(session); 

router.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}));

/* 아이디가 존재하는지 검색 */
router.get('/', function(req, res, next) {
  UserTable.findAll({
    where : { UserID : req.body.id}
  }).then( result => {
    if(result.length == 0){
      res.send("존재하지 않는 아이디 입니다.");
    }else{
      res.send("존재하는 아이디 입니다.");
    }
  });
});

//회원가입
router.post('/', function(req, res, next){
  let ID = req.body.id;
  UserTable.findAll({
    where : { UserID : ID }
  }).then( result => {
    if(result.length == 0){
      UserTable.create({
        UserName : req.body.name, 
        UserID: ID,
        UserPW: req.body.pw,
        UserPNum: req.body.phone,
        UserEmail: req.body.email
      }).then(
        res.send("회원가입 되었습니다.")
      )
    }else{
      res.send("중복된 아이디 값입니다.");
    }
  }).catch( err=>{
    res.send("ERROR1");
    next(err);
  })
});

//유저 정보 수정
router.patch('/:id', async(req, res, next) => {
  UserTable.update({
    UserName : req.body.name,
    UserPW : req.body.pw,
    UserPNum : req.body.phone,
    UserEmail : req.body.email
  }, { where : {UserID : req.params.id}})
  .then((result)=>{
    if(result) res.send(`업데이트 성공 ${result}개 존재`);
    else res.send("업데이트에 실패하였습니다. ERRNUM : 2");
  })
  .catch((err)=>{
    console.err(err);
    next(err);
  })
})

//유저 정보 삭제
router.delete('/:id' , async (req, res, next) => {
  UserTable.destroy({where : {UserID : req.params.id}})
  .then(result => {
    if(result) res.send("유저 정보 삭제 성공");
    else res.send("유저가 존재하지 않습니다.");
  })
  .catch((err) => {
    console.log(err);ㅅ
    next(err);
  })
})

router.post('/login', function(req, res, next){
  UserTable.findAll({
      where : {
          userID : req.body.id, 
          userPW : req.body.pw
      }
  }).then(result => {
      //id를 입력 받았을 때
      if(result.length == 0){ 
          //일치하는 아이디 없음, 로그인 실패
          res.send("로그인 실패, 아이디 혹은 패스워드를 확인하세요.");
      }else{
          //로그인 성공
          req.session.logined = true;
          req.session.user_id = req.body.id;
          console.log("로그인");
          res.send(`${req.body.id}님 안녕하세요. 로그인 되셨습니다.`);
          // res.render('logout', {id: req.session.user_id});
      }
  }).catch(err=>{
      res.send("ERROR1");
      next(err);
  })
})

router.get('/login', (req, res, next) => {  // 3
  if(req.session.logined){
    res.send(`안녕하세요 ${req.session.user_id}님, 로그아웃 하시겠습니까`);
      // res.render('logout', {id: req.session.user_id});
  }else{
    res.send("로그인 하세요.");
      // res.render('login');
  }
});

router.post('/login/logout', (req, res) =>{
  req.session.destroy();
  res.send(`로그아웃 되셨습니다.
  <form action="/login" method="GET">
      <button type="submit">메인으로 돌아가기</button>
  </form>
  `);
});

module.exports = router;
