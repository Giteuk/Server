var express = require('express');
var request = require('request');
var router = express.Router();
var fs = require('fs');
/*var PythonShell=require('python-shell');
var options={
  scriptPath: "./python",
  mode:'text',
  pythonPath:'',

};*/



router.get('/', function(req, res, next) {
    try{

      var array = fs.readFileSync('./python/four_article_result_word.txt').toString().split("\n");
      for(i in array) {
        //  console.log(array[i]);요런식으로 들고 올수 있음.
      };
      console.log('여기까지는 온다');
 
      /*PythonShell.run('FourNewsKeyword.py',options,function(err,results){
        console.log('이거 왜 무시하는것 같냐');
        if(err) throw err;

        console.log(results);
      })*/
      //result_.stdout.on('data', (result)=>{ console.log(result.toString()); });
      const spawn = require('child_process').spawn; 
      const result = spawn('python', ['./python/FourNewsKeyword.py']); 
      result.stdout.on('data', function(data) { console.log(data.toString()); }); 
      result.stderr.on('data', function(data) { console.log(data.toString()); });

      console.log('파이썬 수행함');
      res.json({});
    
    }catch(err){
      res.send(err);
    }
  });

module.exports = router;