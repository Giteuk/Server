var express = require('express');
var router = express.Router();
const request = require('request');
var API = require('../secret/apiKEY.js');
//install
const convert = require('xml-js');
var fs = require('fs');


const SITE1 = `http://api.nongsaro.go.kr/service/varietyInfo/varietyList?apiKey=20210324IW0R2O5RG2EZTVL69XSV8Q`
const SITE2 = `http://ncpms.rda.go.kr/npmsAPI/service?apiKey=2021ef3c4e2a6a7d04d82eaba5d8c34d55d6&displayCount=50&startPoint=1&serviceType=AA001`
const SITE4 = `http://api.nongsaro.go.kr/service/weekFarmInfo/weekFarmInfoList?apiKey=20210324IW0R2O5RG2EZTVL69XSV8Q`

//send//
router.get(`/variety`, function(req, res, next) {
    //let cropCode=req.query.id;

    //let cropCode = getRank()[1].replace(/\r/,'')
    varietyInfo().then(ans=> {
        try{
            let value;
            value = ans
            res.send(value);
        }catch(err){
          res.send(err);
        }
    })
});
//Rank function//
function getRank()
{
  //키워드 결과 가져오기
  var keyword = fs.readFileSync('./python/four_article_result_word.txt').toString().split("\n");
  for(i in keyword) {
    //console.log(keyword[i]);//요런식으로 들고 올수 있음.
  };
  //코드 들고오기
  var cropscode=fs.readFileSync('./python/seedcode.txt').toString().split("\n");
  for(i in cropscode) {};
  //이름 들고오기
  var cropsname=fs.readFileSync('./python/seedname.txt').toString().split("\n");
  for(i in cropsname) {};
  //작물이름 순서 가져오기
  var count=[,,];
  var countnum=0;
  for(var i=0;i<keyword.length;i++){
    for(var z=0;z<cropsname.length;z++){
        if(keyword[i]===cropsname[z])
        {count[countnum++]=z;}}}
  var crolResult=[,,];
  //작물이름 있는대로 작물 코드 부여
  switch(true)
  {
      case (countnum>=3)://작물3개이상 나온경우
        crolResult[0]=cropscode[count[0]];
        crolResult[1]=cropscode[count[1]];
        crolResult[2]=cropscode[count[2]];
        break;
      case (countnum===2)://작물 2개만 나온경우
        crolResult[0]=cropscode[count[0]];
        crolResult[1]=cropscode[count[1]];
        crolResult[2]=cropscode[Math.floor(Math.random() * 27)];//난수 생성
        break;
      case (countnum===1)://작물 1개만 나온경우
        crolResult[0]=cropscode[count[0]];
        crolResult[1]=cropscode[Math.floor(Math.random() * 13)+11];//난수 생성 11~25
        crolResult[2]=cropscode[Math.floor(Math.random() * 21)+240];//난수 생성 241~261
      default://작물 0개인경우
        crolResult[0]=cropscode[Math.floor(Math.random() * 12)];//0~11
        crolResult[1]=cropscode[Math.floor(Math.random() * 13)+11];//난수 생성 11~25
        crolResult[2]=cropscode[Math.floor(Math.random() * 21)+240];//난수 생성 241~261
        break;
  }
  /*for(var o=0;o<3;o++){
    console.log(crolResult[o]);
  }*/
  return crolResult;
}
//function//
function vInfo(cropCode,category){
    return new Promise(resolves=>{
        request.get(SITE1+"&categoryCode="+category+"&sCropsCode="+cropCode, (err,res,body) =>{
            if(err){
                console.log(`err => ${err}`)
            }
            else {
                if(res.statusCode == 200){
                    let result = body
                    let xmlToJson = convert.xml2json(result, {compact: true, spaces: 4});
                    let data,i;
                    for(i=0; JSON.parse(xmlToJson).response.body.items.item[i].prdlstCtgCode['_cdata']!==cropCode ;i++);
                    data=JSON.parse(xmlToJson).response.body.items.item[i].mainChartrInfo['_cdata'];
                    resolves(data)
                }
            }
        })
    })

}
function vImage(cropCode,categoryNum){
    let serviceCode ="SVC12"
    return new Promise(resolves=>{
        request.get(SITE2+"&serviceCode="+serviceCode+"&cropSectionCode="+categoryNum, (err,res,body) =>{
            if(err){
                console.log(`err => ${err}`)
            }
            else {
                if(res.statusCode == 200){
                    let result = body
                    let xmlToJson = convert.xml2json(result, {compact: true, spaces: 4});
                    let data=[],i;
                    for(i=0; JSON.parse(xmlToJson).service.list.item[i].cropCode['_text']!==cropCode ;i++);
                    data[0]=JSON.parse(xmlToJson).service.list.item[i].cropName['_text'];
                    data[1]=JSON.parse(xmlToJson).service.list.item[i].thumbImg['_text'];
                    resolves(data)
                }
            }
        })
    })
}
function vInsect(cropName){
    let serviceCode ="SVC03"

    return new Promise(resolves=>{
        request.get(SITE2+"&serviceCode="+serviceCode+"&cropName="+encodeURI(cropName), (err,res,body) =>{
            if(err){
                console.log(`err => ${err}`)
            }
            else {
                if(res.statusCode == 200){
                    let result = body
                    let xmlToJson = convert.xml2json(result, {compact: true, spaces: 4});
                    let data=[],i;
                    for(i=0; i<Math.min(parseInt(JSON.parse(xmlToJson).service.displayCount['_text']),parseInt(JSON.parse(xmlToJson).service.totalCount['_text']));i++){
                        data[i]=JSON.parse(xmlToJson).service.list.item[i].insectKey['_text'];
                    }
                    resolves(data)
                }
            }
        })
    })
}
function vInsectDetail(KEY){
    let serviceCode ="SVC07"
    return new Promise(resolves=>{
        request.get(SITE2+"&serviceCode="+serviceCode+"&insectKey="+KEY, (err,res,body) =>{
            if(err){
                console.log(`err => ${err}`)
            }
            else {
                if(res.statusCode == 200){
                    let result = body
                    let xmlToJson = convert.xml2json(result, {compact: true, spaces: 4});
                    let data=[],i;
                    data[0]=JSON.parse(xmlToJson).service.insectSpeciesKor['_text'];
                    try{
                        data[1]=JSON.parse(xmlToJson).service.ecologyInfo['_text'];
                    }catch{
                            data[1] ="";
                    }
                    try{
                        data[2]=JSON.parse(xmlToJson).service.damageInfo['_text'];
                    }catch{
                            data[2] ="";
                    }
                    data[3]=JSON.parse(xmlToJson).service.preventMethod['_text'];
 
                    try{
                        try{
                            data[4] =JSON.parse(xmlToJson).service.imageList.item[0].imageTitle['_text'];
                            data[5] =JSON.parse(xmlToJson).service.imageList.item[0].image['_text'];
                        }catch{
                            data[4] =JSON.parse(xmlToJson).service.imageList.item.imageTitle['_text'];
                            data[5] =JSON.parse(xmlToJson).service.imageList.item.image['_text'];
                        }
                    }catch{
                            data[4] =""; data[5] ="";
                    }
                    try{
                        try{
                            data[6] =JSON.parse(xmlToJson).service.spcsPhotoData.item[0].image['_text'];
                        }catch{
                            data[6] =JSON.parse(xmlToJson).service.spcsPhotoData.item.image['_text'];
                        }
                    }catch{
                            data[6] ="";
                    }
                    resolves(data)
                }
            }
        })
    })
}
function magazineInfo(){
    return new Promise(resolves=>{
        request.get(SITE4, (err,res,body) =>{
            if(err){
                console.log(`err => ${err}`)
            }
            else {
                if(res.statusCode == 200){
                    let result = body
                    let xmlToJson = convert.xml2json(result, {compact: true, spaces: 4});
                    let data
                    data=JSON.parse(xmlToJson).response.body.items.item[0].downUrl['_cdata'];
                    resolves(data)
                }
            }
        })
    })
}
function videoInfo(cropName){
    return new Promise(resolves=>{
        if(cropName=="논벼")
            cropName="쌀"
        let optionParams={
            q: encodeURI(cropName+"레시피"),
            part: "snippet",
            key: API.GOOGLE_API_KEY,
            maxResults: 1
         };
        
        var url="https://www.googleapis.com/youtube/v3/search?";
        for(var option in optionParams){
            url+=option+"="+optionParams[option]+"&";
        }

        url=url.substr(0, url.length-1);
        request.get(url, (err,res,body) =>{
            if(err){
                console.log(`err => ${err}`)
            }
            else {
                if(res.statusCode == 200){
                    let data
                    data=JSON.parse(body).items[0].id['videoId'];
                    resolves(data)
                }
            }
        })
    })
}
function category_classification(category){
    switch(category){
        case 'FC':
            return 1;
        case 'FT':
            return 2;
        case 'VC':
            return 3;    
        case 'FL':
            return 4;
        case 'IC':
            return 5;   
    }
}
function category_kind(cropCode){
    return cropCode[0]+cropCode[1];
}
//whole
async function varietyInfo(){


    let vInfoText;
    let vInfoImage;
    let insectCode;
    let vInfoInsect;
    let download;
    let Yvideo;
    
    let cropCode = getRank()[0].replace(/\r/,'')
    
    let cropCode_nd = getRank()[1].replace(/\r/,'')
    let cropCode_rd = getRank()[2].replace(/\r/,'')
    
    let category=category_kind(cropCode)
    
    let category_nd=category_kind(cropCode_nd)
    let category_rd=category_kind(cropCode_rd)
    
    let categoryNum=category_classification(category)
    
    let categoryNum_nd=category_classification(category_nd)
    let categoryNum_rd=category_classification(category_rd)
   
    vInfoText = await vInfo(cropCode,category)//작물정보

    vInfoImage = await vImage(cropCode,categoryNum)//작물이름 , 작물 이미지
    vInfoImage_nd = await vImage(cropCode_nd,categoryNum_nd)
    vInfoImage_rd = await vImage(cropCode_rd,categoryNum_rd)

    insectCode = await vInsect(vInfoImage[0])//작물 해충종류
    let rannum=Math.floor(Math.random()*insectCode.length)//작물 해충정보
    vInfoInsect = await vInsectDetail(insectCode[rannum])//작물 해충정보 자세히

    download= await magazineInfo()//주간 농사정보 다운로드 링크

    Yvideo = await videoInfo(vInfoImage[0]);

    let resultArray = [vInfoImage[0],vInfoImage_nd[0],vInfoImage_rd[0],vInfoText,vInfoImage[1],vInfoInsect,download,Yvideo]
    return resultArray;
}


module.exports = router;