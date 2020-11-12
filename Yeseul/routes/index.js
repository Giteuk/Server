var express = require('express');
var router = express.Router();
const {UserTable, UserToFarmTable, FarmTable} = require('../models');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

//메인 페이지 - 권한 밭 개수, 밭들의 id, 밭 별명, 사용자 정보
router.get('/:id', function(req, res, next){
  UserTable.findAll({ // UserTable에서 id를 가지고 유저 정보 찾음
    where : {UserID : req.params.id}
  }).then( resu => {

    UserToFarmTable.findAll({ // 어떤 사람이 몇번밭을 가지고있는지 찾음
      where: {UserID : req.params.id}
    }).then( result =>{
      console.log(result.length); // 밭 몇개 갖고 있는지
      var n = result.length;
        
      let farmNumArr = new Array(); //밭-유저 테이블에 있는 id와 밭 테이블에 있는 id가 달라서 필요
      let farmNameArr = new Array();
      let farmIDArr = new Array();
      for(var i=0; i<n ; i++){
        farmNumArr.push(result[i].FarmNum);
      }

      // res.send(farmNumArr);

      if(farmNumArr[0] == -1){ // 관리자
        FarmTable.findAll().then( All => {
          
          // let farmIDArr = new Array();
          for(var i=0; i<All.length ; i++){
            farmIDArr.push(All[i].id);
            farmNameArr.push(All[i].FarmName);
          }

          // res.send(farmNameArr);
          var info = {
            farmNum : -1,
            farmID : farmIDArr,
            farmName : farmNameArr,
            UserName : resu[0].UserName,
            UserPhoneNum : resu[0].UserPNum,
            UserEmail : resu[0].UserEmail
          }

          res.send(info);
        })
      }
      else{ // 유저
          FarmTable.findAll({
            where : { id : farmNumArr}
          }).then( result2 => {
            console.log("돌아간다");
    
            for(var i=0; i<n ; i++){
              farmIDArr.push(result2[i].id);
              farmNameArr.push(result2[i].FarmName);
            }
            
            var info = {
              farmNum : n,
              farmID : farmIDArr,
              farmName : farmNameArr,
              UserName : resu[0].UserName,
              UserPhoneNum : resu[0].UserPNum,
              UserEmail : resu[0].UserEmail
            }

            res.send(info);
          })
      }
    })

  })
})

module.exports = router;
