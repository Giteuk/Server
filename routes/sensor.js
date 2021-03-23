var express = require('express');
var router = express.Router();
var db_config = require('../secret/database.js');
var conn = db_config.init();
db_config.connect(conn);

/*Arduino*/
router.get('/:field/:tem/:hum/:soil/:lig', function(req, res, next) {
  try{
    var sql = `INSERT INTO Capstone.SENSOR(fid,temp,humi,soil,light,date) VALUES('${req.params.field}','${req.params.tem}', '${req.params.hum}', '${req.params.soil}', '${req.params.lig}',DATE(NOW()))`;    

    conn.query(sql, function (err, rows, fields) {
        if(err) res.send(err);
        else{
          res.send("센서전송");
        } 
    });
  }catch(err){
    res.send(err);
  }
});
/*Android*/
/*send common sensor data + total comment*/
/*field1*/
router.post('/field1', function(req, res, next) {
    try{
      sendAndroid(res,1);

    }catch(err){
      res.send(err);
    }
});
/*field2*/
router.post('/field2', function(req, res, next) {
    try{
      sendAndroid(res,2);

    }catch(err){
      res.send(err);
    }
});
/*field3*/
router.post('/field3', function(req, res, next) {
    try{
      sendAndroid(res,3);
    }catch(err){
      res.send(err);
    }
});

/*send average value of 7days soil humidity sensor data + date*/
/*field1*/
router.post('/soilavg1', function(req, res, next) {
  try{
    sendAvgValue(res,1);
  }catch(err){
    res.send(err);
  }
});
/*field2*/
router.post('/soilavg2', function(req, res, next) {
  try{
    sendAvgValue(res,2);
  }catch(err){
    res.send(err);
  }
});
/*field3*/
router.post('/soilavg3', function(req, res, next) {
  try{
    sendAvgValue(res,3);
  }catch(err){
    res.send(err);
  }
});

function sendAndroid(res,fnumber){
  var sql = `SELECT temp, humi, soil, light FROM Capstone.SENSOR WHERE ID in (SELECT max(ID) FROM Capstone.SENSOR as findMAX WHERE fid=${fnumber});`;    
        conn.query(sql, function (err, rows, fields) {
          
          var temp = rows[0].temp;
          var humi = rows[0].humi;
          var soil = rows[0].soil;
          var light = rows[0].light;
          var comment = `오늘 날씨는 대체적으로 ${tem(temp)}고 ${hum(humi)}하며 ${lgt(light)}. 밭이 ${sol(soil)}..^^`
          var send = {
              temp,
              humi,
              soil,
              light,
              comment
          }
          
          if(err) res.send(err);
          else{
              res.send(send);
            } 
        });
}

function sendAvgValue(res,fnumber){
  var sql = `SELECT date_format(date,'%Y-%m-%d') as date, avg(soil) as soilavg FROM Capstone.SENSOR WHERE fid=${fnumber} GROUP BY date HAVING max(date) > (SELECT DATE_SUB(DATE(NOW()),INTERVAL 7 DAY))`;      
  conn.query(sql, function (err, rows, fields) {
    
    if(err) res.send(err);
    else{
        res.send(rows);
      } 
  });
}

function tem(value){
    if (value>30)
        return "덥";
    else if (value>23)
        return "온후하";
    else if (value>15)
        return "선선하";
    else if (value>10)
        return "싸늘하";
    else
        return "춥";       
}
function hum(value){
    if (value>60)
        return "습";
    else
        return "건조";  
}
function sol(value){
    if (value>70)
        return "흠뻑 젖었네요";
    else if (value>50)
        return "촉촉하네요";
    else if (value>30)
        return "물 맛을 본 지 좀 됐네요";
    else if (value>20)
        return "버석하네요";
    else
        return "등딱지처럼 갈라졌네요.";  
}
function lgt(value){
    if (value>450)
        return "화창합니다";
    else if (value>200)
        return "구름이 조금 있습니다 ";
    else
        return "흐립니다";  
}

/**/

module.exports = router;
