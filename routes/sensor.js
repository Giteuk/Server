var express = require('express');
var router = express.Router();
var db_info = require('../secret/database.js');
var mysql = require('mysql');

/*Arduino*/
router.get('/:field/:tem/:hum/:soil/:lig', function(req, res, next) {
  try{
    var sql = `INSERT INTO Capstone.SENSOR(fid,temp,humi,soil,light,date) VALUES('${req.params.field}','${req.params.tem}', '${req.params.hum}', '${req.params.soil}', '${req.params.lig}',DATE(NOW()))`;    

    let conn = mysql.createConnection(db_info);
    conn.connect();
    conn.query(sql, function (err, rows, fields) {
        if(err) { conn.end(); res.send(err);}
        else{
          conn.end();
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
router.get('/field1', function(req, res, next) {
    try{
      sendAndroid(res,1);

    }catch(err){
      res.send(err);
    }
});
/*field2*/
router.get('/field2', function(req, res, next) {
    try{
      sendAndroid(res,2);

    }catch(err){
      res.send(err);
    }
});
/*field3*/
router.get('/field3', function(req, res, next) {
    try{
      sendAndroid(res,3);
    }catch(err){
      res.send(err);
    }
});

/*send average value of 7days soil humidity sensor data + date*/
/*field1*/
router.get('/soilavg1', function(req, res, next) {
  try{
    sendAvgValue(res,1);
  }catch(err){
    res.send(err);
  }
});
/*field2*/
router.get('/soilavg2', function(req, res, next) {
  try{
    sendAvgValue(res,2);
  }catch(err){
    res.send(err);
  }
});
/*field3*/
router.get('/soilavg3', function(req, res, next) {
  try{
    sendAvgValue(res,3);
  }catch(err){
    res.send(err);
  }
});
/**/


function sendAndroid(res,fnumber){
  let sql = `SELECT temp, humi, soil, light FROM Capstone.SENSOR WHERE ID in (SELECT max(ID) FROM Capstone.SENSOR as findMAX WHERE fid=${fnumber});`;    
  let conn = mysql.createConnection(db_info);
  conn.connect();
  conn.query(sql, function (err, rows, fields) {
    
    let temp = rows[0].temp;
    let humi = rows[0].humi;
    let soil = rows[0].soil;
    let light = rows[0].light;
    let comment = `오늘 날씨는 대체적으로 ${tem(temp)}고 ${hum(humi)}하며 ${lgt(light)}. 밭이 ${sol(soil)}..^^`
    let send = {
        temp,
        humi,
        soil,
        light,
        comment
    }
    
    if(err){ conn.end(); res.send(err);}
    else{
      conn.end();
      res.send(send);
    } 
  });
}

function sendAvgValue(res,fnumber){
  let setDate =`DATE(NOW())` 
  let sql = `WITH dateTable AS(SELECT date_format(DATE_SUB(${setDate},INTERVAL 6 DAY),'%Y-%m-%d') as date UNION ALL `+
                `SELECT date_format(DATE_SUB(${setDate},INTERVAL 5 DAY),'%Y-%m-%d') as date UNION ALL `+
                `SELECT date_format(DATE_SUB(${setDate},INTERVAL 4 DAY),'%Y-%m-%d') as date UNION ALL `+
                `SELECT date_format(DATE_SUB(${setDate},INTERVAL 3 DAY),'%Y-%m-%d') as date UNION ALL `+
                `SELECT date_format(DATE_SUB(${setDate},INTERVAL 2 DAY),'%Y-%m-%d') as date UNION ALL `+
                `SELECT date_format(DATE_SUB(${setDate},INTERVAL 1 DAY),'%Y-%m-%d') as date UNION ALL `+
                `SELECT date_format(${setDate},'%Y-%m-%d') as date) `+
              `SELECT dateTable.date, IFNULL(sensorTable.soilavg,'0') as soilavg FROM dateTable LEFT JOIN (`+
              `SELECT date_format(date,'%Y-%m-%d') as date, avg(soil) as soilavg FROM Capstone.SENSOR WHERE fid=${fnumber} GROUP BY date HAVING max(date) > (SELECT DATE_SUB(${setDate},INTERVAL 7 DAY))`+
              `) as sensorTable ON dateTable.date = sensorTable.date`;      
  
    let conn = mysql.createConnection(db_info);
    conn.connect();
    conn.query(sql, function (err, rows, fields) {
      if(err) {conn.end(); res.send(err);}
      else{
        conn.end();
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
module.exports = router;
