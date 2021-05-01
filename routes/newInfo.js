var express = require('express');
var request = require('request');
var router = express.Router();
var fs = require('fs');


router.get('/', function(req, res, next) {
    try{

      var array = fs.readFileSync('./python/four_article_result_word.txt').toString().split("\n");
      for(i in array) {
         //console.log(array[i]);//요런식으로 들고 올수 있음.
      };
     
 
    
      res.json({});
    }catch(err){
      res.send(err);
    }
  });

module.exports = router;