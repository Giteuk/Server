var express = require('express');
var router = express.Router();
const {UserTable, KeyTable, UserToFarmTable} = require('../models');

var session = require('express-session');
const FileStore = require('session-file-store')(session); 

router.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}));

/* 아이디가 존재하는지 검색 */
router.post('/search/ID', function(req, res, next) {
  UserTable.findAll({
    where : { UserID : req.body.id}
  }).then( result => {
    if(result.length == 0){
      res.send("중복 안됨");
    }else{
      res.send("중복됨");
    }
  });
});

// 닉네임이 존재하는지 검색
router.post('/search/NickName', function(req, res, next){
  UserTable.findAll({
    where : { UserNick : req.body.nickname}
  }).then( result => {
    if(result.length == 0){
      res.send("중복 안됨");
    }else{
      res.send("중복됨");
    }
  })
})

//회원가입
//회원가입 시도를 할 때 key값을 받아옴 -> key 값과 일치하는 밭 번호를 알아냄 -> UserToFarm테이블에 추가
//회원 가입 시도를 할 때 ID 가 원래 있던 아이디와 동일한지 볼 필요는 없다.
router.post('/', function(req, res, next){
  console.log("회원가입 시도");
  KeyTable.findAll({
    where: { KeyValue : req.body.key}
  }).then(result => {
    console.log(result.length);
    // res.send(result);
    if(result.length == 0)
      res.send("Key권한 없음");
    else {
      //존재하는 key
      UserTable.create({
        UserName : req.body.name, 
        UserID: req.body.id,
        UserPW: req.body.pw,
        UserPNum: req.body.phone,
        UserEmail: req.body.email
      }).then(
        console.log("가입 완료")
      )

      for(var i=0; i<result.length; i++){
        UserToFarmTable.create({
          UserID : req.body.id,
          FarmNum: result[i].FarmNum
        }).then(
          res.send("회원가입이 완료되었습니다.")
        )
      }
      
    }
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
          res.send("실패");
      }else{
          //로그인 성공
          //req.session.logined = true;
          //req.session.user_id = req.body.id;
          console.log("로그인");
          res.send("성공");
          //res.send(`${req.body.id}님 안녕하세요. 로그인 되셨습니다.`);
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

//유저가 프로필 같은 것을 수정하는 페이지 필요

module.exports = router;
