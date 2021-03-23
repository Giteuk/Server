var express = require('express');
var router = express.Router();
var db_config = require('../secret/database.js');
var conn = db_config.init();
db_config.connect(conn);

/* 로그인 한 유저 정보 */
router.get('/:userId', function(req, res, next) {
  try{
    var sql = `
    SELECT u.id, u.UserId, u.UserName, u.UserName, u.UserNickName, u.UserPhoneNum, u.UserEmail, f.id as FarmId, f.FarmName as FarmName 
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
      WHERE u.UserId = '${req.params.userId}'
    `;
    conn.query(sql, function (err, result, fields) {
        if(err) res.send(err);
        else{
          if(result.length == 0) res.send("잘못된 접근입니다.");
          else{
            let userInfo = {
              farmCnt : result.length,
              farmID : [],
              farmName : [],
              UserIdent : result[0].id,
              UserName : result[0].UserName,
              UserNickName : result[0].UserNickName,
              UserPhoneNum : result[0].UserPhoneNum,
              UserEmail : result[0].UserEmail
            }
            for(let i=0; i<result.length; i++){
              userInfo.farmID.push(result[i].FarmId);
              userInfo.farmName.push(result[i].FarmName);
            }
            res.json(userInfo);
          }
        } 
    });
  }catch(err){
    res.send(err);
  }
});

module.exports = router;
