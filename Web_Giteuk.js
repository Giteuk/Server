var http = require('http');
var url = require('url');
var topic = require('./lib/Page_Giteuk');

var app = http.createServer(function(request,response){
    var url_ = request.url;
    var queryData = url.parse(url_, true).query;
    var pathData = url.parse(url_, true).pathname;


    if(pathData==='/'){
      if(queryData.id=== undefined){ 
        topic.home(request,response);//기특이는 삽질중 -목차
      }else{
        topic.page(request,response);//센서값 - querystring으로 센서별로 분리 -주기적 갱신과 함께 즉시 새로고침, db 비우기-삭제/ 사용자 정보 페이지 -query string으로 / 스트리밍 페이지 
      }
      
    }
    
    
    /*else if(pathData==='/Create'){ //사용자 정보 새로 넣기
        topic.create(request,response);
    }else if(pathData==='/create_process'){//create도 가능하도록
        topic.create_p(request,response);
    }else if(pathData==='/Update'){//업데이트 버튼으로 사용자 정보 수정
        topic.update(request,response); 
    }else if(pathData==='/update_process'){//업데이트 작업
        topic.update_p(request,response);
    }else if(pathData==='/delete_process'){//정보 추가 삭제
        topic.delete(request,response);
    } else{//잘못된 페이지 접속
      response.writeHead(404);
      response.end('Not Found');
    }*/
    });
app.listen(8080);//요청에 대해 응답할 수 있도록 http 서버를 구동  