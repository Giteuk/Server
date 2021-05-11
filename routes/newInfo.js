var express = require('express');
var request = require('request');
var router = express.Router();
var fs = require('fs');
//const { mountpath } = require('../app');


router.get('/', function(req, res, next) {
    try{
      var Rank=getRank();//123위의 작물코드들어가 있음
      
        res.json({});
    }catch(err){
      res.send(err);
    }
  });

//민영 1,2,3위 작물코드 List만들어서 주는 코드
function getRank()
{
  //키워드 결과 가져오기
  var keyword = fs.readFileSync('./python/four_article_result_word.txt').toString().split("\n");
  for(i in keyword) {
    //console.log(keyword[i]);//요런식으로 들고 올수 있음.
  };
  //코드 들고오기
  var cropscode=fs.readFileSync('./python/seedcode.txt').toString().split("\n");
  for(i in cropscode) {};
  //이름 들고오기
  var cropsname=fs.readFileSync('./python/seedname.txt').toString().split("\n");
  for(i in cropsname) {};
  //작물이름 순서 가져오기
  var count=[,,];
  var countnum=0;
  for(var i=0;i<keyword.length;i++){
    for(var z=0;z<cropsname.length;z++){
        if(keyword[i]===cropsname[z])
        {count[countnum++]=z;}}}
  var crolResult=[,,];
  //작물이름 있는대로 작물 코드 부여
  switch(true)
  {
      case (countnum>=3):
        crolResult[0]=cropscode[count[0]];
        crolResult[1]=cropscode[count[1]];
        crolResult[2]=cropscode[count[2]];
        break;
      case (countnum===2):
        crolResult[0]=cropscode[count[0]];
        crolResult[1]=cropscode[count[1]];
        crolResult[2]=cropscode[Math.floor(Math.random() * 27)];//난수 생성
        break;
      case (countnum===1):
        crolResult[0]=cropscode[count[0]];
        crolResult[1]=cropscode[Math.floor(Math.random() * 13)+11];//난수 생성 11~25
        crolResult[2]=cropscode[Math.floor(Math.random() * 21)+240];//난수 생성 241~261
      default:
        crolResult[0]=cropscode[Math.floor(Math.random() * 12)];//0~11
        crolResult[1]=cropscode[Math.floor(Math.random() * 13)+11];//난수 생성 11~25
        crolResult[2]=cropscode[Math.floor(Math.random() * 21)+240];//난수 생성 241~261
        break;
  }
  for(var o=0;o<3;o++){
    console.log(crolResult[o]);
  }
  return crolResult;
}

module.exports = router;