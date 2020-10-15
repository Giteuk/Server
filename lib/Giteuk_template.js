var db = require('./DB_Giteuk');

module.exports={
    html: function(title,control,body){
        return `
        <!doctype html>
        <html>
        <head>
          <title>기특이는 삽질중 :: ${title}</title>
          <meta charset="utf-8">
        </head>
        <body>
          <h1><a href="/">기특이는 삽질중</a></h1>
          <ul>
                <li><a href="/?id=sensor_state">센서값 관리</a></li>
                <li><a href="/?id=user_data">사용자 데이터 관리</a></li>
                <li><a href="/?id=streaming">CCTV 스트리밍</a></li>
          </ul>
          <br><br>
          ${control}
          ${body}
        </body>
        </html>
        `;
    },
    list: function (page_name,topic){
        var list= '';
        switch(page_name){
            case 'user_data':
                list +=`
                <tr>
                    <th>id</th>
                    <th>password</th>
                    <th>name</th>
                    <th>N_name</th>
                    <th>email</th>
                    <th>Pnumber</th>
                </tr>
                `
                break;
        }
            for(var i=0;i<topic.length;i++){
                list += 
                `<tr>
                    <td>${topic[i].id}</td>
                    <td>${topic[i].password}</td>
                    <td>${topic[i].name}</td>
                    <td>${topic[i].N_name}</td>
                    <td>${topic[i].email}</td>
                    <td>${topic[i].Pnumber}</td>
                </tr>
                `;
            }     
        return list;   
    }
}