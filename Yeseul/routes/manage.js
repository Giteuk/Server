var express = require('express');
var router = express.Router();
const {FarmTable, UserToFarmTable, KeyTable} = require('../models');

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
router.get('/allMember', function(req, res, next){
    console.log("HELLO");
    UserToFarmTable.findAll().then(result=>{
        res.send(result);
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



module.exports = router;