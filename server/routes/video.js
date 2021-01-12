const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");
const {Subscriber} = require("../models/Subscriber");
const mongoose = require('mongoose');


const multer = require("multer");
//파일저장을위해 npm install multer --save 설치

//=================================
//             Video
//=================================

let storage = multer.diskStorage({
    destination:(req, res, cb) =>{ //파일이 저장되는 위치
        cb(null, "uploads/");
    },
    filname:(req, file, cb)=>{ //저장되는이름을 정할수있음
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter:(req, res, cb) =>{ //파일의 형식제한
        const ext = path.extname(file.originalname)
        if(ext !== '.mp4'){
            return cb(res.status(400).end('only mp4 is allowed'), false);

        }
        cb(null, true);
    }
});
//storage 옵션을 정하여 파일을 저장할수있다.
const upload = multer({storage : storage}).single("file");


router.post("/uploadfiles", (req, res) => {

    upload(req, res, err => { //upload함수가 호출되는 순간 파일이 uploads폴더에 저장됨
                            //upload폴더에 파일이 저장된 후에, req.file을 이용하여 upload폴더내의 파일 경로를 불러올수있다.
        if (err) {
            console.log('111111111111');
            return res.json({ success: false, err })
        }
       
        return res.json({ success: true, filePath: req.file.path, fileName: req.file.filename })
            //저장된후에 req.file통해서 uploads폴더에있는 파일에 접근하여 그 정보를 res.해주는것임
    })

});



router.post("/uploadVideo", (req, res) => {
    
    const video = new Video(req.body);
    video.save((err, video) => {
        if(err) return res.status(400).json({ success: false, err })
        return res.status(200).json({
            success: true 
        })
    })
});



router.get("/getVideos", (req, res) => {
    //비디오 정보를 DB에서 가져온다.
    Video.find().populate('writer')
    .exec((err, videos)=>{//위의 쿼리를 execution(실행)시키면 , err OR videos정보가 넘어온다.
        if(err) return res.status(400).send(err);
        res.status(200).json({success:true, videos})
    }) 

    
});


router.post("/getVideoDetail", (req, res) => {
    
    Video.findOne({"_id": req.body.videoId}).populate('writer')
    .exec((err, videoDetail)=>{ //위의 쿼리를 실행시키고 그 결과를 가져옴
        if(err) return res.status(400).send(err)
        
        return res.status(200).json({success:true, videoDetail})
    })
});


// 본인이 구독해놓은 사람들의 모든 영상을 가져와야함
//본인이 구독한 사람들의 _id를 찾는다-> 그 사람이 올린 영상을 찾는다
router.post("/getSubscriptionVideos", (req, res) => {

    //자신의 아이디정보를 가지고, 자신이 구독하고있는 사람들 아이디를 찾는다.
    Subscriber.find({giveUser: req.body.giveUser}) //req.body.giveUser안에는 현재로그인중인 사람의 _id가 들어있다.
    .exec((err, subscriberInfo)=>{ //쿼리후의 결과가 subscriberInfo에 담긴다.
       
        if(err) return res.status(400).send(err);

        let subscribedUser = []; // 현재로그인한유저가 구독하고있는 유저들의 정보(_id)를 담는데에 쓰임
        subscriberInfo.map((subscriber, i)=>{
            subscribedUser.push(subscriber.receivedUser)
        })


        //찾은사람들의 비디오를 가지고 온다.
        //subscribedUser 배열 안에는 내가 구독한사람들의 _id정보들이있는데,
        //그 사람들 한명,한명이 업로드한 Video를 모두 찾아야함

        //배열안에 1명이있을지 3명이있을지 9명이있을지모른다. 고로,
        //in 메소드를 사용하면 subscribedUser배열안을 반복문처럼 접근할수있다.
        Video.find({ writer : {$in: subscribedUser}}).populate('writer')
        .exec((err, videos)=>{
            if(err) return res.status(400).send(err);
            
            res.status(200).json({success: true, videos})
        })

    })
    
  
});




module.exports = router;
