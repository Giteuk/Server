var express = require('express');
var request = require('request');
var router = express.Router();
//var db_config = require('../secret/database.js');
//var conn = db_config.init();
//db_config.connect(conn);

//대구 기준
const options = {
  uri:"http://api.openweathermap.org/data/2.5/weather?q=Daegu&appid=0b977532e81decf779bcc5fedab20e6f&units=metric",
  json:true,
}

router.get('/', function(req, res, next) {
  request.get(options, function(err, response, body){
    if(err)
      res.send("ERROR");
    else{
      // 통신 성공 시 들어오는 곳
      /*console.log("현재온도 : "+ (body.main.temp) );
      console.log("현재습도 : "+ body.main.humidity);
      console.log("날씨 : "+ body.weather[0].main );
      console.log("상세날씨설명 : "+ body.weather[0].description );
      console.log("날씨 이미지 : "+ body.weather[0].icon );
      console.log("바람   : "+ body.wind.speed );
      console.log("나라   : "+ body.sys.country );
      console.log("도시이름  : "+ body.name );
      console.log("구름  : "+ (body.clouds.all) +"%" );  */
      let weather=body.weather[0].main;
      let weather_imgurl="http://openweathermap.org/img/w/" + body.weather[0].icon + ".png";
      
      res.json({weather,weather_imgurl});//추후 상의후 통신형식 설정 예정
    }
  })
});

module.exports = router;
