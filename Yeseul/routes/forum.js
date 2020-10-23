var express = require('express');
var router = express.Router();
const {ForumTable, CommentTable} = require('../models');

router.post('/create', function(req, res, next) {
    //글 쓰기
    // console.log(req.body.title + req.body.content);
    ForumTable.create({
      UserName: req.body.name,
      Title: req.body.title,
      Content: req.body.content,
    }).then(
      res.send("글 생성 완료")
    )
});

router.get('/', function(req, res, next) {
    //게시글 출력, title만 나와야함
    var arr = [];
    ForumTable.findAll().then(result => {
        console.log(result[0].title);
        if(result.length == 0){
            res.send("내용 없음");
        }else{
            for(var i =1; i<=result.length; i++){
                CommentTable.count( { where : { PostNum : i }} ).then(c => {
                    // console.log("THere is "+c+ "projects");
                    arr.push(c);
                    console.log(c[1]);
                })
            }
            console.log(arr);
            console.log(result.length);
            res.send(arr);
            // var result2 = new Array();
            // for(var i=0; i<result.length;i++){
            //     // result2[i].id = result[i].id;
            //     result2[i] = result[i].title;
            // }
        }
    })
});

//게시글 클릭했을 때, 상세페이지
router.get('/:id', function(req, res, next){
    ForumTable.findAll({
        where : {id : req.params.id}
    }).then(Post => {
        if(Post.length == 0)
            res.send("존재 게시물 없음");

        CommentTable.findAll({ // 댓글 전송
            where : { PostNum : req.params.id}
        }).then( Comment => {
            if(Comment.length == 0)
                console.log("존재 게시물 없음");
            // var cnt = Comment.length;
            // console.log(Comment.length);//댓글 갯수
            res.send({Post, Comment}); // 게시물, 댓글 내역 전송
        })
    })
})

// 게시글 내 댓글 쓰기
router.post('/:id', function(req, res, next){
    CommentTable.create({ 
        UserName : req.body.name,
        Content : req.body.content,
        PostNum : req.params.id
    }).then(
        res.send("댓글 생성 완료")
    )
});

//아이디별 게시글 출력
router.get('/search/:name', function(req, res, next){
    ForumTable.findAll({
        where : { userID : req.params.name}
    }).then(result=>{
        if(result.length ==0){
            res.send("게시글이 없습니다.");
        }else{
            res.send(result);
        }
    })
})

router.patch('/:id', async (req, res, next) =>{
    //게시글 업데이트
    ForumTable.update({
        title: req.body.title,
        content: req.body.content,
    }, {where: {id: req.params.id}})
    .then((result) =>{
        if(result) res.end("업데이트 성공");
        else res.end("err");
    })
    .catch((err)=>{
        console.err(err);
        next(err);
    })
})

router.delete('/:id', async(req, res, next) =>{
    ForumTable.destroy({where : {id : req.params.id}})
    .then(result => {
        if(result) res.send("삭제 성공");
        else res.send("게시글 삭제 오류");
    })
    .catch((err)=>{
        console.log(err);
        next(err);
    })
})

module.exports = router;