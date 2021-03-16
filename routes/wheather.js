var express = require('express');
var router = express.Router();
//var db_config = require('../secret/database.js');
//var conn = db_config.init();
var apiURI= "api.openweathermap.org/data/2.5/weather?q=Daegu&appid=0b977532e81decf779bcc5fedab20e6f&units=metric";
//대구 기준
//db_config.connect(conn);

/* GET home page. */
router.get('/', function(req, res, next) {
  try{
    console.log("이까지 왔습니다.");
    $.ajax({
      url: apiURI,
      dataType: "json",
      type: "GET",
      async: "false",
      cache: false,
      success: function(resp)
      {
          console.log(resp);
          console.log("현재온도 : "+ (resp.main.temp- 273.15) );
          console.log("현재습도 : "+ resp.main.humidity);
          console.log("날씨 : "+ resp.weasther[0].main );
          console.log("상세날씨설명 : "+ resp.weather[0].description );
          console.log("날씨 이미지 : "+ resp.weather[0].icon );
          console.log("바람   : "+ resp.wind.speed );
          console.log("나라   : "+ resp.sys.country );
          console.log("도시이름  : "+ resp.name );
          console.log("구름  : "+ (resp.clouds.all) +"%" );                 
      } 
  });
    //console.log("우");
    /*const getJSON=function(url,callback){
      const xhr=new XMLHttpRequest();
      xhr.open('GET',url,true);
      xhr.responseType='json';
      xhr.onload=function(){
        const status=xhr.status;
        if(status===200){
          callback(null,xhr.response);
        }
        else
        {
          callback(status,xhr.response);
        }
      };
      xhr.send(url);
    };
    getJSON(apiURI,function(err,data){
      if(err!== null){
        console.log("sorrty실패");
      }
      else{
        console.log(`현재 온도는 ${data.main.temp}도 입니다.`);
      }
    });*/
  }
  catch(err){
    res.send(err);
  }
});

module.exports = router;
