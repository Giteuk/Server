var express = require('express');
var router = express.Router();
const {UserTable} = require('../models');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

//메인 페이지 - 권한 밭 개수, 밭들의 id, 밭 별명, 사용자 정보
router.get('/:id', function(req, res, next){
  UserTable.findAll({
    where : {userID : req.params.id}
  }).then( result => {
    res.send(result[0].UserName);
  })
})

module.exports = router;
