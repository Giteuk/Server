var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var cameraRouter=require('./routes/camera');
var wheatherRouter=require('./routes/wheather');
var manageRouter = require('./routes/manage');
var forumRouter = require('./routes/forum');
var sensorRouter = require('./routes/sensor')
var newInfoRouter = require('./routes/newInfo');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use('/camera',cameraRouter);
app.use('/wheather',wheatherRouter);
app.use('/newInfo',newInfoRouter);
app.use('/manage', manageRouter);
app.use('/forum', forumRouter);
app.use('/sensor', sensorRouter);
app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


 //test----------------------------------
 /*
 var schedule = require('node-schedule'); // cron style 작업 
 var j = schedule.scheduleJob('10 26 22 * * *', function(){ //매일밤 10시 26분10초에 시행
   console.log('매일밤 10시 26분10초에 시행');
   //자식 스레드 생성
   const spawn = require('child_process').spawn;
   //3사 크롤링 하는 파이썬 동작 
   const result1 = spawn('python', ['./python/FourNewsKeyword.py']); 
   result1.stdout.on('data', function(data) { console.log(data.toString()); }); 
   result1.stderr.on('data', function(data) { console.log(data.toString()); });
 });
 var m = schedule.scheduleJob('10 27 23 * * *', function(){ //매일밤 11시 27분 10초에 시행
  console.log('매일밤 11시 27분 10초에 시행');
  //자식 스레드 생성
  const spawn = require('child_process').spawn;
  //크롤링 정보 키워드 차트
  const result2 = spawn('python', ['./python/wordchart.py']); 
  result2.stdout.on('data', function(data) { console.log(data.toString()); }); 
  result2.stderr.on('data', function(data) { console.log(data.toString()); });
});
*/
 //----------------------------------------



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
