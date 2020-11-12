var express = require('express');
var router = express.Router();
const {UserTable, FarmTable, UserToFarmTable, KeyTable} = require('../models');

//새로운 계약이 성립된 후, 전화번호&밭번호를 입력하면 key가 생성되어 보내준다.
// -> 전화번호는 서버에서 일하는게 아님!!!
router.post('/Newbie', function(req, res, next){
    //밭번호 전송 arr형태[밭갯수, 밭num나열]로 해 주시겠어요?
    var key = Math.random().toString(36).slice(2);

    //밭번호를 arr형태로 받아와서 저장
    let Fnum = req.body.farmNum;
    for(var i=1; i<=Fnum[0]; i++){
        KeyTable.create({
            KeyValue : key,
            FarmNum : Fnum[i]
        }).then(
        )
    }
    
    res.send(key);
})

//관리자 페이지 중 모든 사람의 정보& 밭 소유 정보 출력 --- 아직 미완!!
// 아이디 & 이름 주는 페이지
// 아이디 클릭 시 멤버가 가지고 있는 밭 정보, 유저 정보 등 출력 하면 OK
//   ---------- 수정하세용 ! 
router.get('/allMemberName', function(req, res, next){

    UserTable.findAll().then(UserResult => {
        // res.send(UserResult);

        let UserIdArr = new Array();
        for(let i =0; i<UserResult.length ; i++){
            UserIdArr.push(UserResult[i].UserID);
        }
        // res.send(UserIdArr);
        UserToFarmTable.findAll({
            
            where : { UserID : UserIdArr} ,
            // attributes : [
                // id,
                // [models.sequelize.fn("count", "*"),"count"]
            // ],
            group : ['UserToFarmTable.UserID'],
        }).then( UserFarmInfo => {
            res.send(UserFarmInfo);
        })
    })
})

//id를 적어주면 그 사람이 소유한 밭번호 전송
router.get('/:id', function(req, res, next){
    UserToFarmTable.findAll({
        where: { UserID : req.params.id}
    }).then(result => {
        let farmN = [];
        for(let i=0; i<result.length; i++){
            farmN.push(result[i].FarmNum);
        }
        res.send(farmN);
    })
})

router.post('/', function(req, res, next){
    for(let i=0; i<req.body.num; i++){
        FarmTable.create({
            FarmName : i+"번 밭"
        }).then()
    }
    res.send("생성 완료");
})


module.exports = router;