var db = require('./DB_Giteuk');
var url = require('url');
var qs = require('querystring');
var template =require('./Giteuk_template')

exports.home=function(request,response){
    db.query(`SELECT * FROM topic`,function(err, getdb){
        response.writeHead(200);
        response.end( template.html('메인 화면',
        '<br>',
        `<p>'주말 농장 관리 시스템 서버통신관리'</p>`
        ))
    });
}
exports.page=function(request,response){
    var url_ = request.url;
    var queryData = url.parse(url_, true).query;
    if(queryData.id=='sensor_state'){
    /* 센서 테이블 만들고 생각해야함
        db.query(`SELECT * FROM , author WHERE topic.id=? and author_id=author.id`,[queryData.id],function(err2,topic){
            if(err2)
            throw err2; 
            console.log(topic[0].title)
            var datalist = template.list(topics)
            response.writeHead(200);
            response.end( template.html(topic[0].title,datalist,
            `<h2>${topic[0].title}</h2>
            <p>Copyright By ${topic[0].name}</p>
            <br>
            <p>${topic[0].description}</p>`

            ,'<br>'
            
            <a href="/Update?id=${queryData.id}">Update</a><br>

            <form action="/delete_process" method="post">
                <input type="hidden" name="id" value="${queryData.id}">
                <input type="submit" value="Delete">
            </form>`))
        });         
        */
       response.writeHead(200);
       response.end('sensor_state');
    }
    else if(queryData.id=='user_data'){
        db.query(`SELECT * FROM id_table`,function(err,description){
            if(err)
                throw err; 
            
            response.writeHead(200);
            response.end( template.html(queryData.id,
            `<a href="/Create">Create</a> 
                
            <a href="/Update?id=${queryData.id}">Update</a>
        
            <a href="/delete_process?id=${queryData.id}">Delete</a><br>`
            ,
                
            `<h2>${queryData.id}</h2>
            <br>
            <p>
            <table border="1">
            ${template.list(queryData.id,description)}
            </table>
            </p>`                              
        ))
    });
    }else if(queryData.id=='streaming'){
        /*cctv 연결후
        db.query(`SELECT * FROM topic, author WHERE topic.id=? and author_id=author.id`,[queryData.id],function(err2,topic){
            if(err2)
            throw err2; 
            console.log(topic[0].title)
            var datalist = template.list(topics)
            response.writeHead(200);
            response.end( Giteuk_template.html(topic[0].title,datalist,
            `<h2>${topic[0].title}</h2>
            <p>Copyright By ${topic[0].name}</p>
            <br>
            <p>${topic[0].description}</p>`
            
            
            ,`<a href="/Create">Create</a> 
            
            <a href="/Update?id=${queryData.id}">Update</a><br>

            <form action="/delete_process" method="post">
                <input type="hidden" name="id" value="${queryData.id}">
                <input type="submit" value="Delete">
            </form>`))
      });*/
      response.writeHead(200);
      response.end('streaming');
    }
}