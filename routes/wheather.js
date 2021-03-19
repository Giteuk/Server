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
  method: 'GET',
}

router.get('/', function(req, res, next) {
  request.get(options, function(err, response, body){
    if(err)
      res.send("ERROR");
    else{
      // 통신 성공 시 들어오는 곳
      res.json(body);
    }
  })
});

module.exports = router;
